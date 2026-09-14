import React, { useMemo, useState } from 'react';
import { record, nameOf, speciesIn, speciesList, regions, rigs, flies } from '../content/index.js';
import { store, log } from '../state/db.js';
import { useAsync } from '../state/useAsync.js';
import { exportAll, toJson, exportFilename } from '../user/export.mjs';
import { createLocker, describeSetup } from '../user/gear.mjs';
import { Card, Label, Empty, Pill, Field, Select, Sheet, duration, shortDate, clock } from './bits.jsx';
import Numbers from './Numbers.jsx';

const locker = createLocker(store);

const LIGHT = ['bright', 'broken', 'overcast', 'low'];
const WIND = ['calm', 'light', 'moderate', 'strong'];

export default function LogTab({ trip, slate }) {
  const state = useAsync(async () => ({
    session: await log.current(),
    entries: await log.history({ limit: 40 }),
    presets: await log.presets(),
    backup: await log.backupStatus(),
    setups: await locker.setups(),
    gearById: await locker.gearById(),
  }), []);

  const [sheet, setSheet] = useState(null);   // 'start' | 'catch' | 'rig'

  if (state.loading || !state.data) return <Empty>Loading…</Empty>;

  const { session, entries, presets, backup, setups, gearById } = state.data;
  const reload = state.reload;
  const stint = session?.stints.find((s) => !s.endedAt) ?? null;
  const today = session ? entries.find((e) => e.session.id === session.id)?.catches ?? [] : [];

  async function exportLog() {
    const payload = await exportAll(store);
    const blob = new Blob([toJson(payload)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportFilename();
    a.click();
    URL.revokeObjectURL(url);
    reload();
  }

  return (
    <>
      {session ? (
        <LiveSession
          session={session} stint={stint} presets={presets} today={today}
          setups={setups} gearById={gearById}
          onSheet={setSheet} reload={reload}
        />
      ) : (
        <section className="block">
          {slate?.length > 0 && (
            <div className="banner live">
              <strong>Today's slate is loaded</strong> — {slate.length} flies from the
              brief. They will be recorded on the session before you fish.
            </div>
          )}
          <button type="button" className="primary big" onClick={() => setSheet('start')}>
            Start a session
          </button>
          <div className="tiny">
            Log the hours, not just the fish. Without them a fly you always fish
            will always look like your best fly.
          </div>
        </section>
      )}

      {backup?.due && (
        <div className="banner">
          <strong>
            {backup.sessionsSinceExport} session{backup.sessionsSinceExport === 1 ? '' : 's'} since your last export.
          </strong>{' '}
          The browser holds the only copy.{' '}
          <button type="button" className="small" onClick={exportLog}>Export now</button>
        </div>
      )}

      <History entries={entries} currentId={session?.id} />

      <Numbers entries={entries} slate={slate} />

      {!backup?.due && entries.length > 0 && (
        <button type="button" className="ghost" onClick={exportLog}>Export log</button>
      )}

      {sheet === 'start' && (
        <StartSheet
          trip={trip} slate={slate}
          onClose={() => setSheet(null)}
          onDone={() => { setSheet(null); reload(); }}
        />
      )}
      {sheet === 'rig' && (
        <RigSheet
          presets={presets} setups={setups} gearById={gearById}
          onClose={() => setSheet(null)}
          onDone={() => { setSheet(null); reload(); }}
        />
      )}
      {sheet === 'catch' && stint && (
        <CatchSheet
          session={session} stint={stint}
          onClose={() => setSheet(null)}
          onDone={() => { setSheet(null); reload(); }}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------

function LiveSession({ session, stint, presets, today, setups, gearById, onSheet, reload }) {
  return (
    <section className="block">
      <div className="banner live">
        <div className="spread">
          <strong>{session.regionId ? nameOf('regions', session.regionId) : 'On the water'}</strong>
          <span className="num">{duration(session.startedAt)}</span>
        </div>
        <div className="tiny">
          {[
            session.placeNote || session.waterId,
            session.conditions?.waterF ? `${session.conditions.waterF}°F` : null,
            session.conditions?.light,
            session.conditions?.wind ? `${session.conditions.wind} wind` : null,
            session.gps?.blurred ? 'location blurred' : null,
          ].filter(Boolean).join(' · ')}
        </div>
      </div>

      <Label>On the leader</Label>
      {stint ? (
        <Card>
          <div className="spread">
            <strong>{nameOf('rigs', stint.rigId)}</strong>
            <span className="tiny num">{duration(stint.startedAt)}</span>
          </div>
          <div className="row">
            {stint.flies.map((f) => (
              <Pill key={f.role} tone={f.role === 'point' ? 'first' : ''}>
                {f.role}: {nameOf('flies', f.flyId)}{f.size ? ` #${f.size}` : ''}
              </Pill>
            ))}
          </div>
          {stint.setupId && setups?.some((s) => s.id === stint.setupId) && (
            <div className="tiny">
              {describeSetup(setups.find((s) => s.id === stint.setupId), gearById ?? {})}
            </div>
          )}
          <button type="button" className="small ghost" onClick={() => onSheet('rig')}>
            Change rig
          </button>
        </Card>
      ) : (
        <button type="button" className="big" onClick={() => onSheet('rig')}>
          Put a rig on
        </button>
      )}

      <button
        type="button" className="primary big"
        disabled={!stint}
        onClick={() => onSheet('catch')}
      >
        + Fish
      </button>

      {today.length > 0 && (
        <Card flush>
          {today.map((c) => (
            <div className="listrow" key={c.id}>
              <div className="grow">
                <div className="name">
                  {nameOf('species', c.speciesId)}{c.lengthIn ? ` · ${c.lengthIn}"` : ''}
                  {c.personalBest && ' ★'}
                </div>
                <div className="sub">{nameOf('flies', c.ateFlyId)} on the {c.ateRole}</div>
              </div>
              <span className="tiny num">{clock(c.at)}</span>
            </div>
          ))}
        </Card>
      )}

      <button
        type="button" className="ghost"
        onClick={async () => { await log.end(); reload(); }}
      >
        End session
      </button>
    </section>
  );
}

// ---------------------------------------------------------------------------

function History({ entries, currentId }) {
  const past = entries.filter((e) => e.session.id !== currentId);
  if (!past.length) return null;

  return (
    <section className="block">
      <Label>History</Label>
      <Card flush>
        {past.slice(0, 12).map(({ session, catches }) => (
          <div className="listrow" key={session.id}>
            <div className="grow">
              <div className="name">
                {session.regionId ? nameOf('regions', session.regionId) : 'Session'}
                {session.placeNote ? ` · ${session.placeNote}` : ''}
              </div>
              <div className="sub">
                {shortDate(session.startedAt)}
                {session.endedAt ? ` · ${duration(session.startedAt, session.endedAt)}` : ' · open'}
                {' · '}{catches.length} fish
              </div>
            </div>
            {catches.some((c) => c.personalBest) && <Pill tone="hot">PB</Pill>}
          </div>
        ))}
      </Card>
    </section>
  );
}

// ---------------------------------------------------------------------------

function StartSheet({ trip, slate, onClose, onDone }) {
  const [regionId, setRegionId] = useState(trip.regionId ?? null);
  const [waterId, setWaterId] = useState(null);
  const [waterF, setWaterF] = useState('');
  const [light, setLight] = useState(null);
  const [wind, setWind] = useState(null);
  const [busy, setBusy] = useState(false);

  const region = regionId ? record('regions', regionId) : null;

  async function go() {
    setBusy(true);
    let gps = null;
    try {
      if (navigator.geolocation) {
        gps = await new Promise((res) => {
          navigator.geolocation.getCurrentPosition(
            (p) => res({ lat: p.coords.latitude, lon: p.coords.longitude }),
            () => res(null),
            { timeout: 4000 },
          );
        });
      }
    } catch { /* a session without a fix is still a session */ }

    await log.start({
      regionId,
      waterId,
      conditions: {
        waterF: waterF === '' ? null : Number(waterF),
        light,
        wind,
      },
      recommended: slate ?? [],
      gps: gps ?? undefined,
      blurLocation: true,
    });
    onDone();
  }

  return (
    <Sheet title="Start a session" onClose={onClose}>
      <Field label="Where">
        <Select
          value={regionId} placeholder="Pick a region"
          onChange={(v) => { setRegionId(v); setWaterId(null); }}
          options={regions.map((r) => ({ value: r.id, label: r.name }))}
        />
      </Field>

      {region?.waters?.length > 0 && (
        <Field label="Water">
          <Select
            value={waterId} placeholder="Anywhere"
            onChange={setWaterId}
            options={region.waters.map((w) => ({ value: w.id, label: w.name }))}
          />
        </Field>
      )}

      <div className="row">
        <Field label="Water °F">
          <input type="number" inputMode="numeric" value={waterF}
                 onChange={(e) => setWaterF(e.target.value)} placeholder="—" />
        </Field>
      </div>

      <div>
        <div className="tiny" style={{ marginBottom: 6 }}>LIGHT</div>
        <div className="row">
          {LIGHT.map((l) => (
            <button key={l} type="button" className="chip" aria-pressed={light === l}
                    onClick={() => setLight(light === l ? null : l)}>{l}</button>
          ))}
        </div>
      </div>

      <div>
        <div className="tiny" style={{ marginBottom: 6 }}>WIND</div>
        <div className="row">
          {WIND.map((w) => (
            <button key={w} type="button" className="chip" aria-pressed={wind === w}
                    onClick={() => setWind(wind === w ? null : w)}>{w}</button>
          ))}
        </div>
      </div>

      {slate?.length > 0 && (
        <div className="tiny">
          Recording {slate.length} recommended flies with this session.
        </div>
      )}

      <button type="button" className="primary big" onClick={go} disabled={busy}>
        {busy ? 'Starting…' : 'Start fishing'}
      </button>
      <div className="tiny">
        Location is stored blurred to about five miles. The exact fix is never kept.
      </div>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------

function RigSheet({ presets, setups = [], gearById = {}, onClose, onDone }) {
  const [building, setBuilding] = useState(!presets.length);
  const [name, setName] = useState('');
  const [rigId, setRigId] = useState(null);
  const [slots, setSlots] = useState([{ role: 'point', flyId: null, size: '' }]);
  const [setupId, setSetupId] = useState(null);

  const rig = rigId ? record('rigs', rigId) : null;
  // Salt rigs offer salt flies. Nothing stops you overriding it, but the
  // default should not make you scroll past forty trout nymphs on a skiff.
  const flyOptions = useMemo(() => {
    const water = rig?.water;
    return (water ? flies.filter((f) => f.water === water) : flies)
      .map((f) => ({ value: f.id, label: f.name }));
  }, [rig?.water]);

  function pickRig(id) {
    setRigId(id);
    const r = record('rigs', id);
    setSlots((r?.flies ?? [{ role: 'single' }]).map((f) => ({ role: f.role, flyId: null, size: '' })));
    if (!name && r) setName(r.name);
  }

  async function saveAndUse() {
    const preset = await log.savePreset({
      name: name || (rig?.name ?? 'Rig'),
      rigId,
      setupId,
      flies: slots.filter((s) => s.flyId).map((s) => ({
        role: s.role, flyId: s.flyId, size: s.size === '' ? null : Number(s.size),
      })),
    });
    if (setupId) await locker.useSetup(setupId);
    await log.useRig({ presetId: preset.id });
    onDone();
  }

  return (
    <Sheet title={building ? 'Build a rig' : 'Put a rig on'} onClose={onClose}>
      {!building && (
        <>
          <div className="stack">
            {presets.map((p) => (
              <button key={p.id} type="button" className="big"
                      onClick={async () => {
                  if (p.setupId) await locker.useSetup(p.setupId);
                  await log.useRig({ presetId: p.id });
                  onDone();
                }}>
                {p.name}
                <span className="tiny" style={{ display: 'block', fontWeight: 400 }}>
                  {p.flies.map((f) => nameOf('flies', f.flyId)).join(' + ')}
                </span>
              </button>
            ))}
          </div>
          <button type="button" className="ghost" onClick={() => setBuilding(true)}>
            Build a new rig
          </button>
        </>
      )}

      {building && (
        <>
          <Field label="Rig">
            <Select value={rigId} placeholder="Pick a rig type" onChange={pickRig}
                    options={rigs.map((r) => ({ value: r.id, label: r.name }))} />
          </Field>

          {rig?.useWhen && <div className="tiny">{rig.useWhen}</div>}

          {slots.map((s, i) => (
            <Field key={`${s.role}-${i}`} label={s.role}>
              <Select
                value={s.flyId} placeholder="Pick a fly"
                onChange={(flyId) => setSlots(slots.map((x, j) => (j === i ? { ...x, flyId } : x)))}
                options={flyOptions}
              />
            </Field>
          ))}

          {setups.length > 0 && (
            <Field label="Outfit">
              <Select value={setupId} placeholder="Not recorded" onChange={setSetupId}
                      options={setups.map((su) => ({
                        value: su.id,
                        label: `${su.name}${describeSetup(su, gearById) ? ` — ${describeSetup(su, gearById)}` : ''}`,
                      }))} />
            </Field>
          )}

          <Field label="Name this preset">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                   placeholder="Euro double-nymph" />
          </Field>

          <button type="button" className="primary big" onClick={saveAndUse}
                  disabled={!rigId || !slots.some((s) => s.flyId)}>
            Save and fish it
          </button>
          <div className="tiny">
            Saved presets make a catch three taps: species, size, which fly ate.
          </div>
          {presets.length > 0 && (
            <button type="button" className="ghost" onClick={() => setBuilding(false)}>
              Use a saved rig instead
            </button>
          )}
        </>
      )}
    </Sheet>
  );
}


// ---------------------------------------------------------------------------

function CatchSheet({ session, stint, onClose, onDone }) {
  const options = session.regionId ? speciesIn(session.regionId) : speciesList;
  const [speciesId, setSpeciesId] = useState(options[0]?.id ?? null);
  const [lengthIn, setLengthIn] = useState('');
  const [ateFlyId, setAteFlyId] = useState(stint.flies[0]?.flyId ?? null);
  const [pb, setPb] = useState(false);

  async function save() {
    await log.addCatch({
      speciesId,
      lengthIn: lengthIn === '' ? null : Number(lengthIn),
      ateFlyId,
      personalBest: pb,
      waterType: null,
    });
    onDone();
  }

  return (
    <Sheet title="Fish on" onClose={onClose}>
      <div>
        <div className="tiny" style={{ marginBottom: 6 }}>SPECIES</div>
        <div className="row">
          {options.map((s) => (
            <button key={s.id} type="button" className="chip" aria-pressed={speciesId === s.id}
                    onClick={() => setSpeciesId(s.id)}>{s.name}</button>
          ))}
        </div>
      </div>

      <Field label="Length (in)">
        <input type="number" inputMode="decimal" value={lengthIn}
               onChange={(e) => setLengthIn(e.target.value)} placeholder="—" />
      </Field>

      <div>
        <div className="tiny" style={{ marginBottom: 6 }}>WHICH FLY ATE</div>
        <div className="stack">
          {stint.flies.map((f) => (
            <button key={f.role} type="button" className="big" aria-pressed={ateFlyId === f.flyId}
                    style={ateFlyId === f.flyId
                      ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)' }
                      : undefined}
                    onClick={() => setAteFlyId(f.flyId)}>
              {nameOf('flies', f.flyId)}
              <span className="tiny" style={{ display: 'block', fontWeight: 400 }}>
                on the {f.role}{f.size ? ` · #${f.size}` : ''}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="chip" aria-pressed={pb} onClick={() => setPb(!pb)}>
        Personal best
      </button>

      <button type="button" className="primary big" onClick={save} disabled={!speciesId || !ateFlyId}>
        Log it
      </button>
    </Sheet>
  );
}
