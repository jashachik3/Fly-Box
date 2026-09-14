// Fly Box — content queries
// ---------------------------------------------------------------------------
// Pure functions over a built bundle. No React, no storage, no I/O — so the
// same code answers the trip brief, the field key, and the quiz generator, and
// can be run from a script to prove it (see content/query-demo.mjs).
//
// The governing rule: a facet a rule does not declare is a facet it does not
// care about. Absent means "applies regardless" — a real answer, not a gap.

export const RANK = { 'first-choice': 0, 'change-up': 1, situational: 2 };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const monthName = (m) => MONTHS[m - 1] ?? String(m);

const inList = (list, v) => v == null || !list || list.includes(v);
const inRange = (range, v) => v == null || !range || (v >= range[0] && v <= range[1]);

export function applies(match, q = {}) {
  const f = match.facets ?? {};
  return (
    inList(f.regions, q.region) &&
    inList(f.months, q.month) &&
    inList(f.species, q.species) &&
    inList(f.waterTypes, q.waterType) &&
    inList(f.timeOfDay, q.timeOfDay) &&
    inList(f.light, q.light) &&
    inList(f.tide, q.tide) &&
    inList(f.wind, q.wind) &&
    inRange(f.tempBandF, q.tempF) &&
    inRange(f.depthIn, q.depthIn)
  );
}

/** Tie-breaker only: a rule naming your exact conditions beats one naming none. */
export const specificity = (m) => Object.values(m.facets ?? {}).filter(Boolean).length;

// ---------------------------------------------------------------------------
// Retrieve
// ---------------------------------------------------------------------------
// A match may override the fly's default, because the same crab is fished one
// way at a tailing bonefish and another at a permit that has already seen it.

export function retrieveFor(bundle, match) {
  const id = match?.retrieve ?? bundle.byId.flies[match?.fly]?.retrieve;
  return id ? bundle.byId.retrieves[id] ?? null : null;
}

export function retrieveForFly(bundle, flyId) {
  const id = bundle.byId.flies[flyId]?.retrieve;
  return id ? bundle.byId.retrieves[id] ?? null : null;
}

const EAT_WORDS = {
  'on-the-pause': 'eaten on the pause',
  'during-the-strip': 'eaten mid-strip',
  'on-the-drop': 'eaten on the drop',
  'on-the-drift': 'eaten on the drift',
  'on-the-lift': 'eaten on the lift',
};

/** "2–6 in · fast · 1–3 s still · eaten on the pause" — the whole retrieve in a line. */
export function retrieveLine(r) {
  if (!r) return null;
  const bits = [];
  if (r.stripLengthIn && r.stripLengthIn[1] > 0) bits.push(`${r.stripLengthIn[0]}–${r.stripLengthIn[1]} in`);
  else bits.push('no strip');
  bits.push(r.speed);
  if (r.pauseSec && r.pauseSec[1] > 0) bits.push(`${r.pauseSec[0]}–${r.pauseSec[1]} s still`);
  bits.push(EAT_WORDS[r.eatTiming] ?? r.eatTiming);
  return bits.join(' · ');
}

export const setWord = (r) => (r?.setType ?? '').replace(/-/g, ' ');

// ---------------------------------------------------------------------------
// Reading 1 — a trip brief's fly slate
// ---------------------------------------------------------------------------

export function slate(bundle, q = {}) {
  const present = bundle.tables.presence.filter(
    (p) => (!q.region || p.region === q.region) && (q.month == null || p.months.includes(q.month)),
  );
  const available = new Set(present.map((p) => p.organism));

  // A rule that names species but no regions would otherwise surface wherever
  // its organism lives — which is how a tarpon fly and an 11-weight ended up
  // on a Bahamas bonefish brief. Content carries the region facets now; this
  // is the belt to that pair of braces, because it cannot be forgotten.
  const fitsRegion = (m) => {
    if (!q.region) return true;
    const named = m.facets?.species;
    if (!named?.length) return true;
    return named.some((id) => bundle.byId.species[id]?.regions?.includes(q.region));
  };

  return bundle.tables.matches
    .filter((m) => (q.region ? available.has(m.organism) : true) && fitsRegion(m) && applies(m, q))
    .sort((a, b) => RANK[a.strength] - RANK[b.strength] || specificity(b) - specificity(a));
}

/** What is around, this month, here — the hatch chart, generalised. */
export function whatsOn(bundle, { region, month } = {}) {
  return bundle.tables.presence
    .filter((p) => (!region || p.region === region) && (month == null || p.months.includes(month)))
    .sort((a, b) => ['peak', 'present', 'sparse'].indexOf(a.abundance) - ['peak', 'present', 'sparse'].indexOf(b.abundance));
}

// ---------------------------------------------------------------------------
// Reading 2 — field ID, asked backwards
// ---------------------------------------------------------------------------

export function identify(bundle, organism, stage, q = {}) {
  return (bundle.index.matchesByOrganismStage[`${organism}.${stage}`] ?? [])
    .map((id) => bundle.byId.matches[id])
    .filter(Boolean)
    .filter((m) => applies(m, q))
    .sort((a, b) => RANK[a.strength] - RANK[b.strength]);
}

/** Narrow by what you can actually see on the bank, one axis at a time. */
export function keyCandidates(bundle, { water, kind, hookSize, color } = {}) {
  const out = [];
  for (const org of bundle.tables.organisms) {
    if (water && org.water !== water) continue;
    if (kind && org.kind !== kind) continue;
    for (const st of org.stages ?? []) {
      if (hookSize != null && st.hookSizes && !(hookSize >= st.hookSizes[0] && hookSize <= st.hookSizes[1])) continue;
      if (color && st.colors && !st.colors.some((c) => c.includes(color))) continue;
      out.push({ organism: org, stage: st });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Reading 3 — generated judgment cards
// ---------------------------------------------------------------------------
// The question text is composed on the fly; the card reports the CONCEPT ID it
// is testing. Review state attaches to that, so one fact can be asked a hundred
// ways and still sit on one schedule.

export function scenarioCard(bundle, match) {
  const f = match.facets ?? {};
  const org = bundle.byId.organisms[match.organism];
  const stage = org?.stages?.find((s) => s.stage === match.stage);

  const bits = [];
  if (f.regions?.length) bits.push(bundle.byId.regions[f.regions[0]]?.name ?? f.regions[0]);
  if (f.months?.length) bits.push(monthName(f.months[0]));
  if (f.waterTypes?.length) bits.push(f.waterTypes[0]);
  if (f.tide?.length) bits.push(`${f.tide[0]} tide`);
  if (f.light?.length) bits.push(`${f.light[0]} light`);
  if (f.timeOfDay?.length) bits.push(f.timeOfDay[0]);
  if (f.tempBandF) bits.push(`${f.tempBandF[0]}–${f.tempBandF[1]}°F`);
  if (f.depthIn) bits.push(`${f.depthIn[0]}–${f.depthIn[1]} in of water`);
  if (f.wind?.length) bits.push(`${f.wind[0]} wind`);

  const r = retrieveFor(bundle, match);

  return {
    concept: `match:${match.organism}.${match.stage}>${match.fly}`,
    kind: 'scenario',
    retrieve: r,
    // The scenario IS the question, so no picture up front — but the answer
    // should show you the fly you were supposed to name.
    answerImage: bundle.byId.flies[match.fly]?.image ?? null,
    conditions: bits,
    seeing: stage?.behavior
      ? `${org.name} — ${match.stage}. ${stage.behavior}`
      : `${org?.name ?? match.organism}, ${match.stage}`,
    question: 'What do you tie on?',
    answer: bundle.byId.flies[match.fly]?.name ?? match.fly,
    size: match.hookSizes ? `#${match.hookSizes[0]}–${match.hookSizes[1]}` : null,
    because: match.presentation ?? '',
    rigs: (match.rigs ?? []).map((x) => bundle.byId.rigs[x]?.name ?? x),
  };
}

// ---------------------------------------------------------------------------
// Card rendering by concept kind
// ---------------------------------------------------------------------------
// One concept, several possible dressings. Which one you get is deliberately
// varied — recognising a fly photo and knowing when to fish it are the same
// fact at different tiers, and alternating them is what moves recognition
// toward judgment.

export function renderCard(bundle, concept, { variant } = {}) {
  const pick = (n) => (variant ?? Math.floor(Math.random() * n)) % n;

  if (concept.kind === 'match') {
    const match = bundle.byId.matches[concept.refs.match];
    if (!match) return null;

    const org = bundle.byId.organisms[match.organism];
    const fly = bundle.byId.flies[match.fly];
    const stage = org?.stages?.find((x) => x.stage === match.stage);
    const r = retrieveFor(bundle, match);

    // Three dressings of one fact, rotated: the applied scenario, the plain
    // match, and — because knowing the fly is only half of it — how to make
    // that fly behave.
    const variantIndex = pick(r ? 3 : 2);

    if (variantIndex === 0) return scenarioCard(bundle, match);

    if (variantIndex === 2 && r) {
      return {
        concept: concept.id,
        kind: 'match-retrieve',
        retrieve: r,
        image: fly?.image ?? null,
        conditions: [org?.name ?? match.organism, match.stage],
        seeing: `${fly?.name ?? match.fly} is on the leader.`,
        question: 'How do you fish it?',
        answer: r.name,
        size: retrieveLine(r),
        because: r.cue ?? '',
        rigs: [],
      };
    }

    return {
      concept: concept.id,
      kind: 'match',
      retrieve: r,
      // Identify the natural, then see the fly that imitates it. That pairing
      // is the whole lesson, and it only really lands as two pictures.
      image: stage?.image ?? org?.image ?? null,
      answerImage: fly?.image ?? null,
      conditions: [],
      seeing: `${org?.name ?? match.organism} — ${match.stage}`,
      question: 'Which fly imitates this?',
      answer: fly?.name ?? match.fly,
      size: match.hookSizes ? `#${match.hookSizes[0]}–${match.hookSizes[1]}` : null,
      because: match.notes ?? match.presentation ?? '',
      rigs: [],
    };
  }

  if (concept.kind === 'organism-stage') {
    const org = bundle.byId.organisms[concept.refs.organism];
    const st = org?.stages?.find((s) => s.stage === concept.refs.stage);
    if (!org || !st) return null;
    return {
      concept: concept.id,
      kind: 'organism-stage',
      conditions: [st.where, st.colors?.slice(0, 3).join(', ')].filter(Boolean),
      seeing: st.behavior ?? '',
      question: `What is this, and what stage?`,
      answer: `${org.name} — ${st.stage}`,
      size: st.hookSizes ? `#${st.hookSizes[0]}–${st.hookSizes[1]}` : null,
      because: org.notes ?? '',
      image: st.image ?? org.image ?? null,
      rigs: [],
    };
  }

  if (concept.kind === 'fly') {
    const fly = bundle.byId.flies[concept.refs.fly];
    if (!fly) return null;
    return {
      concept: concept.id,
      kind: 'fly',
      conditions: [fly.water, fly.weight].filter(Boolean),
      seeing: fly.name,
      question: 'What does it imitate, and when do you reach for it?',
      answer: fly.tiedFor ?? '—',
      size: fly.hookSizes ? `#${fly.hookSizes[0]}–${fly.hookSizes[1]}` : null,
      because: fly.notes ?? '',
      image: fly.image ?? null,
      retrieve: retrieveForFly(bundle, fly.id),
      rigs: [],
    };
  }

  if (concept.kind === 'knot') {
    const knot = bundle.byId.knots[concept.refs.knot];
    if (!knot) return null;
    return {
      concept: concept.id,
      kind: 'knot',
      conditions: knot.uses ?? [],
      seeing: knot.bestFor ?? '',
      question: `${knot.name} — what are the steps?`,
      answer: (knot.steps ?? []).map((s, i) => `${i + 1}. ${s}`).join('\n'),
      size: null,
      because: knot.failsWhen ? `Fails when: ${knot.failsWhen}` : '',
      rigs: [],
    };
  }

  if (concept.kind === 'rig') {
    const rig = bundle.byId.rigs[concept.refs.rig];
    if (!rig) return null;
    return {
      concept: concept.id,
      kind: 'rig',
      conditions: [rig.line, rig.lineWeight ? `${rig.lineWeight[0]}–${rig.lineWeight[1]} wt` : null].filter(Boolean),
      seeing: rig.useWhen ?? '',
      question: `${rig.name} — build the leader.`,
      answer: (rig.leaderSections ?? []).map((s) => `${s.ft} ft ${s.material}${s.lb ? ` (${s.lb} lb${s.x ? `, ${s.x}` : ''})` : ''}`).join('\n'),
      size: null,
      because: rig.knot ? `Knot: ${bundle.byId.knots[rig.knot]?.name ?? rig.knot}` : '',
      rigs: [],
    };
  }

  if (concept.kind === 'retrieve') {
    const r = bundle.byId.retrieves[concept.refs.retrieve];
    if (!r) return null;
    return {
      concept: concept.id,
      kind: 'retrieve',
      retrieve: r,
      conditions: [r.imitates].filter(Boolean),
      seeing: r.name,
      question: 'Strip length, speed, pause — and when does it get eaten?',
      answer: retrieveLine(r),
      size: setWord(r) ? `${setWord(r)}` : null,
      because: r.mistake ? `Usually got wrong: ${r.mistake}` : (r.cue ?? ''),
      rigs: [],
    };
  }

  if (concept.kind === 'presence') {
    const p = bundle.byId.presence[concept.refs.presence];
    if (!p) return null;
    return {
      concept: concept.id,
      kind: 'presence',
      conditions: [bundle.byId.regions[p.region]?.name ?? p.region],
      seeing: bundle.byId.organisms[p.organism]?.name ?? p.organism,
      question: 'When is this around, and what sets it off?',
      answer: `${p.months.map(monthName).join(', ')} — ${p.abundance}`,
      size: null,
      because: p.trigger ?? '',
      rigs: [],
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Decks are queries, not tables
// ---------------------------------------------------------------------------

export function deckFilter(bundle, { region, species, water } = {}) {
  if (!region && !species && !water) return () => true;

  const regionOrganisms = region
    ? new Set(bundle.tables.presence.filter((p) => p.region === region).map((p) => p.organism))
    : null;

  return (concept) => {
    const r = concept.refs ?? {};
    if (water) {
      const org = r.organism ? bundle.byId.organisms[r.organism] : null;
      const fly = r.fly ? bundle.byId.flies[r.fly] : null;
      const rig = r.rig ? bundle.byId.rigs[r.rig] : null;
      const w = org?.water ?? fly?.water ?? rig?.water;
      if (w && w !== water) return false;
    }
    if (regionOrganisms && r.organism && !regionOrganisms.has(r.organism)) return false;
    if (region && r.presence) {
      const p = bundle.byId.presence[r.presence];
      if (p && p.region !== region) return false;
    }
    if (species && r.match) {
      const m = bundle.byId.matches[r.match];
      const list = m?.facets?.species;
      if (list && !list.includes(species)) return false;
    }
    return true;
  };
}
