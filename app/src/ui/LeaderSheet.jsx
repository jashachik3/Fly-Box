import React from 'react';
import { leaderSheet, record } from '../content/index.js';
import { Pill } from './bits.jsx';

/**
 * A leader, as something you build rather than something you look at.
 *
 * The two numbers that matter here are not on the diagram. One is the CUT
 * length — always longer than the finished length, because every knot needs
 * material to tie it with. The other is the turn count at each junction, which
 * depends on the diameter step and not on the pound test.
 *
 * Cut lengths are ranges on purpose. Nobody publishes a measured figure for how
 * much line a knot eats, and most of the allowance is grip rather than knot, so
 * a single number would be false precision. Cut to the long end if you are
 * unsure — you can always trim.
 */

const range = ([lo, hi]) => (lo === hi ? `${lo} in` : `${lo}–${hi} in`);

/** Feet for long runs, inches below two feet. The mixed units are the
 *  convention every leader formula is written in, and "18 in" beats
 *  "1 ft 6 in" when you are holding a tape. */
const feet = (inches) => {
  if (inches < 24) return `${Math.round(inches)} in`;
  const ft = inches / 12;
  return `${Number.isInteger(ft) ? ft : Math.round(ft * 100) / 100} ft`;
};

export default function LeaderSheet({ rig }) {
  const sheet = leaderSheet(rig.id);
  if (!sheet) return null;

  const junctionFor = (order) => sheet.junctions.find((j) => j.index === order - 1) ?? null;

  return (
    <div className="sheet-build">
      <div className="spread">
        <h4 className="deckgroup">Cut list</h4>
        <span className="tiny num">
          {sheet.allBought ? 'nothing to cut' : `${range(sheet.totalCutIn)} of material`}
        </span>
      </div>

      <ol className="cutlist">
        {sheet.rows.map((r) => {
          const j = junctionFor(r.order);
          return (
            <li key={r.order}>
              <div className="spread">
                <span className="grow">
                  <strong>{r.label}</strong>
                  <span className="tiny muted">
                    {[r.lb ? `${r.lb} lb` : null, r.x, r.diameterIn ? `${r.diameterIn.toFixed(3)} in` : null]
                      .filter(Boolean).join(' · ')}
                  </span>
                </span>
                {r.source === 'bought'
                  ? <Pill>buy {feet(r.finishedIn)}</Pill>
                  : <span className="num cut">cut {range(r.cutIn)}</span>}
              </div>
              {r.source !== 'bought' && (
                <div className="tiny muted">
                  {feet(r.finishedIn)} finished · {r.ends.join(' + ')}
                </div>
              )}
              {r.knotBelow && (
                <div className="tiny junction">
                  ↳ {record('knots', r.knotBelow)?.name ?? r.knotBelow}
                  {j?.turns && (
                    <> · <strong>{j.turns.heavy === j.turns.light
                      ? `${j.turns.heavy} turns`
                      : `${j.turns.heavy}/${j.turns.light} turns`}</strong></>
                  )}
                  {j?.stepIn != null && <span className="muted"> · step {j.stepIn.toFixed(3)} in</span>}
                </div>
              )}
              {j?.turnsNote && <div className="tiny warnline">{j.turnsNote}</div>}
            </li>
          );
        })}
      </ol>

      {rig.buildNotes && <p className="muted">{rig.buildNotes}</p>}

      {sheet.igfa.length > 0 && (
        <div className="banner">
          <strong>IGFA limits</strong>
          <ul className="plain tiny">
            {sheet.igfa.map((g, i) => <li key={i}>{g}</li>)}
          </ul>
        </div>
      )}

      {!sheet.allBought && (
        <>
          <h4 className="deckgroup">What to buy</h4>
          <ul className="plain spools">
            {sheet.spools.map((sp, i) => (
              <li key={i}>
                <strong>{sp.name}</strong>
                {sp.kind === 'spool'
                  ? <span className="tiny muted"> — {range(sp.needIn)} for this leader</span>
                  : <span className="tiny muted"> — bought, not built</span>}
              </li>
            ))}
          </ul>
          <div className="tiny">
            Diameters are only comparable within one brand, so stay in one family
            across a leader or the step-down numbers stop meaning anything.
          </div>
        </>
      )}

      {rig.adjust?.length > 0 && (
        <>
          <h4 className="deckgroup">On the water</h4>
          <ul className="plain adjust">
            {rig.adjust.map((a, i) => (
              <li key={i}>
                <div className="when">{a.when}</div>
                <div><strong>{a.change}</strong></div>
                {a.why && <div className="tiny muted">{a.why}</div>}
                {a.disputed && <div className="tiny warnline">Sources genuinely disagree on this one.</div>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
