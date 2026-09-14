import React, { useMemo, useState } from 'react';
import { store } from '../state/db.js';
import { useAsync } from '../state/useAsync.js';
import { createLocker, GEAR_KINDS, describeGear, shortGear, describeSetup } from '../user/gear.mjs';
import { record, nameOf, speciesIn } from '../content/index.js';
import { Card, Label, Empty, Pill, Field, Select, Sheet, Diagram } from './bits.jsx';

const locker = createLocker(store);

const KIND_LABEL = {
  rod: 'Rods', reel: 'Reels', line: 'Lines', backing: 'Backing',
  leader: 'Leaders', tippet: 'Tippet', pack: 'Packs', wader: 'Waders',
  boot: 'Boots', net: 'Nets', other: 'Other',
};

export default function GearPanel({ trip }) {
  const { data, reload } = useAsync(async () => ({
    gear: await locker.all({ includeRetired: true }),
    setups: await locker.setups(),
    byId: await locker.gearById(),
  }), []);

  const [sheet, setSheet] = useState(null);      // {mode:'new'|'replace', gear?}
  const [showRetired, setShowRetired] = useState(false);

  const grouped = useMemo(() => {
    if (!data) return [];
    const live = data.gear.filter((g) => showRetired || !g.retired);
    return GEAR_KINDS
      .map((k) => ({ kind: k, items: live.filter((g) => g.gearKind === k) }))
      .filter((g) => g.items.length);
  }, [data, showRetired]);

  // A user prepping for a trip taps Gear expecting a packing list and gets an
  // inventory of what they already own. Answer the question they came with.
  const needs = useMemo(() => {
    if (!trip?.regionId) return [];
    const species = trip.speciesId
      ? [record('species', trip.speciesId)].filter(Boolean)
      : speciesIn(trip.regionId);
    const ids = [...new Set(species.flatMap((sp) => sp.rigs ?? []))];
    return ids.map((id) => record('rigs', id)).filter(Boolean);
  }, [trip?.regionId, trip?.speciesId]);

  if (!data) return <Empty>Loading…</Empty>;

  const retiredCount = data.gear.filter((g) => g.retired).length;

  return (
    <>
      {needs.length > 0 && (
        <section className="block">
          <Label>What {nameOf('regions', trip.regionId)} wants</Label>
          <Card flush>
            {needs.map((r) => (
              <details className="ref" key={r.id}>
                <summary>
                  <div className="grow">
                    <div className="name">{r.name}</div>
                    <div className="sub">
                      {[
                        r.lineWeight ? `${r.lineWeight[0]}${r.lineWeight[1] !== r.lineWeight[0] ? `–${r.lineWeight[1]}` : ''} wt` : null,
                        r.line,
                        r.leaderFt ? `${r.leaderFt} ft leader` : null,
                        r.knot ? nameOf('knots', r.knot) : null,
                      ].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </summary>
                <div className="refbody">
                  <Diagram src={r.diagram} alt={`${r.name} — leader diagram`} />
                </div>
              </details>
            ))}
          </Card>
          <div className="tiny">
            The rods and lines this trip calls for. Below is what you own.
          </div>
        </section>
      )}

      <section className="block">
        <div className="spread">
          <Label>Outfits</Label>
          <button type="button" className="small ghost" onClick={() => setSheet({ mode: 'setup' })}>
            New outfit
          </button>
        </div>

        {data.setups.length === 0 ? (
          <Empty>
            An outfit is a rod, a reel and a line with a name on it.<br />
            Name one and a session can record which one was in your hand.
          </Empty>
        ) : (
          <Card flush>
            {data.setups.map((s) => (
              <div className="listrow" key={s.id}>
                <div className="grow">
                  <div className="name">{s.name}</div>
                  <div className="sub">{describeSetup(s, data.byId) || 'Nothing assigned yet'}</div>
                </div>
                {s.useCount > 0 && <Pill>{s.useCount}×</Pill>}
              </div>
            ))}
          </Card>
        )}
      </section>

      <section className="block">
        <div className="spread">
          <Label>The locker</Label>
          <button type="button" className="small ghost" onClick={() => setSheet({ mode: 'new' })}>
            Add gear
          </button>
        </div>

        {grouped.length === 0 ? (
          <Empty>
            Nothing recorded yet.<br />
            Put the rod, the reel and the line in with their real model names —
            in three years that is the only way to answer "what was this?"
          </Empty>
        ) : (
          grouped.map(({ kind, items }) => (
            <React.Fragment key={kind}>
              <div className="tiny" style={{ marginTop: 4 }}>{KIND_LABEL[kind] ?? kind}</div>
              <Card flush>
                {items.map((g) => (
                  <div className="listrow" key={g.id} style={g.retired ? { opacity: 0.55 } : undefined}>
                    <div className="grow">
                      <div className="name">{describeGear(g) || 'Unnamed'}</div>
                      <div className="sub">
                        {[
                          g.acquiredAt ? `since ${String(g.acquiredAt).slice(0, 4)}` : null,
                          g.source || null,
                          g.serial ? `SN ${g.serial}` : null,
                          g.warrantyNote || null,
                          g.replaces && data.byId[g.replaces] ? `replaced ${shortGear(data.byId[g.replaces])}` : null,
                          g.retired ? (g.retiredReason || 'retired') : null,
                        ].filter(Boolean).join(' · ') || '—'}
                      </div>
                      {g.notes && <div className="sub">{g.notes}</div>}
                    </div>
                    {!g.retired && (
                      <button type="button" className="small ghost"
                              onClick={() => setSheet({ mode: 'replace', gear: g })}>
                        Replace
                      </button>
                    )}
                  </div>
                ))}
              </Card>
            </React.Fragment>
          ))
        )}

        {retiredCount > 0 && (
          <button type="button" className="ghost small" onClick={() => setShowRetired((v) => !v)}>
            {showRetired ? 'Hide' : 'Show'} {retiredCount} retired
          </button>
        )}

        <div className="tiny">
          Retiring a piece links it to what took its place, in both directions,
          so the chain reads back to whatever you started with.
        </div>
      </section>

      {sheet?.mode === 'setup' && (
        <SetupSheet gear={data.gear.filter((g) => !g.retired)}
                    onClose={() => setSheet(null)}
                    onDone={() => { setSheet(null); reload(); }} />
      )}

      {(sheet?.mode === 'new' || sheet?.mode === 'replace') && (
        <GearSheet
          replacing={sheet.mode === 'replace' ? sheet.gear : null}
          onClose={() => setSheet(null)}
          onDone={() => { setSheet(null); reload(); }}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------

function GearSheet({ replacing, onClose, onDone }) {
  const [gearKind, setGearKind] = useState(replacing?.gearKind ?? 'rod');
  const [brand, setBrand] = useState(replacing?.brand ?? '');
  const [model, setModel] = useState('');
  const [spec, setSpec] = useState(replacing?.spec ?? '');
  const [acquiredAt, setAcquiredAt] = useState(String(new Date().getFullYear()));
  const [serial, setSerial] = useState('');
  const [source, setSource] = useState('');
  const [warrantyNote, setWarrantyNote] = useState('');
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');

  async function save() {
    const input = {
      gearKind, brand, model, spec, acquiredAt, serial, source, warrantyNote, notes,
    };
    if (replacing) await locker.replace(replacing.id, input, reason);
    else await locker.save(input);
    onDone();
  }

  const PLACEHOLDER = {
    rod: { brand: 'TFO', model: 'Axiom II-X', spec: '8wt 9\'0" 4pc' },
    reel: { brand: 'Lamson', model: 'Guru S', spec: 'size 7+' },
    line: { brand: 'Scientific Anglers', model: 'Amplitude Grand Slam', spec: 'WF8F' },
    backing: { brand: 'Cortland', model: 'Micron', spec: '30 lb, 250 yd' },
  }[gearKind] ?? { brand: 'Brand', model: 'Model', spec: 'Spec' };

  return (
    <Sheet title={replacing ? `Replace ${shortGear(replacing)}` : 'Add gear'} onClose={onClose}>
      <div className="row">
        {GEAR_KINDS.slice(0, 6).map((k) => (
          <button key={k} type="button" className="chip" aria-pressed={gearKind === k}
                  onClick={() => setGearKind(k)}>{k}</button>
        ))}
      </div>

      <Field label="Brand">
        <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)}
               placeholder={PLACEHOLDER.brand} />
      </Field>
      <Field label="Model">
        <input type="text" value={model} onChange={(e) => setModel(e.target.value)}
               placeholder={PLACEHOLDER.model} />
      </Field>
      <Field label="Spec">
        <input type="text" value={spec} onChange={(e) => setSpec(e.target.value)}
               placeholder={PLACEHOLDER.spec} />
      </Field>

      <div className="row">
        <Field label="Since">
          <input type="text" inputMode="numeric" value={acquiredAt}
                 onChange={(e) => setAcquiredAt(e.target.value)} placeholder="2024" />
        </Field>
        <Field label="From">
          <input type="text" value={source} onChange={(e) => setSource(e.target.value)}
                 placeholder="shop, gift, used" />
        </Field>
      </div>

      <Field label="Serial">
        <input type="text" value={serial} onChange={(e) => setSerial(e.target.value)}
               placeholder="for warranty claims" />
      </Field>
      <Field label="Warranty">
        <input type="text" value={warrantyNote} onChange={(e) => setWarrantyNote(e.target.value)}
               placeholder="lifetime, $35 handling" />
      </Field>
      <Field label="Notes">
        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
               placeholder="anything you will want later" />
      </Field>

      {replacing && (
        <Field label="Why the old one went">
          <input type="text" value={reason} onChange={(e) => setReason(e.target.value)}
                 placeholder="broke at the ferrule / line cracked" />
        </Field>
      )}

      <button type="button" className="primary big" onClick={save}
              disabled={!brand && !model && !spec}>
        {replacing ? 'Save replacement' : 'Add to the locker'}
      </button>
      <div className="tiny">
        Stays on this device and exports with your log.
      </div>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------

function SetupSheet({ gear, onClose, onDone }) {
  const [name, setName] = useState('');
  const [rodId, setRodId] = useState(null);
  const [reelId, setReelId] = useState(null);
  const [lineId, setLineId] = useState(null);
  const [backingId, setBackingId] = useState(null);

  const opts = (kind) => gear.filter((g) => g.gearKind === kind)
    .map((g) => ({ value: g.id, label: describeGear(g) }));

  return (
    <Sheet title="New outfit" onClose={onClose}>
      <Field label="Name">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
               placeholder="Bahamas 8wt" />
      </Field>
      <Field label="Rod">
        <Select value={rodId} placeholder="—" onChange={setRodId} options={opts('rod')} />
      </Field>
      <Field label="Reel">
        <Select value={reelId} placeholder="—" onChange={setReelId} options={opts('reel')} />
      </Field>
      <Field label="Line">
        <Select value={lineId} placeholder="—" onChange={setLineId} options={opts('line')} />
      </Field>
      <Field label="Backing">
        <Select value={backingId} placeholder="—" onChange={setBackingId} options={opts('backing')} />
      </Field>
      <button type="button" className="primary big" disabled={!name}
              onClick={async () => {
                await locker.saveSetup({ name, rodId, reelId, lineId, backingId });
                onDone();
              }}>
        Save outfit
      </button>
      {gear.length === 0 && (
        <div className="tiny">Add some gear first and it will show up in these lists.</div>
      )}
    </Sheet>
  );
}
