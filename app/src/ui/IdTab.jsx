import React, { useMemo, useState } from 'react';
import { bundle, record, nameOf, MONTHS } from '../content/index.js';
import { fieldKey, identify, retrieveFor, retrieveLine } from '../content/query.js';
import { QUESTIONS, QUESTION_ORDER, sizeWords } from '../content/traits.js';
import { Card, Label, Empty, Pill, Strength } from './bits.jsx';
import { formatHookRange } from '../../../content/hooksize.mjs';

// The field key. You have a bug on your thumb, or a shape in the water, and
// you want to know what it is and what to tie on — in the time it takes the
// fish to move off. So: chips, not dropdowns; answer what you can see, skip
// what you cannot; the list narrows as you go and never empties silently.

import Pic from './Pic.jsx';

const Thumb = ({ src, subject, big = false }) => (
  <Pic src={src} subject={subject} className={big ? 'keyimg' : 'thumb'} />
);
const bugSubject = (org, st) => ({ kind: 'organism', id: `${org.id}.${st.stage}`, label: `${org.name} — ${st.stage}` });

const SHOW = 12;

export default function IdTab({ trip }) {
  const [answers, setAnswers] = useState({});
  const [open, setOpen] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const region = trip.regionId ? record('regions', trip.regionId) : null;
  // With a region set, only that water's organisms are offered. Without one,
  // the first question stands in: a crab is saltwater, a mayfly is not.
  const water = region?.water ?? null;

  const hits = useMemo(
    () => fieldKey(bundle, answers, { region: trip.regionId, month: trip.month, water }),
    [answers, trip.regionId, trip.month, water],
  );

  const total = useMemo(
    () => fieldKey(bundle, {}, { water }).length,
    [water],
  );

  const insect = answers.shape == null || answers.shape === 'insect';
  const answered = Object.values(answers).filter(Boolean).length;
  const aroundCount = hits.filter((h) => h.around).length;

  const set = (q, v) => {
    setOpen(null);
    setShowAll(false);
    setAnswers((a) => {
      const next = { ...a, [q]: a[q] === v ? null : v };
      // Switching away from insect drops answers to questions that no longer
      // apply, rather than silently filtering on a wing the crab does not have.
      if (q === 'shape' && next.shape !== 'insect') {
        for (const k of QUESTION_ORDER) if (QUESTIONS[k].insectOnly) next[k] = null;
      }
      return next;
    });
  };

  const clear = () => { setAnswers({}); setOpen(null); setShowAll(false); };

  const shown = showAll ? hits : hits.slice(0, SHOW);

  return (
    <>
      <section className="block">
        <Label>What are you looking at?</Label>
        <div className="tiny">
          Answer what you can see. Skip what you can't. The list narrows as you go.
          {region
            ? ` Ranking what is around ${region.name} in ${MONTHS[trip.month - 1]} first.`
            : ' Set a region on Plan and what is around there this month comes first.'}
        </div>
        <Card>
          {QUESTION_ORDER.map((q) => {
            const def = QUESTIONS[q];
            if (def.insectOnly && !insect) return null;
            const picked = answers[q];
            // An answered question folds down to its one chip. Six open chip
            // groups put the results a screen and a half below the thumb; the
            // point is to watch the list shrink as you tap.
            const options = picked ? def.options.filter(([v]) => v === picked) : def.options;
            return (
              <fieldset className="chipset" key={q}>
                <legend>{def.label}{picked ? <span className="tiny"> · tap to change</span> : null}</legend>
                <div className="row">
                  {options.map(([v, label]) => (
                    <button key={v} type="button" className="chip"
                            aria-pressed={picked === v}
                            onClick={() => set(q, v)}>
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
            );
          })}
          {answered > 0 && (
            <div className="spread">
              <span className="tiny">
                {hits.length === 0 ? 'Nothing fits' : `${hits.length} of ${total} fit`}
                {aroundCount > 0 ? ` · ${aroundCount} around now` : ''}
              </span>
              <button type="button" className="small ghost" onClick={clear}>Clear</button>
            </div>
          )}
        </Card>
      </section>

      <section className="block">
        <Label>
          {hits.length === total
            ? `All ${total} stages`
            : `${hits.length} of ${total} stages fit`}
          {aroundCount > 0 && hits.length > aroundCount ? ` · ${aroundCount} around now` : ''}
        </Label>

        {hits.length === 0 && (
          <Empty>
            Nothing fits all of that at once.<br />
            Drop the answer you are least sure of — usually size or colour.
          </Empty>
        )}

        {hits.length > 0 && (
          <Card flush>
            {shown.map((h) => {
              const key = `${h.organism.id}.${h.stage.stage}`;
              const isOpen = open === key;
              return (
                <div key={key}>
                  <button type="button" className="listrow" aria-expanded={isOpen}
                          onClick={() => setOpen(isOpen ? null : key)}>
                    <Thumb src={h.stage.image ?? h.organism.image} subject={bugSubject(h.organism, h.stage)} />
                    <div className="grow">
                      <div className="name">{h.organism.name} — {h.stage.stage}</div>
                      <div className="sub">
                        {sizeWords(h.sizeMm)}
                        {h.stage.hookSizes ? ` · #${formatHookRange(h.stage.hookSizes)}` : ''}
                        {h.stage.where ? ` · ${h.stage.where}` : ''}
                      </div>
                    </div>
                    {h.around && <Pill tone={h.around === 'peak' ? 'first' : ''}>{h.around}</Pill>}
                  </button>
                  {isOpen && <StageDetail hit={h} trip={trip} />}
                </div>
              );
            })}
            {!showAll && hits.length > SHOW && (
              <button type="button" className="listrow" onClick={() => setShowAll(true)}>
                <div className="grow tiny">Show {hits.length - SHOW} more</div>
                <div className="tiny">or answer another question</div>
              </button>
            )}
          </Card>
        )}
      </section>
    </>
  );
}

function StageDetail({ hit, trip }) {
  const { organism: org, stage: st } = hit;
  const flies = useMemo(
    () => identify(bundle, org.id, st.stage, { region: trip.regionId ?? undefined, month: trip.month }),
    [org.id, st.stage, trip.regionId, trip.month],
  );

  // One row per fly; the table can name the same fly under two rules.
  const seen = new Set();
  const rows = flies.filter((m) => (seen.has(m.fly) ? false : (seen.add(m.fly), true)));

  return (
    <div className="keydetail">
      <Thumb src={st.image ?? org.image} subject={bugSubject(org, st)} big />
      {st.look && <div>{st.look}</div>}
      {st.behavior && <div className="muted">{st.behavior}</div>}
      {st.colors?.length > 0 && (
        <div className="row">
          {st.colors.map((c) => <Pill key={c} tone="plain">{c}</Pill>)}
        </div>
      )}
      {org.notes && <div className="tiny">{org.notes}</div>}

      <div className="keyflies">
        <div className="tiny">Tie on</div>
        {rows.length === 0 && <div className="muted">No fly in the box imitates this stage yet.</div>}
        {rows.slice(0, 6).map((m) => {
          const fly = record('flies', m.fly);
          const r = retrieveFor(bundle, m);
          return (
            <div className="listrow" key={m.id}>
              <Thumb src={fly?.image} subject={fly ? { kind: 'fly', id: fly.id, label: fly.name } : null} />
              <div className="grow">
                <div className="name">{fly?.name ?? m.fly}</div>
                <div className="sub">
                  {m.hookSizes ? `#${formatHookRange(m.hookSizes)}` : ''}
                  {fly?.weight ? ` · ${fly.weight}` : ''}
                  {m.rigs?.length ? ` · ${nameOf('rigs', m.rigs[0])}` : ''}
                </div>
                {r && <div className="slate-retrieve">{r.name}: {retrieveLine(r)}</div>}
                {m.presentation && <div className="tiny">{m.presentation}</div>}
              </div>
              <Strength value={m.strength} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
