// Fly Box — SVG primitives for instructional diagrams
// ---------------------------------------------------------------------------
// Why these are drawn and not generated as images:
//
//   A knot diagram carries exactly one piece of information — which strand is
//   in front at each crossing. Get one crossing backwards and you have drawn a
//   different knot, or an unstable one, and it still looks fine. Image models
//   are measurably weak at precisely that (occlusion ordering and counting a
//   requested number of coils), so a generated knot picture is a plausible lie.
//   Here, over/under is an explicit number on every arc and a wrap count is a
//   loop parameter, so the drawing is reproducible, diff-able, and checkable.
//
// The occlusion technique is the standard one: split every strand into arcs,
// sort by depth, and draw each arc with a background-coloured halo underneath
// it. Anything drawn earlier is cut away where a later arc crosses it.
//
// Zero dependencies.

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------
// Emitted as CSS custom properties inside the file, with a dark-scheme block.
// An SVG loaded through <img> still honours prefers-color-scheme, so the
// diagrams follow the phone rather than glowing white at 5am on the boat.
//
// No information is ever carried by colour alone: the standing line is dark
// AND thick AND round-capped, the tag end is lighter AND thinner AND flat-
// capped, arrows are the only thing that is ever orange.

const VARS_LIGHT = `
  :root {
    --bg: #ffffff;
    --ink: #17211c;
    --ink-2: #4a5852;
    --ink-3: #5a6a63;
    --rule: #d2dad3;
    --strand-b: #14605b;
    --action: #9c4514;
    --sighter: #b8860b;
    --panel: #f7f9f6;
  }
`;

const VARS_DARK = `
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #141c18;
      --ink: #e4eae5;
      --ink-2: #a5b2ab;
      --ink-3: #7a8781;
      --rule: #263229;
      --strand-b: #5fc6b8;
      --action: #e4864b;
      --sighter: #d8a93a;
      --panel: #1a231e;
    }
  }
`;

const TYPE = `
  text {
    font-family: ui-sans-serif, -apple-system, "Segoe UI", Roboto, system-ui, sans-serif;
    fill: var(--ink);
  }
  .t-spec { font-size: 21px; font-weight: 600; }
  .t-sub { font-size: 18px; fill: var(--ink-2); }
  .t-knot { font-size: 18px; font-style: italic; fill: var(--ink-3); }
  .t-cap { font-size: 20px; fill: var(--ink-2); }
  .t-end { font-size: 17px; font-weight: 700; letter-spacing: 0.09em; fill: var(--ink-3); }
  .t-title { font-size: 30px; font-weight: 700; }
  .t-badge { font-size: 23px; font-weight: 700; fill: var(--bg); }
  .t-count { font-size: 19px; font-weight: 700; fill: var(--action); }
  /* A panel backed by a rendered image drops its own line work and keeps its
     text, numbers and arrows. Per-panel, so a half-generated set still reads. */
  .has-img .art { display: none }
`;

// Rendered artwork comes back on a white ground and cannot follow the phone into
// dark mode, so a diagram carrying any of it is drawn light-only — a printed
// page rather than a half-inverted one. Pure vector diagrams keep both schemes.
export const STYLE = VARS_LIGHT + VARS_DARK + TYPE;
export const STYLE_LIGHT = VARS_LIGHT + TYPE;

// Hide the overlay to make a reference image: the drawing alone, with nothing
// a model could garble. Hide the art to make a composite: our text and arrows
// laid back over whatever came back.
const HIDE_OV = '\n  .ov { display: none }\n';
const HIDE_ART = '\n  .art { display: none }\n';

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------

export function svgDoc({ w, h, title, desc, body, bg = 'var(--bg)', hideOverlay = false, hideArt = false, light = false }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
<style>${light ? STYLE_LIGHT : STYLE}${hideOverlay ? HIDE_OV : ''}${hideArt ? HIDE_ART : ''}</style>
<rect width="${w}" height="${h}" fill="${bg}"/>
${body}
</svg>
`;
}

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const n = (x) => (Math.round(x * 10) / 10);

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

/** Catmull-Rom through the points, emitted as cubic beziers. Smooth, and it
 *  actually passes through every control point — which matters when a point is
 *  "the centre of the hook eye". */
export function smooth(points, { closed = false, tension = 0.5 } = {}) {
  const p = points.map(([x, y]) => [x, y]);
  if (p.length < 2) return '';
  if (p.length === 2) return `M${n(p[0][0])},${n(p[0][1])} L${n(p[1][0])},${n(p[1][1])}`;

  const at = (i) => {
    if (closed) return p[(i + p.length) % p.length];
    return p[Math.max(0, Math.min(p.length - 1, i))];
  };

  let d = `M${n(p[0][0])},${n(p[0][1])}`;
  const last = closed ? p.length : p.length - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2, p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2];
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2, p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2];
    d += ` C${n(c1[0])},${n(c1[1])} ${n(c2[0])},${n(c2[1])} ${n(p2[0])},${n(p2[1])}`;
  }
  if (closed) d += ' Z';
  return d;
}

export const poly = (points) =>
  points.map(([x, y], i) => `${i ? 'L' : 'M'}${n(x)},${n(y)}`).join(' ');

// ---------------------------------------------------------------------------
// Arcs — the occlusion model
// ---------------------------------------------------------------------------
// An arc is a piece of strand with a depth. Sort by depth, draw each with a
// background-coloured halo first, and the over/under at every crossing comes
// out right by construction rather than by careful drawing.

export const arc = (d, z, opts = {}) => ({ d, z, ...opts });

// Halo width as a multiple of stroke width. The halo is what cuts the strand
// underneath at a crossing, so too wide and a coil's far side disappears
// entirely; too narrow and the crossing stops reading. 2.3 leaves a clear gap
// while keeping the back of every wrap visible.
const HALO = 2.3;

export function drawArcs(arcs, { halo = true } = {}) {
  const sorted = [...arcs].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));
  const out = [];
  for (const a of sorted) {
    if (!a.d) continue;
    const w = a.w ?? 11;
    const color = a.color ?? 'var(--ink)';
    const cap = a.cap ?? 'round';
    const dash = a.dash ? ` stroke-dasharray="${a.dash}"` : '';
    if (halo && a.halo !== false) {
      out.push(`<path d="${a.d}" fill="none" stroke="var(--bg)" stroke-width="${n(w * HALO)}" stroke-linecap="butt" stroke-linejoin="round"/>`);
    }
    out.push(`<path d="${a.d}" fill="none" stroke="${color}" stroke-width="${n(w)}" stroke-linecap="${cap}" stroke-linejoin="round"${dash}/>`);
  }
  return `<g class="art">\n${out.join('\n')}\n</g>`;
}

// ---------------------------------------------------------------------------
// Helix — how every wrap in every one of these knots is drawn
// ---------------------------------------------------------------------------
// A wrap is not decoration and not a squiggle: it is a strand orbiting an
// axis. Project that orbit, split it wherever it passes behind the axis, and
// the coil count is whatever integer you asked for — five turns is five turns,
// and the near/far halves are correct without anyone deciding them by eye.

/**
 * @param from    [x,y] start of the axis
 * @param to      [x,y] end of the axis
 * @param turns   how many full orbits
 * @param r       apparent radius of the coil
 * @param phase   where in the orbit the strand starts, in turns (0 = crossing
 *                the axis moving toward the viewer)
 * @param handed  +1 or -1 — which way the coil winds
 */
export function helix(from, to, turns, r, { phase = 0, handed = 1, steps = 13 } = {}) {
  const [x0, y0] = from;
  const [x1, y1] = to;
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;      // along the axis
  const px = -uy, py = ux;                 // across it

  const total = Math.max(8, Math.round(turns * steps));
  const pts = [];
  for (let i = 0; i <= total; i++) {
    const u = i / total;
    const th = 2 * Math.PI * (turns * u + phase) * handed;
    const off = Math.sin(th) * r;
    const depth = Math.cos(th);            // >0 = in front of the axis
    pts.push({
      p: [x0 + ux * len * u + px * off, y0 + uy * len * u + py * off],
      front: depth > 0,
    });
  }

  // Split into runs of constant depth sign, keeping one overlapping point at
  // each boundary so the arcs meet rather than leaving a gap.
  const runs = [];
  let cur = { front: pts[0].front, pts: [pts[0].p] };
  for (let i = 1; i < pts.length; i++) {
    cur.pts.push(pts[i].p);
    if (pts[i].front !== cur.front) {
      runs.push(cur);
      cur = { front: pts[i].front, pts: [pts[i].p] };
    }
  }
  runs.push(cur);

  return { runs, turns };
}

/** Where the coiling strand actually is at a given point along the axis —
 *  needed so the tag end can be joined to the first and last turn instead of
 *  being drawn near them and hoping. */
export function helixPoint(from, to, turns, r, { phase = 0, handed = 1 } = {}, u = 0) {
  const [x0, y0] = from;
  const [x1, y1] = to;
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const th = 2 * Math.PI * (turns * u + phase) * handed;
  const off = Math.sin(th) * r;
  return {
    p: [x0 + ux * len * u + -uy * off, y0 + uy * len * u + ux * off],
    front: Math.cos(th) > 0,
  };
}

/** The helix as arcs: behind the axis at z=-1, in front at z=+1. */
export function helixArcs(from, to, turns, r, opts = {}) {
  const { runs } = helix(from, to, turns, r, opts);
  const w = opts.w ?? 11;
  const color = opts.color ?? 'var(--strand-b)';
  return runs.map((run) => arc(smooth(run.pts, { tension: 0.5 }), run.front ? 1 : -1, {
    w, color, cap: 'butt',
  }));
}

// ---------------------------------------------------------------------------
// Marks
// ---------------------------------------------------------------------------

/** Filled triangular head. Arrows are the only orange thing in the file. */
export function arrow(points, { color = 'var(--action)', w = 4.5, head = 17 } = {}) {
  const p = points.map(([x, y]) => [x, y]);
  const a = p[p.length - 2];
  const b = p[p.length - 1];
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  // Stop the shaft short so it does not poke out of the head.
  const tipBack = [b[0] - Math.cos(ang) * head * 0.85, b[1] - Math.sin(ang) * head * 0.85];
  const shaft = [...p.slice(0, -1), tipBack];
  const hw = head * 0.42;
  const tri = [
    [b[0], b[1]],
    [b[0] - Math.cos(ang) * head + Math.cos(ang + Math.PI / 2) * hw,
     b[1] - Math.sin(ang) * head + Math.sin(ang + Math.PI / 2) * hw],
    [b[0] - Math.cos(ang) * head - Math.cos(ang + Math.PI / 2) * hw,
     b[1] - Math.sin(ang) * head - Math.sin(ang + Math.PI / 2) * hw],
  ];
  return `<g class="ov"><path d="${smooth(shaft)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>
<path d="${poly(tri)} Z" fill="${color}"/></g>`;
}

export const text = (x, y, s, cls = 't-sub', anchor = 'start', extra = '') =>
  `<text x="${n(x)}" y="${n(y)}" class="${cls} ov" text-anchor="${anchor}"${extra}>${esc(s)}</text>`;

/** Wrap to a width in characters, returning one <text> per line. */
export function textBlock(x, y, s, { cls = 't-cap', anchor = 'start', width = 34, lh = 26 } = {}) {
  const words = String(s).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (line && (line + ' ' + word).length > width) { lines.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return {
    height: lines.length * lh,
    svg: lines.map((l, i) => text(x, y + i * lh, l, cls, anchor)).join('\n'),
  };
}

export const badge = (x, y, label, r = 19) =>
  `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="var(--ink)" class="ov"/>
${text(x, y + 8, String(label), 't-badge', 'middle')}`;

/** A brace with a count, for "× 5 turns" where drawing ten loops would be worse. */
export function countMark(x, y, label) {
  return text(x, y, label, 't-count', 'middle');
}

/** The tag end gets a visible cut. The standing part runs off the panel. */
export const cutEnd = (x, y, angle, len = 15, color = 'var(--strand-b)') => {
  const a = angle + Math.PI / 2;
  return `<line x1="${n(x - Math.cos(a) * len / 2)}" y1="${n(y - Math.sin(a) * len / 2)}" x2="${n(x + Math.cos(a) * len / 2)}" y2="${n(y + Math.sin(a) * len / 2)}" stroke="${color}" stroke-width="3.5" stroke-linecap="round" class="ov"/>`;
};

/** Hook: eye, shank, bend, point. A silhouette — the fly is not the subject. */
export function hook(x, y, { scale = 1, flip = false } = {}) {
  const s = scale;
  const f = flip ? -1 : 1;
  const eyeR = 11 * s;
  const shank = [
    [x + f * eyeR * 1.5, y],
    [x + f * 50 * s, y],
  ];
  const bend = [
    [x + f * 50 * s, y],
    [x + f * 70 * s, y + 4 * s],
    [x + f * 76 * s, y + 24 * s],
    [x + f * 58 * s, y + 34 * s],
    [x + f * 42 * s, y + 26 * s],
    [x + f * 39 * s, y + 13 * s],
  ];
  return `<g class="art"><circle cx="${n(x)}" cy="${n(y)}" r="${n(eyeR)}" fill="none" stroke="var(--ink-2)" stroke-width="${n(4.4 * s)}"/>
<path d="${poly(shank)}" fill="none" stroke="var(--ink-2)" stroke-width="${n(4.4 * s)}" stroke-linecap="round"/>
<path d="${smooth(bend)}" fill="none" stroke="var(--ink-2)" stroke-width="${n(4.4 * s)}" stroke-linecap="round"/></g>`;
}

// ---------------------------------------------------------------------------
// Panels
// ---------------------------------------------------------------------------

/**
 * Lay panels out in a grid. Every panel is the same box, the knot sits in the
 * same place at the same scale in all of them, and the number is always in the
 * same corner — panel N+1 should look like panel N with one thing changed.
 */
export function grid(panels, {
  cols = 2, size = 340, gutter = 22, capH = 86, pad = 26, titleH = 64, title = '', subtitle = '',
} = {}) {
  const imageLayer = (href) => (href
    ? `<image href="${href}" x="0" y="0" width="${size}" height="${size}" preserveAspectRatio="xMidYMid slice"/>`
    : '');
  const rows = Math.ceil(panels.length / cols);
  const w = pad * 2 + cols * size + (cols - 1) * gutter;
  const h = pad * 2 + titleH + rows * (size + capH) + (rows - 1) * gutter;

  const parts = [`<defs><clipPath id="pclip"><rect width="${size}" height="${size}" rx="14"/></clipPath></defs>`];
  if (title) parts.push(text(pad, pad + 32, title, 't-title'));
  if (subtitle) parts.push(text(pad, pad + 58, subtitle, 't-sub'));

  panels.forEach((p, i) => {
    const cx = pad + (i % cols) * (size + gutter);
    const cy = pad + titleH + Math.floor(i / cols) * (size + capH + gutter);
    const cap = textBlock(cx + 2, cy + size + 30, p.caption, { width: Math.round(size / 10.8) });
    parts.push(`<g transform="translate(${n(cx)},${n(cy)})">
<rect width="${size}" height="${size}" rx="14" fill="var(--bg)" stroke="var(--rule)" stroke-width="1.5"/>
<g clip-path="url(#pclip)"${p.image ? ' class="has-img"' : ''}>${imageLayer(p.image)}${p.body}</g>
<rect width="${size}" height="${size}" rx="14" fill="none" stroke="var(--rule)" stroke-width="1.5"/>
${badge(30, 32, i + 1)}
</g>
${cap.svg}`);
  });

  return { w, h, body: parts.join('\n') };
}

/** Two parallel strands following one path — a doubled line, as in a
 *  surgeon's knot, where the pair is the thing being tied. */
export function pair(points, sep = 11) {
  const a = [], b = [];
  for (let i = 0; i < points.length; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[Math.min(points.length - 1, i + 1)];
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
    const l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l, ny = dx / l;
    a.push([points[i][0] + nx * sep / 2, points[i][1] + ny * sep / 2]);
    b.push([points[i][0] - nx * sep / 2, points[i][1] - ny * sep / 2]);
  }
  return [a, b];
}
