// Fly Box — user layer: the gear locker
// ---------------------------------------------------------------------------
// Your actual rods, reels, lines and the outfits you build from them. This is
// USER data, not content: content knows that a bonefish flat wants an 8-weight
// floating line, and only you know that yours is a specific rod bought in a
// specific year with a specific warranty.
//
// The reason to keep it is not inventory for its own sake. It is that two
// years from now a rod breaks or a line goes tacky and the only question that
// matters is "what exactly was this, and what did it replace?" — which is
// unanswerable from memory and trivial from a record.

export const GEAR_KINDS = [
  'rod', 'reel', 'line', 'backing', 'leader', 'tippet',
  'pack', 'wader', 'boot', 'net', 'other',
];

const newId = (p) => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export function makeGear(input = {}) {
  return {
    id: input.id ?? newId('g'),
    kind: 'gear',
    gearKind: input.gearKind ?? 'rod',

    // The three fields that make a replacement decision possible.
    brand: input.brand ?? '',
    model: input.model ?? '',
    spec: input.spec ?? '',            // "8wt 9'0\" 4pc", "WF8F", "size 7/8"

    lineWeight: input.lineWeight ?? null,   // [8, 8] or [7, 9]
    water: input.water ?? null,             // 'salt' | 'fresh' | null for both

    serial: input.serial ?? '',
    acquiredAt: input.acquiredAt ?? null,   // ISO date, or just a year string
    source: input.source ?? '',             // shop, gift, secondhand
    warrantyNote: input.warrantyNote ?? '',

    retired: input.retired ?? false,
    retiredReason: input.retiredReason ?? '',
    replacedById: input.replacedById ?? null,
    replaces: input.replaces ?? null,       // the id of what this replaced

    notes: input.notes ?? '',
    updatedAt: new Date().toISOString(),
  };
}

/** "TFO Axiom II-X — 8wt 9'0" 4pc" */
export function describeGear(g) {
  return [g.brand, g.model].filter(Boolean).join(' ') + (g.spec ? ` — ${g.spec}` : '');
}

export function shortGear(g) {
  return [g.brand, g.model].filter(Boolean).join(' ') || g.spec || 'Unnamed';
}

/**
 * Retire a piece and record what took its place, both directions. The link is
 * the whole point: in three years you want to be able to read the chain
 * backwards and see what you actually started with.
 */
export function replaceGear(oldGear, newGear, reason = '') {
  const replacement = makeGear({ ...newGear, replaces: oldGear.id });
  const retired = {
    ...oldGear,
    retired: true,
    retiredReason: reason,
    replacedById: replacement.id,
    updatedAt: new Date().toISOString(),
  };
  return { retired, replacement };
}

// ---------------------------------------------------------------------------
// Setups — a named outfit
// ---------------------------------------------------------------------------
// "Bahamas 8wt" is a rod plus a reel plus a line plus backing. Naming it once
// means a session can record which outfit was actually in your hand, which is
// the difference between "the 8-weight" and a line you can look up.

export function makeSetup(input = {}) {
  return {
    id: input.id ?? newId('su'),
    kind: 'setup',
    name: input.name ?? 'Untitled setup',
    rodId: input.rodId ?? null,
    reelId: input.reelId ?? null,
    lineId: input.lineId ?? null,
    backingId: input.backingId ?? null,
    water: input.water ?? null,
    notes: input.notes ?? '',
    lastUsedAt: input.lastUsedAt ?? null,
    useCount: input.useCount ?? 0,
    updatedAt: new Date().toISOString(),
  };
}

export function describeSetup(setup, gearById) {
  const part = (id) => (id && gearById[id] ? shortGear(gearById[id]) : null);
  return [part(setup.rodId), part(setup.reelId), part(setup.lineId)]
    .filter(Boolean)
    .join(' · ');
}

// ---------------------------------------------------------------------------
// Store helpers
// ---------------------------------------------------------------------------

export function createLocker(store) {
  return {
    async all({ includeRetired = false } = {}) {
      const rows = await store.gear.all();
      return rows
        .filter((g) => includeRetired || !g.retired)
        .sort((a, b) =>
          GEAR_KINDS.indexOf(a.gearKind) - GEAR_KINDS.indexOf(b.gearKind) ||
          shortGear(a).localeCompare(shortGear(b)));
    },

    async byKind(gearKind, { includeRetired = false } = {}) {
      return (await this.all({ includeRetired })).filter((g) => g.gearKind === gearKind);
    },

    async save(input) {
      const g = makeGear(input);
      await store.gear.put(g);
      return g;
    },

    async update(id, patch) {
      const existing = await store.gear.get(id);
      if (!existing) throw new Error(`no gear "${id}"`);
      const next = { ...existing, ...patch, updatedAt: new Date().toISOString() };
      await store.gear.put(next);
      return next;
    },

    async replace(oldId, newInput, reason) {
      const oldGear = await store.gear.get(oldId);
      if (!oldGear) throw new Error(`no gear "${oldId}"`);
      const { retired, replacement } = replaceGear(oldGear, newInput, reason);
      await store.gear.put(replacement);
      await store.gear.put(retired);
      return { retired, replacement };
    },

    /** The chain, oldest first — what you started with, and everything since. */
    async lineage(id) {
      const all = await store.gear.all();
      const byId = Object.fromEntries(all.map((g) => [g.id, g]));
      let head = byId[id];
      while (head?.replaces && byId[head.replaces]) head = byId[head.replaces];
      const chain = [];
      let cursor = head;
      while (cursor) {
        chain.push(cursor);
        cursor = cursor.replacedById ? byId[cursor.replacedById] : null;
      }
      return chain;
    },

    async setups() {
      const rows = await store.setups.all();
      return rows.sort((a, b) =>
        (b.useCount - a.useCount) || (b.lastUsedAt ?? '').localeCompare(a.lastUsedAt ?? ''));
    },

    async saveSetup(input) {
      const s = makeSetup(input);
      await store.setups.put(s);
      return s;
    },

    async useSetup(id, at = new Date().toISOString()) {
      const s = await store.setups.get(id);
      if (!s) return null;
      s.useCount += 1;
      s.lastUsedAt = at;
      await store.setups.put(s);
      return s;
    },

    async gearById() {
      const rows = await store.gear.all();
      return Object.fromEntries(rows.map((g) => [g.id, g]));
    },
  };
}
