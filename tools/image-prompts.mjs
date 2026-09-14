// Fly Box — build the image prompt pack
// ---------------------------------------------------------------------------
//   node content/build.mjs && node tools/image-prompts.mjs
//
// Writes tools/image-prompts.json: one entry per fly and per organism stage,
// keyed to the content id so the generated file lands at the path the content
// already points at. Run generate-images.mjs afterwards to actually render.
//
// The prompts are deliberately anatomical rather than evocative. The failure
// mode with these models is not ugliness, it is confident wrongness: a hook
// bent the wrong way, a wing on the wrong side of the shank, a mayfly nymph
// with a caddis body. Every prompt below names the parts, the order they sit
// in, and the geometry — and every fly prompt says explicitly whether the
// pattern rides point up, because that is the single most-broken detail.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const bundle = JSON.parse(readFileSync(resolve(ROOT, 'app/src/content/bundle.json'), 'utf8'));

// ---------------------------------------------------------------------------
// Shared style
// ---------------------------------------------------------------------------

const FLY_STYLE = [
  'Studio macro product photograph of one single fly-fishing fly, shown in full profile,',
  'centred against a seamless pale warm-grey background with soft even lighting and a faint shadow.',
  'The whole hook and the whole fly are inside the frame with clear space around them.',
  'Sharp focus front to back. Photographic realism, natural materials, correct proportions.',
  'No hands, no vise, no jaws, no tools, no water, no fish, no packaging, no text, no watermark, no border, no collage.',
  'Exactly one fly in the image.',
].join(' ');

const BUG_STYLE = [
  'Macro natural-history photograph of one single live specimen,',
  'centred against a seamless pale warm-grey background with soft even lighting.',
  'The whole animal is inside the frame, in sharp focus, in a clear side or three-quarter view.',
  'Scientifically accurate anatomy and proportions, correct number of legs, tails and wings.',
  'No hook, no fishing fly, no line, no hands, no tools, no text, no watermark, no collage.',
  'Exactly one animal in the image.',
].join(' ');

// Weighted-at-the-head patterns swim upside down. Saying "inverted" is not
// enough — the model needs the geometry stated as a relationship.
const INVERTED = [
  'This is an inverted pattern that rides with the hook point uppermost:',
  'the wing and the hook point are on the SAME side of the hook shank,',
  'and the weighted eyes sit on the opposite side, at the head.',
  'Show it in that swimming orientation, point up.',
].join(' ');

const UPRIGHT = 'Show it as it is tied, hook point downward, shank horizontal, hook eye to the left.';

// ---------------------------------------------------------------------------
// How each pattern family is actually built
// ---------------------------------------------------------------------------
// One entry per family; colour variants inherit and have their colour spliced
// in, which is why the text never names a colour itself.

const FAMILY = {
  'gotcha': { build: 'A Gotcha bonefish fly: a short tail of pearl mylar tubing, a body of flat pearlescent braid wound along the shank, small stainless bead-chain eyes lashed at the head, and a sparse swept-back craft-fur wing with two or three strands of pearl Krystal Flash over it, on a short-shank stainless saltwater hook.', invert: true },
  'crazy-charlie': { build: 'A Crazy Charlie: small stainless bead-chain eyes at the head, a slim body of flat braid overwrapped with clear round V-rib so the segmentation shows, and a sparse swept-back calf-tail wing, on a short-shank stainless hook.', invert: true },
  'veverkas-mantis-shrimp': { build: "Veverka's Mantis Shrimp: a shaggy craft-fur and marabou body with barred rubber legs along the sides, two mono eyes on short stalks projecting forward beyond the hook eye, a segmented shellback over the top, and lead dumbbell eyes at the head.", invert: true },
  'bonefish-bitters': { build: 'A Bonefish Bitters: a short stubby body of spun deer hair with a hard epoxy shellback over the top, three or four rubber legs splayed out to each side, and small bead-chain eyes, tied sparse and light on a short stainless hook.', invert: true },
  'squimp': { build: 'A Squimp: a slim translucent craft-fur body, long rubber legs trailing like squid tentacles, a few strands of flash, and small bead-chain eyes at the head.', invert: true },
  'strong-arm-merkin': { build: 'A Strong Arm Merkin permit crab: a flat oval body of yarn trimmed to a crab carapace shape, two prominent rubber claw arms reaching forward from the head, several rubber legs splayed to each side, and heavy lead dumbbell eyes.', invert: true },
  'avalon': { build: 'An Avalon permit crab: a bulky tapered body with rubber legs, heavy lead dumbbell eyes at the head, and two mono loops trailing from the rear strung with bright beads that hang below the fly.', invert: true },
  'tarpon-toad': { build: 'A Tarpon Toad: a broad flat splayed tail of rabbit strip and craft fur, a compact spun-and-trimmed body collar behind the hook eye, no weighted eyes, on a heavy short-shank tarpon hook.', invert: false },
  'clouser-minnow': { build: 'A Clouser Minnow: heavy lead dumbbell eyes lashed near the head, a sparse bucktail wing of two colours, and a slim thread head, on a straight-shank saltwater hook.', invert: true },
  'ep-baitfish': { build: 'An EP-style baitfish: a wide translucent body of brushed synthetic fibre trimmed to a deep-bodied minnow profile that tapers to a tail, with large stick-on eyes at the head and no weight.', invert: false },
  'gurgler': { build: 'A Gurgler: a long bucktail tail, a palmered hackle body, and a foam strip pulled forward over the top of the body and tied off at the head so it stands up as a raised lip in front.', invert: false },
  'palolo-worm-fly': { build: 'A palolo worm fly: a slim segmented chenille body with a long soft marabou or rabbit tail twice the body length, a small bead head, and no weighted eyes.', invert: false },

  'walts-worm': { build: "A Walt's Worm nymph: a plain shaggy hare's-ear dubbing body brushed out so the guard hairs stand off, no tail and no wing at all, and a tungsten bead at the head, on a curved jig nymph hook.", invert: false },
  'pheasant-tail': { build: 'A Pheasant Tail nymph: three pheasant-tail fibre tails, a slim pheasant-tail fibre abdomen ribbed with fine copper wire, a fuller peacock-herl thorax, a dark pheasant-tail wingcase over the thorax, and a metal bead at the head.', invert: false },
  'frenchie': { build: 'A Frenchie nymph: coq-de-leon tail fibres, a pheasant-tail abdomen ribbed with fine copper wire, and a bright fluorescent dubbing hot-spot collar directly behind a tungsten bead.', invert: false },
  'perdigon': { build: 'A Perdigon nymph: a very slim smooth body of thread coated in glossy clear UV resin so it looks lacquered, a few stiff coq-de-leon tail fibres, a dark collar band behind the head, and an oversized tungsten bead.', invert: false },
  'zebra-midge': { build: 'A Zebra Midge: a very small, very slim thread body ribbed with fine silver wire on a curved short hook, a tungsten bead at the head, no tail and no wing.', invert: false },
  'rs2': { build: 'An RS2 emerger: a slim dubbed body, two split microfibett tails, and a short sparse upright wing tuft of grey CDC or synthetic fibre at the thorax, tied small and unweighted.', invert: false },
  'parachute-adams': { build: 'A Parachute Adams dry fly: a white calf-hair post standing upright, grizzly hackle wound horizontally around the base of that post, a grey dubbed body, and mixed brown and grizzly fibre tails.', invert: false },
  'elk-hair-caddis': { build: 'An Elk Hair Caddis dry fly: a dubbed body with a hackle palmered along its whole length, a flared elk-hair wing lying tent-shaped over the body and extending past the hook bend, and a squared-off clipped-hair head.', invert: false },
  'griffiths-gnat': { build: "A Griffith's Gnat: a peacock-herl body with a grizzly hackle palmered along the entire length so it bristles evenly, tied very small on a dry-fly hook.", invert: false },
  'pats-rubber-legs': { build: "A Pat's Rubber Legs stonefly nymph: a fat chenille body, three pairs of white rubber legs splayed from the sides plus rubber tails and antennae, and a heavy lead-wire underbody.", invert: false },
  'scud-fly': { build: 'A scud pattern: a curved dubbed body picked out underneath so the fibres look like legs, a thin clear plastic shellback stretched over the top and ribbed with fine wire, on a curved hook, with no tail and no wing.', invert: false },
  'squirmy-worm': { build: 'A Squirmy Worm: a single soft stretchy silicone worm strand lashed across the middle of a short hook so both ends dangle freely, with a bead at the head.', invert: false },
  'woolly-bugger': { build: 'A Woolly Bugger: a soft marabou tail as long as the body, a chenille body with a saddle hackle palmered along its full length, and a bead head.', invert: false },
};

// ---------------------------------------------------------------------------
// What each animal actually looks like
// ---------------------------------------------------------------------------

const ANATOMY = {
  'snapping-shrimp.adult': 'A small snapping shrimp: a segmented curved body, a fantail at the rear, one claw noticeably larger than the other, long fine antennae reaching forward past the head, several pairs of small legs beneath, and dark eyes on short stalks.',
  'mantis-shrimp.adult': 'A mantis shrimp: a long low segmented body, a broad fantail, two folded raptorial forelimbs held under the head, prominent eyes on stalks, and many small legs along the underside.',
  'swimming-crab.juvenile': 'A very small juvenile swimming crab: a rounded flattened carapace wider than it is long, two small claws held up in front, eight walking legs with the rear pair flattened into paddles, and eyes on short stalks.',
  'swimming-crab.adult': 'An adult swimming crab: a broad flattened carapace with pointed side spines, two strong claws raised in a defensive posture, eight legs with the rear pair flattened into swimming paddles.',
  'swimming-crab.molting': 'A freshly moulted soft-shell swimming crab: a broad flattened carapace, two claws and eight legs with the rear pair flattened into paddles, but the shell pale, soft and slightly wrinkled and the claws hanging limp — visibly defenceless.',
  'glass-minnow.schooling': 'A single glass minnow or silverside: a slender translucent baitfish with a forked tail, a bright silver lateral stripe running the length of the body, a large dark eye, and a small terminal mouth.',
  'bay-anchovy.schooling': 'A single bay anchovy: a very slim translucent baitfish with an oversized mouth set well back, a large eye, a silver stripe along the flank, and a forked tail.',
  'palolo-worm.spawning': 'A spawning palolo worm: a slim rust-orange segmented marine worm with many fine side bristles along its length, swimming in open water, tapering at both ends.',

  'blue-winged-olive.nymph': 'A tiny slender mayfly nymph of the swimming type: a narrow tapered segmented abdomen, THREE thin tails, small feathery gills along the sides of the abdomen, dark wing pads on the thorax, six legs, and two short antennae.',
  'blue-winged-olive.emerger': 'A small mayfly emerging at the water surface: the adult half-pulled out of a split nymphal shuck still attached at the rear, with crumpled unopened wings and the body hanging in the surface film.',
  'blue-winged-olive.dun': 'A small mayfly dun at rest on the water: two upright opaque grey wings held together above the body like a sail, a slender curved abdomen, two or three long tails, six legs.',
  'blue-winged-olive.spinner': 'A small spent mayfly spinner: clear glassy wings spread flat out to both sides lying flush in the surface film, a very slim body, and long thin tails.',
  'pale-morning-dun.nymph': 'A small crawler mayfly nymph: a stouter, flatter body than a swimming nymph, three tails, plate-like gills along the abdomen, thick dark wing pads, and sturdy legs gripping.',
  'pale-morning-dun.emerger': 'A pale yellow mayfly emerging from its nymphal shuck at the surface, wings still crumpled and half-unfolded.',
  'pale-morning-dun.dun': 'A pale yellow mayfly dun on the water: upright pale wings held together over the body, a soft yellow-cream abdomen, three tails.',
  'pale-morning-dun.spinner': 'A spent mayfly spinner with clear wings flat on the surface and a rust-toned slim body.',
  'caddis.larva': 'A caddis larva: a pale grub-like segmented soft body curled into a C, a distinctly darker hard head capsule, and three pairs of small legs clustered just behind the head. No wings, no tails.',
  'caddis.pupa': 'A caddis pupa: a curved body with developing wing pads swept back along the sides, long trailing legs and antennae folded along the body, and a swollen thorax.',
  'caddis.adult': 'An adult caddisfly: a moth-like insect with hairy wings folded tent-shaped over the back, long antennae swept forward, six legs, and no tails at all.',
  'midge.larva': 'A midge larva: an extremely thin worm-like segmented body slightly curved, no legs and no wings, with a tiny darker head.',
  'midge.pupa': 'A midge pupa: a slim body with a slightly swollen thorax, hanging vertically, with a small tuft of white breathing filaments at the head.',
  'midge.adult': 'An adult midge: a tiny delicate two-winged fly with clear wings held flat over a slender body, long fine legs, and feathery antennae.',
  'golden-stonefly.nymph': 'A large stonefly nymph: a robust flattened segmented body, TWO tails (not three), two prominent dark wing pads, strong legs splayed widely to the sides, and two long antennae.',
  'golden-stonefly.adult': 'An adult stonefly: long flat wings folded flat along the back rather than tented, two short tails, a long segmented body, and long antennae.',
  'scud.adult': 'A freshwater scud: a laterally flattened shrimp-like crustacean curled into a comma shape, with many small legs along the underside, segmented plates over the back, and short antennae.',
  'sculpin.adult': 'A sculpin: a small bottom-dwelling freshwater fish with a broad flattened head much wider than its tapering body, large fan-like pectoral fins held out to the sides, eyes set high on top of the head, a wide mouth, and mottled camouflage. No silver flash, no forked tail.',
  'leech.adult': 'A freshwater leech: a soft flattened segmented worm-like animal, tapering at both ends, stretched out mid-swim in an S-shaped undulation. No legs, no bristles, no head capsule.',

  'aquatic-worm.adult': 'An aquatic worm: a thin soft segmented worm with no legs, no head capsule and no bristles, lying in a loose curve.',
};

// ---------------------------------------------------------------------------
// Compose
// ---------------------------------------------------------------------------

const colourPhrase = (fly) => {
  const c = fly.color && fly.color !== 'natural' ? fly.color.replace(/-/g, ' and ') : null;
  if (!c) return 'Tie it in its standard natural colours.';
  return `The colour scheme is ${c} — materials in those colours throughout.`;
};

const sizePhrase = (fly) => {
  const [a, b] = fly.hookSizes ?? [];
  if (a == null) return '';
  const small = a >= 16;
  return small
    ? 'This is a very small fly — keep it sparse and delicate, not bulky.'
    : `A size ${a} to ${b} hook.`;
};

const entries = [];

for (const fly of bundle.tables.flies) {
  const fam = FAMILY[fly.family];
  if (!fam) {
    console.warn(`  no construction text for family "${fly.family}" (${fly.id}) — skipped`);
    continue;
  }
  entries.push({
    id: fly.id,
    kind: 'fly',
    file: `assets/${fly.id}.jpg`,
    label: fly.name,
    prompt: [
      fam.build,
      colourPhrase(fly),
      sizePhrase(fly),
      fam.invert ? INVERTED : UPRIGHT,
      FLY_STYLE,
    ].filter(Boolean).join(' '),
  });
}

for (const org of bundle.tables.organisms) {
  for (const st of org.stages ?? []) {
    const key = `${org.id}.${st.stage}`;
    const anatomy = ANATOMY[key];
    if (!anatomy) {
      console.warn(`  no anatomy text for "${key}" — skipped`);
      continue;
    }
    const size = st.sizeMm ? `Roughly ${st.sizeMm[0]}–${st.sizeMm[1]} mm long.` : '';
    const colour = st.colors?.length ? `Colouring: ${st.colors.slice(0, 3).join(', ').replace(/-/g, ' ')}.` : '';
    const where = st.where ? `Shown as it would be found: ${st.where.toLowerCase()}.` : '';
    entries.push({
      id: `${org.id}-${st.stage}`,
      kind: 'organism',
      organism: org.id,
      stage: st.stage,
      file: `assets/${org.id}-${st.stage}.jpg`,
      label: `${org.name} — ${st.stage}`,
      prompt: [anatomy, size, colour, where, BUG_STYLE].filter(Boolean).join(' '),
    });
  }
}

const out = {
  builtAt: new Date().toISOString(),
  model: 'fal-ai/nano-banana-2',
  contentVersion: bundle.contentVersion,
  count: entries.length,
  entries,
};

writeFileSync(resolve(HERE, 'image-prompts.json'), JSON.stringify(out, null, 2));

const flies = entries.filter((e) => e.kind === 'fly').length;
console.log('');
console.log(`  tools/image-prompts.json — ${entries.length} prompts (${flies} flies, ${entries.length - flies} bug stages)`);
console.log('  next:  node tools/generate-images.mjs');
console.log('');
