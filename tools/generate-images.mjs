// Fly Box — render the image set on your own machine
// ---------------------------------------------------------------------------
//   set FAL_KEY=xxxxxxxx           (Windows cmd)
//   $env:FAL_KEY="xxxxxxxx"        (PowerShell)
//   node tools/image-prompts.mjs
//   node tools/generate-images.mjs
//
// Flags:
//   --only=gotcha-tan,walts-worm   render just these ids
//   --kind=fly | --kind=organism   render one group
//   --limit=5                      stop after N (use this first — it is cheap
//                                  to look at five before paying for seventy)
//   --force                        re-render files that already exist
//   --dry                          print what would be done and exit
//
// Existing files are skipped by default, so a failed run is resumed by simply
// running it again, and re-rolling one bad fly is --only=<id> --force.
//
// Your key never leaves your machine. It is read from the environment and used
// only against fal.run.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const ASSETS = resolve(ROOT, 'app/public/assets');

const KEY = process.env.FAL_KEY;
const args = process.argv.slice(2);
const flag = (name) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : null;
};
const has = (name) => args.includes(`--${name}`);

const ONLY = flag('only')?.split(',').map((s) => s.trim()).filter(Boolean) ?? null;
const KIND = flag('kind');
const LIMIT = flag('limit') ? Number(flag('limit')) : null;
const FORCE = has('force');
const DRY = has('dry');
const CONCURRENCY = Number(flag('concurrency') ?? 3);

const pack = JSON.parse(readFileSync(resolve(HERE, 'image-prompts.json'), 'utf8'));

let queue = pack.entries;
if (ONLY) queue = queue.filter((e) => ONLY.includes(e.id));
if (KIND) queue = queue.filter((e) => e.kind === KIND);
if (!FORCE) queue = queue.filter((e) => !existsSync(resolve(ASSETS, `${e.id}.jpg`)));
if (LIMIT) queue = queue.slice(0, LIMIT);

console.log('');
console.log(`  model    ${pack.model}`);
console.log(`  pack     ${pack.entries.length} prompts`);
console.log(`  to do    ${queue.length}${FORCE ? ' (forced)' : ' (skipping existing)'}`);
console.log(`  output   ${ASSETS}`);
console.log('');

if (DRY) {
  for (const e of queue) console.log(`  ${e.id.padEnd(34)} ${e.label}`);
  console.log('');
  process.exit(0);
}

if (!queue.length) { console.log('  nothing to do.\n'); process.exit(0); }

if (!KEY) {
  console.error('  FAL_KEY is not set. Get one at https://fal.ai/dashboard/keys, then:');
  console.error('    PowerShell:  $env:FAL_KEY="..."');
  console.error('    cmd:         set FAL_KEY=...');
  console.error('');
  process.exit(1);
}

if (!existsSync(ASSETS)) mkdirSync(ASSETS, { recursive: true });

// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function render(entry, attempt = 1) {
  const res = await fetch(`https://fal.run/${pack.model}`, {
    method: 'POST',
    headers: { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: entry.prompt,
      num_images: 1,
      output_format: 'jpeg',
      aspect_ratio: '1:1',
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    // 429 and 5xx are worth another go; a 4xx about the prompt is not.
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      const wait = 2000 * attempt;
      console.log(`  ${entry.id}: ${res.status}, retrying in ${wait / 1000}s`);
      await sleep(wait);
      return render(entry, attempt + 1);
    }
    throw new Error(`${res.status} ${body.slice(0, 300)}`);
  }

  const json = await res.json();
  const url = json?.images?.[0]?.url;
  if (!url) throw new Error(`no image url in response: ${JSON.stringify(json).slice(0, 300)}`);

  const img = await fetch(url);
  if (!img.ok) throw new Error(`download failed: ${img.status}`);
  const buf = Buffer.from(await img.arrayBuffer());
  writeFileSync(resolve(ASSETS, `${entry.id}.jpg`), buf);
  return buf.length;
}

// A small worker pool. Three at a time is polite and keeps the log readable.
let done = 0;
let failed = 0;
const failures = [];

async function worker(items) {
  for (const entry of items) {
    try {
      const bytes = await render(entry);
      done += 1;
      console.log(`  ok    ${String(done + failed).padStart(3)}/${queue.length}  ${entry.id.padEnd(34)} ${(bytes / 1024).toFixed(0)} KB`);
    } catch (err) {
      failed += 1;
      failures.push({ id: entry.id, error: String(err.message ?? err) });
      console.log(`  FAIL  ${String(done + failed).padStart(3)}/${queue.length}  ${entry.id.padEnd(34)} ${err.message}`);
    }
  }
}

const lanes = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, (_, i) =>
  worker(queue.filter((_, j) => j % CONCURRENCY === i)));

await Promise.all(lanes);

console.log('');
console.log(`  ${done} rendered, ${failed} failed`);
if (failures.length) {
  console.log(`  retry with:  node tools/generate-images.mjs --only=${failures.map((f) => f.id).join(',')}`);
}
console.log('  then:        node content/validate.mjs --images');
console.log('');
