import React, { useEffect, useMemo, useState } from 'react';
import { bundle, concepts, record, assetUrl } from '../content/index.js';
import { deckFilter, renderCard, retrieveLine, setWord } from '../content/query.js';
import { buildQueue, grade, newCard, progress, GRADE } from '../user/review.mjs';
import { store } from '../state/db.js';
import { useAsync } from '../state/useAsync.js';
import { Card, Label, Empty, Pill, Meter } from './bits.jsx';

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

const GRADES = [
  { g: GRADE.AGAIN, label: 'Again', cls: 'again' },
  { g: GRADE.HARD, label: 'Hard', cls: '' },
  { g: GRADE.GOOD, label: 'Good', cls: '' },
  { g: GRADE.EASY, label: 'Easy', cls: 'easy' },
];

export default function LearnTab({ trip, onDueCount, tripOnly = false, setTripOnly }) {
  const { data: cards, reload } = useAsync(() => store.review.all(), []);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);

  // Decks are queries, not tables: "everything Bahamas" is a filter over the
  // concept list, so a trip deck costs nothing to create and never goes stale.
  const filter = useMemo(
    () => (tripOnly && trip.regionId
      ? deckFilter(bundle, { region: trip.regionId, species: trip.speciesId ?? undefined })
      : () => true),
    [tripOnly, trip.regionId, trip.speciesId],
  );

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

  async function answer(g) {
    if (!item) return;
    const base = item.card ?? newCard(item.concept.id, item.concept.kind);
    await store.review.put(grade(base, g));
    setRevealed(false);
    setDone((n) => n + 1);
    reload();
  }

  if (!queue || !stats) return <Empty>Loading…</Empty>;

  return (
    <>
      <section className="block">
        <div className="spread">
          <Label>{tripOnly && trip.regionId ? record('regions', trip.regionId)?.name ?? 'Trip deck' : 'Everything'}</Label>
          <button
            type="button"
            className="small ghost"
            onClick={() => setTripOnly(!tripOnly)}
            disabled={!trip.regionId}
          >
            {tripOnly ? 'Study everything' : 'Study this trip'}
          </button>
        </div>
        <Card>
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

      {!item && (
        <Empty>
          Nothing due.<br />
          {stats.unseen > 0
            ? 'New cards are released a dozen a day so the backlog stays honest.'
            : 'You have seen every card in this deck. Come back when they come due.'}
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

            {revealed && (
              <div className="answer">
                {face.answerImage && <CardImage src={face.answerImage} alt="" />}
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
            )}
          </div>

          {revealed ? (
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

          <div className="tiny">
            Rate yourself honestly — <strong>Again</strong> brings a card back in
            minutes, <strong>Good</strong> pushes it days out. The app uses that
            to decide what you see tomorrow.
          </div>
        </section>
      )}
    </>
  );
}
