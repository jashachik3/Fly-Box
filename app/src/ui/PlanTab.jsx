import React, { useMemo, useState } from 'react';
import { bundle, regions, speciesIn, record, nameOf, MONTHS, confidence, assetUrl } from '../content/index.js';
import { slate as buildSlate, whatsOn, retrieveFor, retrieveLine, setWord } from '../content/query.js';
import { Card, Label, Empty, Pill, Strength, Field, Select, Diagram } from './bits.jsx';

function Thumb({ src }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return <img className="thumb" src={assetUrl(src)} alt="" loading="lazy" onError={() => setOk(false)} />;
}

export default function PlanTab({ trip, setTrip, setSlate, onStudy, onLog }) {
  const region = trip.regionId ? record('regions', trip.regionId) : null;
  const species = trip.speciesId ? record('species', trip.speciesId) : null;

  const matches = useMemo(
    () => (trip.regionId
      ? buildSlate(bundle, { region: trip.regionId, month: trip.month, species: trip.speciesId ?? undefined })
      : []),
    [trip.regionId, trip.month, trip.speciesId],
  );

  const onNow = useMemo(
    () => (trip.regionId ? whatsOn(bundle, { region: trip.regionId, month: trip.month }) : []),
    [trip.regionId, trip.month],
  );

  // One entry per fly, best strength wins. The table can recommend the same
  // fly for several organisms; a slate should still list it once.
  const bestPerFly = useMemo(() => {
    const seen = new Map();
    for (const m of matches) if (!seen.has(m.fly)) seen.set(m.fly, m);
    return [...seen.values()];
  }, [matches]);

  const conf = confidence();

  const takeSlate = () => {
    setSlate({
      regionId: trip.regionId,
      month: trip.month,
      monthName: MONTHS[trip.month - 1],
      flies: bestPerFly.slice(0, 6).map((m) => ({
        flyId: m.fly, strength: m.strength, source: 'brief',
      })),
    });
    onLog();
  };

  const rigIds = [...new Set(bestPerFly.flatMap((m) => m.rigs ?? []))].slice(0, 3);

  // One card per distinct retrieve on the slate, not one per fly — eight
  // shrimp patterns share one set of instructions, and repeating it eight
  // times is how a useful page becomes an unreadable one.
  const retrieves = useMemo(() => {
    const seen = new Map();
    for (const m of bestPerFly.slice(0, 10)) {
      const r = retrieveFor(bundle, m);
      if (r && !seen.has(r.id)) seen.set(r.id, r);
    }
    return [...seen.values()];
  }, [bestPerFly]);

  return (
    <>
      <section className="block">
        <Label>Trip</Label>
        <Card>
          <div className="row">
            <Field label="Where">
              <Select
                value={trip.regionId}
                placeholder="Pick a region"
                onChange={(regionId) => setTrip({ ...trip, regionId, speciesId: null })}
                options={regions.map((r) => ({ value: r.id, label: r.name }))}
              />
            </Field>
          </div>
          <div className="row">
            <Field label="Target species">
              <Select
                value={trip.speciesId}
                placeholder="Anything"
                onChange={(speciesId) => setTrip({ ...trip, speciesId })}
                options={(trip.regionId ? speciesIn(trip.regionId) : []).map((s) => ({ value: s.id, label: s.name }))}
              />
            </Field>
            <Field label="Month">
              <Select
                value={String(trip.month)}
                onChange={(m) => setTrip({ ...trip, month: Number(m) })}
                options={MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))}
              />
            </Field>
          </div>
        </Card>
      </section>

      {!region && (
        <Empty>
          Pick a region and a month.<br />
          You get the fish, the window, what is around, and a fly slate you can
          carry to the water.
        </Empty>
      )}

      {region && (
        <>
          {region.primaryFactor && (
            <section className="block">
              <Label>What decides the day here</Label>
              <Card>
                <div>{region.primaryFactor}</div>
                {region.notes && <div className="muted">{region.notes}</div>}
              </Card>
            </section>
          )}

          {species && (
            <section className="block">
              <Label>{species.name}</Label>
              <Card>
                {species.takeNotes && (
                  <div><strong>The eat.</strong> <span className="muted">{species.takeNotes}</span></div>
                )}
                {species.huntNotes && (
                  <div><strong>What they chase.</strong> <span className="muted">{species.huntNotes}</span></div>
                )}
                {species.fightNotes && (
                  <div><strong>The fight.</strong> <span className="muted">{species.fightNotes}</span></div>
                )}
                {species.refusal && (
                  <div><strong>On a refusal.</strong> <span className="muted">{species.refusal}</span></div>
                )}
                <div className="row">
                  {species.spooky != null && <Pill tone={species.spooky >= 4 ? 'hot' : ''}>spooky {species.spooky}/5</Pill>}
                  {species.leadFt && <Pill tone="hot">lead {species.leadFt[0]}–{species.leadFt[1]} ft</Pill>}
                  {species.tempBandF && <Pill>{species.tempBandF[0]}–{species.tempBandF[1]}°F</Pill>}
                  {species.tippetLb && <Pill>{species.tippetLb[0]}–{species.tippetLb[1]} lb tippet</Pill>}
                </div>
              </Card>
            </section>
          )}

          <section className="block">
            <Label>What is around in {MONTHS[trip.month - 1]}</Label>
            {onNow.length === 0
              ? <Empty>Nothing recorded for this region this month yet.</Empty>
              : (
                <Card flush>
                  {onNow.map((p) => (
                    <div className="listrow" key={p.id}>
                      <div className="grow">
                        <div className="name">{nameOf('organisms', p.organism)}</div>
                        <div className="sub">{p.stages.join(' · ')}{p.trigger ? ` — ${p.trigger}` : ''}</div>
                      </div>
                      <Pill tone={p.abundance === 'peak' ? 'first' : ''}>{p.abundance}</Pill>
                    </div>
                  ))}
                </Card>
              )}
          </section>

          <section className="block">
            <Label>Fly slate</Label>
            <div className="tiny">
              The flies this brief recommends, best first. Take it with you and
              the app records it, so later you can see where you went your own way.
            </div>
            {bestPerFly.length === 0
              ? <Empty>No match rules cover these conditions yet.</Empty>
              : (
                <Card flush>
                  {bestPerFly.slice(0, 10).map((m) => {
                    const fly = record('flies', m.fly);
                    const r = retrieveFor(bundle, m);
                    return (
                      <div className="listrow" key={m.id}>
                        {fly?.image && <Thumb src={fly.image} />}
                        <div className="grow">
                          <div className="name">{fly?.name ?? m.fly}</div>
                          <div className="sub">
                            {nameOf('organisms', m.organism)} · {m.stage}
                            {m.hookSizes ? ` · #${m.hookSizes[0]}–${m.hookSizes[1]}` : ''}
                            {fly?.weight ? ` · ${fly.weight}` : ''}
                          </div>
                          {r && (
                            <div className="slate-retrieve">
                              {r.name}: {retrieveLine(r)}
                            </div>
                          )}
                        </div>
                        <Strength value={m.strength} />
                      </div>
                    );
                  })}
                </Card>
              )}
          </section>

          {retrieves.length > 0 && (
            <section className="block">
              <Label>How to fish them</Label>
              {retrieves.map((r) => (
                <Card key={r.id}>
                  <div className="spread">
                    <strong>{r.name}</strong>
                    <Pill tone="hot">{setWord(r)}</Pill>
                  </div>
                  <div className="slate-retrieve">{retrieveLine(r)}</div>
                  {r.rodTip && <div className="muted">{r.rodTip}</div>}
                  {r.imitates && <div className="muted">{r.imitates}</div>}
                  {r.cue && <div><strong>The take.</strong> <span className="muted">{r.cue}</span></div>}
                  {r.mistake && <div className="tiny">Usually got wrong: {r.mistake}</div>}
                </Card>
              ))}
            </section>
          )}

          {rigIds.length > 0 && (
            <section className="block">
              <Label>Rig</Label>
              <Card flush>
                {rigIds.map((id) => {
                  const rig = record('rigs', id);
                  if (!rig) return null;
                  return (
                    <details className="ref" key={id}>
                      <summary>
                        <div className="grow">
                          <div className="name">{rig.name}</div>
                          <div className="sub">
                            {rig.line}
                            {rig.leaderFt ? ` · ${rig.leaderFt} ft leader` : ''}
                            {rig.knot ? ` · ${nameOf('knots', rig.knot)}` : ''}
                          </div>
                        </div>
                      </summary>
                      <div className="refbody">
                        <Diagram src={rig.diagram} alt={`${rig.name} — leader diagram`} />
                        {rig.useWhen && <p className="muted">{rig.useWhen}</p>}
                      </div>
                    </details>
                  );
                })}
              </Card>
            </section>
          )}

          <section className="block">
            <Label>Take it with you</Label>
            <div className="btnrow">
              <button type="button" onClick={onStudy}>Study this deck</button>
              <button type="button" className="primary" onClick={takeSlate} disabled={!bestPerFly.length}>
                Use as today's slate
              </button>
            </div>
            <div className="tiny">
              The slate is recorded on the session before you fish, so choosing
              something else later shows up as a choice rather than disappearing.
            </div>
          </section>

          <section className="block">
            <Label>If a word is new</Label>
            <Card flush>
              {[
                ['Slate', 'The short list of flies the brief recommends for this water, this month.'],
                ['Point / dropper', 'On a two-fly rig the point is the lower, heavier fly that sets the depth; the dropper hangs above it.'],
                ['Bead chain / lead eyes', 'Metal eyes at the head. They sink the fly and flip it to ride hook-point up. Bead chain is light, lead is heavy — this is your depth control.'],
                ['Tungsten / beadhead', 'A weighted bead on a nymph. Tungsten is denser, so it gets down faster on the same hook size.'],
                ['Strip set', 'Setting the hook by pulling line with your line hand, rod tip low, instead of lifting the rod. Every saltwater fish in here wants this.'],
              ].map(([term, def]) => (
                <div className="listrow" key={term}>
                  <div className="grow">
                    <div className="name">{term}</div>
                    <div className="sub">{def}</div>
                  </div>
                </div>
              ))}
            </Card>
          </section>

          {conf.draft > 0 && (
            <div className="banner">
              <strong>{conf.draft} of {conf.total} records are still drafts.</strong>{' '}
              Treat this brief as a starting point until you have reviewed it.
            </div>
          )}
        </>
      )}
    </>
  );
}
