// Fly Box — content validator
// ---------------------------------------------------------------------------
//   node content/validate.mjs            check everything
//   node content/validate.mjs --images   also check that image files exist
//   node content/validate.mjs --strict   treat warnings as failures
//
// Exits non-zero on any error, so it can sit in a pre-commit hook or CI.
// Zero dependencies.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHEMAS, VOCAB, SLUG_RE } from './schema.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, 'data');
const IMAGES = resolve(HERE, '..', 'app', 'public', 'assets');

const args = new Set(process.argv.slice(2));
const CHECK_IMAGES = args.has('--images');
const STRICT = args.has('--strict');

const errors = [];
const warnings = [];

const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

export function loadAll() {
  const tables = {};
  for (const [key, def] of Object.entries(SCHEMAS)) {
    const path = join(DATA, def.file);
    if (!existsSync(path)) {
      err(def.file, 'file is missing');
      tables[key] = [];
      continue;
    }
    try {
      const parsed = JSON.parse(readFileSync(path, 'utf8'));
      if (!Array.isArray(parsed)) {
        err(def.file, 'top level must be an array of records');
        tables[key] = [];
      } else {
        tables[key] = parsed;
      }
    } catch (e) {
      err(def.file, `invalid JSON — ${e.message}`);
      tables[key] = [];
    }
  }
  return tables;
}

// ---------------------------------------------------------------------------
// Field checking
// ---------------------------------------------------------------------------

function checkField(where, key, spec, value, ids) {
  const present = value !== undefined && value !== null;

  if (!present) {
    if (spec.required) err(where, `missing required field "${key}"`);
    return;
  }

  const at = `${where}.${key}`;

  switch (spec.type) {
    case 'slug':
      if (typeof value !== 'string' || !SLUG_RE.test(value)) {
        err(at, `"${value}" is not a lowercase-hyphen slug`);
      }
      break;

    case 'string':
      if (typeof value !== 'string') err(at, 'must be a string');
      else if (value.trim() === '') warn(at, 'is an empty string — omit it instead');
      break;

    case 'int':
      if (!Number.isInteger(value)) err(at, 'must be a whole number');
      else if (spec.min !== undefined && value < spec.min) err(at, `must be >= ${spec.min}`);
      else if (spec.max !== undefined && value > spec.max) err(at, `must be <= ${spec.max}`);
      break;

    case 'number':
      if (typeof value !== 'number' || Number.isNaN(value)) err(at, 'must be a number');
      break;

    case 'bool':
      if (typeof value !== 'boolean') err(at, 'must be true or false');
      break;

    case 'enum':
      if (!spec.values.includes(value)) {
        err(at, `"${value}" is not in VOCAB.${spec.vocab} — allowed: ${spec.values.join(', ')}`);
      }
      break;

    case 'ref': {
      const pool = ids[spec.ref];
      if (!pool) { err(at, `unknown reference table "${spec.ref}"`); break; }
      if (!pool.has(value)) err(at, `points at "${value}", which does not exist in ${spec.ref}.json`);
      break;
    }

    case 'range':
      if (!Array.isArray(value) || value.length !== 2) {
        err(at, 'must be a two-element array [min, max]');
      } else if (typeof value[0] !== 'number' || typeof value[1] !== 'number') {
        err(at, 'both ends of the range must be numbers');
      } else if (value[0] > value[1]) {
        err(at, `range is backwards: [${value[0]}, ${value[1]}]`);
      }
      break;

    case 'array':
      if (!Array.isArray(value)) { err(at, 'must be an array'); break; }
      if (spec.min !== undefined && value.length < spec.min) err(at, `needs at least ${spec.min} item(s)`);
      if (spec.length !== undefined && value.length !== spec.length) err(at, `must have exactly ${spec.length} items`);
      value.forEach((item, i) => checkField(`${at}[${i}]`, '', { ...spec.of, required: true }, item, ids));
      break;

    case 'object': {
      if (typeof value !== 'object' || Array.isArray(value)) { err(at, 'must be an object'); break; }
      for (const [k, s] of Object.entries(spec.shape)) {
        checkField(at, k, s, value[k], ids);
      }
      for (const k of Object.keys(value)) {
        if (!(k in spec.shape)) warn(`${at}.${k}`, 'is not in the schema and will be dropped at build time');
      }
      break;
    }

    default:
      err(at, `schema uses unknown type "${spec.type}"`);
  }
}

// A nameless array item is checked by passing key '' — tidy up the label.
const cleanup = () => {
  for (let i = 0; i < errors.length; i++) errors[i] = errors[i].replace(/\.(?=:)/g, '');
};

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

export function validate(tables) {
  // Pass 1 — collect ids so refs can be resolved in pass 2.
  const ids = {};
  for (const [key, rows] of Object.entries(tables)) {
    const seen = new Set();
    for (const row of rows) {
      if (!row || typeof row !== 'object') { err(key, 'a record is not an object'); continue; }
      if (typeof row.id !== 'string') { err(key, 'a record has no id'); continue; }
      if (seen.has(row.id)) err(`${key}/${row.id}`, 'duplicate id');
      seen.add(row.id);
    }
    ids[key] = seen;
  }

  // Pass 2 — shapes and references.
  for (const [key, def] of Object.entries(SCHEMAS)) {
    for (const row of tables[key]) {
      const where = `${key}/${row.id ?? '?'}`;
      for (const [field, spec] of Object.entries(def.shape)) {
        checkField(where, field, spec, row[field], ids);
      }
      for (const field of Object.keys(row)) {
        if (!(field in def.shape)) warn(`${where}.${field}`, 'is not in the schema and will be dropped at build time');
      }
    }
  }

  // Pass 3 — cross-table rules the shapes cannot express.
  const organismStages = new Map();
  for (const o of tables.organisms) {
    organismStages.set(o.id, new Set((o.stages ?? []).map((s) => s.stage)));
  }

  for (const m of tables.matches) {
    const stages = organismStages.get(m.organism);
    if (stages && m.stage && !stages.has(m.stage)) {
      err(`matches/${m.id}`, `stage "${m.stage}" is not declared on organism "${m.organism}"`);
    }
    const fly = tables.flies.find((x) => x.id === m.fly);
    const org = tables.organisms.find((x) => x.id === m.organism);
    if (fly && org && fly.water !== org.water) {
      warn(`matches/${m.id}`, `pairs a ${org.water} organism with a ${fly.water} fly`);
    }
  }

  for (const p of tables.presence) {
    const stages = organismStages.get(p.organism);
    for (const s of p.stages ?? []) {
      if (stages && !stages.has(s)) {
        err(`presence/${p.id}`, `stage "${s}" is not declared on organism "${p.organism}"`);
      }
    }
  }

  // A color variant must point at a base pattern in the same family.
  for (const fly of tables.flies) {
    if (!fly.variantOf) continue;
    const base = tables.flies.find((x) => x.id === fly.variantOf);
    if (base && base.family !== fly.family) {
      err(`flies/${fly.id}`, `variantOf "${base.id}" is in family "${base.family}", not "${fly.family}"`);
    }
    if (base && base.variantOf) {
      err(`flies/${fly.id}`, 'variants may not point at other variants — point at the base pattern');
    }
  }

  // Every organism should be reachable by at least one fly, or the quiz has a
  // dead end. Warning, not an error: content lands in stages.
  const matched = new Set(tables.matches.map((m) => m.organism));
  for (const o of tables.organisms) {
    if (!matched.has(o.id)) warn(`organisms/${o.id}`, 'has no match rule — nothing imitates it yet');
  }

  const orphanFlies = tables.flies.filter(
    (fl) => !tables.matches.some((m) => m.fly === fl.id),
  );
  if (orphanFlies.length) {
    warn('flies', `${orphanFlies.length} fl${orphanFlies.length === 1 ? 'y has' : 'ies have'} no match rule (${orphanFlies.slice(0, 6).map((f) => f.id).join(', ')}${orphanFlies.length > 6 ? ', …' : ''})`);
  }

  // Images
  if (CHECK_IMAGES) {
    const have = existsSync(IMAGES) ? new Set(readdirSync(IMAGES)) : new Set();
    if (!have.size) warn('images', `no asset directory found at ${IMAGES}`);
    const wanted = [
      ...tables.flies.map((r) => [`flies/${r.id}`, r.image]),
      ...tables.organisms.map((r) => [`organisms/${r.id}`, r.image]),
      ...tables.organisms.flatMap((o) => (o.stages ?? []).map((s, i) => [`organisms/${o.id}.stages[${i}]`, s.image])),
    ];
    for (const [where, img] of wanted) {
      if (!img) continue;
      const base = img.split('/').pop();
      if (have.size && !have.has(base)) warn(where, `image "${base}" is not in app/public/assets`);
    }
  }

  return { ids };
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function report(tables) {
  const counts = Object.entries(tables)
    .map(([k, v]) => `${v.length} ${k}`)
    .join('  ·  ');

  const drafts = Object.entries(tables).flatMap(([k, rows]) =>
    rows.filter((r) => r.status === 'draft').map((r) => `${k}/${r.id}`));

  console.log('');
  console.log('  Fly Box content');
  console.log('  ' + '-'.repeat(62));
  console.log('  ' + counts);
  console.log('');

  for (const w of warnings) console.log(`  warn   ${w}`);
  if (warnings.length) console.log('');
  for (const e of errors) console.log(`  ERROR  ${e}`);
  if (errors.length) console.log('');

  if (drafts.length) {
    console.log(`  ${drafts.length} record${drafts.length === 1 ? '' : 's'} still marked draft — awaiting your review.`);
    console.log('');
  }

  const failed = errors.length > 0 || (STRICT && warnings.length > 0);
  console.log(failed
    ? `  FAILED — ${errors.length} error(s), ${warnings.length} warning(s)`
    : `  OK — ${warnings.length} warning(s)`);
  console.log('');
  return failed;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('validate.mjs')) {
  const tables = loadAll();
  validate(tables);
  cleanup();
  process.exit(report(tables) ? 1 : 0);
}
