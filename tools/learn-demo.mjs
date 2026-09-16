// Fly Box — the study cards, proved from the command line
// ---------------------------------------------------------------------------
//   node content/build.mjs && node tools/learn-demo.mjs
//
// Renders every concept in every dressing and builds its multiple choice,
// then checks the things that would make a card unfair: a missing picture
// where one exists, two right answers, a duplicate option, or a distractor
// from the wrong water. Runs in `npm run check`.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCard, choicesFor } from '../app/src/content/query.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const bundle = JSON.parse(readFileSync(resolve(HERE, '..', 'app', 'src', 'content', 'bundle.json'), 'utf8'));

let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed += 1; console.log(`  FAIL  ${msg}`); } };
const line = (s = '') => console.log(s);

const counts = { faces: 0, withImage: 0, choice: 0, rate: 0, byKind: {} };
const CHOICE_KINDS = new Set(['match', 'scenario', 'match-retrieve', 'organism-stage', 'fly', 'retrieve', 'presence']);

for (const concept of bundle.concepts) {
  for (const variant of [0, 1, 2]) {
    const face = renderCard(bundle, concept, { variant });
    ok(face, `${concept.id}: no face for variant ${variant}`);
    if (!face) continue;
    counts.faces += 1;
    counts.byKind[face.kind] = (counts.byKind[face.kind] ?? 0) + 1;

    // 1. Pictures: every organism-stage, match and scenario card has one
    //    (the content carries an image for every stage), every fly card too.
    if (['organism-stage', 'match', 'scenario', 'fly', 'match-retrieve'].includes(face.kind)) {
      ok(face.image, `${concept.id} [${face.kind}]: no question picture`);
    }
    if (face.image) counts.withImage += 1;

    // 2. Choices
    const ch = choicesFor(bundle, concept, face);
    if (face.kind === 'knot' || face.kind === 'rig') {
      ok(ch === null, `${concept.id}: a ${face.kind} should not be multiple choice`);
      counts.rate += 1;
      continue;
    }
    if (!CHOICE_KINDS.has(face.kind)) continue;
    ok(ch, `${concept.id} [${face.kind}]: no choices built`);
    if (!ch) continue;
    counts.choice += 1;

    const right = ch.options.filter((o) => o.correct);
    ok(right.length === 1, `${concept.id}: ${right.length} options marked correct`);
    ok(ch.options.length >= 3, `${concept.id}: only ${ch.options.length} options`);
    ok(new Set(ch.options.map((o) => o.label)).size === ch.options.length, `${concept.id}: duplicate option label`);
    ok(new Set(ch.options.map((o) => o.key)).size === ch.options.length, `${concept.id}: duplicate option key`);
    ok(right[0]?.key === ch.answerKey, `${concept.id}: answerKey does not point at the correct option`);

    // Deterministic: the same card shuffles the same way every time.
    const again = choicesFor(bundle, concept, face);
    ok(again.options.map((o) => o.key).join() === ch.options.map((o) => o.key).join(), `${concept.id}: options reshuffle between renders`);

    if (face.kind === 'match' || face.kind === 'scenario') {
      const match = bundle.byId.matches[concept.refs.match];
      const alsoRight = new Set((bundle.index.matchesByOrganismStage[`${match.organism}.${match.stage}`] ?? []).map((id) => bundle.byId.matches[id]?.fly));
      const fly = bundle.byId.flies[match.fly];
      for (const o of ch.options.filter((x) => !x.correct)) {
        const d = bundle.byId.flies[o.key];
        ok(!alsoRight.has(o.key), `${concept.id}: distractor ${o.key} also imitates ${match.organism}.${match.stage} — a second right answer`);
        ok(d.family !== fly.family, `${concept.id}: distractor ${o.key} is the same family as the answer`);
        ok(d.water === fly.water || d.water === 'both' || fly.water === 'both', `${concept.id}: distractor ${o.key} is from the other water`);
        ok(o.image, `${concept.id}: fly option ${o.key} has no picture`);
      }
    }
    if (face.kind === 'organism-stage') {
      const org = bundle.byId.organisms[concept.refs.organism];
      for (const o of ch.options.filter((x) => !x.correct)) {
        const d = bundle.byId.organisms[o.key.split('.')[0]];
        ok(d.water === org.water, `${concept.id}: distractor ${o.key} from the other water`);
      }
    }
  }
}

line();
line(`  ${bundle.concepts.length} concepts × 3 dressings → ${counts.faces} faces`);
line(`  ${counts.withImage} faces carry a question picture`);
line(`  ${counts.choice} multiple choice · ${counts.rate} reveal-and-rate (knots, leaders)`);
line(`  by kind: ${Object.entries(counts.byKind).map(([k, v]) => `${k} ${v}`).join(' · ')}`);

// A worked example, for eyes.
const sample = bundle.concepts.find((c) => c.id === 'match:blue-winged-olive.dun>parachute-adams') ?? bundle.concepts.find((c) => c.kind === 'match');
const face = renderCard(bundle, sample, { variant: 1 });
const ch = choicesFor(bundle, sample, face);
line();
line(`  ${face.seeing}`);
line(`  ${face.question}`);
for (const o of ch.options) line(`     ${o.correct ? '●' : '○'} ${o.label}${o.sub ? `  (${o.sub})` : ''}`);

line();
if (failed) { line(`  ${failed} assertion(s) failed`); process.exit(1); }
line('  all assertions passed');
line();
