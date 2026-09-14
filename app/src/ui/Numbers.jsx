import React, { useMemo } from 'react';
import { nameOf } from '../content/index.js';
import { flyRates, rigRates, roleSplit, bookVsLog, THRESHOLD } from '../user/rates.mjs';
import { scriptSplit } from '../user/log.mjs';
import { Card, Label, Empty, Pill } from './bits.jsx';

/**
 * Descriptive only, by decision: rates, splits, filters — no model. Every row
 * carries n, and nothing below the threshold is ranked, so a fly you tried
 * twice cannot top the list.
 */
export default function Numbers({ entries, slate }) {
  // Trivial sessions (ended in under three minutes with nothing caught) stay
  // in the history but are kept out of every rate.
  const closed = useMemo(
    () => entries.filter((e) => e.session.endedAt && !e.session.trivial),
    [entries],
  );

  const fr = useMemo(() => flyRates(closed), [closed]);
  const rr = useMemo(() => rigRates(closed), [closed]);
  const roles = useMemo(() => roleSplit(closed), [closed]);
  const split = useMemo(() => scriptSplit(closed), [closed]);

  const vs = useMemo(
    () => (slate?.length
      ? bookVsLog({ entries: closed, contentSlate: slate.map((s) => ({ fly: s.flyId, strength: s.strength })) })
      : null),
    [closed, slate],
  );

  const fish = closed.reduce((n, e) => n + e.catches.length, 0);

  if (!closed.length) {
    return (
      <section className="block">
        <Label>Your numbers</Label>
        <Empty>
          Nothing to report yet.<br />
          Rates need finished sessions — the hours are the denominator.
        </Empty>
      </section>
    );
  }

  return (
    <section className="block">
      <div className="spread">
        <Label>Your numbers</Label>
        <span className="tiny">{closed.length} sessions · {fish} fish</span>
      </div>

      <Card flush>
        <table className="stats">
          <thead>
            <tr><th>Fly</th><th className="n">fish/h</th><th className="n">n</th></tr>
          </thead>
          <tbody>
            {fr.ranked.map((r) => (
              <tr key={r.flyId}>
                <td>{nameOf('flies', r.flyId)}</td>
                <td className="n">{r.fishPerHour}</td>
                <td className="n">{r.fish} / {r.hours}h</td>
              </tr>
            ))}
            {fr.insufficient.slice(0, 6).map((r) => (
              <tr key={r.flyId}>
                <td className="thin">{nameOf('flies', r.flyId)}</td>
                <td className="n thin">—</td>
                <td className="n thin">{r.fish} / {r.hours}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="tiny">
        Italic rows are below {THRESHOLD.fish} fish or {THRESHOLD.hours}h and are
        not ranked. Hours count every stint the fly was on the leader, which is
        why a dropper you never change can look worse than its catch count.
      </div>

      {rr.ranked.length > 0 && (
        <Card flush>
          <table className="stats">
            <thead>
              <tr><th>Rig</th><th className="n">fish/h</th><th className="n">n</th></tr>
            </thead>
            <tbody>
              {rr.ranked.map((r) => (
                <tr key={r.rigId}>
                  <td>{nameOf('rigs', r.rigId)}</td>
                  <td className="n">{r.fishPerHour}</td>
                  <td className="n">{r.fish} / {r.hours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {roles.length > 0 && (
        <>
          <Label>Point, dropper or dry</Label>
          <Card>
            <div className="row">
              {roles.map((r) => (
                <Pill key={r.role} tone={r.role === 'point' ? 'first' : ''}>
                  {r.role} · {r.fish} ({Math.round(r.share * 100)}%)
                </Pill>
              ))}
            </div>
            <div className="tiny">
              Only answerable because each catch records which fly ate, not just
              what was tied on.
            </div>
          </Card>
        </>
      )}

      {vs && (
        <>
          <Label>The book vs your log</Label>
          <Card flush>
            <table className="stats">
              <thead>
                <tr><th>Fly</th><th>book</th><th className="n">yours</th></tr>
              </thead>
              <tbody>
                {vs.rows.map((r) => (
                  <tr key={r.flyId}>
                    <td>{nameOf('flies', r.flyId)}</td>
                    <td className="tiny">{r.book}</td>
                    <td className="n">
                      {r.yours
                        ? <>
                            {r.yours.ranked ? r.yours.fishPerHour : '—'}{' '}
                            <span className="tiny">n={r.yours.fish}</span>
                          </>
                        : <span className="tiny">never fished</span>}
                    </td>
                  </tr>
                ))}
                {vs.yoursOnly.map((r) => (
                  <tr key={r.flyId}>
                    <td>{nameOf('flies', r.flyId)}</td>
                    <td className="tiny" style={{ color: 'var(--hot)' }}>not on slate</td>
                    <td className="n">{r.yours.fishPerHour} <span className="tiny">n={r.yours.fish}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <div className="tiny">
            On script {split.onScript} · off script {split.offScript}. Both are
            shown; neither is corrected.
          </div>
        </>
      )}
    </section>
  );
}
