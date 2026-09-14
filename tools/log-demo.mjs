// Fly Box — log layer demonstration and smoke test
// ---------------------------------------------------------------------------
//   node tools/log-demo.mjs
//
// Runs the whole user layer against an in-memory store and asserts the things
// that must not break. Exits non-zero on failure, so it works as a test.
//
// DATA NOTE: the 12 Sep 2026 Idaho session is real — it is the weekend the 19"
// cutthroat came from. Every other session below is SYNTHETIC, invented purely
// so the rate maths has something to chew on. Nothing here touches a real log.

import { createStore, memoryDriver } from '../app/src/user/store.mjs';
import { createLog, scriptSplit } from '../app/src/user/log.mjs';
import { flyRates, rigRates, roleSplit, splitBy, bookVsLog } from '../app/src/user/rates.mjs';
import { exportAll, importAll, toJson, exportFilename } from '../app/src/user/export.mjs';

const fails = [];
const check = (label, cond) => { if (!cond) fails.push(label); };
const line = (s = '') => console.log(s);
const rule = () => line('  ' + '-'.repeat(72));
const at = (day, hhmm) => `2026-${day}T${hhmm}:00.000Z`;

const store = createStore(memoryDriver());
const log = createLog(store);

// ---------------------------------------------------------------------------
// Presets — defined once at the truck, so a catch is three taps
// ---------------------------------------------------------------------------

const euro = await log.savePreset({
  name: 'Euro double-nymph',
  rigId: 'euro-double-nymph',
  flies: [
    { role: 'point', flyId: 'walts-worm', size: 14 },
    { role: 'dropper', flyId: 'pheasant-tail', size: 16 },
  ],
});

const dryDropper = await log.savePreset({
  name: 'Dry-dropper floating',
  rigId: 'dry-dropper-floating',
  flies: [
    { role: 'dry', flyId: 'elk-hair-caddis-tan', size: 14 },
    { role: 'dropper', flyId: 'walts-worm', size: 14 },
  ],
});

const perdigonRig = await log.savePreset({
  name: 'Euro — perdigon point',
  rigId: 'euro-double-nymph',
  flies: [
    { role: 'point', flyId: 'perdigon-olive', size: 16 },
    { role: 'dropper', flyId: 'pheasant-tail', size: 18 },
  ],
});

// ---------------------------------------------------------------------------
// The real session: Idaho, 12 September 2026
// ---------------------------------------------------------------------------
// The recommended slate is what the app would have suggested for Idaho in
// September. Recorded BEFORE fishing — that is what makes off-script visible.

await log.start({
  startedAt: at('09-12', '13:30'),
  regionId: 'idaho',
  waterId: 'id-seam',
  placeNote: 'South Fork',
  conditions: { airF: 52, waterF: 54, flowCfs: 1180, light: 'overcast', wind: 'light' },
  recommended: [
    { flyId: 'perdigon-olive', strength: 'first-choice', source: 'brief' },
    { flyId: 'pheasant-tail', strength: 'first-choice', source: 'brief' },
    { flyId: 'frenchie', strength: 'change-up', source: 'brief' },
  ],
  gps: { lat: 43.4712, lon: -111.4688 },
});

await log.useRig({ presetId: euro.id, at: at('09-12', '13:30') });
await log.addCatch({
  speciesId: 'cutthroat-trout',
  lengthIn: 19,
  ateFlyId: 'walts-worm',
  waterType: 'seam',
  depthFt: 3,
  personalBest: true,
  at: at('09-12', '14:42'),
  notes: 'Biggest cutthroat to date.',
});

await log.useRig({ presetId: dryDropper.id, at: at('09-12', '16:30') });
await log.addCatch({
  speciesId: 'rainbow-trout',
  lengthIn: 13,
  ateFlyId: 'walts-worm',
  at: at('09-12', '17:15'),
});
await log.end(at('09-12', '17:40'));


// ---------------------------------------------------------------------------
// SYNTHETIC sessions — invented, so the rates have a denominator to work with
// ---------------------------------------------------------------------------

const synthetic = [
  { day: '09-05', rig: euro, stint: ['12:00', '17:00'], fish: [['cutthroat-trout', 15, 'pheasant-tail', '13:10'], ['rainbow-trout', 11, 'walts-worm', '15:20']] },
  { day: '09-19', rig: perdigonRig, stint: ['11:00', '16:30'], fish: [['rainbow-trout', 14, 'perdigon-olive', '11:40'], ['cutthroat-trout', 16, 'pheasant-tail', '13:05'], ['rainbow-trout', 12, 'perdigon-olive', '15:50']] },
  { day: '09-26', rig: euro, stint: ['10:30', '15:30'], fish: [['cutthroat-trout', 17, 'walts-worm', '11:15'], ['cutthroat-trout', 13, 'walts-worm', '14:05']] },
  { day: '10-03', rig: perdigonRig, stint: ['11:00', '17:00'], fish: [['rainbow-trout', 15, 'perdigon-olive', '12:20'], ['rainbow-trout', 13, 'pheasant-tail', '13:40'], ['cutthroat-trout', 14, 'perdigon-olive', '14:55'], ['rainbow-trout', 16, 'perdigon-olive', '16:10']] },
  { day: '10-10', rig: euro, stint: ['10:00', '16:00'], fish: [['cutthroat-trout', 12, 'walts-worm', '11:30']] },
  { day: '10-17', rig: perdigonRig, stint: ['11:30', '16:00'], fish: [['rainbow-trout', 18, 'perdigon-olive', '12:45'], ['cutthroat-trout', 15, 'perdigon-olive', '14:20']] },
];

for (const s of synthetic) {
  await log.start({
    startedAt: at(s.day, s.stint[0]),
    regionId: 'idaho',
    waterId: 'id-riffle',
    placeNote: 'SAMPLE DATA',
    conditions: { waterF: 52, light: 'overcast', wind: 'light' },
    recommended: [
      { flyId: 'perdigon-olive', strength: 'first-choice', source: 'brief' },
      { flyId: 'pheasant-tail', strength: 'first-choice', source: 'brief' },
      { flyId: 'frenchie', strength: 'change-up', source: 'brief' },
    ],
  });
  await log.useRig({ presetId: s.rig.id, at: at(s.day, s.stint[0]) });
  for (const [speciesId, lengthIn, ateFlyId, hhmm] of s.fish) {
    await log.addCatch({ speciesId, lengthIn, ateFlyId, at: at(s.day, hhmm) });
  }
  await log.end(at(s.day, s.stint[1]));
}

// ---------------------------------------------------------------------------
// Read it back
// ---------------------------------------------------------------------------

const entries = await log.history();
const problems = await log.check();

line();
line('  FLY BOX — LOG LAYER');
rule();
line(`  ${entries.length} sessions · ${entries.reduce((n, e) => n + e.catches.length, 0)} fish · ${problems.length} integrity problems`);
line('  (1 real session, 12 Sep Idaho. The rest is sample data.)');
line();

line('  1. WHY SESSIONS, NOT JUST FISH');
rule();
const counts = new Map();
for (const { catches } of entries) for (const c of catches) counts.set(c.ateFlyId, (counts.get(c.ateFlyId) ?? 0) + 1);
line('  Raw catch count — the number a catch-only log would show you:');
for (const [fly, n] of [...counts].sort((a, b) => b[1] - a[1])) line(`     ${String(n).padStart(2)}  ${fly}`);
line();
const fr = flyRates(entries);
line('  Fish per hour, with the hours that fly was actually on the leader:');
for (const r of fr.ranked) {
  line(`     ${String(r.fishPerHour).padStart(4)} fish/h   ${r.flyId.padEnd(20)} n=${r.fish} over ${r.hours}h`);
}
for (const r of fr.insufficient) {
  line(`       —  not ranked   ${r.flyId.padEnd(20)} ${r.why}`);
}
line();

line('  2. POINT, DROPPER, OR DRY');
rule();
line('  Only answerable because the log records which fly ate, not just what was tied on:');
for (const r of roleSplit(entries)) line(`     ${String(r.fish).padStart(2)} fish  ${String(Math.round(r.share * 100)).padStart(3)}%  ${r.role}`);
line();

line('  3. BY RIG');
rule();
for (const r of rigRates(entries).ranked) line(`     ${String(r.fishPerHour).padStart(4)} fish/h   ${r.rigId.padEnd(22)} n=${r.fish} over ${r.hours}h`);
for (const r of rigRates(entries).insufficient) line(`       —  not ranked   ${r.rigId.padEnd(22)} ${r.why}`);
line();

line('  4. BY MONTH');
rule();
for (const r of splitBy(entries, 'month')) {
  line(`     ${['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][r.month]}   ${r.sessions} sessions · ${r.fish} fish · ${r.hours}h · ${r.fishPerHour ?? '—'} fish/h${r.ranked ? '' : '   (not ranked)'}`);
}
line();

line('  5. THE BOOK vs YOUR LOG');
rule();
// What the content slate recommends for Idaho in September, hard-coded here so
// the demo does not need the content bundle built.
const slate = [
  { fly: 'perdigon-olive', strength: 'first-choice' },
  { fly: 'pheasant-tail', strength: 'first-choice' },
  { fly: 'frenchie', strength: 'change-up' },
];
const { rows, yoursOnly } = bookVsLog({ entries, contentSlate: slate });
line('     fly                    book            yours');
for (const r of rows) {
  const y = r.yours ? `${r.yours.fishPerHour ?? '—'} fish/h  n=${r.yours.fish}${r.yours.ranked ? '' : '  (thin)'}` : 'never fished';
  line(`     ${r.flyId.padEnd(22)} ${String(r.book).padEnd(15)} ${y}`);
}
for (const r of yoursOnly) {
  line(`     ${r.flyId.padEnd(22)} ${'not on slate'.padEnd(15)} ${r.yours.fishPerHour} fish/h  n=${r.yours.fish}   <- off script, and working`);
}
line();
const split = scriptSplit(entries);
line(`     on script: ${split.onScript} fish   ·   off script: ${split.offScript} fish`);
line('     Both are shown. Neither is corrected. The divergence is the feedback.');
line();

line('  6. BACKUP');
rule();
const status = await log.backupStatus();
line(`     ${status.sessionsSinceExport} sessions since last export · due: ${status.due}`);
const payload = await exportAll(store);
line(`     exported ${exportFilename()} — ${(toJson(payload).length / 1024).toFixed(1)} KB, ${payload.counts.sessions} sessions, ${payload.counts.catches} catches`);

const fresh = createStore(memoryDriver());
const imported = await importAll(fresh, JSON.parse(toJson(payload)));
line(`     round-tripped into an empty store: ${imported.sessions} sessions, ${imported.catches} catches, ${imported.skipped} skipped`);
const reimported = await importAll(fresh, JSON.parse(toJson(payload)));
line(`     imported the same file again: ${reimported.skipped} skipped, nothing overwritten`);
line();

// ---------------------------------------------------------------------------
// Assertions
// ---------------------------------------------------------------------------

check('no integrity problems', problems.length === 0);
check('every catch names the fly that ate', entries.every((e) => e.catches.every((c) => c.ateFlyId)));
check('every catch carries its role', entries.every((e) => e.catches.every((c) => c.ateRole)));
check('location was blurred', (await store.sessions.all()).some((s) => s.gps?.blurred === true));
check('thin samples are not ranked', fr.ranked.every((r) => r.fish >= 5 && r.hours >= 3));
check('every rate carries n', [...fr.ranked, ...fr.insufficient].every((r) => typeof r.fish === 'number'));
check('export round-trips', imported.sessions === payload.counts.sessions);
check('re-import does not overwrite', reimported.sessions === 0 && reimported.skipped > 0);
check('off-script fish are detected', split.offScript > 0);

let rejected = false;
try {
  await log.start({ regionId: 'idaho' });
  await log.useRig({ presetId: euro.id });
  await log.addCatch({ speciesId: 'rainbow-trout', ateFlyId: 'gotcha-pink' });
} catch { rejected = true; }
check('a fly that was not on the rig is rejected', rejected);

rule();
if (fails.length) {
  line(`  FAILED — ${fails.length}`);
  for (const f of fails) line(`     ✗ ${f}`);
  line();
  process.exit(1);
}
line(`  OK — ${9 + 1} checks passed`);
line();
