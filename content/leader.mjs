// Fly Box — the leader build sheet
// ---------------------------------------------------------------------------
// Turns a rig's leaderSections into something you can follow at a bench: what
// to cut, in what order, with which knot, how many turns, and which spools it
// takes. Pure and zero-dependency — the validator and the app both use it, and
// build.mjs bakes the answer into the bundle.
//
// Two pieces of real construction math live here.
//
// 1. CUT LENGTH. A finished 18 in section is not an 18 in cut: every knot eats
//    material, and far more of it is grip length than the knot actually
//    swallows. A 5x5 blood knot in .017 mono absorbs roughly a sixth of an inch
//    of line; the rest of the three inches you allow is what you need to hold
//    on to. Nobody publishes a measured table for this, so each knot carries a
//    RANGE and the sheet quotes a range. A single number would be false
//    precision dressed up as fact.
//
// 2. WHETHER THE KNOT WILL EVEN CLOSE. Gary Borger's rule: an even blood knot
//    seats up to a 0.002 in difference in diameter. Past that the thin side
//    draws up before the heavy side and the knot never properly closes — it
//    slips under load, which is how you lose a fish and blame the fly. For each
//    further 0.002 in, the thin side takes one more turn. Joining .020 to .014
//    is 0.006 in, 0.004 in of excess, two extra turns: the 5/7 blood knot.
//
// Pound test tells you none of this. Diameter does, which is why materials.json
// exists and why a section without a materialId gets a warning rather than a
// silent guess.

const round = (n, dp = 1) => Math.round(n * 10 ** dp) / 10 ** dp;
const inches = (ft) => ft * 12;

/** Feet for long runs, inches for short ones. The mixed units are convention. */
export const say = (inch) => (inch >= 24 ? `${round(inch / 12, 2)} ft` : `${round(inch)} in`);

export function buildSheet(rig, { materials = {}, knots = {} } = {}) {
  const sections = rig.leaderSections ?? [];
  const warnings = [];
  const flyKnot = knots[rig.knot] ?? null;

  const mat = (s) => (s.materialId ? materials[s.materialId] ?? null : null);
  const dia = (s) => mat(s)?.diameterIn ?? null;

  // -- junctions ----------------------------------------------------------
  // One per gap between sections. This is where a leader is actually won or
  // lost, so it gets its own pass rather than being folded into the cut list.

  const junctions = sections.slice(0, -1).map((s, i) => {
    const next = sections[i + 1];
    const knot = s.knotBelow ? knots[s.knotBelow] ?? null : null;
    const a = dia(s);
    const b = dia(next);
    const step = (a != null && b != null) ? round(Math.abs(a - b), 4) : null;

    const out = {
      index: i,
      above: s.material,
      below: next.material,
      knot: s.knotBelow ?? null,
      knotName: knot?.name ?? null,
      stepIn: step,
      turns: null,
      turnsNote: null,
    };

    if (!s.knotBelow) {
      warnings.push(`${rig.id}: no knot named between "${s.material}" and "${next.material}"`);
      return out;
    }
    if (step == null) return out;

    const tol = knot?.stepToleranceIn ?? null;
    const per = knot?.extraTurnPerStepIn ?? null;
    const base = knot?.defaultTurns ?? null;

    if (tol != null && step > tol) {
      if (per && base) {
        // Borger: one more turn on the thin side per further increment.
        const extra = Math.ceil((step - tol) / per);
        out.turns = { heavy: base, light: base + extra };
        out.turnsNote = `${base}/${base + extra} — the step is ${step} in, past the ${tol} in this knot seats evenly`;
      } else {
        out.turns = base ? { heavy: base, light: base } : null;
        warnings.push(
          `${rig.id}: ${knot?.name ?? s.knotBelow} joins a ${step} in step, past the ${tol} in it seats — use a surgeon's knot or add an intermediate section`,
        );
      }
    } else if (base) {
      out.turns = { heavy: base, light: base };
    }

    // Mono against fluorocarbon is its own problem: nylon swells when it wets
    // and slips against fluoro, so an even blood knot is the wrong choice
    // however well the diameters match.
    const ka = mat(s)?.kind;
    const kb = mat(next)?.kind;
    const monoish = (k) => k === 'mono' || k === 'hard-mono' || k === 'sighter';
    if (s.knotBelow === 'blood-knot' && ((monoish(ka) && kb === 'fluoro') || (ka === 'fluoro' && monoish(kb)))) {
      warnings.push(`${rig.id}: blood knot joins mono to fluorocarbon between "${s.material}" and "${next.material}" — a surgeon's knot holds better there`);
    }

    return out;
  });

  // -- cut list -----------------------------------------------------------
  // Each end that carries a knot needs material to tie it with. The top of the
  // leader counts too: it is either looped to the fly line or nail-knotted on.

  const topKnot = knots['perfection-loop'] ?? null;
  const rows = sections.map((s, i) => {
    const finished = inches(s.ft);
    const ends = [];

    if (i === 0) {
      if (s.source !== 'bought' && topKnot) ends.push({ why: 'loop to the fly line', knot: topKnot });
    } else {
      const above = knots[sections[i - 1].knotBelow];
      if (above) ends.push({ why: `${above.name} above`, knot: above });
    }

    const below = s.knotBelow ? knots[s.knotBelow] : (i === sections.length - 1 ? flyKnot : null);
    if (below) {
      ends.push({ why: i === sections.length - 1 ? `${below.name} to the fly` : `${below.name} below`, knot: below });
    }

    const lo = ends.reduce((a, e) => a + (e.knot.allowanceIn?.[0] ?? 0), 0);
    const hi = ends.reduce((a, e) => a + (e.knot.allowanceIn?.[1] ?? 0), 0);
    const m = mat(s);

    if (s.materialId && !m) warnings.push(`${rig.id}: section "${s.material}" points at a material that does not exist`);
    if (!s.materialId && s.source !== 'bought') warnings.push(`${rig.id}: section "${s.material}" has no materialId, so it has no diameter and cannot be checked`);

    return {
      order: i + 1,
      label: s.material,
      material: m?.name ?? null,
      materialId: s.materialId ?? null,
      source: s.source ?? 'built',
      lb: s.lb ?? null,
      x: s.x ?? null,
      diameterIn: m?.diameterIn ?? null,
      finishedIn: finished,
      allowanceIn: s.source === 'bought' ? null : [lo, hi],
      // A bought leader is not cut to length — it comes as it comes. Tying
      // tippet on does eat a little of its tip, but that is wear, not a cut.
      cutIn: s.source === 'bought' ? null : [round(finished + lo), round(finished + hi)],
      ends: ends.map((e) => e.why),
      knotBelow: s.knotBelow ?? (i === sections.length - 1 ? rig.knot ?? null : null),
    };
  });

  // -- spools -------------------------------------------------------------

  const spools = [];
  for (const r of rows) {
    if (r.source === 'bought') {
      spools.push({ kind: 'bought', name: r.material ?? r.label, materialId: r.materialId, forSections: [r.order] });
      continue;
    }
    const hit = spools.find((x) => x.materialId === r.materialId && x.kind === 'spool');
    if (hit) { hit.needIn[0] += r.cutIn[0]; hit.needIn[1] += r.cutIn[1]; hit.forSections.push(r.order); }
    else spools.push({ kind: 'spool', name: r.material ?? r.label, materialId: r.materialId, needIn: [...r.cutIn], forSections: [r.order] });
  }

  // -- IGFA ---------------------------------------------------------------
  // Hard limits measured on the FINISHED leader, which is exactly why the cut
  // list has to add allowance without letting the finished length drift over.

  const igfa = [];
  if (rig.igfa) {
    const cls = rows.find((r) => /class/i.test(r.label));
    const bite = rows.find((r) => /bite|shock/i.test(r.label));
    if (cls) {
      if (cls.finishedIn < 15) igfa.push(`class tippet is ${say(cls.finishedIn)} — IGFA wants at least 15 in, measured inside the knots`);
      if ((cls.lb ?? 0) > 20) igfa.push(`class tippet is ${cls.lb} lb — IGFA caps it at 20 lb`);
    }
    if (bite && bite.finishedIn > 12) {
      igfa.push(`bite tippet is ${say(bite.finishedIn)} — IGFA caps it at 12 in from the hook eye to the class tippet`);
    }
    if (bite && bite.finishedIn === 12) {
      igfa.push('bite tippet sits exactly on the 12 in limit — cut long, tie it, then measure the finished section');
    }
  }

  const totalFinished = rows.reduce((a, r) => a + r.finishedIn, 0);
  const built = rows.filter((r) => r.source !== 'bought');
  const totalCut = [
    round(built.reduce((a, r) => a + r.cutIn[0], 0)),
    round(built.reduce((a, r) => a + r.cutIn[1], 0)),
  ];

  return {
    rig: rig.id,
    rows,
    junctions,
    spools,
    igfa,
    warnings,
    totalFinishedIn: totalFinished,
    totalCutIn: totalCut,
    wastePct: totalCut[0] ? round(((totalCut[0] - built.reduce((a, r) => a + r.finishedIn, 0)) / totalCut[0]) * 100) : 0,
    allBought: built.length === 0,
  };
}
