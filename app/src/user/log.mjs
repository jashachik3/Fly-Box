// Fly Box — user layer: the log API
// ---------------------------------------------------------------------------
// Everything the Log tab calls. Deliberately small: the on-water surface is
// start a session, switch a rig, add a fish, end the session. Four verbs.

import {
  makeSession, makeCatch, makePreset, startStint, endSession,
  validateSession, validateCatch, blurGps,
} from './log-schema.mjs';
import { backupStatus, markExported } from './store.mjs';

export function createLog(store) {
  return {
    // -- sessions ---------------------------------------------------------

    /**
     * Start fishing. `recommended` is what the app was suggesting at this
     * moment — the brief's slate, or the field key's answer. Record it BEFORE
     * the first cast; it cannot be reconstructed afterwards, and without it
     * "I went off script" is invisible forever.
     */
    async start({ regionId, waterId, conditions, recommended = [], gps, blurLocation = true, placeNote, startedAt } = {}) {
      const open = await this.current();
      if (open) await this.end();

      const session = makeSession({
        // Backdating is a real need: you write up Saturday on Sunday morning.
        startedAt,
        regionId,
        waterId,
        placeNote,
        conditions,
        recommended,
        gps: gps ? (blurLocation ? blurGps(gps) : { ...gps, blurred: false }) : null,
        needsEnrichment: !conditions?.flowCfs && !conditions?.tide,
      });

      await store.sessions.put(session);
      return session;
    },

    async current() {
      const open = await store.sessions.where((s) => !s.endedAt);
      return open.sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0] ?? null;
    },

    async end(at) {
      const session = await this.current();
      if (!session) return null;
      endSession(session, at);
      await store.sessions.put(session);
      return session;
    },

    // -- rigs -------------------------------------------------------------

    /**
     * Put a rig on. Closes the previous stint, so hours land in exactly one
     * bucket. Pass a preset id for the three-tap path.
     */
    async useRig({ presetId, rigId, flies, setupId, at } = {}) {
      const session = await this.current();
      if (!session) throw new Error('start a session before putting a rig on');

      let resolvedRig = rigId;
      let resolvedFlies = flies;
      let resolvedSetup = setupId ?? null;

      if (presetId) {
        const preset = await store.presets.get(presetId);
        if (!preset) throw new Error(`no preset "${presetId}"`);
        resolvedRig = preset.rigId;
        resolvedFlies = preset.flies;
        resolvedSetup = setupId ?? preset.setupId ?? null;
        preset.lastUsedAt = at ?? new Date().toISOString();
        preset.useCount += 1;
        await store.presets.put(preset);
      }

      const stint = startStint(session, { rigId: resolvedRig, flies: resolvedFlies, setupId: resolvedSetup, at });
      await store.sessions.put(session);
      return stint;
    },

    /** Change one fly without ending the stint — a dropper swap, not a rig change. */
    async swapFly({ role, flyId, size } = {}) {
      const session = await this.current();
      const stint = session?.stints.find((s) => !s.endedAt);
      if (!stint) throw new Error('no open stint');
      const slot = stint.flies.find((f) => f.role === role);
      if (slot) Object.assign(slot, { flyId, size: size ?? slot.size });
      else stint.flies.push({ role, flyId, size: size ?? null });
      await store.sessions.put(session);
      return stint;
    },

    // -- fish -------------------------------------------------------------

    /** Three taps: species, length, which fly ate. */
    async addCatch({ speciesId, lengthIn, ateFlyId, ...rest } = {}) {
      const session = await this.current();
      if (!session) throw new Error('start a session before logging a fish');

      const c = makeCatch(session, { speciesId, lengthIn, ateFlyId, ...rest });
      const problems = validateCatch(c, session);
      if (problems.length) throw new Error(problems.join('; '));

      await store.catches.put(c);
      return c;
    },

    // -- presets ----------------------------------------------------------

    async savePreset(input) {
      const preset = makePreset(input);
      await store.presets.put(preset);
      return preset;
    },

    /** Most-used first — the on-water ordering, so the common rig is one tap. */
    async presets() {
      const all = await store.presets.all();
      return all.sort((a, b) =>
        (b.useCount - a.useCount) || (b.lastUsedAt ?? '').localeCompare(a.lastUsedAt ?? ''));
    },

    // -- reading back -----------------------------------------------------

    async sessionWithCatches(sessionId) {
      const session = await store.sessions.get(sessionId);
      if (!session) return null;
      const catches = await store.catches.where((c) => c.sessionId === sessionId);
      return { session, catches: catches.sort((a, b) => a.at.localeCompare(b.at)) };
    },

    async history({ limit = 50 } = {}) {
      const sessions = (await store.sessions.all())
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
        .slice(0, limit);
      const catches = await store.catches.all();
      return sessions.map((s) => ({
        session: s,
        catches: catches.filter((c) => c.sessionId === s.id),
      }));
    },

    async check() {
      const sessions = await store.sessions.all();
      const catches = await store.catches.all();
      const problems = [];
      for (const s of sessions) problems.push(...validateSession(s));
      for (const c of catches) {
        problems.push(...validateCatch(c, sessions.find((s) => s.id === c.sessionId)));
      }
      return problems;
    },

    // -- enrichment -------------------------------------------------------

    /**
     * Fill in conditions that could not be fetched on the water. `fetcher` is
     * injected so this module never knows about NOAA or USGS — that belongs in
     * phase 6, and the log should not have to change when it lands.
     */
    async enrich(fetcher) {
      const pending = await store.sessions.where((s) => s.needsEnrichment);
      const done = [];
      for (const s of pending) {
        try {
          const extra = await fetcher(s);
          if (!extra) continue;
          s.conditions = { ...s.conditions, ...extra };
          s.needsEnrichment = false;
          await store.sessions.put(s);
          done.push(s.id);
        } catch {
          // Leave it pending. A failed fetch is not a reason to lose a session.
        }
      }
      return done;
    },

    // -- backup -----------------------------------------------------------

    backupStatus: () => backupStatus(store),
    markExported: (at) => markExported(store, at),
  };
}

// ---------------------------------------------------------------------------
// Off-script detection
// ---------------------------------------------------------------------------
// Decision made 2026-09-14: when your log disagrees with the recommended slate,
// show both. This is the primitive that makes that possible — it answers "was
// this fish caught on something the app suggested, or on something you chose
// instead?" for every single catch.

export function offScript(catchRec, session) {
  const recommended = new Set((session.recommended ?? []).map((r) => r.flyId));
  if (!recommended.size) return null;          // nothing was suggested — not a judgement
  return !recommended.has(catchRec.ateFlyId);
}

export function scriptSplit(entries) {
  let on = 0, off = 0, unscored = 0;
  for (const { session, catches } of entries) {
    for (const c of catches) {
      const v = offScript(c, session);
      if (v === null) unscored += 1;
      else if (v) off += 1;
      else on += 1;
    }
  }
  return { onScript: on, offScript: off, unscored };
}
