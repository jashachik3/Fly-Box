// Fly Box — move already-downloaded organism images into assets/bugs/
// ---------------------------------------------------------------------------
//   node tools/move-bug-images.mjs          (dry run — lists what would move)
//   node tools/move-bug-images.mjs --go     (actually move)
//
// Bug illustrations and fly photos used to share app/public/assets/, which meant
// a Trico dun the insect and the Trico Dun dry fly both wanted the same file.
// Organisms now render into app/public/assets/bugs/. This moves the images that
// were downloaded before that change.
//
// Two guards, both learned the hard way on 16 Sep 2026:
//   1. A file whose name is ALSO a fly id (trico-dun, trico-spinner, midge-adult)
//      is the fly photo, not bug art — it is never moved.
//   2. A destination that already exists is never overwritten. renameSync
//      replaces silently on Windows; that clobbered a fresh $6 organism render
//      with the stale copies this script was moving.
// Run it BEFORE regenerating organisms, never after.

import { readFileSync, existsSync, mkdirSync, renameSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const ASSETS = resolve(ROOT, 'app/public/assets');
const BUGS = resolve(ASSETS, 'bugs');

const bundle = JSON.parse(readFileSync(resolve(ROOT, 'app/src/content/bundle.json'), 'utf8'));
const GO = process.argv.includes('--go');

const flyIds = new Set(bundle.tables.flies.map((f) => f.id));
const want = new Set();
const shared = [];
for (const o of bundle.tables.organisms) {
  for (const s of o.stages ?? []) {
    const id = `${o.id}-${s.stage}`;
    if (flyIds.has(id)) { shared.push(`${id}.jpg`); continue; }   // guard 1
    want.add(`${id}.jpg`);
  }
}

if (!existsSync(ASSETS)) {
  console.log(`\n  no ${ASSETS} yet — nothing to move.\n`);
  process.exit(0);
}

const present = new Set(readdirSync(ASSETS));
const inBugs = new Set(existsSync(BUGS) ? readdirSync(BUGS) : []);
const candidates = [...want].filter((f) => present.has(f));
const blocked = candidates.filter((f) => inBugs.has(f));            // guard 2
const moving = candidates.filter((f) => !inBugs.has(f));
const already = inBugs.size;

console.log('');
console.log(`  ${want.size} organism images expected`);
console.log(`  ${already} already in assets/bugs/`);
console.log(`  ${moving.length} still sitting in assets/ and need moving`);
if (shared.length) console.log(`  ${shared.length} skipped — same name as a fly, so assets/<id>.jpg is the fly photo: ${shared.join(', ')}`);
if (blocked.length) console.log(`  ${blocked.length} skipped — already in assets/bugs/, not overwriting: ${blocked.join(', ')}`);
console.log('');

if (!moving.length) { console.log('  nothing to do.\n'); process.exit(0); }
if (!GO) {
  for (const f of moving) console.log(`  would move  ${f}`);
  console.log('\n  re-run with --go to actually move them.\n');
  process.exit(0);
}

if (!existsSync(BUGS)) mkdirSync(BUGS, { recursive: true });
let moved = 0;
for (const f of moving) {
  renameSync(resolve(ASSETS, f), resolve(BUGS, f));
  moved += 1;
}
console.log(`  moved ${moved} into assets/bugs/\n`);
