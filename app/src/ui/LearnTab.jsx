import React, { useEffect, useMemo, useState } from 'react';
import { bundle, concepts, record, assetUrl, deckMembers } from '../content/index.js';
import { deckFilter, renderCard, retrieveLine, setWord, choicesFor } from '../content/query.js';
import { buildQueue, grade, newCard, progress, GRADE } from '../user/review.mjs';
import { store } from '../state/db.js';
import { useAsync } from '../state/useAsync.js';
import { Card, Label, Empty, Pill, Meter, Sheet, Diagram } from './bits.jsx';

/**
 * Images are generated separately and may simply not be there yet. A broken
 * image icon on a study card is worse than no image, so a file that fails to
 * load removes itself and the card reads exactly as it did before.
 */
function CardImage({ src, alt }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <img className="cardimg" src={assetUrl(src)} alt={alt} loading="lazy"
         onError={() => setOk(false)} />
  );
}

function ChoiceImage({ src }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return <img className="choiceimg" src={assetUrl(src)} alt="" loading="lazy" onError={() => setOk(false)} />;
}

const GRADES = [
  { g: GRADE.AGAIN, label: 'Again', cls: 'again' },
  { g: GRADE.HARD, label: 'Hard', cls: '' },
  { g: GRADE.GOOD, label: 'Good', cls: '' },
  { g: GRADE.EASY, label: 'Easy', cls: 'easy' },
];

// Headings, in the order they are shown. The slugs come from VOCAB.deckGroup;
// the words are for a person standing in a parking lot deciding what to drill.
const GROUPS = [
  ['destination', 'Where you are going'],
  ['quarry', 'What you are after'],
  ['technique', 'How you are fishing'],
  ['fundamentals', 'Fundamentals'],
];

const EVERYTHING = { id: null, name: 'Everything', blurb: 'Every card in the app, in scheduled order.' };
const TRIP = 'trip';

// ---------------------------------------------------------------------------

/**
 * Decks are queries, not lists. The named ones are resolved at build time into
 * bundle.index.deckConcepts, so choosing one is a set lookup; the trip deck is
 * resolved live, because the trip changes on the phone.
 */
function deckPredicate(deck, trip) {
  let key = deck;
  if (deck === TRIP) {
    if (!trip?.regionId) return () => true;
    key = trip.speciesId ? `${trip.regionId}.${trip.speciesId}` : trip.regionId;
  }
  if (!key) return () => true;

  const members = deckMembers(key);
  // Either a deck id left over from an older build, or a trip whose region and
  // species pair was not precomputed. Fall back to the live filter rather than
  // showing an empty tab with no explanation.
  if (!members) {
    return deck === TRIP
      ? deckFilter(bundle, { region: trip.regionId, species: trip.speciesId ?? undefined })
      : () => true;
  }
  return (c) => members.has(c.id);
}

function deckTitle(deck, trip) {
  if (deck === TRIP) {
    return trip?.regionId
      ? { name: record('regions', trip.regionId)?.name ?? 'This trip', blurb: 'Only what this trip needs.' }
      : EVERYTHING;
  }
  return record('decks', deck) ?? EVERYTHING;
}

function DeckPicker({ deck, trip, cards, onPick, onClose }) {
  // Per-deck progress is only worth computing while the sheet is open.
  const stats = useMemo(() => {
    const out = {};
    for (const d of bundle.tables.decks) {
      const ids = deckMembers(d.id) ?? new Set();
      out[d.id] = progress(concepts.filter((c) => ids.has(c.id)), cards ?? []);
    }
    out.__all = progress(concepts, cards ?? []);
    if (trip?.regionId) {
      out.__trip = progress(concepts.filter(deckPredicate(TRIP, trip)), cards ?? []);
    }
    return out;
  }, [cards, trip?.regionId, trip?.speciesId]);

  const Row = ({ id, name, blurb, s }) => (
    <button
      type="button"
      className={`deckrow${deck === id ? ' picked' : ''}`}
      onClick={() => { onPick(id); onClose(); }}
      aria-current={deck === id ? 'true' : undefined}
    >
      <div className="spread">
        <strong>{name}</strong>
        <span className="tiny num">{s ? `${s.known}/${s.total}` : ''}</span>
      </div>
      {blurb && <div className="tiny muted">{blurb}</div>}
      {s && <Meter known={s.known} learning={s.learning} total={s.total} />}
    </button>
  );

  return (
    <Sheet title="Pick a deck" onClose={onClose}>
      <div className="decklist">
        <h4 className="deckgroup">Start here</h4>
        <Row id={null} name={EVERYTHING.name} blurb={EVERYTHING.blurb} s={stats.__all} />
        {trip?.regionId && (
          <Row
            id={TRIP}
            name={`${record('regions', trip.regionId)?.name ?? 'This trip'} — this trip`}
            blurb="Follows whatever you have set on the Plan tab."
            s={stats.__trip}
          />
        )}

        {GROUPS.map(([group, heading]) => {
          const rows = bundle.tables.decks
            .filter((d) => d.group === group)
            .sort((a, b) => (a.sort ?? 99) - (b.sort ?? 99) || a.name.localeCompare(b.name));
          if (!rows.length) return null;
          return (
            <React.Fragment key={group}>
              <h4 className="deckgroup">{heading}</h4>
              {rows.map((d) => (
                <Row key={d.id} id={d.id} name={d.name} blurb={d.blurb} s={stats[d.id]} />
              ))}
            </React.Fragment>
          );
        })}
      </div>
      <div className="tiny">
        A deck is a filter, not a list — add a fly to the app and it joins every
        deck it belongs in. Your progress is kept per card, so switching decks
        never loses anything.
      </div>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------

export default function LearnTab({ trip, deck = null, setDeck, onDueCount }) {
  const { data: cards, reload } = useAsync(() => store.review.all(), []);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState(null);   // option key chosen on a multiple-choice card
  const [done, setDone] = useState(0);
  const [picking, setPicking] = useState(false);

  const filter = useMemo(
    () => deckPredicate(deck, trip),
    [deck, trip.regionId, trip.speciesId],
  );

  const heading = deckTitle(deck, trip);

  const queue = useMemo(
    () => (cards ? buildQueue(concepts, cards, { filter }) : null),
    [cards, filter],
  );

  const stats = useMemo(
    () => (cards ? progress(concepts.filter(filter), cards) : null),
    [cards, filter],
  );

  useEffect(() => {
    if (queue) onDueCount?.(queue.counts.due);
  }, [queue, onDueCount]);

  const item = queue ? (queue.due[0] ?? queue.fresh[0] ?? null) : null;

  // The variant is pinned per concept so a card does not change shape halfway
  // through being answered, but varies across reviews.
  const face = useMemo(
    () => (item ? renderCard(bundle, item.concept, { variant: done }) : null),
    [item, done],
  );

  // Four options, one right, shuffled once per card. Knots and leaders come
  // back null and keep the reveal-and-rate form.
  const choices = useMemo(
    () => (item && face ? choicesFor(bundle, item.concept, face, { seed: `${item.concept.id}|${done}` }) : null),
    [item, face, done],
  );

  async function answer(g) {
    if (!item) return;
    const base = item.card ?? newCard(item.concept.id, item.concept.kind);
    await store.review.put(grade(base, g));
    setRevealed(false);
    setPicked(null);
    setDone((n) => n + 1);
    reload();
  }

  // Multiple choice: the pick is the grade. Right on the first try is Good;
  // wrong is Again, and the card comes back in ten minutes. The answer is
  // shown either way, and Next moves on — so a wrong pick is a lesson before
  // it is a penalty.
  function choose(key) {
    if (picked != null) return;
    setPicked(key);
    setRevealed(true);
  }
  const pickedRight = choices && picked != null && picked === choices.answerKey;

  function pick(id) {
    setDeck(id);
    setRevealed(false);
    setPicked(null);
    setDone(0);
  }

  const answerBlock = revealed ? (
              <div className="answer">
                {/* A knot's answer IS the picture, so it gets the full diagram
                    treatment: readable inline, full screen on a tap. */}
                {face.answerImage && (face.kind === 'knot' || face.kind === 'rig')
                  ? <Diagram src={face.answerImage} alt={face.question}
                             hint={face.kind === 'knot' ? 'Tap for every step' : 'Tap for the whole leader'} />
                  : face.answerImage && !choices?.options.some((o) => o.image)
                    && <CardImage src={face.answerImage} alt="" />}
                {face.kind === 'knot' || face.kind === 'rig'
                  ? <pre>{face.answer}</pre>
                  : <div className="big">{face.answer}{face.size ? ` · ${face.size}` : ''}</div>}
                {face.because && <div className="muted">{face.because}</div>}

                {face.retrieve && face.kind !== 'retrieve' && (
                  <div className="retrieve">
                    <div className="spread">
                      <strong>{face.retrieve.name}</strong>
                      <span className="tiny">{setWord(face.retrieve)}</span>
                    </div>
                    <div className="tiny num">{retrieveLine(face.retrieve)}</div>
                    {face.retrieve.cue && <div className="muted">{face.retrieve.cue}</div>}
                  </div>
                )}

                {face.rigs?.length > 0 && <div className="tiny">Rig: {face.rigs.join(' or ')}</div>}
                <details className="whyline">
                  <summary className="tiny">Why this card</summary>
                  <div className="tiny">
                    Scheduled as one fact: <code>{face.concept}</code>
                  </div>
                </details>
              </div>
  ) : null;

  if (!queue || !stats) return <Empty>Loading…</Empty>;

  return (
    <>
      <section className="block">
        <div className="spread">
          <Label>{heading.name}</Label>
          <button type="button" className="small ghost" onClick={() => setPicking(true)}>
            Change deck
          </button>
        </div>
        <Card>
          {heading.blurb && <div className="tiny muted">{heading.blurb}</div>}
          <Meter known={stats.known} learning={stats.learning} total={stats.total} />
          <div className="row">
            <Pill tone="first">{stats.known} known</Pill>
            <Pill tone="hot">{stats.learning} learning</Pill>
            <Pill>{stats.unseen} unseen</Pill>
          </div>
          <div className="tiny">
            {queue.counts.due} due · {done} done this sitting
          </div>
        </Card>
      </section>

      {picking && (
        <DeckPicker
          deck={deck}
          trip={trip}
          cards={cards}
          onPick={pick}
          onClose={() => setPicking(false)}
        />
      )}

      {!item && (
        <Empty>
          Nothing due.<br />
          {stats.unseen > 0
            ? 'New cards are released a dozen a day so the backlog stays honest.'
            : 'You have seen every card in this deck. Pick another, or come back when they come due.'}
        </Empty>
      )}

      {item && !face && (
        <Empty>This concept has no card renderer yet: {item.concept.id}</Empty>
      )}

      {item && face && (
        <section className="block">
          <div className="study">
            {face.conditions?.length > 0 && (
              <div className="conditions">
                {face.conditions.filter(Boolean).map((c, i) => <Pill key={i}>{c}</Pill>)}
              </div>
            )}

            {face.image && <CardImage src={face.image} alt="" />}
            {face.seeing && <div className="seeing">{face.seeing}</div>}
            <div className="question">{face.question}</div>

            {!choices && answerBlock}
          </div>

          {choices ? (
            <>
              <div className={`choices${choices.options.some((o) => o.image) ? ' pictures' : ''}`}
                   role="group" aria-label="Answers">
                {choices.options.map((o) => {
                  const state = picked == null ? '' : o.correct ? ' right' : o.key === picked ? ' wrong' : ' dim';
                  return (
                    <button key={o.key} type="button" className={`choice${state}`}
                            onClick={() => choose(o.key)} disabled={picked != null}
                            aria-pressed={picked === o.key}>
                      {o.image && <ChoiceImage src={o.image} />}
                      <span className="choicetext">
                        <span className="choicelabel">{o.label}</span>
                        {o.sub && <span className="tiny">{o.sub}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
              {picked != null && <div className="study">{answerBlock}</div>}
              {picked != null && (
                <button type="button" className={`primary big${pickedRight ? '' : ' again'}`}
                        onClick={() => answer(pickedRight ? GRADE.GOOD : GRADE.AGAIN)}>
                  {pickedRight ? 'Right — next' : 'Not that one — back in 10 minutes'}
                </button>
              )}
              {picked == null && (
                <div className="tiny">
                  Pick one. Right first time and it comes back in days; wrong and it
                  comes back in ten minutes, with the answer shown now.
                </div>
              )}
            </>
          ) : revealed ? (
            <div className="grades">
              {GRADES.map((g) => (
                <button key={g.g} type="button" className={g.cls} onClick={() => answer(g.g)}>
                  {g.label}
                </button>
              ))}
            </div>
          ) : (
            <button type="button" className="primary big" onClick={() => setRevealed(true)}>
              Show answer
            </button>
          )}

          {!choices && (
            <div className="tiny">
              Rate yourself honestly — <strong>Again</strong> brings a card back in
              minutes, <strong>Good</strong> pushes it days out. The app uses that
              to decide what you see tomorrow.
            </div>
          )}
        </section>
      )}
    </>
  );
}
