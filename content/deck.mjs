// Fly Box — deck resolution
// ---------------------------------------------------------------------------
// A deck is a saved question over the concept list. This file answers it.
//
// The whole design rests on one rule, the same one the match facets use:
//
//     an absent axis is not a constraint, on EITHER side.
//
// A deck that does not name months does not care what month it is. A knot,
// which has no month, is never excluded by a deck that does name months. Both
// halves of that matter: without the first, every deck has to enumerate every
// axis; without the second, "Bahamas, October" quietly drops the loop knot you
// need to tie when you get there.
//
// Zero dependencies — build.mjs runs this at build time and writes the answer
// into the bundle, so the phone never runs a filter at all.

const set = (xs) => (xs && xs.length ? new Set(xs) : null);
const index = (rows) => Object.fromEntries(rows.map((r) => [r.id, r]));

/** Null is "unconstrained" and swallows everything it touches. */
const unionOrNull = (sets) => {
  if (!sets.length) return null;
  const out = new Set();
  for (const s of sets) {
    if (s == null) return null;
    for (const v of s) out.add(v);
  }
  return out.size ? out : null;
};

/** Union of what we DO know; null only when nothing is known on this axis. */
const unionLoose = (sets) => {
  const out = new Set();
  for (const s of sets) if (s) for (const v of s) out.add(v);
  return out.size ? out : null;
};

const intersects = (a, b) => {
  for (const v of b) if (a.has(v)) return true;
  return false;
};

const only = (values) => {
  const uniq = [...new Set(values.filter(Boolean))];
  return uniq.length === 1 ? uniq[0] : null;
};

// ---------------------------------------------------------------------------

export function deckResolver(tables) {
  const organisms = index(tables.organisms);
  const flies = index(tables.flies);
  const matches = index(tables.matches);
  const rigs = index(tables.rigs);
  const knots = index(tables.knots);
  const retrieves = index(tables.retrieves);
  const presence = index(tables.presence);

  // -- reverse indexes ------------------------------------------------------

  const push = (obj, k, v) => { if (k) (obj[k] ??= []).push(v); };

  const matchesByFly = {};
  const matchesByOrganism = {};
  const matchesByOrganismStage = {};
  for (const m of tables.matches) {
    push(matchesByFly, m.fly, m);
    push(matchesByOrganism, m.organism, m);
    push(matchesByOrganismStage, `${m.organism}.${m.stage}`, m);
  }

  const presenceByOrganism = {};
  for (const p of tables.presence) push(presenceByOrganism, p.organism, p);

  const speciesByOrganism = {};
  const speciesByRig = {};
  for (const sp of tables.species) {
    for (const o of sp.eats ?? []) push(speciesByOrganism, o, sp);
    for (const r of sp.rigs ?? []) push(speciesByRig, r, sp);
  }

  const fliesByRetrieve = {};
  const fliesByKnot = {};
  for (const fl of tables.flies) {
    push(fliesByRetrieve, fl.retrieve, fl);
    push(fliesByKnot, fl.defaultKnot, fl);
  }

  const rigsByKnot = {};
  for (const r of tables.rigs) push(rigsByKnot, r.knot, r);

  // -- per-organism rollups -------------------------------------------------

  const organismRegions = (id) => set((presenceByOrganism[id] ?? []).map((p) => p.region));
  const organismMonths = (id) =>
    set([...new Set((presenceByOrganism[id] ?? []).flatMap((p) => p.months ?? []))]);
  const organismSpecies = (id) => set((speciesByOrganism[id] ?? []).map((s) => s.id));

  // -- the reach of one match rule -----------------------------------------
  // A match is the richest concept: it knows its own regions, species, water
  // types and season, and falls back to the organism's presence when it does
  // not say.

  const matchReach = (m) => {
    const fc = m.facets ?? {};
    const org = organisms[m.organism];
    const fly = flies[m.fly];
    return {
      water: org?.water ?? fly?.water ?? null,
      regions: set(fc.regions) ?? organismRegions(m.organism),
      species: set(fc.species) ?? organismSpecies(m.organism),
      waterTypes: set(fc.waterTypes),
      months: set(fc.months) ?? organismMonths(m.organism),
      organisms: set([m.organism]),
      organismKinds: set([org?.kind]),
      flies: set([m.fly]),
      families: set([fly?.family]),
      retrieves: set([m.retrieve ?? fly?.retrieve]),
      knots: set([fly?.defaultKnot]),
      rigs: set(m.rigs),
    };
  };

  const rollup = (ms, extra = {}) => {
    const reaches = ms.map(matchReach);
    const axis = (k) => unionOrNull(reaches.map((r) => r[k]));
    return {
      water: only(reaches.map((r) => r.water)),
      regions: axis('regions'),
      species: axis('species'),
      waterTypes: axis('waterTypes'),
      months: axis('months'),
      organisms: axis('organisms'),
      organismKinds: axis('organismKinds'),
      flies: axis('flies'),
      families: axis('families'),
      retrieves: axis('retrieves'),
      knots: axis('knots'),
      rigs: axis('rigs'),
      ...extra,
    };
  };

  // -- the reach of any concept --------------------------------------------

  function reachOf(concept) {
    const r = concept.refs ?? {};

    switch (concept.kind) {
      case 'match':
        return matchReach(matches[r.match] ?? { organism: r.organism, stage: r.stage, fly: r.fly });

      case 'organism-stage': {
        const org = organisms[r.organism];
        const ms = matchesByOrganismStage[`${r.organism}.${r.stage}`] ?? [];
        const rolled = rollup(ms);
        return {
          ...rolled,
          water: org?.water ?? null,
          // A bug belongs where the calendar says it is AND where a match rule
          // says to fish it. Presence rows land region by region, so relying on
          // them alone quietly empties a deck for a place that is half-written.
          regions: unionLoose([organismRegions(r.organism), rolled.regions]),
          months: organismMonths(r.organism),
          species: organismSpecies(r.organism),
          organisms: set([r.organism]),
          organismKinds: set([org?.kind]),
        };
      }

      case 'fly': {
        const fly = flies[r.fly];
        return {
          ...rollup(matchesByFly[r.fly] ?? []),
          water: fly?.water ?? null,
          flies: set([r.fly]),
          families: set([fly?.family]),
          retrieves: set([fly?.retrieve]),
          knots: set([fly?.defaultKnot]),
        };
      }

      // A knot is not a place and not a season. It answers only to water, and
      // to a deck that names it, the rigs it builds, or the flies it ties on.
      case 'knot': {
        const k = knots[r.knot];
        return {
          water: k?.water ?? null,
          regions: null, species: null, waterTypes: null, months: null,
          organisms: null, organismKinds: null, families: null, retrieves: null,
          knots: set([r.knot]),
          rigs: set((rigsByKnot[r.knot] ?? []).map((x) => x.id)),
          flies: set((fliesByKnot[r.knot] ?? []).map((x) => x.id)),
        };
      }

      case 'rig': {
        const rig = rigs[r.rig];
        const sp = speciesByRig[r.rig] ?? [];
        return {
          water: rig?.water ?? null,
          regions: set([...new Set(sp.flatMap((s) => s.regions ?? []))]),
          species: set(sp.map((s) => s.id)),
          waterTypes: null, months: null,
          organisms: null, organismKinds: null, families: null,
          retrieves: null,
          knots: set([rig?.knot]),
          rigs: set([r.rig]),
          flies: null,
        };
      }

      case 'retrieve': {
        const used = fliesByRetrieve[r.retrieve] ?? [];
        const ms = used.flatMap((fl) => matchesByFly[fl.id] ?? []);
        return {
          ...rollup(ms),
          water: only(used.map((fl) => fl.water)),
          retrieves: set([r.retrieve]),
          flies: set(used.map((fl) => fl.id)),
        };
      }

      case 'presence': {
        const p = presence[r.presence];
        if (!p) return {};
        const org = organisms[p.organism];
        const ms = (matchesByOrganism[p.organism] ?? [])
          .filter((m) => (p.stages ?? []).includes(m.stage));
        return {
          ...rollup(ms),
          water: org?.water ?? null,
          regions: set([p.region]),
          months: set(p.months),
          organisms: set([p.organism]),
          organismKinds: set([org?.kind]),
          species: organismSpecies(p.organism),
        };
      }

      default:
        return {};
    }
  }

  // -- the test -------------------------------------------------------------

  const AXES = [
    'regions', 'species', 'waterTypes', 'months', 'organismKinds',
    'organisms', 'flies', 'families', 'knots', 'rigs', 'retrieves',
  ];

  /** Build the predicate one deck filter describes. */
  function predicate(filter = {}) {
    return (concept) => {
      if (filter.kinds?.length && !filter.kinds.includes(concept.kind)) return false;

      const reach = reachOf(concept);
      // 'both' means exactly that — it is not a third water to filter on.
      if (filter.water && reach.water && reach.water !== 'both' && reach.water !== filter.water) return false;

      for (const axis of AXES) {
        const want = filter[axis];
        if (!want?.length) continue;          // deck does not care
        const have = reach[axis];
        if (have == null) continue;           // concept has no such axis
        if (!intersects(have, want)) return false;
      }
      return true;
    };
  }

  /** Concept ids a deck contains, in the order the concept list came in. */
  const resolve = (deck, concepts) => concepts.filter(predicate(deck.filter)).map((c) => c.id);

  return { reachOf, predicate, resolve };
}
