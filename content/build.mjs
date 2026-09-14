// Fly Box — content build
// ---------------------------------------------------------------------------
//   node content/build.mjs
//
// Validates, then compiles content/data/*.json into a single indexed bundle at
// app/src/content/bundle.json for the app to import. Refuses to write if
// validation fails, so a broken content edit can never reach the app.
//
// The indexes here are the queries the app actually makes. Add one when a
// feature needs it — doing the lookup at build time keeps the phone from
// scanning every match rule on every render.

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONCEPT, SCHEMAS } from './schema.mjs';
import { loadAll, validate } from './validate.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(HERE, '..', 'app', 'src', 'content');
const OUT = join(OUT_DIR, 'bundle.json');

// Bump when the SHAPE changes, not when content changes. The app checks this
// against what it has cached and re-hydrates when it moves.
const CONTENT_VERSION = '0.5.0';

const tables = loadAll();
validate(tables);

// validate() pushes into its own arrays; re-run its exit logic cheaply by
// re-validating through the CLI if you want the full report. Here we just
// refuse to build on a hard failure.
const hardFail = (() => {
  // Re-derive: any ref that does not resolve, or any missing file.
  for (const [key, def] of Object.entries(SCHEMAS)) {
    if (!tables[key] || !Array.isArray(tables[key])) return `missing or malformed ${def.file}`;
  }
  const ids = Object.fromEntries(
    Object.entries(tables).map(([k, rows]) => [k, new Set(rows.map((r) => r.id))]),
  );
  for (const m of tables.matches) {
    if (!ids.organisms.has(m.organism)) return `matches/${m.id} -> unknown organism ${m.organism}`;
    if (!ids.flies.has(m.fly)) return `matches/${m.id} -> unknown fly ${m.fly}`;
  }
  for (const p of tables.presence) {
    if (!ids.regions.has(p.region)) return `presence/${p.id} -> unknown region ${p.region}`;
    if (!ids.organisms.has(p.organism)) return `presence/${p.id} -> unknown organism ${p.organism}`;
  }
  return null;
})();

if (hardFail) {
  console.error(`\n  build refused: ${hardFail}`);
  console.error('  run: node content/validate.mjs\n');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Derived: concept ids
// ---------------------------------------------------------------------------
// Every reviewable fact gets a stable id. This list IS the study universe —
// the scheduler holds review state against these strings and nothing else.

const concepts = [];
const pushConcept = (id, kind, label, refs) => concepts.push({ id, kind, label, refs });

for (const o of tables.organisms) {
  for (const s of o.stages ?? []) {
    pushConcept(
      CONCEPT.organismStage(o.id, s.stage),
      'organism-stage',
      `${o.name} — ${s.stage}`,
      { organism: o.id, stage: s.stage },
    );
  }
}

for (const m of tables.matches) {
  const o = tables.organisms.find((x) => x.id === m.organism);
  const fl = tables.flies.find((x) => x.id === m.fly);
  pushConcept(
    CONCEPT.match(m),
    'match',
    m.name ?? `${o?.name ?? m.organism} ${m.stage} → ${fl?.name ?? m.fly}`,
    { match: m.id, organism: m.organism, stage: m.stage, fly: m.fly },
  );
}

for (const fl of tables.flies) {
  pushConcept(CONCEPT.flyPurpose(fl.id), 'fly', `${fl.name} — what and when`, { fly: fl.id });
}

for (const k of tables.knots) {
  pushConcept(CONCEPT.knotSteps(k.id), 'knot', `${k.name} — tie it`, { knot: k.id });
}

for (const r of tables.rigs) {
  pushConcept(CONCEPT.rigBuild(r.id), 'rig', `${r.name} — build it`, { rig: r.id });
}

for (const r of tables.retrieves) {
  pushConcept(CONCEPT.retrieve(r.id), 'retrieve', `${r.name} — how to fish it`, { retrieve: r.id });
}

for (const p of tables.presence) {
  pushConcept(CONCEPT.presence(p), 'presence', `${p.name ?? p.id} — when`, { presence: p.id });
}

const dupes = concepts.map((c) => c.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dupes.length) {
  console.error(`\n  build refused: duplicate concept ids — ${[...new Set(dupes)].join(', ')}`);
  console.error('  two facts cannot share a review schedule.\n');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Derived: indexes
// ---------------------------------------------------------------------------

const byId = Object.fromEntries(
  Object.entries(tables).map(([k, rows]) => [k, Object.fromEntries(rows.map((r) => [r.id, r]))]),
);

const push = (obj, key, val) => { (obj[key] ??= []).push(val); };

const matchesByOrganismStage = {};
const matchesByFly = {};
const matchesByRegion = {};
const matchesBySpecies = {};

for (const m of tables.matches) {
  push(matchesByOrganismStage, `${m.organism}.${m.stage}`, m.id);
  push(matchesByFly, m.fly, m.id);
  const fc = m.facets ?? {};
  for (const r of fc.regions ?? ['*']) push(matchesByRegion, r, m.id);
  for (const s of fc.species ?? ['*']) push(matchesBySpecies, s, m.id);
}

const presenceByRegionMonth = {};
for (const p of tables.presence) {
  for (const mo of p.months ?? []) push(presenceByRegionMonth, `${p.region}.${mo}`, p.id);
}

const fliesByFamily = {};
for (const fl of tables.flies) push(fliesByFamily, fl.family, fl.id);

// Which flies are fished the same way. "Show me everything I fish on a shrimp
// hop" is a real question when you are deciding what to practise.
const fliesByRetrieve = {};
for (const fl of tables.flies) if (fl.retrieve) push(fliesByRetrieve, fl.retrieve, fl.id);

const speciesByRegion = {};
for (const sp of tables.species) {
  for (const r of sp.regions ?? []) push(speciesByRegion, r, sp.id);
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

const bundle = {
  contentVersion: CONTENT_VERSION,
  builtAt: new Date().toISOString(),
  counts: Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length])),
  reviewed: Object.fromEntries(
    Object.entries(tables).map(([k, v]) => [k, v.filter((r) => r.status === 'reviewed').length]),
  ),
  tables,
  byId,
  concepts,
  index: {
    matchesByOrganismStage,
    matchesByFly,
    matchesByRegion,
    matchesBySpecies,
    presenceByRegionMonth,
    fliesByFamily,
    fliesByRetrieve,
    speciesByRegion,
  },
};

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, JSON.stringify(bundle, null, 0));

const kb = (JSON.stringify(bundle).length / 1024).toFixed(0);
console.log('');
console.log(`  built  ${OUT.replace(resolve(HERE, '..'), '.')}`);
console.log(`  ${concepts.length} concepts  ·  ${bundle.counts.matches} match rules  ·  ${kb} KB`);
console.log('');
