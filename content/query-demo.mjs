// Fly Box — what the faceted match table can answer
// ---------------------------------------------------------------------------
//   node content/build.mjs && node content/query-demo.mjs
//
// A runnable proof, not app code — but it calls the SAME functions the app
// calls (app/src/content/query.js), so it cannot drift from what ships. It
// exists to demonstrate one claim: a trip-brief fly slate, a field-ID answer,
// and a generated quiz scenario are three readings of one table.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { slate, identify, scenarioCard, whatsOn } from '../app/src/content/query.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const bundle = JSON.parse(
  readFileSync(resolve(HERE, '..', 'app', 'src', 'content', 'bundle.json'), 'utf8'),
);

const name = (t, id) => bundle.byId[t]?.[id]?.name ?? id;
const line = (s = '') => console.log(s);
const rule = () => line('  ' + '-'.repeat(70));

line();
line('  1. TRIP BRIEF — Bahamas, bonefish, April, incoming tide, bright, 12 in');
rule();
const q = {
  region: 'bahamas', month: 4, species: 'bonefish',
  waterType: 'flat', tide: 'incoming', light: 'bright', depthIn: 12,
};
for (const m of slate(bundle, q).slice(0, 6)) {
  line(`  ${m.strength.padEnd(13)} ${name('flies', m.fly).padEnd(30)} ${m.hookSizes ? `#${m.hookSizes[0]}–${m.hookSizes[1]}` : ''}`);
  line(`  ${' '.repeat(13)} imitates ${name('organisms', m.organism)} (${m.stage})`);
}
line();
line('  What is around this month:');
for (const p of whatsOn(bundle, { region: 'bahamas', month: 4 })) {
  line(`     ${p.abundance.padEnd(8)} ${name('organisms', p.organism)}`);
}

line();
line('  2. FIELD ID — same table, asked backwards');
rule();
line('  "Idaho, October, olive mayfly nymph in the seine"');
for (const m of identify(bundle, 'blue-winged-olive', 'nymph', { region: 'idaho', month: 10 })) {
  line(`  ${m.strength.padEnd(13)} ${name('flies', m.fly).padEnd(30)} ${m.hookSizes ? `#${m.hookSizes[0]}–${m.hookSizes[1]}` : ''}`);
}

line();
line('  3. GENERATED JUDGMENT CARD — same table again');
rule();
for (const id of ['m-bwo-dun-para-adams', 'm-crab-merkin-olive']) {
  const card = scenarioCard(bundle, bundle.byId.matches[id]);
  line(`  Q  ${card.conditions.join(', ')}.`);
  line(`     You are seeing: ${card.seeing}`);
  line(`     ${card.question}`);
  line(`  A  ${card.answer}${card.size ? `, ${card.size}` : ''}`);
  line(`     ${card.because}`);
  line(`     rig: ${card.rigs.join(' or ')}`);
  line(`     concept: ${card.concept}   <- review state attaches HERE`);
  line();
}

rule();
line(`  ${bundle.counts.matches} match rules · ${bundle.concepts.length} concepts · 3 features, 1 table`);
line();
