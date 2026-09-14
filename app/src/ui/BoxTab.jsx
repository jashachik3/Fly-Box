import React, { useMemo, useState } from 'react';
import { flies, nameOf, record, assetUrl } from '../content/index.js';
import { store } from '../state/db.js';
import { useAsync } from '../state/useAsync.js';
import { Card, Label, Empty, Pill } from './bits.jsx';
import GearPanel from './GearPanel.jsx';

function Thumb({ src }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return <img className="thumb" src={assetUrl(src)} alt="" loading="lazy" onError={() => setOk(false)} />;
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'salt', label: 'Salt' },
  { id: 'fresh', label: 'Fresh' },
  { id: 'have', label: 'In the box' },
  { id: 'gaps', label: 'Gaps' },
];

export default function BoxTab({ slate, trip }) {
  const slateFlies = slate?.flies ?? [];
  const { data: rows, reload } = useAsync(() => store.box.all(), []);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [view, setView] = useState('flies');

  const counts = useMemo(
    () => new Map((rows ?? []).map((r) => [r.id, r.count])),
    [rows],
  );

  // The gap list is the whole reason inventory is worth building: the brief
  // knows what you need, the box knows what you have, and the difference is a
  // shopping list you can act on before you leave.
  const needed = useMemo(() => {
    const wanted = new Set(slateFlies.map((s) => s.flyId));
    return [...wanted].filter((id) => !(counts.get(id) > 0));
  }, [slateFlies, counts]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return flies.filter((f) => {
      if (term && !f.name.toLowerCase().includes(term)) return false;
      if (filter === 'salt' || filter === 'fresh') return f.water === filter;
      if (filter === 'have') return (counts.get(f.id) ?? 0) > 0;
      if (filter === 'gaps') return needed.includes(f.id);
      return true;
    });
  }, [q, filter, counts, needed]);

  async function bump(flyId, delta) {
    // Re-read rather than trusting the rendered value: with the app open in two
    // places, a stale count in this component would overwrite the other one's
    // taps and quietly lose half of them.
    const fresh = await store.box.get(flyId);
    const next = Math.max(0, (fresh?.count ?? 0) + delta);
    await store.box.put({ id: flyId, count: next, updatedAt: new Date().toISOString() });
    reload();
  }

  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  const patterns = [...counts.values()].filter((n) => n > 0).length;

  if (!rows) return <Empty>Loading…</Empty>;

  const switcher = (
    <div className="row" role="group" aria-label="Box view">
      <button type="button" className="chip" aria-pressed={view === 'flies'}
              onClick={() => setView('flies')}>Flies</button>
      <button type="button" className="chip" aria-pressed={view === 'gear'}
              onClick={() => setView('gear')}>Gear</button>
    </div>
  );

  if (view === 'gear') {
    return (
      <>
        {switcher}
        <GearPanel trip={trip} />
      </>
    );
  }

  return (
    <>
      {switcher}
      <section className="block">
        <div className="spread">
          <Label>What you are carrying</Label>
          <span className="tiny num">{patterns} patterns · {total} flies</span>
        </div>

        {slateFlies.length > 0 && (
          needed.length > 0 ? (
            <div className="banner">
              <strong>{needed.length} of {slateFlies.length} flies on today's slate are not in your box.</strong>
              <div className="tiny" style={{ marginTop: 4 }}>
                {needed.map((id) => nameOf('flies', id)).join(' · ')}
              </div>
            </div>
          ) : (
            <div className="banner live">
              <strong>Every fly on the slate is in the box.</strong>
              {trip.regionId ? ` Ready for ${nameOf('regions', trip.regionId)}.` : ''}
            </div>
          )
        )}

        <div className="row">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id}
                    onClick={() => setFilter(f.id)}>
              {f.label}{f.id === 'gaps' && needed.length ? ` (${needed.length})` : ''}
            </button>
          ))}
        </div>

        <input
          type="text" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search patterns" aria-label="Search patterns"
        />
      </section>

      {shown.length === 0 ? (
        <Empty>
          {filter === 'gaps'
            ? 'No gaps — load a slate from the Plan tab to check against one.'
            : 'No patterns match.'}
        </Empty>
      ) : (
        <Card flush>
          {shown.map((f) => {
            const n = counts.get(f.id) ?? 0;
            const onSlate = slateFlies.some((s) => s.flyId === f.id);
            return (
              <div className="listrow" key={f.id}>
                {f.image && <Thumb src={f.image} />}
                <div className="grow">
                  <div className="name">{f.name}</div>
                  <div className="sub">
                    #{f.hookSizes[0]}–{f.hookSizes[1]}
                    {f.weight ? ` · ${f.weight}` : ''}
                    {f.variantOf ? ` · ${record('flies', f.variantOf)?.name ?? ''}` : ''}
                  </div>
                </div>
                {onSlate && <Pill tone={n > 0 ? 'first' : 'hot'}>slate</Pill>}
                <div className="row" style={{ flexWrap: 'nowrap' }}>
                  <button type="button" className="step" onClick={() => bump(f.id, -1)}
                          aria-label={`One fewer ${f.name}`} disabled={n === 0}>−</button>
                  <span className="num" style={{ minWidth: 22, textAlign: 'center' }}>{n}</span>
                  <button type="button" className="step" onClick={() => bump(f.id, 1)}
                          aria-label={`One more ${f.name}`}>+</button>
                </div>
              </div>
            );
          })}
        </Card>
      )}

      <div className="tiny">
        Counts are yours, stored on this device with the log — they export and
        restore together.
      </div>
    </>
  );
}
