// Fly Box — live conditions, proved from the command line
// ---------------------------------------------------------------------------
//   node tools/conditions-demo.mjs          offline: fixtures + assertions (runs in `npm run check`)
//   node tools/conditions-demo.mjs --live   also calls NOAA, USGS and Open-Meteo for every region
//
// The offline half feeds recorded responses through the same parsing the app
// uses, so a change to tideStage() or the USGS picker fails here first. The
// live half is for eyes: it prints what each region gets right now.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  tideStage, wallClock, lightFrom, windFrom, compass, conditionsFor, toSessionConditions,
  enricherFor, tideLine,
} from '../app/src/live/conditions.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const bundle = JSON.parse(readFileSync(resolve(HERE, '..', 'app', 'src', 'content', 'bundle.json'), 'utf8'));
const LIVE = process.argv.includes('--live');

let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed += 1; console.log(`  FAIL  ${msg}`); } };
const line = (s = '') => console.log(s);

// -- fixtures: real responses captured 16 Sep 2026 ---------------------------

const NOAA = {
  predictions: [
    { t: '2026-09-16 05:50', v: '0.535', type: 'L' }, { t: '2026-09-16 12:18', v: '3.159', type: 'H' },
    { t: '2026-09-16 18:41', v: '0.77', type: 'L' }, { t: '2026-09-17 00:33', v: '2.542', type: 'H' },
    { t: '2026-09-17 06:34', v: '0.686', type: 'L' }, { t: '2026-09-17 13:08', v: '3.008', type: 'H' },
  ],
};

const usgsSeries = (code, value, unit) => ({
  sourceInfo: { siteName: 'DAVIDSON RIVER NEAR BREVARD, NC' },
  variable: { variableCode: [{ value: code }], noDataValue: -999999, unit: { unitCode: unit } },
  values: [{ value: [{ value, qualifiers: ['P'], dateTime: '2026-09-16T14:30:00.000-04:00' }] }],
});
const USGS = { value: { timeSeries: [usgsSeries('00010', '21.7', 'deg C'), usgsSeries('00060', '27.5', 'ft3/s')] } };

const METEO = {
  hourly: {
    time: ['2026-09-16T13:00', '2026-09-16T14:00', '2026-09-16T15:00'],
    temperature_2m: [78.1, 80.4, 81.0],
    wind_speed_10m: [3.2, 11.6, 14.1],
    wind_direction_10m: [200, 225, 270],
    cloud_cover: [10, 55, 90],
    precipitation: [0, 0, 0.1],
    is_day: [1, 1, 1],
  },
};

const stub = async (url) => {
  const body = url.includes('noaa') ? NOAA : url.includes('usgs') ? USGS : METEO;
  return { ok: true, json: async () => body };
};
const failing = async (url) => (url.includes('usgs') ? { ok: false, status: 503 } : stub(url));

line();
line('  1. TIDE STAGE from a hi/lo list (Settlement Point, 16 Sep 2026)');
const cases = [
  ['2026-09-16 09:00', 'incoming', 'between a low and a high'],
  ['2026-09-16 12:00', 'high', '18 min before the high'],
  ['2026-09-16 12:50', 'high', '32 min after the high'],
  ['2026-09-16 15:30', 'outgoing', 'between a high and a low'],
  ['2026-09-16 18:30', 'low', '11 min before the low'],
  ['2026-09-16 22:00', 'incoming', 'evening push toward the 00:33 high'],
];
for (const [t, want, why] of cases) {
  const s = tideStage(NOAA.predictions, t);
  ok(s?.tide === want, `${t} should be ${want} (${why}), got ${s?.tide}`);
  line(`     ${t.slice(11)}  ${String(s?.tide).padEnd(9)} next ${s?.next?.type} at ${s?.next?.at.slice(11)} (${s?.minutesToNext} min)`);
}
ok(tideStage([], '2026-09-16 09:00') === null, 'no predictions → null, not a guess');

line();
line('  2. WALL CLOCK in a region timezone');
const at = new Date('2026-09-16T16:05:00Z');
ok(wallClock(at, 'America/Nassau') === '2026-09-16 12:05', `Nassau in September is UTC-4: ${wallClock(at, 'America/Nassau')}`);
ok(wallClock(at, 'America/Denver') === '2026-09-16 10:05', `Denver in September is UTC-6: ${wallClock(at, 'America/Denver')}`);
line(`     ${at.toISOString()} → Nassau ${wallClock(at, 'America/Nassau')}, Denver ${wallClock(at, 'America/Denver')}`);

line();
line('  3. VOCABULARY the log accepts');
ok(lightFrom(10) === 'bright' && lightFrom(55) === 'broken' && lightFrom(90) === 'overcast' && lightFrom(10, false) === 'low', 'light buckets');
ok(windFrom(3) === 'calm' && windFrom(8) === 'light' && windFrom(15) === 'moderate' && windFrom(25) === 'strong', 'wind buckets');
ok(compass(0) === 'N' && compass(225) === 'SW' && compass(359) === 'N', 'compass points');
const vocab = { light: ['bright', 'broken', 'overcast', 'low'], wind: ['calm', 'light', 'moderate', 'strong'], tide: ['low', 'incoming', 'high', 'outgoing'] };
for (const c of [0, 29, 30, 70, 71, 100]) ok(vocab.light.includes(lightFrom(c)), `light(${c}) in vocab`);
for (const w of [0, 4.9, 5, 11.9, 12, 19.9, 20, 60]) ok(vocab.wind.includes(windFrom(w)), `wind(${w}) in vocab`);
line('     light: bright <30% cloud · broken 30–70 · overcast >70 · low at night');
line('     wind:  calm <5 mph · light 5–11 · moderate 12–19 · strong 20+');

line();
line('  4. ONE REGION, ALL SOURCES (stubbed responses)');
const nc = { id: 'nc-mountains', timezone: 'America/New_York', coords: [35.273, -82.706], usgsGauge: '03441000' };
const bah = { id: 'bahamas', timezone: 'America/Nassau', coords: [26.7, -78.98], tideStation: '9710441' };
const when = new Date('2026-09-16T18:20:00Z'); // 14:20 in both zones
const c1 = await conditionsFor(nc, { at: when }, stub);
ok(c1.flowCfs === 27.5 && c1.waterF === 71, `Davidson flow/temp parsed: ${c1.flowCfs} cfs, ${c1.waterF}°F`);
ok(c1.airF === 80 && c1.wind === 'moderate' && c1.windMph === 12 && c1.light === 'broken' && c1.windDir === 'SW', `weather hour nearest 14:20 is 14:00: ${c1.airF}°F ${c1.wind} ${c1.windMph} mph ${c1.light} ${c1.windDir}`);
ok(c1.wind === 'moderate' && c1.windMph === 12, '11.6 mph rounds to 12 and 12 reads as moderate — word and number agree');
ok(c1.tide === null && !c1.errors.length, 'no tide station → no tide, and no error either');
ok(c1.sources.length === 2, 'two sources reported');
line(`     nc-mountains: ${c1.flowCfs} cfs · ${c1.waterF}°F water · ${c1.airF}°F air · ${c1.wind} ${c1.windDir} · ${c1.light}`);
const c2 = await conditionsFor(bah, { at: when }, stub);
ok(c2.tide === 'outgoing' && c2.tideNext?.type === 'low', `Bahamas at 14:20: ${tideLine(c2)}`);
ok(c2.flowCfs === null, 'no gauge → no flow');
line(`     bahamas:      ${tideLine(c2)} · ${c2.airF}°F · ${c2.wind} ${c2.windDir}`);

line();
line('  5. A DEAD SOURCE COSTS ONLY ITSELF');
const c3 = await conditionsFor(nc, { at: when }, failing);
ok(c3.flowCfs === null && c3.errors.some((e) => e.startsWith('flow')), 'USGS 503 lands in errors');
ok(c3.airF === 80 && c3.sources.includes('weather'), 'weather still came back');
line(`     errors: ${c3.errors.join('; ')} — weather still ${c3.airF}°F`);

line();
line('  6. ENRICHMENT fills blanks and leaves what you typed');
const enrich = enricherFor({ 'nc-mountains': nc }, stub);
const session = { regionId: 'nc-mountains', startedAt: when.toISOString(), conditions: { waterF: 66, light: null, wind: null, flowCfs: null } };
const extra = await enrich(session);
ok(extra.waterF === undefined, 'typed 66°F water is not overwritten by the gauge');
ok(extra.flowCfs === 27.5 && extra.light === 'broken' && extra.wind === 'moderate' && extra.airF === 80, `blanks filled: ${JSON.stringify(extra)}`);
ok((await enrich({ regionId: 'nowhere', startedAt: when.toISOString() })) === null, 'unknown region → null');
ok((await enrich({ regionId: 'nc-mountains', startedAt: when.toISOString(), conditions: { flowCfs: 30, waterF: 60, airF: 70, light: 'bright', wind: 'calm' } })) !== null, 'nothing missing → {} not null, so the pending flag clears');
ok((await enricherFor({ 'nc-mountains': nc }, async () => ({ ok: false, status: 500 }))({ regionId: 'nc-mountains', startedAt: when.toISOString(), conditions: {} })) === null, 'every source down → null, stays pending');
const sc = toSessionConditions(c2);
ok(sc.tide === 'outgoing' && !('flowCfs' in sc), 'toSessionConditions carries only what exists');
line(`     ${JSON.stringify(extra)}`);

line();
if (LIVE) {
  line('  7. LIVE — every region, right now');
  for (const r of bundle.tables.regions) {
    const c = await conditionsFor(r, {}, fetch);
    const bits = [
      tideLine(c),
      c.flowCfs != null ? `${c.flowCfs} cfs` : null,
      c.waterF != null ? `${c.waterF}°F water` : null,
      c.airF != null ? `${c.airF}°F air` : null,
      c.windMph != null ? `${c.wind} ${c.windDir} ${c.windMph} mph` : null,
      c.light,
    ].filter(Boolean);
    line(`     ${r.id.padEnd(13)} ${bits.join(' · ') || '(nothing)'}`);
    for (const e of c.errors) line(`     ${' '.repeat(13)} ! ${e}`);
  }
  line();
}

if (failed) { line(`  ${failed} assertion(s) failed`); process.exit(1); }
line('  all assertions passed');
line();
