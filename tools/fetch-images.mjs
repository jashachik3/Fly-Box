// Fly Box — pull down the images that were generated on fal
// ---------------------------------------------------------------------------
//   node tools/fetch-images.mjs
//
// The generation already happened and is already paid for. This only downloads
// the finished files. No FAL_KEY needed, nothing is charged, and running it
// twice costs nothing — existing files are skipped.
//
//   296 flies + organisms  ->  app/public/assets
//    45 knot/leader panels ->  app/public/assets/panels
//
// Flags:
//   --force              re-download files that already exist
//   --limit=5            stop after N (to spot-check before pulling the lot)
//   --only=gotcha,rs2    just these ids
//   --group=panels       only one group (matches on dest path or kind)
//   --dry                list what would be downloaded and exit
//
// fal's media URLs are not permanent. If this starts returning 404s the set has
// to be regenerated rather than re-fetched.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

const args = process.argv.slice(2);
const flag = (n) => { const h = args.find((a) => a.startsWith(`--${n}=`)); return h ? h.split('=').slice(1).join('=') : null; };
const has = (n) => args.includes(`--${n}`);

const FORCE = has('force');
const DRY = has('dry');
const LIMIT = flag('limit') ? Number(flag('limit')) : null;
const ONLY = flag('only')?.split(',').map((s) => s.trim()).filter(Boolean) ?? null;
const GROUP = flag('group');
const CONCURRENCY = Number(flag('concurrency') ?? 6);

const pack = JSON.parse(readFileSync(resolve(HERE, 'generated-images.json'), 'utf8'));

// Flatten the groups into one queue of { id, path, dest }.
let queue = [];
for (const g of pack.groups) {
  if (GROUP && !g.dest.includes(GROUP) && !g.kind.includes(GROUP)) continue;
  const dest = resolve(ROOT, g.dest);
  for (const [id, path] of Object.entries(g.images)) queue.push({ id, path, dest });
}

if (ONLY) queue = queue.filter((e) => ONLY.includes(e.id));
if (!FORCE) queue = queue.filter((e) => !existsSync(resolve(e.dest, `${e.id}.jpg`)));
if (LIMIT) queue = queue.slice(0, LIMIT);

console.log('');
console.log(`  pack     ${pack.count} images, generated ${pack.generatedAt}`);
for (const g of pack.groups) console.log(`           ${String(Object.keys(g.images).length).padStart(4)}  ${g.kind}  ->  ${g.dest}`);
console.log(`  to do    ${queue.length}${FORCE ? ' (forced)' : ' (skipping existing)'}`);
console.log('');

if (DRY) { for (const e of queue) console.log(`  ${e.id}`); console.log(''); process.exit(0); }
if (!queue.length) { console.log('  nothing to do.\n'); process.exit(0); }

for (const dir of new Set(queue.map((e) => e.dest))) if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function grab(entry, attempt = 1) {
  const res = await fetch(pack.base + entry.path);
  if (!res.ok) {
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await sleep(1500 * attempt);
      return grab(entry, attempt + 1);
    }
    throw new Error(`${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1024) throw new Error(`suspiciously small (${buf.length} bytes)`);
  writeFileSync(resolve(entry.dest, `${entry.id}.jpg`), buf);
  return buf.length;
}

let done = 0, failed = 0;
const failures = [];

async function worker(items) {
  for (const entry of items) {
    try {
      const bytes = await grab(entry);
      done += 1;
      console.log(`  ok    ${String(done + failed).padStart(3)}/${queue.length}  ${entry.id.padEnd(34)} ${(bytes / 1024).toFixed(0)} KB`);
    } catch (err) {
      failed += 1;
      failures.push(entry.id);
      console.log(`  FAIL  ${String(done + failed).padStart(3)}/${queue.length}  ${entry.id.padEnd(34)} ${err.message}`);
    }
  }
}

await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, queue.length) }, (_, i) =>
    worker(queue.filter((_, j) => j % CONCURRENCY === i))));

console.log('');
console.log(`  ${done} downloaded, ${failed} failed`);
if (failures.length) console.log(`  re-run to retry: ${failures.slice(0, 8).join(', ')}${failures.length > 8 ? ` +${failures.length - 8} more` : ''}`);
console.log('  then:  node content/validate.mjs --images');
console.log('');
