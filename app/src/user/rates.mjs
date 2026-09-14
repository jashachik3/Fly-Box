// Fly Box — user layer: rates
// ---------------------------------------------------------------------------
// Decision made 2026-09-14: the log DESCRIBES, it does not infer. No model, no
// conditions-in-fly-out prediction. Rates, splits, filters, and `n` attached to
// everything — revisit inference when there are seasons of data behind it.
//
// Two rules are enforced here rather than left to the UI:
//
//   1. Every rate carries its sample. A number without `n` is a number that
//      will mislead you, and you already know what a 6-sample edge is worth.
//
//   2. Nothing under the threshold is ranked. It is reported, labelled, and
//      kept out of the ordering, so a fly you tried twice cannot top the list.

export const THRESHOLD = { fish: 5, hours: 3 };

const hours = (a, b) => (new Date(b) - new Date(a)) / 3.6e6;

// ---------------------------------------------------------------------------
// Effort — the denominator
// ---------------------------------------------------------------------------
// This is the whole reason sessions are logged and not just fish. A fly that
// was on the leader for nine hours and caught three is not the same fly as one
// that was on for twenty minutes and caught three.

export function effort(entries) {
  const byFly = new Map();
  const byRig = new Map();
  const byFlyRole = new Map();
  let total = 0;

  for (const { session } of entries) {
    for (const st of session.stints) {
      if (!st.endedAt) continue;
      const h = hours(st.startedAt, st.endedAt);
      if (h <= 0) continue;
      total += h;
      byRig.set(st.rigId, (byRig.get(st.rigId) ?? 0) + h);

      // A fly on the rig is a fly being fished, whatever its role. Both flies
      // on a two-fly rig get the full stint — they were both in the water.
      for (const f of st.flies) {
        byFly.set(f.flyId, (byFly.get(f.flyId) ?? 0) + h);
        const key = `${f.flyId}|${f.role}`;
        byFlyRole.set(key, (byFlyRole.get(key) ?? 0) + h);
      }
    }
  }

  return { byFly, byRig, byFlyRole, totalHours: total };
}

// ---------------------------------------------------------------------------
// Rates
// ---------------------------------------------------------------------------

function assemble(counts, effortMap, label) {
  const keys = new Set([...counts.keys(), ...effortMap.keys()]);
  const rows = [...keys].map((key) => {
    const fish = counts.get(key) ?? 0;
    const h = effortMap.get(key) ?? 0;
    const ranked = fish >= THRESHOLD.fish && h >= THRESHOLD.hours;
    return {
      [label]: key,
      fish,
      hours: Number(h.toFixed(2)),
      fishPerHour: h > 0 ? Number((fish / h).toFixed(2)) : null,
      ranked,
      why: ranked ? null : `n=${fish} fish over ${h.toFixed(1)}h — below ${THRESHOLD.fish} fish / ${THRESHOLD.hours}h`,
    };
  });

  // Ranked rows first and ordered; everything else sorted by effort so you can
  // see what is close to qualifying.
  const ok = rows.filter((r) => r.ranked).sort((a, b) => b.fishPerHour - a.fishPerHour);
  const thin = rows.filter((r) => !r.ranked).sort((a, b) => b.hours - a.hours);
  return { ranked: ok, insufficient: thin };
}

/** Fish per hour by fly — counted on the fly that actually ate. */
export function flyRates(entries, filter = () => true) {
  const e = effort(entries.filter(filter));
  const counts = new Map();
  for (const { session, catches } of entries.filter(filter)) {
    void session;
    for (const c of catches) {
      if (!c.ateFlyId) continue;
      counts.set(c.ateFlyId, (counts.get(c.ateFlyId) ?? 0) + 1);
    }
  }
  return assemble(counts, e.byFly, 'flyId');
}

export function rigRates(entries, filter = () => true) {
  const picked = entries.filter(filter);
  const e = effort(picked);
  const counts = new Map();
  const stintRig = new Map();
  for (const { session } of picked) for (const st of session.stints) stintRig.set(st.id, st.rigId);
  for (const { catches } of picked) {
    for (const c of catches) {
      const rig = stintRig.get(c.stintId);
      if (rig) counts.set(rig, (counts.get(rig) ?? 0) + 1);
    }
  }
  return assemble(counts, e.byRig, 'rigId');
}

/**
 * Point vs dropper vs dry. This is the split that only exists because the log
 * records which fly ate separately from which flies were on the leader.
 */
export function roleSplit(entries) {
  const counts = new Map();
  for (const { catches } of entries) {
    for (const c of catches) {
      if (!c.ateRole) continue;
      counts.set(c.ateRole, (counts.get(c.ateRole) ?? 0) + 1);
    }
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return [...counts.entries()]
    .map(([role, fish]) => ({ role, fish, share: total ? Number((fish / total).toFixed(2)) : 0 }))
    .sort((a, b) => b.fish - a.fish);
}

// ---------------------------------------------------------------------------
// Splits
// ---------------------------------------------------------------------------

const BANDS = [[0, 45], [45, 50], [50, 55], [55, 60], [60, 65], [65, 100]];
const bandFor = (t) => {
  if (t == null) return null;
  const b = BANDS.find(([lo, hi]) => t >= lo && t < hi);
  return b ? `${b[0]}–${b[1]}°F` : null;
};

export function splitBy(entries, dimension) {
  const key = {
    region: (s) => s.regionId,
    month: (s) => new Date(s.startedAt).getMonth() + 1,
    light: (s) => s.conditions?.light,
    wind: (s) => s.conditions?.wind,
    tide: (s) => s.conditions?.tide,
    waterTemp: (s) => bandFor(s.conditions?.waterF),
  }[dimension];
  if (!key) throw new Error(`no split "${dimension}"`);

  const groups = new Map();
  for (const entry of entries) {
    const k = key(entry.session) ?? 'unrecorded';
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(entry);
  }

  return [...groups.entries()].map(([value, group]) => {
    const e = effort(group);
    const fish = group.reduce((n, g) => n + g.catches.length, 0);
    return {
      [dimension]: value,
      sessions: group.length,
      fish,
      hours: Number(e.totalHours.toFixed(2)),
      fishPerHour: e.totalHours > 0 ? Number((fish / e.totalHours).toFixed(2)) : null,
      ranked: fish >= THRESHOLD.fish && e.totalHours >= THRESHOLD.hours,
    };
  }).sort((a, b) => b.fish - a.fish);
}

// ---------------------------------------------------------------------------
// The book vs your log
// ---------------------------------------------------------------------------
// Decision made 2026-09-14: show both, side by side, with n. This returns the
// two answers next to each other and takes no position on which is right —
// that is the point. The divergence is the feedback.

export function bookVsLog({ entries, contentSlate, filter = () => true }) {
  const mine = flyRates(entries, filter);
  const byFly = new Map([...mine.ranked, ...mine.insufficient].map((r) => [r.flyId, r]));

  const rows = contentSlate.map((m) => ({
    flyId: m.fly,
    book: m.strength,
    yours: byFly.get(m.fly) ?? null,
  }));

  // Flies you catch fish on that the slate never mentions. Often the most
  // interesting column on the page.
  const suggested = new Set(contentSlate.map((m) => m.fly));
  const yoursOnly = mine.ranked
    .filter((r) => !suggested.has(r.flyId))
    .map((r) => ({ flyId: r.flyId, book: null, yours: r }));

  return { rows, yoursOnly };
}
