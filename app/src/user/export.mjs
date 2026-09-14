// Fly Box — user layer: export, import, migration
// ---------------------------------------------------------------------------
// The browser holds the only copy of the log, and browsers evict storage.
// Export is not a nice-to-have on a private PWA with no account; it is the
// only thing standing between a season of data and nothing.

import { USER_SCHEMA_VERSION } from './log-schema.mjs';
import { markExported } from './store.mjs';

export const EXPORT_FORMAT = 'flybox-log';

export async function exportAll(store, { markAsBackedUp = true } = {}) {
  const snap = await store.snapshot();
  const payload = {
    format: EXPORT_FORMAT,
    schemaVersion: USER_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    counts: Object.fromEntries(Object.entries(snap).map(([k, v]) => [k, v.length])),
    ...snap,
  };
  if (markAsBackedUp) await markExported(store, payload.exportedAt);
  return payload;
}

export function toJson(payload) {
  return JSON.stringify(payload, null, 2);
}

/** Filename that sorts chronologically and says what it is at a glance. */
export function exportFilename(at = new Date()) {
  const d = at.toISOString().slice(0, 10);
  return `flybox-log-${d}.json`;
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

export async function importAll(store, payload, { mode = 'merge' } = {}) {
  if (payload?.format !== EXPORT_FORMAT) {
    throw new Error('that file is not a Fly Box log export');
  }

  const data = migrate(payload);

  if (mode === 'replace') {
    for (const c of ['sessions', 'catches', 'presets', 'review', 'box', 'gear', 'setups']) await store[c].clear();
  }

  const result = { sessions: 0, catches: 0, presets: 0, review: 0, box: 0, gear: 0, setups: 0, skipped: 0 };

  for (const key of ['sessions', 'catches', 'presets', 'review', 'box', 'gear', 'setups']) {
    for (const rec of data[key] ?? []) {
      if (mode === 'merge') {
        const existing = await store[key].get(rec.id);
        // Same id, different content: keep what is on the device. An import
        // should never silently overwrite a session you edited since.
        if (existing) { result.skipped += 1; continue; }
      }
      await store[key].put(rec);
      result[key] += 1;
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------
// User data migrates on its own schedule, independent of content versions.
// Add a step per version bump; each one takes the whole payload and returns it
// one version newer. Never mutate the caller's object.

const MIGRATIONS = {
  // 0 -> 1: the first shipped shape. Kept as a worked example of the contract.
  0: (data) => ({
    ...data,
    schemaVersion: 1,
    sessions: (data.sessions ?? []).map((s) => ({ ...s, stints: s.stints ?? [], recommended: s.recommended ?? [] })),
    catches: (data.catches ?? []).map((c) => ({ ...c, fliesOnRig: c.fliesOnRig ?? [] })),
    box: data.box ?? [],
    gear: data.gear ?? [],
    setups: data.setups ?? [],
  }),
};

export function migrate(payload) {
  let data = structuredClone(payload);
  let v = data.schemaVersion ?? 0;

  while (v < USER_SCHEMA_VERSION) {
    const step = MIGRATIONS[v];
    if (!step) throw new Error(`no migration from user schema v${v} to v${v + 1}`);
    data = step(data);
    v = data.schemaVersion;
  }

  if (v > USER_SCHEMA_VERSION) {
    throw new Error(
      `that export is from a newer version of Fly Box (v${v}); update the app before importing`,
    );
  }

  return data;
}
