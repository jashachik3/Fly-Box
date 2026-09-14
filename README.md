# Fly Box

A private fly fishing companion — plan a trip, drill what you need to know,
log what actually happened, and let the log sharpen the next two.

Phone home-screen PWA. No account, no App Store, no server.

## Two layers, kept apart

| | Content layer | User layer |
|---|---|---|
| Lives in | `content/` → compiled into the app | IndexedDB on the phone |
| Written by | you, at a keyboard | you, on the water |
| Changes | version bump, ships with a build | migrates on its own schedule |
| If lost | rebuild from the repo | gone forever |

They only ever meet by id reference. A content update must never be able to
touch a session, and a season of logs must survive every content release.

```
Fly Box/
  content/            authored data + schema + build     → see content/README.md
    data/*.json
    schema.mjs  validate.mjs  build.mjs  query-demo.mjs
  app/                Vite + React PWA
    src/content/      bundle.json (generated — do not edit) + query.js
    src/user/         the log: schema, store, API, rates, review, export
    src/ui/           Plan · Learn · Log · Box
  tools/
    log-demo.mjs      runs the user layer end to end, doubles as a test
```

## On your phone

See **[SETUP.md](SETUP.md)**. Short version: push to GitHub, turn on Pages with
the GitHub Actions source, open the URL on your phone, Add to Home Screen.
`.github/workflows/deploy.yml` validates the content and runs the log tests
before it publishes, so a bad content edit fails the build rather than reaching
the water.

## Commands

```bash
cd app && npm install         # once

npm run dev                   # build content, then serve the app
npm run build                 # build content, then build the PWA into app/dist
npm run check                 # validate content + run the log tests

node content/query-demo.mjs   # trip slate, field ID, and a generated quiz card
node tools/log-demo.mjs       # the log layer, with assertions
```

`npm run dev` and `npm run build` both recompile the content bundle first, so
editing `content/data/*.json` and reloading is the whole authoring loop.

Both demos are runnable proofs, not documentation. If one stops printing what
it claims, a design decision has quietly broken.

## The four decisions this is built on

*Settled 14 September 2026.*

1. **Regional content is drafted, then reviewed by you.** Every record carries
   `status` and `sources`; `NEEDS REVIEW` means it has not been checked. Never
   generated at runtime — a wrong tide note is worse than no tide note.

2. **The book and your log are both shown, with `n`.** Nothing is silently
   overridden in either direction. Sessions record what the app recommended
   *before* you fished, so going off script is visible as a choice rather than
   disappearing into the data.

3. **Saltwater leads.** Bahamas bonefish is the first brief and the first trip
   pack; tide, wind and flats selection get built properly. Freshwater flow and
   hatch timing follow.

4. **The log describes, it does not infer.** Rates, splits and filters — no
   model, no conditions-in-fly-out prediction. Revisit when there are seasons
   of data behind it, not before.

## Two rules that are expensive to retrofit

**Review state attaches to concept IDs, never to card text.** A generated
scenario dresses one fact a dozen ways; if the scheduler keyed off the rendered
question, every card would look new forever. See `content/schema.mjs → CONCEPT`.

**Retrieve is data, not prose.** Strip length, speed, pause, and *when the eat
happens* live in `content/data/retrieves.json`, so they can be shown on a slate,
drilled as a card, and overridden per condition. Most flats flies are eaten on
the pause; a fleeing baitfish is eaten mid-strip; a crab is eaten on the drop.

**Hours are tracked per rig, as stints.** Catch counts without a denominator
say nothing: fish a Walt's Worm 80% of your hours and it will top any list
whether or not it is good. Every catch belongs to exactly one stint, which is
what makes fish-per-hour a subtraction rather than a guess.

## The four tabs

**Plan** — region, species, month. Gives you what decides the day here, the
fish, what is around this month, a fly slate and the rig. Two buttons take it
with you: *Study this deck* filters Learn to this trip, *Use as today's slate*
carries it to the Log as the session's recorded recommendation.

**Learn** — the review queue, scheduled on concept IDs. One fact gets dressed
several ways: identify the stage, match the fly, or a generated scenario with
real conditions. Decks are queries, so a trip deck costs nothing.

**Log** — start a session, put a rig on, `+ Fish`. Three taps: species, size,
which fly ate. Then your numbers, with `n` on every row, and the book-vs-log
table when a slate was recorded.

**Box** — two halves. *Flies* is what you are carrying, by pattern and colour
variant; with a slate loaded it shows the gap list, what the brief wants that
your box does not have. *Gear* is the locker: your actual rods, reels and
lines by brand, model and spec, grouped into named outfits. Replacing a piece
links old to new in both directions, so the chain reads back to whatever you
started with — which is the only way to answer "what was this?" three years
after it broke.

## Where this is going

Built: the content layer, the log layer, the review scheduler, and all four
tabs as a working offline PWA.

Next: images wired into the cards (the whole Learn tier steps up when you are
identifying a photo rather than reading a description) · the field-ID key
(`keyCandidates` in `query.js` is the primitive, it needs a screen) · the
Bahamas brief authored properly and trip packs cached for offline · live data
from NOAA, USGS and Open-Meteo through `log.enrich()`.

Outstanding: migrate the existing `flyfish-content.json` and its ~116 colour
variants into `content/data/`, and point `image` paths at the generated asset
set.
