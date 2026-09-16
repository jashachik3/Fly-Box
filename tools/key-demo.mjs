// Fly Box — the field key, proved from the command line
// ---------------------------------------------------------------------------
//   node content/build.mjs && node tools/key-demo.mjs
//
// Calls the same fieldKey() the ID tab calls, with assertions. If the trait
// table drifts from the content — a new stage kind with no traits, a colour
// nobody's family matches — this fails before the phone does.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fieldKey, identify, tripImages } from '../app/src/content/query.js';
import { traitsOf, QUESTIONS, QUESTION_ORDER, sizeWords } from '../app/src/content/traits.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const bundle = JSON.parse(readFileSync(resolve(HERE, '..', 'app', 'src', 'content', 'bundle.json'), 'utf8'));

let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed += 1; console.log(`  FAIL  ${msg}`); } };
const line = (s = '') => console.log(s);
const show = (rows, n = 8) => {
  for (const r of rows.slice(0, n)) {
    line(`     ${(r.around ?? '').padEnd(8)} ${`${r.organism.name} — ${r.stage.stage}`.padEnd(36)} ${sizeWords(r.sizeMm)}`);
  }
  if (rows.length > n) line(`     … ${rows.length - n} more`);
};

line();
line('  0. EVERY STAGE ANSWERS EVERY QUESTION IT SHOULD');
let stages = 0;
for (const org of bundle.tables.organisms) {
  for (const st of org.stages ?? []) {
    stages += 1;
    const t = traitsOf(org, st);
    ok(t.shape, `${org.id}.${st.stage}: no shape for kind ${org.kind}`);
    ok(t.size, `${org.id}.${st.stage}: no size`);
    if (t.shape?.[0] === 'insect') {
      ok(t.place && t.wings && t.tails, `${org.id}.${st.stage}: insect with no trait row for ${org.kind}.${st.stage}`);
    }
    if (st.colors?.length) ok(t.colour?.length, `${org.id}.${st.stage}: colours ${st.colors} match no family`);
    for (const q of QUESTION_ORDER) {
      const legal = QUESTIONS[q].options.map((o) => o[0]);
      for (const v of t[q] ?? []) ok(legal.includes(v), `${org.id}.${st.stage}: ${q}=${v} is not an option`);
    }
  }
}
line(`     ${stages} stages checked`);

line();
line('  1. NOTHING ANSWERED — everything fits, what is around comes first');
const all = fieldKey(bundle, {}, { region: 'idaho', month: 7, water: 'fresh' });
ok(all.length > 30, 'fresh key with no answers should list every freshwater stage');
ok(all[0].around === 'peak' || all[0].around === 'present', 'first row should be something that is around');
ok(all.every((r) => r.organism.water === 'fresh'), 'water filter leaked a saltwater organism');
show(all, 5);

line();
line('  2. IDAHO, JULY — "upright wings, long tails, riding on top, ¼–½ in"');
const dun = fieldKey(bundle, { shape: 'insect', place: 'surface', wings: 'upright', tails: 'long', size: 'small' }, { region: 'idaho', month: 7, water: 'fresh' });
ok(dun.length > 0, 'a mayfly dun description should match something');
ok(dun.every((r) => r.organism.kind === 'mayfly' && ['dun', 'emerger'].includes(r.stage.stage)), 'upright wings + long tails should only ever be a mayfly dun or emerger');
show(dun);

line();
line('  3. "tent wings, no tails, flying" — must be a caddis adult');
const cad = fieldKey(bundle, { shape: 'insect', wings: 'tent', tails: 'none', place: 'air' }, { water: 'fresh' });
ok(cad.length > 0 && cad.every((r) => r.organism.kind === 'caddis' && r.stage.stage === 'adult'), 'tent wings is the caddis signature');
show(cad);

line();
line('  4. "underwater, no wings, 2 short tails, over an inch" — big stonefly nymph');
const stone = fieldKey(bundle, { shape: 'insect', place: 'under', wings: 'none', tails: 'short', size: 'large' }, { water: 'fresh' });
ok(stone.length > 0 && stone.every((r) => r.organism.kind === 'stonefly' && r.stage.stage === 'nymph'), 'two short tails underwater is a stonefly nymph');
show(stone);

line();
line('  5. BAHAMAS, APRIL — "crab, about an inch, olive"');
const crab = fieldKey(bundle, { shape: 'crab', size: 'medium', colour: 'olive' }, { region: 'bahamas', month: 4, water: 'salt' });
ok(crab.length > 0 && crab.every((r) => /crab/.test(r.organism.id)), 'crab shape should only return crabs');
show(crab);
if (crab[0]) {
  const flies = identify(bundle, crab[0].organism.id, crab[0].stage.stage, { region: 'bahamas', month: 4 });
  ok(flies.length > 0, 'the top crab stage should have flies to tie on');
  line(`     → ${flies.slice(0, 3).map((m) => bundle.byId.flies[m.fly]?.name).join(', ')}`);
}

line();
line('  6. A contradiction returns nothing rather than something wrong');
const nonsense = fieldKey(bundle, { shape: 'fish', wings: 'upright' }, { water: 'salt' });
ok(nonsense.length === 0, 'a fish with upright wings should match nothing');
line(`     ${nonsense.length} results`);

line();
line('  7. Insect questions are marked insect-only, so the UI can hide them for a crab');
ok(QUESTIONS.place.insectOnly && QUESTIONS.wings.insectOnly && QUESTIONS.tails.insectOnly && !QUESTIONS.size.insectOnly, 'insectOnly flags');

line();
line('  8. TRIP IMAGE SET — what "Save pictures offline" fetches');
const bahImgs = tripImages(bundle, { region: 'bahamas', month: 4 });
const idImgs = tripImages(bundle, { region: 'idaho', month: 7 });
ok(bahImgs.length > 10 && bahImgs.length < 200, `bahamas April: ${bahImgs.length} pictures — a trip, not the whole app`);
ok(bahImgs.every((p) => /^assets\/(bugs\/)?[^/]+\.jpg$/.test(p)), 'paths are assets/<id>.jpg or assets/bugs/<id>-<stage>.jpg');
ok(new Set(bahImgs).size === bahImgs.length, 'no duplicates');
ok(!bahImgs.some((p) => /hendrickson|pheasant-tail/.test(p)), 'no trout flies in a Bahamas pack');
ok(idImgs.some((p) => p.startsWith('assets/bugs/')) && idImgs.some((p) => !p.startsWith('assets/bugs/')), 'idaho pack has both flies and bugs');
line(`     bahamas Apr: ${bahImgs.length} pictures (~${Math.round(bahImgs.length * 0.19)} MB) · idaho Jul: ${idImgs.length} (~${Math.round(idImgs.length * 0.19)} MB)`);

line();
if (failed) { line(`  ${failed} assertion(s) failed`); process.exit(1); }
line('  all assertions passed');
line();
