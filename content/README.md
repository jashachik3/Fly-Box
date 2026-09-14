# Fly Box — content layer

This folder is the **content layer**: authored, versioned, read-only at runtime,
shipped with the build. It is deliberately separate from the **user layer**
(sessions, catches, review state, box inventory) which lives in IndexedDB on the
phone and must survive every content update.

Content updates are a version bump you can ship without fear. User data is not.
Never let them meet in the same file.

```
content/
  schema.mjs        field shapes, controlled vocabularies, concept-ID rules
  validate.mjs      checks data/ against schema.mjs — zero dependencies
  build.mjs         compiles data/ into app/src/content/bundle.json
  query-demo.mjs    proof that one table answers three different questions
  data/
    species.json    fish you are casting at
    regions.json    places, plus NOAA/USGS station hooks for phase 6
    organisms.json  things fish eat — bugs AND flats prey, one entity
    flies.json      patterns; colour variants are separate records
    knots.json      steps, uses, failure modes
    rigs.json       line, leader formula, fly roles, knot
    retrieves.json  how a fly is made to behave — strip, pause, when it eats
    matches.json    organism + stage -> fly, under conditions   <- the heart
    presence.json   what is available where, when               <- the calendar
```

## Commands

```bash
node content/validate.mjs            # check everything
node content/validate.mjs --images   # also check images exist in app/public/assets
node content/validate.mjs --strict   # treat warnings as failures
node content/build.mjs               # validate, then write the bundle
node content/query-demo.mjs          # see the three readings of the match table
```

`build.mjs` refuses to write a bundle when a reference does not resolve, so a
broken content edit can never reach the app.

## The two rules that matter

**1. Concept IDs are the review anchor, never card text.**

Spaced repetition state attaches to a stable concept ID — `match:baetis.dun>parachute-adams`
— and nothing else. A generated scenario card dresses the same underlying fact
a dozen different ways; if the scheduler keyed off the rendered question, every
card would look brand new forever and the whole system would degrade into
random quizzing.

So: rename a display name freely, **never renumber a slug**. Concept IDs are
derived in `schema.mjs → CONCEPT`; changing one of those formulas orphans every
review record that used it.

**2. A facet the rule does not declare is a facet the rule does not care about.**

`matches.json` rules carry facets — region, month, species, water type, time of
day, light, temperature, and the salt axes tide / depth / wind. Absent means
"applies regardless", which is a real answer and not missing data. That default
is what lets a sparse table still answer a question, and it is why the same
rules serve the trip brief, the field-ID key, and the quiz generator without
three separate content sets. `query-demo.mjs` demonstrates all three.

## Retrieves

`retrieves.json` exists because "strip it" is not an instruction. Each record
carries strip length in inches, speed, pause in seconds, **when the eat
happens**, and the set that follows — plus the animal behaviour it reproduces,
what the take feels like, and the way it is usually got wrong.

A fly carries a default retrieve; a match rule can override it, because the
same crab is fished one way at a tailing bonefish and another at a permit that
has already tracked it. `retrieveFor()` in `app/src/content/query.js` resolves
the override, and it is what the Plan tab and the quiz both read.

`eatTiming` is the field that earns the table. Most flats flies are eaten on
the pause, a fleeing baitfish is eaten mid-strip, and a crab is eaten on the
drop — and that single fact changes what you do with your hands.

## Adding content

Every record needs `id`, `name`, `status`, and whatever the shape in
`schema.mjs` marks required. Run `validate.mjs` — it names the file, the record
and the field for anything wrong, including a stage used on an organism that
does not declare it, and a colour variant pointing at the wrong base pattern.

`id` is a lowercase-hyphen slug and is permanent. Images and review history are
keyed to it.

**Colour variants** are separate records sharing a `family`, with `variantOf`
pointing at the base pattern. A variant may not point at another variant. Write
a match rule against the base pattern when any colour will do, and against a
specific variant when the colour is the decision — that distinction is the
content, and it is what lets the app answer "which colour, and why".

## Review workflow

Everything ships as `"status": "draft"` and carries `sources`. A `NEEDS REVIEW`
source means the claim was drafted and has not been checked yet. The validator
counts outstanding drafts on every run, and `build.mjs` records reviewed counts
per table in the bundle so the app can show its own confidence.

Review means: read it, correct it, replace the source note with where it
actually came from, flip `status` to `reviewed`. A wrong tide note is worse than
no tide note.

The current seed is entirely draft and salt-leaning by design — the Bahamas
bonefish path is the first brief. Region station IDs in `regions.json` are
assumptions and are flagged as such.

## Warnings are a to-do list

`validate.mjs` warns rather than fails on content gaps: an organism nothing
imitates, a fly with no match rule. Those are not bugs, they are the next
authoring session. Right now it flags a handful of flies — Woolly Buggers and a
couple of variants — with no rule, because nothing in `organisms.json` yet
represents what they imitate. Adding `sculpin` and `leech` organisms closes it.

## Still to do

- Migrate the existing `flyfish-content.json` (v0.2/v0.3, ~116 colour variants)
  into these files. The seed here is a working skeleton, not the real catalogue.
- Point `image` paths at the generated asset set and run `validate.mjs --images`.
- Add `sculpin` and `leech` organisms so the streamer patterns have targets.
- Add a spent-wing pattern; Parachute Adams is standing in for mayfly spinners.
