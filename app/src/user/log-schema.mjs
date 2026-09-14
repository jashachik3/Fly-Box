// Fly Box — user layer: log schema
// ---------------------------------------------------------------------------
// This is the USER layer. It never ships with the build, it lives on the phone,
// and it must survive every content update. Keep it clear of anything in
// content/ except by id reference.
//
// The shape here encodes three decisions from the plan:
//
//   1. A session is the parent record, not the fish. Catches without hours
//      have no denominator: if you fish a Walt's Worm 80% of your hours it
//      will "win" on raw counts whether or not it is any good.
//
//   2. Time on water is tracked per RIG, as stints. A session that starts on a
//      euro rig and switches to dry-dropper is two stints, and every catch
//      belongs to one of them. That is what makes fish-per-hour-per-rig a
//      subtraction rather than a guess.
//
//   3. What the app RECOMMENDED is recorded at session start, separately from
//      what you actually tied on. Without it you can see what you fished but
//      never that you departed from the slate — and going off script is the
//      signal, not the noise.

export const USER_SCHEMA_VERSION = 1;

export const LOG_VOCAB = {
  flyRole: ['point', 'dropper', 'dry', 'single', 'trailer'],
  light: ['bright', 'broken', 'overcast', 'low'],
  wind: ['calm', 'light', 'moderate', 'strong'],
  tide: ['low', 'incoming', 'high', 'outgoing'],
  waterType: [
    'riffle', 'run', 'seam', 'pool', 'tailout', 'pocket', 'flat', 'channel',
    'mangrove', 'surf', 'inlet', 'blue-water',
  ],
  // Where a recommendation came from, so you can tell the brief's advice from
  // the field key's advice when they disagree.
  recSource: ['brief', 'field-id', 'manual'],
};

// ---------------------------------------------------------------------------
// ids
// ---------------------------------------------------------------------------

export function newId(prefix) {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${t}${r}`;
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export function makeSession(input = {}) {
  const now = input.startedAt ?? new Date().toISOString();
  return {
    id: input.id ?? newId('s'),
    schemaVersion: USER_SCHEMA_VERSION,
    kind: 'session',

    startedAt: now,
    endedAt: input.endedAt ?? null,

    regionId: input.regionId ?? null,       // -> content regions.json
    waterId: input.waterId ?? null,         // -> region.waters[].id
    placeNote: input.placeNote ?? '',

    // Anglers guard spots. `blur` rounds the stored position so a screenshot
    // can be shared without burning the water. The raw fix is never kept.
    gps: input.gps ?? null,                 // { lat, lon, blurred: bool }

    conditions: {
      airF: null,
      waterF: null,
      flowCfs: null,        // USGS, auto-filled when there is signal
      tide: null,           // NOAA
      light: null,
      wind: null,
      note: '',
      ...(input.conditions ?? {}),
    },

    // Filled in by the app before you start fishing. This is the "what did the
    // app tell me to do" record that makes off-script visible later.
    recommended: input.recommended ?? [],   // [{ flyId, strength, source }]

    stints: input.stints ?? [],             // [{ id, rigId, startedAt, endedAt, flies }]

    notes: input.notes ?? '',
    voiceNotes: input.voiceNotes ?? [],     // [{ id, at, blobKey, transcript }]

    // Set when conditions could not be fetched at the time. The enrichment
    // pass picks these up next time there is signal.
    needsEnrichment: input.needsEnrichment ?? false,
  };
}

export function startStint(session, { rigId, flies = [], setupId = null, at } = {}) {
  const now = at ?? new Date().toISOString();
  const open = session.stints.find((s) => !s.endedAt);
  if (open) open.endedAt = now;

  const stint = {
    id: newId('st'),
    rigId,
    // Which of YOUR outfits was in your hand. A rig is "8-weight floating";
    // a setup is the actual rod, reel and line, so a line that starts fishing
    // badly can be traced to the season it was bought.
    setupId,
    startedAt: now,
    endedAt: null,
    // Snapshot, not a reference: change the preset next month and this stays
    // an accurate record of what was actually on the leader.
    flies: flies.map((f) => ({ role: f.role, flyId: f.flyId, size: f.size ?? null })),
  };
  session.stints.push(stint);
  return stint;
}

export function endSession(session, at) {
  const now = at ?? new Date().toISOString();
  for (const s of session.stints) if (!s.endedAt) s.endedAt = now;
  session.endedAt = now;
  return session;
}

// ---------------------------------------------------------------------------
// Catch
// ---------------------------------------------------------------------------
// Three taps on the water: species, size, which fly ate. Everything else is
// either carried from the stint or filled in later at the truck.

export function makeCatch(session, input = {}) {
  const stint = input.stintId
    ? session.stints.find((s) => s.id === input.stintId)
    : (session.stints.find((s) => !s.endedAt) ?? session.stints.at(-1));

  if (!stint) throw new Error('a catch needs a stint — start a rig before logging a fish');

  const onRig = stint.flies.map((f) => ({ ...f }));
  const ate = onRig.find((f) => f.flyId === input.ateFlyId);

  return {
    id: input.id ?? newId('c'),
    schemaVersion: USER_SCHEMA_VERSION,
    kind: 'catch',

    sessionId: session.id,
    stintId: stint.id,
    at: input.at ?? new Date().toISOString(),

    speciesId: input.speciesId ?? null,     // -> content species.json
    lengthIn: input.lengthIn ?? null,
    weightLb: input.weightLb ?? null,

    // The whole question on a two-fly rig. One field, three values.
    ateFlyId: input.ateFlyId ?? null,
    ateRole: input.ateRole ?? ate?.role ?? null,

    // Snapshot of the full rig at the moment of the eat, so a later change to
    // the stint cannot rewrite history.
    fliesOnRig: onRig,

    waterType: input.waterType ?? null,
    depthFt: input.depthFt ?? null,

    released: input.released ?? true,
    personalBest: input.personalBest ?? false,
    photos: input.photos ?? [],
    notes: input.notes ?? '',
  };
}

// ---------------------------------------------------------------------------
// Rig presets — the three-tap enabler
// ---------------------------------------------------------------------------
// Define the rig once at the truck; on the water a catch is species, size,
// which fly. Presets are user data, not content: they are YOUR setups, and
// they drift as you change what you fish.

export function makePreset(input = {}) {
  return {
    id: input.id ?? newId('p'),
    schemaVersion: USER_SCHEMA_VERSION,
    kind: 'preset',
    name: input.name ?? 'Untitled rig',
    rigId: input.rigId ?? null,             // -> content rigs.json
    setupId: input.setupId ?? null,         // -> user setups
    flies: (input.flies ?? []).map((f) => ({
      role: f.role, flyId: f.flyId, size: f.size ?? null,
    })),
    lastUsedAt: input.lastUsedAt ?? null,
    useCount: input.useCount ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Validation — loud on the things that silently ruin the data
// ---------------------------------------------------------------------------

export function validateSession(session) {
  const problems = [];
  if (!session.id) problems.push('session has no id');
  if (!session.startedAt) problems.push('session has no start time');

  for (const st of session.stints) {
    if (!st.rigId) problems.push(`stint ${st.id} has no rig`);
    if (st.endedAt && st.endedAt < st.startedAt) problems.push(`stint ${st.id} ends before it starts`);
    for (const f of st.flies) {
      if (!LOG_VOCAB.flyRole.includes(f.role)) problems.push(`stint ${st.id}: "${f.role}" is not a fly role`);
    }
  }

  // Overlapping stints would double-count hours, which quietly inflates every
  // rate downstream. Catch it here, not in the report.
  const ordered = [...session.stints].filter((s) => s.endedAt).sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  for (let i = 1; i < ordered.length; i++) {
    if (ordered[i].startedAt < ordered[i - 1].endedAt) {
      problems.push(`stints ${ordered[i - 1].id} and ${ordered[i].id} overlap — hours would be double-counted`);
    }
  }

  return problems;
}

export function validateCatch(c, session) {
  const problems = [];
  const stint = session?.stints.find((s) => s.id === c.stintId);
  if (!stint) problems.push(`catch ${c.id} points at a stint that is not in its session`);
  if (!c.ateFlyId) problems.push(`catch ${c.id} does not say which fly ate — that is the field the log exists for`);
  else if (stint && !stint.flies.some((f) => f.flyId === c.ateFlyId)) {
    problems.push(`catch ${c.id}: "${c.ateFlyId}" was not on the rig for that stint`);
  }
  if (stint && (c.at < stint.startedAt || (stint.endedAt && c.at > stint.endedAt))) {
    problems.push(`catch ${c.id} happened outside its stint`);
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Location blurring
// ---------------------------------------------------------------------------

export function blurGps({ lat, lon }, miles = 5) {
  const step = miles / 69;                       // ~69 statute miles per degree
  const round = (v) => Math.round(v / step) * step;
  return { lat: Number(round(lat).toFixed(4)), lon: Number(round(lon).toFixed(4)), blurred: true };
}
