import { formatHookRange } from '../../../content/hooksize.mjs';
import { traitsOf, sizeRangeMm } from './traits.js';
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

const AROUND = { peak: 0, present: 1, sparse: 2 };

/**
 * The field key. `answers` is {shape, place, wings, tails, size, colour}, any
 * subset — see traits.js for the vocabulary. Returns the stages that fit,
 * with what is around the trip's region this month ranked first, because the
 * bug on your thumb is far more likely to be the one the chart says is
 * hatching than one from the other side of the country.
 *
 * `water` narrows to fresh or salt before anything is asked; with a region
 * set the UI passes the region's water so a Bahamas key never offers a
 * Hendrickson.
 */
export function fieldKey(bundle, answers = {}, { region, month, water } = {}) {
  const around = new Map();
  for (const p of bundle.tables.presence) {
    if (region && p.region !== region) continue;
    if (!region) continue;
    if (month != null && !p.months.includes(month)) continue;
    for (const s of p.stages ?? []) {
      const k = `${p.organism}.${s}`;
      const prev = around.get(k);
      if (prev == null || AROUND[p.abundance] < AROUND[prev]) around.set(k, p.abundance);
    }
  }

  const asked = Object.entries(answers).filter(([, v]) => v != null && v !== '');
  const out = [];
  for (const org of bundle.tables.organisms) {
    if (water && org.water !== water) continue;
    for (const st of org.stages ?? []) {
      const t = traitsOf(org, st);
      const fits = asked.every(([q, v]) => t[q] == null || t[q].includes(v));
      if (!fits) continue;
      out.push({
        organism: org,
        stage: st,
        around: around.get(`${org.id}.${st.stage}`) ?? null,
        sizeMm: sizeRangeMm(st),
      });
    }
  }

  return out.sort((a, b) => {
    const ra = a.around ? AROUND[a.around] : 3;
    const rb = b.around ? AROUND[b.around] : 3;
    return ra - rb || a.organism.name.localeCompare(b.organism.name) || a.stage.stage.localeCompare(b.stage.stage);
  });
}

/**
 * Every picture a trip can show: the flies its match rules recommend (all of
 * them, not just the top of the slate — the Box gap list and the field key
 * reach further down) and every stage of every organism that is around.
 * Paths, not URLs; the caller resolves them against the base. Used by
 * "Save pictures offline" on Plan.
 */
export function tripImages(bundle, q = {}) {
  const out = new Set();
  for (const m of slate(bundle, q)) {
    const img = bundle.byId.flies[m.fly]?.image;
    if (img) out.add(img);
  }
  for (const p of whatsOn(bundle, q)) {
    const org = bundle.byId.organisms[p.organism];
    if (!org) continue;
    if (org.image) out.add(org.image);
    for (const st of org.stages ?? []) if (st.image) out.add(st.image);
  }
  return [...out];
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
    answerId: match.fly,
    retrieve: r,
    // The conditions are the question, but the bug you are seeing is part of
    // them — a photograph of the natural belongs up front. The fly you were
    // supposed to name is the answer picture.
    image: stage?.image ?? org?.image ?? null,
    answerImage: bundle.byId.flies[match.fly]?.image ?? null,
    conditions: bits,
    seeing: stage?.behavior
      ? `${org.name} — ${match.stage}. ${stage.behavior}`
      : `${org?.name ?? match.organism}, ${match.stage}`,
    question: 'What do you tie on?',
    answer: bundle.byId.flies[match.fly]?.name ?? match.fly,
    size: match.hookSizes ? `#${formatHookRange(match.hookSizes)}` : null,
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
        answerId: r.id,
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
      answerId: fly?.id ?? match.fly,
      retrieve: r,
      // Identify the natural, then see the fly that imitates it. That pairing
      // is the whole lesson, and it only really lands as two pictures.
      image: stage?.image ?? org?.image ?? null,
      answerImage: fly?.image ?? null,
      conditions: [],
      seeing: `${org?.name ?? match.organism} — ${match.stage}`,
      question: 'Which fly imitates this?',
      answer: fly?.name ?? match.fly,
      size: match.hookSizes ? `#${formatHookRange(match.hookSizes)}` : null,
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
      answerId: `${org.id}.${st.stage}`,
      // The picture and where you found it are the question. The behaviour
      // and the colours are half the answer, so they wait for the reveal —
      // a photo-ID card that tells you it "darts backward in short hops" has
      // already said "shrimp".
      conditions: [st.where].filter(Boolean),
      seeing: '',
      question: `What is this, and what stage?`,
      answer: `${org.name} — ${st.stage}`,
      size: st.hookSizes ? `#${formatHookRange(st.hookSizes)}` : null,
      because: [st.behavior, st.colors?.length ? `Colours: ${st.colors.slice(0, 4).join(', ')}.` : null, org.notes]
        .filter(Boolean).join(' '),
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
      answerId: fly.id,
      conditions: [fly.water, fly.weight].filter(Boolean),
      seeing: fly.name,
      question: 'What does it imitate, and when do you reach for it?',
      answer: fly.tiedFor ?? '—',
      size: fly.hookSizes ? `#${formatHookRange(fly.hookSizes)}` : null,
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
      answerImage: knot.diagram ?? null,
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
      answerImage: rig.diagram ?? null,
      rigs: [],
    };
  }

  if (concept.kind === 'retrieve') {
    const r = bundle.byId.retrieves[concept.refs.retrieve];
    if (!r) return null;
    return {
      concept: concept.id,
      kind: 'retrieve',
      answerId: r.id,
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
      answerId: p.id,
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

// ---------------------------------------------------------------------------
// Multiple choice
// ---------------------------------------------------------------------------
// A card with one right answer and three wrong ones that could have been
// right. The distractors are the whole art: a Bahamas crab fly against three
// trout nymphs teaches nothing, against three other flats patterns it teaches
// the difference. So distractors come from the same water, a different
// family, and — for a match — never from a fly that ALSO imitates this stage,
// because that would be a second right answer marked wrong.
//
// Knots and leaders have no choice form: their answer is a sequence, and they
// keep the reveal-and-rate card.

function seeded(seedStr) {
  // mulberry32 over a string hash — deterministic per card so the options do
  // not reshuffle under your thumb on a re-render.
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Take up to n from the tiers in order, each shuffled; no repeats by key. */
function pickDistractors(tiers, n, rnd, keyOf) {
  const out = [];
  const seen = new Set();
  for (const pool of tiers.map((t) => shuffle(t, rnd))) {
    for (const x of pool) {
      if (out.length >= n) break;
      const k = keyOf(x);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(x);
    }
  }
  return out;
}

export function choicesFor(bundle, concept, face, { n = 4, seed } = {}) {
  if (!face || face.answerId == null) return null;
  const rnd = seeded(seed ?? `${concept.id}|${face.kind}`);
  const want = n - 1;
  let correct;
  let distractors;

  if (face.kind === 'match' || face.kind === 'scenario') {
    const fly = bundle.byId.flies[face.answerId];
    if (!fly) return null;
    const match = bundle.byId.matches[concept.refs.match];
    // Every fly that imitates this same stage is also right. Keep them out.
    const alsoRight = new Set(
      (bundle.index.matchesByOrganismStage[`${match.organism}.${match.stage}`] ?? [])
        .map((id) => bundle.byId.matches[id]?.fly),
    );
    const pool = bundle.tables.flies.filter((f) =>
      f.id !== fly.id && !alsoRight.has(f.id) && f.family !== fly.family &&
      (f.water === fly.water || f.water === 'both' || fly.water === 'both'));
    // Tiers, most convincing first: a fly tied for the same KIND of bug (another
    // mayfly pattern for a mayfly card), then one on a similar hook, then the
    // same category, then anything in the water. Without this a #18 dry drew
    // three #8 hoppers and the hook size gave it away.
    const kindOf = (f) => new Set((bundle.index.matchesByFly[f.id] ?? [])
      .map((id) => bundle.byId.organisms[bundle.byId.matches[id]?.organism]?.kind).filter(Boolean));
    const kinds = kindOf(fly);
    const overlaps = (a, b) => a && b && a[0] <= b[1] && b[0] <= a[1];
    const sameKind = pool.filter((f) => [...kindOf(f)].some((k) => kinds.has(k)));
    const sameHook = pool.filter((f) => f.category === fly.category && overlaps(f.hookSizes, fly.hookSizes));
    const sameCat = pool.filter((f) => f.category === fly.category);
    const sameKindCat = sameKind.filter((f) => f.category === fly.category);
    distractors = pickDistractors([sameKindCat, sameKind, sameHook, sameCat, pool], want, rnd, (f) => f.family);
    const opt = (f) => ({ key: f.id, label: f.name, image: f.image ?? null,
      sub: f.hookSizes ? `#${formatHookRange(f.hookSizes)}` : null });
    correct = opt(fly);
    distractors = distractors.map(opt);
  }

  else if (face.kind === 'organism-stage') {
    const [orgId, stage] = face.answerId.split('.');
    const org = bundle.byId.organisms[orgId];
    if (!org) return null;
    const all = [];
    for (const o of bundle.tables.organisms) {
      if (o.water !== org.water) continue;
      for (const st of o.stages ?? []) {
        if (o.id === orgId && st.stage === stage) continue;
        all.push({ org: o, st });
      }
    }
    // Same kind first (another mayfly's dun is the convincing wrong answer),
    // then the same organism's other stages, then anything in the water.
    const sameKindStage = all.filter((x) => x.org.kind === org.kind && x.st.stage === stage);
    const sameKind = all.filter((x) => x.org.kind === org.kind);
    distractors = pickDistractors([sameKindStage, sameKind, all], want, rnd, (x) => `${x.org.id}.${x.st.stage}`);
    const opt = (o, st) => ({ key: `${o.id}.${st.stage}`, label: `${o.name} — ${st.stage}`, image: null, sub: null });
    correct = opt(org, org.stages.find((x) => x.stage === stage));
    distractors = distractors.map((x) => opt(x.org, x.st));
  }

  else if (face.kind === 'fly') {
    const fly = bundle.byId.flies[face.answerId];
    if (!fly?.tiedFor) return null;
    const pool = bundle.tables.flies.filter((f) =>
      f.id !== fly.id && f.family !== fly.family && f.tiedFor && f.tiedFor !== fly.tiedFor &&
      (f.water === fly.water || f.water === 'both' || fly.water === 'both'));
    const preferred = pool.filter((f) => f.category === fly.category);
    distractors = pickDistractors([preferred, pool], want, rnd, (f) => f.tiedFor);
    const opt = (f) => ({ key: f.id, label: f.tiedFor, image: null, sub: null });
    correct = opt(fly);
    distractors = distractors.map(opt);
  }

  else if (face.kind === 'match-retrieve' || face.kind === 'retrieve') {
    const r = bundle.byId.retrieves[face.answerId];
    if (!r) return null;
    const pool = bundle.tables.retrieves.filter((x) => x.id !== r.id);
    distractors = pickDistractors([pool], want, rnd, (x) => x.id);
    const opt = face.kind === 'retrieve'
      ? (x) => ({ key: x.id, label: retrieveLine(x), image: null, sub: x.name })
      : (x) => ({ key: x.id, label: x.name, image: null, sub: retrieveLine(x) });
    correct = opt(r);
    distractors = distractors.map(opt);
  }

  else if (face.kind === 'presence') {
    const p = bundle.byId.presence[face.answerId];
    if (!p) return null;
    const text = (x) => `${x.months.map(monthName).join(', ')} — ${x.abundance}`;
    const pool = bundle.tables.presence.filter((x) => x.id !== p.id && text(x) !== text(p));
    const preferred = pool.filter((x) => x.region === p.region);
    distractors = pickDistractors([preferred, pool], want, rnd, text);
    const opt = (x) => ({ key: x.id, label: text(x), image: null, sub: null });
    correct = opt(p);
    distractors = distractors.map(opt);
  }

  else return null;

  if (distractors.length < 2) return null; // not enough to make a fair question
  const options = shuffle([{ ...correct, correct: true }, ...distractors.map((d) => ({ ...d, correct: false }))], rnd);
  return { options, answerKey: correct.key };
}
