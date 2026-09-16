import React from 'react';
import { Card, Label, Pill } from './bits.jsx';
import { useLive } from '../state/live.js';
import { tideLine, ageMinutes, SOURCES } from '../live/conditions.mjs';

// What the water is doing right now, for the trip's region. Tide from NOAA
// where there is a station, flow and water temperature from USGS where there
// is a gauge, air, wind and sky from Open-Meteo everywhere. Shown with its
// age, because a two-hour-old tide reading is a different fact from a fresh
// one and the screen should say so.

function ageWords(c) {
  const m = ageMinutes(c);
  if (m == null) return null;
  if (m < 2) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 6) / 10;
  return `${h} h ago`;
}

export function liveSummary(c) {
  if (!c) return [];
  return [
    c.tide ? `tide ${c.tide}` : null,
    c.flowCfs != null ? `${c.flowCfs} cfs` : null,
    c.waterF != null ? `${c.waterF}°F water` : null,
    c.airF != null ? `${c.airF}°F` : null,
    c.wind ? `${c.wind} wind${c.windDir ? ` ${c.windDir}` : ''}` : null,
    c.light,
  ].filter(Boolean);
}

export default function LiveNow({ region, compact = false }) {
  const { data: c, loading, refresh } = useLive(region);
  if (!region) return null;

  const nothing = !c || (!c.sources?.length);
  const stale = c && ageMinutes(c) > 120;

  if (compact) {
    if (nothing) return null;
    return (
      <div className="tiny">
        Live: {liveSummary(c).join(' · ')}{stale ? ` (${ageWords(c)})` : ''}
      </div>
    );
  }

  return (
    <section className="block">
      <div className="spread">
        <Label>Right now</Label>
        <button type="button" className="small ghost" onClick={refresh} disabled={loading}>
          {loading ? 'Fetching…' : 'Refresh'}
        </button>
      </div>
      <Card>
        {nothing && (
          <div className="muted">
            {loading ? 'Fetching conditions…' : 'No reading yet. Needs signal once; after that the last reading stays.'}
          </div>
        )}

        {c?.tide && (
          <div>
            <strong>Tide.</strong>{' '}
            <span className="muted">{tideLine(c)}</span>
            {c.tideHilo?.length > 0 && (
              <div className="tiny">
                Today: {c.tideHilo.map((e) => `${e.type === 'H' ? 'high' : 'low'} ${e.t.slice(11)}`).join(' · ')}
              </div>
            )}
          </div>
        )}

        {(c?.flowCfs != null || c?.waterF != null) && (
          <div>
            <strong>River.</strong>{' '}
            <span className="muted">
              {c.flowCfs != null ? `${c.flowCfs} cfs` : ''}
              {c.flowCfs != null && c.waterF != null ? ' · ' : ''}
              {c.waterF != null ? `${c.waterF}°F water` : ''}
            </span>
            {c.gaugeName && <div className="tiny">{c.gaugeName.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase())}</div>}
          </div>
        )}

        {c?.airF != null && (
          <div className="row">
            <Pill>{c.airF}°F</Pill>
            {c.wind && <Pill tone={c.wind === 'strong' ? 'hot' : ''}>{c.wind} wind{c.windDir ? ` ${c.windDir}` : ''}{c.windMph != null ? ` · ${c.windMph} mph` : ''}</Pill>}
            {c.light && <Pill tone="plain">{c.light}{c.cloudPct != null ? ` · ${c.cloudPct}% cloud` : ''}</Pill>}
          </div>
        )}

        {c && (
          <div className="tiny">
            {ageWords(c) ? `As of ${ageWords(c)}` : ''}
            {c.sources?.length ? ` · ${c.sources.map((s) => SOURCES[s]).join(', ')}` : ''}
            {c.errors?.length ? ` · could not reach: ${c.errors.map((e) => e.split(':')[0]).join(', ')}` : ''}
          </div>
        )}
      </Card>
    </section>
  );
}
