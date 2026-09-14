import React, { useMemo, useState } from 'react';
import { knots, rigs, nameOf } from '../content/index.js';
import { Card, Label, Empty, Pill, Diagram } from './bits.jsx';
import LeaderSheet from './LeaderSheet.jsx';

/**
 * The reference half of the app: every knot and every leader, with the picture.
 *
 * The Learn tab drills these one at a time on a schedule. This is the other
 * thing you need — standing on a dock at 5am having forgotten which way the
 * second wrap goes, you do not want a quiz, you want the diagram.
 */

const WATERS = [
  { id: 'all', label: 'All' },
  { id: 'salt', label: 'Salt' },
  { id: 'fresh', label: 'Fresh' },
];

const nice = (s) => String(s).replace(/-/g, ' ');

function Row({ title, sub, pills, children }) {
  return (
    <details className="ref">
      <summary>
        <div className="grow">
          <div className="name">{title}</div>
          {sub && <div className="sub">{sub}</div>}
        </div>
        {pills}
      </summary>
      <div className="refbody">{children}</div>
    </details>
  );
}

export default function KnotsPanel() {
  const [water, setWater] = useState('all');

  // A knot with no water declared works in both — absent means "applies
  // regardless", the same rule the match rules use.
  const shownKnots = useMemo(
    () => knots.filter((k) => water === 'all' || !k.water || k.water === water),
    [water],
  );
  const shownRigs = useMemo(
    () => rigs.filter((r) => water === 'all' || r.water === water),
    [water],
  );

  return (
    <>
      <section className="block">
        <div className="row" role="group" aria-label="Filter by water">
          {WATERS.map((w) => (
            <button key={w.id} type="button" className="chip" aria-pressed={water === w.id}
                    onClick={() => setWater(w.id)}>
              {w.label}
            </button>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="spread">
          <Label>Knots</Label>
          <span className="tiny num">{shownKnots.length}</span>
        </div>
        {shownKnots.length === 0 ? <Empty>No knots for that water.</Empty> : (
          <Card flush>
            {shownKnots.map((k) => (
              <Row
                key={k.id}
                title={k.name}
                sub={(k.uses ?? []).map(nice).join(' · ')}
                pills={k.strengthPct ? <Pill tone={k.strengthPct >= 92 ? 'first' : ''}>{k.strengthPct}%</Pill> : null}
              >
                <Diagram src={k.diagram} alt={`${k.name} — how to tie it`}
                         hint={`Tap for all ${(k.steps ?? []).length} steps`} />
                {k.bestFor && <p className="muted">{k.bestFor}</p>}
                <ol className="steps">
                  {(k.steps ?? []).map((s, i) => <li key={i}>{s}</li>)}
                </ol>
                {k.failsWhen && <p className="tiny warnline"><strong>Gets it wrong:</strong> {k.failsWhen}</p>}
                {k.notes && <p className="tiny">{k.notes}</p>}
              </Row>
            ))}
          </Card>
        )}
      </section>

      <section className="block">
        <div className="spread">
          <Label>Leaders</Label>
          <span className="tiny num">{shownRigs.length}</span>
        </div>
        {shownRigs.length === 0 ? <Empty>No leaders for that water.</Empty> : (
          <Card flush>
            {shownRigs.map((r) => (
              <Row
                key={r.id}
                title={r.name}
                sub={[
                  r.lineWeight ? `${r.lineWeight[0]}${r.lineWeight[1] !== r.lineWeight[0] ? `–${r.lineWeight[1]}` : ''} wt` : null,
                  r.leaderFt ? `${r.leaderFt} ft leader` : null,
                  r.knot ? nameOf('knots', r.knot) : null,
                ].filter(Boolean).join(' · ')}
              >
                <Diagram src={r.diagram} alt={`${r.name} — leader diagram`}
                         hint="Tap for the whole leader" />
                {r.useWhen && <p className="muted">{r.useWhen}</p>}
                <LeaderSheet rig={r} />
                {r.notes && <p className="tiny">{r.notes}</p>}
              </Row>
            ))}
          </Card>
        )}
      </section>

      <div className="tiny">
        Every diagram here is drawn from the same records the quiz uses, so a
        correction lands in both at once. Tap one to open it full screen.
      </div>
    </>
  );
}
