// Fly Box — user layer: the review scheduler
// ---------------------------------------------------------------------------
// SM-2 with a shorter memory and gentler penalties. Not FSRS — FSRS earns its
// complexity at thousands of reviews, and swapping it in later only needs this
// file to change, because of the one rule that matters:
//
//   REVIEW STATE IS KEYED TO A CONCEPT ID, NEVER TO A CARD.
//
// `match:blue-winged-olive.dun>parachute-adams` is one fact. The generator can
// dress it as a picture question, a scenario, or a reversed "what does this
// imitate" — same schedule, because they are the same thing to know. If this
// keyed off rendered text, every generated card would look brand new forever
// and the whole system would collapse into random quizzing.

export const GRADE = { AGAIN: 0, HARD: 1, GOOD: 2, EASY: 3 };

const DAY = 86400000;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function newCard(conceptId, kind) {
  return {
    id: conceptId,
    kind,
    reps: 0,
    lapses: 0,
    ease: 2.5,
    intervalDays: 0,
    due: new Date().toISOString(),
    lastAt: null,
    // Streak of consecutive GOOD-or-better. Drives "known" in the UI, which is
    // a friendlier claim than an interval in days.
    streak: 0,
  };
}

export function grade(card, g, now = new Date()) {
  const next = { ...card };
  next.reps += 1;
  next.lastAt = now.toISOString();

  if (g === GRADE.AGAIN) {
    next.lapses += 1;
    next.streak = 0;
    next.ease = clamp(next.ease - 0.2, 1.3, 2.8);
    next.intervalDays = 0;
    // Back in ten minutes, same session. Getting it wrong should cost you now,
    // not tomorrow.
    next.due = new Date(now.getTime() + 10 * 60000).toISOString();
    return next;
  }

  next.streak += 1;
  const bump = { [GRADE.HARD]: -0.15, [GRADE.GOOD]: 0, [GRADE.EASY]: 0.15 }[g] ?? 0;
  next.ease = clamp(next.ease + bump, 1.3, 2.8);

  const factor = { [GRADE.HARD]: 1.2, [GRADE.GOOD]: next.ease, [GRADE.EASY]: next.ease * 1.3 }[g];
  next.intervalDays = next.intervalDays === 0
    ? { [GRADE.HARD]: 1, [GRADE.GOOD]: 2, [GRADE.EASY]: 4 }[g]
    : Math.round(next.intervalDays * factor);

  next.intervalDays = clamp(next.intervalDays, 1, 365);
  next.due = new Date(now.getTime() + next.intervalDays * DAY).toISOString();
  return next;
}

// ---------------------------------------------------------------------------
// Queue
// ---------------------------------------------------------------------------

/**
 * Today's cards. `concepts` comes from the content bundle; `cards` is whatever
 * review state exists. A concept with no card has never been seen and is new.
 *
 * `filter` is how a trip deck works: pass a predicate over concept refs and you
 * get "everything Bahamas" without a separate deck table. Decks are queries.
 */
export function buildQueue(concepts, cards, {
  now = new Date(),
  newPerDay = 12,
  maxDue = 60,
  filter = () => true,
} = {}) {
  const byId = new Map(cards.map((c) => [c.id, c]));
  const pool = concepts.filter(filter);

  const due = [];
  const fresh = [];

  for (const concept of pool) {
    const card = byId.get(concept.id);
    if (!card) fresh.push({ concept, card: null });
    else if (new Date(card.due) <= now) due.push({ concept, card });
  }

  // Oldest due first — a card three weeks overdue matters more than one due
  // this morning.
  due.sort((a, b) => a.card.due.localeCompare(b.card.due));

  // New cards used to be released in content order, which meant every bug
  // stage, then every match, then every fly — a week of "what is this, and
  // what stage?" before a single "which fly?". Instead, deal the day's dozen
  // round-robin across kinds, from a shuffle that is fixed for the day so the
  // same twelve come back after a reload.
  const dayKey = now.toISOString().slice(0, 10);
  const shuffled = seededShuffle(fresh, dayKey);
  const byKind = new Map();
  for (const f of shuffled) {
    const k = f.concept.kind;
    if (!byKind.has(k)) byKind.set(k, []);
    byKind.get(k).push(f);
  }
  const dealt = [];
  const lanes = [...byKind.values()];
  while (dealt.length < Math.min(newPerDay, fresh.length)) {
    for (const lane of lanes) {
      if (dealt.length >= newPerDay) break;
      const next = lane.shift();
      if (next) dealt.push(next);
    }
  }

  return {
    due: due.slice(0, maxDue),
    fresh: dealt,
    counts: { due: due.length, new: fresh.length, total: pool.length },
  };
}

// Deterministic per key. Same input, same order — a re-render or a reload
// must not reshuffle the cards you were partway through.
function seededShuffle(arr, key) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  let a = h >>> 0;
  const rnd = () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function progress(concepts, cards) {
  const byId = new Map(cards.map((c) => [c.id, c]));
  let unseen = 0, learning = 0, known = 0;
  for (const c of concepts) {
    const card = byId.get(c.id);
    if (!card) unseen += 1;
    else if (card.streak >= 3 && card.intervalDays >= 7) known += 1;
    else learning += 1;
  }
  return { unseen, learning, known, total: concepts.length };
}
