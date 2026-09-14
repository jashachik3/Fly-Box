// Fly Box — knot panel sequences, drawn from knots.json
// ---------------------------------------------------------------------------
// One panel per step in the record, so the pictures and the words cannot drift
// apart: add a step to knots.json and the sheet grows a panel.
//
// The rules the panels follow, taken from how knot instruction is conventionally
// drawn and from what actually goes wrong when it is not:
//
//   · Fixed camera. Panel N+1 is panel N with ONE thing changed — same scale,
//     same position, same orientation. Rescaling between panels is the single
//     biggest cause of losing the thread.
//   · Working panels are drawn loose and open, with loops far larger than they
//     would really be. That is anatomically wrong and pedagogically necessary.
//     The last panel, and only the last panel, is drawn seated.
//   · Standing line: dark, thick, round-capped, running off the panel edge.
//     Tag end: lighter, thinner, flat-capped, with a visible cut. You can tell
//     them apart in greyscale and at a glance.
//   · Every crossing has an explicit depth. The halo does the occluding.
//   · Wrap counts are a loop parameter AND stated in the caption. Nobody should
//     have to count coils in a picture to get the number right.
//   · Arrows are the only orange thing, they show the NEXT move and never the
//     current state, and there are at most two in a panel.

import {
  svgDoc, grid, smooth, poly, arc, drawArcs, arrow, text, textBlock, hook,
  helixArcs, helixPoint, cutEnd, pair,
} from './svg.mjs';

const INK = 'var(--ink)';
const TAG = 'var(--strand-b)';
const HEAVY = 'var(--ink)';
const WS = 12;      // standing line
const WT = 8.5;     // tag end
const Y = 178;      // the working line, same in every panel of a sheet

const paint = (arcs, marks = []) => `${drawArcs(arcs)}\n${marks.filter(Boolean).join('\n')}`;

const label = (x, y, s, anchor = 'middle') => text(x, y, s, 't-knot', anchor);

// A panel note is centred, wrapped to the panel, and anchored by its LAST line
// — so a note written at the bottom of a panel stays inside it whether it turns
// out to be one line or three.
const PANEL = 340;
const LH = 23;
const note = (y, s, cls = 't-knot') => {
  const opts = { cls, anchor: 'middle', width: 34, lh: LH };
  const lines = textBlock(0, 0, s, opts).height / LH;
  return textBlock(PANEL / 2, y - (lines - 1) * LH, s, opts).svg;
};
const countNote = (y, s) => note(y, s, 't-count');

// ---------------------------------------------------------------------------
// Pitzen — the freshwater fly knot
// ---------------------------------------------------------------------------

function pitzen() {
  const EYE = [88, Y];
  const standing = () => arc(smooth([[352, Y - 9], [200, Y - 9], [120, Y - 7], [94, Y]]), 0,
    { w: WS, color: INK });
  const returnTag = () => arc(smooth([[94, Y], [116, Y + 14], [180, Y + 16], [250, Y + 16]]), 0,
    { w: WT, color: TAG, cap: 'butt' });

  // The wraps run FORWARD, away from the eye. Four turns is the house number.
  const AX_A = [160, Y - 8], AX_B = [276, Y - 8], TURNS = 4, R = 31, PH = 0.2;
  const coil = () => helixArcs(AX_A, AX_B, TURNS, R, { phase: PH, w: WT, color: TAG });
  const coilStart = helixPoint(AX_A, AX_B, TURNS, R, { phase: PH }, 0).p;
  const coilEnd = helixPoint(AX_A, AX_B, TURNS, R, { phase: PH }, 1).p;
  const intoCoil = () => arc(smooth([[94, Y], [118, Y + 16], [142, Y + 16], coilStart]), 1,
    { w: WT, color: TAG, cap: 'butt' });

  const hk = `<g transform="translate(${EYE[0]},${EYE[1]})">${hook(0, 0, { flip: true, scale: 0.92 })}</g>`;

  return [
    // 1
    paint([standing(), returnTag()], [
      hk,
      cutEnd(250, Y + 16, 0),
      arrow([[292, Y + 58], [246, Y + 42], [212, Y + 26]]),
      label(214, Y + 84, 'tag end'),
      label(214, 102, 'standing line'),
    ]),
    // 2
    paint([standing(), intoCoil(), ...coil()], [
      hk,
      cutEnd(coilEnd[0], coilEnd[1], Math.PI / 2),
      countNote(306, '4 turns'),
      arrow([[158, 86], [208, 78], [258, 86]]),
      note(330, 'forward, away from the eye'),
    ]),
    // 3
    paint([
      standing(), intoCoil(), ...coil(),
      arc(smooth([[coilEnd[0], coilEnd[1]], [288, 262], [180, 276], [116, 238], [110, Y + 6]]), 3,
        { w: WT, color: TAG, cap: 'butt' }),
    ], [
      hk,
      arrow([[152, 270], [120, 240], [110, 204]]),
      note(320, 'through the loop at the eye'),
    ]),
    // 4
    paint([
      standing(), intoCoil(), ...coil(),
      arc(smooth([[coilEnd[0], coilEnd[1]], [288, 262], [180, 276], [116, 238], [110, Y + 6]]), 3,
        { w: WT, color: TAG, cap: 'butt' }),
    ], [
      hk,
      arrow([[248, Y - 58], [312, Y - 52]]),
      arrow([[104, 118], [56, 112]]),
      label(280, Y - 80, 'pull'),
      label(170, 322, 'wet it first'),
    ]),
    // 5 — seated
    paint([
      arc(smooth([[352, Y - 8], [200, Y - 8], [150, Y - 8]]), 0, { w: WS, color: INK }),
      ...helixArcs([112, Y - 8], [166, Y - 8], 4, 15, { phase: 0.25, w: WT, color: TAG }),
      arc(poly([[166, Y + 4], [192, Y + 12]]), 2, { w: WT, color: TAG, cap: 'butt' }),
    ], [
      hk,
      cutEnd(192, Y + 12, 0.4),
      note(274, 'tight against the eye'),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// Non-slip mono loop — every saltwater fly, and every streamer
// ---------------------------------------------------------------------------

function nonSlipMonoLoop() {
  // The open overhand is the whole knot. Everything else is wraps.
  const overIn = () => arc(smooth([[-12, 150], [70, 150], [128, 152]]), 0, { w: WS, color: INK });
  const overTop = () => arc(smooth([[128, 152], [176, 128], [172, 92], [132, 80], [100, 104], [104, 138]]), 2,
    { w: WS, color: INK });
  const overUnder = () => arc(smooth([[104, 138], [110, 168], [140, 184]]), -2, { w: WS, color: INK });
  const outTag = () => arc(smooth([[140, 184], [192, 194], [236, 200]]), 0, { w: WT, color: TAG, cap: 'butt' });
  const overhand = () => [overIn(), overTop(), overUnder(), outTag()];

  const HK = `<g transform="translate(276,214)">${hook(0, 0)}</g>`;

  const toEye = () => arc(smooth([[140, 184], [200, 200], [262, 212]]), 0, { w: WT, color: TAG, cap: 'butt' });
  const backFromEye = () => arc(smooth([[262, 220], [206, 232], [156, 214], [138, 152]]), 3,
    { w: WT, color: TAG, cap: 'butt' });

  const AX_A = [98, 150], AX_B = [28, 150], TURNS = 4, R = 27, PH = 0.25;
  const coil = () => helixArcs(AX_A, AX_B, TURNS, R, { phase: PH, w: WT, color: TAG });
  const coilStart = helixPoint(AX_A, AX_B, TURNS, R, { phase: PH }, 0).p;
  const coilEnd = helixPoint(AX_A, AX_B, TURNS, R, { phase: PH }, 1).p;
  const intoCoil = () => arc(smooth([[138, 152], [120, 168], coilStart]), 3, { w: WT, color: TAG, cap: 'butt' });

  const loopFinished = () => [
    arc(smooth([[-12, 150], [60, 150], [112, 154]]), 0, { w: WS, color: INK }),
    ...helixArcs([58, 150], [112, 150], 4, 12, { phase: 0.25, w: WT, color: TAG }),
    arc(smooth([[112, 154], [168, 176], [214, 214], [244, 236]]), 0, { w: WT, color: TAG, cap: 'butt' }),
    arc(smooth([[112, 162], [172, 212], [216, 244], [250, 250]]), 0, { w: WT, color: TAG, cap: 'butt' }),
  ];

  return [
    // 1
    paint(overhand(), [
      label(210, 252, 'leave it open'),
      label(66, 120, 'standing line'),
      cutEnd(236, 200, 0.2),
    ]),
    // 2
    paint([overIn(), overTop(), overUnder(), toEye(), backFromEye()], [
      HK,
      arrow([[246, 252], [186, 244], [150, 200]]),
      note(288, 'back in the same side it came out'),
    ]),
    // 3
    paint([overIn(), overTop(), overUnder(), toEye(), backFromEye(), intoCoil(), ...coil()], [
      HK,
      cutEnd(coilEnd[0], coilEnd[1], Math.PI / 2),
      countNote(300, 'more turns for light tippet, fewer for heavy'),
    ]),
    // 4
    paint([
      overIn(), overTop(), overUnder(), toEye(), backFromEye(), intoCoil(), ...coil(),
      arc(smooth([[coilEnd[0], coilEnd[1]], [60, 236], [122, 268], [150, 200], [140, 142]]), 4,
        { w: WT, color: TAG, cap: 'butt' }),
    ], [
      HK,
      arrow([[128, 250], [142, 200], [140, 156]]),
      note(312, 'same side again — this is the step that gets it wrong'),
    ]),
    // 5
    paint(loopFinished(), [
      `<g transform="translate(266,244)">${hook(0, 0)}</g>`,
      arrow([[70, 112], [22, 106]]),
      arrow([[196, 300], [236, 288]]),
      label(58, 90, 'pull'),
      note(324, 'close the loop to size'),
    ]),
    // 6
    paint(loopFinished(), [
      `<g transform="translate(266,244)">${hook(0, 0)}</g>`,
      cutEnd(120, 138, 0.6),
      label(130, 112, 'trimmed'),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// Blood knot — two lines of similar diameter
// ---------------------------------------------------------------------------

function bloodKnot() {
  const YA = Y - 12, YB = Y + 12;
  // The centre gap is the whole knot. Leave it physically clear on the drawing,
  // or the two tags appear to loop around the outside and go nowhere.
  const GAP = [170, Y];
  const lineA = (to = 244) => arc(poly([[-12, YA], [to, YA]]), 0, { w: WS, color: INK, cap: 'butt' });
  const lineB = (to = 96) => arc(poly([[352, YB], [to, YB]]), 0, { w: WS, color: TAG, cap: 'butt' });

  const AX = [198, YB], BX = [304, YB], T = 5, R = 26;
  const coilA = () => helixArcs(AX, BX, T, R, { phase: 0.25, w: WT, color: INK });
  const aStart = helixPoint(AX, BX, T, R, { phase: 0.25 }, 0).p;
  const aEnd = helixPoint(AX, BX, T, R, { phase: 0.25 }, 1).p;
  const aIn = () => arc(smooth([[150, YA], [176, YA + 10], aStart]), 1, { w: WT, color: INK, cap: 'butt' });

  const CX2 = [142, YA], DX = [36, YA], T2 = 5;
  const coilB = () => helixArcs(CX2, DX, T2, R, { phase: 0.75, w: WT, color: TAG });
  const bStart = helixPoint(CX2, DX, T2, R, { phase: 0.75 }, 0).p;
  const bEnd = helixPoint(CX2, DX, T2, R, { phase: 0.75 }, 1).p;
  const bIn = () => arc(smooth([[190, YB], [164, YB - 10], bStart]), 1, { w: WT, color: TAG, cap: 'butt' });

  // Each tag doubles back outside the wraps and dives into the centre slot —
  // from opposite sides, which is the thing that makes it a blood knot.
  const aThrough = () => arc(smooth([[aEnd[0], aEnd[1]], [320, 248], [238, 262], [188, 226], GAP]), 5,
    { w: WT, color: INK, cap: 'butt' });
  const bThrough = () => arc(smooth([[bEnd[0], bEnd[1]], [22, 108], [110, 94], [154, 130], GAP]), 5,
    { w: WT, color: TAG, cap: 'butt' });

  const half = () => [lineA(190), lineB(150), aIn(), ...coilA()];
  const both = () => [...half(), bIn(), ...coilB()];

  return [
    // 1
    paint([lineA(), lineB()], [
      cutEnd(244, YA, Math.PI / 2, 17, INK),
      cutEnd(96, YB, Math.PI / 2, 17, TAG),
      label(64, YA - 26, 'line A'),
      label(292, YB + 36, 'line B'),
      note(300, 'overlap them facing opposite ways'),
    ]),
    // 2
    paint([...half(), aThrough()], [
      countNote(292, '5 turns'),
      arrow([[206, 84], [258, 78], [306, 88]]),
      note(330, 'then back into the gap at the centre'),
    ]),
    // 3
    paint([...both(), aThrough()], [
      countNote(330, '5 turns the other way'),
      arrow([[140, 236], [92, 242], [48, 234]]),
    ]),
    // 4
    paint([...both(), aThrough(), bThrough()], [
      arrow([[218, 222], [186, 200], [176, 186]]),
      arrow([[126, 134], [158, 156], [166, 170]]),
      note(330, 'both tags into the same gap, from opposite sides'),
    ]),
    // 5
    paint([...both(), aThrough(), bThrough()], [
      arrow([[60, 152], [12, 146]]),
      arrow([[302, 196], [340, 202]]),
      note(330, 'wet it, then pull the STANDING lines — not the tags'),
    ]),
    // 6 — seated
    paint([
      arc(poly([[-12, Y], [126, Y]]), 0, { w: WS, color: INK, cap: 'butt' }),
      arc(poly([[352, Y], [214, Y]]), 0, { w: WS, color: TAG, cap: 'butt' }),
      ...helixArcs([126, Y], [166, Y], 4, 15, { phase: 0.25, w: WT, color: TAG }),
      ...helixArcs([214, Y], [174, Y], 4, 15, { phase: 0.25, w: WT, color: INK }),
    ], [
      note(258, 'the wraps roll together and bury both tags'),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// Double surgeon's — the cold-hands knot
// ---------------------------------------------------------------------------

function doubleSurgeons() {
  const YA = Y - 9, YB = Y + 9;
  const lineA = () => arc(poly([[-12, YA], [262, YA]]), 0, { w: WS, color: INK, cap: 'butt' });
  const lineB = () => arc(poly([[352, YB], [78, YB]]), 0, { w: WS, color: TAG, cap: 'butt' });

  // From here the two lines are handled as one doubled strand.
  const SPINE = [[-12, 168], [86, 170], [168, 150], [226, 108], [206, 66], [140, 66], [104, 108], [120, 160], [188, 196], [274, 208], [352, 214]];
  const [topRail, botRail] = pair(SPINE, 15);

  const loopPair = (z = 0) => [
    arc(smooth(topRail.slice(0, 8)), z, { w: WT, color: INK, cap: 'butt' }),
    arc(smooth(botRail.slice(0, 8)), z, { w: WT, color: TAG, cap: 'butt' }),
    arc(smooth(topRail.slice(7)), z + 2, { w: WT, color: INK, cap: 'butt' }),
    arc(smooth(botRail.slice(7)), z + 2, { w: WT, color: TAG, cap: 'butt' }),
  ];

  const passOnce = () => [
    arc(smooth([[300, 214], [250, 250], [176, 232], [166, 150], [168, 118]]), 5, { w: WT, color: INK, cap: 'butt' }),
    arc(smooth([[300, 228], [254, 264], [186, 246], [178, 152], [180, 120]]), 5, { w: WT, color: TAG, cap: 'butt' }),
  ];
  const passTwice = () => [
    arc(smooth([[168, 118], [198, 96], [216, 132], [190, 152], [172, 132]]), 6, { w: WT, color: INK, cap: 'butt' }),
    arc(smooth([[180, 120], [210, 100], [228, 138], [202, 158], [184, 138]]), 6, { w: WT, color: TAG, cap: 'butt' }),
  ];

  return [
    // 1
    paint([lineA(), lineB()], [
      cutEnd(262, YA, Math.PI / 2, 16, INK),
      cutEnd(78, YB, Math.PI / 2, 16, TAG),
      note(274, 'a long overlap — longer than feels necessary'),
    ]),
    // 2
    paint(loopPair(), [
      note(296, 'one loop, both lines together'),
      arrow([[236, 238], [196, 214], [172, 188]]),
    ]),
    // 3 — one panel, because the record makes both passes one step; the second
    // pass is what makes it "double", so it is drawn, counted and captioned.
    paint([...loopPair(), ...passOnce(), ...passTwice()], [
      arrow([[262, 262], [200, 240], [176, 196]]),
      countNote(314, 'through, then through again — twice'),
    ]),
    // 4
    paint([...loopPair(), ...passOnce(), ...passTwice()], [
      arrow([[60, 138], [16, 130]]),
      arrow([[300, 250], [340, 262]]),
      arrow([[150, 92], [128, 58]]),
      note(330, 'wet it and pull ALL FOUR ends together'),
    ]),
    // 5 — seated
    paint([
      arc(poly([[-12, Y], [138, Y]]), 0, { w: WS, color: INK, cap: 'butt' }),
      arc(poly([[352, Y], [202, Y]]), 0, { w: WS, color: TAG, cap: 'butt' }),
      ...helixArcs([138, Y], [202, Y], 3, 17, { phase: 0.25, w: WT, color: INK }),
      ...helixArcs([140, Y + 2], [200, Y + 2], 3, 12, { phase: 0.75, w: WT, color: TAG }),
    ], [
      note(254, 'a short even barrel, tags trimmed'),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// Perfection loop — the butt loop on a hand-built leader
// ---------------------------------------------------------------------------

function perfectionLoop() {
  const stand = () => arc(smooth([[-12, 210], [90, 210], [140, 206]]), 0, { w: WS, color: INK });
  const loop1Front = () => arc(smooth([[140, 206], [206, 190], [222, 140], [180, 112], [132, 128]]), 2,
    { w: WS, color: INK });
  const loop1Back = () => arc(smooth([[132, 128], [116, 166], [134, 200]]), -2, { w: WS, color: INK });
  const loop1 = () => [stand(), loop1Front(), loop1Back()];

  const loop2 = () => [
    arc(smooth([[134, 200], [176, 232], [244, 226], [262, 186], [232, 160], [186, 168]]), 3,
      { w: WT, color: TAG, cap: 'butt' }),
  ];
  const tagBetween = () => arc(smooth([[186, 168], [160, 164], [142, 168]]), 4, { w: WT, color: TAG, cap: 'butt' });

  const pulled = () => [
    arc(smooth([[-12, 210], [84, 208], [136, 202]]), 0, { w: WS, color: INK }),
    arc(smooth([[136, 202], [178, 176], [212, 132], [206, 84], [166, 66], [130, 90], [128, 140], [134, 186]]), 2,
      { w: WS, color: INK }),
  ];

  return [
    // 1
    paint(loop1(), [
      label(50, 186, 'standing line'),
      note(296, 'tag behind the standing line'),
      cutEnd(134, 200, Math.PI / 2),
    ]),
    // 2
    paint([...loop1(), ...loop2()], [
      note(330, 'a second, smaller loop in front of the first'),
      arrow([[150, 268], [210, 262], [252, 220]]),
    ]),
    // 3
    paint([...loop1(), ...loop2(), tagBetween()], [
      cutEnd(142, 168, Math.PI / 2),
      note(316, 'the tag lies BETWEEN the two loops'),
      arrow([[206, 140], [172, 150], [150, 162]]),
    ]),
    // 4
    paint([...loop1(), ...loop2(), tagBetween()], [
      arrow([[250, 206], [206, 172], [176, 148]]),
      note(316, 'push the second loop up through the first'),
    ]),
    // 5
    paint(pulled(), [
      arrow([[70, 246], [24, 254]]),
      arrow([[168, 46], [168, 16]]),
      note(318, 'wet it, then pull the new loop and the standing line apart'),
    ]),
    // 6
    paint(pulled(), [
      cutEnd(152, 194, 0.8),
      note(264, 'one loop, square to the line'),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// Nail knot — a vise-and-coffee-table knot
// ---------------------------------------------------------------------------

function nailKnot() {
  const flyLine = () => arc(poly([[-12, Y], [214, Y]]), 0, { w: 19, color: INK, cap: 'butt' });
  const tube = (show = true) => (show
    ? `<rect x="120" y="${Y + 14}" width="188" height="13" rx="6.5" fill="none" stroke="var(--ink-3)" stroke-width="3.5" class="art"/>`
    : '');
  const butt = () => arc(poly([[352, Y + 40], [250, Y + 40]]), 0, { w: 10, color: TAG, cap: 'butt' });

  const AX = [148, Y + 10], BX = [284, Y + 10], T = 6, R = 30;
  const coil = () => helixArcs(AX, BX, T, R, { phase: 0.25, w: 8, color: TAG });
  const cStart = helixPoint(AX, BX, T, R, { phase: 0.25 }, 0).p;
  const cEnd = helixPoint(AX, BX, T, R, { phase: 0.25 }, 1).p;
  const feed = () => arc(smooth([[352, Y + 40], [312, Y + 34], cEnd]), 1, { w: 8, color: TAG, cap: 'butt' });
  const through = () => arc(poly([[288, Y + 20], [128, Y + 20]]), 4, { w: 7.5, color: TAG, cap: 'butt' });

  const seated = () => [
    arc(poly([[-12, Y], [186, Y]]), 0, { w: 19, color: INK, cap: 'butt' }),
    arc(poly([[352, Y + 2], [214, Y + 2]]), 0, { w: 10, color: TAG, cap: 'butt' }),
    ...helixArcs([186, Y], [220, Y], 6, 14, { phase: 0.25, w: 7, color: TAG }),
  ];

  return [
    // 1
    paint([flyLine(), butt()], [
      tube(),
      label(60, Y - 34, 'fly line'),
      label(262, Y + 74, 'leader butt'),
      note(Y + 116, 'a tube, or a nail'),
    ]),
    // 2
    paint([flyLine(), feed(), ...coil()], [
      tube(),
      butt() && '',
      countNote(312, '6 or 7 turns, side by side — never crossing'),
      arrow([[170, 92], [220, 86], [268, 92]]),
    ]),
    // 3
    paint([flyLine(), feed(), ...coil(), through()], [
      tube(),
      arrow([[300, Y + 66], [220, Y + 62]]),
      note(316, 'back through the tube, then slide the tube out'),
    ]),
    // 4
    paint([flyLine(), feed(), ...coil(), through()], [
      arrow([[300, 96], [340, 90]]),
      arrow([[120, 268], [76, 276]]),
      note(320, 'snug it a little at a time, alternating ends'),
    ]),
    // 5
    paint(seated(), [
      note(246, 'seat hard, trim both tags, coat it if you want it to shoot'),
      cutEnd(214, Y - 12, 0.6),
    ]),
  ];
}

// ---------------------------------------------------------------------------
// Albright — class tippet to a heavy bite section
// ---------------------------------------------------------------------------

function albright() {
  // The heavy line is doubled into a long, narrow loop opening to the right.
  const loopPts = [[-12, Y - 22], [120, Y - 22], [236, Y - 20], [268, Y], [236, Y + 20], [120, Y + 22], [30, Y + 22]];
  const heavy = () => arc(smooth(loopPts), 0, { w: 14, color: HEAVY, cap: 'round' });

  const AX = [96, Y], BX = [232, Y], T = 10, R = 34;
  const coil = () => helixArcs(AX, BX, T, R, { phase: 0.25, w: 7.5, color: TAG });
  const cStart = helixPoint(AX, BX, T, R, { phase: 0.25 }, 0).p;
  const cEnd = helixPoint(AX, BX, T, R, { phase: 0.25 }, 1).p;
  const light = () => arc(smooth([[-12, Y + 74], [60, Y + 66], cStart]), 1, { w: 7.5, color: TAG, cap: 'butt' });
  const out = () => arc(smooth([[cEnd[0], cEnd[1]], [286, Y + 46], [330, Y + 58]]), 4,
    { w: 7.5, color: TAG, cap: 'butt' });

  const seated = () => [
    arc(smooth([[-12, Y - 9], [150, Y - 9], [196, Y - 4]]), 0, { w: 14, color: HEAVY }),
    arc(smooth([[196, Y + 4], [150, Y + 9], [104, Y + 9]]), 0, { w: 14, color: HEAVY }),
    ...helixArcs([104, Y], [176, Y], 10, 16, { phase: 0.25, w: 6.5, color: TAG }),
    arc(poly([[104, Y + 4], [-12, Y + 22]]), 0, { w: 7.5, color: TAG, cap: 'butt' }),
  ];

  return [
    // 1
    paint([heavy()], [
      note(Y - 50, 'the HEAVY line, doubled'),
      note(300, 'a long, narrow loop'),
    ]),
    // 2
    paint([heavy(), light(), ...coil()], [
      countNote(316, '10 turns, working toward the closed end of the loop'),
      arrow([[110, 74], [170, 68], [226, 76]]),
      label(48, Y + 96, 'light line'),
    ]),
    // 3
    paint([heavy(), light(), ...coil(), out()], [
      cutEnd(330, Y + 58, 0.3),
      note(322, 'out through the loop the same side it went in'),
    ]),
    // 4
    paint([heavy(), light(), ...coil(), out()], [
      arrow([[200, 62], [246, 74]]),
      arrow([[60, 286], [16, 294]]),
      note(326, 'slide the wraps down the loop first, THEN pull'),
    ]),
    // 5
    paint(seated(), [
      note(258, 'wraps packed against the closed end — they cannot slide off'),
      cutEnd(176, Y - 14, 0.6),
    ]),
  ];
}

// ---------------------------------------------------------------------------

const DRAW = {
  pitzen,
  'non-slip-mono-loop': nonSlipMonoLoop,
  'blood-knot': bloodKnot,
  'double-surgeons': doubleSurgeons,
  'perfection-loop': perfectionLoop,
  'nail-knot': nailKnot,
  albright,
};

export const canDraw = (id) => Boolean(DRAW[id]);

/**
 * One square, art-only SVG per panel — the reference we hand to an image model.
 *
 * Text, numbers and arrows are stripped out on purpose. Those are the parts a
 * model reliably ruins, and they are also the parts we already have exactly
 * right: they go back on top of whatever comes back. What is left is the thing
 * a model is genuinely good at — making line work look like line work — over
 * geometry it cannot wander away from.
 */
export function knotPanelRefs(knot) {
  const draw = DRAW[knot.id];
  if (!draw) return [];
  return draw().map((body, i) => ({
    index: i + 1,
    step: knot.steps?.[i] ?? '',
    svg: svgDoc({
      w: PANEL,
      h: PANEL,
      hideOverlay: true,
      bg: 'var(--bg)',
      title: `${knot.name} — step ${i + 1}, reference`,
      desc: knot.steps?.[i] ?? '',
      body,
    }),
  }));
}

/** @param panelImages  data URIs, one per panel; holes are fine. */
export function knotDiagram(knot, { panelImages = [] } = {}) {
  const draw = DRAW[knot.id];
  if (!draw) return null;

  const bodies = draw();
  const steps = knot.steps ?? [];
  // The panels ARE the steps. If they ever stop matching, say so loudly rather
  // than shipping a picture captioned with somebody else's instruction.
  if (bodies.length !== steps.length) {
    throw new Error(
      `knot "${knot.id}" has ${steps.length} steps but ${bodies.length} panels — ` +
      'add or remove a panel in tools/diagrams/knots.mjs to match knots.json',
    );
  }

  const panels = bodies.map((body, i) => ({
    body,
    caption: steps[i],
    image: panelImages[i] ?? null,
  }));
  const sub = [
    knot.strengthPct ? `~${knot.strengthPct}% of line strength` : null,
    knot.uses?.length ? knot.uses.join(', ').replace(/-/g, ' ') : null,
  ].filter(Boolean).join('  ·  ');

  const { w, h, body } = grid(panels, {
    cols: 2, size: 340, gutter: 24, capH: 96, pad: 26, titleH: 74,
    title: knot.name,
    subtitle: sub,
  });

  const footer = knot.failsWhen
    ? textBlock(26, h + 28, `Gets it wrong: ${knot.failsWhen}`, { cls: 't-knot', width: 76, lh: 24 })
    : { svg: '', height: 0 };

  return svgDoc({
    w,
    h: h + (footer.height ? footer.height + 34 : 10),
    bg: 'var(--panel)',
    light: panelImages.some(Boolean),
    title: `${knot.name} — how to tie it`,
    desc: `${knot.name}, in ${steps.length} steps. ${steps.join(' ')}`,
    body: `${body}\n${footer.svg}`,
  });
}
