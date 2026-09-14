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

  return {
    due: due.slice(0, maxDue),
    fresh: fresh.slice(0, newPerDay),
    counts: { due: due.length, new: fresh.length, total: pool.length },
  };
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
