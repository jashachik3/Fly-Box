// Fly Box — live conditions: tide, flow, weather
// ---------------------------------------------------------------------------
// Three public services, one answer:
//
//   NOAA CO-OPS   high/low tide predictions for the region's tide station
//   USGS NWIS     instantaneous flow (cfs) and water temperature at the gauge
//   Open-Meteo    air temperature, wind, cloud cover at the region's coords
//
// A region only gets the readings its record can support: a tide station
// makes tides possible, a gauge makes flow possible, coords make weather
// possible. Nothing is invented for a region that lacks the source.
//
// Every fetch is independent and every failure is swallowed into `errors`, so
// a dead USGS gauge never costs you the tide. `fetchImpl` is injected: the
// browser passes fetch, Node passes fetch, a test passes a stub.
//
// Times. NOAA (with time_zone=lst_ldt) and Open-Meteo (with timezone=<tz>)
// both answer in the STATION'S local wall-clock time with no offset attached.
// Rather than reconstruct offsets, "now" is rendered as a wall-clock string in
// the region's timezone and compared as text. USGS answers with an offset and
// parses as a normal Date.

const TIDE_API = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
const USGS_API = 'https://waterservices.usgs.gov/nwis/iv/';
const METEO_API = 'https://api.open-meteo.com/v1/forecast';
const METEO_ARCHIVE = 'https://archive-api.open-meteo.com/v1/archive';

export const SOURCES = {
  tide: 'NOAA CO-OPS tide predictions',
  flow: 'USGS instantaneous values (provisional)',
  weather: 'Open-Meteo',
};

// ---------------------------------------------------------------------------
// Clock helpers
// ---------------------------------------------------------------------------

/** "2026-09-16 14:05" — `at` as wall-clock time in `tz`. */
export function wallClock(at, tz) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(at);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}

const ymd = (wall) => wall.slice(0, 10);
const compact = (wall) => wall.slice(0, 10).replace(/-/g, '');

/** Minutes between two wall-clock strings on the same calendar (no DST care needed at this precision). */
function minutesBetween(a, b) {
  const t = (s) => {
    const [d, hm] = s.split(/[ T]/);
    const [y, m, dd] = d.split('-').map(Number);
    const [h, mi] = hm.split(':').map(Number);
    return Date.UTC(y, m - 1, dd, h, mi) / 60000;
  };
  return t(b) - t(a);
}

// ---------------------------------------------------------------------------
// Tide
// ---------------------------------------------------------------------------

/**
 * Where in the cycle `nowWall` sits, from a list of {t, type:'H'|'L', v}.
 * Within 45 minutes of a turn it is that turn; otherwise it is the direction
 * of travel toward the next one. Returns null when the list does not bracket
 * the time.
 */
export function tideStage(hilo, nowWall, slackMin = 45) {
  const events = [...hilo]
    .map((e) => ({ t: e.t, type: e.type, v: e.v != null ? Number(e.v) : null }))
    .sort((a, b) => (a.t < b.t ? -1 : 1));
  const prev = [...events].reverse().find((e) => e.t <= nowWall) ?? null;
  const next = events.find((e) => e.t > nowWall) ?? null;
  if (!prev && !next) return null;

  const nearPrev = prev && minutesBetween(prev.t, nowWall) <= slackMin;
  const nearNext = next && minutesBetween(nowWall, next.t) <= slackMin;
  const word = (e) => (e.type === 'H' ? 'high' : 'low');

  let tide;
  if (nearNext) tide = word(next);
  else if (nearPrev) tide = word(prev);
  else if (next) tide = next.type === 'H' ? 'incoming' : 'outgoing';
  else tide = prev.type === 'H' ? 'outgoing' : 'incoming';

  return {
    tide,
    next: next ? { type: word(next), at: next.t, heightFt: next.v } : null,
    prev: prev ? { type: word(prev), at: prev.t, heightFt: prev.v } : null,
    minutesToNext: next ? minutesBetween(nowWall, next.t) : null,
  };
}

export async function fetchTides(station, { at = new Date(), tz } = {}, fetchImpl = fetch) {
  const now = wallClock(at, tz);
  // Yesterday through tomorrow, so the previous turn is always in the list
  // even at 00:10, and the next one even at 23:50.
  const day = 86_400_000;
  const begin = compact(wallClock(new Date(at.getTime() - day), tz));
  const end = compact(wallClock(new Date(at.getTime() + day), tz));
  const url = `${TIDE_API}?product=predictions&datum=MLLW&station=${station}` +
    `&time_zone=lst_ldt&units=english&interval=hilo&format=json&begin_date=${begin}&end_date=${end}`;
  const res = await fetchImpl(url);
  if (!res.ok) throw new Error(`NOAA ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`NOAA: ${json.error.message ?? 'error'}`);
  const hilo = json.predictions ?? [];
  const stage = tideStage(hilo, now);
  if (!stage) throw new Error('NOAA: no predictions bracket this time');
  return { ...stage, station, hilo: hilo.filter((e) => ymd(e.t) === ymd(now)) };
}

// ---------------------------------------------------------------------------
// Flow
// ---------------------------------------------------------------------------

const cToF = (c) => Math.round((c * 9) / 5 + 32);

/**
 * Latest flow and water temperature, or the reading nearest `at` when `at` is
 * more than an hour old (the enrichment case: a session logged without
 * signal, filled in that evening).
 */
export async function fetchFlow(gauge, { at = new Date() } = {}, fetchImpl = fetch) {
  const ageMin = (Date.now() - at.getTime()) / 60000;
  let url = `${USGS_API}?format=json&sites=${gauge}&parameterCd=00060,00010&siteStatus=all`;
  if (ageMin > 60) {
    const iso = (d) => d.toISOString().slice(0, 19) + 'Z';
    url += `&startDT=${iso(new Date(at.getTime() - 3 * 3_600_000))}&endDT=${iso(new Date(at.getTime() + 3 * 3_600_000))}`;
  }
  const res = await fetchImpl(url);
  if (!res.ok) throw new Error(`USGS ${res.status}`);
  const json = await res.json();
  const series = json?.value?.timeSeries ?? [];
  const pick = (code) => {
    const ts = series.find((s) => s.variable?.variableCode?.some((c) => c.value === code));
    const vals = ts?.values?.[0]?.value ?? [];
    if (!vals.length) return null;
    const noData = ts.variable?.noDataValue;
    const usable = vals.filter((v) => Number(v.value) !== noData);
    if (!usable.length) return null;
    // Nearest to `at`; for a LATEST query there is one value anyway.
    const best = usable.reduce((a, b) =>
      (Math.abs(new Date(b.dateTime) - at) < Math.abs(new Date(a.dateTime) - at) ? b : a));
    return { value: Number(best.value), at: best.dateTime };
  };
  const flow = pick('00060');
  const temp = pick('00010');
  if (!flow && !temp) throw new Error('USGS: no values');
  return {
    gauge,
    siteName: series[0]?.sourceInfo?.siteName ?? null,
    flowCfs: flow?.value ?? null,
    waterF: temp ? cToF(temp.value) : null,
    readAt: flow?.at ?? temp?.at ?? null,
  };
}

// ---------------------------------------------------------------------------
// Weather
// ---------------------------------------------------------------------------

/** Cloud cover to the log's light vocabulary. Night is 'low' whatever the sky. */
export function lightFrom(cloudPct, isDay = true) {
  if (!isDay) return 'low';
  if (cloudPct == null) return null;
  if (cloudPct < 30) return 'bright';
  if (cloudPct <= 70) return 'broken';
  return 'overcast';
}

/** Wind speed in mph to the log's wind vocabulary. */
export function windFrom(mph) {
  if (mph == null) return null;
  if (mph < 5) return 'calm';
  if (mph < 12) return 'light';
  if (mph < 20) return 'moderate';
  return 'strong';
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
export const compass = (deg) => (deg == null ? null : COMPASS[Math.round(deg / 45) % 8]);

const HOURLY = 'temperature_2m,wind_speed_10m,wind_direction_10m,cloud_cover,precipitation,is_day';

export async function fetchWeather([lat, lon], { at = new Date(), tz } = {}, fetchImpl = fetch) {
  const now = wallClock(at, tz);
  const ageDays = (Date.now() - at.getTime()) / 86_400_000;
  const common = `latitude=${lat}&longitude=${lon}&timezone=${encodeURIComponent(tz)}` +
    '&temperature_unit=fahrenheit&wind_speed_unit=mph';

  // Within the last week the forecast endpoint carries recent hours too; older
  // than that it is the archive. Both return the same hourly shape.
  const url = ageDays > 6
    ? `${METEO_ARCHIVE}?${common}&start_date=${ymd(now)}&end_date=${ymd(now)}&hourly=${HOURLY}`
    : `${METEO_API}?${common}&past_days=7&forecast_days=1&hourly=${HOURLY}`;
  const res = await fetchImpl(url);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`Open-Meteo: ${json.reason ?? 'error'}`);
  const h = json.hourly ?? {};
  const times = h.time ?? [];
  if (!times.length) throw new Error('Open-Meteo: no hourly data');

  // The hour nearest to `at`, compared as wall-clock text.
  let i = 0;
  let best = Infinity;
  const target = now.replace(' ', 'T');
  times.forEach((t, k) => {
    const d = Math.abs(minutesBetween(t, target));
    if (d < best) { best = d; i = k; }
  });
  const val = (key) => (h[key]?.[i] ?? null);

  const cloudPct = val('cloud_cover');
  const isDay = val('is_day') == null ? true : val('is_day') === 1;
  // Round first, then bucket, so the word and the number on screen agree:
  // 11.6 mph shows as 12 and 12 is moderate.
  const windMph = val('wind_speed_10m') != null ? Math.round(val('wind_speed_10m')) : null;
  return {
    airF: val('temperature_2m') != null ? Math.round(val('temperature_2m')) : null,
    windMph,
    windDir: compass(val('wind_direction_10m')),
    cloudPct,
    precipIn: val('precipitation'),
    isDay,
    light: lightFrom(cloudPct, isDay),
    wind: windFrom(windMph),
    hourAt: times[i],
  };
}

// ---------------------------------------------------------------------------
// One call for a region
// ---------------------------------------------------------------------------

/**
 * Everything the region's record makes possible, at `at`. Never throws: each
 * source reports into `errors` and the rest still comes back.
 */
export async function conditionsFor(region, { at = new Date() } = {}, fetchImpl = fetch) {
  const tz = region.timezone ?? 'UTC';
  const out = {
    regionId: region.id,
    at: at.toISOString(),
    fetchedAt: new Date().toISOString(),
    tide: null, tideNext: null, tideHilo: null,
    flowCfs: null, waterF: null, gaugeName: null,
    airF: null, windMph: null, windDir: null, cloudPct: null, light: null, wind: null,
    sources: [],
    errors: [],
  };

  const jobs = [];
  if (region.tideStation) {
    jobs.push(fetchTides(region.tideStation, { at, tz }, fetchImpl)
      .then((t) => { out.tide = t.tide; out.tideNext = t.next; out.tideHilo = t.hilo; out.sources.push('tide'); })
      .catch((e) => out.errors.push(`tide: ${e.message}`)));
  }
  if (region.usgsGauge) {
    jobs.push(fetchFlow(region.usgsGauge, { at }, fetchImpl)
      .then((f) => { out.flowCfs = f.flowCfs; out.waterF = f.waterF; out.gaugeName = f.siteName; out.sources.push('flow'); })
      .catch((e) => out.errors.push(`flow: ${e.message}`)));
  }
  if (region.coords?.length === 2) {
    jobs.push(fetchWeather(region.coords, { at, tz }, fetchImpl)
      .then((w) => { Object.assign(out, { airF: w.airF, windMph: w.windMph, windDir: w.windDir, cloudPct: w.cloudPct, light: w.light, wind: w.wind }); out.sources.push('weather'); })
      .catch((e) => out.errors.push(`weather: ${e.message}`)));
  }
  await Promise.all(jobs);
  return out;
}

/**
 * The session-level fields the log stores, from a conditions reading. Only
 * what the reading actually has — a null never overwrites what you typed.
 */
export function toSessionConditions(c) {
  const o = {};
  if (c.tide) o.tide = c.tide;
  if (c.flowCfs != null) o.flowCfs = c.flowCfs;
  if (c.waterF != null) o.waterF = c.waterF;
  if (c.airF != null) o.airF = c.airF;
  if (c.light) o.light = c.light;
  if (c.wind) o.wind = c.wind;
  return o;
}

/**
 * Build the fetcher `log.enrich()` wants: a session in, the conditions it was
 * missing out. Fills only blanks — what you entered on the bank stands.
 */
export function enricherFor(regionsById, fetchImpl = fetch) {
  return async (session) => {
    const region = regionsById[session.regionId];
    if (!region) return null;
    const c = await conditionsFor(region, { at: new Date(session.startedAt) }, fetchImpl);
    if (!c.sources.length) return null;
    const got = toSessionConditions(c);
    const extra = {};
    for (const [k, v] of Object.entries(got)) {
      if (session.conditions?.[k] == null || session.conditions[k] === '') extra[k] = v;
    }
    // An empty object still says "fetched, nothing missing" — the log clears
    // the pending flag on it. Null means "could not fetch, try again later".
    return extra;
  };
}

/** "incoming · high 3.2 ft at 12:18" — the tide in one line. */
export function tideLine(c) {
  if (!c?.tide) return null;
  const next = c.tideNext
    ? ` · ${c.tideNext.type}${c.tideNext.heightFt != null ? ` ${c.tideNext.heightFt.toFixed(1)} ft` : ''} at ${c.tideNext.at.slice(11)}`
    : '';
  return `${c.tide}${next}`;
}

/** Minutes since a reading was fetched, for "as of" labels. */
export const ageMinutes = (c) => (c?.fetchedAt ? Math.round((Date.now() - new Date(c.fetchedAt)) / 60000) : null);
