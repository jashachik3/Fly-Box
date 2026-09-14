// Fly Box — leader schematics, drawn from rigs.json
// ---------------------------------------------------------------------------
// One picture per rig, generated from the same leaderSections the validator
// already checks add up. Change a rig's tippet from 16 to 12 lb and the diagram
// changes on the next build — there is no second copy to forget.
//
// Conventions, all deliberate:
//   · vertical, fly line at the top, fly at the bottom
//   · stepped taper: thick to thin, one step per junction, because a knotted
//     leader IS stepped and the drawing should say so
//   · NOT to scale — a 12 ft butt against a 2 ft sighter drawn honestly makes
//     the interesting end invisible. Long sections carry a break mark and the
//     true length is always in the label
//   · left rail is what a section IS, right rail is how it CONNECTS. Keeping
//     those on separate sides is what lets you scan junctions on their own
//   · colour is only ever information: the sighter is the one coloured segment

import { svgDoc, smooth, poly, text, textBlock, hook, arc, drawArcs, esc } from './svg.mjs';

const CX = 300;              // the leader's centre line
const W = 730;
const L_RAIL = 258;          // spec labels, right-aligned
const R_RAIL = 336;          // knot labels, left-aligned

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * Apparent thickness. Real leaders run about 3.5:1 butt to tippet, which is too
 * subtle to see on a phone, so the ramp is exaggerated — and normalised WITHIN
 * one rig rather than across all of them. That means thickness is a statement
 * about this leader's own taper, never a claim that a 12 lb euro butt is as
 * heavy as a 40 lb flats butt. The pound test is on the label; the drawing is
 * about the step.
 */
function widthFor(section, index, maxLb) {
  if (section.lb != null && maxLb) {
    return clamp(6.5 + 7 * (section.lb / maxLb) ** 0.8, 6.5, 14);
  }
  return clamp(13.5 - index * 2.6, 6.5, 14);
}

/** Drawn length is compressed hard: a real foot count spread over a phone
 *  screen would give the butt everything and the tippet nothing. */
const drawnLength = (ft) => clamp(74 + Math.sqrt(ft) * 46, 90, 210);

const isSighter = (m = '') => /sighter/i.test(m);

const spec = (s) => {
  const bits = [];
  if (s.ft != null) bits.push(s.ft >= 1 ? `${s.ft} ft` : `${Math.round(s.ft * 12)} in`);
  if (s.x) bits.push(s.x);
  if (s.lb != null) bits.push(`${s.lb} lb`);
  return bits.join(' · ');
};

/** Two parallel slashes: "this section is longer than it is drawn." */
function breakMark(y, w) {
  const r = w * 1.9 + 7;
  const d = (dy) => `M${CX - r},${y + dy + 9} L${CX + r},${y + dy - 9}`;
  return `<g class="ov"><line x1="${CX - r}" y1="${y + 9}" x2="${CX + r}" y2="${y - 9}" stroke="var(--bg)" stroke-width="7"/>
<path d="${d(-7)}" stroke="var(--ink-3)" stroke-width="3" fill="none"/>
<path d="${d(7)}" stroke="var(--ink-3)" stroke-width="3" fill="none"/></g>`;
}

const knotNode = (y) =>
  `<g class="ov"><circle cx="${CX}" cy="${y}" r="7.5" fill="var(--bg)"/><circle cx="${CX}" cy="${y}" r="5.5" fill="var(--ink)"/></g>`;

// Two interlocking ovals. Instantly recognisable, and the one junction that is
// NOT a knot — so it must not be drawn as a dot.
const loopToLoop = (y) =>
  `<g class="ov"><ellipse cx="${CX}" cy="${y - 11}" rx="12" ry="19" fill="none" stroke="var(--ink)" stroke-width="4"/>
<ellipse cx="${CX}" cy="${y + 11}" rx="12" ry="19" fill="none" stroke="var(--ink)" stroke-width="4"/>
<path d="M${CX - 12},${y - 4} A12,19 0 0 0 ${CX + 12},${y - 4}" fill="none" stroke="var(--bg)" stroke-width="5"/></g>`;

// ---------------------------------------------------------------------------

export function leaderDiagram(rig, { knots = {}, flies = {}, image = null, reference = false } = {}) {
  const sections = rig.leaderSections ?? [];
  const maxLb = Math.max(0, ...sections.map((s) => s.lb ?? 0));
  const parts = [];
  const arcs = [];

  let y = 96;

  // -- title --------------------------------------------------------------
  parts.push(text(26, 42, rig.name, 't-title'));
  parts.push(text(26, 70, `${rig.lineWeight ? `${rig.lineWeight[0]}–${rig.lineWeight[1]} wt` : ''}${rig.leaderFt ? `  ·  ${rig.leaderFt} ft leader` : ''}${sections.length ? `  ·  ${sections.length} sections` : ''}`, 't-sub'));

  // -- fly line -----------------------------------------------------------
  const lineTop = y;
  const lineBottom = y + 66;
  arcs.push(arc(poly([[CX, lineTop], [CX, lineBottom]]), 0, { w: 20, color: 'var(--ink)', cap: 'butt', halo: false }));
  parts.push(text(L_RAIL, lineTop + 34, 'FLY LINE', 't-end', 'end'));
  const lineWrap = textBlock(L_RAIL, lineTop + 60, rig.line ?? '', { cls: 't-sub', anchor: 'end', width: 24, lh: 23 });
  parts.push(lineWrap.svg);

  y = lineBottom;

  // -- the junction between line and leader -------------------------------
  // Hand-built leaders loop on; a nail-knotted butt does not. The rig's own
  // knot list is what decides which glyph is honest here.
  const lineKnot = (rig.knot && knots[rig.knot]?.uses?.includes('line-to-leader'))
    ? knots[rig.knot]
    : Object.values(knots).find((k) => k.uses?.includes('loop-to-loop'));
  const loops = !!lineKnot?.uses?.includes('loop-to-loop');
  if (loops) y += 22;
  parts.push(loops ? loopToLoop(y) : knotNode(y));
  parts.push(text(R_RAIL, y + 6, loops ? 'Loop to loop' : (lineKnot?.name ?? 'Nail knot'), 't-knot'));
  if (loops) y += 22;

  // -- leader sections ----------------------------------------------------
  const tippetKnotName = knots[rig.knot]?.name ?? null;
  let lastRun = null;   // where the final section starts and how long it is drawn

  sections.forEach((s, i) => {
    const w = widthFor(s, i, maxLb);
    const len = drawnLength(s.ft ?? 2);
    const top = y;
    const bottom = y + len;
    const color = isSighter(s.material) ? 'var(--sighter)' : 'var(--ink)';

    arcs.push(arc(poly([[CX, top], [CX, bottom]]), 0, { w, color, cap: 'butt', halo: false }));

    lastRun = { top, len };
    const mid = top + len / 2;
    parts.push(text(L_RAIL, mid - 4, spec(s), 't-spec', 'end'));
    const mat = textBlock(L_RAIL, mid + 20, s.material + (isSighter(s.material) ? ' — strike detection' : ''),
      { cls: 't-sub', anchor: 'end', width: 22, lh: 22 });
    parts.push(mat.svg);

    // Sit the break well clear of the label rail, or the two read as one mark.
    if ((s.ft ?? 0) >= 5) parts.push(breakMark(top + len * 0.26, w));

    y = bottom;

    const lastSection = i === sections.length - 1;
    if (!lastSection) {
      parts.push(knotNode(y));
      const join = Object.values(knots).find((k) => k.uses?.includes('leader-to-tippet'));
      // Wildly unequal diameters want a different knot, and the tarpon rig is
      // exactly that case. Say so on the diagram rather than in a footnote.
      const next = sections[i + 1];
      const gap = Math.abs((s.lb ?? 0) - (next.lb ?? 0));
      const heavy = Object.values(knots).find((k) => k.uses?.includes('bite-tippet'));
      const pick = (gap >= 30 && heavy) ? heavy : join;
      parts.push(text(R_RAIL, y + 6, pick?.name ?? 'Blood knot', 't-knot'));
    }
  });

  // -- droppers -----------------------------------------------------------
  const roles = (rig.flies ?? []).map((f) => f.role);
  const dropper = (rig.flies ?? []).find((f) => f.role === 'dropper');
  const hasDry = roles.includes('dry');

  if (dropper && !hasDry) {
    // Tag dropper: it comes off ABOVE the point fly, on the tag of a knot.
    const ty = lastRun ? lastRun.top + lastRun.len * 0.42 : y - 90;
    const stub = [[CX, ty], [CX + 46, ty + 24], [CX + 84, ty + 46]];
    arcs.push(arc(smooth(stub), 0, { w: 4.4, color: 'var(--ink)', cap: 'butt' }));
    parts.push(knotNode(ty));
    parts.push(`<g transform="translate(${CX + 88},${ty + 52}) scale(0.62)">${hook(0, 0)}</g>`);
    parts.push(text(CX + 96, ty + 16, 'DROPPER', 't-end'));
  }

  // -- terminal fly -------------------------------------------------------
  parts.push(knotNode(y));
  parts.push(text(R_RAIL, y + 6, tippetKnotName ?? 'Tippet knot', 't-knot'));

  const flyY = y + 46;
  arcs.push(arc(poly([[CX, y], [CX, flyY]]), 0, { w: 4.6, color: 'var(--ink)', cap: 'butt', halo: false }));
  parts.push(`<g transform="translate(${CX - 6},${flyY}) scale(0.9)">${hook(0, 0)}</g>`);
  const terminal = (rig.flies ?? []).find((f) => f.role === 'dry' || f.role === 'single' || f.role === 'point');
  parts.push(text(L_RAIL, flyY + 6, (terminal?.role ?? 'fly').toUpperCase(), 't-end', 'end'));
  if (terminal?.notes) {
    parts.push(textBlock(L_RAIL, flyY + 30, terminal.notes, { cls: 't-sub', anchor: 'end', width: 27, lh: 21 }).svg);
  }

  // A dry-dropper hangs its nymph off the hook bend, below the dry — drawing it
  // above would teach the rig backwards.
  let bottomY = flyY + 110;
  if (dropper && hasDry) {
    const bend = [CX + 46, flyY + 40];
    const stub = [[bend[0], bend[1]], [bend[0] + 20, bend[1] + 62], [bend[0] + 4, bend[1] + 118]];
    arcs.push(arc(smooth(stub), 0, { w: 4.2, color: 'var(--ink)', cap: 'butt' }));
    parts.push(`<g transform="translate(${bend[0] + 2},${bend[1] + 126}) scale(0.62)">${hook(0, 0)}</g>`);
    parts.push(text(L_RAIL, bend[1] + 132, 'DROPPER', 't-end', 'end'));
    parts.push(textBlock(L_RAIL, bend[1] + 156, dropper.notes ?? 'Off the hook bend.',
      { cls: 't-sub', anchor: 'end', width: 27, lh: 21 }).svg);
    bottomY = bend[1] + 216;
  }

  // -- footer -------------------------------------------------------------
  const tagNote = (dropper && !hasDry && dropper.notes) ? `Dropper: ${dropper.notes}` : null;
  if (tagNote) {
    const t = textBlock(26, bottomY + 14, tagNote, { cls: 't-cap', width: 64, lh: 25 });
    parts.push(t.svg);
    bottomY += 14 + t.height;
  }
  if (rig.useWhen) {
    const f = textBlock(26, bottomY + 14, `When: ${rig.useWhen}`, { cls: 't-cap', width: 64, lh: 25 });
    parts.push(f.svg);
    bottomY += 14 + f.height;
  }
  parts.push(text(26, bottomY + 26, 'Not to scale — lengths are on the labels.', 't-knot'));

  const h = bottomY + 50;
  // The art layer sits under everything; a rendered image replaces it without
  // touching a single label, because the labels are the point of this drawing.
  const art = image
    ? `<image href="${image}" x="0" y="0" width="${W}" height="${h}" preserveAspectRatio="xMidYMid slice"/>`
    : '';
  const body = `<g${image ? ' class="has-img"' : ''}>${art}${drawArcs(arcs)}</g>\n${parts.join('\n')}`;

  return svgDoc({
    w: W,
    h,
    hideOverlay: reference,
    light: !!image,
    title: `${rig.name} — leader diagram`,
    desc: `Leader schematic for ${rig.name}: ${sections.map((s) => `${spec(s)} ${s.material}`).join(', then ')}.`,
    body,
  });
}
