// Fly Box — import the FLYBOX v0.3 content spine
// ---------------------------------------------------------------------------
//   node tools/import-legacy.mjs            merge into content/data/
//   node tools/import-legacy.mjs --dry      report what would change
//
// The original project (Sept 13 2026) held roughly three times the content this
// one does, in a single flat JSON. This maps it into the relational schema and
// merges it in.
//
// THE RULE: existing records win. Anything already in content/data was either
// hand-authored here or reviewed, so this script only ever FILLS GAPS on a
// record that exists — it never overwrites a value that is already set. New
// records come in marked draft, sourced to the legacy file, so a validate run
// tells you exactly how much is awaiting your eye.
//
// Ids are the hard part: the legacy file keys organisms as `fw-bwo` and this
// one as `blue-winged-olive`. The crosswalk below is explicit for everything
// that already exists, and derived for everything that does not. Getting this
// wrong would silently fork a bug into two records, so it is worth reading.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHookRange } from '../content/hooksize.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const DATA = join(ROOT, 'content', 'data');
const LEGACY = process.argv.find((a) => a.startsWith('--src='))?.split('=')[1]
  ?? '/mnt/user-data/uploads/Fly Box/transfer/content/flyfish-content.json';
const DRY = process.argv.includes('--dry');
const SOURCE = 'FLYBOX v0.3 legacy content (2026-09-13)';

const legacy = JSON.parse(readFileSync(LEGACY, 'utf8'));
const read = (f) => (existsSync(join(DATA, f)) ? JSON.parse(readFileSync(join(DATA, f), 'utf8')) : []);

const tables = {
  organisms: read('organisms.json'),
  flies: read('flies.json'),
  knots: read('knots.json'),
  matches: read('matches.json'),
  presence: read('presence.json'),
  regions: read('regions.json'),
  species: read('species.json'),
  materials: read('materials.json'),
  scenarios: read('scenarios.json'),
  rules: read('rules.json'),
  outfits: read('outfits.json'),
};

const stats = {};
const bump = (k, n = 1) => { stats[k] = (stats[k] ?? 0) + n; };

// ---------------------------------------------------------------------------
// Crosswalks
// ---------------------------------------------------------------------------

const ORGANISM_ID = {
  'fw-bwo': 'blue-winged-olive', 'fw-pmd': 'pale-morning-dun', 'fw-caddis': 'caddis',
  'fw-midge': 'midge', 'fw-golden-stone': 'golden-stonefly', 'fw-scud': 'scud',
  'fw-sculpin': 'sculpin', 'fw-leech': 'leech',
  'sw-glass-minnow': 'glass-minnow', 'sw-bay-anchovy': 'bay-anchovy',
  'sw-palolo': 'palolo-worm', 'sw-crab': 'swimming-crab',
  // The legacy file carries one generic flats shrimp; this one splits it into
  // snapping and mantis. Generic maps to snapping — the common flats shrimp.
  'sw-shrimp': 'snapping-shrimp',
};
const orgId = (id) => ORGANISM_ID[id] ?? id.replace(/^(fw|sw)-/, '');

const KIND = {
  mayfly: 'mayfly', caddisfly: 'caddis', diptera: 'midge', stonefly: 'stonefly',
  terrestrial: 'terrestrial', crustacean: 'crustacean', baitfish: 'baitfish',
  cephalopod: 'cephalopod', worm: 'annelid', other: 'other',
};

const STAGE = {
  nymph: 'nymph', larva: 'larva', pupa: 'pupa', emerger: 'emerger', dun: 'dun',
  spinner: 'spinner', adult: 'adult', 'egg-laying adult': 'ovipositing',
  'flying ant': 'winged',
};

const WEIGHT = [
  [/tungsten/i, 'tungsten'],
  [/bead-chain/i, 'bead-chain'],
  [/lead|brass/i, 'lead-eyes'],
  [/bead|cone/i, 'beadhead'],
  [/wire/i, 'wire'],
  [/none|light|epoxy|helmet/i, 'unweighted'],
];
const weightOf = (s) => (WEIGHT.find(([re]) => re.test(s ?? ''))?.[1] ?? 'unweighted');

const KNOT = { pitzen: 'pitzen', loop: 'non-slip-mono-loop' };

const MONTHS = {
  'Feb–Mar': [2, 3], 'Mar–Apr': [3, 4], 'Apr–May': [4, 5], 'May–Jun': [5, 6],
  'Jun–Aug': [6, 7, 8], 'Jul–Aug': [7, 8], 'Sep–Oct': [9, 10], 'Sep–Nov': [9, 10, 11],
};

/** Legacy species wording -> this project's species ids, where one exists. */
const SPECIES_ID = {
  'Redfish (red drum)': 'redfish', 'False albacore': 'false-albacore',
  Bonefish: 'bonefish', Permit: 'permit', Tarpon: 'tarpon',
  'Rainbow trout': 'rainbow-trout', 'Wild / stocked rainbow': 'rainbow-trout',
  'Brown trout': 'brown-trout', 'Wild brown trout': 'brown-trout',
  'Yellowstone / fine-spotted cutthroat': 'cutthroat-trout',
};

const REGION_ID = { 'belize-honduras': null };   // split here; handled below
const range = (s) => {
  const m = String(s ?? '').match(/(\d+)\s*[-–]\s*(\d+)/);
  return m ? [Number(m[1]), Number(m[2])] : null;
};
const inchesToMm = (r) => (r ? [Math.round(r[0] * 25.4), Math.round(r[1] * 25.4)] : null);

// ---------------------------------------------------------------------------
// Merge helper — existing records win, always
// ---------------------------------------------------------------------------

function upsert(table, record, label) {
  const rows = tables[table];
  const hit = rows.find((r) => r.id === record.id);
  if (!hit) {
    rows.push({ ...record, status: 'draft', sources: [...(record.sources ?? []), SOURCE] });
    bump(`${table}:new`);
    return 'new';
  }
  let filled = 0;
  for (const [k, v] of Object.entries(record)) {
    if (k === 'id' || k === 'status' || k === 'sources') continue;
    const cur = hit[k];
    const empty = cur == null || cur === '' || (Array.isArray(cur) && !cur.length);
    if (empty && v != null && !(Array.isArray(v) && !v.length)) { hit[k] = v; filled += 1; }
  }
  if (filled) {
    hit.sources = [...new Set([...(hit.sources ?? []), SOURCE])];
    bump(`${table}:filled`);
  }
  return filled ? 'filled' : 'kept';
}

// ---------------------------------------------------------------------------
// Organisms — freshwater food and saltwater prey are one table here
// ---------------------------------------------------------------------------

for (const f of legacy.freshwater_food) {
  const hooks = parseHookRange(f.size_range);
  upsert('organisms', {
    id: orgId(f.id),
    name: f.name,
    kind: KIND[f.order] ?? 'other',
    water: 'fresh',
    scientificName: f.latin ?? undefined,
    stages: (f.stages ?? []).map((s) => ({
      stage: STAGE[s.stage] ?? 'adult',
      hookSizes: hooks ?? undefined,
      look: s.look ?? undefined,
      vulnerable: true,
    })),
    notes: [f.season?.length ? `Season: ${f.season.join(', ')}.` : '',
            f.time?.length ? `Best: ${f.time.join(', ')}.` : '',
            f.water?.length ? `Water: ${f.water.join(', ')}.` : ''].filter(Boolean).join(' ') || undefined,
  });
}

for (const p of legacy.saltwater_prey) {
  upsert('organisms', {
    id: orgId(p.id),
    name: p.name,
    kind: KIND[p.type] ?? 'other',
    water: 'salt',
    stages: [{
      stage: 'adult',
      sizeMm: inchesToMm(range(p.size_range)) ?? undefined,
      look: p.look ?? undefined,
      vulnerable: true,
    }],
    notes: [p.targets?.length ? `Eaten by: ${p.targets.join(', ')}.` : '',
            p.water?.length ? `Found: ${p.water.join(', ')}.` : ''].filter(Boolean).join(' ') || undefined,
  });
}

// ---------------------------------------------------------------------------
// Flies, and colour variants as their own records
// ---------------------------------------------------------------------------

for (const f of legacy.fly_patterns) {
  // Hook sizes flip direction at 1/0, so they get their own parser.
  const sizes = parseHookRange(f.sizes);
  upsert('flies', {
    id: f.id,
    name: f.name,
    water: f.water === 'both' ? 'both' : f.water,
    family: f.id,
    hookSizes: sizes ?? [8, 12],
    category: f.type,
    weight: weightOf(f.weight),
    weightNote: f.weight || undefined,
    look: f.look || undefined,
    defaultKnot: KNOT[f.knot] ?? undefined,
    tiedFor: f.imitates?.length ? `Imitates ${f.imitates.join(', ')}.` : undefined,
  });

  for (const v of f.variants ?? []) {
    upsert('flies', {
      id: v.id,
      name: `${f.name} — ${v.color}`,
      water: f.water === 'both' ? 'both' : f.water,
      family: f.id,
      variantOf: f.id,
      color: v.color,
      hookSizes: sizes ?? [8, 12],
      category: f.type,
      weight: weightOf(f.weight),
      look: v.look || undefined,
      defaultKnot: KNOT[f.knot] ?? undefined,
      tiedFor: v.when || undefined,
    });
  }
}

// ---------------------------------------------------------------------------
// Knots
// ---------------------------------------------------------------------------

const KNOT_USE = [
  [/tippet to fly|to fly/i, 'tippet-to-fly'],
  [/leader to tippet|tippet to leader|joining/i, 'leader-to-tippet'],
  [/line to leader|fly line/i, 'line-to-leader'],
  [/loop/i, 'loop-to-loop'],
  [/backing/i, 'backing-to-line'],
  [/bite|shock|class/i, 'bite-tippet'],
];
for (const k of legacy.knots) {
  const id = k.id.replace(/^knot-/, '');
  const uses = KNOT_USE.filter(([re]) => re.test(k.use ?? '')).map(([, u]) => u);
  upsert('knots', {
    id,
    name: k.name,
    uses: uses.length ? [...new Set(uses)] : ['tippet-to-fly'],
    steps: k.steps ?? [],
    bestFor: k.why || undefined,
    notes: k.use || undefined,
  });
}

// ---------------------------------------------------------------------------
// Matches — the join this project is built around, and the legacy file already
// has it: every stage lists the flies that imitate it.
// ---------------------------------------------------------------------------

const flyIds = new Set(tables.flies.map((f) => f.id));
const orgById = Object.fromEntries(tables.organisms.map((o) => [o.id, o]));

// A match is identified by organism + stage + fly, NOT by its record id — that
// triple is what becomes the concept id the scheduler keys off. The legacy file
// and this one name the same pairing differently ('m-bwo-nymph-pt' against
// 'blue-winged-olive-nymph-pheasant-tail'), so deduping on record id would fork
// one fact into two review schedules. Dedupe on the triple.
const matchKey = (m) => `${m.organism}.${m.stage}>${m.fly}`;
const haveMatch = new Set(tables.matches.map(matchKey));

function addMatches(organism, stage, flies, regions) {
  const org = orgById[organism];
  if (!org || !org.stages?.some((s) => s.stage === stage)) return;
  flies.forEach((fly, i) => {
    if (!flyIds.has(fly)) return;
    const key = `${organism}.${stage}>${fly}`;
    if (haveMatch.has(key)) { bump('matches:already-known'); return; }
    haveMatch.add(key);
    upsert('matches', {
      id: `${organism}-${stage}-${fly}`,
      organism,
      stage,
      fly,
      // First fly listed is the one the legacy notes led with. Treat that as
      // the first choice and the rest as change-ups — a convention, and said
      // here rather than implied.
      strength: i === 0 ? 'first-choice' : 'change-up',
      facets: regions?.length ? { regions } : undefined,
    });
  });
}

for (const f of legacy.freshwater_food) {
  for (const s of f.stages ?? []) {
    addMatches(orgId(f.id), STAGE[s.stage] ?? 'adult', s.flies ?? [], null);
  }
}
for (const p of legacy.saltwater_prey) {
  addMatches(orgId(p.id), 'adult', p.flies ?? [], null);
}

// ---------------------------------------------------------------------------
// Presence — the hatch calendars
// ---------------------------------------------------------------------------

const havePresence = new Set(tables.presence.map(
  (p) => `${p.region}.${p.organism}.${[...(p.stages ?? [])].sort().join('+')}`));

for (const r of legacy.regions) {
  for (const entry of r.hatch_calendar ?? []) {
    const months = MONTHS[entry.month];
    if (!months) continue;
    for (const h of entry.hatches ?? []) {
      const o = orgById[orgId(h)];
      if (!o) continue;
      const stages = [...new Set((o.stages ?? []).map((s) => s.stage))].sort();
      // Presence is identified by region + organism + stage set, for the same
      // reason. A calendar row that restates one already on file is dropped
      // rather than added under a new id.
      const key = `${r.id}.${orgId(h)}.${stages.join('+')}`;
      if (havePresence.has(key)) { bump('presence:already-known'); continue; }
      havePresence.add(key);
      upsert('presence', {
        id: `${r.id}-${orgId(h)}-${entry.month.replace(/[^a-z]/gi, '').toLowerCase()}`,
        name: `${o.name} — ${r.name ?? r.id}, ${entry.month}`,
        region: r.id,
        organism: orgId(h),
        stages,
        months,
        abundance: 'present',
        trigger: undefined,
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Scenarios, rules, outfits
// ---------------------------------------------------------------------------

for (const s of legacy.scenarios) {
  upsert('scenarios', {
    id: s.id,
    name: s.prompt.slice(0, 60),
    prompt: s.prompt,
    answer: s.answer,
    flies: (s.flies ?? []).filter((f) => flyIds.has(f)),
    tags: s.tags ?? [],
    regions: (s.regions ?? []).filter((r) => tables.regions.some((x) => x.id === r)),
  });
}

for (const r of legacy.rigging.rules) {
  upsert('rules', { id: r.id, name: r.q.slice(0, 60), kind: 'rigging', q: r.q, a: r.a });
}
for (const r of legacy.knot_rules) {
  const knot = r.answer.replace(/^knot-/, '');
  upsert('rules', {
    id: r.id,
    name: r.situation.slice(0, 60),
    kind: 'knot-choice',
    q: `Which knot: ${r.situation}?`,
    a: tables.knots.find((k) => k.id === knot)?.name ?? r.answer,
    knot: tables.knots.some((k) => k.id === knot) ? knot : undefined,
  });
}
for (const o of legacy.rigging.rod_reel) {
  upsert('outfits', {
    id: o.id,
    name: `${o.wt} · ${o.length}`,
    lineWeight: range(o.wt) ?? undefined,
    lengthFt: range(o.length) ?? undefined,
    use: o.use,
    reel: o.reel || undefined,
  });
}

// ---------------------------------------------------------------------------
// Tippet table -> materials
// ---------------------------------------------------------------------------

for (const t of legacy.rigging.tippet_table) {
  upsert('materials', {
    id: `tippet-${t.x.toLowerCase()}`,
    name: `${t.x} tippet`,
    kind: 'fluoro',
    x: t.x,
    lb: Number(String(t.lb_approx).replace(/[^\d.]/g, '')) || undefined,
    diameterIn: t.dia_in,
    flySizes: range(t.fly_sizes) ?? undefined,
    bestFor: `Matched to hook sizes ${t.fly_sizes}.`,
  });
}

// ---------------------------------------------------------------------------
// Regions — named waters and the per-species detail
// ---------------------------------------------------------------------------

for (const r of legacy.regions) {
  // Belize and Honduras are one region in the legacy file and two here. Its
  // species detail applies to both, so it is written to both.
  const targets = r.id === 'belize-honduras' ? ['belize', 'honduras'] : [r.id];
  for (const rid of targets) {
    const row = tables.regions.find((x) => x.id === rid);
    if (!row) { bump('regions:missing'); continue; }
    if (!row.namedWaters?.length && r.waters?.length) { row.namedWaters = r.waters; bump('regions:filled'); }
    if (!row.species?.length && r.target_species?.length) {
      row.species = r.target_species.map((s) => ({
        species: SPECIES_ID[s.species] ?? undefined,
        label: s.species,
        season: s.season || undefined,
        rod: s.rod || undefined,
        leader: s.leader || undefined,
        flies: (s.flies ?? []).filter((f) => flyIds.has(f)),
      }));
      row.sources = [...new Set([...(row.sources ?? []), SOURCE])];
      bump('regions:filled');
    }
  }
}

// ---------------------------------------------------------------------------

const FILES = {
  organisms: 'organisms.json', flies: 'flies.json', knots: 'knots.json',
  matches: 'matches.json', presence: 'presence.json', regions: 'regions.json',
  species: 'species.json', materials: 'materials.json', scenarios: 'scenarios.json',
  rules: 'rules.json', outfits: 'outfits.json',
};

const strip = (o) => JSON.parse(JSON.stringify(o, (k, v) => (v === undefined ? undefined : v)));

if (!DRY) {
  for (const [t, f] of Object.entries(FILES)) {
    writeFileSync(join(DATA, f), `${JSON.stringify(strip(tables[t]), null, 2)}\n`);
  }
}

console.log('');
console.log(DRY ? '  DRY RUN — nothing written' : '  merged into content/data/');
for (const [k, v] of Object.entries(stats).sort()) console.log(`  ${String(v).padStart(5)}  ${k}`);
console.log('');
for (const [t, f] of Object.entries(FILES)) console.log(`  ${String(tables[t].length).padStart(5)}  ${f}`);
console.log('');
