// Live conditions, cached per region in the user store.
// ---------------------------------------------------------------------------
// One reading per region lives in `meta` as live:<regionId>. It is refreshed
// when it is older than FRESH_MIN and the phone is online; otherwise the last
// reading is shown with its age, which on a flat with one bar of signal is
// the honest thing to show. Nothing here blocks the UI — a fetch that hangs
// just leaves the old reading on screen.

import { useCallback, useEffect, useState } from 'react';
import { store } from './db.js';
import { conditionsFor } from '../live/conditions.mjs';

export const FRESH_MIN = 45;

const key = (regionId) => `live:${regionId}`;

export async function cachedLive(regionId) {
  if (!regionId) return null;
  const rec = await store.meta.get(key(regionId));
  if (!rec) return null;
  const { id, ...c } = rec;
  void id;
  return c;
}

export const isFresh = (c, min = FRESH_MIN) =>
  Boolean(c?.fetchedAt) && (Date.now() - new Date(c.fetchedAt)) / 60000 < min;

export async function refreshLive(region) {
  const c = await conditionsFor(region, {}, fetch);
  // A reading with nothing in it is not worth caching over a real one.
  if (!c.sources.length) {
    const prev = await cachedLive(region.id);
    return prev ? { ...prev, errors: c.errors, lastTry: c.fetchedAt } : c;
  }
  await store.meta.put({ id: key(region.id), ...c });
  return c;
}

/**
 * The reading for a region, kept fresh. `region` is the content record (it
 * carries the station, gauge, coords and timezone); pass null for no region.
 */
export function useLive(region) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async (force = false) => {
    if (!region) { setData(null); return; }
    const cached = await cachedLive(region.id);
    if (cached) setData(cached);
    const online = typeof navigator === 'undefined' || navigator.onLine !== false;
    if (!online) return;
    if (!force && isFresh(cached)) return;
    setLoading(true);
    try {
      setData(await refreshLive(region));
    } catch {
      // keep whatever was on screen
    } finally {
      setLoading(false);
    }
  }, [region?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { refresh(false); }, [refresh]);

  // Coming back online is the moment to try again.
  useEffect(() => {
    const on = () => refresh(false);
    window.addEventListener('online', on);
    return () => window.removeEventListener('online', on);
  }, [refresh]);

  return { data, loading, refresh: () => refresh(true) };
}
