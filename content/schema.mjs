// Fly Box — content schema
// ---------------------------------------------------------------------------
// Zero dependencies on purpose: `node content/validate.mjs` must work in a
// fresh clone with no install step.
//
// Every record in content/data/*.json is checked against a shape declared here.
// Add a field to a shape and the validator enforces it everywhere on the next
// run — that is the whole point of keeping this file separate from the data.

// ---------------------------------------------------------------------------
// Controlled vocabularies
// ---------------------------------------------------------------------------
// Anything a human types twice will eventually be typed two different ways.
// These lists are what stop "bead chain" and "beadchain" from both existing.

export const VOCAB = {
  water: ['fresh', 'salt'],

  // Life stages. Insects and crustaceans share one list; a stage is only legal
  // on an organism that actually declares it (checked in validate.mjs).
  stage: [
    'egg', 'larva', 'pupa', 'nymph', 'emerger', 'dun', 'spinner', 'adult',
    'juvenile', 'molting', 'spawning', 'schooling', 'dead-drifting',
  ],

  organismKind: [
    'mayfly', 'caddis', 'midge', 'stonefly', 'terrestrial', 'annelid',
    'crustacean', 'baitfish', 'cephalopod', 'other',
  ],

  flyWeight: [
    'unweighted', 'bead-chain', 'lead-eyes', 'beadhead', 'tungsten', 'wire',
  ],

  flyRole: ['point', 'dropper', 'dry', 'single', 'trailer'],

  // How strongly a match is recommended. Deliberately three values — a
  // 1–10 confidence score invites false precision you cannot justify.
  strength: ['first-choice', 'change-up', 'situational'],

  waterType: [
    'riffle', 'run', 'seam', 'pool', 'tailout', 'pocket', 'flat', 'channel',
    'mangrove', 'surf', 'inlet', 'blue-water',
  ],

  timeOfDay: ['dawn', 'morning', 'midday', 'afternoon', 'dusk', 'night'],

  light: ['bright', 'broken', 'overcast', 'low'],

  tide: ['low', 'incoming', 'high', 'outgoing'],

  wind: ['calm', 'light', 'moderate', 'strong'],

  abundance: ['sparse', 'present', 'peak'],

  // Retrieve vocabulary. Speed and pause are the two dials that decide whether
  // a fly gets eaten; everything else is detail.
  stripSpeed: ['crawl', 'slow', 'medium', 'fast', 'burst'],

  // WHEN the eat happens is the single most useful thing to know about a
  // retrieve, because it tells you when to be ready and what a take feels
  // like. Most saltwater flies are eaten on the pause, not during the strip.
  eatTiming: ['on-the-pause', 'during-the-strip', 'on-the-drop', 'on-the-drift', 'on-the-lift'],

  setType: ['strip-set', 'trout-set', 'let-it-load', 'no-set'],

  knotUse: [
    'tippet-to-fly', 'line-to-leader', 'leader-to-tippet', 'loop-to-loop',
    'backing-to-line', 'bite-tippet',
  ],

  // Decision made 2026-09-14: regional content is drafted, then reviewed by
  // Jeff before it counts. The schema carries that state so the app can show
  // it and the validator can count what is still outstanding.
  status: ['draft', 'reviewed'],
};

// ---------------------------------------------------------------------------
// Field helpers
// ---------------------------------------------------------------------------

const f = (type, opts = {}) => ({ type, ...opts });

export const T = {
  slug: (opts = {}) => f('slug', opts),
  str: (opts = {}) => f('string', opts),
  int: (opts = {}) => f('int', opts),
  num: (opts = {}) => f('number', opts),
  bool: (opts = {}) => f('bool', opts),
  enum: (vocab, opts = {}) => f('enum', { values: VOCAB[vocab], vocab, ...opts }),
  ref: (file, opts = {}) => f('ref', { ref: file, ...opts }),
  arr: (of, opts = {}) => f('array', { of, ...opts }),
  obj: (shape, opts = {}) => f('object', { shape, ...opts }),
  // [min, max] inclusive pair, e.g. hook sizes [16, 20] or temps [58, 74]
  range: (opts = {}) => f('range', opts),
};

// Every record carries these. `sources` is where a draft claim says where it
// came from, so review is checking a citation rather than re-deriving it.
const BASE = {
  id: T.slug({ required: true }),
  name: T.str({ required: true }),
  status: T.enum('status', { required: true }),
  notes: T.str(),
  sources: T.arr(T.str()),
};

// ---------------------------------------------------------------------------
// Facets — the axes a recommendation can vary on
// ---------------------------------------------------------------------------
// This object is the reason the whole restructure is worth doing. A match rule
// with facets can be read three ways: as a trip-brief fly slate, as a field-ID
// answer, and as a generated quiz scenario. Null / absent means "does not
// depend on this axis" — which is a real and common answer, not missing data.

export const FACETS = {
  regions: T.arr(T.ref('regions')),
  months: T.arr(T.int({ min: 1, max: 12 })),
  species: T.arr(T.ref('species')),
  waterTypes: T.arr(T.enum('waterType')),
  timeOfDay: T.arr(T.enum('timeOfDay')),
  light: T.arr(T.enum('light')),
  tempBandF: T.range(),          // water temperature, °F
  // Salt axes. Carried from day one because the Bahamas brief is first.
  tide: T.arr(T.enum('tide')),
  depthIn: T.range(),            // water depth over the fish, inches
  wind: T.arr(T.enum('wind')),
};

// ---------------------------------------------------------------------------
// Record shapes, one per file in content/data/
// ---------------------------------------------------------------------------

export const SCHEMAS = {
  // -- Fish you are casting at -------------------------------------------
  species: {
    file: 'species.json',
    shape: {
      ...BASE,
      water: T.enum('water', { required: true }),
      regions: T.arr(T.ref('regions'), { required: true }),
      tempBandF: T.range(),
      spooky: T.int({ min: 1, max: 5 }),   // 5 = looks at you and leaves
      eats: T.arr(T.ref('organisms')),
      rigs: T.arr(T.ref('rigs')),
      tippetLb: T.range(),
      takeNotes: T.str(),                  // how the eat happens and is missed
      huntNotes: T.str(),                  // what they chase and how they run it down
      leadFt: T.range(),                   // how far in front of the fish to land it
      refusal: T.str(),                    // what a refusal looks like, and what to change
      fightNotes: T.str(),
    },
  },

  // -- Places, and the live-data stations that serve them ------------------
  regions: {
    file: 'regions.json',
    shape: {
      ...BASE,
      water: T.enum('water', { required: true }),
      coords: T.arr(T.num(), { length: 2 }),
      // Phase 6 hooks. Present now so authoring does not have to be revisited.
      tideStation: T.str(),   // NOAA CO-OPS station id
      usgsGauge: T.str(),     // USGS NWIS site number
      timezone: T.str(),
      primaryFactor: T.str(), // the one condition that decides the day here
      waters: T.arr(T.obj({
        id: T.slug({ required: true }),
        name: T.str({ required: true }),
        type: T.enum('waterType'),
        notes: T.str(),
      })),
    },
  },

  // -- Things fish eat ----------------------------------------------------
  // Bugs and flats prey are one entity type. A mayfly nymph and a molting
  // crab are the same question to the app: what is it, what stage, what
  // imitates it. Splitting them would mean two of every downstream feature.
  organisms: {
    file: 'organisms.json',
    shape: {
      ...BASE,
      kind: T.enum('organismKind', { required: true }),
      water: T.enum('water', { required: true }),
      scientificName: T.str(),
      aliases: T.arr(T.str()),
      image: T.str(),
      stages: T.arr(T.obj({
        stage: T.enum('stage', { required: true }),
        sizeMm: T.range(),
        hookSizes: T.range(),        // [smallest number, largest number]
        colors: T.arr(T.str()),
        behavior: T.str(),           // what it does — the field-ID tell
        where: T.str(),              // where in the column / on the bottom
        vulnerable: T.bool(),        // is this the stage fish key on
        image: T.str(),
      }), { required: true, min: 1 }),
    },
  },

  // -- Retrieves: how the fly is made to behave ---------------------------
  // Split out of prose and into its own table because it is the part that is
  // actually drilled. "Strip it" is not instruction; "two to six inch strips,
  // fast, one to two seconds still, and it eats on the stop" is.
  retrieves: {
    file: 'retrieves.json',
    shape: {
      ...BASE,
      stripLengthIn: T.range(),
      speed: T.enum('stripSpeed', { required: true }),
      pauseSec: T.range(),
      eatTiming: T.enum('eatTiming', { required: true }),
      setType: T.enum('setType', { required: true }),
      rodTip: T.str(),
      imitates: T.str(),        // the animal behaviour this reproduces
      cue: T.str(),             // what the take feels or looks like
      mistake: T.str(),         // the way it is usually got wrong
    },
  },

  // -- Flies. Color variants are separate records. -------------------------
  flies: {
    file: 'flies.json',
    shape: {
      ...BASE,
      water: T.enum('water', { required: true }),
      family: T.slug({ required: true }),  // pattern group; variants share it
      variantOf: T.ref('flies'),           // null on the base pattern
      color: T.str(),
      aliases: T.arr(T.str()),
      hookSizes: T.range({ required: true }),
      weight: T.enum('flyWeight'),
      roles: T.arr(T.enum('flyRole')),
      defaultKnot: T.ref('knots'),
      retrieve: T.ref('retrieves'),        // how this fly is meant to move
      image: T.str(),
      tiedFor: T.str(),                    // one line: what it is for
    },
  },

  // -- Knots --------------------------------------------------------------
  knots: {
    file: 'knots.json',
    shape: {
      ...BASE,
      uses: T.arr(T.enum('knotUse'), { required: true }),
      water: T.enum('water'),              // absent = both
      strengthPct: T.int({ min: 1, max: 100 }),
      steps: T.arr(T.str(), { required: true, min: 2 }),
      bestFor: T.str(),
      failsWhen: T.str(),
    },
  },

  // -- Rigs ---------------------------------------------------------------
  rigs: {
    file: 'rigs.json',
    shape: {
      ...BASE,
      water: T.enum('water', { required: true }),
      lineWeight: T.range(),
      line: T.str(),                       // floating, intermediate, level euro…
      leaderFt: T.num(),
      leaderSections: T.arr(T.obj({
        material: T.str({ required: true }),
        lb: T.num(),
        x: T.str(),                        // tippet X-rating where it applies
        ft: T.num({ required: true }),
      })),
      flies: T.arr(T.obj({
        role: T.enum('flyRole', { required: true }),
        notes: T.str(),
      })),
      knot: T.ref('knots'),
      useWhen: T.str(),
    },
  },

  // -- THE JOIN TABLE: organism + stage -> fly, under conditions -----------
  matches: {
    file: 'matches.json',
    shape: {
      ...BASE,
      name: T.str(),                       // optional here; derived if absent
      organism: T.ref('organisms', { required: true }),
      stage: T.enum('stage', { required: true }),
      fly: T.ref('flies', { required: true }),
      strength: T.enum('strength', { required: true }),
      hookSizes: T.range(),
      facets: T.obj(FACETS),
      // Overrides the fly's default. The same crab is fished differently at a
      // permit that has already seen it than at a tailing bonefish, so the
      // retrieve belongs on the rule, not only on the fly.
      retrieve: T.ref('retrieves'),
      presentation: T.str(),
      rigs: T.arr(T.ref('rigs')),
    },
  },

  // -- What is available where, when --------------------------------------
  // Generalised hatch chart. Works for a BWO emergence and for the months
  // bonefish are pushing onto a flat to eat spawning shrimp.
  presence: {
    file: 'presence.json',
    shape: {
      ...BASE,
      name: T.str(),
      region: T.ref('regions', { required: true }),
      organism: T.ref('organisms', { required: true }),
      stages: T.arr(T.enum('stage'), { required: true, min: 1 }),
      months: T.arr(T.int({ min: 1, max: 12 }), { required: true, min: 1 }),
      abundance: T.enum('abundance', { required: true }),
      timeOfDay: T.arr(T.enum('timeOfDay')),
      trigger: T.str(),                    // what sets it off
    },
  },
};

// ---------------------------------------------------------------------------
// Concept IDs — the spaced-repetition anchor
// ---------------------------------------------------------------------------
// Review state is keyed to these, NEVER to a rendered card. A generated
// scenario dresses the same underlying fact a dozen different ways; if the
// scheduler keyed off card text, every card would look brand new forever and
// the whole system would degrade into random quizzing.
//
// Rule: a concept ID must stay identical as long as the fact is the same.
// Rename a display name freely; never renumber a slug.

export const CONCEPT = {
  match: (m) => `match:${m.organism}.${m.stage}>${m.fly}`,
  organismStage: (o, s) => `organism:${o}.${s}`,
  flyPurpose: (flyId) => `fly:${flyId}`,
  knotSteps: (knotId) => `knot:${knotId}`,
  rigBuild: (rigId) => `rig:${rigId}`,
  retrieve: (retrieveId) => `retrieve:${retrieveId}`,
  // Stages are part of the identity: "golden stones are on the bottom all year"
  // and "golden stone adults are on the water in June" are two separate facts
  // about the same region and organism, and deserve separate schedules.
  presence: (p) => `presence:${p.region}.${p.organism}.${[...(p.stages ?? [])].sort().join('+')}`,
};

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
