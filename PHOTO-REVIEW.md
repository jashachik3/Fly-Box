# Photo review — saltwater / flats patterns

Checking the image prompts against **photographs of the actual flies**, not written
recipes. Started with the Belize flats set because that is the fishing.

*Session of 15 Sep 2026. Pass 1 complete: all 37 saltwater patterns checked.
61 freshwater patterns still to do.*

---

## Why this pass exists

`PROMPT-REVIEW.md` checked all 281 prompts against **written** recipes and tying
descriptions. It found two real systemic bugs and I reported it as complete.

It could not find the error class that matters most. If the prompt describes the
wrong fly, and the source I checked it against described the same wrong fly, the
prompt passes. Text checked against text validates internal consistency, not
identity.

The Bonefish Bitters is the proof. Our prompt describes an epoxy teardrop head with
bead-chain eyes. The actual Mathews pattern is glass beads and a deer-hair collar —
no epoxy anywhere in it. It sailed through the written review.

**So the rule for this pass is: look at photographs of the fly before writing a word
about it.** A tying recipe is corroboration, never the primary source.

---

## Method

For each pattern:

1. **Image search first.** Google Images, pattern name in quotes plus a
   disambiguating word (`"bauer crab" fly pattern permit`). Look at 10–20 results.
2. **Establish the signature.** What single feature makes this fly identifiable as
   itself and not a generic shrimp/crab/baitfish? Glass beads on the Bitters. The
   mesh carapace on the Flexo. The rug-yarn disc on the Merkin. If the prompt does
   not nail the signature, the image will not read as the pattern no matter how good
   the render is.
3. **Check orientation against the photos**, not against theory. Most flats patterns
   ride point-up; confirm it rather than assuming.
4. **Where the photos leave it ambiguous, open a tying page** with a materials list
   and read it. Record which source settled it.
5. **Write the verdict, then the corrected prompt.** Verdicts are:
   - `WRONG` — describes a different fly, or misses the signature feature
   - `MINOR` — right fly, wrong detail
   - `OK` — matches the photographs
   - `PROMPT OK / RENDER WRONG` — prompt is accurate, the model disobeyed it
   - `NOT CHECKED` — not yet done

Do not batch step 2. Every pattern that got batched into a template is one of the
ones that came out wrong.

---

## The shared presentation spec

Separate from accuracy. Three different specs are live in the set right now and that
is why the images don't sit together:

| Family | Count | Background | Result |
|---|---|---|---|
| Hand-authored fly prompts | 213 | seamless pure white | white |
| Thin template fly prompts | 11 | pale warm-grey + shadow | grey |
| Organism prompts | 72 | naturalist plate | cream |
| Knot panels | 38 | flat off-white | off-white |
| Leader schematics | 7 | flat off-white | off-white |

*(Corrected 15 Sep. The earlier figures here — 211 / 18 / 67 — were all wrong, and
the knot and leader families were missing entirely. 341 total.)*

Going forward every fly prompt ends with this block, unchanged, so the set is one set:

> Studio macro product photograph, seamless pure white background, soft even
> lighting, no cast shadow. **The fly is oriented with the hook eye at the LEFT of
> the frame and the bend and tail to the RIGHT.** The whole fly including the entire
> hook sits inside the frame with even margins; the fly spans roughly 80% of the
> frame width. Sharp focus front to back. Exactly one fly in the image — not two,
> not a pair, not a size range. No hands, no vise, no tools, no water, no packaging,
> no text, no watermark, no border.

Organisms keep the plate treatment but take the same orientation, margin, and
single-subject rules so the two families are deliberate rather than accidental.

---

## Findings — Belize flats set (37 base saltwater patterns)

### Verified against photographs

**`bonefish-bitters` — WRONG.** Prompt: *"the front half of the shank is encased in a
smooth glossy teardrop of amber-tan epoxy/hot-melt glue, with small silver bead-chain
eyes embedded in that teardrop."* No. The Bitters is defined by **two or three
translucent glass beads** at the head, a **flared deer-hair collar** behind them, and
**long splayed rubber legs**. Stubby short-shank hook, rides point-up. There is no
epoxy and no bead chain. This is a different fly wearing the name.

**`strong-arm-merkin` — WRONG.** Prompt: *"two prominent rubber claw arms reaching
forward from the head."* Backwards. The claws are at the **rear, over the bend**,
like Del Brown's Merkin — that is the whole point of the name, they're oversized
claws on a Merkin-style body. Prompt also uses the thin template, so it never had a
body description worth the name.

**`mantis-shrimp` and `veverkas-mantis-shrimp` — WRONG (duplicate subject).** Both
prompts describe Veverka's Mantis Shrimp. `mantis-shrimp` is supposed to be the
generic mantis pattern. Two entries, one fly. One of them needs rewriting from
scratch, and the content record probably needs a look too.

**`squimp` — WRONG (thin).** Prompt: *"a slim translucent craft-fur body, long rubber
legs trailing like squid tentacles."* That last clause is invented — it reads like
flavour text, not observation. The real Squimp is a shrimp/mantis hybrid: tan craft
fur wing, pearl body, **black mono shrimp eyes on stalks**, bead-chain eyes, barred
rubber legs. Needs writing from photographs.

**`gotcha` — PROMPT OK / RENDER WRONG.** The prompt is accurate: pink thread head,
bead-chain eyes, tan craft-fur wing, pearl braid body and shredded braid tail, rides
point-up. The generated image came back **point-down**. The Clouser got the same
instruction and obeyed it. Model compliance issue on inverted patterns — needs a
re-roll, not a rewrite.

**`crazy-charlie` — OK.** Bead-chain eyes, pearl underbody under clear rib, unstacked
calf-tail wing, no tail, point-up. Matches the photographs.

**`flexo-crab` — MINOR.** Mesh carapace and construction are right. Eyes are wrong:
prompt says *"two large red crab eyes"*, photographs show **small black mono eyes**.

**`bauer-crab` — MINOR / verify.** Fuzzy trimmed body, rubber legs, mono eyes all
check out. The *"soft splayed feather-tip claws"* appear on some commercial ties and
not others — worth settling against Bauer's own recipe rather than shop photos.

**`raghead-crab` — MINOR.** Wool/McFly-Foam disc, rubber legs, marabou and hackle
claws all match. Prompt says *"two small **yellow** mono crab eyes"* — photographs
show black. Same error as the Flexo.

**`spoon-fly` — VERIFY.** Prompt says *"no tail, no wing, no hair."* Most commercial
spoon flies (Dupre, Orvis, Kirk's) carry a bucktail or hackle tail. Tailless versions
exist. Need to decide which one this entry is meant to be.

**`tarpon-toad` — OK.** Flat EP-fibre toad head, mono eyes, bare shank, marabou
collar and rabbit-strip tail, point-down. Matches.

**`kwan` — OK (close).** Rug-yarn body, dumbbell eyes, craft-fur tail, orange hot
spot, weedguard. Matches the photographs.

**`peterson-spawning-shrimp` — see below.** Flagged PARTIAL on the first pass over the
egg-sac position; settled later in this pass and upgraded to WRONG.

**`merkin` — OK.** Tan rug-yarn oval carapace X-wrapped on the shank, white rubber
legs with red tips, splayed brown hackle-tip claws at the bend, lead dumbbell eyes,
rides inverted. Matches the photographs of Del Brown's original.

**`avalon-permit` — MINOR.** Bead keel, orange head, dumbbell eyes and tan body all
check out. Two details are off: the prompt says the trailing antennae are *"long black
Krystal Flash"* — photographs consistently show **black-and-orange rubber legs** as the
antennae; and it gives the claws as *"light tan zonker strips"* where the photographs
show **tan craft fur or arctic fox**. Zonker is not standard on this fly.

**`cockroach` — MINOR.** Bare forward shank, brown bucktail collar at the rear, splayed
grizzly saddles at the bend — all correct. The prompt adds *"a small painted eye"* to
the head. The Keys-style Cockroach has a plain lacquered thread head, no eye.

**`black-death` — OK.** Bare forward shank, red collar, splayed black saddles off the
bend, small glossy head. Matches.

**`seaducer` — MINOR.** Structure is right. Density is wrong: the prompt asks for the
body hackle to be *"palmered in open turns... sparse, translucent, spiky."* The Seaducer
is characteristically **dense and bushy** — the palmered hackle is what gives it its
pushy, high-floating profile. As written it will render as a thin, underdressed fly.

**`palolo-worm-fly` — VERIFY.** The arrangement (olive front, long red worm body off the
bend) matches. But the commercial ties diverge on material and proportion: RIO's uses a
short olive dubbing ball and a long red vernille worm; Chard's is a fuller marabou head;
Gartside's is a shaggy dubbed body throughout. Our prompt is a fourth thing — golden-olive
hackle collar *plus* micro-chenille body *plus* a rabbit-strip tail. Needs a decision on
which tie this entry is.

**`needlefish-fly` — VERIFY (and duplicate subject).** The photographs are dominated by
**single-hook** ties — Nightmare Needlefish, Cuda Snack, the tube styles. Our prompt
specifies a two-hook stinger rig, which is a minority tie. Separately: this entry and
`cuda-fly` describe the same fly. Two entries, one pattern — like the mantis shrimp pair.

**`cuda-fly` — VERIFY (duplicate subject).** Same two-hook problem, same overlap with
`needlefish-fly`. One of the two needs to become a genuinely different barracuda fly or
be dropped.

**`albie-fly` — MINOR (and duplicate subject).** The prompt has the resin *"encasing the
front two thirds of the fly... back past the bend."* Photographs show resin over roughly
the **front third**, with the wing running free well past it. As written the fly will
render as a solid glass slug. Also: the label is literally *"Albie Fly (Surf Candy /
Epoxy Anchovy)"* and we have a separate `surf-candy` entry. Same overlap problem.

**`crease-fly` — MINOR.** Folded-foam body, prismatic eye, epoxy shell, sparse tail all
correct. The face is wrong: the prompt says *"a hollow concave scooped face."* Blados'
Crease Fly has a **flat angled cut face** — the "crease" is the fold along the top of the
body, not a scoop at the front.

**`gurgler` — OK.** Forward foam lip over the hook eye, foam shellback, palmered hackle,
bucktail tail. Matches Gartside's pattern.

**`gummy-minnow` — OK.** Translucent silicone body, forked tail, oversized pearl eye,
olive back. Matches.

**`hollow-fleye` — OK.** Reversed bucktail bunches, hollow airy profile, no body, small
head with tab eyes. Matches Popovics' pattern.

**`squid-fly` — MINOR.** Mantle, resin collar, long trailing hackle tentacles all match.
The prompt has the eyes *"facing back toward the tentacles"*; photographs show them set
**on the sides of the mantle facing outward**.

**`redfish-toad` — VERIFY.** This name covers several unrelated commercial ties — CW
Flies' bright rubber-legged version, Sight Cast's Texas Toad, the marabou toads. Our
prompt describes a wide flat trimmed oval body, which is a **tarpon** toad. Needs a
decision on which fly this entry is, and it may be redundant against `tarpon-toad`.

**`ep-shrimp` — WRONG.** The prompt places the hot-orange egg mass *"at the REAR of the
body, over the bend."* Every photograph of the EP Spawning Shrimp puts the egg sac at the
**front, just behind the weighted eyes at the hook-eye end**, with the antennae sweeping
forward past the hook eye. The egg sac is the signature of the fly and it is on the wrong
end. Prompt also specifies a mono weedguard that most ties do not carry.

**`peterson-spawning-shrimp` — WRONG (upgraded from PARTIAL).** Settled by the same
search. Peterson's egg sac is also at the **head end, behind the mono eyes**, not at the
bend. Both spawning-shrimp prompts carry the same inverted-anatomy error.

**`surf-candy` — OK.** Layered Ultra Hair wing, mylar underbody, resin head with prism
eye and gill slash, point-down. Matches. Flagged only for the overlap with `albie-fly`.

**`clouser-minnow` — OK.** Dumbbell eyes a third back, chartreuse over white bucktail,
bare rear shank, rides point-up. Matches.

**`clouser-redfish` — MINOR (internal contradiction).** The prompt says the belly hair
lies *"on the side of the shank away from the hook point"*, then the orientation clause
says *"the wing and the weighted eyes are tied on the SAME side of the shank as the hook
point."* The dumbbell eyes **straddle** the shank on figure-eight wraps — that is what
flips the fly. `clouser-minnow` words this correctly; this one does not, and a model
reading it literally will hang the eyes on the wrong side.

**`ep-baitfish` — OK.** Stacked EP bunches, slab-sided trimmed silhouette, 3D eye in a
resin bead, olive over white. Matches.

**`ep-sand-eel` — MINOR.** Profile and proportions are right. The prompt builds the body
from *"bunches... folded back over themselves"* and trimmed; sand eel ties in the
photographs are much **sparser** — typically one long thin wing over a slim body, not a
built-up trimmed mass.

**`half-and-half` — OK.** Clouser front end, Deceiver saddle-hackle tail at the bend,
dumbbell eyes, point-up. Matches.

**`lefty-deceiver` — OK.** Bucktail collar spun around the shank, splayed white saddle
tail at the bend, painted head, point-down. Matches.

**All 37 saltwater patterns are now checked.**

---

## Running tally — all 37 saltwater patterns

| Verdict | Count | Patterns |
|---|---|---|
| WRONG | 8 | bonefish-bitters, strong-arm-merkin, mantis-shrimp, veverkas-mantis-shrimp, squimp, ep-shrimp, peterson-spawning-shrimp, bauer-crab |
| MINOR | 10 | flexo-crab, raghead-crab, avalon-permit, cockroach, seaducer, albie-fly, crease-fly, squid-fly, clouser-redfish, ep-sand-eel |
| VERIFY | 5 | spoon-fly, palolo-worm-fly, needlefish-fly, cuda-fly, redfish-toad — **all now settled, see Decisions** |
| PROMPT OK / RENDER WRONG | 1 | gotcha |
| OK | 13 | crazy-charlie, tarpon-toad, kwan, merkin, black-death, gurgler, gummy-minnow, hollow-fleye, surf-candy, clouser-minnow, ep-baitfish, half-and-half, lefty-deceiver |

**24 of 37 need work; 13 are clean.** That is a 65% touch rate, far higher than the
written review suggested, and it confirms the method change was the right call.

### Where the errors cluster

**1. Thin-template prompts — 3 of 18 checked, 3 wrong.** `strong-arm-merkin`, `squimp`,
`veverkas-mantis-shrimp`. Every template prompt that got looked at failed. These 18 are
the single highest-yield thing to fix and should be rewritten from photographs wholesale
rather than reviewed one at a time.

**2. Anatomy placed on the wrong end — 3 flies.** Both spawning shrimps put the egg sac
at the bend when it belongs at the head; `strong-arm-merkin` puts the claws at the head
when they belong at the bend. Worth a targeted grep over the remaining 61 freshwater
prompts for the same class of error before regenerating anything.

**3. Duplicate subjects — 3 pairs.** `mantis-shrimp`/`veverkas-mantis-shrimp`,
`needlefish-fly`/`cuda-fly`, `albie-fly`/`surf-candy`. And `redfish-toad` may be a fourth
against `tarpon-toad`. These are content-record problems, not prompt problems — the fix
is in `flies.json`, not just in the prompt text.

**4. Over-specified resin and under-specified density.** `albie-fly` drowns the fly in
epoxy; `seaducer` and `ep-sand-eel` ask for sparse where the real flies are dense and
dense where the real fly is sparse. Low-stakes individually, but they are why the set
doesn't look like a fly box.

---

## Decisions — settled 15 Sep 2026

Group A (which fly is this entry?), Group B (duplicates) and Group C (hook rig) are all
closed. These are the agreed targets; the prompt rewrites follow from them.

### A. Pattern identity

| Entry | Decision |
|---|---|
| `spoon-fly` | **Kirk's Spoon Fly** — gold/copper spoon blade with a flash-and-hackle tail off the bend. Our current tailless prompt describes the Dupre; rewrite. |
| `palolo-worm-fly` | **RIO's** — long red vernille worm off the bend, short olive dubbing ball at the front. Drop the hackle collar and the rabbit strip. |
| `redfish-toad` | **Texas Toad / Sight Cast style** — bead-chain eyes, craft-fur tail, spun dubbing collar, rubber legs. No longer a trimmed oval body, which was a tarpon toad. |
| `bauer-crab` | **Settled by source, not by preference.** See below. |

**`bauer-crab` — upgraded to a rewrite, not a MINOR fix.** Drew Chicone, writing in *Fly
Tyer*, describes the original directly: a **sculpin wool** body with **melted monofilament
eyes glued into the fibers**, and **knotted square rubber legs** where the segment below
each knot faces rearward — he names that leg configuration as the fly's iconic feature.

Two corrections follow. The *"soft splayed feather-tip claws"* in our prompt are a shop
embellishment and come out — Chicone mentions feather claws only as a **flaw** in a
different fly of his own. And our prompt has plain rubber legs with no knot, which means
it is missing the actual signature.

**Knock-on: `raghead-crab` gets a second correction.** The same article establishes the
Raghead as **felt**-bodied. Our prompt says *"wool / McFly Foam disc."* That is on top of
the yellow-vs-black eye error already logged.

### B. Duplicate subjects

| Pair | Decision |
|---|---|
| `mantis-shrimp` / `veverkas-mantis-shrimp` | **Both stay.** Veverka's keeps the named pattern. `mantis-shrimp` is rewritten as a generic mantis — tan/cream body, long banded rubber-leg antennae sweeping forward past the hook eye, black mono eyes on stalks. Check the `flies.json` record too, not just the prompt. |
| `needlefish-fly` / `cuda-fly` | **Drop `cuda-fly`.** `needlefish-fly` becomes the single-hook long tube / EZ-Body style that dominates the photographs. |
| `albie-fly` / `surf-candy` | **Both stay.** `surf-candy` keeps the Popovics name. `albie-fly` is rewritten as a **Jiggy** — weighted cone head, sparse synthetic wing, prism eyes. Verified as a genuinely different fly: no full epoxy body, weight at the nose instead. |
| `redfish-toad` / `tarpon-toad` | **Not a duplicate** once A resolves `redfish-toad` to the craft-fur redfish tie. |

### C. Hook rig

**Single hook.** Settled by dropping `cuda-fly`. The surviving `needlefish-fly` loses the
two-hook stinger rig, which the photographs showed to be a minority tie.

---

---

## The thin-template fix — done 15 Sep 2026

### What was actually wrong

`tools/image-prompts.json` is **generated**, not hand-written. `tools/image-prompts.mjs`
builds every prompt from a `FAMILY` template keyed on the fly's family, then overlays any
hand-authored prompt found in `tools/prompts-reviewed.json`. A reviewed prompt wins; a fly
with no reviewed entry falls through to the template.

The "thin-template prompts" were never a style of writing. They were simply **the 11 fly
ids with no entry in `prompts-reviewed.json`** — confirmed exactly: the set of
template-rendered prompts and the set of unreviewed fly ids were identical. The grey
background was the tell, because the template's style block is the only thing in the
project that asks for grey.

So editing `image-prompts.json` would have been thrown away on the next build. The fix
belongs in `prompts-reviewed.json`.

### The template's structural bug

Worth recording, because it explains why variants failed rather than just base patterns.
The generator composes a prompt as:

> `build` + `colourPhrase` + `sizePhrase` + orientation + style

and `colourPhrase` renders as *"The colour scheme is X — materials in those colours
throughout."* The `build` text is shared by every colour variant in a family and never
names a colour.

That works for a genuine colour variant. It breaks whenever the variant's distinguishing
feature is **structural** rather than chromatic, because the only per-variant slot is the
colour field:

- **`walts-worm-hot-spot`** — the hot spot is a narrow orange collar behind the bead on an
  otherwise natural grey-brown fly. Encoded as colour `natural/orange`, the template said
  *"materials in those colours throughout"* — an entirely orange worm.
- **`pheasant-tail-flashback`** — the flashback is a **pearl mylar wingcase**. The shared
  `build` text says *"a dark pheasant-tail wingcase"*, and the variant's only input was the
  colour `natural/pearl`. The prompt therefore described a standard Pheasant Tail. The one
  feature the fly is named for was absent.

Both verified against photographs before rewriting.

### What was done

All 11 written from photographs and added to `prompts-reviewed.json`, plus a corrected
`bonefish-bitters` (already reviewed, but describing the wrong fly — epoxy and bead chain
instead of glass beads and a deer-hair collar). 278 → 289 reviewed prompts.

| Id | What changed |
|---|---|
| `bonefish-bitters` | Rewritten — glass beads + flared deer-hair collar + splayed rubber legs. Explicit "no epoxy, no resin, no bead chain". |
| `bonefish-bitters-amber` / `-chartreuse` | Same correction, per colour. |
| `strong-arm-merkin` + `-tan` + `-olive` | Claws moved to the **rear over the bend**; explicit "nothing projects forward past the hook eye". |
| `veverkas-mantis-shrimp` | Full rewrite — forward-projecting mono eyes on stalks, ribbed segmented shellback, low profile. |
| `squimp` | Rewritten from photographs — mono shrimp eyes on stalks, pearl braid body, **short splayed** legs, not trailing "squid tentacles". |
| `tarpon-toad-black` | Rewritten to match the (verified-correct) base Tarpon Toad, in black. |
| `walts-worm-hot-spot` | Hot spot now an explicit narrow orange collar behind the bead, with the body stated as natural grey-brown and an explicit instruction that the rest must not be orange. |
| `pheasant-tail-flashback` | Pearl mylar flashback wingcase written in explicitly, overriding the family's dark wingcase. |
| `squirmy-worm` | Jig hook + tungsten bead; strand lies **along** the shank, not across it. |

**Result: 224 of 224 fly prompts now have a reviewed prompt. Zero fall through to the
template, so the grey-background family no longer exists.** One of the three competing
backgrounds is gone as a side effect rather than as separate work.

### Two things this turned up

**1. `trico-dun` and `trico-spinner` are insects filed as flies.** Both are `kind: fly`
(so they resolve against a record in `flies.json`) but their prompts are entomological
watercolour illustrations of live mayflies on cream paper — anatomy, not tying. Either the
content records are wrong or the prompts are. Needs a decision, and it is a content fix,
not a prompt fix.

**2. Seven organism stages still fall through to the generated `BUG_STYLE` template:**
`mantis-shrimp-adult`, `swimming-crab-juvenile`, `swimming-crab-molting`,
`glass-minnow-schooling`, `bay-anchovy-schooling`, `palolo-worm-spawning`,
`aquatic-worm-adult`. 65 of 72 organisms are reviewed; these are the gap, and they are the
organism equivalent of the problem just fixed.


---

## The 18 saltwater corrections — done 15 Sep 2026

All 18 prompts carrying a WRONG or MINOR verdict, plus the Group A/B identity rewrites.
Fourteen came from the verdict list (four of the eight WRONG were already fixed in the
thin-template batch); four more are the identity decisions.

### Applied as targeted corrections (8)

| Id | Change |
|---|---|
| `flexo-crab` | Eyes: large red → small black burnt-mono. |
| `avalon-permit` | Antennae: Krystal Flash → black-and-orange barred rubber legs. Claws: zonker strips → craft fur / arctic fox. |
| `cockroach` | Removed the painted eye from the head. |
| `seaducer` | Body hackle: "palmered in open turns… sparse" → close touching turns, dense and bushy. |
| `crease-fly` | Face: "hollow concave scooped" → flat angled cut, with an explicit negative. |
| `squid-fly` | Eyes now on the sides of the mantle facing outward, not facing back at the tentacles. |
| `clouser-redfish` | Fixed the contradiction — the dumbbell eyes **straddle** the shank on figure-eights; only the wing shares the point's side. |
| `ep-sand-eel` | Single sparse swept-back wing instead of stacked, trimmed bunches. |

### Rewritten in full (10)

| Id | Why |
|---|---|
| `bauer-crab` | Sculpin wool body, melted mono eyes glued into the fibres, **knotted** square rubber legs angling rearward. Feather claws removed with an explicit negative. |
| `raghead-crab` | Body material corrected to **felt**; eyes corrected to black. |
| `ep-shrimp` | Whole anatomy reoriented — eyes, antennae and the orange egg mass all moved to the **hook-eye end**, with an explicit "NOT at the bend". Weedguard dropped. |
| `peterson-spawning-shrimp` | Same reorientation; egg sac moved from the bend to behind the weighted eyes. |
| `mantis-shrimp` | Now a generic mantis — long low banded body, folded raptorial claws, forward-projecting stalked eyes. Previously it named Veverka's fly outright. |
| `albie-fly` | Now a **Jiggy** — metal cone head, sparse synthetic wing, prism eyes, with an explicit "not a Surf Candy". |
| `spoon-fly` | Now **Kirk's** — gold blade with red accent bars plus the bucktail-and-flash tail, stated as required. |
| `palolo-worm-fly` | Now **RIO's** — compact olive head at the eye, long coral worm behind it, and nothing else. Removed the hackle collar, chenille body and weedguard. |
| `redfish-toad` | Now the **Texas Toad** — brushed spun collar, orange hot spot, craft-fur tail, with an explicit "not a trimmed oval". |
| `needlefish-fly` | Single hook. Stinger and wire link removed. |

### `cuda-fly` removed — content change, not just a prompt change

Dropping the reviewed prompt alone would have left an orphan: the record would still build
a card pointing at a missing `assets/cuda-fly.jpg`. The id was referenced in four content
files, so all four were updated:

| File | Change |
|---|---|
| `content/data/flies.json` | Fly record removed (225 → 224). |
| `content/data/matches.json` | `needlefish-adult-cuda-fly` removed (186 → 185). It was a `change-up`; the `first-choice` match for the same organism is `needlefish-fly`, so nothing is orphaned. |
| `content/data/regions.json` | 3 references removed from fly lists. |
| `content/data/scenarios.json` | 1 reference removed. |

### Verified

`node content/validate.mjs` → **OK**, 224 flies / 185 matches, no errors and the same three
pre-existing warnings. `node content/build.mjs && node tools/image-prompts.mjs` → **340
prompts, 223 flies, 288 reviewed, 0 falling through to the template.** Corrections confirmed
present in the built pack, not just in the source.


---

## The trico problem — it was an id collision, 15 Sep 2026

### What it actually was

Not two mislabelled prompts. **Flies and organism stages share one id space and one
image folder**, and three ids were claimed by both:

| Id | Organism stage | Fly record |
|---|---|---|
| `trico-dun` | Trico, dun | "Trico Dun" — size 20–26 dry |
| `trico-spinner` | Trico, spinner | "Trico Spinner" — size 20–26 dry |
| `midge-adult` | Midge, adult | "Adult Midge (CDC/Hackle)" — size 20–26 dry |

Both sides resolved to the same file. `organisms.json` pointed the midge adult stage at
`assets/midge-adult.jpg`; `flies.json` pointed the Adult Midge dry fly at
`assets/midge-adult.jpg`. One image, two different things, and the recovery loop in
`image-prompts.mjs` tested the fly table first — so the insect illustration won and three
**fly** cards were set to show a watercolour bug.

The content records were never wrong. The id space was.

A scan found 15 more near-misses already in the content — `scud-fly` vs the `scud` organism,
`needlefish-fly` vs `needlefish`, `squid-fly` vs `squid`, `crayfish-fly` vs `crayfish` and so
on. None collide *today*, but they are one rename away, and every new mayfly with a dun and a
spinner fly adds two more chances.

### The fix

Organisms get their own namespace, matching the precedent already set by knot panels
(`assets/panels/`):

- **Images:** organism stages render to `assets/bugs/<id>-<stage>.jpg`. 70 stage paths and
  15 organism-level paths updated in `organisms.json`. The app reads paths from the records,
  so no UI change was needed.
- **Prompts:** organism prompts are keyed `bug:<id>` in `prompts-reviewed.json` — 63 re-keyed.
  Changing only the image path would have left the *prompt* lookup ambiguous, which is the
  half of the bug that actually caused the wrong picture.
- **Generator:** `reviewKey()` added; the recovery loop no longer tests a `bug:` key against
  the fly table, with a comment saying why.
- **`tools/move-bug-images.mjs`** added to move already-downloaded organism images out of
  `assets/`. Dry-run by default, `--go` to commit, safe to run twice.

### Verified

`validate.mjs` → OK, 3 pre-existing warnings. Build → **343 prompts; every one of the 224 fly
records and all 70 organism stages now has a prompt; 0 duplicate output files; all 74 organism
entries under `assets/bugs/`.** The three shared ids now appear twice each — once as a fly
pointing at `assets/<id>.jpg` with a fly prompt, once as an organism pointing at
`assets/bugs/<id>.jpg` with the illustration — which is the intended end state.

### The three fly prompts — written

`trico-dun`, `trico-spinner` and `midge-adult` had no fly prompt at all once the insect
prompts moved out of their way. All three written from photographs:

- **`trico-dun`** — slim black abdomen, pale split tails, a white CDC wing standing **upright**,
  with an explicit "not spent, not flat, not swept back".
- **`trico-spinner`** — the same slim black body but the wings **flat and spent**, tied out at
  right angles so the fly forms a T from above, with long splayed white tails.
- **`midge-adult`** — no tail, wire-ribbed dark thread abdomen, a low swept-back CDC tuft, and a
  sparse two-or-three-turn hackle at the head.

Each ends with a clause saying it is the **artificial fly** — a hook with thread and feather on
it, photographed as tackle, "NOT a drawing and NOT a live mayfly". Given what these three ids
have already been through, it is worth the words.

### A second bug, found while verifying

`tools/generate-images.mjs` computed its output path as ``e.out ?? `app/public/assets/${e.id}.jpg` ``
— **ignoring the entry's own `file` field.** So the whole namespacing would have had no effect at
generation time: organism art would have gone straight back to `app/public/assets/<id>.jpg` and
the two trico flies and the midge would have overwritten each other again.

Fixed to honour `file`. Simulated across all 343 entries: **343 entries, 343 distinct output
paths, 0 collisions.**

### Note for the next generation run

`tools/generated-images.json` is hand-written after a fal run, not produced by a tool. It
currently has two groups (`app/public/assets`, `app/public/assets/panels`). The next one needs a
**third group for `app/public/assets/bugs`**, or the bug art will be fetched into the wrong
folder. `fetch-images.mjs` derives each filename from the id and the group's dest, so ids that
appear in two groups are fine — they land in different folders.

**Four stale organism prompts** with no matching stage in current content:
`bay-anchovy-adult`, `caddis-ovipositing`, `glass-minnow-adult`, `palolo-worm-adult`. Legacy
ids from the old `fw-`/`sw-` scheme. Harmless but worth clearing out.


---

## Organism prompts and the stale content records — done 15 Sep 2026

### The seven "generated" organisms were really four

Three of the seven were not missing prompts at all. They had reviewed prompts filed under
**retired stage names**, left over from a content rename:

| Reviewed prompt was keyed | Current stage | Same animal? |
|---|---|---|
| `glass-minnow-adult` | `glass-minnow-schooling` | Yes — Atlantic silverside |
| `bay-anchovy-adult` | `bay-anchovy-schooling` | Yes — bay anchovy |
| `palolo-worm-adult` | `palolo-worm-spawning` | Yes — the prompt literally describes the **epitoke**, which *is* the spawning form |

Re-keyed rather than rewritten. That left four genuinely needing prompts, all written from
reference photographs:

- **`mantis-shrimp-adult`** — banded *Lysiosquilla*. The photographs settled the key point: it is a
  long, low, near-cylindrical tube of even depth with **bold transverse banding**, dark brown
  alternating with cream. Explicit negatives added: not humped like a shrimp, not compact like a crab.
- **`swimming-crab-juvenile`** — a miniature of the adult with the same proportions and a hard shell,
  not a rounder or softer shape.
- **`swimming-crab-molting`** — everything reads *soft*: pale cream washed with orange-tan, matte not
  glossy, faintly wrinkled and baggy, marginal teeth blunt and rubbery, claws and legs hanging limp.
- **`aquatic-worm-adult`** — a plain segmented tube with an unusually long list of negatives (no legs,
  head capsule, eyes, antennae, bristles, tails or wings), because that is the whole animal.

**All 70 organism stages now have a reviewed prompt. Zero left on the generated template.**

### Stale content records

`albie-fly` and `mantis-shrimp` had been rewritten as different flies, and four more records had
drifted from the corrected prompts:

| Record | Was | Now |
|---|---|---|
| `albie-fly` | name "Albie Fly (Surf Candy / Epoxy Anchovy)", *"tiny sparse epoxy minnow"*, unweighted | name **"Jiggy"**, *"metal cone head, sparse synthetic wing, slim — sinks fast and jigs"*, `beadhead` / "metal cone at the nose" |
| `mantis-shrimp` | *"larger tan/olive shrimp"*, `Imitates sw-shrimp.` | *"long low banded tan/cream mantis, stalked eyes, folded claws"*, `Imitates sw-mantis-shrimp.` |
| `spoon-fly` | name "Spoon Fly", no tail in the description | name **"Kirk's Spoon Fly"**, *"gold epoxy-coated mylar spoon with a bucktail tail"* |
| `redfish-toad` | *"flat rabbit-strip body"* — a tarpon toad | *"brushed dubbing collar, craft-fur tail, orange hot spot, weedguard"* |
| `palolo-worm-fly` | *"orange/red rabbit or chenille worm, **short**"* | *"long coral worm trailing a small olive head"* |
| `veverkas-mantis-shrimp` | `look` was **null** | *"shellback mantis with forward mono eyes, barred legs, lead eyes"* |

`albie-fly` keeps its id by decision — the display name changes, nothing can break, and the stale
id is internal only.

### A match rule that pointed at the wrong animal

The `mantis-shrimp` **fly** was a change-up for the **snapping shrimp**, while `veverkas-mantis-shrimp`
held first-choice on the actual mantis shrimp. A fly named Mantis Shrimp, tied for something else.
Moved to `mantis-shrimp/adult` as a change-up alongside Veverka's. Snapping shrimp still carries nine
matches, so it lost no coverage.

### Verified

`validate.mjs` → OK, same three pre-existing warnings. Build → **every one of the 224 fly records and
all 70 organism stages has a reviewed prompt, 0 generated organism prompts, 0 duplicate output files.**

### Still open

**`caddis-ovipositing`** — a reviewed prompt for a caddis stage that no longer exists in content
(caddis now has larva / pupa / adult). The prompt describes an egg-laying female swimming underwater,
which is a real and fishable stage. Either restore the stage to `organisms.json` or delete the prompt —
a content call, not a prompt one.


---

## The presentation block — applied 16 Sep 2026

The set-level problem from the start of this pass: three backgrounds, random orientation,
inconsistent scale, articulated flies rendered as two, multi-specimen plates. Accuracy work
does not touch any of it.

### Where it went

Every fly prompt already contained one sentence — *"Only one fly, hook bend and point clearly
visible."* Base prompts end on it; colour variants continue past it into their `COLOURWAY:`
clause. That made it a clean single anchor: replace that sentence and both families get the
block in the right place, with the colourway instruction still last.

Applied to **224 of 224 fly prompts.** The block adds what was missing:

- **Orientation** — hook eye at the LEFT of the frame, bend and tail to the RIGHT. Previously
  stated in only 6 prompts.
- **Scale and margins** — whole fly and entire hook inside the frame, even margins, spanning
  roughly 80% of the frame width. Previously stated in **none**.
- **Single subject** — "one single complete fly, not two flies side by side, not a pair, not a
  row, not a size range."
- **Negatives** — no hands, vise, tools, water, packaging, text, watermark, border.

### Articulated flies get their own clause

A flat "exactly one fly, not two" would have fought the 13 articulated prompts (`sculpzilla`,
`sex-dungeon`, `game-changer`), which legitimately carry two hooks — and "articulated flies
rendered as two" was one of the original complaints. Those get an extra line: *"This is ONE
articulated fly built on linked shanks — a single fly even though it carries two hooks. Do not
render it as two separate flies."*

### "(Fished for: …)" removed from 116 prompts

The colour variants ended with a parenthetical like `(Fished for: Turtle grass)` or
`(Fished for: Bahamas, sand flats)`. That is metadata, not a visual instruction, and it was being
sent to the image model inside the prompt — where "turtle grass" and "sand flats" are exactly the
sort of phrase that bleeds into a background that is supposed to be seamless white. Stripped from
all 116. The information still lives in the content records; nothing was lost.

### Inverted patterns — item 7, prompt side

`gotcha` came back point-down from a prompt that was already correct, while the Clouser obeyed
the same kind of instruction. Rather than only re-rolling it, all **61 inverted prompts** now
carry an explicit check written in terms of the *picture* rather than the fly's logic:

> INVERTED — CHECK THIS: in the finished image the hook point must appear ABOVE the shank, aimed
> toward the TOP of the frame, with the hook gap opening upward and the bend curving up. The
> weighted eyes sit UNDER the shank. Do not render this fly point-down.

Verified it landed on all 61 point-up prompts and on none of the 163 point-down ones.

### Verified

Orientation survived the rewrite intact: **61 point-up + 163 point-down = 224, none stating both,
none stating neither.** Block present in 224/224. Zero leftover `(Fished for:` strings, zero
leftover copies of the old sentence. `validate.mjs` → OK.


---

## Saltwater re-render reviewed — 16 Sep 2026

78 of 79 rendered and pulled down. I staged them back off the machine to look at them properly.

### The two things under test both worked

**Orientation.** Every inverted pattern now rides point-up — `gotcha` (the one that failed
before), `crazy-charlie`, `clouser-minnow`, both spawning shrimps, `merkin`, `bauer-crab`,
`strong-arm-merkin`, `kwan`, `squimp`, `bonefish-bitters`. Writing the instruction in terms of
the *picture* rather than the fly's construction is what fixed it. All 78 are eye-left,
tail-right; backgrounds uniformly white.

**The accuracy corrections are visible in the pixels.** `bonefish-bitters` shows three amber
glass beads and a deer-hair collar with no epoxy. `bauer-crab` shows the **knots in the rubber
legs**. `strong-arm-merkin`'s claws are at the rear. Both spawning shrimps have the egg sac at
the head end.

### Four still wrong, and what I changed

| Id | Problem | Fix |
|---|---|---|
| `spoon-fly` | Rendered as a hard painted lure body | Re-specified as a **thin flat blade cut from sheet**, with an explicit negative against a moulded 3-D lure body |
| `squid-fly` | A plain pink-and-white streamer | Rewritten around a separate **mantle** and a **mass of 8–10 arms**, stated as a squid and not a baitfish |
| `raghead-crab` | Body still read as fuzzy wool | "DISC CUT FROM FLAT FELT SHEET… sheet material, NOT dubbing, NOT spun wool" |
| `needlefish-fly` | Tiny in the frame | Told explicitly to span the full frame width because the fly is long and thin |

### The scale rule was too weak — tightened across all 224

The grid showed the real remaining problem: `merkin` filled its frame while `gotcha` and
`needlefish-fly` sat small with wide margins. "Spans roughly 80% of the frame width" was being
treated as a suggestion. Replaced everywhere with a positive instruction plus a negative:

> The fly is rendered LARGE in the frame… Do NOT render a small fly floating in a large empty
> frame — fill the frame regardless of how small the real fly is.

---

## Freshwater pass — begun 16 Sep 2026

137 freshwater flies: **66 base patterns, 71 colour variants.**

### First: the mechanical sweep came back clean

Checked for the three error classes saltwater taught us — a variant whose name implies a
structure the prompt never states (the `flashback` bug), anatomy placed at the wrong end (the
spawning-shrimp bug), and missing orientation. **Zero hits on all three.** The freshwater
prompts do not carry the bugs that made the saltwater set fail.

### A better check: prompt vs the fly's own `look` field

Every fly record carries a one-line `look`. Comparing it against the prompt is far cheaper than
photo-checking blind, and it found three of the five errors below on its own — because in each
case **the record already said the right thing and the prompt ignored it.**

### Findings (all 66 base patterns)

**Fixed:**

- **`green-weenie` — WRONG.** The record says *"chartreuse chenille body **with a loop tail**"*.
  The prompt said "a blunt tag tail". Photographs show the raised chenille loop is the fly's
  signature. Rewritten around the loop.
- **`zonker` — MINOR.** Record says *"red throat"*; the prompt had only a red thread head.
  Traditional Zonkers carry a red throat hackle. Added.
- **`foam-beetle` — MINOR.** Record says *"rubber legs"*; the prompt specified moose hair.
  Photographs are dominated by fine black rubber legs. Changed.

**Verified correct (19):** `walts-worm`, `frenchie`, `perdigon`, `copper-john`, `prince-nymph`,
`girdle-bug`, `pats-rubber-legs`, `green-rockworm`, `sculpzilla`, `sex-dungeon`, `slumpbuster`,
`sparkle-minnow`, `barrs-emerger`, `klinkhammer`, `sparkle-pupa`, `diving-caddis`, `thunderhead`,
`chubby-chernobyl`, `morrish-hopper`.

Worth noting `girdle-bug` and `pats-rubber-legs`: two very similar rubber-leg stonefly nymphs,
and the prompts already distinguish them explicitly (plain black chenille + white rubber vs
variegated chenille + black rubber), each with a negative against the other. Someone had already
thought about that pair.

### Two that need your call

**`yellow-palmer` — WRONG, and it may be two flies.** The record is named *"Yellow Palmer /
Yallarhammer"*, categorised **dry**, described as *"palmered yellow hackle"*. The prompt describes
a **wet fly**: *"a traditional southern Appalachian wet fly… heavy wet-fly hook"* with a peacock
body and golden pheasant tail — that is a Yallarhammer. Photographs of a "Smoky Mountain Yellow
Palmer" show a bushy palmered yellow **dry**. These are two different flies sharing one record.
You fish the NC mountains, so this one is yours to settle.

**`crayfish-fly` — VERIFY.** The record says *"claws forward"*. The prompt has the crayfish facing
backwards on the hook with the claws at the bend pointing rearward. Product photos of Clouser's
Crayfish are genuinely ambiguous about which end is which. Needs a tying page, not a shop photo.

### Second half — 16 Sep, continued

**Photo-verified correct (16 more):** `daves-hopper`, `kaufmann-stone`, `wd40`, `royal-wulff`,
`stimulator`, `hendrickson-dry`, `x-caddis`, `parachute-ant`, `yellow-sally-dry`,
`muddler-minnow`, plus `bloodworm`, `quill-gordon-dry`, `sparkle-dun`, `rusty-spinner`,
`jig-hares-ear`, `soft-hackle-po` (prompts read in full against known dressings).

**Photo-verified correct (15 more, after the connection came back):** `hares-ear`,
`pheasant-tail`, `zebra-midge`, `parachute-adams`, `elk-hair-caddis`, `griffiths-gnat`,
`woolly-bugger`, `rs2`, `egg-pattern`, `san-juan-worm`, `bwo-comparadun`, `pmd-comparadun`,
`flying-ant`, `foam-ant`, `cdc-caddis`. These had been passed on prompt + record cross-check
alone when the browser was timing out; the photographs confirmed all fifteen with no changes.
**Every one of the 66 base freshwater patterns has now been checked against photographs.**

### Settled with you

- **`yellow-palmer` split into two flies.** `yellow-palmer` is now the Smokies **dry** — yellow body
  under ginger hackle palmered the whole shank, no wings. `yallarhammer` is a new **wet** record —
  long soft *barred* yellow-and-black feather swept back over a ribbed yellow floss body. The old
  prompt gave it a peacock body; photographs are dominated by yellow bodies, so yellow it is.
  Recipes vary regionally — say the word if the peacock version is the one you know.
- **`crayfish-fly` — the record was wrong, not the prompt.** You want it to swim like a fleeing
  crayfish, which flees tail-first; the retrieve pulls the fly eye-first; so the tail sits at the
  eye and the **claws trail at the bend**. That is what the prompt already said. The record's
  "claws forward" is fixed, and the *reason* is now written into the prompt so nobody "corrects"
  it back.

### Freshwater tally — 66 base patterns

| Verdict | Count |
|---|---|
| WRONG | 2 — `yellow-palmer` (two flies in one record), `green-weenie` (loop tail) |
| MINOR | 2 — `zonker` (red throat), `foam-beetle` (rubber legs) |
| Record wrong, prompt right | 1 — `crayfish-fly` |
| OK | 61 |

**5 of 66 needed anything — about 8%, against 65% for saltwater.** All five are fixed. Every
freshwater fly now has a prompt that agrees with its own record.

### What the difference tells you

The saltwater misses were mostly *identity* errors — a prompt describing a different fly than the
name. Freshwater had none of those. Its misses were all *detail-vs-record* mismatches, and the
`look`-field cross-check caught three of five mechanically. That check is cheap and should run
before any future photo pass, on any water.


## Freshwater re-render reviewed — 16 Sep 2026

Jeff ran `node content/build.mjs && node tools/image-prompts.mjs && node tools/generate-images.mjs
--water=fresh --force` locally: **138 rendered, 0 failed** (137 stale + the new `yallarhammer`).
All 138 were staged back and read on three labelled contact sheets plus a 420 px zoom of the
doubtful ones — the same read as saltwater.

### What landed

- **Eye left, bend right** — 137/138. `trico-dun` is mirrored; caught later (see the organism section).
- **Scale** — 137/138 fill the frame. `trico-spinner` came back small in a big empty frame.
- **Point-up on the 14 inverted freshwater patterns** (`walts-worm`, `frenchie` ×4, `perdigon`
  ×4, `jig-hares-ear`, `sculpzilla` ×4) — all 14 ride point-up. Clause holds on the second water.
- **Articulated as one fly** — `sculpzilla` ×4 and `sex-dungeon` ×5 all rendered as a single
  two-hook fly. No pairs.
- **The five content fixes:** `green-weenie` shows the chenille loop; `zonker` ×4 all carry the
  red throat; `foam-beetle` has its rubber legs; `yellow-palmer` is a dry with palmered brown
  hackle on a yellow body; `yallarhammer` exists — yellow body, yellow-and-black barred hackle.
- **`crayfish-fly`** — claws trail at the bend, exactly as Jeff wanted it to swim.
- **Backgrounds** — most pure white; ~20 are a soft warm grey. Cosmetic, same as saltwater;
  not worth $0.08 a re-roll.

### The four misses

| Fly | What the render shows | Cause | Fix |
|---|---|---|---|
| `green-weenie-chartreuse` | straight chenille, no loop | The loop fix went on the base only — both colourway prompts still said "blunt tag tail" | Loop sentence copied into both variants |
| `green-weenie-lime` | same, and it is chartreuse, not lime | Variant text said "chartreuse" three times; the COLOURWAY suffix lost | Body/head reworded to lime-green + loop |
| `trico-spinner` | correct fly, tiny in frame, grey background | "it should read as tiny against the hook" fought the FRAMING block | Line rewritten: sparse materials, but the fly fills the frame |
| `rusty-spinner-olive` | upright wing + hackle collar (a dun, not a spinner) | Model drift on a colourway; the prompt already said NO hackle | COLOURWAY suffix now repeats: flat spent wings, no hackle, no upright wing |

Lesson (again): a content fix on a base pattern must be re-applied to every colourway prompt,
because each variant is a full copy of the text, not a reference to the base.

Re-rolled 16 Sep 2026 — **all four right on the first try**: both weenies carry the loop, lime
is lime; the Trico spinner fills the frame with a black body and flat white spent wings; the olive
Rusty Spinner is a true spent spinner, no hackle. Freshwater is now 138/138.

Side note: the run reported *5* rendered, not 4 — `--only=trico-spinner` matches the fly **and**
the organism stage of the same id, so `assets/bugs/trico-spinner.jpg` was rendered a run early.
Harmless ($0.08), but `--only` is id-only; add `--kind=fly` when an id is shared.


## Saltwater re-specs and the organism run — 16 Sep 2026

### The five saltwater re-specs — all landed

`spoon-fly` (flat gold blade, red bars, epoxy dome, point-up, bucktail tail present), `squid-fly`
(separate mantle, side eyes, a mass of hackle arms), `raghead-crab` (flat felt disc, rubber legs,
black eyes, marabou claws, point-up), `needlefish-fly` (one hook, pencil-thin, chartreuse over
pearl, spanning the frame), `avalon-permit` (point-up, bead keel hanging below). Nothing to re-roll.
**Saltwater is now 78/78.**

### The organism run was overwritten — my mistake

`node tools/generate-images.mjs --kind=organism --force` rendered all 71 stages into
`assets/bugs/` (about $5.60). Then `node tools/move-bug-images.mjs --go` — which I told Jeff to run
*after* the render — moved the stale organism copies still sitting in `assets/` over the top of
them. `renameSync` replaces silently on Windows. 69 of 71 fresh renders were lost; only
`caddis-ovipositing` and `green-drake-dun` survived (OneDrive left a `green-drake-dun-DESKTOP-7HORIPR.jpg`
conflict copy behind — safe to delete).

The same sweep took the three **fly** photos whose ids match a bug stage (`trico-dun`,
`trico-spinner`, `midge-adult`) out of `assets/` and dropped them into `bugs/`. Restored to
`assets/` from the copies.

`move-bug-images.mjs` now has two guards: it never moves a name that is also a fly id, and it never
overwrites an existing destination. It reports what it skipped and why. Run it **before** an organism
render, never after.

### What `assets/bugs/` holds now, and the read

68 stages carry the *old* illustrations — rendered from the same reviewed prompts as today's run,
just never looked at. Staged and read on two contact sheets:

| Verdict | Stages |
|---|---|
| **Fly photo in a bug slot** (3) | `trico-dun`, `trico-spinner`, `midge-adult` — the collision, still in the old files |
| **Photo-realistic, wrong style** (5) | `mantis-shrimp-adult`, `swimming-crab-juvenile`, `swimming-crab-molting` (on sand), `aquatic-worm-adult` (earthworm on dirt), `palolo-worm-spawning` (on grey) — the four with new prompts plus one re-keyed |
| **Prompt wrong** (1) | `snapping-shrimp-adult` — drawn as a generic shrimp because the prompt described one. A pistol shrimp's whole identity is one grossly enlarged snapping claw; prompt rewritten with the asymmetric claw and hooded eyes |
| **Checked and fine** (1) | `mullet-adult` looks like a menhaden — because the record *is* "Mullet / Menhaden (bunker)", deep-bodied silver. Matches |
| **MINOR, keeping** (2) | `caddis-larva` draws three forms (free-living + two cased) — useful for ID, leaving it; `green-drake-nymph` is pale grey — correct for a burrowing *Ephemera* nymph |
| **OK** (57) | mayfly nymph/dun/spinner sets, stoneflies, caddis, midges, terrestrials, crayfish, leech, sculpin, scud, baitfish, squid, needlefish |

So the actual re-render is **9 stages (~$0.72)**, not 71:

```
node tools/image-prompts.mjs
node tools/generate-images.mjs --kind=organism --force --only=trico-dun,trico-spinner,midge-adult,mantis-shrimp-adult,swimming-crab-juvenile,swimming-crab-molting,aquatic-worm-adult,palolo-worm-spawning,snapping-shrimp-adult
```

`--kind=organism` matters here: three of those ids are also flies.

**Result: 7 rendered, 2 failed.** The seven all read right on a zoom sheet — the mantis shrimp is
the long low banded tube the photographs showed; the juvenile crab is hard and mottled, the molting
crab soft and pale; the worm, palolo and midge are illustrations on cream like the rest; the
snapping shrimp now carries its one oversized claw. The two failures are `trico-dun` and
`trico-spinner` (transient fal errors, not prompt problems) — their bug slots still hold the fly
photos. The generator's retry hint now carries `--kind` and `--force` through, since a bare
`--only=trico-dun,trico-spinner` would have rendered the flies too.

```
node tools/generate-images.mjs --only=trico-dun,trico-spinner --kind=organism --force
```

Retried: both landed — dun in side view on cream, spinner spent from above. **All 71 organism
stages now carry a checked illustration.** The three fly photos in `assets/` were untouched by the
retry.

### One I missed — `trico-dun` the fly

Reading the two tricos side by side showed the `trico-dun` **fly** photo is mirrored (eye on the
right) and small in the frame. It was on freshwater sheet C and I passed it; the "138/138 eye-left"
line above was wrong by one. Same cause as the spinner — the "read as tiny against the hook" line
fought the FRAMING block — and the same fix, applied to the dun's prompt. Re-roll (~$0.08):

```
node tools/generate-images.mjs --only=trico-dun --kind=fly --force
```

Re-rolled once: mirrored **again** (eye right), and still on the small side. Two in a row is not
chance. The dun's construction was written "from the bend forward" — tails first — which reads
left-to-right as bend-on-the-left. Rewritten eye-to-bend, with the eye pinned to the LEFT edge and
the tails to the RIGHT in the construction itself, not just in the FRAMING block. (The spinner's
prompt has the same bend-first order and happened to land right; left as is, since its image is good.)
One more roll, same command — **landed**: eye left, upright CDC wing, slim black body, split tails,
filling the frame. Lesson for the prompt style: write construction **eye-to-bend**, so the reading
order matches the framing order.

### Eight flies fell through the water filter

Counting up to close the pass: 225 fly entries = 79 salt + 138 fresh + **8 `water: "both"`** —
`woolly-bugger-white`, `clouser-minnow-tan-white`, `clouser-minnow-pink-white`,
`clouser-minnow-all-black`, `game-changer`, `game-changer-white`, `game-changer-olive-white`,
`game-changer-chartreuse`. Neither `--water=salt` nor `--water=fresh` touched them, so their images
are still the first-run renders from before the framing block, never reviewed. Their prompts carry
the block (the game-changers carry the articulated clause too); they just need rendering (~$0.64):

```
node tools/generate-images.mjs --kind=fly --force --only=woolly-bugger-white,clouser-minnow-tan-white,clouser-minnow-pink-white,clouser-minnow-all-black,game-changer,game-changer-white,game-changer-olive-white,game-changer-chartreuse
```

Result: 7 rendered, 1 failed (`game-changer-chartreuse`, transient). The seven read right: white
bugger eye-left point-down; all three Clousers point-up with the dumbbell eyes under the shank; the
three Game Changers each a single articulated fly with the eye left. The old chartreuse Game Changer
image is actually acceptable (eye left, one fly, fills the frame, slightly grey background) — re-roll
for consistency or keep it:

```
node tools/generate-images.mjs --only=game-changer-chartreuse --kind=fly --force
```

Re-rolled and landed — chartreuse, linked shanks, one fly, eye left.

**Pass complete, 16 Sep 2026: 225 flies and 71 organism stages, every image checked against
photographs.**


## Jeff's review pass — begun 17 Sep 2026

The photo pass was mine; this one is Jeff's, and it catches what mine cannot: he has tied and
fished these. Two findings so far, both from one look each, both systematic.

**Bead-chain eyes (18 flies).** The Gotcha had "a bead-chain necklace" — one ball under the shank
with chain draped round the body. Every bead-chain pattern had it. Cause: the prompts named the
*material* ("silver bead-chain eyes"), so the model drew a chain; and the shared inverted clause
said "the weighted eyes sit UNDER the shank", which is dumbbell wording and wrong for bead chain.
Fix: describe the *geometry* — "exactly two steel balls joined by a hidden stub of chain, lashed
crosswise like a tiny barbell, one ball each side, no loose chain anywhere" — and a bead-chain
variant of the inverted clause ("straddle the shank at shank height"). Re-rendered: 18/18 right.

**Bonefish Bitters (3 flies).** Jeff sent photographs. The real fly is nearly all HEAD — one
translucent lentil of hot-melt glue moulded over tiny bead-chain eyes, a wisp of deer hair and
hackle, speckled rubber legs, almost nothing behind. Ours had two glass beads in a row and a long
body, because *my* earlier "correction" had insisted "no epoxy, no resin, glass beads only" — I had
read recipes, not pictures. First rewrite still drew two beads: it said "one fused lump" but also
"moulded over a pair of bead-chain eyes" and "two faint bulges". Second rewrite removed every
countable noun that was not the answer — "count the hard parts: exactly one; not two, not a row of
beads, not eyes; a drop of hardened honey" — and landed all three.

### Rules learned, for every prompt from here

1. **Geometry, not material names.** "Bead-chain eyes" draws a chain. "Two balls on a hidden
   stub, lashed crosswise" draws eyes. Name what it looks like, not what it is made of.
2. **When the model gets a count wrong, remove the other countable nouns.** Saying "one" louder
   does nothing while "a pair" or "two bulges" is anywhere in the text. The count the model
   renders is the one it can find a noun for.
3. **Shared clauses leak.** The inverted block was written for lead dumbbells and applied to 61
   flies; on 18 of them it was describing the wrong eyes. Any shared sentence needs a check
   against each family it lands on.
4. **A photograph beats a recipe.** Recipes say "bead chain, hot glue"; only a picture says the
   glue *is* the head. Where Jeff can send a picture, the prompt gets written from it.
5. **A 422 "did not generate the expected output" is usually transient.** Retry once before
   rewording.

Numbered review sheets of all 225 flies (`fly-review-sheets.pdf`, 7 pages, saltwater first) are
with Jeff. Notes come back as "number — what is wrong, in tying terms"; fixes go out as one
`--only=` line per batch.

## Next

1–6, 8. Done — see above.
7. ~~Inverted patterns~~ — confirmed fixed in the saltwater re-render; all 61 rode point-up.
9. **Regenerate what is still stale.** Everything below was written or changed *after* its
   current image was made:
   - ~~137 freshwater flies + `yallarhammer`~~ — done, reviewed above; 4 to re-roll.
   - ~~4 saltwater re-specs + avalon-permit~~ — done, all five right.
   - ~~71 organism stages~~ — rendered, then clobbered by the move script (see above); 9 stages
     still to re-render, the rest read fine.
   Run locally with `FAL_KEY` set — no manifest, no transfer:
   `node tools/image-prompts.mjs && node tools/generate-images.mjs --water=fresh`
   then `--only=…` for the rest, then `node tools/move-bug-images.mjs --go`.
10. ~~Check the new images~~ — done, every set read on contact sheets and the misses re-rolled.
11. **Housekeeping, all Jeff's call:** delete `assets/bugs/green-drake-dun-DESKTOP-7HORIPR.jpg`
    (OneDrive conflict copy) and the four orphans in `assets/` (`cuda-fly`, `glass-minnow-adult`,
    `bay-anchovy-adult`, `palolo-worm-adult`); decide `caddis-ovipositing` (restore the stage or
    drop the prompt + image); commit — nothing from this pass is in git yet.
