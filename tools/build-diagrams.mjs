// Fly Box — generate the knot and leader diagrams
// ---------------------------------------------------------------------------
//   node tools/build-diagrams.mjs            write every diagram
//   node tools/build-diagrams.mjs --refs     write the art-only reference set
//   node tools/build-diagrams.mjs --only=albright
//   node tools/build-diagrams.mjs --check    report drift without writing
//
// Two layers, and the split is the whole design:
//
//   ART       the line work — strands, wraps, hooks. Computed, so every
//             crossing's over/under and every wrap count is exactly right.
//   OVERLAY   step numbers, captions, wrap counts, arrows, labels, node
//             glyphs. Also computed, straight from the record.
//
// `--refs` writes the ART alone. Those go to an image model, which redraws them
// as proper illustration (tools/generate-images.mjs --kind=knot-panel). Anything
// it returns lands in app/public/assets/panels/ and this script composites it
// back UNDER the overlay — so the artwork is the model's and the numbers, the
// captions and the geometry it was working from are still ours.
//
// Nothing here touches the network. If no rendered panels exist, you get the
// pure vector version and the app is none the wiser.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { knotDiagram, knotPanelRefs, canDraw } from './diagrams/knots.mjs';
import { leaderDiagram } from './diagrams/leaders.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const DATA = join(ROOT, 'content', 'data');
const OUT = join(ROOT, 'app', 'public', 'assets', 'diagrams');
const PANELS = join(ROOT, 'app', 'public', 'assets', 'panels');
const REFS = join(HERE, 'refs');

const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith('--only='))?.split('=')[1] ?? null;
const CHECK = args.includes('--check');
const REFMODE = args.includes('--refs');

const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const knots = read('knots.json');
const rigs = read('rigs.json');
const flies = read('flies.json');

const knotsById = Object.fromEntries(knots.map((k) => [k.id, k]));
const fliesById = Object.fromEntries(flies.map((f) => [f.id, f]));

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

/**
 * A rendered panel, as a data URI. It has to be inlined rather than linked:
 * an SVG loaded through <img> runs in a sandbox that refuses external files,
 * and these diagrams are shown through <img> everywhere in the app.
 */
function inlined(name) {
  if (!existsSync(PANELS)) return null;
  for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
    const path = join(PANELS, name + ext);
    if (!existsSync(path)) continue;
    return `data:${MIME[ext]};base64,${readFileSync(path).toString('base64')}`;
  }
  return null;
}

const written = [];
const skipped = [];
const changed = [];
let rendered = 0;

function emit(dir, name, svg) {
  const path = join(dir, name);
  if (CHECK) {
    const before = existsSync(path) ? readFileSync(path, 'utf8') : null;
    if (before !== svg) changed.push(name);
    return;
  }
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(path, svg);
  written.push(name);
}

// ---------------------------------------------------------------------------

if (REFMODE) {
  for (const k of knots) {
    if (only && k.id !== only) continue;
    if (!canDraw(k.id)) { skipped.push(`knot ${k.id} — no panel geometry yet`); continue; }
    for (const panel of knotPanelRefs(k)) {
      emit(REFS, `knot-${k.id}-${panel.index}.svg`, panel.svg);
    }
  }
  for (const r of rigs) {
    if (only && r.id !== only) continue;
    emit(REFS, `leader-${r.id}.svg`, leaderDiagram(r, { knots: knotsById, flies: fliesById, reference: true }));
  }
  console.log('');
  console.log(`  wrote ${written.length} reference(s) to tools/refs/`);
  console.log('  these are art only — no text, no numbers, no arrows.');
  console.log('  next: node tools/image-prompts.mjs && node tools/generate-images.mjs --kind=knot-panel --limit=5');
  console.log('');
  process.exit(0);
}

for (const k of knots) {
  if (only && k.id !== only) continue;
  if (!canDraw(k.id)) { skipped.push(`knot ${k.id} — no panel geometry yet`); continue; }
  const panelImages = (k.steps ?? []).map((_, i) => inlined(`knot-${k.id}-${i + 1}`));
  rendered += panelImages.filter(Boolean).length;
  emit(OUT, `knot-${k.id}.svg`, knotDiagram(k, { panelImages }));
}

for (const r of rigs) {
  if (only && r.id !== only) continue;
  const image = inlined(`leader-${r.id}`);
  if (image) rendered += 1;
  emit(OUT, `leader-${r.id}.svg`, leaderDiagram(r, { knots: knotsById, flies: fliesById, image }));
}

console.log('');
if (CHECK) {
  console.log(changed.length
    ? `  ${changed.length} diagram(s) out of date: ${changed.join(', ')}`
    : '  diagrams are up to date');
} else {
  console.log(`  wrote ${written.length} diagram(s) to app/public/assets/diagrams/`);
  const bytes = written.reduce((a, f) => a + readFileSync(join(OUT, f)).length, 0);
  console.log(`  ${(bytes / 1024).toFixed(0)} KB total`);
  console.log(rendered
    ? `  ${rendered} panel(s) using rendered artwork; the rest are vector.`
    : '  all vector — no rendered panels found in app/public/assets/panels/.');
  // Rendered panels are inlined, so they land in the PWA precache. Worth
  // knowing before it becomes a slow first load on hotel wifi.
  if (bytes > 3 * 1024 * 1024) {
    console.log('');
    console.log('  NOTE: the diagram set is over 3 MB and every byte is precached for');
    console.log('  offline use. If that is too heavy, shrink the panel JPEGs in');
    console.log('  app/public/assets/panels/ and run this again — nothing else changes.');
  }
}
for (const s of skipped) console.log(`  skipped: ${s}`);
console.log('');
process.exit(CHECK && changed.length ? 1 : 0);
