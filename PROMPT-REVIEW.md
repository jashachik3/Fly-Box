# Fly prompt review — 98 patterns checked against published recipes

_Generated 2026-09-15. Source: `tools/review/fly-prompt-review.json`. Corrected prompts are in `tools/flux-prompt-sheet-corrected.csv`, ready to generate from._

## How this was checked, and what that does and does not mean

Every prompt was checked against **written tying recipes and materials lists** — Orvis, Charlie's Fly Box, Global FlyFisher, Umpqua, Fly Fish Food, the originators' own dressings where they exist. **No photographs were compared.** Neither I nor the agents doing this can see images; what was checked is whether the prompt describes the materials, their order along the shank, the hook type and the orientation that the recipes specify. That is the right check for construction accuracy, but it is not the same as looking at a picture and saying it looks right.

Where published sources genuinely disagree — and for regional patterns they often do — the disagreement is recorded rather than resolved. Those are marked `uncertain`, or noted inside the entry.

## Results

| Verdict | Count | Meaning |
|---|---:|---|
| **wrong** | 39 | Would draw a materially incorrect fly |
| minor | 55 | Right fly, wrong or missing detail |
| uncertain | 3 | No single authoritative recipe exists |
| ok | 1 | Needs no change |

## The one bug worth fixing before anything else

**The inverted-orientation paragraph is duplicated verbatim in 21 of 98 prompts**, and in several of them it describes parts the fly does not have. The paragraph —

> "The wing/hair and weighted eyes are tied on the SAME side of the shank as the hook point, so the fly rides upside down…"

— was pasted onto **Perdigon, Frenchie, Walt's Worm, Jig Hare's Ear and Spoon Fly**, none of which has a wing or weighted eyes. A Perdigon is a lacquered thread body on a jig hook; the prompt tells the model to give it dumbbell eyes and a bucktail wing. That is a prompt-generator bug, not 21 separate authoring mistakes, and fixing the generator fixes a fifth of the sheet at once.

Worse, on the flies where the paragraph *does* belong, it states the geometry backwards. The weighted eyes go on the **opposite** side of the shank from the hook point — that is the whole reason the fly inverts. Several saltwater prompts say "same side" for both, which is physically impossible.

Affected: `avalon-permit`, `bauer-crab`, `bonefish-bitters`, `clouser-minnow`, `clouser-redfish`, `crazy-charlie`, `ep-shrimp`, `flexo-crab`, `frenchie`, `gotcha`, `half-and-half`, `jig-hares-ear`, `kwan`, `mantis-shrimp`, `merkin`, `perdigon`, `peterson-spawning-shrimp`, `raghead-crab`, `redfish-toad`, `spoon-fly`, `walts-worm`


## Wrong — would draw a different fly (39)

_Fix these before generating anything._

### `avalon-permit`
**Hook:** TMC 811S stainless saltwater hook, #2-4. Rides POINT UP (hook-up) because the dumbbell eyes and bead keel are on the side of the shank opposite the point when fished.  
**Recipe:** Avalon Permit Fly (Mauro Ginevri, for Avalon lodges, Cuba): TMC 811S #2; 3mm silver or gold DUMBBELL eyes lashed on top of the shank behind the hook eye; a keel of hard 20 lb mono looped beneath the hook carrying four 2.8mm silver/stainless beads; underneath, a 1cm mouth of arctic fox tail dyed yellow/orange; black or wine Krystal Flash antennae about 7cm; orange grizzly-barred rubber legs; two strands of pearl Diamond Braid as a shellback; a tan marabou feather wrapped as the body; light tan or grey zonker strips tied delta-wing as claws; fluorescent orange thread head.

*Wrong:*
- KNOWN SYSTEMIC BUG, DUPLICATED: the inverted-orientation paragraph ("The wing/hair and weighted eyes are tied on the SAME side of the shank as the hook point...") appears verbatim TWICE, back to back, in this prompt. The content is appropriate for this fly, but the duplication must be removed.
- "bead-chain eyes at the front" — the published recipe calls for 3mm silver or gold DUMBBELL eyes; the beads in this pattern are the four beads strung on the mono keel loop, and conflating the two will produce the wrong fly (the batch metadata's "bead-chain + keel" carries the same error)
- "a tan shrimp-crab hybrid ... rubber legs, orange accents" is a description rather than a construction — it omits every named material and would not reliably produce the Avalon's distinctive marabou body, zonker claws and beaded keel loop

*Missing:*
- tan marabou wrapped as the body
- pearl Diamond Braid shellback over the back
- light tan/grey zonker strips tied delta-wing as claws
- orange/yellow arctic fox tail 'mouth' underneath
- black or wine Krystal Flash antennae
- fluorescent orange thread head
- the keel specified as four beads on a hard mono loop hanging below the hook

*Invented:*
- bead-chain eyes

*Sources:* [1](https://www.flyfisherman.com/editorial/avalon-permit-fly/151697) · [2](https://blog.saltyflytying.com/avalon-%E2%80%A2-mauro-ginevri/) · [3](https://www.saltwaterflies.com/avalon_permit_fly.html)
*Confidence:* high

### `barrs-emerger`
**Hook:** 2X-short CURVED emerger hook (TMC 2487 or 2488, Dai-Riki 125) #16-24. Rides point-DOWN.  
**Recipe:** John Barr's Emerger (BWO), eye to bend: small dark thread head; a thorax of natural GREY muskrat or beaver dubbing; a wing case of dark dun hackle fibres (or wood duck) pulled over the thorax with the leftover tips splayed back along the sides as legs; an OLIVE-BROWN dubbed abdomen over roughly the rear two-thirds of the shank, slim and lightly tapered; and a sparse tail/shuck of brown or ginger hackle fibres, roughly half a shank long, imitating the nymphal shuck.

*Wrong:*
- "olive dubbed thorax" - this is backwards. In every consulted recipe the ABDOMEN is the olive/olive-brown part and the THORAX is natural GREY muskrat or beaver dubbing. An olive thorax produces a visibly wrong fly.
- "Small nymph hook" - the recipe calls for a 2X-short CURVED emerger hook (TMC 2487/2488, Dai-Riki 125); a straight nymph hook gives the wrong body curve and the wrong short-shank proportion.
- "Short brown dubbed abdomen" - the abdomen is olive-brown (not plain brown) and it runs about two thirds of the shank; it is the long part of the fly, not a short one.
- "a few tail fibers" - the tail is a deliberate sparse shuck of brown or ginger hackle fibres about half a shank long, representing the nymphal skin.

*Missing:*
- That the wing-case fibres continue past the tie-down as the LEGS, splayed back along both sides of the thorax - a single element, not two separate ones as the prompt implies
- That the wing case is dark dun hackle fibres (Craven) or wood duck (Orvis)
- The 2X-short curved hook and the resulting curved-body profile

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/barr-emerger) · [2](https://news.orvis.com/fly-fishing/video-tie-barrs-emerger-bwo) · [3](https://howtoflyfish.orvis.com/fly-tying-videos/emerger-flies/908-barrs_emerger_bwo)
*Confidence:* high

### `bauer-crab`
**Hook:** Straight-eye saltwater hook, #4-6 (up to 1/0 in the larger versions); rides HOOK POINT UP - lead dumbbell eyes at the head.  
**Recipe:** Bauer Crab (Will Bauer, developed for Belize permit; an Umpqua saltwater pattern): saltwater hook #4-6 (Martyn White's version uses a Gamakatsu SL12 #4-1/0); lead dumbbell eyes at the hook eye; the body is McFly Foam / egg yarn tied in crosswise bunches and trimmed into a thin flat oval carapace that soaks up water and sinks fast while still landing softly; square rubber legs out the sides; epoxy or mono crab eyes on stalks; finished with Pliobond or contact cement. Tan and olive with subtle orange accents are the standard colours.

*Wrong:*
- The inverted-orientation paragraph is DUPLICATED verbatim - systemic paste bug.
- 'The wing/hair and weighted eyes are tied on the SAME side of the shank' - backwards; the dumbbell eyes go on the opposite side of the shank from the point. There is no wing on this fly.
- 'a flat oval crab body of tan synthetic fibers' - vague and slightly wrong: the published descriptions name McFly Foam / egg yarn, which trims to a soft, matte, slightly fuzzy disc rather than looking like brushed EP/synthetic fibre.
- 'small lead eyes' - sources describe lead dumbbells sized to suit; the fly is explicitly described as sinking fast, so 'small' undersells it.

*Missing:*
- epoxy or mono crab eyes on stalks
- square (flat) rubber legs rather than round
- the orange accent colour in the tan and olive dressings
- 'small claws' should be specified - the material varies between tiers, so a modest pair of soft feather-tip claws at the bend is the safe depiction

*Invented:*
- nothing outright; the body fibre description is unsupported in its exact wording

*Sources:* [1](https://midcurrent.com/v2/best-permit-crab-flies-7-proven-patterns-that-actually-work/) · [2](https://globalflyfisher.com/video/bauer-crab) · [3](https://www.calgarysflyshop.com/products/bauer-flats-crab-all-colors)
*Confidence:* medium

### `black-death`
**Hook:** Stainless straight-eye tarpon hook (Gamakatsu CS15 / Daiichi 2546), #1/0-4/0, POINT DOWN.  
**Recipe:** Black Death (Keys tarpon fly; Global FlyFisher notes it is "a named colour variation rather than a fly pattern", so no single standardised recipe exists): stainless straight-eye tarpon hook #1/0-4/0; black saddle hackles (or black hair or a black zonker strip) tied in AT THE BEND, splayed, with red flash; a RED collar — red bucktail, red hackle or a red rabbit zonker — wound immediately IN FRONT of the tail, encircling the shank; the front half inch of the shank is left bare ("so that the line could be snelled"); finished with a black or red tapered thread head with painted eyes at the hook eye.

*Wrong:*
- "a red hackle collar, bare shank between" — same Keys-construction reversal as the Cockroach: the red collar sits directly IN FRONT OF the black tail at the REAR of the shank, and the bare shank runs FORWARD from the collar to the head at the hook eye, not between the tail and a front collar
- "Black saddle hackle tail at the bend" under-specifies — the hackles are tied in opposed groups so they splay, and the classic version carries red flash (red Flashabou/mylar) among them

*Missing:*
- red flash among the black tail hackles
- the tapered black or red thread head with painted eyes at the hook eye
- the opposed/splayed pairing of the tail hackles
- note that black-over-red is a colour scheme with several accepted builds (hackle, hair or zonker tail; bucktail, hackle or rabbit collar)

*Invented:*
- a bare shank located between the tail and a front-mounted collar

*Sources:* [1](https://globalflyfisher.com/video/black-death) · [2](https://globalflyfisher.com/tie-better/short-hook-long-wing) · [3](https://stoneflyworks.com/recipe/black-death)
*Confidence:* medium

### `bonefish-bitters`
**Hook:** Short-shank saltwater hook, Kamasan B175 or similar, #4-8; rides HOOK POINT UP - Umpqua describes it as 'nearly weedless with its epoxy head and lightweight bead chain eyes', which works only if the bead chain flips the hook point up.  
**Recipe:** Craig Mathews' Bonefish Bitters: short saltwater hook (Kamasan B175) #4-8; a small bunch of deer hair or bucktail tied in at the REAR of the shank extending about one shank length past the bend, with 6-8 rubber legs of matching colour slightly longer than the hair; the hair butts are left about half the shank long and small bead-chain eyes are lashed on top of the shank about midway; hot-melt glue or epoxy is then melted over the eyes and butts and shaped into a teardrop that forms the whole front half of the fly. Colours amber, olive, brown/hermit-crab, tan and white.

*Wrong:*
- The whole inverted-orientation paragraph is DUPLICATED verbatim in the prompt ('The wing/hair and weighted eyes are tied on the SAME side of the shank as the hook point... ' appears twice) - systemic paste bug.
- 'The wing/hair and weighted eyes are tied on the SAME side of the shank' - physically backwards. The weighted/bead-chain eyes must be on the OPPOSITE side of the shank from the hook point (i.e. hanging underneath the shank once the fly is inverted); it is the weight below the shank that holds the point up.
- 'a short sparse hair wing' - the Bitters has no wing. The deer hair/bucktail is a TAIL tied at the rear of the shank, projecting about a shank length past the bend.
- 'tiny bead-chain eyes' at the head - the bead chain sits roughly MIDWAY along the shank and is buried inside the glue/epoxy blob, not perched at the hook eye.
- 'A small teardrop of colored epoxy at the head' understates it - the hot-melt/epoxy teardrop is the body of the fly and covers the front half of the shank including the eyes.

*Missing:*
- 6-8 rubber legs, matched to the hair colour and LONGER than the hair, splaying from the rear where the hair is tied in
- the hair butts trapped under the glue, which is what gives the head its bulk
- the standard colourways: amber, olive, brown 'hermit crab', tan, white
- the fly is tiny - a #6-8 hook, roughly an inch overall

*Invented:*
- 'a short sparse hair wing' - no published Bitters recipe has a wing

*Sources:* [1](https://globalflyfisher.com/patterns/bonefish-bitters) · [2](https://www.umpqua.com/bonefish-bitters/)
*Confidence:* high

### `clouser-minnow`
**Hook:** TMC 811S standard-length stainless saltwater hook, #6-2/0. Fishes INVERTED, point-UP: 'The fly rides hook point up which makes it pretty much snag free' (Charlie's Fly Box). The chartreuse wing is on the same side as the hook point; the white belly is on the opposite side.  
**Recipe:** Clouser Deep Minnow (Bob Clouser; Charlie's Fly Box, Global FlyFisher, Orvis, Wikipedia): TMC 811S #6-2/0; painted lead dumbbell eyes lashed across the shank with figure-eight wraps roughly two or three hook-eye lengths (about a third of the shank) back from the hook eye; a sparse white bucktail belly about two shank lengths long tied at the eyes on the non-point side; four to eight strands of pearl or gold Krystal Flash; the hook is then turned over and a sparse chartreuse bucktail wing of the same length is tied on the hook-point side. No body, no tail, no hackle — the rear shank is bare. Original colourway chartreuse over white.

*Wrong:*
- KNOWN SYSTEMIC BUG PRESENT: the inverted-orientation paragraph "The wing/hair and weighted eyes are tied on the SAME side of the shank as the hook point, so the fly rides upside down..." is pasted in TWICE, verbatim. On this pattern the paragraph belongs, but the duplicate must go.
- "Painted lead dumbbell eyes tied on top of the shank just behind the hook eye" — two problems. (a) Position: every source puts the eyes back from the hook eye, about two to three eye-lengths or roughly a third of the shank, leaving a visible bare thread head in front. 'Just behind the hook eye' crowds them forward. (b) "on top of the shank" directly contradicts the orientation sentence that follows in the same prompt; a dumbbell straddles the shank on figure-eight wraps, and in fished orientation it hangs below the shank while the point is up.
- "a sparse white bucktail belly tied under the eyes" — 'under' is wrong for the fished view being described. In the finished, point-up fly the white bucktail is the BELLY and sits below the shank on the side away from the point; describing it as 'under the eyes' reads as a position along the shank rather than a side.
- "a few strands of pearl flash tied on the point side" — the flash goes over the white belly and under the chartreuse wing, i.e. sandwiched between the two bucktail bunches. Sources give pearl or gold Krystal Flash, four to eight strands.
- No bucktail length is given; sources put both bunches at roughly two shank lengths, sweeping well past the bend.

*Missing:*
- Eye placement measured back from the hook eye (2-3 eye-lengths / about a third of the shank)
- Bare thread head in front of the eyes
- Bucktail length: about two shank lengths
- That the rear of the shank is completely bare — no body, tail or hackle
- Explicit statement of the classic chartreuse-over-white colourway relationship (chartreuse = back/point side, white = belly)

*Invented:*
- "tied on top of the shank just behind the hook eye" — contradicts both the recipe and the prompt's own orientation sentence
- Flash "tied on the point side" as a separate placement

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/clouser-minnow) · [2](https://globalflyfisher.com/patterns/clouser-deep-minnow) · [3](https://en.wikipedia.org/wiki/Clouser_Deep_Minnow) · [4](https://news.orvis.com/fly-fishing/video-bob-clouser-on-how-to-tie-the-clouser-minnow)
*Confidence:* high

### `clouser-redfish`
**Hook:** Standard stainless saltwater hook, #2-4. Rides POINT UP ("the fly rides hook point up which makes it pretty much snag free").  
**Recipe:** Clouser Deep Minnow (Bob Clouser): TMC 811S or similar stainless #2/0-6; painted lead dumbbell eyes lashed on top of the shank about three eye-lengths behind the hook eye; a BELLY bunch of light bucktail tied in IN FRONT of the eyes and swept back over them; several strands of flash; then the hook is rotated and a WING bunch of darker bucktail is tied in BEHIND the eyes, on the same side of the shank as the hook point; wing roughly one and a half shank lengths, extending past the bend. The fly rides hook point up. Marsh/redfish versions use copper or root-beer over tan or gold with copper/gold flash; the classic combinations are chartreuse/white, tan/white, brown/white, all white, all black.

*Wrong:*
- KNOWN SYSTEMIC BUG, DUPLICATED: the inverted-orientation paragraph appears verbatim TWICE, back to back. The content is correct for a Clouser, but the duplication must be removed.
- "copper and gold bucktail with gold flash lying back past the bend" — this collapses the Clouser's defining two-part construction into one clump. A Clouser has a lighter BELLY bunch tied in FRONT of the dumbbell eyes and folded back (which hangs downward, on the side away from the point) and a darker WING bunch tied BEHIND the eyes on the same side as the point, with flash between them. Drawn as a single bunch it is not a Clouser.
- "Lead dumbbell eyes behind the hook eye" — the placement is specifically about three eye-lengths back from the hook eye, and the eyes are painted with pupils

*Missing:*
- the separate belly bunch tied in front of the eyes and swept back over them
- flash between belly and wing
- painted eyes with pupils
- wing length of about one and a half shank lengths past the bend
- colour separation — lighter tan/gold belly under, darker copper/root-beer wing over

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/clouser-minnow) · [2](https://midcurrent.com/v2/clouser-minnow-how-to-tie-it-materials-steps-pro-tips/) · [3](https://en.wikipedia.org/wiki/Clouser_Deep_Minnow)
*Confidence:* high

### `cockroach`
**Hook:** Stainless straight-eye saltwater/tarpon hook (Owner SSW, Gamakatsu SC15, Daiichi 2546), #1/0-3/0, POINT DOWN.  
**Recipe:** Cockroach (classic Keys tarpon fly): stainless straight-eye saltwater hook #1/0-4/0; four to six grizzly saddle hackles tied in AT THE BEND in two groups of three with the convex sides of each group facing each other so the tail splays, often with a few strands of flash; a collar of natural brown bucktail tied in IMMEDIATELY IN FRONT of the tail, encircling the shank so it surrounds and cloaks the base of the tail; the forward half of the shank is then left bare thread (the Keys convention, originally so the fly could be snelled), finishing in a small tapered red or black epoxied thread head at the hook eye, often with prismatic eyes.

*Wrong:*
- "a brown bucktail or hackle collar at the front, the shank bare in between" — this reverses the Keys construction. The bucktail collar is tied directly IN FRONT OF THE TAIL at the REAR of the shank, surrounding the tail base; the BARE shank runs FORWARD from that collar to a small head at the hook eye. As written, the prompt would draw the collar up at the hook eye with an empty gap behind it, which is not this fly.
- "Four grizzly saddle hackles" — recipes specify four to six, arranged as two opposed groups (e.g. two groups of three) so the tail splays; number alone without the opposed pairing loses the splay

*Missing:*
- the small tapered red or black epoxied thread head at the hook eye, often with prismatic/painted eyes
- flash (Krystal Flash) among the tail hackles
- the opposed two-group arrangement that produces the splay
- tail length — roughly two to three shank lengths

*Invented:*
- a bare shank sitting between the tail and a front-mounted collar

*Sources:* [1](http://waterandwoods.net/2009/07/the-cockroach-tarpon-fly/) · [2](https://catalog.theflyshop.com/products/cockroach) · [3](https://globalflyfisher.com/tie-better/short-hook-long-wing) · [4](https://globalflyfisher.com/video/black-death)
*Confidence:* medium

### `copper-john`
**Hook:** TMC 5262, a 2X-long 2X-heavy straight-shank nymph hook, sizes 12-20, with lead wraps under the thorax. Rides point-DOWN.  
**Recipe:** John Barr's Copper John, eye to bend: a gold bead; a wing case of BLACK THIN SKIN pulled over a bushy peacock-herl thorax, with strands of pearl Flashabou pulled over the top of the Thin Skin and the whole thing coated in epoxy; legs of Hungarian partridge or hen-back fibres, one clump splayed back along each side of the thorax; a tightly wound copper-wire abdomen over a tapered thread underbody; and two dark brown goose biots split into a V tail.

*Wrong:*
- "an epoxy-coated pheasant-tail wing case" — the wing case is black Thin Skin, a smooth opaque synthetic sheet, not pheasant tail. Charlie Craven's and Barr's own recipes both specify "Black Thinskin". This is the most visible error in the prompt: a pheasant-tail wing case would read as a completely different fly.
- "a strip of pearl flash over a peacock thorax" — wrong layer order. The pearl Flashabou lies OVER the Thin Skin wing case (Barr: "Pull the Flashabou over the top of the Thin Skin"), with the epoxy over both. It does not sit directly on the peacock thorax.
- "Standard nymph hook" — the recipe specifies a 2X-long, 2X-heavy hook (TMC 5262).

*Missing:*
- The legs — Hungarian partridge or hen-back fibres, one clump on each side of the thorax splayed back. The prompt has no legs at all, and they are a prominent part of the silhouette.
- The abdomen is wound over a tapered thread underbody so it swells slightly toward the thorax, and the wire is wrapped in tight touching turns for a hard segmented metallic look.
- The epoxy/UV-resin dome is glossy and thick, covering the whole wing case front to back and side to side.
- Colour range — the original is copper, but red, chartreuse, blue and zebra wire versions are standard commercial colourways.
- Lead wraps under the thorax give the front of the fly its bulk.

*Invented:*
- "pheasant-tail wing case" — no source lists pheasant tail as the Copper John's wing case material.

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/copper-john) · [2](https://midcurrent.com/flies/tying-the-original-copper-john/) · [3](https://en.wikipedia.org/wiki/Copper_John_fly) · [4](https://news.orvis.com/fly-fishing/video-how-to-tie-the-copper-john)
*Confidence:* high

### `crayfish-fly`
**Hook:** Clouser's Crayfish: 3XL nymph hook, point-DOWN, weighted with lead wire along the sides, explicitly designed to dead-drift like a nymph. Near Nuff Crayfish: dumbbell eyes, rides point-UP. Our entry's 'lead eyes' metadata matches Near Nuff, our fly name lists Clouser first — these must be split.  
**Recipe:** SOURCES DISAGREE BECAUSE THE ENTRY NAMES TWO DIFFERENT FLIES. Clouser's Crayfish (Bob Clouser; Global FlyFisher, Fat Fingered Fly Tyer, In The Riffle): Mustad R74-9672 / 3XL nymph hook #2-12 weighted with lead wire lashed along BOTH SIDES of the shank (no dumbbell eyes); ringneck pheasant-tail antennae extending 1-1.5 shank lengths past the bend; tan/cream or light-olive dubbed body; olive or orange furry-foam carapace pulled over the back; mallard flank feathers curled inward to form the claws; grizzly or ginger saddle hackle palmered for legs. It is dead-drifted like a nymph and rides point-DOWN. Whitlock's Near Nuff Crayfish (Umpqua) is a different fly: it uses DUMBBELL EYES specifically so it rides hook point UP, in brown and dirty olive.

*Wrong:*
- KNOWN SYSTEMIC BUG PRESENT: "The wing/hair and weighted eyes are tied on the SAME side of the shank as the hook point, so the fly rides upside down..." is pasted onto a fly that has NO WING AND NO HAIR at all. A crayfish has claws, a carapace and antennae; there is no wing to place.
- "Lead eyes near the bend so it rides claw-forward" — Clouser's Crayfish has no lead eyes; it is weighted with lead wire lashed along both sides of the shank. And no source describes lead eyes 'near the bend'; where dumbbell eyes are used (Near Nuff) they sit near the hook eye.
- "so it rides claw-forward" conflates two ideas. The claws are at the hook BEND end (they and the antennae extend past the bend), which is the crayfish's head end — the animal is tied facing backwards on the hook. Eye weight controls point-up/down, not which way the claws face.
- "two rust-olive claws of hen feather or rubber" — the claws are MALLARD FLANK feathers, curled inward with scissors. No source uses rubber claws.
- "rubber antennae" — the antennae are ringneck pheasant-tail fibres, not rubber.
- The orientation sentence is flatly wrong for Clouser's Crayfish, which Clouser designed to dead-drift like a nymph, point-down.

*Missing:*
- Legs: grizzly or ginger saddle hackle palmered through the body and trimmed top and bottom
- Carapace material specified as furry foam (olive or orange), segmented down with thread
- Body dubbing colour (tan, cream or light olive)
- Weighting method: lead wire along both sides of the shank, which flattens the profile
- Antennae length: one to one and a half shank lengths past the bend
- That the crayfish faces backwards on the hook — head/claws at the bend, tail at the hook eye

*Invented:*
- "rubber" claws
- "rubber antennae"
- "Lead eyes near the bend"
- The entire inverted-orientation paragraph, including a "wing/hair" this fly does not have

*Sources:* [1](https://globalflyfisher.com/video/clouser-crayfish-0) · [2](https://fatfingeredflytyer.com/clousers-crayfish-fly-step-by-step/) · [3](https://www.intheriffle.com/in-the-riffle-blog/clouser-crayfish) · [4](https://anglersall.com/products/whitlocks-near-nuff-crayfish-umpqua-fly)
*Confidence:* medium

### `crazy-charlie`
**Hook:** TMC 811S short-shank stainless saltwater hook, #2-8. Fishes INVERTED, point-UP: 'the first bonefish fly to incorporate bead chain eyes ... and allow the fly to ride hook point up' (Wikipedia, citing the pattern's history). The calf-tail wing is on the hook-point side.  
**Recipe:** Crazy Charlie / Nasty Charlie (Bob Nauheim and Charlie Smith, Andros 1977; Charlie's Fly Box, Wikipedia): TMC 811S #2-8; silver bead-chain eyes lashed across the shank two or three hook-eye lengths back from the hook eye — Nauheim's innovation, and the first bonefish fly designed to ride hook point up; an underbody of pearl Krystal Flash / Flashabou wrapped along the shank and figure-eighted around the eyes, then overwrapped with clear D-Rib or V-Rib so the pearl shows through the translucent rib; a sparse, UNSTACKED white calf-tail wing tied in on the hook-point side reaching just past the bend, with a few strands of pearl flash as a topping. No tail. Original wing white; popular colourways white/pearl, tan, pink, chartreuse, brown.

*Wrong:*
- KNOWN SYSTEMIC BUG PRESENT: the inverted-orientation paragraph is pasted in TWICE, verbatim. The paragraph is correct for this pattern but the duplicate must be removed.
- "a body of clear vinyl rib over pink flash" — the underbody flash is PEARL (Krystal Flash or Flashabou), not pink. Pink is a wing/thread colourway variant, not the standard underbody. The classic reads as a translucent silver-pearl body.
- "Silver bead-chain eyes just behind the hook eye" — Charlie's Fly Box specifies two or three hook-eye lengths back from the hook eye, leaving a short bare front.
- "a sparse white calf-tail wing ... lying back past the bend" — sources say the wing reaches JUST past the bend, and specify that the calf tail is deliberately left UNSTACKED, so the tips are ragged and staggered rather than an even brush.
- "a body of clear vinyl rib" omits that the rib is also figure-eighted around the bead-chain eyes, so the translucent ribbing continues over the eye wraps.

*Missing:*
- Pearl flash topping over the calf-tail wing
- Pearl (not pink) Krystal Flash/Flashabou underbody
- Eye placement two to three hook-eye lengths back from the hook eye
- That the calf tail is unstacked, with ragged staggered tips
- That the vinyl/D-Rib is figure-eighted around the eyes as well as wrapped along the shank
- Explicit statement that there is NO tail on this pattern

*Invented:*
- "pink flash" as the underbody

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/crazy-charlie) · [2](https://en.wikipedia.org/wiki/Crazy_Charlie) · [3](https://flylordsmag.com/how-to-tie-the-crazy-charlie/) · [4](https://www.hatchmag.com/articles/easy-tie-bonefish-flies/7715250)
*Confidence:* high

### `cuda-fly`
**Hook:** Straight-eye saltwater hook 1/0-2/0 at the front with a trailing second hook; rides HOOK POINT DOWN.  
**Recipe:** Cuda Fly (Umpqua): a needlefish imitation about 8 in long tied on TWO saltwater hooks (front hook 2/0 plus a trailer) to raise the hook-up rate; a long thin green/chartreuse-over-pearl synthetic body - braided tubing or long synthetic hair - with large 3-D eyes and an epoxy or resin head; fished on a wire bite tippet and stripped as fast as the angler can move it.

*Wrong:*
- 'small eyes' - cuda/needlefish flies carry large 3-D or doll eyes in an epoxy head, not small ones.
- 'wire tippet loop' - misleading. The wire on these flies is the BITE TIPPET the angler ties on, or (in the Nightmare Needlefish) the internal wire joining the trailer hook; showing a loose wire loop dangling from the hook eye as part of the fly is not what the published patterns describe. Sources vary on whether a wire loop is built into the fly, so it should not be asserted as a defining feature.
- 'Long saltwater hook' - the Umpqua Cuda Fly is built on two hooks, not one long-shank hook.

*Missing:*
- the second, trailing hook
- the epoxy / resin head
- large 3-D eyes
- the stated length of about 8 inches
- the green-over-pearl / chartreuse layering rather than a uniformly coloured tube

*Invented:*
- a wire tippet loop presented as part of the fly

*Sources:* [1](https://www.theflyfishers.com/P/6323/CudaFly) · [2](https://deneki.com/2016/01/needlefish-fly-for-barracuda-tying-instructions/) · [3](https://blog.saltyflytying.com/nightmare-needlefish-fly-catch-more-bigger-barracuda/)
*Confidence:* medium

### `diving-caddis`
**Hook:** Standard wet-fly hook, Daiichi 1550 or Dai-Riki 070, sizes 8-24. Rides point-DOWN.  
**Recipe:** LaFontaine's Diving Caddis, eye to bend: a thread head, two turns of soft brown/body-colour dry-fly hackle forced back over the fly, an OVERWING of clear Antron strands lying over an UNDERWING of mottled partridge, grouse or mallard fibres (both reaching just past the bend), over a body of Antron sparkle dubbing in ginger, bright green, amber or grey. No tail.

*Wrong:*
- "a wing of Antron fibers slicked back along the body" — the recipe specifies TWO wing layers: a mottled game-bird underwing (partridge, grouse or mallard) with the clear Antron laid over it. Drawn as a single synthetic wing the fly loses its defining mottled-under-clear look.
- "small hackle" — vague and understated; the recipe is two turns of dry-fly hackle in the body colour, deliberately forced/swept back over the wing at the head, not a small neat collar.
- The batch entry's "weight: light" is not supported — published Diving Caddis recipes list no lead or bead; it is a plain wet fly fished in the film or just under.

*Missing:*
- The partridge/grouse/mallard underwing, extending just beyond the hook bend.
- The clear Antron overwing is tied slightly LONGER than the underwing.
- Body colour options — ginger, bright green (apple green), amber or grey Antron sparkle dubbing.
- No tail (the prompt does not exclude one, so the model may add one).

*Invented:*
- "small hackle" implies a tidy wet-fly collar; sources describe a deliberately sparse, low-grade hackle swept flat back over the wing.

*Sources:* [1](https://www.johnkreft.com/caddis-fly-patterns/diving-caddis/) · [2](https://nwflytyer.wordpress.com/2012/07/01/gary-lafontaines-diving-caddis/)
*Confidence:* high

### `ep-shrimp`
**Hook:** Straight-eye saltwater hook (Mustad S71SAP / TMC 811S) #1/0-6; fished HOOK POINT UP - the weighted eyes are mounted at the hook eye so the fly inverts, and the pattern carries a mono weedguard for casting into mangroves. No source states the orientation in so many words, so this is inferred from the eye placement and weedguard.  
**Recipe:** EP Spawning Shrimp (Enrico Puglisi): Mustad S71SAP or TMC 811S, #1/0-6; silver bead-chain or lead dumbbell eyes at the hook eye, with a double mono weedguard; at the REAR third of the shank a hot-orange dubbing ball (Ice Dub, Senyo's Laser Yarn or orange EP fibre) representing the egg mass of a spawning shrimp, with EP mono/crustacean eyes, tan barred rubber legs and two or three strands of black Krystal Flash set just ahead of it; the body is an EP Shrimp Dub Brush in tan, olive or rootbeer wrapped forward in open turns, then brushed out and trimmed to a tapered shrimp profile.

*Wrong:*
- The inverted-orientation paragraph is DUPLICATED verbatim - systemic paste bug.
- 'The wing/hair and weighted eyes are tied on the SAME side of the shank' - backwards; the lead/bead-chain eyes belong on the opposite side of the shank from the point. Also there is no 'wing' on this fly at all, so the boilerplate wording does not describe anything present.
- 'a small orange egg cluster underneath' - the orange egg mass is at the REAR of the fly, built as a ball on the back third of the shank near the bend, not slung under the middle of the body.
- 'a tan segmented EP-fiber body' - the body is a wrapped and brushed-out EP dubbing brush trimmed to a taper; it reads as shaggy and translucent, not as neat segments.

*Missing:*
- the double mono weedguard, which is a standard part of the commercial fly
- tan barred rubber legs and two or three strands of black Krystal Flash at the rear
- EP mono/crustacean eyes are the correct component (the prompt's 'mono eyes on stalks' is right but should be named as the small black EP crab/shrimp eyes)
- standard colourways: tan, olive, rootbeer, transparent, coyote; overall length about 2.5 in at #4 and 3 in at #1/0

*Invented:*
- nothing beyond the misplaced egg sac and the 'wing' wording

*Sources:* [1](https://midcurrent.com/v2/how-to-tie-the-ep-spawning-shrimp-for-march-redfish-and-bonefish/) · [2](https://www.saltwaterflies.com/ep_spawning_shrimp.html) · [3](https://www.tridentflyfishing.com/products/enrico-puglisi-spawning-shrimp-fly)
*Confidence:* medium

### `flexo-crab`
**Hook:** Gamakatsu SL11-3H or SS15 saltwater hook, #4-1/0; rides HOOK POINT UP (dumbbell eyes at the head; the fly needs 'enough weight for the fly to swim without spinning').  
**Recipe:** Flexo Crab: Gamakatsu SL11-3H or SS15, #4-1/0; lead (or brass) dumbbell eyes at the hook eye; the carapace is a length of Flexo / E-Z Body expandable braided mesh tubing tied over the shank and flexed so it opens into a crab-shaped shell - it stays HOLLOW so water passes through it and the fly sinks fast on modest weight; tan micro/velvet chenille legs and claws are threaded THROUGH the mesh with a wire threader and locked in place with UV resin (Deercreek Sculpt), so a torn-off leg can simply be re-threaded; large red or black EP crab eyes on stalks at the front of the shell. Beige/tan is the standard colour, often barred with a marker.

*Wrong:*
- The inverted-orientation paragraph is DUPLICATED verbatim - systemic paste bug.
- 'The wing/hair and weighted eyes are tied on the SAME side of the shank' - backwards; the dumbbell eyes belong on the opposite side of the shank from the point. There is no wing on this fly.
- 'stuffed and shaped' - wrong. The whole point of the Flexo Crab is that the mesh shell is hollow and open so 'water can easily pass through the body'; nothing is stuffed inside it.
- 'painted olive-tan' - the tubing is supplied coloured (beige/tan is standard) and is at most barred with a permanent marker; it is not painted.
- 'A round crab body' - the flexed mesh forms a flattened oval carapace, not a ball.
- 'rubber legs' - the legs and claws are micro velvet chenille pulled through the mesh and set with resin.

*Missing:*
- large red or black EP crab eyes on stalks at the front of the shell
- the distinction between two claws and the several legs, all threaded through the mesh
- the dabs of clear UV resin where the legs pass through the shell
- the visible woven/braided texture of the mesh, which is the pattern's signature look

*Invented:*
- the stuffed body
- a painted finish

*Sources:* [1](https://www.cw-flies.com/blog/flexo-crab-step-by-step) · [2](https://deneki.com/2021/10/fly-tying-flexo-crab-pattern/) · [3](https://globalflyfisher.com/video/flexo-crab)
*Confidence:* medium

### `game-changer`
**Hook:** Gamakatsu SL12S #1/0 (short-shank wide-gap) at the FRONT of the chain, point-DOWN. The articulated shanks trail BEHIND the hook. Only the deliberately inverted 'belly-scratcher' variant rides point-up, and that one uses tungsten belly weighting.  
**Recipe:** Blane Chocklett's Game Changer (Mad River Outfitters step-by-step, Global FlyFisher, Fly Fish Food): a chain of articulated Fish-Spine shanks (typically 10mm shanks for the rear body and 15mm shanks toward the front) terminating at the FRONT in the hook — Gamakatsu SL12S #1/0 on the standard version, with an optional mid-chain stinger hook. Rearmost shank carries a white saddle-hackle or marabou tail; each successive shank is dressed with splayed hen-saddle feathers (the original Feather Game Changer) or a synthetic brush (Polar Fiber / Game Changer Chenille / Body Wrap versions), tied in a tent shape at about 45 degrees and taken from progressively lower on the skin to build density; Chocklett's Filler Flash palmered between layers; optional pectoral fins; a Fish-Mask or resin head with large 3D eyes at the front. Unweighted in the standard version.

*Wrong:*
- "Several small shanks linked in a chain ending in a hook" is at best ambiguous and reads most naturally as hook-at-the-rear. On a Game Changer the hook is at the FRONT, at the head, and the shanks trail behind it as the body and tail. An image model will almost certainly put the hook last in the chain, at the tail — the wrong way round.
- "forked tail" — no source gives a Game Changer a forked fish tail. The tail is a soft white saddle hackle or marabou plume on the rearmost shank.
- "each shank wrapped with a white synthetic fiber brush" states only one of several dressings and omits the original: the Feather Game Changer uses splayed hen-saddle feathers. If you want the synthetic version, say Polar Fiber or Game Changer Chenille explicitly.
- "big 3D eyes at the head" is right in spirit but omits that the eyes are set into a Fish-Mask / resin head at the hook, not floating on fibre.

*Missing:*
- Hook position at the FRONT of the chain
- Fish-Spine articulated shanks by name, and that segments shorten toward the tail
- Tail: white saddle hackle or marabou on the rearmost shank
- Filler Flash palmered between the feather/brush layers
- Fish-Mask or UV-resin head that carries the eyes
- Optional pectoral fins (hackle tips at the head)

*Invented:*
- "forked tail"
- Implicit hook-at-the-rear arrangement

*Sources:* [1](https://madriveroutfitters.blogspot.com/2019/01/fly-tying-blane-chockletts-feather-game.html) · [2](https://globalflyfisher.com/video/how-to-tie-the-gamechanger) · [3](https://www.flyfishfood.com/blogs/streamer-tutorials/belly-scratching-game-changer)
*Confidence:* medium

### `gotcha`
**Hook:** TMC 811S / Mustad 34007 standard-length stainless saltwater hook, #8-1/0. Tied hook-point-down in the vice but the hook is TURNED OVER partway through (Deneki step 7) so the wing goes on the hook-point side; with bead-chain eyes the finished fly fishes INVERTED, point-UP, with the wing shielding the point. Note: sources vary in how explicitly they state this — Charlie's Fly Box does not spell the orientation out, while the Crazy Charlie lineage it descends from is documented as the first bonefish fly designed to ride point up.  
**Recipe:** Gotcha (Jim McVay; Charlie's Fly Box, MidCurrent, Deneki, Salty Fly Tying): TMC 811S or Mustad 34007 #8-1/0 tied with pale 'Gotcha pink' thread; medium silver bead-chain eyes (or plated lead eyes for heavier versions) lashed across the shank about two hook-eye widths back from the hook eye; tail of flat pearl Diamond/mylar braid, shredded and picked out, about one shank length past the bend; body of the same flat pearl braid wrapped forward to the eyes and figure-eighted around them; a sparse tan or cream craft-fur (or pale polar-fibre) wing about one and a half to two shank lengths, tied in behind the eyes with three or four strands of pearl Krystal Flash; a pronounced pink thread head built up in front of the eyes and gloss-coated. Some tyings add hot-orange sili-legs.

*Wrong:*
- KNOWN SYSTEMIC BUG PRESENT: the inverted-orientation paragraph is pasted in TWICE, verbatim. The paragraph is appropriate here but the duplicate must go.
- "a short sparse tail of pearl flash fibers about half the shank length" — wrong material and wrong length. The tail is flat pearl Diamond/mylar BRAID, shredded and picked out into a fan, and it extends about one full shank length past the bend.
- "a slim pearl mylar tinsel body" — the body is flat pearl Diamond Braid wrapped in overlapping turns and figure-eighted around the eyes, a fatter, more textured look than plain mylar tinsel.
- "silver bead-chain eyes tied just behind the hook eye" — sources put the eyes about two hook-eye widths back, leaving room in front for the pink head. 'Just behind the hook eye' leaves no room for the head.
- "with pink thread" badly undersells the fly's single most recognisable feature: a prominent, glossy, built-up PINK THREAD HEAD in front of the bead-chain eyes, which is what makes a Gotcha look like a Gotcha.
- "A sparse tan craft-fur wing ... extending past the bend" gives no length; sources say one and a half to two shank lengths.

*Missing:*
- Prominent built-up glossy pink thread head in front of the eyes
- Three or four strands of pearl Krystal Flash through the craft-fur wing
- Tail material (shredded pearl Diamond braid) and length (about one shank length)
- Body material named as flat pearl Diamond Braid, figure-eighted around the eyes
- Wing length of one and a half to two shank lengths
- Eye placement about two hook-eye widths back from the hook eye

*Invented:*
- "pearl flash fibers" as the tail
- Eyes "just behind the hook eye"

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/gotcha) · [2](https://midcurrent.com/v2/how-to-tie-a-gotcha-bonefish-fly-the-pattern-sizes-and-steps-that-work/) · [3](https://deneki.com/2024/12/fly-tying-gotcha/) · [4](https://blog.saltyflytying.com/gotcha-%E2%80%A2-jim-mcvay/)
*Confidence:* medium

### `half-and-half`
**Hook:** Gamakatsu B10S / SL12S wide-gap streamer-saltwater hook, #2-6/0. Fishes INVERTED, point-UP — the dumbbell eyes flip it, so the chartreuse wing and the hook point are on the same side.  
**Recipe:** Half & Half (Bob Clouser / Lefty Kreh hybrid; Fat Fingered Fly Tyer, J. Stockard, Orvis): Gamakatsu B10S or SL12S #2-6/0; dumbbell or brass eyes lashed across the shank about one third of the shank back from the hook eye; at the BEND four to six streamer saddle hackles of equal length as a Deceiver tail; ten to twenty strands of silver Flashabou; white bucktail belly and chartreuse bucktail wing Clouser-style (also olive, red or black). Rides hook point up.

*Wrong:*
- KNOWN SYSTEMIC BUG PRESENT: the inverted-orientation paragraph is pasted in TWICE, verbatim. The paragraph is correct for this pattern, but the duplicate must be deleted.
- "Long saddle-hackle tail like a Deceiver at the bend, lead dumbbell eyes and bucktail like a Clouser at the front" — this is a description by reference, not a materials list. An image model given 'like a Deceiver' and 'like a Clouser' has nothing concrete to draw. No colour, no count, no lengths, no eye position.
- No colourway is stated. The canonical Half & Half is chartreuse over white; without it the model picks at random.
- Eye position is unstated; sources put the dumbbells about one third of the shank back from the hook eye, not at the very front.
- "Saltwater hook" is under-specified — this pattern needs a wide-gap hook because of the bulky front.

*Missing:*
- Number of tail hackles (four to six) and their length (two to three times the shank)
- Flash: ten to twenty strands of silver Flashabou at the eyes
- Colours: chartreuse bucktail wing over white bucktail belly
- Dumbbell eye placement about a third of the shank back from the hook eye
- That the bucktail is split belly/wing on opposite sides of the shank, Clouser-style

*Invented:*
- Nothing factually invented, but the duplicated orientation paragraph is boilerplate rather than description.

*Sources:* [1](https://fatfingeredflytyer.com/clousers-half-half-step-by-step/) · [2](https://www.jsflyfishing.com/blogs/fom/clousers-half-and-half-variant) · [3](https://news.orvis.com/fly-fishing/video-tie-half-half)
*Confidence:* high

### `hendrickson-dry`
**Hook:** Standard straight dry-fly hook (Mustad 94840, Daiichi 1100/1180), #12-16. Rides point-DOWN, wings on top of the shank.  
**Recipe:** These are two different flies and the prompt describes neither correctly. Art Flick's LIGHT HENDRICKSON (female dun), eye to bend: bare thread head, two upright divided wings of barred lemon wood-duck flank equal to the shank length, a collar of blue-dun rooster hackle wound BOTH in front of and behind the wing bases, a thin slightly tapered body of pale pink urine-stained vixen red-fox belly fur, and blue-dun rooster hackle-fibre tails slightly longer than the shank. Art Flick's RED QUILL (male dun) is the same fly with a body of stripped Rhode Island Red rooster hackle quill — a hard, glossy, distinctly SEGMENTED reddish-brown quill body, not dubbing — with wood-duck wings, medium-dun tail and medium-dun hackle.

*Wrong:*
- 'The fly is a "Hendrickson (Red Quill / Light Hendrickson)"' — the prompt names two distinct patterns and then gives one body. An image model cannot draw both; this needs to be split into two flies or committed to one.
- 'slim pinkish-tan dubbed body' is only the Light Hendrickson. The Red Quill's body is a stripped Rhode Island Red hackle quill — a smooth, glossy, segmented reddish-brown quill wrap. Labelling a dubbed body 'Red Quill' is a straight factual error.
- 'stiff dun hackle wound around the shank behind the wings' — wrong placement. Catskill-style hackle is wound both IN FRONT OF and BEHIND the upright wings, with the front turns supporting the wings. Hackle only behind the wings is not a Catskill dry.
- 'long stiff hackle-fiber tails' understates the colour: Flick specifies blue-dun (Light Hendrickson) / medium-dun (Red Quill) rooster hackle fibres.

*Missing:*
- The bare, thread-covered shank behind the hook eye — the signature Catskill feature ('some bare shank behind the hook eye', Orvis).
- Wing material named precisely as BARRED LEMON WOOD-DUCK FLANK fibres (the prompt says 'wood-duck flank' but does not call out the barring, which is the visual identifier).
- Wing height — equal to the hook shank.
- Tail length — slightly longer than the hook shank.
- The overall Catskill 'sparse' character; these flies are notably thin-bodied and sparsely hackled.

*Invented:*
- Nothing is invented outright, but merging the Red Quill and Light Hendrickson into one description creates a fly that exists in no recipe.

*Sources:* [1](https://www.swtu.org/2026/04/06/light-hendrickson-art-flick/) · [2](https://www.johnkreft.com/mayfly-fly-patterns/art-flicks-red-quill/) · [3](https://news.orvis.com/fly-fishing/video-how-to-tie-a-catskills-style-march-brown-dry-fly) · [4](https://www.johnkreft.com/tying-catskill-dry-flies/)
*Confidence:* high

### `jig-hares-ear`
**Hook:** 60-degree competition jig hook (Umpqua U555, Hanak 400BL, Firehole 516, TMC 403BLJ), sizes 12-18, with a slotted tungsten bead. Rides point-UP (inverted): the bent jig eye and the tungsten bead roll the hook over so the point rides uppermost — Umpqua: "Because jigs ride with the hook point up they are less prone to snagging."  
**Recipe:** Jig Hare's Ear (Euro nymph), eye to bend: a slotted tungsten bead seated hard against the bend of the jig eye, usually a hot-spot thread collar (red, orange or pink) and/or a thorax-collar of peacock Ice Dub, sometimes with a turn of Hungarian partridge soft hackle, then a hare's-ear dubbed body ribbed with fine gold or copper wire, and a short tail of coq de Leon or hare's-mask guard-hair fibres. There is no wing and no dumbbell or bead-chain eyes.

*Wrong:*
- "A 90-degree jig hook" — Euro jig nymphs are tied on 60-degree competition jig hooks; 90-degree jig hooks are the older style used for streamers and balanced leeches (Umpqua's own explainer distinguishes the two). A 90-degree bend would give a visibly wrong hook silhouette.
- "The wing/hair and weighted eyes are tied on the SAME side of the shank as the hook point" — this fly has NO wing, NO hair and NO weighted eyes. This sentence is Clouser/flats-pattern boilerplate pasted into a nymph prompt; it will make the image model add a hair wing and dumbbell eyes that no recipe supports.
- That same sentence is duplicated verbatim in the prompt, doubling the weight the model gives to the invented wing and eyes.
- The orientation claim, while landing on the right answer (point up), gives the wrong mechanism: the fly rides inverted because the slotted tungsten bead sits on the bent jig eye above the shank, not because materials are tied on the point side.

*Missing:*
- The tail — a short sparse bunch of speckled coq de Leon or hare's-mask guard hairs at the bend.
- The wire rib (fine gold or copper) over the hare's-ear abdomen.
- The hot-spot collar of red, orange or pink thread immediately behind the bead — near-universal on this pattern.
- The peacock Ice Dub or picked-out hare's-ear thorax, and on some versions a single turn of Hungarian partridge soft hackle.
- That the bead is a SLOTTED tungsten bead (gold, copper or black) seated hard against the jig bend so the slot straddles the eye.

*Invented:*
- "the wing/hair" — this pattern has no wing of any kind.
- "weighted eyes" — there are no dumbbell or bead-chain eyes; the weight is the slotted tungsten bead.

*Sources:* [1](https://www.umpqua.com/stories/why-jig-hooks/) · [2](https://thenorthernangler.com/blogs/fly-tying-tutorials/guides-choice-hares-ear-jig-tutorial) · [3](https://howtoflyfish.orvis.com/fly-tying-videos/techniques/1062-jig_hooks_and_slotted_beads_part_1_of_2) · [4](https://www.johnkreft.com/jig-nymphs-for-euro-nymphing/)
*Confidence:* high

### `kwan`
**Hook:** Mustad 34007 / Daiichi 2546 straight-eye saltwater hook, #1-6; rides HOOK POINT UP - Texas Saltwater Fishing Magazine: 'Kwan Flies ride with the hook oriented in the upright position and a mono loop tied above the tail prevents it from fouling on the hook shank', with lead or bead-chain eyes at the head and a mono weedguard.  
**Recipe:** Kwan (Patrick Dorsey, the 'grand slam fly'): Mustad 34007 or Daiichi 2546, #1-6; lead dumbbell or bead-chain eyes at the hook eye with a 20 lb mono weedguard tied in ahead of them; a craft-fur (or coyote-fur) tail with a few strands of polar/Krystal Flash at the bend, held clear of the shank by a 30 lb mono anti-foul loop; a small hot-orange egg/attractor spot; a palmered hackle collar; and a body of Aunt Lydia's rug yarn (or EP fibres) tied crosswise in segments and trimmed to a flat crescent about 1/4 in from the shank. Tans, browns, white and chartreuse are the common colours.

*Wrong:*
- The inverted-orientation paragraph is DUPLICATED verbatim - systemic paste bug.
- 'The wing/hair and weighted eyes are tied on the SAME side of the shank' - backwards; the weighted eyes go on the opposite side of the shank from the point. There is no wing on this fly.
- 'a tan rabbit-strip tail off the bend' - the standard Kwan tail is CRAFT FUR (Drew Chicone's version uses coyote fur). A rabbit strip belongs only to the 'Rabbit Kwan' variant, so calling it the Kwan's tail is wrong.

*Missing:*
- the small hot-orange egg/attractor hot spot at the back of the body
- the palmered hackle collar
- a few strands of flash in the tail
- the 30 lb mono anti-foul loop above the tail (separate from the weedguard at the front)
- the body is trimmed to a flat crescent that stands only about 1/4 in off the shank

*Invented:*
- the rabbit-strip tail as the defining Kwan feature

*Sources:* [1](https://www.texassaltwaterfishingmagazine.com/fishing/by-type/fly-fishing/fly-month-kwan-fly) · [2](https://flylifemagazine.com/fly-tying-with-drew-chicone-patrick-dorsey-ambassador-of-kwan/) · [3](https://www.sightcastfishing.com/reports/top-5-redfish-flies)
*Confidence:* medium

### `mantis-shrimp`
**Hook:** Daiichi 2546 or similar straight-eye saltwater hook, #2-4; rides HOOK POINT UP - the dumbbell or bead-chain eyes at the head invert the fly.  
**Recipe:** Veverka's Mantis Shrimp (Bob Veverka): Daiichi 2546 #2-4; 5/32 dumbbell or large bead-chain eyes at the hook eye; at the bend a tan craft-fur tail with tan or pearl Krystal Flash antennae and large black burnt-mono or EP crustacean eyes on stalks; the body is craft-fur dubbing wrapped in three turns with a separate set of tan rubber legs between each turn - 'one turn of tan Craft-fur dubbing then another set of rubber legs... 3 sets in all'; a strip of tan rabbit fur is pulled over the top as the carapace and the whole thing is coated with thin UV resin. Sand/tan is the standard colour.

*Wrong:*
- The inverted-orientation paragraph is DUPLICATED verbatim - systemic paste bug.
- 'The wing/hair and weighted eyes are tied on the SAME side of the shank' - backwards; the dumbbell eyes must be on the opposite side of the shank from the hook point. There is also no wing on this fly.
- 'rubber-leg antennae' - the antennae are strands of tan or pearl Krystal Flash. The rubber legs are not antennae; they are three separate sets spaced along the BODY.
- 'dubbed segmented body with legs underneath' - the legs are in three sets spread along the length of the body and splay out to the sides, not massed underneath.

*Missing:*
- the tan craft-fur tail at the bend
- the tan rabbit-fur strip pulled over the top of the body as a carapace/back
- the large black burnt-mono (or EP crustacean) eyes on stalks - the prompt says 'prominent mono eyes' but does not say they are large, black and stalked at the rear/bend end
- UV resin coating
- that the body dubbing is craft fur, which gives a translucent spiky look

*Invented:*
- 'rubber-leg antennae' - no source uses rubber for the antennae

*Sources:* [1](https://blog.saltyflytying.com/ververka-mantis-shrimp-%E2%80%A2-bob-ververka/) · [2](https://deneki.com/2020/07/veverkas-mantis-shrimp-from-its-creator-2/)
*Confidence:* high

### `merkin`
**Hook:** TMC 811S or similar straight-eye saltwater hook, #1/0-6; rides HOOK POINT UP (dumbbell eyes tied on top of the shank behind the hook eye).  
**Recipe:** Del Brown's Merkin: TMC 811S #1/0-6 (commonly 2-4); plated lead dumbbell eyes lashed on TOP of the shank about two eye-lengths behind the hook eye - 'This will make the hook point ride up'; at the bend, four (or two) splayed brown, cree or barred-ginger neck hackle tips about a shank length long as claws, with 3-6 strands of pearl Flashabou over them in a narrow V; the body is roughly five 1.5-in bunches of tan acrylic rug/craft yarn tied crosswise with X-wraps from the bend forward and trimmed into a flat oval/teardrop carapace, widest near the bend; four white square or round rubber legs are knotted between the yarn bunches and their tips marked red.

*Wrong:*
- The inverted-orientation paragraph is DUPLICATED verbatim - systemic paste bug.
- 'The wing/hair and weighted eyes are tied on the SAME side of the shank as the hook point' - backwards. Sea Island's step-by-step is explicit: 'Tie the dumbbell eyes right behind the eye of the hook on the top of the hook. This will make the hook point ride up.' In the finished fly the eyes hang BELOW the shank while the point is up. There is also no wing on a Merkin.
- 'splayed grizzly hackle tips' - wrong feather. The claws are brown, cree or barred-ginger neck hackle tips; grizzly (black-and-white barred) is not the pattern.
- 'rubber legs at the bend as claws and legs' - the rubber legs are not at the bend; they are knotted in between the yarn bunches along the WHOLE length of the body, four of them, sticking out sideways.

*Missing:*
- 3-6 strands of pearl Flashabou tied over the hackle claws in a narrow V
- the white rubber legs have red-marked tips
- the yarn is tied in about five separate crosswise bunches and trimmed to a teardrop/oval widest at the bend end, tapering toward the hook eye
- olive/brown and cream/tan are the other standard colourways

*Invented:*
- grizzly hackle claws

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/dels-merkin) · [2](https://seaislandflyfishers.org/del-browns-merkin-crab/) · [3](https://themissionflymag.com/del-browns-merkin-crab-sbs/)
*Confidence:* high

### `morrish-hopper`
**Hook:** 2XL long-shank hopper/nymph hook (TMC 5212 or a 2XL curved nymph hook), sizes 6-12. Rides point-DOWN.  
**Recipe:** Eye to bend: a blunt foam head over the eye; a bright ORANGE (or red) thin foam indicator patch sitting on top of the head/thorax; a laminated two-tone foam body (roughly 5mm total: tan on top, yellow/purple/olive on the belly depending on colourway) running the full length of the shank, razor-cut to a hopper shape - the TAN TOP FOAM IS THE WING, there is no separate hair or feather wing; two short straight rubber front legs just behind the head; two long knotted round-rubber hind legs swept back along the body with the knot forming the grasshopper knee. No antennae in any consulted recipe.

*Wrong:*
- "a flat wing over the back" - the Morrish Hopper has NO separate wing. The tan top layer of the laminated foam body is the wing; adding a wing on top will produce a different, generic hopper.
- "thin rubber antennae" - no published Morrish Hopper recipe includes antennae; this is invented.
- "A segmented tan foam body" - it is a laminated TWO-TONE foam body (tan top over a coloured belly), cut to a hopper silhouette, not a plain segmented tan slab.

*Missing:*
- The bright orange/red high-visibility foam indicator patch on top - the most visually distinctive feature of the fly
- The two-tone (tan over yellow, or tan over purple/olive) laminated foam
- The distinction between the two long KNOTTED rear legs and the two short STRAIGHT front legs
- The colourway range: tan and olive naturals, plus pink, purple and chartreuse

*Invented:*
- "a flat wing over the back"
- "thin rubber antennae"

*Sources:* [1](https://globalflyfisher.com/node/42677) · [2](https://hopperfishing.wordpress.com/2014/05/10/morrish-hopper-step-by-step/) · [3](https://flylordsmag.com/how-to-tie-the-morrish-hopper/)
*Confidence:* high

### `needlefish-fly`
**Hook:** Front hook Daiichi 2546 or Mustad beak bait 2/0 with a trailing stinger hook on wire; the fly rides HOOK POINT DOWN (the main hook; the trailing stinger is often set point-up).  
**Recipe:** Needlefish fly for barracuda (the Orvis/Bahamas style): a TWO-HOOK rig - a front Daiichi 2546 2/0 and a trailing size 1-2 stinger joined by 30 lb knottable wire running inside the body; the body is pearl E-Z Body braided tubing 5-6 in long (the Nightmare Needlefish version uses a 6-7 in mylar tube over about 100 chartreuse yak hairs); the top half is marked green or chartreuse with red gill stripes; large 6-7.5 mm 3-D or doll eyes are glued on and the whole head is coated in epoxy or UV resin.

*Wrong:*
- 'small eyes' - wrong. The eyes on a needlefish/cuda fly are large and conspicuous: 6 mm Fish Skull Living Eyes or 7.5 mm fluorescent yellow doll eyes, set in an epoxy head.
- 'A very long thin chartreuse braided tube body 8 inches long' - the sources give 5-6 in of E-Z Body braid (6-7 in of mylar tube in the Nightmare version). Eight inches is at the extreme long end and should not be stated as the norm.
- 'Long saltwater hook' - the pattern is not a single long-shank hook; it is a two-hook rig with a wire-joined trailer, and that is the part the picture would get visibly wrong.

*Missing:*
- the trailing stinger hook and the wire that joins it through the body
- the epoxy / UV-resin head
- the green or chartreuse top over a pearl body, with red gill marks behind the head
- the yak-hair or flash core inside the braided tube

*Invented:*
- small eyes

*Sources:* [1](https://deneki.com/2016/01/needlefish-fly-for-barracuda-tying-instructions/) · [2](https://blog.saltyflytying.com/nightmare-needlefish-fly-catch-more-bigger-barracuda/)
*Confidence:* high

### `palolo-worm-fly`
**Hook:** Gamakatsu SC15 or similar straight-eye saltwater hook, #1/0-2/0; rides HOOK POINT DOWN - unweighted, materials on top of the shank.  
**Recipe:** Palolo Worm: Gamakatsu SC15 #1/0-2/0; a coral / orange-red rabbit strip (or craft fur) tail tied at the bend, roughly 1.5-2.5 in; a body of orange or golden-olive micro / ultra chenille wrapped up the shank; a soft strung saddle-hackle collar in the same tone at the front; a 20 lb mono weedguard on many versions. Unweighted, no eyes; fished during the Keys palolo hatch.

*Wrong:*
- 'a small mono eye' - no published palolo worm recipe has eyes of any kind. This is a segmented marine worm imitation; mono eyes belong on shrimp and crab patterns, not here.
- 'rabbit strip OR chenille worm body' is too loose - the standard tie uses BOTH: a rabbit-strip tail off the bend and a chenille body on the shank.

*Missing:*
- the soft saddle-hackle collar at the front
- the 20 lb mono weedguard
- the two-tone look of the common ties (orange/coral tail against a golden-olive or darker chenille body)

*Invented:*
- the mono eye

*Sources:* [1](https://flylordsmag.com/how-to-tie-the-palolo-worm/) · [2](https://www.ginkandgasoline.com/gink-gasoline-fly-patterns/bruce-chards-palolo-worm/) · [3](https://www.yellowdogflyfishing.com/blogs/back-stage-pass/the-top-six-tarpon-flies)
*Confidence:* medium

### `perdigon`
**Hook:** Barbless jig hook with a slotted tungsten bead; rides point-UP (inverted) because the slotted bead and the jig eye rotate the hook over. Some published Perdigons (Charlie Craven's) are on a standard down-eye nymph hook and ride point-down - sources differ.  
**Recipe:** Perdigon: slotted tungsten bead on a barbless jig hook (Dohiku 302/303, Umpqua 210 PerdiJig, Fulling Mill 5045/5125, Hanak), sometimes a standard nymph hook in Charlie Craven's version; from the eye back - bead, a BRIGHT hot-spot collar of fluorescent orange, pink or red thread or dubbing immediately behind the bead, a black wing-case dot marked or resin-dotted on top of the thorax, a slim body of thread, quill or Perdigon body tinsel ribbed with fine (0.1mm) silver or copper wire, the whole body encased in thin UV-cure resin, and a short tail of speckled coq-de-Leon fibres at the bend.

*Wrong:*
- "a black hot spot behind the bead" - the hot spot is the opposite of black. Every source gives a bright fluorescent collar: fluorescent orange thread (Tactical Fly Fisher), fluorescent pink (Fly Fish Food), fire-orange thread (Craven). The BLACK element on a Perdigon is a separate wing-case DOT on top of the thorax, not the collar.
- "The wing/hair and weighted eyes are tied on the SAME side of the shank as the hook point" - a Perdigon has no wing, no hair and no weighted eyes. This is boilerplate from a Clouser-type pattern and will make an image model draw dumbbell eyes and a bucktail wing on a Perdigon.
- The entire orientation paragraph is duplicated verbatim in the prompt, doubling the weight of the wrong instruction.

*Missing:*
- The fine wire rib (0.1mm silver or copper) under the resin - it is what gives the body its segmented flash.
- The black wing-case dot on top of the thorax (black marker, nail polish or black UV resin).
- The bright fluorescent hot-spot collar in its correct colour (orange, pink or red).
- That the coating is thin UV-cure resin, and that the tail is a small sparse bunch of speckled coq-de-Leon, roughly shank length.

*Invented:*
- "weighted eyes" - no Perdigon recipe uses dumbbell or bead-chain eyes.
- "wing/hair" - a Perdigon has no wing.

*Sources:* [1](https://tacticalflyfisher.com/blogs/news/blogdiabaetis-perdigon-fly-tying-tutorial) · [2](https://www.flyfishfood.com/blogs/euro-nymph-tutorials/two-tone-perdigon) · [3](https://charliesflybox.com/blogs/fly-tying-videos/perdigon-fly-tying-video)
*Confidence:* high

### `peterson-spawning-shrimp`
**Hook:** TMC 811S stainless saltwater hook, #2-6. Rides POINT UP.  
**Recipe:** Peterson's Spawning Shrimp (Craig Peterson): TMC 811S #2-6, shell-pink thread; silver bead-chain or lead dumbbell eyes lashed on top of the shank in the front third; black mono shrimp eyes lashed along each side of the shank pointing back; a strand of black Krystal Flash folded to make two long antennae; at the bend, steelhead-orange Glo-Bug yarn tied in and trimmed to about a quarter of a shank length as the egg sac; sand-coloured craft fur layered over the egg sac and extending about 1.2 shank lengths past the bend; pumpkin/black Sili Legs at mid-shank folded back to give legs each side; pearl Diamond Braid wrapped forward from the legs to behind the weighted eyes as the body; two clumps of tan rabbit fur on the underside as the wing. The weighted eyes plus the rabbit wing orient the fly hook point up.

*Wrong:*
- KNOWN SYSTEMIC BUG, DUPLICATED: the inverted-orientation paragraph appears verbatim TWICE, back to back. The content is appropriate here, but the duplication must be removed.
- "rubber antennae" — the antennae are black KRYSTAL FLASH; the rubber in this pattern is pumpkin/black Sili Legs tied at mid-shank, which is a different feature in a different place
- "mono eyes, lead eyes" listed side by side with no placement — the weighted eyes sit in the front third on top of the shank while the black mono shrimp eyes lie along the sides pointing rearward past the head; without that the image will not read as a shrimp
- "an orange egg sac" with no position — the Glo-Bug yarn egg sac is tied AT THE BEND, under the craft-fur tail, about a quarter shank long

*Missing:*
- pearl Diamond Braid body wrapped from mid-shank forward to the weighted eyes
- two clumps of tan rabbit fur on the underside as the wing (this is what flips and holds the fly point-up)
- sand-coloured craft fur tail extending about 1.2 shank lengths past the bend
- pumpkin/black Sili Legs at mid-shank
- shell-pink thread

*Invented:*
- rubber antennae

*Sources:* [1](https://deneki.com/2015/09/petersons-spawning-shrimp-tying-instructions/) · [2](https://fatfingeredflytyer.com/petersons-spawning-shrimp-step-by-step/) · [3](https://www.intheriffle.com/in-the-riffle-blog/petersons-spawning-shrimp)
*Confidence:* high

### `raghead-crab`
**Hook:** Gamakatsu SL11-3H or similar straight-eye saltwater hook, #6-1/0; rides HOOK POINT UP (dumbbell eyes at the head; the weedguard version is sold for grassy permit flats).  
**Recipe:** Raghead Crab (Casa Blanca Raghead): Gamakatsu SL11-3H #6-1/0 (commonly 2-4); lead, brass or tungsten dumbbell eyes at the hook eye; at the bend a marabou plume flanked by two splayed hackle tips as the claws, with Krystal Flash antennae; the body is wool or McFly Foam tied in crosswise bunches, glued, and trimmed into a flat round crab disc; medium round rubber legs project from the sides; commonly sold with a mono weedguard and with yellow or black mono crab eyes. Cream/tan, olive and white are the standard colours.

*Wrong:*
- The inverted-orientation paragraph is DUPLICATED verbatim - systemic paste bug.
- 'The wing/hair and weighted eyes are tied on the SAME side of the shank' - backwards; dumbbell eyes go on the opposite side of the shank from the point. There is no wing on this fly.
- 'A round body of tan yarn trimmed flat' - the body is wool or McFly Foam, glued and trimmed; 'yarn' is the Merkin's material and the two flies should not look alike. The Raghead reads as a fuzzy, slightly shaggy disc, not as neat yarn bunches.
- 'hackle-tip claws' alone - the claws are a marabou plume FLANKED by two hackle tips, so the rear of the fly is soft and mobile, not just two feather tips.

*Missing:*
- the marabou between the hackle-tip claws
- Krystal Flash antennae at the bend
- mono crab eyes (yellow or black) - a distinguishing feature of the Casa Blanca versions
- the mono weedguard on the common weedguard version
- olive, cream and white as the other standard colours

*Invented:*
- nothing outright, but 'tan yarn' substitutes the wrong body material

*Sources:* [1](https://globalflyfisher.com/video/raghead-crab) · [2](https://www.yellowdogflyfishing.com/products/casa-blanca-raghead-crab-weedguard) · [3](https://www.jackshirkflyfishing.com/fly-tying/tying-the-raghead-crab/)
*Confidence:* medium

### `redfish-toad`
**Hook:** Straight-eye saltwater hook, #2-4; rides HOOK POINT UP - bead-chain or lead eyes at the head plus a mono weedguard, for fishing in grass.  
**Recipe:** Redfish Toad: treated by the guide sources as the same fly family as the Kwan - 'a tail of Craft Fur, a hint of flash, a small attractor/egg hot spot, a palmered hackle collar, segmented sections of yarn or EP fibres' trimmed flat, over 'either bead chain or lead eyes', usually with a mono weedguard. Naturals (tan, brown, orange) and bright versions (white, pink, chartreuse) are both standard; #2-4.

*Wrong:*
- The inverted-orientation paragraph is DUPLICATED verbatim - systemic paste bug.
- 'The wing/hair and weighted eyes are tied on the SAME side of the shank' - backwards; the bead-chain eyes go on the opposite side of the shank from the point. There is no wing on this fly.
- 'A wide flat body of tan rabbit fur strips tied crosswise' - wrong material. The toad/Kwan body is segmented sections of YARN or EP FIBRES tied crosswise and trimmed flat; rabbit strips are not tied crosswise to make the body.
- 'a rabbit-strip tail' - the described tail in the guide sources is craft fur (rabbit is a variant, not the standard).

*Missing:*
- the small orange attractor/egg hot spot
- the palmered hackle collar
- a hint of flash in the tail
- the bright colourways (white, pink, chartreuse) alongside the naturals

*Invented:*
- a body built from rabbit fur strips

*Sources:* [1](https://www.sightcastfishing.com/reports/top-5-redfish-flies) · [2](https://anycreek.com/academy/ultimate-guide-to-redfish-flies-guided) · [3](https://www.microskiff.com/threads/redfish-toad-tying-instruction.21280/)
*Confidence:* medium

### `san-juan-worm`
**Hook:** Short curved scud hook or 2X-long straight-shank nymph hook, point-DOWN, chenille lashed on top of the shank.  
**Recipe:** San Juan Worm: a curved scud hook or short 2X-long nymph hook (TMC 3761, 2457) #10-14, thread to match or contrast; a single two-inch strand of Ultra Chenille (Vernille) tied down across the middle of the shank with a thread band, the two free ends left projecting well past the eye and past the bend, each end singed with a lighter to a tapered tip. Standard colours red, worm brown, pink, orange. No bead in the standard pattern. The Squirmy Wormy is the same construction with a stretchy silicone Squirmy strand in place of the chenille.

*Wrong:*
- "small bead in the middle" - flatly wrong and invented. Charlie Craven's step-by-step states "no bead is used in this standard pattern". What sits in the middle of the shank is a band of THREAD holding the chenille down. A beadhead San Juan Worm exists, but the bead goes at the EYE, never in the middle.
- "tapered ends" without saying how - the taper comes from singeing the cut ends of the chenille with a flame; without that the model will draw blunt-cut chenille.

*Missing:*
- That the chenille is held by a thread band at the centre of the shank and both ends hang free and mobile.
- That the ends are melted/singed to points.
- The Squirmy variant - our id says "San Juan Worm / Squirmy" but the prompt only describes ultra chenille; the Squirmy is a glossy, translucent, stretchy silicone strand and looks visibly different.
- Colour range - red, worm brown, pink and orange are all standard.

*Invented:*
- "small bead in the middle" - no published San Juan Worm recipe places a bead mid-shank.

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/san-juan-worm) · [2](https://duranglers.com/fly-tying-san-juan-worm/) · [3](https://globalflyfisher.com/video/san-juan-worm-2)
*Confidence:* high

### `sculpzilla`
**Hook:** Short articulated front shank plus a trailing short-shank Octopus stinger hook. Per Fly Fishing the Sierra the stinger hook RIDES POINT-UP, with the rabbit strip wing running over the top of it - the heavy cone at the nose keels the fly. Our prompt's "Hook rides point-down" contradicts this. Note other retailer sources simply do not state orientation.  
**Recipe:** Sculpzilla (Ray Chang, Solitude Fly Company, early 2000s): an articulated sculpin built on a short front shank or short-shank hook carrying a 3/8" black-nickel CROSS-EYED CONEHEAD at the front (a cone with a moulded eye on each side), plus dome or holographic eyes; behind the cone a collar of guinea fowl (gills) and hen-saddle or grizzly hackle, mallard-flank pectoral fins on the sides, an Ice-Dub/Laser-Dub body, a marabou overwing, and a barred rabbit zonker strip running back to a trailing Gamakatsu Octopus stinger hook #4-8 joined by a Dacron/backing loop. Colours olive, tan/ginger, natural, black, white, flesh; about 2.5 inches.

*Wrong:*
- "a molded weighted sculpin-helmet head" - wrong component. Every recipe checked specifies a cross-eyed CONEHEAD (3/8" black nickel), not a Fish-Skull Sculpin Helmet. A Sculpin Helmet is a flat, broad, moulded shroud and would render as a completely different fly.
- "Weighted head rides down. Hook rides point-down: hook point facing DOWN, materials on top of the shank" - contradicts the published description that the trailing stinger hook rides point-up with the rabbit strip extending over it. For an inverted fly the wing and the hook point are on the SAME side, which our prompt explicitly denies.
- "an olive rabbit strip body and tail" alone - the rabbit strip is the wing/tail, but the body is Ice Dub or Laser Dub and there is a hackle and guinea collar and mallard pectoral fins that the prompt omits entirely.

*Missing:*
- The cross-eyed conehead with a moulded eye each side, and the separate red holographic dome eyes.
- The guinea-fowl gill collar and the hen-saddle/grizzly hackle collar behind the cone.
- Mallard or wood-duck flank pectoral fins on each side.
- The Ice Dub / Laser Dub body and the marabou overwing.
- The articulation - the stinger is joined by a Dacron/backing loop, not rigidly attached.
- Designer and colour range (olive, tan/ginger, natural, black, white, flesh).
- Overall length about 2.5 inches - it is a compact fly, not a long streamer.

*Invented:*
- "molded weighted sculpin-helmet head" - no source lists a Sculpin Helmet on a Sculpzilla.
- "Weighted head rides down" as a stated behaviour - the sources describe a point-up stinger, not a head-down keel.

*Sources:* [1](https://flyfishingthesierra.com/sculpzilla1/) · [2](https://theflybench.com/patterns/sculpzilla) · [3](https://www.ashevilleflyfishingco.com/blog/2021/1/27/fly-tying-how-to-tie-sculpzilla) · [4](https://redsflyfishing.com/products/solitudes-sculpzilla-sculpin-streamer-best-streamer-pattern-for-sculpin)
*Confidence:* medium

### `slumpbuster`
**Hook:** TMC 5262 (2XL nymph/streamer), #2-10, fished point-DOWN. The cone is a head weight only, not an inverting weight; nothing about this pattern is tied inverted.  
**Recipe:** John Barr's Slumpbuster (Charlie's Fly Box, In The Riffle, Orvis): TMC 5262 2XL hook #2-10 with a brass or tungsten cone at the eye over 10-20 turns of lead wire; behind the cone a collar of pine-squirrel strip wrapped around the shank like a hackle and trimmed to about half a shank length; a body of gold Mini Flat Braid; and a dyed pine-squirrel Zonker strip laid matuka-style flat along the top of the shank to the bend, trailing past the bend as the tail, pinned down by open spirals of Brassie-size Ultra Wire that are spiralled up through the parted squirrel hair. Standard colours olive, black, rusty brown, natural, white.

*Wrong:*
- "a pine-squirrel fur strip along the top of the shank and trailing as a tail" omits the defining matuka construction: the strip is pinned to the top of the shank by open spirals of wire that pass UP THROUGH the hair, so wire ribbing crosses the wing. Without it an image model will draw a loose Zonker strip tied down only at each end.
- "A brass cone head at the eye, a pine-squirrel fur strip ... sparkle braid body" leaves out the squirrel collar wrapped around the shank immediately behind the cone. That flared collar is the single most recognisable visual feature of the fly after the cone.
- "sparkle braid body" is vague; every source specifies gold Mini-Flat Braid, a flat, wide, bright gold braid — not a round sparkle chenille.
- No colour is stated at all, so the model is free to pick anything. Olive is the standard/original demonstration colour.

*Missing:*
- Ultra Wire rib (Brassie size) spiralled through the squirrel wing, matuka style
- Squirrel-strip collar wrapped behind the cone, trimmed to about half a shank length
- Lead wire underbody beneath the braid (adds the forward taper you see)
- A stated colourway (olive standard)
- Tail length: the strip trails roughly a shank length past the bend

*Invented:*
- Nothing outright invented, but "Long-shank streamer hook" overstates it — TMC 5262 is a 2XL hook, not a long-shank streamer hook.

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/slumpbuster) · [2](https://www.intheriffle.com/in-the-riffle-blog/barrs-slumpbuster) · [3](https://news.orvis.com/fly-fishing/classic-video-tie-slumpbuster-streamer)
*Confidence:* high

### `sparkle-pupa`
**Hook:** Emergent: standard dry/wet hook, TMC 900BL, TMC 100, Daiichi 1180, #12-20. Deep: standard wet/nymph hook, TMC 100 or heavier TMC 3761/3769, #12-18, lead-weighted. Both ride point-DOWN.  
**Recipe:** "Sparkle Pupa" is two different LaFontaine patterns. Emergent Sparkle Pupa, eye to bend: a head of brown dubbing (or brown marabou), a deer-hair wing lying back over the body, a body of Antron dubbing enclosed in a split sheath of Antron yarn brought around BOTH sides of the shank as a translucent bubble, and a trailing shuck of Antron yarn/dubbing extending about a shank length past the bend. Deep Sparkle Pupa, eye to bend: a head/collar of dark ostrich herl or natural dubbing, a few lemon wood-duck fibres as legs at the sides, an Antron-yarn overbody sheath veiling a 50/50 Antron-dubbing underbody, over a lead-weighted shank — no deer-hair wing.

*Wrong:*
- "The fly is a \"LaFontaine Sparkle Pupa\"" — the prompt does not say which; it then mixes the two, giving a hair wing (Emergent only) AND "an ostrich or dubbed head" (ostrich is Deep only). No published recipe has both a deer-hair wing and an ostrich-herl head.
- "a short sparse hair wing" — the Deep Sparkle Pupa has no hair wing at all; its equivalent is a few lemon wood-duck fibres tied as legs at the sides. If the intended fly is the Deep version this is simply the wrong material.
- "Standard nymph hook" — the Emergent Sparkle Pupa (which matches this entry's "weight: none" and emerger type) is tied on a standard dry-fly/wet hook, not a nymph hook.

*Missing:*
- The trailing shuck — a loose tuft of Antron yarn/dubbing extending roughly one shank length past the bend. This is the pattern's most recognisable feature and the prompt omits it entirely.
- How the sheath is formed: the Antron yarn is split with a bodkin and brought around BOTH sides of the shank, then tied off at the head, so it veils the body as a translucent halo rather than lying on top.
- The underbody is an Antron-dubbing blend (roughly half Antron, half fine dry-fly dubbing) that must remain visible through the sheath.
- Standard colourways — olive/caddis green, ginger/amber, tan or brown underbody with cream/white or matching Antron sheath.
- For the Deep version: lemon wood-duck fibre legs at the sides and a lead underbody.

*Invented:*
- The combination of a hair wing with an ostrich head — an amalgam of two separate patterns that no source lists as one fly.

*Sources:* [1](https://www.johnkreft.com/caddis-fly-patterns/lafontaine-emergent-pupa/) · [2](https://flyfishingthesierra.com/emergent-sparkle-pupa/) · [3](https://flyfishingthesierra.com/deep-sparkle-pupa/) · [4](http://www.rockyrivertu.org/deep-sparkle-caddis-pupa.html)
*Confidence:* high

### `spoon-fly`
**Hook:** Stainless saltwater hook with a bent, humped shank, #2-4. It rides POINT UP, with the hook point standing above the concave face of the spoon — but NOT because of a wing or weighted eyes.  
**Recipe:** Spoon Fly (Kirk Dietrich's is the standard written recipe): Mustad 34007 stainless #2, the shank bent with pliers into a humped/caddis curve; 3/8 in gold, silver, copper or root-beer mylar tubing flattened over the shank and epoxied, then pressed with the thumb from beneath into a CONCAVE, cupped teardrop/oval spoon blade, wide at the front and tapering to the rear; size 20 lead wire at the rear of the shank to keep the hook riding point up; red thread head; sealed inside and out with 5-minute and 30-minute clear epoxy. Kirk's version has no tail and no eyes; common variants add bead-chain eyes, a sparse hackle/craft-fur tail and a mono weed guard.

*Wrong:*
- KNOWN SYSTEMIC BUG: the inverted-orientation paragraph "The wing/hair and weighted eyes are tied on the SAME side of the shank as the hook point, so the fly rides upside down" has been pasted onto a fly that has NO wing, NO hair and NO weighted eyes — the prompt itself says the body is bare mylar and epoxy with "no tail". The fly does ride point-up, but it does so from the shaped shank and a lead-wire keel, not from a wing or dumbbell eyes.
- SAME BUG, DUPLICATED: that entire paragraph appears verbatim TWICE in the prompt, back to back.
- "A flat teardrop-shaped body" — the defining feature of a spoon fly is that it is CONCAVE/cupped like a real spoon blade, not flat; a flat blade will not wobble and is not the fly
- "gold mylar braid" — the recipes specify mylar TUBING flattened over the shank (braid is a different material and would not form a smooth blade face)

*Missing:*
- the bent/humped hook shank that sets the blade angle
- lead wire at the rear of the shank as the keel that keeps the hook riding up
- red thread head at the hook eye
- the hard, thick, glassy clear-epoxy shell over both faces and sealing the blade edges
- the blade being wider at the front and tapering toward the rear

*Invented:*
- a wing or hair on the fly (there is none)
- weighted/dumbbell eyes (Kirk's spoon fly has none)

*Sources:* [1](https://www.laflyfish.com/2000/01/kirks-spoon-fly.html) · [2](https://nwmangum.com/spoonfly/) · [3](https://www.hatchmag.com/articles/tying-caves-wobbler-spoon-fly/7712441)
*Confidence:* medium

### `tarpon-toad`
**Hook:** Owner SSW / Gamakatsu SC15 straight-eye saltwater hook, 1/0-3/0; rides HOOK POINT DOWN - it is an unweighted, slow-sinking sight-casting fly with the dressing on top of the shank.  
**Recipe:** Tarpon Toad (Gary Merriman): Owner SSW straight-eye 5180 or Gamakatsu SC15, 1/0-3/0 (2/0 typical); a rabbit-strip tail tied in at the hook point and propped up with parachute wraps so it cannot foul, about 1.25-1.5 in long; two or three strands of flash; a marabou collar; then the head - a small bunch of EP fibres or poly yarn tied in four or five figure-eight sections occupying roughly the FRONT THIRD of the fly and trimmed into a wide flat 'toad' head; mono eyes set in the head. Unweighted or lightly weighted; total length 2.25-2.5 in. Original was a chartreuse bunny tail with chartreuse marabou collar and yellow/cream head; black/purple and black/red are the other staples.

*Wrong:*
- The point-down orientation paragraph is DUPLICATED verbatim ('Hook rides point-down: hook point facing DOWN, materials on top of the shank.' appears twice) - systemic paste bug.
- 'A wide flat yarn body tied crosswise along the shank' - wrong extent. The flat crosswise head occupies only the front third of the fly, right behind the hook eye; the rest of the shank is bare thread with the tail and collar at the back.
- 'a short hackle collar' - the collar is MARABOU, not hackle.
- Calling it a 'body' rather than a 'head' misplaces the mass - the Toad's signature is a broad flat head at the front.

*Missing:*
- mono eyes set into the flat head
- two or three strands of flash at the tail
- the rabbit strip is tied in at the hook point and propped upward so it will not wrap the bend
- the proportions: head about one third of a 2.25-2.5 in fly, tail 1.25-1.5 in
- the original chartreuse tail / chartreuse collar / yellow-cream head colourway

*Invented:*
- the hackle collar

*Sources:* [1](https://midcurrent.com/flies/tying-the-tarpon-toad/) · [2](https://www.tailflyfishing.com/the-tarpon-toad/) · [3](https://www.umpqua.com/tarpon-toad/)
*Confidence:* high

### `thunderhead`
**Hook:** Standard dry-fly hook, #12-16, POINT DOWN, materials on top of the shank.  
**Recipe:** Thunderhead (Fred Hall, Bryson City, NC, 1950s): Mustad 94840 / TMC 100 dry-fly hook #10-18, grey or black thread; wing of WHITE CALF TAIL tied upright and divided, Wulff style; body of grey muskrat (or possum) dubbing; hackle of coachman brown and grizzly mixed, one of each, wound behind and in front of the wing; tail of mixed brown and grizzly spade-hackle fibres. Essentially a hair-wing Adams built for rough Smokies freestone water.

*Wrong:*
- "deer-hair tail" — every written recipe found gives the tail as a mix of brown and grizzly hackle (spade hackle) fibres, not deer hair; a deer-hair tail would draw a Wulff, not a Thunderhead
- "Upright white calf-hair wings" is under-specified — the wings must be upright AND DIVIDED into two distinct posts (the source specifies "White Calf tail, upright and divided")

*Missing:*
- the tail as mixed brown and grizzly hackle fibres
- "muskrat grey" named as the dubbing shade
- hackle wound both behind and in front of the divided wing, coachman brown plus grizzly mixed

*Invented:*
- deer hair anywhere on the fly

*Sources:* [1](http://www.rockyrivertu.org/thunderhead.html) · [2](https://www.uky.edu/~agrdanny/flyfish/ljdecuir/smpatrns.htm) · [3](https://ontheflysouth.com/thunderhead/)
*Confidence:* high

### `trico-dun`
**Hook:** Tiny standard straight dry-fly hook, #20-26. Rides point-DOWN, wing on top of the shank.  
**Recipe:** Eye to bend: tiny thread head; a short upright wing of LIGHT GREY / pale dun poly yarn or dun CDC; a distinctly bulky blackish thorax; a very slim abdomen — olive on the female dun with a blackish thorax, all black on the male dun; three fine pale tails, considerably longer than the body. Often tied thorax-style with a grizzly hackle clipped flat underneath the shank, or with no hackle at all when a CDC wing is used. WiFlyFisher: 'Female Trico duns have an olive-colored body and blackish thorax'; 'Male Trico duns are mainly black'; recommended dressing is 'a thorax pattern with a light gray poly wing and a grizzly hackle clipped underneath the hook shank, or just a CDC wing'; 'Tricos have 3 tails'.

*Wrong:*
- 'a small upright white poly or CDC wing' — WRONG for the dun. The Trico DUN has a pale grey/light dun wing; the WHITE poly wing is the mark of the Trico SPINNER. Since this batch also contains a Trico Spinner, a white-winged dun makes the two images indistinguishable and teaches the wrong identifier.
- 'split tails' — Tricorythodes has THREE tails, not two; the standard dressing uses three fine fibres, and they are long relative to this tiny body.
- 'Slim black or olive thread body' treats black and olive as interchangeable. They are sex-specific: male all black, female olive abdomen with a blackish thorax. The prompt should say which, and should include the dark thorax on the olive version.

*Missing:*
- The bulky, distinctly darker thorax that gives the thorax-style dun its shape.
- Hackle treatment — either a grizzly hackle clipped flat underneath the shank, or no hackle when tied with CDC.
- Tail length — well over one shank length on this tiny hook.

*Invented:*
- The white wing is not supported for the dun in any recipe found; it belongs to the spinner.

*Sources:* [1](https://www.wiflyfisher.com/Trico-Hatch.asp) · [2](https://www.umpqua.com/trico-dun/)
*Confidence:* medium

### `yellow-palmer`
**Hook:** Traditionally a heavy wet-fly hook (Mustad 3906) #8-14, POINT DOWN; the dry-fly version is on a standard dry hook #12-18.  
**Recipe:** Yallarhammer/Yallerhammer (southern Appalachian classic): traditionally a WET fly — Mustad 3906 #8-14, black thread, body of PEACOCK HERL, and the 'hackle' a wing quill feather of the yellow-shafted flicker split down the shaft and palmered from back to front (flickers are now federally protected, so modern tiers substitute yellow-dyed mourning-dove or quail quill, or yellow-dyed grizzly hackle). A dry version exists: Mustad 94840 #12-18, tail of mixed yellow and black hackle fibres, body peacock herl, yellow-dyed grizzly hackle wound dry-fly style. Some recipes give a golden-pheasant tail and yellow floss body instead of herl. NO authoritative materials list was found for a separately named "Yellow Palmer" — the only reference located describes it merely as "a fly favored for the streams in the Little Cataloochee area", with no recipe; the batch file conflates two names.

*Wrong:*
- "Standard dry-fly hook" and the entry's type "dry" — the Yallarhammer is traditionally and predominantly a WET fly on a heavier wet-fly hook; the dry version is a modern secondary form
- "a yellow body" — the documented body is PEACOCK HERL (dark iridescent green-bronze); some variants use yellow floss, but no source gives a plain yellow body under palmered yellow hackle
- "Yellow hackle" — the defining material is a split yellow-dyed flicker/dove wing QUILL (a stiff, flat, barred yellow-and-black feather) palmered back to front, or its modern substitute yellow-dyed GRIZZLY (barred yellow and black); plain solid-yellow hackle is not the pattern
- Naming the fly "Yellow Palmer / Yallarhammer" treats two names as one fly; no recipe for a distinct Yellow Palmer could be located

*Missing:*
- peacock-herl body
- the barred yellow/black character of the hackle (dyed grizzly or split flicker/dove quill)
- tail — golden pheasant, or mixed yellow and black hackle fibres in the dry version
- the wet-fly build (softer, swept-back barbs, heavier hook)

*Invented:*
- a plain yellow body
- solid yellow (unbarred) hackle
- dry-fly designation as the primary form

*Sources:* [1](https://www.uky.edu/~agrdanny/flyfish/ljdecuir/smpatrns.htm) · [2](https://news.orvis.com/fly-fishing/the-yallerhammer) · [3](https://fightmasterflyfishing.com/index.php/2018/11/23/yallarhammer/) · [4](https://www.carolinasportsman.com/columns/oldies-but-goodies/)
*Confidence:* low


## Uncertain — sources genuinely disagree (3)

_These need your judgement, not more research._

### `cdc-caddis`
**Hook:** Standard straight dry-fly hook (TMC 100), #12-20. Rides point-DOWN, wing on top of the shank.  
**Recipe:** 'CDC Caddis' is a family name, not one dressing, and the published recipes genuinely differ. The Fly Bench version, eye to bend: head of olive Superfine dubbing; overwing of natural grey CDC feathers tented back over the body; an underwing of light grey Sparkle Emerger Yarn; body of olive Superfine dubbing; no hackle ('No hackle is needed — CDC provides both buoyancy and movement'); no tail; hook TMC 100 #12-16. Hans Weilenmann's CDC & Elk (Global FlyFisher) is a different construction again — a single CDC feather palmered as the body with a deer/elk hair overwing. What is common to all: a slim dubbed or CDC body, a soft CDC wing tented over the back, no hackle collar and no tail.

*Wrong:*
- Nothing in the prompt is contradicted by the sources, but the prompt describes a generic construction that no single named recipe matches, and sources disagree on whether there is an underwing, a dubbed head, or a palmered CDC body.

*Missing:*
- The dubbed head in front of the wing (The Fly Bench: 'Head: Olive Superfine Dubbing') — without it the wing butts sit bare against the eye.
- The light grey sparkle-yarn underwing in that version.
- Body colour — olive is the common default.
- Wing length — back to about the end of the bend.
- That CDC fibres look soft, wispy and slightly translucent rather than like a stiff hair wing; without this the image model tends to draw a deer-hair wing.

*Sources:* [1](https://theflybench.com/patterns/cdc-caddis) · [2](https://globalflyfisher.com/patterns-tie-better/cdc-elk-family) · [3](https://www.flyfishfood.com/blogs/dry-fly-tutorials/cdc-biot-caddis)
*Confidence:* low

### `ep-sand-eel`
**Hook:** Short-shank wide-gap stainless saltwater hook (Gamakatsu SC15 or similar), #2-1/0, point-DOWN. Unweighted or lightly weighted; nothing inverted, and our prompt correctly says point-down.  
**Recipe:** There is no single authoritative written recipe for a pattern called 'EP Sand Eel' — it is a commercial Enrico Puglisi fly and the published sand-eel tyings vary. The common construction across sources: a short-shank wide-gap stainless saltwater hook with sparse bunches of EP Fibers (or bucktail plus E-Z Body tubing in the Saltwater Edge version) tied in and folded back along the shank, white belly under an olive, tan or golden-olive back, with a few strands of pearl or lavender flash, trimmed into a very long, very slim, round-sectioned eel profile that runs one and a half to three times the hook length past the bend and tapers to a fine point; small stick-on eyes at the head, usually set in a bead of UV resin forming a smooth nose. Usually unweighted; lightly weighted versions exist.

*Wrong:*
- "Long saltwater hook" is probably wrong. EP-fibre patterns are built on SHORT-shank wide-gap hooks with the fibre body doing the length; a long shank would put the hook point too far back in a slim eel body. Sources for EP-style baitfish consistently specify Gamakatsu SC15-type short-shank hooks. (Sand-eel patterns from other tyers do use long-shank or tarpon hooks, so this is a genuine range, not a certainty.)
- "small eyes" and "slim profile" are so generic they give the model almost nothing. No fibre-layering method, no flash, no head resin, no length ratio.

*Missing:*
- Fibre bunches tied in and folded back along the shank
- A few strands of pearl flash between belly and back
- Stick-on eyes set in a bead of clear UV resin forming a smooth tapered nose
- Proportion: profile runs one and a half to three times the hook length past the bend and tapers to a fine point
- That the body is round in section rather than slab-sided like an EP Baitfish

*Invented:*
- "Long saltwater hook"

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/ep-minnow) · [2](https://saltwateredge.com/blogs/saltwater-edge/how-to-tie-a-sand-lance-fly-sand-eel-pattern-step-by-step-guide) · [3](https://flylordsmag.com/how-to-tie-sand-eel-fly/) · [4](https://www.saltwaterflies.com/capecodsandeel_pat.html)
*Confidence:* low

### `green-drake-extended`
**Hook:** Standard or slightly long straight dry-fly hook (TMC 100 size 8, or #10-12 for commercial versions). Rides point-DOWN, extended body and wing on top of the shank.  
**Recipe:** There is no single authoritative recipe — this is a family of commercial and tyer-specific patterns and the published dressings genuinely disagree. Umpqua's BDE Extended Body Green Drake: 'a foam extended body and poly wing', olive, sizes 10-12. Orvis's Travis Extended Body Green Drake: extended body plus 'a parachute post'. The Caddis Fly Shop tutorial version: TMC100 size 8, tail moose body hair, extended body of green-dyed deer hair with BWO Superfine dubbing, wing of dark-dyed deer hair plus a hot-orange para post, black saddle hackle. Common ground: a slim segmented olive body carried well past the bend, two or three dark tail fibres at its tip, a dark upright wing/post and a hackle at the front, most often wound parachute-style around the post.

*Wrong:*
- 'olive foam or dubbed extended body' — olive is the WESTERN green drake (Drunella grandis). The Eastern Green Drake (Ephemera guttulata) is pale cream-yellow with dark markings, and 'Green Drake' patterns sold in the East are creamy, not olive. The prompt should say which.
- 'parachute hackle' is stated without a post for it to wind around, while the wing is described as 'upright dark deer-hair or synthetic wing'. Unless the prompt says the hackle winds horizontally around the base of that upright wing/post, an image model will draw a vertical collar hackle instead.

*Missing:*
- How far the extended body reaches past the bend — roughly one shank length in the published versions.
- That the extended body is visibly SEGMENTED (banded), which is what makes these patterns read as drakes.
- Tail material — dark moose body hair in the written tutorial; the prompt just says 'three tails'.
- A thorax/dubbed section over the hook shank itself, forward of where the extended body joins.

*Invented:*
- 'three tails at its tip' is plausible for the natural (both Ephemera guttulata and Drunella grandis have three tails) but the written tying recipes found do not specify a count — the Caddis Fly Shop sheet just says 'Moose Body Hair'. Treat it as a reasonable choice, not a sourced one.

*Sources:* [1](https://www.umpqua.com/bde-ext/) · [2](https://www.orvis.com/product/travis-extended-body-green-drake/0154.html) · [3](https://oregonflyfishingblog.com/2021/08/01/extended-body-green-drake-fly-tying-instructional-video/)
*Confidence:* low


## Minor — right fly, wrong detail (55)

_Worth fixing, but the image would still be recognisable._

### `albie-fly`
**Hook:** Short-shank stainless saltwater hook, #2-1/0, POINT DOWN, materials on top of the shank.  
**Recipe:** Surf Candy / epoxy anchovy (Bob Popovics): short-shank stainless saltwater hook; a body of flat silver mylar tinsel over the shank; a wing of clear/white Ultra Hair or Super Hair, then 6-8 strands of flash, topped with a darker olive, grey or black Ultra Hair back; 3D prism or stick-on eyes; the whole head and forward body — "the part of the wing which goes from the hook bend to the eye" — is encased in clear 5-minute epoxy or UV resin, shaped into a translucent tapered minnow body, frequently with a red gill slash. Tied 2-4 inches for false albacore on bay anchovy and glass minnow.

*Wrong:*
- "a clear epoxy head and small eye" — the epoxy is not just a head: it encases the whole front body from the bend forward into a translucent tapered minnow shape, and the eyes are comparatively large 3D prism/stick-on eyes set in that resin

*Missing:*
- flat silver mylar tinsel body under the resin
- layered wing — clear/white Ultra Hair underwing, flash, darker olive over-wing
- the loose, translucent fibre tail trailing free behind the resin body
- the red gill slash commonly added at the rear of the epoxy head

*Sources:* [1](https://globalflyfisher.com/patterns-tie-better/surf-candy) · [2](https://www.saltwatersportsman.com/techniques/fly-tying/bob-popovics-surf-candy/) · [3](https://www.flytyer.com/the-modern-surf-candy/)
*Confidence:* medium

### `bloodworm`
**Hook:** Curved scud/grub hook (TMC 2487, TMC 2457, TMC 200R, Daiichi 1120/1270), sizes 10-18. Rides point-DOWN.  
**Recipe:** "Bloodworm" is a category rather than one named pattern and published dressings differ. The common shape, eye to bend: a small dark head or short collar (black thread, peacock herl, or a black/clear glass bead), then a slim bright blood-red body of red tying thread, red wire or red vernille, segmented by a contrasting rib (fine wire, often black, silver or gold), carried well down around the bend. Pat Dorsey's Mercury Blood Midge adds a clear glass bead and a peacock-herl collar; other stillwater versions add a short red marabou or Flexi-floss tail.

*Wrong:*
- "A slim segmented bright red body, no tail, no wings" — defensible for the plainest larva, but published bloodworm recipes almost always finish with a contrasting dark head or short collar (black thread, peacock herl, or a glass/tungsten bead), which the prompt excludes by implication.
- The prompt does not say what creates the segmentation. Sources give three distinct answers — a contrasting wire rib over thread, the red wire itself, or ribbed vernille — and the image model will invent one.
- Sources disagree on the tail: Into Fly Fishing's bloodworm has a red marabou tail, Dorsey's Mercury Blood Midge has none. "no tail" picks one side of a genuine split.

*Missing:*
- The dark contrasting head/collar (black thread, peacock herl, or clear/black bead).
- What material forms the body and the rib.
- That the body is carried well down and around the bend, giving the curled larval shape the pattern is named for.
- The colour should be a deep translucent blood red, not a flat scarlet.

*Sources:* [1](https://intoflyfishing.com/how-to-tie-a-bloodworm-larva/) · [2](https://bluequillangler.com/blogs/home-page/tying-the-mercury-blood-midge-with-pat-dorsey) · [3](https://blog.avidmax.com/2025/01/07/how-to-tie-fulling-mills-gut-bomb-bloodworm/)
*Confidence:* medium

### `bwo-comparadun`
**Hook:** Standard straight dry-fly hook (Partridge SLD, TMC 100), #16-22. Rides point-DOWN, wing on top of the shank.  
**Recipe:** Eye to bend: small thread head; a single wing of DUN-DYED (grey) deer hair tied upright about one-third back from the eye and flared into a flat 180-degree semicircle across the top of the shank, wing length equal to the hook; no hackle at all; slim light-olive dubbed abdomen; two dun Microfibett tails split widely into outriggers, about one and a half times the hook length. Loren Williams: 'Hook: Partridge SLD #14-#22 / Wing: Dyed dun deer hair / Tail: Dun Microfibetts / Body: Lt. Olive Fly Rite or Superfine Dubbing'.

*Wrong:*
- 'a fan of natural deer hair' — the BWO version is specified with dun-dyed (grey) deer hair in the written recipe. Natural deer is used on tan/cream comparaduns; sources do vary, but 'natural' as the default colour for a BWO is not what the recipe says.
- 'flared 180 degrees over the top of the thorax' understates where the wing sits — it is tied about one-third of the shank back from the eye, and the 180-degree fan is a flat semicircle spanning the TOP half only, side to side above the shank. 'over the top of the thorax' can read as a wing lying back over the body.

*Missing:*
- Tails must be split WIDELY apart into a V of outriggers (they are what holds the fly upright in place of hackle), about 1.5x hook length.
- Wing length equal to the hook length.
- Body colour specification — light olive.
- The explicit 'no hackle' is present but should be reinforced as 'no hackle anywhere on the fly', since image models routinely add a collar to a deer-hair dry.

*Sources:* [1](https://www.lwflies.com/tutorials/dry-flies/bwo-comparadun) · [2](https://news.orvis.com/fly-fishing/video-how-to-tie-a-sulphur-comparadun) · [3](https://globalflyfisher.com/patterns-tie-better/comparadone)
*Confidence:* high

### `cdc-loopwing`
**Hook:** Sources differ: Weilenmann's original specifies a straight-eye standard dry hook (Partridge SLD) #12-18; many tiers and the commercial version use a curved short-shank emerger hook (TMC 2487) #16-22. Either way it rides point-DOWN.  
**Recipe:** Hans Weilenmann's CDC Loop Wing Emerger, eye to bend: thread head; a loop formed from two natural-dun CDC feathers, anchored AT THE EYE with the tips folded forward and the loop arching up and back over the thorax; a slightly thicker, darker olive hare's-ear thorax; a slim olive (or grey) dubbed abdomen covering about the rear three-fifths of the shank; and at the bend a short wispy CDC trailing SHUCK, not stiff split tails. Umpqua sells it in grey and olive, sizes 18-22.

*Wrong:*
- "Small curved emerger hook" - stated as fact, but the originator's own recipe uses a straight-eye dry hook (Partridge SLD). Curved is a common variant; the prompt should acknowledge one or the other rather than asserting curved.
- "short tails" - the rear of this fly is a soft wispy CDC TRAILING SHUCK, not short stiff tails; drawing tails gives the wrong emerger silhouette.
- "Slim dubbed body" with no colour - the standard colourways are olive and grey (BWO/Baetis), and the thorax is darker and thicker than the abdomen.

*Missing:*
- That the CDC loop is anchored at the EYE, with the feather tips folded forward over the eye
- The distinct thicker, darker hare's-ear thorax versus the slim abdomen covering the rear three-fifths
- Colourway: olive or grey

*Sources:* [1](https://www.flytierspage.com/hweilenmann/cdc_loopwing_emerger.htm) · [2](https://www.umpqua.com/cdc-loop/) · [3](https://globalflyfisher.com/video/cdc-loop-wing-emerger-0)
*Confidence:* medium

### `chubby-chernobyl`
**Hook:** 2XL-3XL long-shank terrestrial/dry hook (TMC 5262, Daiichi 1260/1280, TMC 2302, Umpqua 200R), sizes 6-14. Rides point-DOWN.  
**Recipe:** Eye to bend: blunt foam head over the eye; a strip of 2mm foam laid flat along the top of the shank and tied down at two points so it forms two fat segments; a clump of white poly yarn (or EP fibre) wing tied in at EACH of those two points, lying back over the body at a low angle; two rubber legs splayed to each side at each tie-down point (four legs total); an Ice Dub sparkle-dubbed underbody showing between the foam segments; a short tail of a few strands of Krystal Flash at the bend. Standard colourways tan, black, purple and royal, always with the white wing.

*Wrong:*
- "two white poly-yarn wings standing up" - the two poly wings are tied in flat at two points along the foam body and lie BACK over the body at a low angle; they are not upright posts. This is the single most recognisable feature and upright wings would render a parachute-style fly, not a Chubby.
- "Large dry-fly hook" - it is a 2XL-3XL long-shank terrestrial hook, not a standard-length dry hook; a standard dry hook gives a stubby, wrong-proportioned body.

*Missing:*
- The sparkle dubbing underbody (Ice Dub) that shows between/below the foam segments
- The segmented foam body - the foam is tied down at two points to create two distinct fat segments, not one smooth slab
- That the legs come in two pairs, one pair at each foam tie-down point
- A named colourway - tan with white wing is the standard; black, purple, royal are the other originals

*Sources:* [1](https://www.flyfishfood.com/blogs/dry-fly-tutorials/chubby-chernobyl) · [2](https://www.flytyer.com/chubby-chernobyl-2/) · [3](https://blog.fishwest.com/fly-tying-tutorial-chubby-chernobyl/) · [4](https://www.johnkreft.com/stonefly-fly-patterns/chubby-chernobyl-purple/)
*Confidence:* high

### `crease-fly`
**Hook:** Long-shank stainless saltwater hook (Mustad 34011 or similar), #1-2/0, ridden POINT DOWN; the hook eye protrudes from the front of the foam and the bend and point protrude below the rear.  
**Recipe:** Crease Fly (Capt. Joe Blados): on a long-shank stainless saltwater hook, a sheet of closed-cell EVA foam (1-3mm) is folded in half over the hook shank and glued, the fold forming the back/top line, then cut to a deep, laterally flattened baitfish silhouette; the front of the fold is left open so the face is a hollow concave scoop that pops; a bucktail tail with pearl Krystal Flash is glued/tied in at the rear; the body is coloured with markers or foil, given stick-on prismatic eyes, and sealed under a clear epoxy or UV flex resin, often with glitter mixed in for scales.

*Wrong:*
- "painted eyes" — the recipe calls for flat stick-on prismatic/holographic eyes (1/4 in or 7mm), not painted eyes
- "painted silver and blue" alone understates the finish — the foam is coloured with markers/foil and then sealed under a clear epoxy or UV resin coat over the whole body, which is what gives the fly its glassy look

*Missing:*
- clear epoxy / UV flex resin coating over the entire foam body (often with glitter for scales)
- pearl Krystal Flash in the bucktail tail
- the deep, laterally compressed baitfish silhouette cut from the folded foam, with the fold forming the top line
- hook eye emerging from the front of the foam head

*Sources:* [1](https://globalflyfisher.com/video/crease-fly-0) · [2](https://www.mbgforum.com/topic/86-crease-fly-recipe/) · [3](https://www.riverroadcreations.com/capt-joe-blados-crease-fly-popper-cutter2.html)
*Confidence:* medium

### `daves-hopper`
**Hook:** 3XL long-shank hook (TMC 5262) #4-12. Rides point-DOWN.  
**Recipe:** Eye to bend: natural deer body hair spun and trimmed to a squared, flat-bottomed HEAD, with a COLLAR of untrimmed deer hair tips left sweeping back over the body; knotted ringneck pheasant-tail fibre hind legs, one each side, kicking out and back; a mottled turkey quill slip wing lying flat over the back to the end of the body; a yellow poly-yarn body (with a small yarn loop at the rear) palmered with a brown rooster hackle trimmed short to a bristly rib; a short RED deer belly hair (or red hackle fibre) tail.

*Wrong:*
- "A spun and trimmed deer-hair head" alone - the recipe's head is spun and trimmed square and flat-bottomed AND leaves a collar of untrimmed deer hair tips flaring back over the body. Trimming all round gives the wrong silhouette.

*Missing:*
- The short red deer-hair (or red hackle fibre) tail at the bend
- The brown rooster hackle palmered the length of the yellow yarn body and trimmed short to a bristle rib
- The flared deer-hair collar sweeping back behind the trimmed head
- The small yarn loop at the rear of the body
- Hook is 3XL long (TMC 5262), and the wing is a turkey QUILL SLIP (usually cemented) lying flat, not a loose feather

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/daves-hopper) · [2](https://en.wikipedia.org/wiki/Dave%27s_Hopper) · [3](https://charliesflybox.com/blogs/fly-tying-videos/daves-hopper-fly-tying-video)
*Confidence:* high

### `egg-pattern`
**Hook:** Short-shank, wide-gape egg/caddis hook, point-DOWN. The hook is almost hidden by the yarn ball; the point should just protrude below.  
**Recipe:** Glo Bug: short-shank wide-gape egg hook (Mustad C49S, Daiichi 1640, Partridge CZF) #10-16, GSP or fine strong thread; two full strands of thick egg yarn in the main colour plus a quarter-strand of a contrasting colour laid on top as the nucleus/yolk, all bound at one point on the shank, pulled up, cut straight across and fluffed into a sphere. Standard colours orange, pink, chartreuse, peach and "Oregon cheese", usually with a contrasting nucleus. Finished ball roughly half the hook gape wide - it ends just behind the eye and just touches the hook point.

*Wrong:*
- "A single round ball of orange yarn" - the classic Glo Bug is two-tone: a contrasting nucleus or "yolk" spot of a second colour showing on the ball. A plain one-colour egg is a legitimate simpler version, but the named Glo Bug/nuke-egg style has the spot.
- "covering the shank" understates the proportion - the ball is tied at one point and should be about the size of the hook gape, sitting just behind the eye with the hook point clearly emerging below it.

*Missing:*
- The contrasting nucleus/yolk spot.
- The sizing rule from the recipe: the ball ends just back from the eye and just touches the hook point, roughly half the gape in radius.
- That the yarn is cut straight across and fluffed, so the surface is a slightly fuzzy fibrous sphere, not a smooth bead.
- Colour range - pink, chartreuse and peach are as standard as orange.

*Sources:* [1](https://www.lwflies.com/tutorials/egg-patterns/glo-bug) · [2](https://www.flytying.guide/patterns/glo-bug-egg) · [3](https://www.current-works.com/how-to-tie-fly/mcfly-foam-egg-pattern/)
*Confidence:* high

### `elk-hair-caddis`
**Hook:** Standard straight dry-fly hook (Mustad 94833/94838, TMC 100, Daiichi 1100), #6-20 (commonly 12-18). Rides point-DOWN, wing on top of the shank.  
**Recipe:** Al Troth's original, eye to bend: the trimmed butt ends of the elk hair form a squared-off bristly head just behind the eye; the wing of light elk flank hair lies back over the body in a low tent, extending to about the end of the bend; a body of hare's-ear dubbing dyed to match the insect, palmered along its whole length with a dark red / furnace (or ginger) hackle, and counter-ribbed with FINE GOLD WIRE which locks the palmered hackle down; no tail. Troth's own listing: 'Body: Hare's-ear dubbing... Rib: Fine gold wire. Hackle: Dark red or furnace. Wing: Elk flank hair.'

*Wrong:*
- 'brown hackle palmered along a tan dubbed body' — the hackle colour in Troth's own recipe is dark red or furnace (ginger in other listings). 'Brown' is close but the furnace/dark-red variegation is what the original specifies; sources give a range from ginger through brown to furnace.

*Missing:*
- The FINE GOLD WIRE rib, counter-wrapped over the palmered hackle. This is in every authoritative listing of the pattern and is clearly visible in a macro shot — its omission is the most significant gap in this prompt.
- Body material named as hare's-ear dubbing (spiky, guard-hair texture), not just 'tan dubbed body'.
- Wing length — extends to about the end of the hook bend.
- That the elk-hair butts are trimmed square into a bristly flared head, which the prompt describes as 'a trimmed elk-hair butt' but without the flared/squared character.

*Sources:* [1](https://www.flytyer.com/elk-hair-caddis/) · [2](https://en.wikipedia.org/wiki/Elk_Hair_Caddis) · [3](http://www.rockyrivertu.org/troth-elk-hair-caddis-ffi.html)
*Confidence:* high

### `ep-baitfish`
**Hook:** Gamakatsu SC15 or similar SHORT-shank, wide-gap stainless saltwater hook, #6-2/0, point-DOWN. Unweighted — no inverted orientation, and our prompt is correct to say point-down.  
**Recipe:** EP Baitfish / EP Minnow (Enrico Puglisi; Charlie's Fly Box, Fly Life Magazine, Global FlyFisher): Gamakatsu SC15 #6-2/0 (short-shank, wide-gap) with monofilament or GSP thread; successive bunches of EP Fibers tied in and folded back on themselves along the shank, light colour on the belly and a darker colour on the back, with silver and pearl flash layered in between; the whole mass then scissor-trimmed to a baitfish silhouette (anything from a deep sunfish shape to a slim minnow); solid or stick-on 3D eyes glued at the head; permanent-marker detailing and barring; head cement or UV resin. 'More a pattern of tying than a specific pattern.'

*Wrong:*
- "Saltwater hook" is under-specified in a way that matters: EP baitfish are tied on SHORT-shank wide-gap hooks with most of the body extending past the bend. If the model draws a long-shank hook the proportions will be wrong.
- "tied in bunches along the shank" omits the defining technique — each bunch is folded back on itself over the thread, which is what gives the fibre mass its density and its cut edge.
- "white belly, olive back" is a fine colourway but the prompt omits the flash layered between the fibre bunches, which every source includes.

*Missing:*
- Silver and pearl flash layered between the EP fibre bunches
- That the fibre bunches are folded back over themselves
- Permanent-marker barring/detailing on the back
- Body extends well past the hook bend; short-shank wide-gap hook
- Small bead of glue or resin holding the stick-on eyes

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/ep-minnow) · [2](https://flylifemagazine.com/fly-tying-utilize-the-puglisi-ep-fibers-for-more-realistic-baitfish-patterns/) · [3](https://globalflyfisher.com/video/ep-baitfish-0)
*Confidence:* medium

### `flying-ant`
**Hook:** Standard dry-fly hook (Dai-Riki 305, TMC 100) #14-20. Rides point-DOWN.  
**Recipe:** Sources differ by dressing. Common form, eye to bend: small thread head; a smaller front thorax hump of dubbing or foam (BLACK, or cinnamon/rust/orange); a few turns of brown or black hackle at the waist, usually trimmed flat underneath, as the legs; two pale wings - white polypropylene yarn, white Zelon, or light-dun hackle tips - swept BACK flat over the abdomen in a shallow V, about one and a quarter shank lengths; a thin pinched waist; a larger rear abdomen hump to the bend. No tail. The Orvis Cinnamon Flying Ant uses an orange foam cylinder body, white poly yarn wing and brown hackle legs.

*Wrong:*
- "two clear or white wings" - "clear" is not a tying material in any consulted recipe; the wings are white poly yarn, white Zelon/Antron, or light-dun hackle tips. "Clear" will invite a rendered insect wing, not a tied fly.
- "Two-humped ant body with thin waist" with no colour named - standard colourways are black and cinnamon/rust-orange; the prompt leaves it open.

*Missing:*
- The hackle legs at the waist (brown or black, trimmed flat underneath) - present in essentially every published flying-ant dressing
- The colourway (black or cinnamon/rust)
- Wing proportion - swept back in a shallow V, extending roughly to or just past the bend

*Invented:*
- "clear" wings

*Sources:* [1](https://news.orvis.com/fly-fishing/video-tie-cinnamon-flying-ant) · [2](https://flylordsmag.com/how-to-tie-the-cinnamon-flying-ant/) · [3](https://arricks.com/2018/03/how-to-black-and-cinnamon-flying-ant/)
*Confidence:* medium

### `foam-ant`
**Hook:** Standard dry-fly hook (TMC 101) or 3XL curved (TMC 200R) #12-18. Rides point-DOWN.  
**Recipe:** Eye to bend: black thread head; a smaller BLACK foam front hump; a black hackle wound at the waist and trimmed flat top and bottom leaving about three barbs sticking out each side as legs (fine black rubber legs in some dressings); commonly a small white or hi-vis foam tab laminated on top as an indicator; a thin pinched waist; a larger black foam rear hump ending at the bend. Sits flush and low.

*Wrong:*
- "a couple of rubber or hackle legs at the waist" - an either/or the model will mangle, and it understates the count: the standard dressing wraps a black hackle at the waist and trims it top and bottom, leaving about three legs sticking out on EACH side.

*Missing:*
- The small white or hi-vis foam indicator tab laminated on top of the body, which most published foam-ant recipes include
- That the rear hump is the LARGER of the two
- That the legs stand out horizontally at the waist, three per side

*Sources:* [1](https://www.mtfa-springfield.org/resources/fly-tying-recipes-patterns/terrestrials/foam-ant/) · [2](https://news.orvis.com/fly-fishing/video-how-to-tie-tims-favorite-foam-ant)
*Confidence:* medium

### `foam-beetle`
**Hook:** Standard dry-fly hook (TMC 100SP-BL, TMC 100) #10-20. Rides point-DOWN.  
**Recipe:** Eye to bend: a short stub of black foam projecting forward over the eye as the head; a small bright ORANGE foam indicator dot on top at the junction of head and body; a black foam shellback pulled forward over the top of the body and tied down there; three MOOSE HAIR legs sticking out each side at that tie-down point, trimmed just longer than the hook gap; a body of several peacock herls wrapped full from the bend forward under the shellback.

*Wrong:*
- "a few rubber legs out the sides" - the published Craven/Fly Fisherman and Orvis dressings use MOOSE HAIR legs, three to a side, trimmed just longer than the hook gap. Rubber legs appear in some shop variants, so this is a variant not a flat error, but moose hair is the standard.
- "An oval black foam shellback" - correct as far as it goes, but the foam also continues forward as a stub head over the eye, which the prompt does not say.

*Missing:*
- The black foam head stub projecting over the hook eye
- That the orange indicator dot sits at the head/body junction, not just vaguely "on top"
- Leg count and proportion: three per side, trimmed just longer than the hook gap

*Sources:* [1](https://www.flyfisherman.com/editorial/fly-tying-foam-beetle/151931) · [2](https://howtoflyfish.orvis.com/fly-tying-videos/dry-flies/733-foam_beetle) · [3](https://charliesflybox.com/blogs/fly-tying-videos/foam-beetle-fly-tying-video)
*Confidence:* high

### `frenchie`
**Hook:** Barbless jig hook with slotted tungsten bead; rides point-UP (inverted). A non-jig, down-eye beadhead version on a standard nymph hook (e.g. Dai Riki 060, riding point-down) is also published.  
**Recipe:** Lance Egan's Frenchie: Hanak 400 barbless jig hook #12-16, 2.8mm gold slotted tungsten bead, red UTC 70 thread, a few turns of lead wire; from the eye back - bead, then a hot-spot collar of UV pink shrimp Ice Dub directly behind the bead, an abdomen of muskrat-grey ringneck pheasant-tail fibres wrapped over the rear two-thirds and ribbed with small copper wire, and a short tail of coq-de-Leon fibres at the bend.

*Wrong:*
- "The wing/hair and weighted eyes are tied on the SAME side of the shank as the hook point" - the Frenchie has no wing, no hair and no weighted eyes; this Clouser boilerplate will make the image model add dumbbell eyes and a hair wing.
- The orientation paragraph is duplicated verbatim, doubling the weight of the wrong instruction.
- The prompt never actually says which colour the bead is - sources give gold as standard.

*Missing:*
- Red thread, which shows as a red band at the head and sometimes a red tag - a signature of Egan's original.
- The proportion: the pheasant-tail abdomen covers roughly the rear two-thirds of the shank and the pink collar is a narrow band, not a large ball.
- That the tail is short and sparse (roughly half to one shank length) speckled coq-de-Leon.

*Invented:*
- "weighted eyes" and "wing/hair" - not in any Frenchie recipe.

*Sources:* [1](https://flylordsmag.com/how-to-tie-the-frenchie-egans-frenchie/) · [2](https://www.johnkreft.com/fly-patterns/crooked-river-flies/frenchie-nymph/)
*Confidence:* high

### `girdle-bug`
**Hook:** Long-shank streamer/nymph hook, TMC 300 or equivalent (3X-4X long), sizes 4-12, weighted with lead wire. Rides point-DOWN.  
**Recipe:** Girdle Bug, eye to bend: a pair of white round-rubber antennae at the head, a body of black chenille over a lead underbody with three pairs of white round-rubber legs tied in perpendicular at evenly spaced points along the shank, and a forked pair of white rubber tails at the bend. Variegated-chenille variants (olive, coffee/black, yellow/brown) are common regionally, but the original is plain black chenille with white legs.

*Wrong:*
- "pairs of white rubber legs sticking out to the sides" — correct materially, but the count is unstated; published recipes give three pairs of legs along the shank plus the tail and antennae pairs. Unstated, the model may draw two pairs or a dozen.

*Missing:*
- The number and spacing of legs — three pairs tied in perpendicular at evenly spaced points, pinching the chenille into segments.
- The tails and antennae are the same white round rubber as the legs (forked tail at the bend, antennae swept forward past the eye).
- The lead underbody giving a thick, heavy profile on a long-shank hook.
- That the original colourway is plain black chenille with white legs — worth stating so the model does not default to variegated chenille, which would make it a Pat's Rubberlegs.

*Sources:* [1](http://www.rockyrivertu.org/girdle-bug.html) · [2](https://www.intheriffle.com/in-the-riffle-blog/girdle-bug-stonefly) · [3](https://www.jsflyfishing.com/blogs/fly-tying/my-love-affair-with-the-girdle-bug)
*Confidence:* medium

### `green-rockworm`
**Hook:** Curved caddis-larva / scud hook, point-DOWN, materials on top of the shank; the body follows the curve so the fly reads as a C-shaped grub.  
**Recipe:** Green Rock Worm (Rhyacophila caddis larva): curved caddis/scud hook (Firehole 316, TMC 2457/2487) #12-16, lead-free wire underbody, black thread; from the eye back - a contrasting dark brown or black thorax/head with a few fibres picked out as legs, then a fat, distinctly segmented abdomen of bright insect-green or olive fur or Antron yarn, often ribbed with fine gold wire, vinyl rib or thread for segmentation, curving round the bend. No tail. A bead is optional and common but not part of the basic pattern.

*Wrong:*
- Nothing materially wrong, but "a small dark thorax" understates it - sources call the contrasting dark thorax and the fat segmented body "the defining features of the Rock Worm", so it should be explicitly dark brown/black and clearly contrasting.
- "Small bead" is presented as standard; sources state the basic pattern has no bead ("beaded worms are not uncommon" is the qualifier), so it should be flagged as the beadhead variant rather than the definition.

*Missing:*
- The rib - fine gold wire, vinyl rib or thread wraps giving distinct segmentation over the green abdomen.
- Legs - a few dark fibres picked out from the thorax dubbing.
- That the grub shape curves round the hook bend (fat in the middle, tapering at both ends), which is what makes it read as a caddis larva.
- Colour range - bright insect green through olive; sources list both.

*Invented:*
- "latex" body - latex-wrapped caddis larvae exist as a separate style, but none of the Rock Worm recipes checked list latex; fur/Antron/dubbing is standard. Offering the model a choice invites the wrong one.

*Sources:* [1](https://www.jsflyfishing.com/blogs/fly-tying/variations-on-a-rock-worm) · [2](https://news.orvis.com/fly-fishing/video-how-to-tie-the-green-caddis-larva) · [3](https://fishflywater.com/flies/green-rock-worm)
*Confidence:* medium

### `green-weenie`
**Hook:** 1XL-2XL heavy nymph hook (TMC 5262) or curved scud/jig hook, #10-14, POINT DOWN.  
**Recipe:** Green Weenie (Ken Igo and Russ Mowry, Loyalhanna Creek, PA; also attributed to George Harvey): a 1XL-2XL heavy nymph or curved scud hook #10-14 with chartreuse thread, the whole shank wrapped with fluorescent chartreuse Ultra Chenille in touching wraps to make a fat, worm-like body; most published versions simply carry the chenille past the bend as a short blunt tag, while many commercial and older versions instead double it into a small loop at the bend; a gold, silver or black-nickel bead at the head is a common option.

*Wrong:*
- "Standard hook" — the published recipes use a heavy 2XL nymph hook or a curved scud/jig hook, which gives the fly its fatter, slightly curved inchworm profile
- "a small loop of chenille at the bend as a tail" is a legitimate variant but is not what most written recipes specify; the widely published form runs the same chenille past the bend as a short blunt tag (the Dark Skies recipe explicitly ties it "without a tail loop")

*Missing:*
- chartreuse thread and a small chartreuse thread head
- the body should be fat and cigar/worm-shaped, filling the whole shank in touching wraps
- the common bead-head option (gold, silver or black nickel)

*Sources:* [1](https://darkskiesflyfishing.com/how-to-tie-the-green-weenie/) · [2](https://www.jsflyfishing.com/pages/flybrary/green-weenie) · [3](https://www.tridentflyfishing.com/blogs/all/how-to-tie-green-weenie-fly)
*Confidence:* medium

### `gummy-minnow`
**Hook:** TMC 811S short-shank stainless saltwater hook, #6-1/0, point-DOWN. Unweighted, so no inverted orientation; our prompt correctly says point-down.  
**Recipe:** Gummy Minnow (silicone-sheet pattern popularised with Blane Chocklett's Sili Skin; In The Riffle, Flylords, El Gallo): TMC 811S #6-1/0 with white GSP thread; body built from layers of soft self-adhesive silicone sheet — pearlescent Thin Crystal Skin or Sili Skin for the body, a moss-green or olive strip laid over the back, and a clear outer layer over the whole thing — folded around the shank, sealed to itself and then trimmed with scissors to a minnow silhouette with a forked tail. Super-pearl 3/16-inch stick-on eyes. Head cement to finish. Unweighted.

*Wrong:*
- "a small eye" — the Gummy Minnow's eye is conspicuously LARGE: 3/16-inch super-pearl stick-on eyes, disproportionately big on the head. 'Small eye' produces the wrong silhouette.
- "A soft translucent silicone sheet body" with no back colour — the standard fly has a moss-green or olive strip over the back against a pearl body, which is the whole point of the layered construction. Without it the model draws a plain clear fish.
- "silver flash inside" is loose; what is inside is a pearlescent Crystal Skin / Sili Skin layer rather than loose flash strands.
- The prompt omits the shape: the body is trimmed to a minnow outline with a FORKED TAIL extending past the hook bend.

*Missing:*
- Moss-green or olive back strip over a pearl body
- Clear outer Sili Skin layer sealing the whole body
- Large 3/16-inch super-pearl stick-on 3D eyes
- Scissor-trimmed minnow outline with a forked tail past the bend
- That the silicone is folded around the shank and sealed to itself

*Invented:*
- "a small eye"

*Sources:* [1](https://flylordsmag.com/how-to-tie-the-gummy-minnow/) · [2](https://www.intheriffle.com/in-the-riffle-blog/gummy-minnow) · [3](https://elgalloflyfishing.com/tie-the-perfect-gummy-minnow-for-roosterfish/)
*Confidence:* medium

### `gurgler`
**Hook:** Stainless straight-eye saltwater hook (TMC 811S or Mustad 37187 stinger), #1/0-6, ridden POINT DOWN with materials on top of the shank.  
**Recipe:** Gartside Gurgler (Jack Gartside, 1988): on a stainless straight-eye saltwater hook, a white bucktail tail about two shank lengths long with 3-4 strands of pearl Krystal Flash; a strip of white foam cut slightly narrower than the gap is tied in about three eye-lengths behind the hook eye and bound back to the bend; pearl tinsel chenille is wrapped forward to the head with a grizzly neck hackle palmered over it in open spirals; the foam is then pulled forward over the back, cupped slightly around the body, tied down behind the eye and the excess trimmed square so a short tab of foam projects forward over the hook eye as the gurgling lip.

*Wrong:*
- "folded up at the head to form a lip" — the lip is not an upward fold at the head; the foam strip runs from the head back to the bend as a shellback, is pulled FORWARD over the body and tied down behind the eye, and the trimmed tag projects FORWARD over the hook eye (Orvis: "upturned and extended lip", Charlie's Fly Box: "trim foam front end straight across to create the characteristic gurgling lip")
- "sparse hackle" — the recipe specifies a grizzly neck hackle palmered forward over the body in an open spiral, not a sparse indeterminate hackle

*Missing:*
- pearl tinsel chenille body wrapped under the palmered hackle
- grizzly hackle palmered the length of the body
- pearl Krystal Flash at the base of the bucktail tail
- tail length — about two shank lengths beyond the bend

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/gartside-s-gurgler) · [2](https://news.orvis.com/fly-fishing/Tying-a-Simple-Gartside-Gurgler) · [3](http://www.jackgartside.com/fly_detail.php?recordID=250&tab=1)
*Confidence:* high

### `hares-ear`
**Hook:** 1X to 2X-long straight-shank nymph hook, TMC 5262 or 3761, sizes 8-18. Rides point-DOWN.  
**Recipe:** Gold Ribbed Hare's Ear, eye to bend: a thread head, a wing case of mottled turkey tail over a shaggy thorax of natural hare's-mask dubbing picked out so the guard hairs stick out as legs, a tapered hare's-mask abdomen ribbed with fine gold wire or gold oval tinsel, and a short tail of hare's-mask guard hairs (or India hen back / brown partridge fibres). The "gold" in the name is the rib — the classic dressing has no bead.

*Wrong:*
- "A gold bead head" is stated as though it were part of the pattern — the Gold Ribbed Hare's Ear is classically beadless (Flylords/TMC 5262 recipe lists no bead and notes split shot is needed without one). A bead-head version is a common modern variant, so the prompt should mark it optional rather than asserting it.
- "a buggy thick dubbed thorax" is right but the prompt never says the thorax is PICKED OUT — that raked, spiky guard-hair halo is the signature of the fly and doubles as its legs.

*Missing:*
- The thorax is deliberately picked out with a dubbing brush so guard hairs stand out to the sides as legs.
- The rib may be fine gold wire OR gold oval/flat tinsel — sources list both; the prompt commits to tinsel only.
- Tail material range — hare's-mask guard hairs, India hen back fibres, brown partridge or wood duck, tied short (about half the shank).
- The abdomen should be noticeably slimmer and smoother than the thorax, giving a clear taper.

*Sources:* [1](https://flylordsmag.com/how-to-tie-gold-ribbed-hares-ear/) · [2](http://www.rockyrivertu.org/gold-ribbed-hares-ear.html) · [3](https://www.intheriffle.com/in-the-riffle-blog/gold-ribbed-hares-ear-tied-by-charlie-craven)
*Confidence:* high

### `hollow-fleye`
**Hook:** Stainless saltwater hook, commonly SHORT-shank wide-gap, #6-6/0; long-shank only for the biggest versions. Point-DOWN, unweighted.  
**Recipe:** Hollow Fleye (Bob Popovics; Fly Fisherman, Global FlyFisher, The Mission): stainless saltwater hooks #6-6/0; bunches of bucktail spun around the shank tied in pointing FORWARD over the hook eye, then pushed rearward by thread wraps taken only in FRONT of the tie-in point so the hair flares and stands hollow off the shank (this is what distinguishes it from a Thunder Creek). Short-shank hooks take about three bunches, each roughly two thirds the length of the previous; long-shank hooks five or more, each about three quarters. Optional flash at intervals; tab prismatic eyes (about 1/4 inch) or jungle-cock nails; thread head with quick-dry cement; the finished fly is wetted and shaped into a tapered fusiform profile. No separate tail — the exposed bucktail butts form it. Single colours, or contrasting top and bottom.

*Wrong:*
- "tied reverse (pointing forward then folded back)" — it is not folded. The bucktail is tied in pointing forward and then pushed back by thread wraps built only in front of the tie-in point; nothing is folded over. 'Folded back' will make the model draw a Thunder Creek-style bullet head instead of the airy hollow flare.
- "Long saltwater hook" — the standard Hollow Fleye is tied on a short-shank hook; the long shank is the exception for 10-inch flies. At the stated sizes 1/0-4/0 a short-shank wide-gap hook is correct.
- "big eyes" is unspecific; sources give tab prismatic stick-on eyes about 1/4 inch, or jungle-cock nails.
- The prompt does not say the bunches shorten toward the front, which is what produces the tapered profile.

*Missing:*
- Each bunch about two thirds to three quarters the length of the one behind it, rearmost longest
- Bucktail is spun ALL THE WAY AROUND the shank, not just on top
- The bunch butts form the tail — there is no separate tail material
- Thread head sealed with cement; the fly is wetted and shaped into a fusiform taper
- Eye type: tab prismatic stick-on or jungle cock

*Invented:*
- "folded back"
- "Long saltwater hook"

*Sources:* [1](https://www.flyfisherman.com/editorial/fly-tying-hollow-fleyes/151795) · [2](https://globalflyfisher.com/video/hidden-bulkhead-hollow-fleye) · [3](https://themissionflymag.com/bulkhead-hollow-fleye-step-by-step/)
*Confidence:* high

### `kaufmann-stone`
**Hook:** Heavy 3X-6X long nymph/stonefly hook (TMC 300, TMC 5263, or a curved 2X-3X long nymph hook), point-DOWN, materials on top of the shank.  
**Recipe:** Randall Kaufmann's Stone: 3X-6X long nymph hook (TMC 5263/300) with a heavy lead-wire underbody; from the eye back - two goose-biot antennae splayed forward, a small dubbed head, three stacked turkey-tail wing pads (trimmed to gape width, V-notched, cemented) over a thorax of coarse Angora-goat/hare/seal blend with guard hairs picked out as legs, then an abdomen of the same coarse dubbing segmented with clear or coloured V-rib / Swannundaze / D-Rib, ending in two splayed goose-biot tails at the bend. Standard colourways are black, brown and golden-brown (Kaufmann Black Stone, Golden Stone).

*Wrong:*
- "Long-shank nymph hook" is under-specified - the published recipes call for a heavy 3X-6X long stonefly hook with a fat lead-wire underbody, which gives the fly its thick, humped profile; a plain long-shank hook with no bulk will render too slim.

*Missing:*
- The rib - every source lists a vinyl-type rib (V-Rib, Swannundaze or medium brown D-Rib) over the abdomen; our prompt only says "segmented abdomen", which is a description of the effect rather than the material that shows in a photograph.
- Legs - coarse guard hairs picked out from the thorax dubbing on both sides between the wing pads.
- A small dubbed head in front of the forward wing pad.
- Lead-wire underbody / the fat two-thirds-abdomen, one-third-thorax proportion (body carried to roughly 60% of the shank before the wing pads and head).
- Colourway - the three standard blends are black, brown and golden-brown; our prompt only says "dark".

*Sources:* [1](https://midcurrent.com/v2/kaufmanns-stone-fly/) · [2](https://www.bcoutdoorsmagazine.com/fly-tying-the-kaufmann-stone/) · [3](https://www.johnkreft.com/kaufmanns-stonefly-nymph/)
*Confidence:* high

### `klinkhammer`
**Hook:** A dedicated Klinkhamår hook — Daiichi 1160 or 1167, Partridge 15BN — a wide-gape, deeply curved (continuous-bend) hook with a straight/ring eye, sizes 8-20. Rides point-DOWN.  
**Recipe:** Hans van Klinken's Klinkhamår Special, eye to bend: a thorax of three strands of peacock herl carrying an upright white poly-yarn post with a parachute hackle (blue dun, dark dun, light dun or chestnut) wound horizontally around the base of the post, then a very slim tapered poly-dubbing abdomen that continues well down around the curve of the bend; there is no tail and no rib.

*Wrong:*
- "The rear half of the body curves down below the surface" — this describes the fly in water, not the fly itself; on a white studio background there is no surface. The recipe describes an abdomen wrapped down and around the hook's curve, and the prompt as written invites the image model to draw a waterline.
- "Curved emerger hook" understates the hook: the Klinkhamår hook is a specific wide-gape continuous-curve hook with a STRAIGHT (ring) eye, not a standard down-eye curved emerger hook.

*Missing:*
- Explicit "no tail" — van Klinken states "A tail can be helpful but isn't really necessary"; the standard dressing has none, and an image model will add one unless told not to.
- The thorax is specifically three strands of peacock herl built as a distinct fat ball at the front, in contrast to the slim abdomen.
- Hackle colour — blue dun, dark dun, light dun or chestnut, wound 5-8 turns flat around the post base.
- The abdomen must be conspicuously slim and tapered ("the slimmer the body the more successful the fly") and must extend well down the bend; standard body colours are tan, grey, olive or brown poly dubbing.
- The post is a vertical white poly-yarn column standing clear above the thorax, trimmed to roughly the hook-gape-to-shank height.

*Invented:*
- "below the surface" — a water/surface reference that nothing in the recipe supports for a product photograph.

*Sources:* [1](https://thefeatherbender.com/klinkhamer-fly-special/) · [2](https://www.tomsutcliffe.co.za/fly-fishing/fly-tying/item/248-hans-van-klinken-on-his-klinkhamer-special.html) · [3](https://news.orvis.com/fly-fishing/classic-video-tie-klinkhamer-special)
*Confidence:* high

### `lefty-deceiver`
**Hook:** TMC 811S standard-length stainless saltwater hook, #8-3/0, point-DOWN. Unweighted, so no inverted orientation and no weighted-eye language belongs here — our prompt correctly says point-down.  
**Recipe:** Lefty's Deceiver (Lefty Kreh; Charlie's Fly Box, Orvis, MidCurrent): TMC 811S #8-3/0; tail of four (some sources six to eight) white saddle hackles tied in opposing pairs at the BEND, two to three times the hook-shank length; pearl Krystal Flash along the sides; a body of pearl flat braid or flat silver/mylar tinsel wrapped over the shank; a white bucktail collar applied all the way AROUND the shank behind the head, lying back to about halfway along the tail; a second, darker bucktail collar (olive, green, blue or purple) over the top and sides only; six or seven peacock herls laid flat over the top as a topping; painted red eye with black pupil. Unweighted. Classic colourways all-white, and white with a green/blue back.

*Wrong:*
- "Four to six long white saddle hackle feathers" — Charlie's Fly Box and Orvis specify four, tied in two opposing pairs; other sources allow six to eight. The important missing detail is that they are paired back-to-back so the tail splays, and that they are two to three times the shank length.
- "a few strands of silver flash" — sources specify pearl Krystal Flash, not silver.
- "Long saltwater hook" — TMC 811S is a standard-length saltwater hook, not a long-shank. A long shank would foul the tail, which is the opposite of what the Deceiver was designed to avoid.
- The prompt describes an all-white fly with no back colour and no topping. The all-white Deceiver is legitimate, but the pattern as published has a darker bucktail back and a peacock-herl topping, and omitting them will reliably produce a fly missing its most recognisable feature.

*Missing:*
- Body: pearl flat braid or flat silver/mylar tinsel wrapped over the shank
- Second, darker bucktail collar over the top and sides (olive, green, blue or purple)
- Topping: six or seven peacock herls laid flat along the back
- Tail hackles tied in opposing pairs so they splay, two to three times shank length
- Eye colour: red with a black pupil
- That the bucktail collar is spun all the way around the shank, not only on top

*Invented:*
- "silver flash" in place of pearl Krystal Flash
- "Long saltwater hook"

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/deceiver) · [2](https://news.orvis.com/fly-fishing/Tying-Leftys-Deceiver) · [3](https://midcurrent.com/v2/how-to-tie-leftys-deceiver/) · [4](https://en.wikipedia.org/wiki/Lefty%27s_Deceiver)
*Confidence:* high

### `march-brown-dry`
**Hook:** Standard straight dry-fly hook (Mustad 94840), #10-14. Rides point-DOWN, wings on top of the shank.  
**Recipe:** The American March Brown (Art Flick / Catskill), eye to bend: bare thread head; two upright divided wings of BARRED LEMON WOOD-DUCK FLANK; a mixed collar of brown (dark ginger) and grizzly hackle wound both in front of and behind the wings; a slim fawn/tan body of red-fox belly fur dubbing, ribbed with brown thread in Flick's original; a tail of reddish-brown or dark ginger hackle fibres. Note that sources disagree by region: the British/European March Brown (Rhithrogena germanica) is an entirely different dressing — hare's-ear body ribbed yellow, partridge or hen-pheasant wing, brown partridge hackle.

*Wrong:*
- 'upright mottled wings' is too vague and is the fly's key identifier. The American recipe specifies barred lemon wood-duck flank fibres, upright and divided into two wings. 'Mottled wings' invites an image model to draw solid mottled turkey-quill slip wings, which is a different fly.
- 'brown and grizzly hackle collar' is the right mix but omits that in Catskill style the hackle is wound both in front of and behind the wings, not as a single collar in front.

*Missing:*
- The brown-thread rib over the body (in Flick's original; several modern listings drop it, so it is a range).
- Body material named — fawn/tan red-fox belly fur; 'tan dubbed body' is close but unspecific.
- Tail colour — reddish-brown / dark ginger hackle fibres.
- The bare thread-covered shank behind the eye (Catskill signature).
- Wing height equal to the shank, tail about one shank length.
- No mention that the two wings are DIVIDED (split into a V seen from the front).

*Sources:* [1](https://traderscreek.com/american-march-brown-dry-fly-fly-recipe/) · [2](https://news.orvis.com/fly-fishing/video-how-to-tie-a-catskills-style-march-brown-dry-fly) · [3](https://www.johnkreft.com/art-flicks-march-brown-dry-fly/)
*Confidence:* medium

### `midge-adult`
**Hook:** Straight-eye standard dry-fly hook (Dai-Riki 310, TMC 101, Varivas 2200BL) #20-26. Rides point-DOWN.  
**Recipe:** This is a pattern class rather than one dressing, so sources differ. The common form (e.g. Matt's Midge, CDC Midge): eye to bend - tiny thread head; two to four sparse turns of grizzly hackle as a collar, often trimmed flat underneath; a short clump of WHITE CDC or white Zelon/Antron set just behind the eye, angled up and back over the body, roughly one shank length, primarily as a visibility wing; a slim black or grey thread (or twisted CDC) body tapering to the bend, often finely segmented. No tail.

*Wrong:*
- "a tiny CDC or hackle-tip wing lying back" - the either/or will be mangled; published dressings use a short clump of white CDC or white Zelon/Antron, set up-and-back as a visibility wing, not paired hackle tips lying flat.
- "Slim thread body" with no colour - the standard bodies are black or grey; leaving it uncoloured lets the model pick anything.
- "sparse hackle" with no colour - grizzly is the standard in Matt's Midge and most published adult-midge dressings.

*Missing:*
- Hackle colour (grizzly) and the fact that it is a short collar of only 2-4 turns, commonly trimmed flat on the bottom so the fly sits in the film
- Body colour (black or grey) and the fine segmentation

*Sources:* [1](https://news.orvis.com/fly-fishing/video-tie-matts-midge) · [2](https://www.flies-stepbystep.com/en/flies/dry-flies/cdc-midge-dry-fly/)
*Confidence:* medium

### `muddler-minnow`
**Hook:** 3X-long down-eye streamer hook, point-DOWN, wing and head on top of the shank.  
**Recipe:** Muddler Minnow (Don Gapen, 1936, Nipigon River): 3X-long streamer hook #2-10; from the eye back - a spun natural deer-hair head trimmed to a broad flat-bottomed bullet/cone with the rear hairs left long as a flared collar, then paired mottled brown turkey-quill slips as the wing lying over an UNDERWING of white-tipped grey/fox squirrel tail, over a body of flat gold tinsel (often ribbed with oval gold tinsel), and a short mottled turkey-quill section as the tail at the bend.

*Wrong:*
- The prompt does not mention the underwing at all, so "a mottled turkey wing lying over a flat gold tinsel body" describes a two-layer fly where the recipe has three layers (turkey over squirrel over tinsel). The pale squirrel underwing is visible in profile, so its absence changes the picture.
- "mottled turkey tail" is correct as a material but the prompt should make clear it is a short quill SECTION at the bend, not a bunch of fibres - otherwise the model draws a hackle-fibre tail.

*Missing:*
- The underwing of white-tipped grey or fox squirrel tail between the tinsel body and the turkey wing.
- The oval gold tinsel rib listed in many standard dressings over the flat gold tinsel body.
- The deer-hair head shape: a broad trimmed bullet or cone, flat on the bottom, with the rear hairs left untrimmed as a swept-back flared collar over the front of the wing.
- Sizes and the head's dominance - the head is bulky and takes up roughly the front quarter to third of the shank.

*Sources:* [1](https://flytyingarchive.com/muddler-minnow-don-gapen-trout-streamer-sculpin-muddler/) · [2](https://globalflyfisher.com/patterns-tie-better/gapens-muddler-minnow) · [3](https://en.wikipedia.org/wiki/Muddler_Minnow)
*Confidence:* high

### `parachute-adams`
**Hook:** Standard straight-eye dry-fly hook (Daiichi 1100/1180, TMC 100), #12-22. Rides point-DOWN, post and materials on top of the shank.  
**Recipe:** Eye to bend: bare thread head, then a single upright post of white calf body hair or white poly yarn with one grizzly and one brown hackle wound horizontally in flat turns around the post base; slim gray (Adams gray) muskrat or Superfine dubbed body over the rear two-thirds of the shank; tail of mixed grizzly and brown hackle fibres, or moose body hair in the RiverKeeper/Kreft version, about one shank length. Kreft lists 'Post: Poly / Tail: Moose body hair / Body: Superfine gray dubbing / Hackle: Brown and grizzly'; Orvis-style commercial versions often use white calf body hair for the post and grizzly hackle alone.

*Wrong:*
- Tail material is stated as a certainty: 'a tail of mixed grizzly and brown hackle fibers'. Sources split — the RiverKeeper/Kreft pattern sheet says moose body hair, the traditional Adams tail is mixed brown and grizzly hackle fibres. Both are standard; the prompt should allow either rather than assert one.
- 'a white calf-hair post' is asserted where sources also commonly specify white poly yarn or a white turkey flat — a range, not a single answer.

*Missing:*
- The bare thread head behind the eye (a visible feature of a well-tied parachute).
- Post height — roughly one hook-shank tall.
- Tail length — about one shank length.
- An explicit statement that there is NO collar hackle standing around the shank; all hackle lies horizontal around the post. Without this an image model frequently adds a standard dry-fly collar as well.

*Sources:* [1](https://www.johnkreft.com/mayfly-fly-patterns/parachute-adams/) · [2](https://en.wikipedia.org/wiki/Adams_(dry_fly)) · [3](https://www.flytyer.com/tie-perfect-adams/2/)
*Confidence:* high

### `parachute-ant`
**Hook:** Standard dry-fly hook (TMC 102Y, TMC 100) #14-20. Rides point-DOWN.  
**Recipe:** Eye to bend: small black thread head; a small BLACK dubbed thorax hump at the front; a white parachute post standing at the waist (roughly 60-80% of the shank forward) with four to five turns of GRIZZLY hackle wound horizontally around its base, barbs about one to one and a half hook gaps; a bare pinched thread waist; a larger BLACK dubbed abdomen hump running from the waist back to the bend. No tail; the horizontal hackle barbs are the legs. Black is the standard colour, cinnamon/rust is the common alternative.

*Wrong:*
- "a small white parachute post with a few turns of hackle on the front hump" - the post is normally set at the WAIST between the two humps (around 60-80% of the shank), not on top of the front hump, and it takes four to five full horizontal turns of hackle, not "a few".
- "Two round dubbed humps" with no colour named - the prompt never says the ant is BLACK, so the image model is free to render any colour.

*Missing:*
- The colour: black (standard) or cinnamon/rust
- The hackle colour: grizzly
- That the hackle barbs ARE the legs - there are no separately tied legs, and the fly rides flush in the film

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/parachute-ant) · [2](https://news.orvis.com/fly-fishing/Tying-the-Parachute-Ant) · [3](https://troutbitten.com/2016/08/24/the-perfect-parachute-ant/)
*Confidence:* high

### `pats-rubber-legs`
**Hook:** 3X-long nymph hook, straight or slightly curved — Daiichi 1720, TMC 5263 or TMC 200R — sizes 4-12, weighted with lead wire. Rides point-DOWN.  
**Recipe:** Pat's Rubberlegs (Jimmy Legs), eye to bend: a pair of rubber antennae at the head, a body of medium variegated chenille (black/coffee, black/brown, brown/yellow or olive/brown) over a lead underbody, with three pairs of rubber legs (Spanflex, Superfloss or Sili Legs) tied in perpendicular at evenly spaced points along the shank, and a pair of short rubber tails at the bend. No rib, no wing case, no bead.

*Wrong:*
- The prompt never states the leg colour. Published recipes specify black or brown rubber/Spanflex to match the chenille; left blank, an image model is very likely to draw the white rubber legs of a Girdle Bug, making two flies in this batch look identical.
- "six long rubber legs sticking out to the sides along the body" is numerically right but does not say they are three PAIRS tied in perpendicular at evenly spaced points — which is what produces the segmented, banded body.

*Missing:*
- Leg, tail and antennae colour (black or brown, matching the chenille) and material (Spanflex, Superfloss, Sili Legs, Lifeflex).
- The legs are tied in as single strands crossed over the shank at three points, which pinches the chenille and creates the visible body segmentation.
- The lead underbody, which gives the fly its heavy, thick profile.
- Hook is 3X-long and large (size 4-10); the tails are short and splayed, the antennae longer and forward-swept.

*Sources:* [1](https://www.jsflyfishing.com/pages/flybrary/pats-rubber-legs) · [2](https://www.johnkreft.com/stonefly-fly-patterns/pats-rubberlegs/) · [3](https://howtoflyfish.orvis.com/fly-tying-videos/nymph-flies/892-pats_rubber_legs) · [4](https://catalog.theflyshop.com/products/pats-rubberlegs-jimmy-legs)
*Confidence:* high

### `pheasant-tail`
**Hook:** Standard to 2X-long straight-shank nymph hook — TMC 3761 or 5262, Daiichi 730 or 1560, sizes 12-22. Minimalist Sawyer-style versions are sometimes tied on a curved scud hook (e.g. TMC 2499SPBL), but the classic peacock-thorax dressing is a straight-shank fly. Rides point-DOWN.  
**Recipe:** The American (Al Troth-style) Pheasant Tail Nymph, eye to bend: a brown thread head, a wing case of dark pheasant-tail fibres pulled over a peacock-herl thorax with the fibre tips folded back down each side as legs, a slim abdomen wound from pheasant-tail fibres and counter-ribbed with fine copper wire, and three to five pheasant-tail fibre tips as the tail. Sawyer's original English version is more minimal — copper wire in place of thread, a pheasant-tail thorax hump, and no legs, no peacock, no wing case.

*Wrong:*
- "Curved nymph hook" — the standard Pheasant Tail Nymph as published by Orvis and most shops is tied on a straight-shank standard or 2X-long nymph hook. Curved-hook PTs exist but are the minimalist Sawyer-style tie without the peacock thorax and legs the rest of this prompt describes, so the hook and the dressing contradict each other.

*Missing:*
- The copper wire is COUNTER-wrapped (opposite direction to the pheasant-tail fibres) over the abdomen only, not over the thorax — it reinforces the fibres and gives the tight segmented look.
- The legs are the tips of the wing-case fibres folded back and splayed down each side, not a separate material.
- Tail proportion — three to five pheasant-tail fibre tips, roughly half to three quarters of the shank.
- Colour: the whole fly reads as a warm reddish-brown with a green-bronze iridescent peacock thorax.

*Sources:* [1](https://howtoflyfish.orvis.com/fly-tying-videos/nymph-flies/692-american_pheasant_tail_nymph) · [2](https://news.orvis.com/fly-fishing/video-how-to-tie-the-pheasant-tail-nymph) · [3](https://www.johnkreft.com/frank-sawyers-pheasant-tail-nymph/) · [4](https://www.lwflies.com/tutorials/nymphs/beadhead-pheasant-tail-nymph)
*Confidence:* high

### `pmd-comparadun`
**Hook:** Standard straight dry-fly hook (TMC 100, Partridge SLD), #14-18. Rides point-DOWN, wing on top of the shank.  
**Recipe:** Same architecture as the BWO Comparadun with PMD colours. Eye to bend: thread head; upright wing of natural light/tan coastal deer hair (or bleached deer) flared into a flat 180-degree semicircle over the top of the shank, wing length equal to the hook; no hackle; slim pale yellow to pale yellowish-olive Superfine dubbed body; two widely split pale-dun Microfibett tails about 1.5x hook length.

*Wrong:*
- 'Deer-hair wing fanned 180 degrees upright over the thorax' — same wording problem as the BWO: the wing sits about a third back from the eye and fans side to side across the top of the shank, it does not lie over the thorax.

*Missing:*
- The prompt does not use the 'From the eye back:' construction the rest of the house style uses, so there is no material order for the image model to follow.
- Wing colour — natural light tan / bleached coastal deer hair.
- Wing length equal to hook length.
- Tails must be split WIDELY into outriggers, pale dun Microfibetts, about 1.5x hook length.
- 'no tail' is not an issue here but the total absence of hackle should be stated as 'no hackle anywhere'.

*Sources:* [1](https://www.lwflies.com/tutorials/dry-flies/bwo-comparadun) · [2](https://news.orvis.com/fly-fishing/video-how-to-tie-a-sulphur-comparadun) · [3](https://charliesflybox.com/blogs/step-by-step-tutorials/sparkle-dun)
*Confidence:* medium

### `prince-nymph`
**Hook:** 2X-long, heavy (2X-heavy) straight-shank nymph hook, sizes 4-18. Rides point-DOWN.  
**Recipe:** Doug Prince's Prince Nymph (originally the Brown Forked Tail), eye to bend: an optional gold bead, a brown hen-hackle collar swept back, two white goose biots tied flat on top in a splayed V reaching back over the body (concave side down), a peacock-herl body counter-ribbed with gold wire or gold oval tinsel over a lead underbody, and two brown or black goose biots split in a forked V as the tail.

*Wrong:*
- "Standard nymph hook" — the published recipe calls for a 2X-long heavy nymph hook; a standard-length hook gives a stubbier fly than the pattern.
- "two brown biot tails forked" — correct but narrow: sources list brown OR black goose biots for the tail. Worth stating the range.
- "Gold bead head" is fine for the modern beadhead version but the original Prince Nymph is beadless with a black thread head; the prompt asserts the bead as standard.

*Missing:*
- The rib is COUNTER-wrapped gold wire or gold oval tinsel over the peacock herl, which is what keeps the herl from breaking and gives the visible gold spiral.
- The white biot wings are tied concave side down, splayed into a V, and reach back to roughly the hook bend — the prompt says V but not the length or the concave-down orientation.
- The hen-hackle collar is wound behind the bead and stroked back so the fibres sweep over the body.
- A lead underbody gives the body its slight bulge (not visible, but it explains the profile).

*Sources:* [1](https://en.wikipedia.org/wiki/Prince_Nymph) · [2](https://globalflyfisher.com/patterns/prince-nymphs) · [3](https://www.johnkreft.com/mayfly-fly-patterns/prince-nymph/)
*Confidence:* high

### `quill-gordon-dry`
**Hook:** Standard dry-fly hook, #12-16, POINT DOWN, materials on top of the shank.  
**Recipe:** Quill Gordon (Theodore Gordon, Catskill style): standard dry-fly hook #12-16, black thread; wings of wood-duck flank fibres set UPRIGHT AND DIVIDED well back from the hook eye, leaving the classic long bare Catskill thread head; a dark blue dun hackle collar behind the wings; a slender, lacquered stripped-peacock-quill body wound with visible dark/light segmentation (some recipes rib it with fine gold wire for durability); tail of stiff dark dun hackle fibres.

*Wrong:*
- "upright wood-duck wings" — the recipe specifies wings upright AND DIVIDED (two separate splayed wing clumps); an undivided single clump is a different fly
- "dun hackle collar" — the standard shade is DARK BLUE DUN, and "stiff tails" should likewise be dark dun hackle fibres

*Missing:*
- wings set well back from the hook eye with the long bare Catskill thread head in front of them
- the tail specified as dark dun hackle fibres
- optional fine gold wire rib over the fragile quill body

*Sources:* [1](https://flytyinghub.com/fly-tying/recipes/quill-gordon) · [2](https://www.uky.edu/~agrdanny/flyfish/ljdecuir/smpatrns.htm) · [3](https://news.orvis.com/fly-fishing/video-how-to-tie-a-quill-gordon-dry-fly)
*Confidence:* high

### `royal-wulff`
**Hook:** Standard dry-fly hook (TMC 100 / 100SP-BL) #10-20. Rides point-DOWN.  
**Recipe:** Eye to bend: black thread head; two upright, divided white CALF BODY HAIR wings set about one third back from the eye, roughly one shank length tall; a coachman-brown hackle collar wound both in front of and behind the wings; body of peacock herl at the front, a red floss band in the middle, peacock herl butt at the rear; tail of dark/natural MOOSE BODY HAIR about one shank length.

*Wrong:*
- "a brown bucktail tail" - the published Royal Wulff tail is dark or natural MOOSE BODY HAIR (Charlie's Fly Box: "Dark Moose Hair"; Orvis: "natural moose body hair"). Bucktail is not the standard dressing; some older Wulff variants use elk or bucktail, but not the Royal Wulff as published.
- "white calf-hair wings" - correct material family but the recipes specify calf BODY hair (softer, cleaner stacking) rather than calf tail.

*Missing:*
- That the brown hackle is wound both in FRONT of and BEHIND the upright wings, not just as a single collar
- That the body is three distinct bands in order: peacock herl butt, red floss centre, peacock herl front
- Proportions: wings about one shank length tall and divided into a V, tail about one shank length

*Invented:*
- Bucktail as the tail material - no consulted source lists it for the Royal Wulff

*Sources:* [1](https://charliesflybox.com/blogs/fly-tying-videos/royal-wulff-fly-tying-video) · [2](https://howtoflyfish.orvis.com/fly-tying-videos/dry-flies/711-royal_wulff) · [3](https://news.orvis.com/fly-fishing/Tying-the-Royal-Wulff)
*Confidence:* high

### `rs2`
**Hook:** Straight-eye standard dry/nymph hook (TMC 101) #16-24. Rides point-DOWN.  
**Recipe:** Rim Chung's RS2, eye to bend: tiny head; a short sparse upright clump of wing at the thorax, trimmed square at an angle - the ORIGINAL uses dark dun webby saddle-hackle fluff, while the widely sold "sparkle wing" version uses white or light-grey Antron/Zelon and another common variant uses a white CDC puff; a slightly thicker grey beaver or muskrat dubbed thorax; a slim tapered grey dubbed abdomen with fine segmentation; and two dark-dun Microfibett tails about one shank length, split widely (60-70 degrees). Standard colour grey; olive, black and brown also standard.

*Wrong:*
- "a short stub of white Antron or CDC" - correct for the common commercial Sparkle Wing RS2, but the ORIGINAL Rim Chung wing is dark dun webby saddle-hackle fluff. Sources genuinely differ; the honest range is dark dun hackle web (original) through white/light-grey Antron or white CDC (sparkle-wing and CDC variants). The prompt should pick one and say which.
- "Slim gray dubbed body" - correct colour, but the dubbing is specifically beaver or muskrat fur, tightly twisted to give visible segmentation and a thorax noticeably thicker than the abdomen; the prompt implies a uniform slim body.

*Missing:*
- Tail proportion and splay: tails one full shank length, split 60-70 degrees apart
- The thorax being distinctly thicker than the abdomen
- The wing being trimmed square/at an angle rather than a rounded tuft

*Sources:* [1](https://oneflyfisherman.com/rim-chung-tying-the-rs2-fly/) · [2](https://thenorthernangler.com/blogs/fly-tying-tutorials/rs2-fly-tying-tutorial) · [3](https://www.flytyer.com/the-rs2-and-its-many-variations/)
*Confidence:* medium

### `rusty-spinner`
**Hook:** Standard straight dry-fly hook (Partridge SLD, TMC 100), #12-20. Rides point-DOWN, wings on top of / level with the shank.  
**Recipe:** Eye to bend: small thread head; wings of LIGHT DUN (sometimes white) poly yarn tied flat and spent, straight out to each side perpendicular to the shank; a slightly fuller rusty/cinnamon-brown dubbed thorax; a slim rusty-brown dubbed or turkey-biot abdomen; two pale-dun Microfibett tails split into a wide V, about one and a half hook lengths, splayed roughly 45 degrees apart. No hackle. Loren Williams: 'Wings: Light Dun Poly yarn or similar buoyant synthetic yarn / Tails: Microfibetts / Body: Cinnamon Brown Dubbing'.

*Wrong:*
- 'clear or white poly wings' — 'clear' is not a material in any recipe found and will push an image model toward transparent glassy or cellophane wings. The written recipes specify light dun poly yarn, with white as the common alternative.
- 'split tails' without a count, length or splay angle. The recipe gives two Microfibetts, about 1.5x hook length, split to roughly 45 degrees.

*Missing:*
- The thorax — a slightly fuller dubbed section at the wing root, which is what gives the spinner its profile.
- An explicit 'no hackle'.
- That the wings lie in the horizontal plane, perpendicular to the shank.
- Body material options — rusty/cinnamon-brown dubbing or a rust turkey biot for a segmented look.

*Invented:*
- 'clear' wings.

*Sources:* [1](https://www.lwflies.com/tutorials/dry-flies/poly-wing-rusty-spinner) · [2](https://howtoflyfish.orvis.com/fly-tying-videos/dry-flies/713-poly_wing_rusty_spinner) · [3](https://news.orvis.com/fly-fishing/video-how-to-tie-the-rusty-spinner)
*Confidence:* high

### `scud-fly`
**Hook:** Curved scud/pupa hook, point-DOWN, materials on top of the shank; the dubbed body humps up over the curve of the shank.  
**Recipe:** Scud: curved scud hook (TMC 2487/2457) #12-20, .010 lead wire, thread to match; from the eye back - a short bunch of dyed mallard flank or similar fibres as antennae/tail at the front in some recipes, a humped body of scud dubbing (smoky olive, tan, grey, orange or pink) with the guard hairs picked out underneath as legs, a shellback of Swiss straw, Scud Back or a clear plastic strip pulled over the top and ribbed down with 6X mono or fine wire, and a short tail of the same fibres at the bend.

*Wrong:*
- Nothing substantively wrong. One imprecision: the prompt says only "ribbed with wire" - Charlie Craven's recipe ribs with 6X mono, others use fine wire; both are published, so wire alone is an over-narrow claim rather than an error.
- "Olive" is given as the colour without range; sources give smoky olive, tan, grey, orange and pink as equally standard, and the natural varies by water.

*Missing:*
- Antennae/short fibres at the FRONT as well as the tail - several published scuds (e.g. Craven's) tie the mallard-flank bunch at the head end.
- Lead-wire underbody, which is what gives the scud its humped back.
- That the shellback is pulled tight and segmented by the rib into distinct plates - the visual signature of a scud.
- That the finished fly is a short, fat, humped C-shape, not a slim nymph.

*Sources:* [1](https://charliesflybox.com/blogs/fly-tying-videos/scud-fly-tying-video) · [2](https://howtoflyfish.orvis.com/fly-tying-videos/nymph-flies/662-simple-scud) · [3](https://news.orvis.com/fly-fishing/how-to-tie-a-simple-scud)
*Confidence:* high

### `seaducer`
**Hook:** Stainless straight-eye saltwater hook, #1-2/0 (recipe range #4-4/0), POINT DOWN, materials wound around the shank.  
**Recipe:** Seaducer (Homer Rhodes, 1940s): Mustad 3407 or similar stainless #4-4/0; four to six long webby saddle hackles 3-4 in long tied in just in front of the bend with the curves opposed so they splay, plus about six strands of Krystal Flash; two long webby saddle hackles then palmered forward over roughly the rear three quarters of the shank, followed by two more hackles wound densely at the front as a collar, usually in a contrasting colour; unweighted (lead wire on the shank is an optional deep-water variant). Red-and-white is the classic colourway, commonly white tail and palmered white body with a red front collar/head.

*Wrong:*
- "the entire shank wrapped with palmered red and white hackle" — the recipe splits this: two hackles palmered in open turns over about the rear three-quarters of the shank, then two more wound densely at the FRONT as a distinct collar; the prompt would produce a uniform woolly-bugger-like body rather than the Seaducer's sparse rear body and full front collar
- "Long red and white saddle hackles splayed at the bend as a tail" — the tail is tied just IN FRONT OF the bend, with the feather curves opposed (convex sides together) so they splay outward; the classic red/white version usually has a single-colour tail, not mixed red and white

*Missing:*
- about six strands of Krystal Flash at the tail
- the distinct dense front hackle collar in the contrasting colour
- tail length of roughly 2 to 2.5 shank lengths
- small thread head at the eye

*Sources:* [1](https://www.saltwatersportsman.com/techniques/fly-recipies/seaducer/) · [2](https://orlandooutfitters.com/pages/tying-the-seaducer) · [3](https://fatfingeredflytyer.com/seaducer-fly-pattern-step-by-step/)
*Confidence:* medium

### `sex-dungeon`
**Hook:** Two long-shank streamer hooks, articulated. One published tutorial states the pseudo/lead eyes are tied UNDERNEATH the front shank, which implies a point-DOWN ride; no source checked explicitly states the fly rides inverted, and other write-ups decline to say. Treat point-down as the defensible depiction but note sources are silent.  
**Recipe:** Galloup's Sex Dungeon: two 3X-4X long streamer hooks (Tiemco 5263 / Daiichi 2460 / Umpqua XT350, roughly #2 rear and #1/0-#2 front) joined by trailer wire or heavy braid threaded through a small red bead. Rear section, eye to bend: Ice Dub or ice-chenille body with barred olive schlappen palmered over it and counter-ribbed with fine wire, barred silicone rubber legs, then a marabou tail with a few strands of flash. Front section, eye to bend: a spun and trimmed deer-hair (deer belly) head with large double-pupil lead dumbbell eyes tied UNDER the shank at the head, then a marabou skirt/wing, Ice Dub body with schlappen palmered and wire-ribbed, and barred rubber legs. Standard colours olive, black, white, yellow; sizes about #2-6.

*Wrong:*
- "both sections have schlappen hackle bodies" is only half the body - every recipe also lists an Ice Dub / ice-chenille underbody and a fine wire counter-rib on both sections; the schlappen is palmered over that, not wrapped on a bare shank.
- "marabou tail" singular - there is marabou on BOTH sections (a tail on the rear, a skirt/wing on the front), plus flash in the rear tail.
- "Two hooks joined by an articulation" is vague - sources specify a wire or heavy-braid connector strung through a small red glass bead, which is a visible feature between the two sections.
- Sources disagree on where the lead eyes sit: Charlie Craven puts large yellow lead eyes on the REAR section, the Flylords and westslope-trout dressings put large double-pupil lead eyes on the FRONT hook at the head. Our prompt asserts front-only.

*Missing:*
- Ice Dub / ice-chenille bodies and the fine wire counter-rib on both sections.
- Marabou on both sections plus flash in the rear tail.
- The red bead in the articulation joint.
- That the lead eyes are double-pupil (yellow/black or red/white) and sit right at the front of the deer-hair head.
- Standard colourways - olive is the signature but black, white and yellow are equally published.
- That the deer-hair head is razor-trimmed into a broad, flat-bottomed, wedge-shaped sculpin head.

*Sources:* [1](https://charliesflybox.com/blogs/fly-tying-videos/sex-dungeon-fly-tying-video) · [2](https://flylordsmag.com/how-to-tie-galloups-sex-dungeon/) · [3](https://westslope-trout.org/blogs/fly-tying/fly-spotlight-the-sex-dungeon) · [4](http://wegottastayfly.blogspot.com/2012/02/almighty-sex-dungeon.html)
*Confidence:* medium

### `soft-hackle-po`
**Hook:** Standard or 1X-long wet-fly hook, sizes 10-18 (some modern tiers use a curved emerger hook such as TMC 206BL or Daiichi 1130). Rides point-DOWN.  
**Recipe:** Partridge and Orange, eye to bend: a sparse collar of mottled partridge hackle (one and a half to two turns) swept back, a small thorax of tan or brown hare's-mask dubbing, and a slim orange silk body (floss or tying silk) sometimes ribbed with fine gold wire. No tail and no wing.

*Wrong:*
- "a sparse collar of brown partridge feather fibers" — sources disagree on the feather: Fly Tyer's recipe specifies "Gray partridge", Wikipedia and the North Country tradition specify "mottled brown partridge" (the back feather). Both are in print; the prompt should say "mottled brown-grey partridge" rather than committing to one.
- "A slim body of orange silk floss" — defensible, but the widely published modern versions build the body from orange tying silk/thread rather than floss (Wikipedia: body "formed with tying thread"). Range, not an outright error.

*Missing:*
- The thorax — most published recipes (Fly Tyer, Nemes-style, Wikipedia's note) include a small ball of tan or brown hare's-mask dubbing under the hackle. The prompt has no thorax at all, so the model will draw a bare silk body straight to the hackle.
- The optional fine gold wire rib listed by Fly Tyer and Wikipedia.
- Hackle proportion — only one and a half to two turns, very sparse, with fibres reaching back to about the hook point.
- The waxed orange silk should read as a slightly translucent, hot orange, wound thin and even.

*Sources:* [1](https://www.flytyer.com/mastering-the-classic-partridge-orange/) · [2](https://en.wikipedia.org/wiki/Partridge_and_Orange) · [3](http://www.rockyrivertu.org/orange-partridge-soft-hackle.html)
*Confidence:* high

### `sowbug`
**Hook:** Straight-shank standard or 1X-long nymph hook for the Ray Charles; scud hooks are also widely used for dubbed sowbugs. Either way point-DOWN, materials on top of the shank. Sources differ on hook shape.  
**Recipe:** Sowbug / cressbug. Sources split into two families. (1) Ray Charles (Bighorn, the best-known named sowbug): TMC 3769 straight-shank nymph hook #14-18, red 70-denier thread, body of densely wrapped ostrich herl in grey, tan, pink or white, with a wide pearl-tinsel shellback buckled over the top - no rib, no legs, no tail. (2) Generic dubbed sowbug/cressbug: standard or scud hook, flat grey-olive dubbing (muskrat, hare, Sow-Scud) picked out to the SIDES as legs, a thin-skin or plastic shellback over the top ribbed with fine wire or mono for segmentation. Our note should say sources disagree on the exact dressing; the constants are a flat, wide, grey, shellbacked body with legs out to the sides.

*Wrong:*
- Nothing clearly wrong. "Straight nymph hook" matches the Ray Charles (TMC 3769) but many published sowbugs use a curved scud hook - our prompt states one option as if it were the only one.

*Missing:*
- The rib - most dubbed sowbug recipes strap the shellback down with fine wire or mono to segment it; the Ray Charles buckles the pearl tinsel instead. Our prompt has a shellback with nothing holding it down.
- That the body should be conspicuously WIDE and flat in plan - a sowbug is broader than it is deep, which is what distinguishes it from a scud, and it should read as flattened rather than humped.
- That legs stick out to both sides along the full length (not just picked out at one point).
- Colour range - grey is standard but tan, pink, olive and white are all published.

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/ray-charles) · [2](https://news.orvis.com/fly-fishing/bighorn-guides-top-7-sowbug-patterns) · [3](https://charliesflybox.com/blogs/step-by-step-tutorials/soft-hackle-sow-bug)
*Confidence:* medium

### `sparkle-dun`
**Hook:** TMC 100 / standard straight dry-fly hook, #14-22. Rides point-DOWN, wing on top of the shank.  
**Recipe:** Craig Mathews / Blue Ribbon Flies, West Yellowstone. Three materials only. Eye to bend: thread head; upright wing of bleached coastal deer hair (or early-season elk) flared into a flat 180-degree semicircle over the top of the shank, wing length equal to one shank length; no hackle; dubbed body to match the hatch (Charlie's Fly Box PMD version: pale yellow Superfine); and in place of a tail a trailing shuck of rusty brown Z-Lon or Darlon (amber or gold crinkled Zelon in the Blue Ribbon/RiverKeeper listing), equal in length to the hook shank with irregular cut ends.

*Wrong:*
- 'a short trailing shuck of brown Z-lon yarn off the bend' — the shuck is not short: Charlie's Fly Box specifies it 'equal in length to the hook shank', with irregular, ragged cut ends. 'Short' will produce a stub.
- Shuck colour is given as a single value 'brown'. Sources give a range: rusty brown Z-Lon/Darlon (Charlie's Fly Box) or amber/gold crinkled Zelon (Blue Ribbon Flies / RiverKeeper).

*Missing:*
- Wing material specifics — bleached coastal deer hair or early-season elk — and the 180-degree fan (the prompt says only 'fanned upright').
- Wing length equal to one shank length.
- Body colour is unspecified, so the image model will invent one; give a colourway (e.g. pale yellow for the PMD, olive for the BWO).
- An explicit 'no tail at all — the shuck replaces the tail' statement; otherwise the model tends to add split tails as well as the shuck.

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/sparkle-dun) · [2](https://www.johnkreft.com/mayfly-fly-patterns/sparkle-dun-mayfly/) · [3](https://howtoflyfish.orvis.com/fly-tying-videos/dry-flies/1054-bwo_improved_sparkle_dun)
*Confidence:* high

### `sparkle-minnow`
**Hook:** Daiichi 2220 (long-shank streamer), #4-8, point-DOWN. Conehead is a head weight, not an inverting weight.  
**Recipe:** Coffey's Sparkle Minnow (In The Riffle, Flylords, Northern Angler): Daiichi 2220 #4-8 with a BLACK conehead at the eye over lead wire; body of gold Ice Dub spun in a loop and brushed out shaggy, with a pearl Ice Dub belly; copper or root-beer Krystal Flash along the sides; tail of blood-quill marabou blended white, tan and olive. Brown thread. Also tied all-white/pearl, and in Sculpin Helmet and articulated versions.

*Wrong:*
- "a shaggy body of gold and copper Ice Dub brushed out" — copper is the Krystal Flash, not a dubbing colour. The recipe is gold Ice Dub for the body with a PEARL Ice Dub belly, plus copper/root-beer Krystal Flash strands.
- "Cone head" does not state the colour; sources specify a black conehead, which is a strong visual contrast against the gold body.
- "marabou tail" does not state the colour; the standard tail is blended white, tan and olive blood-quill marabou.

*Missing:*
- Black conehead (colour)
- Pearl Ice Dub belly under the gold body
- Copper / root-beer Krystal Flash along the sides
- Tail colours (white, tan and olive marabou), roughly one shank length
- Lead-wire underbody

*Invented:*
- "copper ... Ice Dub" as a body dubbing — no source lists copper dubbing in this pattern.

*Sources:* [1](https://www.intheriffle.com/in-the-riffle-blog/coffeys-sparkle-minnow) · [2](https://flylordsmag.com/how-to-tie-coffeys-sparkle-minnow/) · [3](https://thenorthernangler.com/blogs/fly-tying-tutorials/sparkle-minnow-tutorial)
*Confidence:* high

### `squid-fly`
**Hook:** Long-shank saltwater hook, 1/0-4/0; rides HOOK POINT DOWN - unweighted, materials on top of the shank.  
**Recipe:** Squid fly (e.g. King's Emergent Sparkle Squid): long-shank saltwater hook 1/0-4/0; 8-10 long white/pink saddle hackles (or tapered fur) as the arms and tentacles trailing well past the bend and making roughly half the fly's total length; an inner body of palmered chenille or Estaz with an outer body of yak hair or Kinky Fibre - about 2 in swept back and 5-6 in swept forward - forming a bulky mantle tapered at both ends; a Siliskin / resin head carrying large stick-on or 3-D eyes. The eyes sit where the arms join the mantle, so they read as being at the rear of the body facing the tentacles. Modern EP-fibre versions substitute EP fibre and laser-cut synthetic suede.

*Wrong:*
- 'large eyes at the rear of the body facing the tentacles' is correct as written, but the prompt does not say how large - squid eyes are oversized relative to the body and the sources warn that undersizing them ruins the look.
- 'marabou as tentacles' is a reasonable stand-in but the written recipes specify 8-10 saddle hackles or tapered fur; marabou is a secondary material.

*Missing:*
- the inner body of palmered chenille or Estaz under the outer mantle fibre
- the mantle is tapered at BOTH ends, and arms/tentacles make roughly half the total length
- the resin/Siliskin head the eyes are set into
- typical overall length of 4-8 in

*Invented:*
- nothing

*Sources:* [1](https://www.saltwatersportsman.com/techniques/fly-recipies/sensational-squid/) · [2](https://www.jsflyfishing.com/blogs/fly-tying/how-to-tie-a-squid-fly-for-striped-bass)
*Confidence:* medium

### `stimulator`
**Hook:** TMC 200R / Daiichi 1260 or 1270 — a 3XL LONG, curved or humped-shank dry-fly hook, #4-16. Rides point-DOWN, wing on top of the shank.  
**Recipe:** Randall Kaufmann's. Eye to bend: fluorescent fire-orange thread head; a grizzly hackle PALMERED in open turns over a hot-orange / reddish-orange sparkle-dubbed thorax; a wing of natural elk or deer hair lying back over the body to about the end of the bend; a long yellow (golden stone) or orange (salmonfly) dubbed abdomen palmered with a brown hackle one or two sizes smaller than the thorax hackle, the whole abdomen counter-ribbed with FINE GOLD WIRE; a short flared bunch of elk or deer hair as the tail. RiverKeeper's Kaufmann salmonfly sheet: 'Hook: TMC 200R or Daiichi 1270 #4-6 / Thread: 6/0 fluorescent fire orange / Tail: Short flared bunch of elk or deer hair / Abdomen rib: Fine gold wire / Abdomen hackle: Brown - 1 or 2 sizes smaller / Wing: Elk or deer hair / Thorax: Reddish orange sparkle dubbing / Thorax hackle: Grizzly, slightly longer than abdomen hackle'. Orvis's yellow version uses a copper-wire rib and a hot-orange Ice Dub head.

*Wrong:*
- 'Long-shank dry-fly hook' — the specified hook (TMC 200R / Daiichi 1260/1270) is 3XL long AND curved/humped along the shank, not a straight long-shank. The curve is a visible part of the fly's silhouette.
- 'a bushy grizzly hackle collar over an orange dubbed thorax' — the grizzly is PALMERED in open spiral turns across the whole thorax, not wound as a single dense collar at the front. Kaufmann also specifies it slightly longer than the abdomen hackle.

*Missing:*
- The fine gold wire (copper in the Orvis yellow version) counter-rib over the abdomen, which locks the palmered brown hackle down and is clearly visible in a macro shot.
- The fluorescent fire-orange / red thread head showing at the eye.
- That the abdomen hackle is a size or two SHORTER than the thorax hackle, giving the fly its tapered, front-heavy profile.
- Tail described as a SHORT FLARED bunch of elk or deer hair (the prompt says 'a short elk-hair tail' but not flared).
- Wing length — back to about the end of the bend.

*Sources:* [1](https://www.johnkreft.com/stonefly-fly-patterns/kaufmanns-stimulator-salmonfly/) · [2](https://news.orvis.com/fly-fishing/Tying-the-Yellow-Stimulator) · [3](https://www.flyfishfood.com/blogs/dry-fly-tutorials/hi-vis-stimulator)
*Confidence:* high

### `surf-candy`
**Hook:** Short-shank stainless saltwater hook, #2-2/0, point-DOWN. Unweighted apart from the epoxy; no inverted orientation, and our prompt correctly says point-down.  
**Recipe:** Surf Candy (Bob Popovics; Global FlyFisher, MidCurrent, Salt Water Sportsman, In The Loop): short-shank stainless saltwater hook (Mustad 34007 / TMC 811S) with fine thread or clear mono; a body of flat silver mylar tinsel wrapped to the bend and back; a layered wing of Ultra Hair / Super Hair — clear or white underneath, six to eight strands of Flashabou or Krystal Flash in the middle, chartreuse or olive topped with dark grey, black or olive over; then thin layers of five-minute epoxy (or UV resin) built up over the forward part of the fly to form a hard translucent tapered head; 3D prism or self-adhesive eyes set between epoxy layers; optional red/orange marker gill marks between coats. Wing is stretched while the epoxy sets to keep the profile slim.

*Wrong:*
- "a painted eye and gill" — the eyes are 3D PRISM or self-adhesive stick-on eyes pressed into the resin between coats, not painted. That is a visible difference: a Surf Candy has a domed, reflective stick-on eye embedded in clear epoxy. The gill is a marker slash, also under the resin.
- "a slim body of olive-over-white synthetic hair" omits the flat silver mylar tinsel body wrapped on the shank beneath the hair, which shows through the resin, and the flash layer sandwiched between the white and olive hair.
- "coated in clear epoxy over the front half" — sources differ on extent. The Global FlyFisher version runs the epoxy from the bend through the hook eye; Popovics' classic builds it over the forward body only. Say that a range exists rather than asserting exactly half.
- The hair type is unstated; sources specify Ultra Hair / Super Hair (stiff, straight, translucent synthetic), not soft craft fur.

*Missing:*
- Flat silver mylar tinsel body under the wing
- Six to eight strands of Flashabou/Krystal Flash between the white underwing and the dark topping
- Hair type: Ultra Hair / Super Hair
- 3D prism or stick-on eyes set into the resin
- Marker gill slash under the resin
- Slim profile achieved by stretching the wing as the resin cures

*Invented:*
- "a painted eye"

*Sources:* [1](https://globalflyfisher.com/patterns-tie-better/surf-candy) · [2](https://midcurrent.com/videos/how-to-tie-bob-popovicss-surf-candy/) · [3](https://www.saltwatersportsman.com/techniques/fly-tying/bob-popovics-surf-candy/) · [4](https://intheloopmag.com/fly-tying-bob-popovics-surf-candy/)
*Confidence:* high

### `trico-spinner`
**Hook:** Tiny standard straight dry-fly hook, #20-26. Rides point-DOWN, wings on top of / level with the shank.  
**Recipe:** Eye to bend: tiny thread head; white poly or organza wings tied flat and spent, straight out to each side perpendicular to the shank; a bulky black poly-dubbed thorax; a very slim abdomen — black on the male, creamy-white to olive on the female after egg-laying; white or pale-dun tails, three of them, long and splayed (some tyers omit the tails entirely). WiFlyFisher spinner recipe: 'white-colored split tails (or none at all) with a body of either black, olive, or white thread, a bulky black poly dubbed thorax, and white poly or organza wings tied spent'. No hackle.

*Wrong:*
- 'splayed tails' does not say how many or what colour — Tricos have three tails and the dressing calls for white or pale fibres, long relative to the tiny body.

*Missing:*
- The bulky BLACK dubbed thorax, which is a defining lump on this fly and is the main thing distinguishing it in a macro photo from a plain thread-bodied midge.
- An explicit 'no hackle'.
- That the wings lie in the horizontal plane, perpendicular to the shank, so from a side profile they read as thin flat slivers rather than upright tufts.
- The female variant (creamy-white to olive abdomen) as an acknowledged alternative.

*Sources:* [1](https://www.wiflyfisher.com/Trico-Hatch.asp)
*Confidence:* medium

### `walts-worm`
**Hook:** Original: standard 1X-2X long down-eye nymph hook, point-DOWN. Modern jig version: barbless jig hook with slotted tungsten bead, point-UP (inverted). Sources describe both; the bead-head jig is the common current form.  
**Recipe:** Walt Young's Walt's Worm: originally a plain wet/nymph hook (Mustad 3906B/9671) with 10-12 wraps of lead wire, brown thread, and a rough body of hare's-ear dubbing (Hare's Ear Plus - tan rabbit with clear Antron) - no tail, no rib, no hackle, no bead. The modern Euro-nymphing version is the same dubbed body on a barbless jig hook with a slotted tungsten bead. (The "Sexy Walt's" variant adds a pearl/opal tinsel rib or hot-spot thread band.)

*Wrong:*
- "The wing/hair and weighted eyes are tied on the SAME side of the shank as the hook point" - Walt's Worm is literally dubbing on a hook; it has no wing, no hair and no weighted eyes. This boilerplate invites the model to draw a Clouser.
- The orientation paragraph is duplicated verbatim.
- The prompt presents the jig/bead form as the pattern without qualification - sources are clear the original Walt Young pattern predates beads and was tied on a plain nymph hook with a lead underbody.

*Missing:*
- The shaggy, spiky character of the dubbing - hare's ear with guard hairs picked out so the outline is fuzzy rather than smooth (this is the one visual feature the fly has).
- That the body is a fat, even, cigar-shaped taper filling the whole shank from bead to bend.

*Invented:*
- "weighted eyes" and "wing/hair" - no Walt's Worm recipe includes either.

*Sources:* [1](https://www.lwflies.com/tutorials/nymphs/walt-s-worm) · [2](https://howtoflyfish.orvis.com/fly-tying-videos/nymph-flies/765-walts_worm_and_the_sexy_walts) · [3](https://www.tcoflyfishing.com/blogs/connect/walts-worm-sexy-walts-worm)
*Confidence:* high

### `wd40`
**Hook:** Charlie Craven and most commercial versions use a curved 2X-short emerger/scud hook, TMC 2487, #16-24; Engler's original and some shops tie it on a straight standard nymph hook. Rides point-DOWN.  
**Recipe:** Mark Engler's WD-40, eye to bend: a small ball of grey muskrat (or matching) dubbing as the thorax, with the butt ends of the tail fibres pulled forward over it as a wing case and tied off behind the eye, a slim tapered tying-thread abdomen, and a short tuft of dyed wood-duck mallard flank fibres as the tail. Nothing else — no rib, no bead in the original.

*Wrong:*
- "Tiny nymph hook" — too vague to steer the silhouette. Sources split between a curved TMC 2487-style emerger hook (Craven, most commercial ties) and a straight standard nymph hook (Engler's original); the prompt should name one and note it is short-shanked.
- No colour is given at all. The standard colourways are olive, grey, black or tobacco-brown thread with a grey muskrat thorax; left unstated the model will invent one.

*Missing:*
- The tail and wing case are the SAME bunch of wood-duck-dyed mallard flank — tips tied in as the tail, butts folded forward over the thorax as the wing case. Saying this explicitly keeps the two the same colour and texture.
- Proportion: the tail is short, roughly a third to a half of the shank, and the abdomen is very slim and smoothly tapered with a distinctly bulbous thorax.
- The wing-case butts are clipped short right behind the eye (some tiers leave a very short stub), not left long.

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/wd-40) · [2](https://duranglers.com/mark-englers-wd-40-nymph/) · [3](https://howtoflyfish.orvis.com/fly-tying-videos/nymph-flies/660-wd_40_fly)
*Confidence:* high

### `woolly-bugger`
**Hook:** 3X-4X long streamer hook, point-DOWN, materials on top of the shank. (A jig-hook Woolly Bugger exists but is a variant, not the pattern.)  
**Recipe:** Woolly Bugger (Russell Blessing, 1967): 3X-4X long streamer hook #2-14, often weighted with lead wire or fronted by a bead or cone; from the eye back - thread (or bead/cone) head, a chenille body with a webby saddle hackle palmered in open even turns from the head back to the tail, optionally counter-ribbed with fine copper wire to protect the hackle, and a marabou tail at the bend about one shank length long. Blessing's original was OLIVE chenille with BLACK hackle and a marabou tail; all-black, all-olive and brown are the standard modern colourways.

*Wrong:*
- "a few strands of flash in the tail" - not in the original or in the standard dressing; adding flash makes it a Crystal Bugger / Flash-a-Bugger. Fine as a variant, but our prompt asserts it as part of the fly.
- The prompt gives an all-black fly as THE Woolly Bugger. Blessing's son describes the original as "olive chenille body, black hackle and marabou tail". Black, olive and brown are all standard; presenting only black is narrower than the sources.
- "palmered along its full length" is right, but the prompt does not say the hackle is wound in OPEN, evenly spaced turns with the fibres splayed - solid-wrapped hackle would render as a different fly.

*Missing:*
- The open, evenly spaced palmer with the hackle fibres sweeping back and standing out well beyond the body.
- The optional fine copper wire counter-rib that most modern recipes use.
- Tail proportion stated against the shank: marabou roughly one hook-shank long, fluffy and tapering.
- That the chenille body is fat and fuzzy.

*Invented:*
- Flash strands in the tail - a variant, not part of the standard or original recipe.

*Sources:* [1](https://flylifemagazine.com/russell-blessings-woolly-bugger/) · [2](https://en.wikipedia.org/wiki/Woolly_Bugger) · [3](https://www.adirondackexplorer.org/recreation/fishing/fly-of-the-week-the-woolly-bugger/)
*Confidence:* high

### `x-caddis`
**Hook:** TMC 100 / Daiichi 1180 / standard straight dry-fly hook, #12-20. Rides point-DOWN, wing on top of the shank.  
**Recipe:** Craig Mathews / Blue Ribbon Flies. Eye to bend: the trimmed butt ends of the wing hair form the head; a wing of NATURAL DEER HAIR (not elk), cleaned and stacked, lying back over the body in a tent to about the end of the bend; a dubbed body (olive, amber, tan or black); NO hackle and NO tail, replaced by a trailing shuck of crinkled Zelon — 'Amber or gold crinkled Zelon' (RiverKeeper/Blue Ribbon) or 'Olive Zelon' (Orvis), about a hook-shank long with ragged ends.

*Wrong:*
- 'Elk-hair wing' — the recipe specifies DEER hair. RiverKeeper: 'Wing: X caddis deer hair'. Orvis: 'Natural deer hair, cleaned and stacked. (The pattern uses deer hair, not elk hair.)' Deer hair is finer and flares more than elk, so this is a visible difference, and the whole point of the X-Caddis as distinct from the Elk Hair Caddis in this batch.
- 'a short trailing Z-lon shuck' — the shuck is about one hook-shank long, not short.

*Missing:*
- The trimmed deer-hair butt ends forming the head ('Head: Deer-hair butts', Orvis).
- Shuck colour — amber/gold, or olive to match the body.
- Body colour — olive, amber, tan or black; the prompt just says 'dubbed body'.
- An explicit 'no tail — the shuck replaces it'.

*Sources:* [1](https://www.johnkreft.com/caddis-fly-patterns/x-caddis/) · [2](https://howtoflyfish.orvis.com/fly-tying-videos/dry-flies/716-olive_x_caddis) · [3](https://caddischronicles.com/2017/03/the-x-caddis.html)
*Confidence:* high

### `yellow-sally-dry`
**Hook:** Standard dry hook (TMC 100) #14-16 for the simple dressing, or a 3XL natural-bend/curved dry hook (Dai-Riki 270, TMC 200R) for the Stimulator-style. Rides point-DOWN.  
**Recipe:** Eye to bend (Yellow Sally Stimulator / traditional little yellow stonefly dry): thread head; a cree or grizzly hackle collar at the front; bright yellow dubbed thorax; a wing of bleached or light elk hair set low and flat over the back, reaching about to the bend; bright yellow dubbed abdomen ribbed with fine gold wire, often with a yellow hackle palmered and trimmed short; and at the very rear a bright ORANGE (sometimes red) dubbed egg-sac butt. Simpler dressings (e.g. the North Carolina Yellow Sally) drop the palmered hackle: yellow rabbit abdomen, light elk wing, yellow thorax, dark dun hackle. No tail in the Stimulator-style dressing; some regional versions add two short pale split tails.

*Wrong:*
- "red thread butt" - the standard egg-sac butt is bright ORANGE dubbing (orange rabbit fur) in the Orvis/Stimulator dressing; red is a variant, and it is dubbing rather than bare thread in most published recipes. Sources differ here, so orange-to-red is the honest range.
- "Slim yellow foam or dubbed body" - an either/or the image model will mangle; the classic dressing is dubbed yellow rabbit/synthetic fur, ribbed. Foam is a separate modern variant.
- "a flat light-colored wing lying over the back" - under-specified: the wing is bleached or light ELK HAIR, a hair wing kept thin and tented low over the back, not a feather slip or a flat sheet.
- "small hackle" - the hackle is a full collar at the thorax (cree, grizzly or dark dun), and in the Stimulator-style dressing there is a second yellow hackle palmered the length of the abdomen.

*Missing:*
- Fine gold wire rib over the yellow abdomen (Stimulator-style dressing)
- Palmered body hackle over the abdomen (Stimulator-style dressing)
- That the wing is hair, and hair butts form the head

*Sources:* [1](https://howtoflyfish.orvis.com/fly-tying-videos/dry-flies/703-yellow-sally-stimulator) · [2](http://www.rockyrivertu.org/north-carolina-yellow-sally.html) · [3](https://thefeatherbender.com/yellow-sally-stonefly/)
*Confidence:* medium

### `zebra-midge`
**Hook:** Standard nymph hook or curved scud/emerger hook (TMC 2487, TMC 2457, TMC 101, Daiichi 1120), sizes 16-24 — published recipes list both straight and curved. Rides point-DOWN.  
**Recipe:** Zebra Midge, eye to bend: a small tungsten or brass bead (silver, black, copper or red) at the eye, and a very slim tapered body of black (or red, olive, brown) tying thread ribbed with evenly spaced turns of fine silver or copper wire all the way to the bend. No tail, no wing, no hackle, no dubbing.

*Wrong:*
- Nothing in the prompt is contradicted by the sources; the only weakness is that "Tiny curved scud hook" commits to one of two attested hook styles without saying so.

*Missing:*
- Proportion — the bead is conspicuously large relative to an unusually thin, sparse thread body; that contrast is the whole look of the fly, and without saying so the model tends to draw a fat dubbed body.
- That the body is bare tying thread with no dubbing at all, wound to a slight taper.
- Colour range — black thread with silver wire is the standard, but red/silver, olive/copper and brown/copper are equally standard commercial colourways.

*Sources:* [1](https://springcreekfly.com/blog-spring-creek-fly/zebra-midge) · [2](https://www.leewulfftu.org/Images/flies/Zebra_Midges.pdf) · [3](https://gbflycasters.org/fly_tying/patterns/Zebra_Midge/Zebra_Midge.htm)
*Confidence:* high

### `zonker`
**Hook:** 3XL streamer hook, point-DOWN, rabbit strip on top of the shank. (An "inverted Byford Zonker" is a documented variant that rides point-up, but the standard Zonker is point-down.)  
**Recipe:** Zonker (Dan Byford, Steamboat Springs, 1975): 3XL streamer hook (TMC 300/5263) #2-10, with a lead-wire or lead-sheet underbody built into a flat, deep, fish-shaped profile; a Mylar tubing body (pearl, silver or gold) slid over the underbody and bound down at BOTH the head and the bend; a rabbit zonker strip laid along the top of the shank, tied in at the head and pierced onto the hook and bound down at the bend, with the hide trimmed at the rear so the fur forms a tapered tail about half a shank long; red thread head, and adhesive or painted eyes on the head. Some published versions add a soft-hackle throat.

*Wrong:*
- "a red thread throat" - what the sources describe is red THREAD at the head, forming a red head band, not a throat hackle. A throat is a separate beard of fibres below the shank; calling it a throat will make the model draw hackle fibres that the standard recipe does not have.
- The prompt says the rabbit strip is "tied along the top of the shank and extending past the bend" but does not say it is bound DOWN at the bend - a free-floating strip along the whole body is not how a Zonker is built, and the tie-down point at the bend is a visible feature.

*Missing:*
- The rabbit strip being bound down at the bend as well as the head (the hook point is pushed through the hide).
- Stick-on or painted eyes on the head - in Craven's list they are a named material.
- The lead-wire/lead-sheet underbody that gives the Mylar body its deep, flattened, minnow-shaped profile - without it the fly renders as a thin tube.
- Tail proportion: the trimmed fur tail is about half a shank long past the bend.
- Colour range - pearl/silver/gold tubing with natural, white, black or olive rabbit.

*Invented:*
- "throat" as a separate hackle element - not in the recipes checked.

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/zonker) · [2](https://flyguysnlies.com/flies/zonker/) · [3](https://flylifemagazine.com/fly-tying-the-utilitarian-and-extremely-effective-zonker/)
*Confidence:* medium


## No change needed (1)

### `griffiths-gnat`
**Hook:** Standard straight-eye dry-fly hook (TMC 101/100) #16-26. Rides point-DOWN.  
**Recipe:** Eye to bend: small thread head; grizzly hackle palmered in open spiral turns from the eye all the way back to the bend over a body of two or three peacock herls wrapped the full length of the shank. No tail, no wing, no rib in the original. Hackle barbs about one to one and a half hook gaps.

*Missing:*
- Hackle proportion (barbs about 1 to 1.5 hook gaps) - not an error, but worth stating so the model does not draw an over-large hackle

*Sources:* [1](https://charliesflybox.com/blogs/step-by-step-tutorials/griffith-s-gnat) · [2](https://www.mtfa-springfield.org/resources/fly-tying-recipes-patterns/dry-flies/griffiths-gnat/)
*Confidence:* high



---

# Part two — the 67 insect and prey prompts

_Checked against entomology and marine-biology sources (Troutnut, macroinvertebrates.org, iNaturalist, state wildlife field guides, FishBase), not fly-tying sources. These are pictures of the real animal._

| Verdict | Count |
|---|---:|
| **wrong** | 8 |
| minor | 59 |

## Four systemic faults, not 67 separate ones

**1. Leaked template text.** Every mayfly nymph prompt carries the parenthetical `"three tail filaments (two for Epeorus/Quill Gordon)"` — an instruction that contradicts itself and names an unrelated genus. On the Quill Gordon prompt the lead clause is flatly wrong: *Epeorus* has **two** tails as nymph and adult, and is one of the only mayflies that does.

**2. The tail count is hedged everywhere.** Every adult prompt says "two or three tail filaments". None of these animals is ambiguous: *Baetis* two, *Maccaffertium* two, *Epeorus* two, *Ephemerella* three, *Paraleptophlebia* three, *Ephemera* three. Offering a choice is how you get a wrong mayfly.

**3. Every adult is drawn with half its wings.** "two large wings" appears throughout. Mayflies have two *pairs* — large forewings plus a smaller hindwing pair. For the Blue Quill this loses a diagnostic feature: the oval, vertically held hindwings are what separate the genus.

**4. One gill description, pasted onto animals that do not have it.** "a row of small gills along each side" is wrong for *Ephemerella* (hardened plates on TOP of segments 3–7, none on 2), for *Ephemera* (long forked feathery gills carried over the back), for *Tricorythodes* (an operculate cover on segment 2 hiding the rest) and for *Paraleptophlebia* (forked two-pronged gills — the family is literally named for them).

Two further faults worth naming: **fishing lore sitting inside image prompts** — "trout key on them hard", "first big hatch of the Appalachian spring" — which can put a fish in the frame; and **two prompts that name two different species at once**: the Green Drake trio fuses a tusked burrowing *Ephemera* with a spiny crawling *Drunella*, and `sw-mullet` pairs a cylindrical mullet with a deep-bodied menhaden. Neither can be drawn as one animal.


## Wrong — would draw a different animal (8)

### `fw-caddis-diving`
**What it actually looks like:** Some caddisfly females oviposit underwater. A USGS study records Hydropsyche centra, Hydropsyche occidentalis and Hydroptila argosa females captured underwater in Oregon reservoirs at record dive depths, and attributes this to 'sexually dimorphic leg characteristics that may be adaptations for swimming, diving, or both', specifically widened leg segments and 'fringes of long hairs on meso- and metathoracic tibiae and basal tarsal segments'. Wikipedia notes females attach eggs in a gelatinous mass above or below the water surface depending on species.

*Wrong:*
- 'side view resting on the water surface' - flatly contradicts the stage. This entry is the egg-laying adult diving UNDERWATER; the prompt puts it on the surface.
- 'wings folded over the back in a tent shape covering the abdomen' - contradicts the entry's own look note ('wings slick to body') and is wrong for a diving female, which clamps the wings tight and streamlined against the abdomen rather than tenting them.
- The entire anatomy paragraph is copy-pasted verbatim from the fw-caddis-adult entry, so nothing in it is stage-specific. There is no diving posture, no submerged setting, no egg mass.
- 'six legs' with no further detail - the diving females are specifically described as having widened middle and hind leg segments with fringes of long swimming hairs, which is the one anatomical thing that makes this stage look different.

*Missing:*
- Underwater setting: the insect submerged, below the surface, not on it.
- Wings held flat and tight against the body, streamlined for swimming.
- Widened middle and hind tibiae and basal tarsal segments fringed with long hairs, used as swimming oars.
- A gelatinous egg mass being attached to the underside of a submerged stone.
- Four wings, hairy not scaled (same omission as the adult entry).
- The silvery film of air trapped against the body that anglers describe is plausible but I found no entomology source confirming it for caddis; if included it should be worded as a faint sheen rather than an asserted plastron.

*Invented:*
- 'resting on the water surface' for a diving stage - unsupported and self-contradictory.

*Sources:* [1](https://www.usgs.gov/publications/caddisfly-dives-oviposition-record-shattering-depths-and-poor-life-choices-a-dammed) · [2](https://en.wikipedia.org/wiki/Caddisfly) · [3](https://genent.cals.ncsu.edu/insect-identification/order-trichoptera)
*Confidence:* high

### `fw-green-drake-dun`
**What it actually looks like:** The eastern Green Drake dun (Ephemera guttulata) has a greenish-yellow to creamy body of 13-15 mm with wings of 13.5-15 mm that are heavily marked with dark blotches spread across the venation. The western Green Drake dun (Drunella grandis) is 13-15 mm in the body with 15-18 mm wings, bright green when freshly emerged and darkening to brown, the abdomen conspicuously ringed dark purplish-brown with pale segment margins, the wings pale with dark purplish-brown veins. Both have three tails.

*Wrong:*
- 'Drunella grandis / Ephemera guttulata' - two species with different bodies and, crucially, different wings; the eastern insect has heavily blotched dark-patterned wings, the western has pale wings with dark veins only. One prompt cannot render both
- 'Huge olive-green body, dark slate wings' matches neither source description cleanly: Troutnut gives E. guttulata as greenish-yellow with blotched wings and D. grandis as bright green fading to brown with an abdomen conspicuously ringed in purplish-brown and pale
- 'two or three very long thin tail filaments' - both species have three tails as adults
- 'two large translucent opaque-tinted wings' - omits the second smaller hindwing pair, which is large and conspicuous in Ephemera

*Missing:*
- for E. guttulata: the dark blotches scattered across the wing venation, the species' most obvious adult feature
- for D. grandis: the abdomen conspicuously ringed, dark purplish-brown segments with pale posterior margins
- absolute size: body 13-15 mm, wings 13.5-18 mm - among the largest mayflies a trout stream produces
- the smaller hindwing pair

*Invented:*
- 'unmistakable on the water' - an angling impression, not an anatomical description

*Sources:* [1](https://www.troutnut.com/hatch/494/mayfly-ephemera-guttulata-green-drake) · [2](https://www.troutnut.com/hatch/446/Mayfly-Drunella-grandis-Western-Green-Drake)
*Confidence:* high

### `fw-green-drake-nymph`
**What it actually looks like:** The two animals named in this entry are not the same shape of insect. Ephemera guttulata (eastern Green Drake) is a BURROWER: up to about 20 mm, pale greyish-brown with no abdominal pattern, with large mandibular tusks projecting forward from the face and curving upward, fossorial (shovel-like) fore tibiae, and long forked feathery gills with fringed margins on abdominal segments 2-7 carried curled up over the back so the animal looks fluffy, plus three hair-fringed tails. Drunella grandis (western Green Drake) is a stout spiny CRAWLER of 13-20 mm with no tusks, erect finger-like dorsal spines on abdominal segments 2-9, occipital and prothoracic tubercles, yellowish legs with dark brown banding, flat plate gills on top of the abdomen, light reddish-brown body with dark lateral patches, and red-and-yellow banded tails.

*Wrong:*
- 'Drunella grandis / Ephemera guttulata' - one prompt cannot draw both; these are a tusked burrower and a spiny crawler with completely different silhouettes. This entry needs to be split into two prompts
- 'a row of small gills along each side' - wrong for both. Ephemera gills are long, forked, feathery and held over the BACK; Drunella gills are flat plates on top of segments 3-7
- 'chunky crawler' with 'fringed gills' - the fringed feathery gills belong to the burrowing Ephemera, the crawler build belongs to Drunella; the prompt fuses characters from two animals into one non-existent insect
- 'Big dark olive-brown' - Troutnut gives mature E. guttulata nymphs as dark greyish-brown and explicitly notes the absence of dark markings on the abdominal segments; Drunella grandis is light reddish-brown with dark lateral patches. Neither is olive
- 'three tail filaments (two for Epeorus/Quill Gordon)' - leaked template text about an unrelated genus

*Missing:*
- for Ephemera guttulata: the forward-projecting, upcurved mandibular tusks - the single most recognisable feature of the animal
- for Ephemera guttulata: fossorial, shovel-like fore tibiae for digging
- for Ephemera guttulata: gills on segments 2-7 only, forked and elongate-lanceolate with fringed margins, conspicuous from above
- for Drunella grandis: erect, slender, backward-directed finger-like dorsal spines on abdominal segments 2-9, and paired occipital and prothoracic tubercles
- size in either case - up to 20 mm for guttulata, 13-20 mm for grandis

*Invented:*
- a single insect that is simultaneously a fringe-gilled burrower and a chunky crawler; no source supports such an animal

*Sources:* [1](https://www.troutnut.com/hatch/494/mayfly-ephemera-guttulata-green-drake) · [2](https://www.macroinvertebrates.org/taxa-info/ephemeroptera-larva/ephemeridae/ephemera/dorsal) · [3](https://www.troutnut.com/hatch/446/Mayfly-Drunella-grandis-Western-Green-Drake)
*Confidence:* high

### `fw-green-drake-spinner`
**What it actually looks like:** The Coffin Fly is the spinner of the EASTERN Green Drake, Ephemera guttulata, and its whole point is the black-and-white contrast: a white or cream abdomen against wings that are largely blackish with extensive dark purplish-brown blotches, body about 13 mm and wings 13.5-15 mm, with three long tails. The western Drunella grandis spinner is a different animal - dark reddish-brown head and thorax, dark purplish-brown abdomen with pale segment margins, and genuinely hyaline wings with dark veins - and it is never called a Coffin Fly.

*Wrong:*
- 'two clear glassy transparent wings spread flat' directly contradicts the same prompt's own note 'Coffin fly (east) - cream body, dark wings, spent'. Troutnut describes the Coffin Fly's wings as 'largely blackish' with extensive dark purplish-brown blotches - the opposite of clear
- 'Drunella grandis / Ephemera guttulata' with the Coffin Fly description attached - only E. guttulata produces the Coffin Fly; applying that name and colouring to the western Drunella is simply wrong
- 'two or three extremely long tail filaments' - Ephemera adults have three tails
- 'two clear glassy transparent wings' - also omits the second, large hindwing pair

*Missing:*
- the black-and-white contrast that gives the Coffin Fly its name, stated as such
- body about 13 mm, wings 13.5-15 mm
- the large hindwing pair, itself dark-blotched
- dark markings on the sides of the white abdominal segments

*Invented:*
- clear glassy wings on a Coffin Fly - no source supports this; the sources say blackish and blotched

*Sources:* [1](https://www.troutnut.com/hatch/494/mayfly-ephemera-guttulata-green-drake) · [2](https://www.troutnut.com/hatch/446/Mayfly-Drunella-grandis-Western-Green-Drake)
*Confidence:* high

### `fw-quill-gordon-nymph`
**What it actually looks like:** Sources describe the Epeorus pleuralis nymph as a flattened clinger 9-12 mm long excluding tails, head as wide as or slightly wider than the thorax, with exactly two tails - Epeorus and Ironodes are among the only mayflies with just two tails as nymphs - and large gill plates held out to the sides and overlapping, with large anterior lobes that do not quite meet beneath the body; colour grey/olive-tan to reddish brown.

*Wrong:*
- "three tail filaments (two for Epeorus/Quill Gordon)" - the lead instruction is flatly wrong for this species and contradicts its own parenthetical. Epeorus pleuralis has exactly two tails as a nymph and as an adult
- "a row of small gills along each side" - sources describe the gills as large plates held out to the sides and overlapping, not small; understating them loses the diagnostic silhouette
- "Flat clinger, 2 tails, dark brown, emerges on the bottom then swims up" - emergence behaviour text left inside an image prompt; also the prompt's own body text says three tails while the look note says two

*Missing:*
- dorsoventrally flattened body - the defining clinger shape
- broad blunt head as wide as or wider than the thorax, with eyes on top of the head
- stout legs splayed sideways beyond the body outline
- size, 9-12 mm excluding tails
- colour range grey/olive-tan to reddish brown

*Sources:* [1](https://www.inaturalist.org/guide_taxa/186328) · [2](https://www.troutnut.com/hatch/39/Mayfly-Heptageniidae-March-Browns-Cahills-Quill-Gordons) · [3](https://www.troutnut.com/hatch/551/Mayfly-Epeorus-pleuralis-Quill-Gordon) · [4](https://pollinators.psu.edu/assets/uploads/documents/2021-05-Epeorus-nymph-Heptageniidae.pdf)
*Confidence:* high

### `fw-yellow-sally-nymph`
**What it actually looks like:** macroinvertebrates.org states for the genus Isoperla (Perlodidae) that gills are 'Absent from thoracic and abdominal segments', and that this is what distinguishes the genus from many other stoneflies. The same account gives two cerci 'subequal to the length of abdomen or longer', an abdomen frequently showing 'dark longitudinal pigment bands', a thorax with a 'distinct pigment pattern', chewing mouthparts with two apical teeth on the lacinia, two tarsal claws per leg, and hind legs that do not reach the end of the abdomen. Isoperla is a slender, elongate nymph, not a broad flattened one.

*Wrong:*
- 'tufted gills at the bases of the legs' - flatly wrong. Isoperla nymphs have NO thoracic gills and no abdominal gills; macroinvertebrates.org calls their absence a diagnostic character of the genus. This is Perlidae anatomy pasted onto a perlodid.
- 'Flattened segmented body' - wrong body form. Isoperla nymphs are slender and elongate, roughly cylindrical, not the broad depressed shape of a Golden Stone.
- 'Small yellow-brown stonefly nymph' with no pattern - the genus is defined visually by strong dark longitudinal pigment bands on the abdomen and a distinct pigment pattern on the head and thorax; a plain yellow-brown wash loses the identification.
- The anatomy paragraph is identical boilerplate shared with the Golden Stone and Salmonfly nymph entries, which is precisely how the wrong-family gills got in.

*Missing:*
- The absence of gills - it needs to be stated as an explicit negative, because the model will otherwise default to stonefly gill tufts.
- Dark longitudinal pigment stripes down the abdomen and a patterned head and pronotum.
- Two cerci as long as or longer than the abdomen.
- Slender elongate body form, roughly cylindrical.
- Two tarsal claws per leg; hind legs not reaching the abdomen tip.
- Two pairs of wing pads.
- Size: small, well under 20 mm in most species - the sources consulted are genus-level and do not give a single figure, and Isoperla is one of the largest stonefly genera with over 57 North American species, so size and pattern vary.

*Invented:*
- The gill tufts - no source supports gills anywhere on an Isoperla nymph.

*Sources:* [1](https://www.macroinvertebrates.org/taxa-info/plecoptera-larva/perlodidae/isoperla/dorsal) · [2](https://www.troutnut.com/hatch/1115/Stonefly-Isoperla-Yellow-Sallies) · [3](http://www.ohiostoneflies.org/Key%20to%20Nymphs/perlodidae_isoperla.html) · [4](https://en.wikipedia.org/wiki/Plecoptera)
*Confidence:* high

### `sw-mullet`
**What it actually looks like:** 'Mullet' and 'menhaden' are two unrelated fish. The flathead grey/striped mullet (Mugil cephalus, Mugilidae) is per FishBase "stout, cylindrical" and only "slightly compressed," with a "broad and flattened" head, a "well developed adipose eyelid," two widely separated dorsal fins (first with 5 spines, second with 7-9 soft rays), and per Wikipedia "olive-green" back, "silvery" sides shading to white with "six to seven distinctive lateral horizontal stripes." The Atlantic menhaden (Brevoortia tyrannus) is a herring with "a moderately compressed body," silvery, with "a black spot on their shoulder behind their gill openings," a single soft dorsal fin, a saw-toothed keel of belly scutes and a deeply forked tail.

*Wrong:*
- "A Mullet / Menhaden (bunker)" — this names two fish in different orders and asks the model to draw one image of both; it will produce a chimera or the wrong fish
- "Deep-bodied, silver" — deep-bodied describes the menhaden, not the mullet, which FishBase calls "stout, cylindrical" and only slightly compressed; as written the phrase contradicts half the animals it names
- "Scientific entomological illustration" — this is a fish; house style for fish is 'Scientific natural-history illustration'
- "big schools flipping on surface" is behaviour, not anatomy, and is doing the work that a fin and tail description should be doing
- "Accurate anatomy." is asserted while no fins, tail shape, head shape or markings are given

*Missing:*
- For mullet: two widely separated dorsal fins, blunt flattened head, small terminal mouth, adipose eyelid over the eye, large scales, forked tail, dark horizontal stripes along the scale rows
- For menhaden: single soft dorsal, the black humeral shoulder spot (often followed by rows of smaller spots), the keeled belly of sharp scutes, the big head and deeply forked tail
- Countershading in either case — dark olive or blue-green back over silver sides and white belly
- Size: the entry gives 4-10 in, which spans juvenile mullet and adult menhaden

*Invented:*
- The combined description 'deep-bodied mullet' matches neither published species description; no source describes Mugil cephalus as deep-bodied

*Sources:* [1](https://www.fishbase.se/summary/Mugil-cephalus.html) · [2](https://en.wikipedia.org/wiki/Flathead_grey_mullet) · [3](https://en.wikipedia.org/wiki/Atlantic_menhaden)
*Confidence:* high

### `sw-needlefish`
**What it actually looks like:** Needlefish and ballyhoo are different families with opposite jaw anatomy. In Belonidae (needlefish) "both jaws are elongated" into "long, narrow jaws filled with sharp teeth," with "a single dorsal fin, placed far back on the body, almost opposite to the anal fin," and lengths from 3 to 95 cm. The ballyhoo (Hemiramphus brasiliensis, Hemiramphidae) is a halfbeak with "an elongated lower jaw" only — the upper jaw is a short triangular flap — on a "cylindrical elongated body," to about 35 cm.

*Wrong:*
- "A Needlefish / Ballyhoo" — two fish from different families with directly contradictory head anatomy, offered as one subject; the model must produce a chimera or pick one at random
- "beak-like jaw" (singular) — ambiguous exactly where the two candidates differ: a needlefish has two elongated jaws, a ballyhoo has one
- "Scientific entomological illustration" — this is a fish; house style for fish is 'Scientific natural-history illustration'
- "skims surface" is behaviour, not anatomy
- "Accurate anatomy." is asserted while no fins, tail or colour are specified

*Missing:*
- For needlefish: the single dorsal fin set far back, almost directly opposite the anal fin; sharp teeth in both jaws; green or blue back over bright silver sides
- For ballyhoo: the short triangular upper jaw, the orange-red tip on the elongated lower beak, and the forked tail with a much longer lower lobe
- Countershading, the silver lateral stripe, the large eye
- A size that matches one animal rather than spanning both

*Invented:*
- The implied single animal that is both a needlefish and a ballyhoo — no source describes such a fish

*Sources:* [1](https://en.wikipedia.org/wiki/Needlefish) · [2](https://en.wikipedia.org/wiki/Ballyhoo)
*Confidence:* high


## Minor — right animal, wrong detail (59)

### `fw-ant-adult`
**What it actually looks like:** Wikipedia's ant account describes the body as dividing into 'the head, mesosoma, and metasoma', with 'the petiole forms a narrow waist between their mesosoma (thorax plus the first abdominal segment, which is fused to it) and gaster', plus 'geniculate (elbowed) antennae', 'a strong constriction of their second abdominal segment into a node-like petiole', compound eyes and three ocelli, 'two strong jaws, the mandibles', six legs ending in hooked claws, and crucially 'Only reproductive ants (queens and males) have wings. Queens shed their wings after the nuptial flight.' Workers range from 0.75 to 52 mm and most species are 'yellow to red or brown to black'.

*Wrong:*
- The entry's own look note says 'Two distinct body segments with thin waist' - that is wrong, and it contradicts the prompt body, which correctly says three. Ants have three body regions: head, mesosoma and metasoma/gaster. Worth fixing at source so it does not leak into a future prompt.
- 'A Ant (Formicidae)' - grammatical slip in the prompt text itself.
- 'Three body segments with a narrow waist' - correct as far as it goes, but the waist is specifically one or two node-like petiole segments, a visibly distinct pinched structure, not merely a narrowing.

*Missing:*
- The caste must be stated. Only queens and males have wings; workers are wingless. An unspecified 'ant' can be drawn winged, which for a fishing context is a different thing entirely (the flying-ant fall).
- The petiole as one or two discrete raised nodes between mesosoma and gaster.
- The bulbous rounded gaster.
- Strong forward-projecting mandibles.
- Compound eyes and three ocelli on top of the head.
- Legs ending in hooked claws.
- Size range 0.75 to 52 mm; most species yellow to red or brown to black, which supports the 'black or cinnamon' note.
- The closing 'it is an insect' assertion sentence is absent from this prompt.

*Sources:* [1](https://en.wikipedia.org/wiki/Ant)
*Confidence:* high

### `fw-ant-flying`
**What it actually looks like:** Sources describe an ant as having three body regions (head, mesosoma, metasoma) joined by a node-like petiole that makes the narrow waist, geniculate (elbowed) antennae, compound eyes plus three ocelli on top of the head, and six legs each ending in a hooked claw; only reproductives (queens and males) are winged, and Hymenoptera carry two pairs of membranous wings in which the smaller hind wing is locked to the larger fore wing by hooked bristles (hamuli). Body length across ants ranges from 0.75 to 52 mm.

*Wrong:*
- "two pairs of clear wings" is the right count but implies four equal wings; Hymenoptera sources state the hind wing is distinctly smaller than the fore wing and is coupled to it by hamuli
- "Winged ant during mating swarms, trout key on them hard" - fishing behaviour text left inside an image prompt; 'trout key on them hard' invites the model to draw a fish

*Missing:*
- the node-like petiole (one or two raised nodes) that actually forms the narrow waist
- compound eyes plus three small ocelli on top of the head
- wings longer than the body and held over the back at rest
- size (an alate of the species trout eat is a small insect, roughly 5-12 mm)
- hooked claw at the end of each leg

*Invented:*
- "trout key on them hard" - a fishing observation, not an anatomical fact, and no source supports putting it in a picture of the animal

*Sources:* [1](https://en.wikipedia.org/wiki/Ant) · [2](https://en.wikipedia.org/wiki/Hymenoptera)
*Confidence:* high

### `fw-beetle-adult`
**What it actually looks like:** Sources describe beetles as having a hard exoskeleton and hardened forewings (elytra) that cover the hind part of the body and protect the folded membranous hindwings, the elytra typically meeting in a straight line down the back; the body is head, thorax and abdomen, with a hard pronotum plate visible in front of the elytra, antennae of usually 11 or fewer segments, and three pairs of legs.

*Wrong:*
- "Hard rounded black or brown shell, sits low in the film" - 'sits low in the film' is fly-fishing behaviour text left inside an image prompt, not anatomy
- "short antennae" is asserted for the whole order Coleoptera; sources say antennae usually have 11 or fewer segments but vary enormously in length and form between families

*Missing:*
- the elytra meeting in a straight suture line down the midline of the back
- the pronotum, a separate hard plate between the head and the elytra
- distinct head visible in front of the pronotum
- membranous hindwings folded away beneath the elytra
- three body regions (head, thorax, abdomen) and the abdomen being hidden under the elytra
- size (a trout-relevant terrestrial beetle is roughly 5-15 mm)

*Sources:* [1](https://en.wikipedia.org/wiki/Beetle)
*Confidence:* high

### `fw-blue-quill-dun`
**What it actually looks like:** Troutnut describes Paraleptophlebia duns as brown to mahogany, running from grey to almost black depending on location, with smoky grey wings, three tails, and distinctive oval vertically held hind wings; eastern species are tiny, hook sizes 16-20 (mostly 18).

*Wrong:*
- "two or three very long thin tail filaments" - Paraleptophlebia duns have three tails
- "two large translucent opaque-tinted wings" - two pairs; Troutnut singles out the oval, vertically held hind wings as a distinguishing feature of this genus, so omitting them loses a diagnostic character
- "often confused with BWO" - angler's comparison text left inside an image prompt

*Missing:*
- the oval, vertically held hind wings that distinguish the genus
- three tails stated plainly
- body colour range - brown to mahogany, sometimes grey to nearly black
- size, roughly 6-8 mm for eastern species

*Sources:* [1](https://www.troutnut.com/hatch/47/Mayfly-Paraleptophlebia-Blue-Quills/) · [2](https://en.wikipedia.org/wiki/Leptophlebiidae)
*Confidence:* medium

### `fw-blue-quill-nymph`
**What it actually looks like:** Sources describe Paraleptophlebia (Leptophlebiidae, the prong-gilled mayflies) nymphs as slender, uniformly built, three-tailed, and recognised above all by forked (two-pronged) gills on the abdomen; Troutnut classifies them as crawlers that nonetheless swim, living in moderate to fast current over sand, gravel or detritus. Eastern species are small, hook sizes 16-20.

*Wrong:*
- "a row of small gills along each side" - misses the one diagnostic feature of the family: the gills are forked into two slender prongs, which is why they are called prong-gilled mayflies
- "three tail filaments (two for Epeorus/Quill Gordon)" - the parenthetical is about a different genus and has no business in a Paraleptophlebia prompt; it risks a two-tailed Blue Quill. Paraleptophlebia has three tails
- "Small dark brown swimmer" - sources differ: Troutnut classifies Paraleptophlebia as crawlers that look like burrowers and swim well, while many guides call them swimmers; 'swimmer' is defensible but not settled

*Missing:*
- forked, two-pronged gills on the abdominal segments - the family's defining character
- slender uniform build with long thin legs
- size, roughly 6-9 mm for eastern species
- long slender tails, often as long as the body

*Sources:* [1](https://en.wikipedia.org/wiki/Leptophlebiidae) · [2](https://www.troutnut.com/hatch/47/Mayfly-Paraleptophlebia-Blue-Quills/)
*Confidence:* high

### `fw-bwo-dun`
**What it actually looks like:** The Baetis dun (subimago) has exactly TWO tails, a body of roughly 4-9 mm in shades of olive, grey or brown, and dull opaque wings in 'various shades of gray, sometimes with a slight pale blue tint' held upright over the back; the large forewings are accompanied by a minute pair of hindwings (present in most Baetis, reduced or absent in a few species).

*Wrong:*
- 'two or three very long thin tail filaments' - Baetis duns have two tails, never three; Troutnut's Baetis page states duns 'display two caudal filaments rather than three'. Leaving it ambiguous invites a three-tailed drawing
- 'two large translucent opaque-tinted wings' - a mayfly has four wings; Baetis carries a minute second pair of hindwings behind the large forewings
- 'very long' tails - the dun's tails are roughly body length, not the greatly elongated filaments of the spinner

*Missing:*
- body length 4-9 mm
- the tiny hindwings
- males have enlarged turbinate (turret-shaped) eyes on top of the head, females do not
- dun wings are dull and opaque rather than glassy, which is what separates a dun from a spinner

*Sources:* [1](https://www.troutnut.com/hatch/180/Mayfly-Baetis-Blue-Winged-Olives)
*Confidence:* high

### `fw-bwo-emerger`
**What it actually looks like:** At emergence the Baetis nymph rises to the film, the thoracic skin splits along the mid-dorsal line and the subimago (dun) pulls free, leaving a translucent amber-brown nymphal shuck; the shuck keeps the nymph's three tails and gill plates while the dun that steps out has only two tails and dull slate-grey crumpled wings over an olive body of 4-9 mm.

*Wrong:*
- no tail counts given at all, so the prompt cannot enforce the single most diagnostic emergence detail: three tails on the discarded shuck, two tails on the emerging Baetis dun

*Missing:*
- the nymphal shuck retains three tails and the abdominal gill plates
- the emerging dun has exactly two tails
- dun wing colour - dull slate grey, crumpled and not yet dried
- size, about 6 mm
- the waterline / surface film itself, and that the shuck hangs below the film while the dun is above it

*Sources:* [1](https://www.troutnut.com/hatch/180/Mayfly-Baetis-Blue-Winged-Olives) · [2](https://www.macroinvertebrates.org/taxa-info/ephemeroptera-larva/baetidae/baetis/dorsal)
*Confidence:* high

### `fw-bwo-nymph`
**What it actually looks like:** Baetis nymphs are small (3-12 mm, typically 4-9 mm), streamlined, torpedo-shaped agile swimmers, olive to olive-brown, with three caudal filaments (the middle one usually shorter; a few species such as B. bicaudatus have two), single oval or heart-shaped flat gill plates on the top and sides of abdominal segments 1-7, a single tarsal claw per leg, and antennae at least two to three times the width of the head.

*Wrong:*
- 'small head with short antennae' - macroinvertebrates.org gives Baetidae antennae as 'long', 'at least two or three times the width of the head'; short antennae is a Heptageniidae/Ephemerellidae character, not a Baetis one
- 'three tail filaments (two for Epeorus/Quill Gordon)' - leaked template text about a different genus that has nothing to do with Baetis; an image model given this may draw two tails

*Missing:*
- middle tail filament is shorter than the outer two in most Baetis
- gill plates are oval/heart-shaped and lie on the TOP and sides of segments 1-7 only (not the whole abdomen)
- single hooked tarsal claw on each leg
- size: roughly 4-9 mm body excluding tails
- the small hindwing pads behind the large forewing pads

*Invented:*
- 'darts in short bursts' is behaviour, not visible anatomy, and cannot be drawn - harmless but it is not a description

*Sources:* [1](https://www.troutnut.com/hatch/180/Mayfly-Baetis-Blue-Winged-Olives) · [2](https://www.macroinvertebrates.org/taxa-info/ephemeroptera-larva/baetidae/baetis/dorsal)
*Confidence:* high

### `fw-bwo-spinner`
**What it actually looks like:** The Baetis spinner (imago) keeps the two-tailed configuration of the dun, has fully clear glassy wings, tails longer than in the dun, and a body in olive-brown to rusty brown; male spinners become pale or translucent over much of the abdomen and carry large turbinate eyes.

*Wrong:*
- 'two or three extremely long tail filaments splayed' - Baetis spinners have two tails only; Troutnut states spinners 'retain the two-tailed configuration of duns'
- 'two clear glassy transparent wings' - omits the minute hindwing pair, so the animal is drawn with a two-winged, fly-like build

*Missing:*
- body length 4-9 mm
- male spinners are pale or translucent over much of the abdomen and have large turret-shaped eyes; females are darker and more uniformly coloured
- the spent posture detail - dead or dying, wings flat in the surface film, legs collapsed

*Sources:* [1](https://www.troutnut.com/hatch/180/Mayfly-Baetis-Blue-Winged-Olives)
*Confidence:* high

### `fw-caddis-adult`
**What it actually looks like:** NC State's Trichoptera page describes adults as having 'Two pairs of wings clothed with long hairs', 'Wings held tent-like over the abdomen', 'Filiform antennae' and 'Mouthparts reduced or vestigial'. Wikipedia adds that the wings are membranous and hairy, the antennae 'fairly long and threadlike', the legs have five tarsi, and the order is defined by a short proboscis called the haustellum. No long tails.

*Wrong:*
- 'mottled tan-brown wings folded over the back in a tent shape' - the tent shape is right but the wing COUNT is never stated. Caddis adults have two pairs, four wings; a prompt that just says 'wings' invites a two-winged drawing.
- 'Moth-like' is used twice with no correction - the single most important difference is that caddis wings are clothed in fine hairs, not scales, and the adult has no coiled proboscis. As written the prompt is likely to produce a moth.

*Missing:*
- Four wings in two pairs; the hind pair broader and folded beneath the fore pair.
- Wings clothed in fine hairs, not scales - the defining order character (Trichoptera = 'hair wing').
- Mouthparts reduced or vestigial, with a short haustellum; explicitly no coiled butterfly/moth proboscis.
- Antennae often as long as or longer than the body, held forward and straight.
- Five tarsal segments per leg.
- No cerci or tails of any length.

*Sources:* [1](https://genent.cals.ncsu.edu/insect-identification/order-trichoptera) · [2](https://en.wikipedia.org/wiki/Caddisfly)
*Confidence:* high

### `fw-caddis-larva`
**What it actually looks like:** Caddis larvae are eruciform grubs with a hard sclerotized head capsule, three pairs of segmented thoracic legs, no abdominal prolegs except a terminal pair of anal prolegs each bearing a single hook. The three genera named differ sharply: macroinvertebrates.org describes Hydropsyche as having pro-, meso- and metanota entirely covered by sclerites, rows of branched ventral abdominal gills, anal prolegs with a conspicuous tuft of long hairs, and NO portable case - it builds a fixed silk retreat with a capture net. Rhyacophila is 'free-living, meaning that they do not live in a case or retreat', with only the pronotum sclerotized, a beaded-looking segmented body, often green, under 25 mm. Only Brachycentrus carries a portable case, 'square or round in cross-section and usually made of plant pieces that are mostly transversely oriented'.

*Wrong:*
- 'often in a stick or pebble case' applied to all three genera - this is wrong for two of the three. Hydropsyche builds a fixed silk-and-detritus retreat with a filter net and does not carry a case; Rhyacophila is explicitly free-living with no case or retreat.
- 'shown partly inside its tubular case of small pebbles and sticks' - Brachycentrus, the only case-maker named, builds a case that is square or round in cross-section from transversely arranged plant pieces, not a pebble tube. A pebble tube is a different family (Glossosomatidae, Limnephilidae).
- 'three pairs of legs at the front' is correct but the prompt never states that there are no other legs, which is the whole diagnostic point against a caterpillar.

*Missing:*
- Ventral rows of branched, tufted abdominal gills in Hydropsyche (about ten filaments per gill) - the most visible larval feature of that genus.
- The extent of dorsal sclerite plates: all three thoracic nota plated in Hydropsyche, pronotum only in Rhyacophila.
- The anal prolegs are a terminal pair, each with a single hook, and in Hydropsyche carry a conspicuous fan of long hairs.
- Rhyacophila's deeply constricted, 'beaded' body segmentation and length under 25 mm.
- Brachycentrus's humpless first abdominal segment (the family character) and its square-section plant-strip case.
- The closing 'it is an insect' assertion sentence required by the house style is absent from this prompt entirely.

*Invented:*
- The pebble-and-stick case for this genus set - no consulted source assigns a mineral case to Hydropsyche, Rhyacophila or Brachycentrus.

*Sources:* [1](https://www.macroinvertebrates.org/taxa-info/trichoptera-larva/hydropsychidae/hydropsyche/lateral) · [2](https://www.macroinvertebrates.org/taxa-info/trichoptera-larva/rhyacophilidae/rhyacophila/lateral) · [3](https://www.macroinvertebrates.org/taxa-info/trichoptera-larva/brachycentridae) · [4](https://genent.cals.ncsu.edu/insect-identification/order-trichoptera)
*Confidence:* high

### `fw-caddis-pupa`
**What it actually looks like:** Wikipedia's caddisfly account describes the aquatic pupa as having 'functional mandibles (to cut through the case), gills, and swimming legs', and says that at emergence 'most pupal caddisflies cut through their cases with a special pair of mandibles, swim up to the water surface, moult using the exuviae as a floating platform, and emerge as fully formed adults'. The pupa is exarate - legs, antennae and wing sheaths are free of the body rather than glued down - with the antennae laid back along the sides often to the abdomen tip, and rows of small hooks on the abdominal terga.

*Wrong:*
- 'no legs visible' is not said here, but 'long legs and antennae swept back' understates it: the middle legs are the swimming oars and carry dense fringes of long hairs, which the prompt omits entirely.
- 'a silvery sheen of trapped gas around the body' - I could not confirm this in an entomology source. The gas layer at caddis emergence is asserted throughout angling literature; the entomological sources consulted describe pupal gills and a swim to the surface, not a silver gas envelope. Treat as unverified rather than established.

*Missing:*
- The large functional sickle-shaped mandibles used to cut out of the case or cocoon - a defining pupal feature.
- Dense fringes of long swimming hairs on the middle legs, used as oars.
- Antennae laid back along the sides of the body, in many genera reaching the tip of the abdomen.
- Rows of small hooks or hook plates on the dorsal surface of the abdominal segments.
- Filamentous gills persisting on the abdomen in some genera.
- The pupa is exarate: all appendages free and standing away from the body, not fused down like a moth chrysalis.
- The closing 'it is an insect' assertion sentence is absent from this prompt.

*Invented:*
- 'a silvery sheen of trapped gas around the body' - not supported by the entomological sources consulted; the only silvery-sheen air-store description I found applies to aquatic beetles and true bugs, not caddis pupae.

*Sources:* [1](https://en.wikipedia.org/wiki/Caddisfly) · [2](https://genent.cals.ncsu.edu/insect-identification/order-trichoptera) · [3](https://thedragonflywoman.com/2013/12/06/bugs-with-bubbles/)
*Confidence:* medium

### `fw-callibaetis-dun`
**What it actually looks like:** Callibaetis is a baetid, and Rick Hafele states plainly that "duns and spinners have two tails, about body length in duns and twice the body length in spinners"; the dun's wings are "mostly brown or gray" with "distinct light markings along the wing veins," which is the speckling the common name refers to. Wikipedia's Baetidae page notes adults have "two long slender tails" and that hind wings are "usually very small or even absent." Body 6-12 mm.

*Wrong:*
- "two or three very long thin tail filaments trailing behind" — a Callibaetis dun has exactly two tails, and they are about body length, not 'very long'; the extremely long tails belong to the spinner stage. Both the count and the proportion are wrong for this stage
- "two large translucent opaque-tinted wings" — the forewings are correct in number, but the prompt omits the tiny hind wings that Baetidae retain, and Hafele describes the dun wing as brown or grey with light vein markings rather than merely 'opaque-tinted'
- "Speckled gray wings, tan body — Silver Creek classic" is left as an unprocessed note; the locality tag is not anatomy

*Missing:*
- Two tails about equal to body length
- The pale markings along the wing veins against a darker grey-brown wing that give the 'speckled dun' its name
- Very small hind wings
- Males have turbinate (turret-like) eyes raised on top of the head — a striking baetid feature
- Body length 6-12 mm, speckled/mottled tan-grey abdomen

*Sources:* [1](https://www.rickhafele.com/bug-blog/8m7ydza71stn45bdktfd2u9oxd68b9) · [2](https://en.wikipedia.org/wiki/Baetidae) · [3](https://www.troutnut.com/hatch/183/Mayfly-Callibaetis-Speckled-Duns)
*Confidence:* high

### `fw-callibaetis-nymph`
**What it actually looks like:** Rick Hafele's Callibaetis account states the nymphs "have three well-developed tails of equal length, and antennae two or three times longer than the width of their head," with gills bearing "recurved flaps that increase their surface area"; colour "ranges from light gray to brown, as well as shades of olive," and they are agile minnow-like swimmers of weedy lakes and slow water (Troutnut: "very slow weedy sections of rivers or lakes and ponds").

*Wrong:*
- "three tail filaments (two for Epeorus/Quill Gordon)" — this parenthetical is leaked boilerplate from another entry. Epeorus is a heptageniid clinger with nothing to do with Callibaetis, and putting "two" in the prompt at the point where the tail count is specified is the single most likely way to make the model draw a two-tailed nymph
- "Speckled tan swimmer, 3 tails, weed beds" is dropped in as a raw note rather than as description, duplicating the tail count in shorthand

*Missing:*
- Antennae two to three times the width of the head — a conspicuous baetid character the prompt reduces to "short antennae"
- The three tails are of equal length and fringed with fine hairs
- Gills as oval plates along abdominal segments 1-7 with recurved flaps (some doubled), not just "a row of small gills"
- Streamlined, torpedo-shaped, strongly swimming body — Callibaetis is a minnow-like swimmer, not a crawler
- Body 6-12 mm; mottled pale banding and pale spots on the abdomen that produce the 'speckled' look

*Sources:* [1](https://www.rickhafele.com/bug-blog/8m7ydza71stn45bdktfd2u9oxd68b9) · [2](https://www.troutnut.com/hatch/183/Mayfly-Callibaetis-Speckled-Duns) · [3](https://en.wikipedia.org/wiki/Baetidae)
*Confidence:* high

### `fw-callibaetis-spinner`
**What it actually looks like:** Hafele: "duns and spinners have two tails, about body length in duns and twice the body length in spinners"; male spinner wings are clear, while female spinners have "wings marked with small dark splotches along their leading edge." Troutnut's genus page likewise describes female spinners with "clear wing's leading edges marked with dark blotches." The spent spinner lies flat in the surface film with wings out to the sides.

*Wrong:*
- "two or three extremely long tail filaments splayed" — exactly two tails; the count must not be left open
- "two clear glassy transparent wings" — this contradicts the entry's own note "Speckled clear wings spent" and drops the one feature that identifies a female Callibaetis spinner: the row of small dark blotches along the leading edge of an otherwise clear wing
- "Speckled clear wings spent" is left in as an unprocessed shorthand note rather than being described

*Missing:*
- The dark blotches along the costal (leading) edge of the female spinner's clear wing
- Tails about twice body length in the spinner — the prompt says 'extremely long' but does not tie it to the proportion the source gives
- The very small hind wings
- Body 6-12 mm; slender mottled tan-brown abdomen; legs and tails sprawled in the film

*Sources:* [1](https://www.rickhafele.com/bug-blog/8m7ydza71stn45bdktfd2u9oxd68b9) · [2](https://www.troutnut.com/hatch/183/Mayfly-Callibaetis-Speckled-Duns) · [3](https://en.wikipedia.org/wiki/Baetidae)
*Confidence:* high

### `fw-crayfish-adult`
**What it actually looks like:** Sources describe a crayfish as a decapod with the front of the body covered by a carapace ending in a pointed rostrum, stalked compound eyes, a small first pair of antennules and a much larger second pair of antennae, ten pereopods of which the first pair are greatly enlarged pincers (chelipeds), five pairs of swimmerets under a six-segmented abdomen, and a telson plus uropods forming a tail fan used as a paddle to swim backwards.

*Wrong:*
- "Lobster-like, olive-brown to rust, scoots backward with tail flip" is the entire anatomy given; no claw, leg, antenna or segment count appears, which is the commonest failure mode for this animal

*Missing:*
- carapace covering the cephalothorax and the pointed rostrum in front
- two stalked compound eyes
- two pairs of antennae - short antennules and much longer second antennae
- five pairs of pereopods, the first pair enlarged into large pincers, the remaining four pairs walking legs (small claws on the front walking legs)
- six-segmented abdomen with five pairs of small swimmerets beneath
- telson and uropods forming the flat fan tail

*Sources:* [1](https://lanwebs.lander.edu/faculty/rsfox/invertebrates/procambarus.html) · [2](https://en.wikipedia.org/wiki/Crayfish)
*Confidence:* high

### `fw-golden-stone-adult`
**What it actually looks like:** Wikipedia's Plecoptera account states adults have 'two pairs of wings, which are membranous and fold flat over their backs', 'long, paired cerci projecting from the tip of their abdomens' and 'long, multiple-segmented antennae', and that the abdomen 'may include remnants of the nymphal gills even in the adult'. Troutnut describes Perlidae adults as stout-bodied with 'lighter, patterned coloration' compared with the darker salmonflies, and notes that some males have 'very short wings' while females retain full wings. Hesperoperla adults are described as more sombre than Calineuria, and emerge 'by crawling out on shore, during late evening'.

*Wrong:*
- 'Golden-yellow body' alone - Troutnut emphasises that Perlidae adults are patterned rather than uniformly coloured, and Hesperoperla pacifica specifically has 'a more somber appearance' than Calineuria. A flat golden-yellow wash loses the genus difference and the pronotal pattern.

*Missing:*
- The wings extend beyond the tip of the abdomen when folded, and are membranous with heavy complex venation, overlapping flat.
- Adults retain shrivelled gill remnants at the base of each leg - a visible Perlidae adult character.
- The rectangular pronotum with a dark patterned centre, distinct from the head.
- Body length roughly 15 to 40 mm depending on species and sex; females noticeably larger than males.
- Some males are short-winged (brachypterous), a genuine variation worth noting if the plate is generic.
- Wing tint: pale amber to smoky, not stated.

*Invented:*
- 'crawls out on rocks to hatch (no emerger)' is behaviour, correct in substance (Troutnut says adults emerge by crawling out on shore) but it is a fishing note rather than a visual trait and does nothing for the illustration.

*Sources:* [1](https://en.wikipedia.org/wiki/Plecoptera) · [2](https://www.troutnut.com/hatch/965/Stonefly-Perlidae-Golden-Stones) · [3](https://www.troutnut.com/hatch/1058/Stonefly-Hesperoperla-pacifica-Golden-Stone) · [4](https://www.inaturalist.org/guide_taxa/117854)
*Confidence:* medium

### `fw-golden-stone-nymph`
**What it actually looks like:** The University of Minnesota's aquatic invertebrate pages state plainly that 'Perlidae Stoneflies have gills on the ventral side of their thorax', which distinguishes them from mayflies whose gills project from the abdomen. Troutnut describes Perlidae nymphs as stout, active predators coloured anywhere from 'dark brown, delicately patterned gold and amber, to a brilliant yellow and black striped pattern reminiscent of Bengal tigers'. The iNaturalist Oregon guide adds that Hesperoperla pacifica has 'a pair of gill tufts between its tails' while Calineuria californica does not, though both show gill remnants at the base of each leg; Hesperoperla also carries an hourglass-shaped mark on the front of the head.

*Wrong:*
- 'dark wing pads on the thorax' - the count is not given. Stonefly nymphs carry two pairs of wing pads, on the second and third thoracic segments, and the two-pairs point is exactly what separates them from a mayfly nymph's single pair. Leaving it vague wastes the contrast.
- 'Flattened segmented body' is defensible for Perlidae but Troutnut describes adults as 'stout bodied' and 'much more ovoid in cross section'; the nymphs are depressed rather than paper-flat.

*Missing:*
- Two pairs of wing pads, meso- and metathoracic.
- The gills are branched, filamentous tufts on the UNDERSIDE of the thorax at the leg bases - saying 'at the bases of the legs' is right but the ventral position and the branched, finger-like form are what make them drawable.
- Hesperoperla pacifica also has a pair of anal gill tufts between the tails, and an hourglass mark on the front of the head; Calineuria californica lacks the anal tufts. If the illustration is generic these should be named as a genus-level variation.
- The strong contrasting mottled pattern of dark brown on amber-gold across the head and pronotum - Troutnut's descriptions stress the pattern, and 'golden-brown' alone loses it.
- Mature nymph length, roughly 20 to 40 mm excluding tails.
- Two tarsal claws per leg; three clearly separated thoracic segments each with a distinct plate.

*Sources:* [1](https://midge.cfans.umn.edu/vsmivp/plecoptera/perlidae) · [2](https://www.troutnut.com/hatch/965/Stonefly-Perlidae-Golden-Stones) · [3](https://www.inaturalist.org/guide_taxa/117854) · [4](https://www.troutnut.com/hatch/1058/Stonefly-Hesperoperla-pacifica-Golden-Stone)
*Confidence:* high

### `fw-hendrickson-dun`
**What it actually looks like:** Male Hendrickson duns are about 9 mm in the body with 10 mm wings, deep brown head and thorax with reddish tinges, light reddish-brown abdomen shaded smoky at the sides, bright red-brown eyes and deep dull amber legs; females are larger and distinctly paler, the pinkish-tan 'Light Hendrickson'. Both sexes have three tails, pale and yellowish at the base with smoky brown bands at the joinings.

*Wrong:*
- 'two or three very long thin tail filaments' - Ephemerella adults have three tails; the ambiguity permits a wrong two-tailed drawing
- 'two large translucent opaque-tinted wings' - omits the second, smaller pair of hindwings

*Missing:*
- males have bright reddish-brown eyes
- tails are pale/yellowish at the base with distinctly smoky brown bands at the segment joinings
- size: male body about 9 mm with 10 mm wings, females larger
- wing veins are distinctly light brown against the pale membrane
- the smaller hindwing pair

*Sources:* [1](https://www.troutnut.com/hatch/7/mayfly-ephemerella-subvaria-hendrickson) · [2](https://en.wikipedia.org/wiki/Ephemerella_subvaria)
*Confidence:* high

### `fw-hendrickson-nymph`
**What it actually looks like:** Ephemerella subvaria nymphs are robust spiny crawlers roughly 9-12 mm long, olive to reddish-brown and extremely variable in colour, with dorsal spines/tubercles on the abdomen, double-banded tibiae, flat gill plates on top of abdominal segments 3-7 (segment 2 bare) and three hair-fringed tails held spread in the characteristic 'fan tail'.

*Wrong:*
- 'a row of small gills along each side' - Ephemerella gills sit as flat overlapping plates on the TOP of segments 3-7, with no gill on segment 2; a lateral row along the whole abdomen is wrong for this family
- 'three tail filaments (two for Epeorus/Quill Gordon)' - leaked template text about an unrelated genus

*Missing:*
- the fringed 'fan tail' - Troutnut singles this out as the prominent character of subvaria nymphs
- dorsal spines / paired tubercles down the abdomen
- double-banded tibiae (two dark bands on each leg segment)
- size, about 9-12 mm
- sources stress 'tremendous physical variation within this species, especially in the coloration of the nymphs' - olive through brown, not reliably reddish

*Sources:* [1](https://www.troutnut.com/hatch/7/mayfly-ephemerella-subvaria-hendrickson) · [2](https://www.macroinvertebrates.org/taxa-info/ephemeroptera-larva/ephemerellidae/ephemerella/dorsal)
*Confidence:* high

### `fw-hendrickson-spinner`
**What it actually looks like:** Hendrickson spinners keep the dun's structure and three tails but with fully clear hyaline wings crossed by light brown veins; the body is reddish-brown ('rusty'), males darker, and the tails are pale with smoky brown joinings. Body about 9-11 mm.

*Wrong:*
- 'two or three extremely long tail filaments splayed' - Ephemerella adults have three tails
- 'two clear glassy transparent wings' - omits the smaller pair of hindwings

*Missing:*
- light brown veining visible in the otherwise clear wings
- pale tails with smoky brown bands at the joints
- body length about 9-11 mm
- sexual dimorphism persists into the spinner stage - males darker reddish-brown, females paler

*Invented:*
- 'evening spinner fall' - timing, not a drawable feature of the animal

*Sources:* [1](https://www.troutnut.com/hatch/7/mayfly-ephemerella-subvaria-hendrickson)
*Confidence:* medium

### `fw-hopper-adult`
**What it actually looks like:** Wikipedia's grasshopper account describes a head held vertically with mouthparts at the bottom, 'a large pair of compound eyes which give all-round vision, three simple eyes which can detect light and dark, and a pair of thread-like antennae'; Caeliferans have 'fewer segments in their shorter, stouter antennae' than crickets and katydids; the thorax bears three pairs of legs and two pairs of wings, the forewings or tegmina 'narrow and leathery' and the hindwings 'large and membranous, the veins providing strength'; the hind femur is 'robust and has several ridges'. Wikipedia's Acrididae page confirms 'relatively short and stout antennae' (short-horned grasshoppers) and tympana on the side of the first abdominal segment.

*Wrong:*
- 'two antennae' with no length given - the defining character of a grasshopper as against a cricket or katydid is that the antennae are SHORT and stout. An unqualified 'two antennae' invites long katydid antennae and the wrong insect.
- 'wings folded along the back' with no count or structure - there are two pairs: narrow leathery tegmina covering large membranous fan-folded hind wings. As written this could produce anything.
- 'Orthoptera' is used as though it were the taxon of a grasshopper; Orthoptera also contains crickets and katydids. The relevant group is the suborder Caelifera, family Acrididae.
- The prompt never states the leg count.

*Missing:*
- Short, stout antennae - the short-horned grasshopper character.
- Six legs; two pairs of wings (leathery narrow tegmina over large membranous hind wings folded fanwise beneath).
- Head held vertically with chewing mouthparts at the bottom, large compound eyes giving all-round vision and three ocelli.
- Robust ridged hind femur and a long spined hind tibia.
- A tympanum, a round membrane on the side of the first abdominal segment.
- Size and sex note: females are normally larger than males.
- The closing 'it is an insect' assertion sentence required by the house style is absent from this prompt.

*Invented:*
- 'lands with a plop near grassy banks' - behaviour from fishing lore, not a visual trait.

*Sources:* [1](https://en.wikipedia.org/wiki/Grasshopper) · [2](https://en.wikipedia.org/wiki/Acrididae)
*Confidence:* high

### `fw-inchworm-adult`
**What it actually looks like:** Sources describe geometrid larvae (inchworms, loopers, cankerworms) as smooth caterpillars about 25 mm (1 inch) long, green, grey or brownish, which lack the full complement of prolegs - only two or three pairs at the rear end instead of the usual five - so they walk by clasping with the front legs, drawing up the hind end, and looping the body; they spin silk threads and descend on them, and when disturbed stand erect and motionless resembling a twig.

*Wrong:*
- "Slender smooth bright green looper body arched in an inch shape" gives no legs at all, which risks a legless grub or worm; the reduced proleg count is the reason the animal loops and is its single most diagnostic feature
- entry id is 'fw-inchworm-adult' but the stage is 'larva' and the prompt correctly draws a caterpillar - the id/stage labelling is inconsistent, though the prompt itself is right

*Missing:*
- three pairs of true jointed legs at the front, behind the head
- only two or three pairs of fleshy prolegs clustered at the rear end, none in the middle - the gap in the middle is what produces the loop
- size, about 25 mm (1 inch)
- smooth hairless body and small rounded head
- colour range beyond bright green - sources also give grey and brownish, often with fine pale longitudinal stripes

*Sources:* [1](https://en.wikipedia.org/wiki/Geometer_moth) · [2](https://extension.umn.edu/yard-and-garden-insects/spring-and-fall-cankerworms)
*Confidence:* high

### `fw-leech-adult`
**What it actually looks like:** Sources describe leeches as annelids with 32 body somites (34 counting the head segments), the surface subdivided into many fine external rings (annuli), a body that is dorso-ventrally flattened and tapers at both ends, a sucker at both the front and rear ends, and two to ten pigment-spot ocelli arranged in pairs towards the front; Hirudinidae and Erpobdellidae swim with up-and-down undulations, and sizes run from about 1 cm to 30 cm.

*Wrong:*
- "Undulating flat black/brown/olive ribbon" omits the suckers entirely - a leech without a posterior sucker is not a recognisable leech

*Missing:*
- a sucker at both the anterior and posterior end, the rear one larger and disc-like
- body of about 32-34 segments subdivided into many fine external annuli (fine transverse ringing)
- body tapering at both ends and dorso-ventrally flattened
- two to ten small paired eyespots near the front
- size, roughly 2-10 cm for the species trout eat

*Sources:* [1](https://en.wikipedia.org/wiki/Hirudinea)
*Confidence:* high

### `fw-mahogany-dun`
**What it actually looks like:** Paraleptophlebia is a leptophlebiid ('prong-gilled') mayfly, and Troutnut's genus page states the adults are distinguished from baetids by their "three tails"; duns and spinners are "a rich brown" (hence Mahogany Dun), and Troutnut's P. bicornuta page quotes a formal description of "head and thorax blackish brown above," abdominal segments "3 to 7 whitish with brownish cloud" and "reddish brown on segments 8 to 10," with a male body length of 9 mm and wing length 10 mm, emerging "September through early November."

*Wrong:*
- "two or three very long thin tail filaments trailing behind" — Paraleptophlebia has exactly three tails at every stage; Troutnut's genus page uses the "three tails" character precisely to separate it from the two-tailed baetids, so offering the model a choice invites the wrong count
- "two large translucent opaque-tinted wings" — a Paraleptophlebia dun has four wings: a large triangular forewing plus a small separate oval hind wing on each side (Leptophlebiidae, unlike Baetidae, have well-developed hind wings)
- "fall on the Henry's Fork and South Fork" is left inside the visual description; it is locality lore, not anatomy, and gives the illustrator nothing to draw

*Missing:*
- The three tails are roughly body length in the dun, not the greatly elongated filaments of the spinner
- Body about 9-10 mm, wing about 10 mm — the largest Paraleptophlebia
- The banded abdomen described in the source: dark head and thorax, pale/whitish middle segments 3-7, reddish-brown segments 8-10
- The small oval hind wing behind the forewing

*Invented:*
- "slate wings" is a common-name convention (bicornuta is sometimes called the Large Slate-Winged Mahogany Dun) but the formal description Troutnut quotes says the wings are "hyaline with brown longitudinal veins"; sources disagree on how dark the dun's wing is

*Sources:* [1](https://www.troutnut.com/hatch/47/Mayfly-Paraleptophlebia-Blue-Quills-and-Mahogany-Duns) · [2](https://www.troutnut.com/hatch/746/Mayfly-Paraleptophlebia-bicornuta-Mahogany-Dun) · [3](https://en.wikipedia.org/wiki/Leptophlebiidae)
*Confidence:* high

### `fw-mahogany-nymph`
**What it actually looks like:** Troutnut states that Paraleptophlebia bicornuta is one of the few mayflies outside the Ephemeridae to possess large tusks on the front of its head, that it is one of the largest Paraleptophlebia species (male spinner 9 mm body), and that its nymphs associate with gravel, sand or wood in fast or moderately fast water and are clumsy swimmers; the family Leptophlebiidae is recognised by forked, two-pronged abdominal gills, and the genus has three tails.

*Wrong:*
- "Slim brown swimmer, 3 tails" plus the generic template omits the tusks - for P. bicornuta specifically the large paired head tusks are the single most distinctive feature and their absence makes the drawing a generic Paraleptophlebia
- "three tail filaments (two for Epeorus/Quill Gordon)" - template parenthetical about a different genus, contradicting its own instruction; P. bicornuta has three tails
- "a row of small gills along each side" - the family's gills are forked into two prongs, which the prompt does not say
- "Slim brown swimmer" - Troutnut calls P. bicornuta nymphs clumsy swimmers that associate with gravel, sand or wood, and classifies the genus as crawlers; sources disagree with the flat 'swimmer' label

*Missing:*
- the large paired tusks projecting from the front of the head
- forked two-pronged gills on the abdominal segments
- size - one of the largest Paraleptophlebia, around 9-11 mm excluding tails
- long slender tails and long thin legs

*Sources:* [1](https://www.troutnut.com/hatch/746/Mayfly-Paraleptophlebia-bicornuta-Mahogany-Dun) · [2](https://www.troutnut.com/hatch/47/Mayfly-Paraleptophlebia-Blue-Quills/) · [3](https://en.wikipedia.org/wiki/Leptophlebiidae)
*Confidence:* medium

### `fw-march-brown-dun`
**What it actually looks like:** The March Brown dun is large - 10-14 mm body, 13-16 mm wings - with body colour from pale yellow through reddish-brown to dark greyish-brown (the dark 'March Brown' and pale 'Gray Fox' forms are the same species), and pale wings whose barred appearance comes from heavy yellowish-brown longitudinal veins and purplish-brown crossveins. Maccaffertium duns and spinners have TWO tails.

*Wrong:*
- 'two or three very long thin tail filaments' - Heptageniid adults including Maccaffertium have exactly two tails; Troutnut's M. vicarium page gives 2 tails for both dun and spinner. NOTE a source conflict: the Wikipedia Heptageniidae page loosely states adults have 'three long tails', but the species-level description and the standard family diagnosis give two, and I follow the species-level source
- 'two large translucent opaque-tinted wings' - omits the smaller hindwing pair, which is well developed in Heptageniidae
- 'heavily mottled wings' is an over-reading: Troutnut describes the wing membrane as hyaline with yellowish-brown longitudinal veins and purplish-brown crossveins, so the mottled/barred look is produced by heavy dark venation rather than by pigmented blotches

*Missing:*
- size: body 10-14 mm, wings 13-16 mm - this is a large mayfly and the prompt never says so in absolute terms
- two recognised colour forms, the darker March Brown and the paler Gray Fox
- the smaller hindwing pair
- banded legs

*Sources:* [1](https://www.troutnut.com/hatch/601/Mayfly-Maccaffertium-vicarium-March-Brown) · [2](https://www.troutnut.com/hatch/39/Mayfly-Heptageniidae-March-Browns-Cahills-Quill-Gordons) · [3](https://en.wikipedia.org/wiki/Heptageniidae)
*Confidence:* medium

### `fw-march-brown-nymph`
**What it actually looks like:** Maccaffertium vicarium nymphs are strongly dorsoventrally flattened Heptageniid clingers with a broad blunt head, eyes set on top of the head, legs splayed out sideways, seven pairs of oval plate gills along the sides of abdominal segments 1-7, and three tails; colour is highly variable from pale to dark mottled brown, and mature nymphs run roughly 12-16 mm.

*Wrong:*
- 'three tail filaments (two for Epeorus/Quill Gordon)' - leaked template text; Maccaffertium nymphs have three tails and the Epeorus aside only invites a wrong two-tailed drawing
- 'small head with short antennae' understates the key character - the Heptageniid head is broad, flat and blunt, as wide as or wider than the thorax, with the eyes on the upper surface

*Missing:*
- eyes positioned on TOP of the flattened head, visible from directly above
- legs splayed laterally, held out sideways rather than beneath the body, so the whole animal is a flat oval in dorsal view
- seven pairs of oval plate gills along the sides of the abdomen, projecting beyond the body outline
- banded tails and banded legs
- size, about 12-16 mm excluding tails

*Sources:* [1](https://www.troutnut.com/hatch/601/Mayfly-Maccaffertium-vicarium-March-Brown) · [2](https://www.troutnut.com/hatch/39/Mayfly-Heptageniidae-March-Browns-Cahills-Quill-Gordons)
*Confidence:* high

### `fw-midge-adult`
**What it actually looks like:** Animal Diversity Web describes adult Chironomidae as small flies of 1-20 mm with two wings that 'do not bite, and have no scales on their wings' unlike mosquitoes; 'Many species rest on their hind two pairs of legs, and hold their forelegs out in front of them'; 'adult males have plumose antennae that are much larger than the females'; most are brown or black; and adults lack functional feeding mouthparts. Wikipedia adds that they are distinguished from true mosquitoes by 'the absence of the wing scales and elongated mouthparts characteristic of the Culicidae'.

*Wrong:*
- 'Looks like a tiny mosquito' with no correction - the two named differences from a mosquito are that chironomids have no scales on the wings and no elongated piercing mouthparts. Telling the model it looks like a mosquito without stating those negatives is the most likely way to get a drawn proboscis.
- 'long thin legs' with no posture - the diagnostic chironomid stance is resting on the hind two pairs of legs with the FORELEGS held out and raised in front, often vibrating. The prompt omits it.
- 'two clear wings folded flat over the back' - the wings are held over the abdomen, typically narrow and somewhat roof-like or overlapping rather than pressed flat like a stonefly's.

*Missing:*
- The raised, forward-held forelegs, the single most recognisable adult chironomid posture.
- Halteres: the reduced hind wings as a pair of tiny knobbed stalks behind the wing bases - the visible proof that this is a two-winged fly.
- No wing scales and no elongated biting proboscis; mouthparts non-functional.
- Size 1-20 mm, most species brown or black.
- The male's plumose antennae are described specifically as much larger than the female's - so if one sex is drawn, say which.

*Invented:*
- 'forms clusters on surface' - a fishing observation, not an anatomical trait from the sources consulted.

*Sources:* [1](https://animaldiversity.org/accounts/Chironomidae/) · [2](https://en.wikipedia.org/wiki/Chironomidae)
*Confidence:* high

### `fw-midge-larva`
**What it actually looks like:** Animal Diversity Web describes chironomid larvae as 'elongate and cylindrical, with distinct segmentation and a hard sclerotized head capsule that cannot be retracted into the body', adding 'They have no true legs, but do have a pair of unjointed "prolegs" on the first segment of the thorax'. macroinvertebrates.org gives 'hook-bearing prothoracic and anal prolegs paired'. The IntechOpen review describes 'two non-segmented pseudopods with a crown of simple or hook-shaped claws' on the thorax plus posterior pseudopods on the terminal segment, and notes that Chironominae larvae are 'generally provided with hemoglobin and colored red' while Orthocladiinae lack the pigment.

*Wrong:*
- 'no legs' stated flatly - true for jointed thoracic legs, but the larva does have a pair of unjointed fleshy prolegs bearing a crown of hooked claws on the first thoracic segment and a second pair at the tail end. 'No legs at all' will produce a smooth featureless thread, losing two real structures.
- 'A thin slender segmented worm-like body' with no size - chironomid larvae range from a couple of millimetres to well over 20 mm depending on genus; a single 'tiny' is not a description.

*Missing:*
- The pair of stumpy unjointed prothoracic prolegs with a crown of hooked claws, and the paired posterior prolegs at the tail tip.
- The head capsule is hard, sclerotized, fully exposed and non-retractile - not merely 'a tiny dark head'.
- Pale finger-like anal tubules at the rear in many genera.
- The red colour is specifically haemoglobin in Chironominae; Orthocladiinae larvae lack it and are olive, cream or brown - so the red/olive/black range in the look note has a real taxonomic basis worth stating.
- The characteristic figure-of-eight or C-curved posture caused by the undulating body movements used to draw oxygen.
- The closing 'it is an insect' assertion sentence required by the house style is absent from this prompt - and this is the entry most at risk of being drawn as an earthworm.

*Sources:* [1](https://animaldiversity.org/accounts/Chironomidae/) · [2](https://www.macroinvertebrates.org/taxa-info/diptera-larva/chironomidae) · [3](https://www.intechopen.com/chapters/74836) · [4](https://en.wikipedia.org/wiki/Chironomidae)
*Confidence:* high

### `fw-midge-pupa`
**What it actually looks like:** The IntechOpen Chironomidae review describes the pupa as comma-shaped with 'a swollen cephalothorax and a dorsoventrally flattened abdomen', 3 to 18 mm long; the thorax bears 'a pair of respiratory organs, also called: prothoracic horns or thoracic horns, which vary greatly in shape depending on the species or genera', along with 'the wing sheaths, or pterotheca and the legs sheaths or podotheca'. The abdomen has nine articulated segments and 'The last segment widens forming the two anal lobes. The external margin of these anal lobes always bears swimming setae forming the swimming fringe.' The pupa reaches the surface by 'eel-like whole-body undulation'.

*Wrong:*
- 'a tuft of white gill filaments on the head' - misplaced. The paired respiratory organs are THORACIC horns, borne on the thorax immediately behind the head, not on the head itself, and their shape varies greatly by genus from a simple tube to a branched plume.
- 'no legs visible' - wrong. The swollen thorax carries visible leg sheaths (podotheca) as well as wing sheaths, curved down along the underside.
- 'hanging vertically just under the water surface' as the sole posture - the review describes the pupa actively ascending by whole-body eel-like undulation; the motionless vertical hang is an angling framing of one moment rather than the described behaviour.

*Missing:*
- Size, 3 to 18 mm.
- Dorsoventrally flattened abdomen of nine articulated segments behind the swollen cephalothorax.
- The terminal segment widening into two anal lobes fringed along their outer margin with swimming setae - a paddle at the tail end.
- Leg sheaths (podotheca) curving along the underside of the thorax alongside the wing sheaths.
- The thoracic horns are paired and vary from simple tubes to branched plumes.
- The closing 'it is an insect' assertion sentence is absent from this prompt.

*Sources:* [1](https://www.intechopen.com/chapters/74836) · [2](https://animaldiversity.org/accounts/Chironomidae/) · [3](https://en.wikipedia.org/wiki/Chironomidae)
*Confidence:* high

### `fw-minnow-adult`
**What it actually looks like:** State wildlife sources describe the common shiner as a silvery, rather deep and slab-sided minnow with a terminal oblique mouth lacking barbels, a single dorsal fin set well forward (its base much closer to the snout than to the tail), olive back with a dark midline stripe, silvery iridescent sides and silvery-white belly, at 3-5 inches long and up to about 7 inches; cyprinids generally have cycloid scales, a forked caudal fin and a lateral line.

*Wrong:*
- "Slim silver-flashing baitfish, schools in shallows" is the whole description; no fins, mouth, scales or lateral line are specified, and 'schools in shallows' is behaviour text left inside an image prompt of a single fish
- "Slim" understates the shape - sources call the common shiner "rather deep and slab-sided"

*Missing:*
- single soft-rayed dorsal fin set forward on the back, no adipose fin
- deeply forked caudal fin
- visible cycloid scales and a lateral line along the flank
- terminal oblique mouth with no barbels
- dark olive back with a dark midline stripe and silvery-white belly
- size, roughly 8-13 cm

*Sources:* [1](https://mdc.mo.gov/discover-nature/field-guide/common-shiner) · [2](https://portal.ct.gov/DEEP/Fishing/Freshwater/Freshwater-Fishes-of-Connecticut/Common-Shiner)
*Confidence:* high

### `fw-pmd-dun`
**What it actually looks like:** PMD duns are 5.5-7.5 mm in the body with 7-8.5 mm wings, pale yellow through creamy orange to olive-green depending on population, with pale grey dull subimago wings carrying a slight yellowish tinge along the leading edge; Ephemerellidae carry THREE tails as both nymphs and adults.

*Wrong:*
- 'two or three very long thin tail filaments' - Ephemerella adults have three tails; Wikipedia's Ephemerellidae page and Troutnut's Ephemerella material both give three tails in nymph and adult. The ambiguity permits a two-tailed drawing, which would be wrong
- 'two large translucent opaque-tinted wings' - omits the second, smaller pair of hindwings, which are well developed and visible in Ephemerella

*Missing:*
- body length 5.5-7.5 mm, wing length 7-8.5 mm
- a faint yellowish tinge along the costa (leading edge) of the wing
- the smaller hindwing pair
- the very wide colour range across populations - pale yellow, creamy orange, or distinctly olive-green

*Invented:*
- 'pinkish-olive' - Troutnut's E. excrucians description gives pale yellow, creamy orange and olive green; pink is the Hendrickson female's character, not a PMD one

*Sources:* [1](https://www.troutnut.com/hatch/459/Mayfly-Ephemerella-excrucians-Pale-Morning-Dun) · [2](https://en.wikipedia.org/wiki/Ephemerellidae)
*Confidence:* high

### `fw-pmd-emerger`
**What it actually looks like:** The Ephemerella nymph splits along the back of the thorax in or just under the surface film and the pale yellow-olive dun, 5.5-7.5 mm, pulls free with soft crumpled pale grey wings, leaving a mottled reddish-brown shuck that still carries its three fringed tails and its dorsal gill plates; PMDs are notoriously slow and are often trapped half out of the shuck.

*Wrong:*
- no tail count is stated for either the shuck or the emerging dun - both are three in Ephemerella, and leaving it unsaid is the usual route to a wrongly drawn mayfly

*Missing:*
- three tails on both the shuck and the emerging adult (Ephemerellidae have three at every stage)
- size, 5.5-7.5 mm body
- the shuck is mottled reddish-brown with the dorsal gill plates visible on segments 3-7
- the waterline itself, and the characteristic stuck-in-the-shuck posture PMDs are known for

*Sources:* [1](https://www.macroinvertebrates.org/taxa-info/ephemeroptera-larva/ephemerellidae/ephemerella/dorsal) · [2](https://www.troutnut.com/hatch/459/Mayfly-Ephemerella-excrucians-Pale-Morning-Dun)
*Confidence:* medium

### `fw-pmd-nymph`
**What it actually looks like:** Pale Morning Dun nymphs (Ephemerella excrucians and E. dorothea infrequens) are stocky spiny crawlers about 7-10 mm long, reddish-brown to olive and irregularly mottled, often with pale longitudinal stripes on the abdominal dorsum; they carry flat overlapping oval gill plates on TOP of abdominal segments 3-7 only (segment 2 has no gill), paired dorsal tubercles on the abdominal terga, thickened fore femora, and three hair-fringed tails held in a fan.

*Wrong:*
- 'a row of small gills along each side' - macroinvertebrates.org states Ephemerella gills are on segments 3-7 with 'segment 2 without gills', and they are plate-like lamellae lying in paired depressions on the top of the abdomen, not a lateral row running the length of the body
- 'three tail filaments (two for Epeorus/Quill Gordon)' - leaked template text naming an unrelated genus
- 'Ephemerella spp.' is genus-level; the PMD hatch is E. excrucians in the west and E. dorothea infrequens, which differ in size and shade

*Missing:*
- paired dorsal tubercles / short spines on the abdominal segments (the 'spiny crawler' character)
- the three tails are fringed with fine setae and held spread in a fan
- thickened, bristly fore femora, noticeably stouter than the tibiae
- size: about 7-10 mm excluding tails
- pale longitudinal stripes or variegated pattern on the abdominal dorsum

*Invented:*
- 'clings to rocks' - Ephemerella are crawlers among substrate and vegetation rather than flat rock-clingers in the Heptageniid sense; it is behaviour, not drawable anatomy

*Sources:* [1](https://www.macroinvertebrates.org/taxa-info/ephemeroptera-larva/ephemerellidae/ephemerella/dorsal) · [2](https://www.troutnut.com/hatch/459/Mayfly-Ephemerella-excrucians-Pale-Morning-Dun)
*Confidence:* high

### `fw-pmd-spinner`
**What it actually looks like:** The PMD spinner is the same 5.5-7.5 mm body with 7-8.5 mm clear wings; male spinners are reddish-brown on the thorax and abdominal dorsum with whitish tails marked by brown joinings, females are variable and often more olive to rust; Ephemerella adults have three tails.

*Wrong:*
- 'two or three extremely long tail filaments splayed' - Ephemerella adults have three tails, not two
- 'two clear glassy transparent wings' - omits the second smaller pair of hindwings

*Missing:*
- male spinner tails are whitish with distinct brown bands at the segment joinings
- body 5.5-7.5 mm, wings 7-8.5 mm
- female spinners differ from males and are often more olive than rust

*Invented:*
- 'at dusk' - a lighting cue that the sources do not tie to a visible feature of the animal; harmless but not descriptive

*Sources:* [1](https://www.troutnut.com/hatch/459/Mayfly-Ephemerella-excrucians-Pale-Morning-Dun) · [2](https://en.wikipedia.org/wiki/Ephemerellidae)
*Confidence:* high

### `fw-quill-gordon-dun`
**What it actually looks like:** Sources give the Epeorus pleuralis dun as 9-12 mm body length with greyish-brown to olive-grey body with slight to moderate abdominal banding, uniformly slate-grey wings and exactly two tails; an older taxonomic description quoted by Troutnut calls the male reddish brown with a dark red-brown thorax and near-hyaline wings, so sources disagree on body tone.

*Wrong:*
- "two or three very long thin tail filaments trailing behind" - Epeorus duns have exactly two tails; offering three is an error for this genus
- "two large translucent opaque-tinted wings" - two pairs of wings, not two; the small hind wings are omitted
- "first big hatch of the Appalachian spring" - hatch-timing text left inside an image prompt, not anatomy

*Missing:*
- exactly two tails stated plainly
- a small pair of hind wings beside the forewings
- uniformly slate-grey wing colour
- size, 9-12 mm
- slight to moderate banding on the abdomen
- the dark spot on each femur noted in the taxonomic description

*Sources:* [1](https://www.inaturalist.org/guide_taxa/186328) · [2](https://www.troutnut.com/hatch/551/Mayfly-Epeorus-pleuralis-Quill-Gordon)
*Confidence:* high

### `fw-salmonfly-adult`
**What it actually looks like:** The iNaturalist Oregon account gives the adult Pteronarcys californica a body of 40-50 mm, upper surface 'light to dark brown', underside 'pale to bright orange' with an 'Obvious orange band in front and behind prothorax', wings 'heavily veined with a grayish appearance', and 'Two tails comprising one-half or less of the abdominal length'. Wikipedia adds that the wings are 'longer than the body' and 'kept flat against the body when at rest', with bright orange on 'the abdomen, leg joints, and several thorax joints', and females carrying an egg cluster that looks like orange salmon eggs.

*Wrong:*
- 'two long tail filaments' - wrong. The Oregon account gives adult cerci as one-half the abdominal length or less. Salmonfly adult tails are short.
- 'Huge orange-and-black adult' combined with 'dorsal view resting on a rock' - these fight each other. The orange is largely ventral (pale to bright orange underside) plus bands immediately in front of and behind the prothorax and at the leg joints; the dorsal surface is light to dark brown with grey-brown wings over it. A dorsal view would read as mostly dark with orange collar bands, not as an orange-and-black insect.
- The anatomy paragraph is shared boilerplate with the Golden Stone and Yellow Sally adults and states no colour at all, so the only colour information is in the look note.

*Missing:*
- Body length 40-50 mm; females larger than males - the largest stonefly in western North America.
- Wings longer than the body, heavily veined, greyish-smoky.
- The specific orange bands immediately in front of and behind the prothorax, and orange at the leg joints; pale to bright orange underside.
- Short cerci, half the abdomen or less.
- Non-functional gill remnants persisting on the first two abdominal segments even in the adult.
- Females may carry a cluster of orange eggs at the abdomen tip.

*Invented:*
- 'clumsy flier, lands on the water hard' - behaviour, unobjectionable but not a visual trait and not drawn from an anatomical source.

*Sources:* [1](https://www.inaturalist.org/guide_taxa/117853) · [2](https://en.wikipedia.org/wiki/Pteronarcys_californica) · [3](https://en.wikipedia.org/wiki/Plecoptera)
*Confidence:* high

### `fw-salmonfly-nymph`
**What it actually looks like:** The iNaturalist Selected Aquatic Insects of Oregon account for Pteronarcys californica gives the larva 'Thick filamentous gills on underside of thorax and first two abdominal segments', a mature body length of 40-50 mm excluding tails, dark brown to black above with lighter tones on the abdominal underside, and - critically - 'Two tail appendages measuring half the abdominal length or less'. The University of Minnesota key confirms 'Pteronarcyidae has gills on abdominal segments 1 and 2 as well as the thorax', which is what separates the family from Perlidae. Wikipedia gives lengths 'in excess of 5 centimetres (2 in)' and three to four years in the water.

*Wrong:*
- 'two long tail filaments (never three)' - the count of two is right but 'long' is wrong. The Oregon account gives Pteronarcys cerci as 'half the abdominal length or less'. Salmonfly nymph tails are conspicuously SHORT and stubby, which is a field mark.
- 'tufted gills at the bases of the legs' as the only gills - incomplete to the point of being wrong. Pteronarcyidae is defined against Perlidae by also having thick filamentous gill tufts on the underside of abdominal segments 1 and 2.
- 'Flattened segmented body' - the Pteronarcys nymph is heavy and robust, dark above and lighter below; the Oregon and Wikipedia descriptions do not describe it as flattened in the Perlidae sense.
- The whole anatomy paragraph is identical boilerplate shared with the Golden Stone and Yellow Sally entries, so nothing in it identifies this species.

*Missing:*
- Gill tufts on the underside of abdominal segments 1 and 2 as well as the thorax - the family-diagnostic feature.
- Short cerci, half the abdomen length or less.
- Size: 40-50 mm body, up to 5 cm / 2 inches - among the largest stonefly nymphs in North America.
- Dark brown to black dorsally with a lighter, paler underside.
- Two pairs of wing pads (meso- and metathoracic) rather than an unspecified number.
- Three to four years spent in the water before emergence (the look note says three; Wikipedia says three to four).

*Invented:*
- 'long tail filaments' - contradicted by the Oregon species account.

*Sources:* [1](https://www.inaturalist.org/guide_taxa/117853) · [2](https://midge.cfans.umn.edu/vsmivp/plecoptera/pteronarcyidae) · [3](https://en.wikipedia.org/wiki/Pteronarcys_californica)
*Confidence:* high

### `fw-scud-adult`
**What it actually looks like:** Sources describe amphipods (scuds) as crustaceans with 13 body segments, an arched body flattened side-to-side, no carapace, sessile compound eyes with no eyestalks, two pairs of antennae, eight pairs of thoracic appendages (the front two pairs modified into clawed gnathopods), swimming pleopods and three pairs of uropods that do not form a tail fan; they crawl and swim on their sides, most are about a quarter to three quarters of an inch long, and fly-fishing sources give olive and tan as commonest with grey, yellow, pink and orange shading.

*Wrong:*
- "Curved shrimp-like body" is the only body description given and risks producing an actual shrimp; sources stress amphipods lack a carapace and have sessile eyes with no eyestalks, unlike shrimp
- no leg count, antennae count or segment count is given at all - the prompt gives the model nothing to count

*Missing:*
- laterally compressed (flattened side to side), not top-to-bottom
- 13 body segments and no carapace
- seven pairs of walking legs behind the two clawed gnathopod pairs
- two pairs of antennae, the second pair long
- sessile compound eyes, no eyestalks
- several pairs of feathery swimming pleopods under the abdomen and three pairs of uropods at the rear (no shrimp-style tail fan)
- size, roughly 6-20 mm

*Sources:* [1](https://en.wikipedia.org/wiki/Amphipoda) · [2](https://mdc.mo.gov/discover-nature/field-guide/scuds-sideswimmers-amphipods) · [3](https://uwm.edu/field-station/bug-of-the-week/scuds/) · [4](https://www.troutnut.com/hatch/71/Arthropod-Amphipoda-Scuds)
*Confidence:* high

### `fw-sculpin-adult`
**What it actually looks like:** State wildlife sources describe the mottled sculpin as having a broad flattened head tapering abruptly into a slender, rounded body with no scales (only small prickles), a dorsal fin divided into two distinct parts (a soft-spined front section and a soft-rayed rear section), large fan-shaped pectoral fins, pelvic fins of one spine and three or four rays, olive-brown to slate-grey mottled colour with about four indistinct dark saddle bars, and a length of about 2.5-3.5 inches (most cottids under 10 cm).

*Wrong:*
- "big flat head, mottled brown, large pectoral fins" is correct as far as it goes but gives no fin structure; a single undivided dorsal fin is the likely result and sources are explicit that the dorsal fin is in two distinct parts

*Missing:*
- dorsal fin divided into two parts, the front one spiny and the rear soft-rayed
- scaleless skin (small prickles only)
- eyes set high on top of the broad head
- rounded caudal fin and small pelvic fins beneath the pectorals
- roughly four dark saddle bars across the back
- size, about 6-10 cm
- lateral line along the flank

*Sources:* [1](https://mdc.mo.gov/discover-nature/field-guide/mottled-sculpin) · [2](https://en.wikipedia.org/wiki/Cottidae)
*Confidence:* high

### `fw-sulphur-dun`
**What it actually looks like:** Sources give the Ephemerella invaria dun as 8-11 mm with a yellow to cream body often with light brown markings on top of the abdomen, light grey wings and three light brown barred tails; E. dorothea dorothea duns are 5-6 mm with a pale yellowish body and pale, iridescent wings. Ephemerellid adults have three tails and two pairs of wings - large forewings plus a much smaller pair of hind wings.

*Wrong:*
- "two or three very long thin tail filaments trailing behind" - Ephemerella duns have exactly three tails; leaving the model a choice invites a two-tailed sulphur
- "two large translucent opaque-tinted wings held together vertically upright" - mayflies have two pairs of wings; the small rounded hind wings are omitted, so the drawing will have half the wings
- "Bright yellow-orange body" overstates the colour; sources give yellow to cream with light brown abdominal markings (invaria) or pale yellowish (dorothea), with reddish tones mainly in spinners

*Missing:*
- a small pair of rounded hind wings beside the large forewings
- three tails, light brown and faintly barred
- light grey wing colour stated plainly
- size, 8-11 mm (invaria) or 5-6 mm (dorothea)
- long forelegs held forward, typical of mayfly duns

*Invented:*
- "Bright yellow-orange" - no source describes the dun as orange

*Sources:* [1](https://www.inaturalist.org/guide_taxa/35361) · [2](https://www.troutnut.com/hatch/458/Mayfly-Ephemerella-dorothea-Sulphur) · [3](https://en.wikipedia.org/wiki/Ephemerellidae)
*Confidence:* high

### `fw-sulphur-emerger`
**What it actually looks like:** Sources describe Ephemerella duns as emerging through the surface film with a pale yellow to cream body, light grey wings and three tails, the nymphal skin splitting along the back of the thorax; the emerging insect is 5-11 mm depending on species (E. invaria 8-11 mm, E. dorothea dorothea 5-6 mm).

*Wrong:*
- "the pale adult with crumpled, half-unfolded wings" is correct but no tail count is given, and Ephemerella has exactly three

*Missing:*
- three tails on both the emerging dun and the shuck
- the shuck's own anatomy - split thorax, empty leg sheaths, three shuck tails, gill plates on its back
- wing colour of the emerging dun (light grey, still crumpled and damp)
- size, 5-11 mm depending on species
- six legs pulling free of the shuck

*Sources:* [1](https://www.inaturalist.org/guide_taxa/35361) · [2](https://www.troutnut.com/hatch/28/Mayfly-Ephemerella-Hendricksons-Sulphurs-PMDs)
*Confidence:* medium

### `fw-sulphur-nymph`
**What it actually looks like:** Sources describe the Ephemerella invaria nymph as 7-10 mm, rounded in cross section, olive-brown through red-brown to blackish brown (or pale yellowish brown sprinkled with brown dots), with light brown banded legs and three tails; Ephemerellidae nymphs are crawlers whose gills are hardened operculate plates carried on the top of the rear abdominal segments, not a lateral fringe. Ephemerella dorothea dorothea nymphs are smaller and yellowish brown speckled with pale dots.

*Wrong:*
- "three tail filaments (two for Epeorus/Quill Gordon)" - a template parenthetical about a different genus left in a Sulphur prompt; it contradicts the instruction it is attached to and could produce a two-tailed Ephemerella. Ephemerella has three tails, full stop
- "a row of small gills along each side" - sources describe Ephemerellidae gills as hardened operculate plates on the dorsal surface of the rear abdominal segments, not a fringe running along both flanks

*Missing:*
- crawler body form, stout and rounded in cross section
- banded legs and banded tails
- body colour described in the sources (olive-brown to red-brown, or pale yellowish brown speckled with brown dots)
- size, 7-10 mm excluding tails
- small paired tubercles/spines along the abdomen

*Sources:* [1](https://www.inaturalist.org/guide_taxa/35361) · [2](https://www.troutnut.com/hatch/11/Mayfly-Ephemerella-invaria-Sulphur-Dun) · [3](https://www.troutnut.com/hatch/458/Mayfly-Ephemerella-dorothea-Sulphur) · [4](https://en.wikipedia.org/wiki/Ephemerellidae)
*Confidence:* high

### `fw-sulphur-spinner`
**What it actually looks like:** Sources give the Ephemerella invaria spinner as 7-10 mm body with 8-10 mm wings, males light reddish brown in head and thorax with a light smoky to purplish brown abdomen dorsally and pale yellowish white beneath, females tan to cream, wings clear (hyaline), three tails that are white with very distinct purplish black joinings; ephemerellid adults have three tails and two pairs of wings.

*Wrong:*
- "two or three extremely long tail filaments splayed" - the spinner has exactly three tails
- "two clear glassy transparent wings spread flat out to the sides" - two pairs, not two wings; the small hind wings are omitted
- "Rusty-orange body" - sources describe male spinners as light reddish brown and females as tan or cream; 'rusty-orange' is an approximation at best and wrong for females

*Missing:*
- three white tails with distinct dark banding at the joints
- a small pair of hind wings
- size, 7-10 mm body
- pale yellowish-white underside contrasting with the darker dorsal abdomen
- spent posture detail - wings flat in the surface film, body resting on the water

*Sources:* [1](https://www.troutnut.com/hatch/11/Mayfly-Ephemerella-invaria-Sulphur-Dun) · [2](https://www.inaturalist.org/guide_taxa/35361) · [3](https://en.wikipedia.org/wiki/Ephemerellidae)
*Confidence:* high

### `fw-trico-dun`
**What it actually looks like:** Troutnut's family key places Tricorythodes in Leptohyphidae, whose adults have three well-developed tails and hind wings that are reduced to tiny pads with only two or three simple veins, so in flight or at rest only one obvious pair of wings shows; the species pages give a body length of 2.5-5 mm with wings 3.5-7 mm, the male pitch-black and the female reddish-brown to olive. Wikipedia's mayfly account states the subimago (dun) has dull, partially cloudy wings fringed with microtrichia, held upright over the back, in contrast to the clear-winged imago.

*Wrong:*
- 'two or three very long thin tail filaments trailing behind' - the sources are not ambiguous here: Troutnut's key to families of duns and spinners gives Leptohyphidae (Tricorythodes) 'three well-developed tails'. The number is three, not 'two or three'.
- 'two large translucent opaque-tinted wings' - self-contradictory, and wrong for a dun. The subimago wing is dull and partially cloudy, not translucent; and the wings are not 'large' - wing length is only 3.5-7 mm and the fore wings are the only conspicuous pair because the hind wings are vestigial.
- 'very long thin tail filaments' for a dun - Troutnut's adult key notes 'Male tails around twice the length of the body' as a Tricorythodes character, but that applies to the male; the female's tails are much shorter. The prompt applies 'very long' to an unspecified sex.

*Missing:*
- The tail count is three (two cerci plus a median terminal filament).
- The hind wings are present but vestigial - tiny pads with two or three simple veins - which is the single most distinctive Tricorythodes adult character.
- Body length 2.5-5 mm, fore wing 3.5-7 mm; this is among the smallest mayflies.
- The subimago wing surface is dull and opaque with a fringe of fine hairs (microtrichia) along the margin.
- Male has enlarged turbinate-set dark eyes and a pitch-black head and thorax; the female specimen descriptions give reddish-brown to olive abdomen with a darker thorax.

*Invented:*
- 'freshly hatched dun stage... resting on the water surface' is a plausible scene but no anatomy source asserts it; it is behavioural framing, not a described trait. Harmless but unsourced.
- 'abdomen curving slightly upward' - not stated in any of the descriptions consulted.

*Sources:* [1](https://www.troutnut.com/taxonomic-key/3/Key-to-Identify-Families-of-Mayfly-Duns-and-Spinners) · [2](https://www.troutnut.com/hatch/700/Mayfly-Tricorythodes-minutus-Trico) · [3](https://www.troutnut.com/taxonomic-key/110/Easy-Anglers-Key-to-Identify-Common-Adult-Mayflies) · [4](https://en.wikipedia.org/wiki/Mayfly)
*Confidence:* high

### `fw-trico-nymph`
**What it actually looks like:** Tricorythodes nymphs are tiny (about 3-5 mm), squat and somewhat flattened sprawlers on sediment, usually dark brown to blackish and often coated in silt. Their diagnostic feature is a pair of enlarged, roughly triangular or oval operculate gill covers on abdominal segment 2 that shield the simple plate gills on segments 3-6 beneath them - not an exposed lateral row. They have three tails (occasionally two), a single tarsal claw with tiny teeth along the basal edge, and they LACK hind wing pads, so only one pair of wing pads is present.

*Wrong:*
- 'a row of small gills along each side' - macroinvertebrates.org gives Tricorythodes a semi-operculate triangular or oval gill cover on segment 2 concealing the plate gills of segments 3-6; an exposed lateral row is the wrong silhouette for this genus
- 'dark wing pads on the thorax' left unqualified - Tricorythodes 'lack hind wing pads', a stated genus-level diagnostic, so there is only ONE pair of wing pads
- 'three tail filaments (two for Epeorus/Quill Gordon)' - leaked template text about an unrelated genus

*Missing:*
- the operculate gill cover on segment 2, the single diagnostic character of the genus
- absence of hind wing pads
- size, roughly 3-5 mm - among the smallest mayflies, imitated on hooks down to size 26
- single tarsal claw bearing a row of tiny teeth along the basal edge
- nymphs are typically coated in silt/detritus, which is how they usually appear in the substrate

*Sources:* [1](https://www.macroinvertebrates.org/taxa-info/ephemeroptera-larva/leptohyphidae/tricorythodes/dorsal) · [2](https://www.wiflyfisher.com/Trico-Hatch.asp)
*Confidence:* high

### `fw-trico-spinner`
**What it actually looks like:** Troutnut's species description of a Tricorythodes spinner gives the male 'Body pitch-black; femora deep pitch brown, tibiae brownish, tarsi yellowish white', with wings 'whitish, hyaline' and blackish or purplish-black subcosta and radius, and tails 'whitish, the edges and joinings black'; the female is reddish-brown. The adult key notes male tails about twice the length of the body, and the family key gives three well-developed tails and vestigial hind wings. Females are described squeezing 'little green balls of eggs' from the abdomen.

*Wrong:*
- 'two or three extremely long tail filaments splayed' - the count is three, per Troutnut's family key for Leptohyphidae; and 'extremely long' is a male character (tails about twice body length), not a female one.
- 'two clear glassy transparent wings' - the species description says 'whitish, hyaline' with distinctly blackish or purplish-black costal and subcostal veins in the male, so not plainly clear glass; and it omits the vestigial hind wings that are the diagnostic Tricorythodes feature.
- 'clouds of them over riffles at dawn' - this sentence describes a mating swarm and directly contradicts the rest of the prompt, which specifies one insect lying flat on the water viewed from above. It will push the image toward a swarm scene rather than a specimen illustration.

*Missing:*
- Three tails, not two; male tails roughly twice body length.
- The spent posture itself: dead or dying, legs collapsed, body limp and pinned in the surface film, wings flat on the water rather than merely 'spread'.
- Male body pitch-black with brownish femora and yellowish-white tarsi; female reddish-brown to olive - the prompt asserts 'black body' for both sexes.
- Dark blackish or purplish-black leading-edge veins (subcosta and radius) against the whitish hyaline membrane.
- Vestigial hind wings with two or three simple veins.
- Body length 2.5-5 mm.
- Females may carry a small green-grey egg ball at the tip of the abdomen.

*Invented:*
- 'clouds of them over riffles at dawn' as an anatomical descriptor - it is behaviour, not morphology, and no consulted source ties it to the appearance of a single spent spinner.

*Sources:* [1](https://www.troutnut.com/hatch/700/Mayfly-Tricorythodes-minutus-Trico) · [2](https://www.troutnut.com/taxonomic-key/3/Key-to-Identify-Families-of-Mayfly-Duns-and-Spinners) · [3](https://www.troutnut.com/hatch/669/Mayfly-Tricorythodes-Tricos/) · [4](https://en.wikipedia.org/wiki/Mayfly)
*Confidence:* high

### `fw-yellow-sally-adult`
**What it actually looks like:** Wikipedia's Plecoptera account gives stonefly adults 'two pairs of wings, which are membranous and fold flat over their backs', 'long, paired cerci' and 'long, multiple-segmented antennae'. Troutnut's Isoperla page describes specimens with 'plain yellow bodies, but on closer inspection turn out to have striking, fiery red abdomens', and First Nature describes Isoperla grammatica as a medium-sized stonefly appearing as 'a sulphur yellow blur in the summer sunshine', hatching during the heat of the day.

*Wrong:*
- 'sometimes red-tipped abdomen' - understated and slightly off. Troutnut describes whole 'fiery red abdomens' under apparently plain yellow bodies, not merely a red tip. The red-tip formulation comes from fly-tying convention rather than the entomological description.
- 'flat wings' with no colour - Isoperla adult wings are pale yellowish and translucent, not stated.

*Missing:*
- Four wings in two pairs (the prompt does say two pairs, so this is covered, but the wings extending past the abdomen tip is not).
- Wing colour: pale yellowish-hyaline with yellow-brown venation.
- Body colour: sulphur to greenish yellow, often with a darker median line down the head, pronotum and abdomen.
- Size: small to medium, roughly 8 to 15 mm - Troutnut is explicit that Isoperla species-level identification is hard and the sources consulted are genus-level, so size and exact pattern vary across a very large genus.
- Adults are day-fliers, active in bright sun (First Nature), which is why the yellow is so conspicuous.

*Sources:* [1](https://www.troutnut.com/hatch/1115/Stonefly-Isoperla-Yellow-Sallies) · [2](https://www.first-nature.com/insects/p-isoperla-grammatica.php) · [3](https://en.wikipedia.org/wiki/Plecoptera)
*Confidence:* medium

### `sw-bay-anchovy`
**What it actually looks like:** The bay anchovy (Anchoa mitchilli) is "a small, slender, schooling fish" of about 6 cm (max 10-11 cm) with "a greenish body and a silvery stripe," "a single dorsal fin" located "directly above the anal fin origin," and a very long jaw. FishBase gives the diagnostic head: "Snout fairly blunt, a little over 1/2 eye diameter" with the "maxilla long, tip pointed, reaching beyond hind border of pre-operculum, almost to gill opening." Sources disagree on the jaws: Wikipedia states the lower jaw extends beyond the upper, while FishBase's description of a blunt projecting snout over a very long maxilla matches the standard engraulid arrangement of an overhanging snout and an inferior mouth.

*Wrong:*
- "Scientific entomological illustration" — this is a fish; house style for fish is 'Scientific natural-history illustration'
- "the NC fall albie bait" is angling context inside the visual description and gives the illustrator nothing
- "Accurate anatomy." is asserted while the one diagnostic feature — the enormous mouth with the maxilla reaching almost to the gill opening — is absent
- "minnow" — a bay anchovy is an engraulid, not a minnow (Cyprinidae); the word may steer the model toward a freshwater shiner

*Missing:*
- The very long maxilla reaching back almost to the gill opening under a short blunt projecting snout
- A single dorsal fin sitting directly above the origin of the long anal fin
- Forked tail; small pectoral fins low on the body
- The silvery lateral stripe on a translucent greenish body, white belly
- Size about 6 cm; very slender, laterally compressed body; scales loose and easily shed

*Sources:* [1](https://en.wikipedia.org/wiki/Bay_anchovy) · [2](https://www.fishbase.se/summary/Anchoa-mitchilli.html)
*Confidence:* medium

### `sw-crab`
**What it actually looks like:** A true crab is a decapod with ten legs (five pairs, the first pair being chelipeds/claws); Wikipedia's Crab page describes the carcinised body as having "a carapace ... flatter than it is broad" with the pleon (abdomen) "flattened and strongly bent," folded forward beneath the body and hidden in dorsal view. Eyes are on short stalks and there are two pairs of antennae. Many run "crabwise" (sideways); swimming crabs such as Callinectes have the last pair of legs flattened into paddles.

*Wrong:*
- "side view underwater" directly conflicts with "Round or oval carapace" — a crab's carapace outline and its leg arrangement are only visible from above; a strict side view of a crab is a thin edge-on sliver and hides everything the note asks for
- "Scientific entomological illustration" — a crab is a crustacean, not an insect; house style here should be 'Scientific natural-history illustration'
- "claws up, scuttles sideways and dives to bottom" is behaviour, not anatomy, and 'claws up' describes a defensive posture rather than an identifying feature
- "Accurate anatomy." is asserted while no leg count is given at all — the most common failure mode for crab illustrations

*Missing:*
- Ten legs total: five pairs, the front pair being the chelipeds with pincers, four pairs of walking legs behind
- The reduced abdomen folded flat forward under the body and hidden from above
- Two short eyestalks set in sockets on the front edge of the carapace, and two pairs of antennae
- Spines or teeth along the front-side margins of the carapace
- If a swimming crab is intended, the flattened paddle-shaped last pair of legs

*Sources:* [1](https://en.wikipedia.org/wiki/Crab) · [2](https://en.wikipedia.org/wiki/Decapoda)
*Confidence:* medium

### `sw-finger-mullet`
**What it actually looks like:** 'Finger mullet' is the juvenile striped/flathead grey mullet (Mugil cephalus). FishBase describes a "stout, cylindrical" body "slightly compressed" with a "broad and flattened" head, two separate dorsal fins (first with 5 spines, second with 7-9 soft rays), an anal fin of 3 spines and 8-9 soft rays, a "well developed adipose eyelid" covering "most of pupil," and an upper lip "thin and without papillae." Wikipedia gives an "olive-green" back with "sides ... silvery and shad[ing] to white towards the belly" and "six to seven distinctive lateral horizontal stripes," and notes the mullet "has no lateral line."

*Wrong:*
- "Scientific entomological illustration" — this is a fish; house style for fish is 'Scientific natural-history illustration'
- "Small mullet pouring out of the marsh in the fall run" is the whole description — it is angling narrative, not anatomy, and 'pouring out' invites a picture of a school rather than one specimen
- "Accurate anatomy." is asserted while the prompt names not one anatomical feature: no fins, no head shape, no colour, no tail

*Missing:*
- Stout, near-cylindrical, only slightly compressed body — not a deep or a flat one
- Two widely separated dorsal fins: a small spiny first dorsal near mid-back, then a soft second dorsal well behind it
- Broad flattened head with a small terminal mouth and a thin upper lip
- Forked tail
- Large scales; olive-green back, silver sides, white belly, with six to seven faint dark horizontal stripes along the scale rows
- No visible lateral line; an adipose eyelid over the eye in larger fish
- Size 3-5 in for a juvenile

*Sources:* [1](https://www.fishbase.se/summary/Mugil-cephalus.html) · [2](https://en.wikipedia.org/wiki/Flathead_grey_mullet)
*Confidence:* high

### `sw-glass-minnow`
**What it actually looks like:** The Atlantic silverside (Menidia menidia) is a slender, nearly translucent schooling fish of 5-9 cm (max about 15 cm) with a "broad silver stripe running down each side" alongside the lateral line, brown speckling on the top of the head and back, "one spiny and one soft dorsal fin" with the first set well back on the body, and a large mouth; it lacks an adipose fin. Note the name is ambiguous — in the Gulf and Florida "glass minnow" is more often applied to the bay anchovy (Anchoa mitchilli), and in the Northeast to silversides.

*Wrong:*
- "Scientific entomological illustration" — this is a fish, not an insect; house style for fish is 'Scientific natural-history illustration'
- "A Glass Minnow / Silverside" — the prompt should name the species, because 'glass minnow' is applied to two unrelated fish (silversides, Atherinopsidae, and bay anchovy, Engraulidae) with quite different heads and mouths
- "Accurate anatomy." is asserted but no anatomy is actually specified — there are no fins, no tail shape, no eye

*Missing:*
- Two separate dorsal fins — a small spiny first dorsal set well back, then a soft second dorsal
- Forked caudal fin
- Large eye near the front of a small pointed head
- Fine dark speckling over a greenish translucent back, white belly (countershading), with the silver stripe running above the lateral line
- Size 5-9 cm; slender, only slightly compressed body

*Sources:* [1](https://en.wikipedia.org/wiki/Atlantic_silverside) · [2](https://www.fishbase.se/summary/Menidia-menidia.html)
*Confidence:* medium

### `sw-mud-minnow`
**What it actually looks like:** In salt marshes 'mud minnow' means the mummichog (Fundulus heteroclitus), a killifish: "elongate but thick" body with a deep caudal peduncle, typically 7.5-9 cm and up to 15 cm, with the mouth "upturned and the lower jaw protrud[ing] when the mouth is closed," round pectoral and tail fins, and males "dark olive-green on the back, steel-blue on the sides with about 15 silvery bars, and yellow or orange-yellow on the underside" while females are "paler, without bars." It lives in "salt marshes, muddy creeks, tidal channels ... eelgrass or cordgrass beds." Note the true mudminnows (Umbra, Umbridae) are unrelated freshwater fish.

*Wrong:*
- "Scientific entomological illustration" — this is a fish; house style for fish is 'Scientific natural-history illustration'
- "Mud Minnow / Killifish" — 'mudminnow' is the accepted common name of the freshwater genus Umbra, a different family entirely; in a saltwater context the species should be named as the mummichog, Fundulus heteroclitus
- "Stubby, olive-brown" — the source describes it as "elongate but thick" rather than stubby, and olive-green on the back with steel-blue sides rather than uniformly olive-brown
- "Accurate anatomy." is asserted while no fins beyond the tail are specified

*Missing:*
- The upturned mouth with the lower jaw protruding — the most recognisable feature of the head
- About fifteen thin silvery-white vertical bars along the male's steel-blue sides (females plain and paler)
- A single small dorsal fin set far back on the body, close to the tail, and rounded pectoral fins
- Yellow or orange belly on breeding males; a dark eyespot at the rear of the male's dorsal fin
- Deep caudal peduncle; size 7.5-9 cm

*Sources:* [1](https://en.wikipedia.org/wiki/Mummichog)
*Confidence:* high

### `sw-palolo`
**What it actually looks like:** Palolo worms are eunicid polychaetes; Britannica describes adults "about 40 cm (16 inches) long ... divided into ringlike segments, each with paddlelike appendages bearing gills," and it is the epitoke — "the tail section ... bearing reproductive cells" — that detaches and swims to the surface to spawn. The Atlantic species is Eunice furcata (E. schemacephala); Britannica says it "swarms during the last quarter of the June–July Moon," while Keys Weekly reports the Florida Keys swarms of "little reddish worms" happen "around the late May full moon and early June new moon." Britannica gives Pacific males as reddish brown and females bluish green.

*Wrong:*
- "Scientific entomological illustration" — a polychaete is an annelid worm, not an insect; house style here should be 'Scientific natural-history illustration'
- "spring full-moon hatch" — sources disagree and none support a flat 'spring full moon': Britannica puts the Atlantic swarm at the last quarter of the June-July moon, and Keys Weekly at the late-May full moon and the early-June new moon. The moon phase is not a visual feature in any case
- "swims near surface" is behaviour standing in for anatomy; the prompt gives no body detail beyond 'segmented'
- "Accurate anatomy." is asserted while nothing anatomical is specified beyond the word 'segmented'

*Missing:*
- That the swimming animal is the epitoke — the detached posterior portion of the worm, not a whole worm with a head
- A pair of paddle-like appendages (parapodia) bearing bristles and gills on every single segment, giving a fringed outline down both sides
- The ring-like segmentation is dense — dozens of short close-set rings, not a few big ones
- Undulating, ribbon-like swimming posture at the surface
- Colour is contested: Keys reports 'little reddish worms', Britannica gives reddish-brown males and bluish-green females

*Invented:*
- The specific pairing of 'spring' with 'full moon' — no source gives that combination for the Atlantic palolo

*Sources:* [1](https://www.britannica.com/animal/palolo-worm) · [2](https://keysweekly.com/42/worm-wonders-a-tiny-reef-creature-lures-the-keys-tarpon/) · [3](https://en.wikipedia.org/wiki/Palolo_worm)
*Confidence:* medium

### `sw-pilchard`
**What it actually looks like:** The scaled sardine (Harengula jaguana) is a herring: FishBase describes a "fusiform" but "compressed" body whose "lower profile [is] decidedly more curved than the flattened upper profile," scales "fairly strongly attached, not easily lost" (hence 'scaled sardine'), a single soft dorsal of 13-21 rays with no spines, "no orange or red spot at opercle," maximum 21.2 cm TL and common length about 12 cm. Like other Clupeidae it has a keel of belly scutes and a deeply forked tail; the back is bluish-green over bright silver sides.

*Wrong:*
- "Scientific entomological illustration" — this is a fish; house style for fish is 'Scientific natural-history illustration'
- "schools \"raining\" when chased" is behaviour and belongs nowhere in a single-specimen field-guide plate; it risks the model drawing a school or a splash
- "Accurate anatomy." is asserted while no fin, tail or head detail is given

*Missing:*
- The deeply curved belly profile against a flatter back — the shape that distinguishes it from a round-bodied herring
- The keel of sharp scutes along the belly
- A single short soft-rayed dorsal fin near mid-body, no spines
- Deeply forked tail
- Large eye and upturned mouth; large firmly attached silvery scales
- Size: commonly about 12 cm (the entry's 2-4 in is a juvenile)

*Sources:* [1](https://www.fishbase.se/summary/Harengula-jaguana.html)
*Confidence:* medium

### `sw-sand-eel`
**What it actually looks like:** The American sand lance (Ammodytes americanus) has "a long, thin body with a pointed snout" and "a lower jaw that extends well beyond the upper," a long low very delicate dorsal fin running "along most of its back," small pectorals, a forked caudal fin, and countershading — "muted brownish-green dorsal side transitioning to white sides and stomach," overall greenish-silver, with the lateral line marking the colour change. Mature fish are 10-15 cm, occasionally 18 cm, and burrow head-first into sand.

*Wrong:*
- "Scientific entomological illustration" — this is a fish; house style for fish is 'Scientific natural-history illustration'
- "pointed head" understates and mis-states the diagnostic: the snout is pointed because the lower jaw projects well beyond the upper, giving an underslung look
- "olive back, silver sides" is close but the source describes brownish-green above grading to white sides and belly with an overall greenish-silver cast — the countershading is not stated as a gradient
- "Accurate anatomy." is asserted while no fins are specified at all

*Missing:*
- No pelvic fins — the most diagnostic single feature of a sand lance
- A single very long low dorsal fin running along most of the back, and a long anal fin behind the mid-body
- Forked caudal fin
- Small pectoral fins set low and well forward
- Oblique skin folds along the flanks and the visible lateral line at the colour boundary
- Size 10-15 cm

*Sources:* [1](https://en.wikipedia.org/wiki/Ammodytes_americanus)
*Confidence:* high

### `sw-shrimp`
**What it actually looks like:** A shrimp is a decapod crustacean: Wikipedia's Decapoda page states they have "ten ... legs" (five pairs of pereiopods on the last five thoracic segments, one or two pairs bearing chelae), "five more pairs of appendages on the abdomen" (pleopods/swimmerets), and "one final pair called uropods, which, with the telson, form the tail fan"; the carapace covers the cephalothorax and the eyes are stalked. Carideans show the characteristic 'caridean bend' where the second abdominal segment overlaps the first and third; they escape by flicking the tail fan, driving them backwards.

*Wrong:*
- "Scientific entomological illustration" — a shrimp is a crustacean, not an insect; house style here should be 'Scientific natural-history illustration'
- "A Shrimp" with no species or family — penaeid shrimp (the common Gulf/Atlantic fly prey) and caridean grass shrimp differ in body curve, rostrum and claw arrangement, so an unnamed shrimp gives the model nothing to anchor on
- "kicks backward" is behaviour rather than anatomy; without the tail fan being described it cannot be drawn
- "Accurate anatomy." is asserted while every count — legs, swimmerets, antennae — is absent

*Missing:*
- Five pairs of walking legs (ten legs), the front pairs tipped with small pincers
- Five pairs of feathery swimmerets under the abdomen
- Telson plus a pair of uropods forming the fan-shaped tail
- Two pairs of antennae — short antennules and one pair of very long whip-like antennae, often longer than the body
- A toothed rostrum projecting forward between the stalked eyes
- Carapace over the cephalothorax, then a six-segmented abdomen, bent in carideans

*Sources:* [1](https://en.wikipedia.org/wiki/Decapoda) · [2](https://en.wikipedia.org/wiki/Caridea)
*Confidence:* medium

### `sw-squid`
**What it actually looks like:** Wikipedia's Squid page states squids have "eight arms and two distinctive tentacles" round the mouth, each "flexible and prehensile, usually bearing disc-like suckers" whose "rims are stiffened with chitin"; the paired eyes sit "on either side of the head"; "swimming fins" run along "each side" of the mantle; water is "expelled out of the funnel in a fast, strong jet"; and the mouth holds "a sharp, horny beak." The longfin inshore squid (Doryteuthis pealeii), the usual northeast bait, is often "seen with a reddish hue" and shifts "from deep red to soft pink" via chromatophores.

*Wrong:*
- "Scientific entomological illustration" — a squid is a cephalopod mollusc, not an insect; house style here should be 'Scientific natural-history illustration'
- "jets backward" is behaviour used in place of the funnel/siphon that produces it
- "Accurate anatomy." is asserted while the prompt gives no arm count and no tentacle count — for a squid this is the single most important number and its absence is what produces octopus-like or ten-identical-arm results

*Missing:*
- Eight arms plus two distinctly longer tentacles — ten appendages, not all alike
- The two tentacles are longer than the arms and widen into a sucker-bearing club at the tip
- Rows of small stalked suckers along the arms
- The funnel/siphon projecting beneath the head
- The chitinous beak at the centre of the arm crown
- Red-brown chromatophore speckling over a translucent pinkish-white body rather than a flat pinkish wash
- Fin shape — for Doryteuthis, long triangular fins occupying roughly the rear half of the mantle

*Sources:* [1](https://en.wikipedia.org/wiki/Squid) · [2](https://en.wikipedia.org/wiki/Doryteuthis_pealeii)
*Confidence:* high

