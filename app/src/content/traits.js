// Fly Box — what a life stage looks like from the bank
// ---------------------------------------------------------------------------
// The field key asks five things you can actually see with a bug on your
// thumb — what kind of thing, where it was, wings, tails, size, colour — and
// narrows to the organism stages that fit. Content records carry size and
// colour per stage; the rest is entomology that holds across every mayfly dun
// or caddis adult ever recorded, so it lives here as a lookup on kind.stage
// rather than being repeated on 70 records.
//
// Same rule as the match facets: a trait a stage does not declare is a trait
// it does not care about. An unanswered question filters nothing.

export const QUESTIONS = {
  shape: {
    label: 'What kind of thing?',
    options: [
      ['insect', 'Insect'],
      ['shrimp', 'Shrimp / scud / crayfish'],
      ['crab', 'Crab'],
      ['fish', 'Fish'],
      ['worm', 'Worm / leech'],
      ['squid', 'Squid'],
    ],
  },
  place: {
    label: 'Where was it?',
    insectOnly: true,
    options: [
      ['air', 'Flying'],
      ['surface', 'Riding on top'],
      ['film', 'Stuck in the surface'],
      ['under', 'Underwater'],
      ['bank', 'On rocks or grass'],
    ],
  },
  wings: {
    label: 'Wings',
    insectOnly: true,
    options: [
      ['upright', 'Upright, like a sail'],
      ['tent', 'Tent over the back'],
      ['flat', 'Flat — over the back or out to the sides'],
      ['none', 'None, or just pads'],
    ],
  },
  tails: {
    label: 'Tails',
    insectOnly: true,
    options: [
      ['long', '2–3 long'],
      ['short', '2 short'],
      ['none', 'None'],
    ],
  },
  size: {
    label: 'How long?',
    options: [
      ['tiny', 'Under ¼ in'],
      ['small', '¼ – ½ in'],
      ['medium', '½ – 1 in'],
      ['large', '1 – 2½ in'],
      ['huge', 'Bigger'],
    ],
  },
  colour: {
    label: 'Colour',
    options: [
      ['olive', 'Olive / green'],
      ['brown', 'Brown'],
      ['tan', 'Tan / cream / yellow'],
      ['grey', 'Grey'],
      ['black', 'Black'],
      ['rust', 'Rust / red / orange'],
      ['white', 'White / silver / clear'],
    ],
  },
};

export const QUESTION_ORDER = ['shape', 'place', 'wings', 'tails', 'size', 'colour'];

// Kind → shape. Crustaceans split on the record id because a crab and a shrimp
// are the same schema kind and nothing like each other in the hand.
export function shapeOf(org) {
  switch (org.kind) {
    case 'mayfly': case 'caddis': case 'stonefly': case 'midge': case 'terrestrial':
      return 'insect';
    case 'crustacean':
      return /crab/.test(org.id) ? 'crab' : 'shrimp';
    case 'baitfish': return 'fish';
    case 'annelid': return 'worm';
    case 'cephalopod': return 'squid';
    default: return null;
  }
}

// Insect traits by kind.stage. Lists, because a real emerger is half nymph and
// half dun and an honest key lets it answer both ways.
const INSECT = {
  'mayfly.nymph':     { place: ['under'],                    wings: ['none'],            tails: ['long'] },
  'mayfly.emerger':   { place: ['film', 'surface'],          wings: ['none', 'upright'], tails: ['long'] },
  'mayfly.dun':       { place: ['surface', 'air', 'bank'],   wings: ['upright'],         tails: ['long'] },
  'mayfly.spinner':   { place: ['film', 'air', 'surface'],   wings: ['flat'],            tails: ['long'] },
  'caddis.larva':     { place: ['under'],                    wings: ['none'],            tails: ['none'] },
  'caddis.pupa':      { place: ['under', 'film'],            wings: ['none'],            tails: ['none'] },
  'caddis.adult':     { place: ['air', 'surface', 'bank'],   wings: ['tent'],            tails: ['none'] },
  'stonefly.nymph':   { place: ['under', 'bank'],            wings: ['none'],            tails: ['short', 'long'] },
  'stonefly.adult':   { place: ['bank', 'air', 'surface'],   wings: ['flat'],            tails: ['short'] },
  'midge.larva':      { place: ['under'],                    wings: ['none'],            tails: ['none'] },
  'midge.pupa':       { place: ['film', 'under'],            wings: ['none'],            tails: ['none'] },
  'midge.adult':      { place: ['surface', 'air', 'film'],   wings: ['flat'],            tails: ['none'] },
  'terrestrial.adult':  { place: ['bank', 'surface'],        wings: ['none', 'flat'],    tails: ['none'] },
  'terrestrial.winged': { place: ['air', 'surface', 'bank'], wings: ['flat'],            tails: ['none'] },
  'terrestrial.larva':  { place: ['bank', 'surface', 'film'], wings: ['none'],           tails: ['none'] },
};

export const insectTraits = (org, stage) => INSECT[`${org.kind}.${stage.stage}`] ?? null;

// Hook number → rough shank length in mm, on the signed scale from
// content/hooksize.mjs (smaller number = bigger hook; 0 is 1/0, -1 is 2/0).
// Used only when a stage records hookSizes but not sizeMm.
const HOOK_MM = [
  [24, 4], [22, 5], [20, 6], [18, 7], [16, 9], [14, 11], [12, 14], [10, 17],
  [8, 21], [6, 26], [4, 32], [2, 38], [1, 42], [0, 46], [-1, 52], [-2, 58], [-3, 64],
];
export function hookToMm(n) {
  let best = HOOK_MM[0];
  for (const row of HOOK_MM) if (Math.abs(row[0] - n) < Math.abs(best[0] - n)) best = row;
  return best[1];
}

/** [min, max] mm for a stage, from sizeMm or, failing that, from its hook range. */
export function sizeRangeMm(stage) {
  if (stage.sizeMm) return stage.sizeMm;
  if (stage.hookSizes) return [hookToMm(stage.hookSizes[1]), hookToMm(stage.hookSizes[0])].sort((a, b) => a - b);
  return null;
}

// Buckets in mm. Boundaries overlap the way the eye does: a 12 mm bug reads as
// small to one person and medium to the next, and the key must not throw the
// right answer away over that.
const BUCKETS = {
  tiny: [0, 7],
  small: [6, 13],
  medium: [12, 26],
  large: [24, 64],
  huge: [60, Infinity],
};
export const sizeBucketsFor = (range) =>
  (range ? Object.keys(BUCKETS).filter((k) => range[0] <= BUCKETS[k][1] && range[1] >= BUCKETS[k][0]) : null);

/** "about ¼–½ in" for a mm range, the way you would say it on the water. */
export function sizeWords(range) {
  if (!range) return '';
  const inch = (mm) => mm / 25.4;
  const f = (x) => (x < 0.19 ? '⅛' : x < 0.31 ? '¼' : x < 0.44 ? '⅜' : x < 0.6 ? '½' : x < 0.85 ? '¾' : x < 1.3 ? '1' : x < 1.75 ? '1½' : x < 2.3 ? '2' : x < 2.8 ? '2½' : x < 3.5 ? '3' : `${Math.round(x)}`);
  const a = f(inch(range[0]));
  const b = f(inch(range[1]));
  return a === b ? `about ${a} in` : `${a}–${b} in`;
}

const COLOUR_TOKENS = {
  olive: ['olive', 'green', 'chartreuse'],
  brown: ['brown', 'mottled'],
  tan: ['tan', 'cream', 'amber', 'golden', 'yellow'],
  grey: ['grey', 'gray'],
  black: ['black'],
  rust: ['rust', 'red', 'orange', 'wine', 'maroon', 'pink'],
  white: ['white', 'silver', 'clear'],
};
export const colourFamiliesFor = (colours) =>
  (colours?.length
    ? Object.keys(COLOUR_TOKENS).filter((fam) =>
      colours.some((c) => COLOUR_TOKENS[fam].some((t) => String(c).toLowerCase().includes(t))))
    : null);

/**
 * Every answerable trait for one stage. `null` for a trait means "any" —
 * the record does not say, so the key does not hold it against the stage.
 */
export function traitsOf(org, stage) {
  const insect = insectTraits(org, stage);
  const shape = shapeOf(org);
  return {
    shape: shape ? [shape] : null,
    place: insect?.place ?? (shape === 'fish' ? ['under', 'surface'] : shape ? ['under'] : null),
    wings: insect?.wings ?? (shape && shape !== 'insect' ? ['none'] : null),
    tails: insect?.tails ?? (shape && shape !== 'insect' ? ['none'] : null),
    size: sizeBucketsFor(sizeRangeMm(stage)),
    colour: colourFamiliesFor(stage.colors),
  };
}
