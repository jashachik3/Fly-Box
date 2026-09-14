// Fly Box — turn the reference SVGs into PNGs an image model can accept
// ---------------------------------------------------------------------------
//   node tools/build-diagrams.mjs --refs     writes tools/refs/*.svg
//   node tools/rasterize-refs.mjs            writes tools/refs/*.png
//
// The PNGs are committed, so you normally never need to run this. Run it after
// you change a knot's geometry in tools/diagrams/knots.mjs, or a rig's sections
// in rigs.json — otherwise the model would be handed the old drawing.
//
// It drives a headless browser you already have. On Windows that is Edge, which
// is always installed; Chrome is used if it is there. No npm dependency, and
// nothing is downloaded.

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdtempSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REFS = join(HERE, 'refs');

const CANDIDATES = process.platform === 'win32'
  ? [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ]
  : process.platform === 'darwin'
    ? [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    ]
    : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];

const browser = CANDIDATES.find((p) => existsSync(p));
if (!browser) {
  console.error('\n  No Chrome or Edge found. Looked in:');
  for (const c of CANDIDATES) console.error(`    ${c}`);
  console.error('\n  The committed tools/refs/*.png are probably still fine — this step is');
  console.error('  only needed after you change knot geometry or a rig\'s leader sections.\n');
  process.exit(1);
}

if (!existsSync(REFS)) {
  console.error('\n  No tools/refs — run:  node tools/build-diagrams.mjs --refs\n');
  process.exit(1);
}

const files = readdirSync(REFS).filter((f) => f.endsWith('.svg'));
const work = mkdtempSync(join(tmpdir(), 'flybox-refs-'));
let done = 0;

console.log('');
console.log(`  browser  ${browser}`);
console.log(`  refs     ${files.length}`);
console.log('');

for (const file of files) {
  const svg = readFileSync(join(REFS, file), 'utf8');
  const box = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!box) { console.log(`  skip  ${file} — no viewBox`); continue; }

  const [w, h] = [Number(box[1]), Number(box[2])];
  // Square panels go out at 1024; a leader keeps its shape, capped on the long
  // edge. Bigger than the model needs, so nothing is lost to upscaling.
  const scale = w === h ? 1024 / w : 1280 / Math.max(w, h);
  const W = Math.round(w * scale);
  const H = Math.round(h * scale);

  const page = join(work, file.replace(/\.svg$/, '.html'));
  const b64 = Buffer.from(svg).toString('base64');
  writeFileSync(page,
    `<style>html,body{margin:0;background:#fff}img{display:block;width:${W}px;height:${H}px}</style>`
    + `<img src="data:image/svg+xml;base64,${b64}">`);

  const out = join(REFS, file.replace(/\.svg$/, '.png'));
  execFileSync(browser, [
    '--headless', '--disable-gpu', '--hide-scrollbars', '--force-color-profile=srgb',
    `--screenshot=${out}`, `--window-size=${W},${H}`, `file://${page.replace(/\\/g, '/')}`,
  ], { stdio: 'ignore' });

  done += 1;
  process.stdout.write(`\r  rasterised ${done}/${files.length}`);
}

console.log('');
console.log('');
console.log('  next:  node tools/generate-images.mjs --kind=knot-panel --limit=5');
console.log('');
