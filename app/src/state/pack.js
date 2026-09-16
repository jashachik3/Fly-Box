// Offline pictures for a trip.
// ---------------------------------------------------------------------------
// The service worker keeps each fly and bug photograph the first time it is
// shown (CacheFirst on the 'fly-art' cache — see vite.config.js). That is
// fine at home and useless on a flat: the picture you need is the one you
// have not looked at yet. So Plan can fill that same cache on purpose, with
// everything the trip's region can show, while there is still wi-fi.
//
// Writing into a Workbox runtime cache from the page is deliberate and
// supported: same cache name, same request URLs, so the worker's CacheFirst
// finds what was put here.

import { assetUrl } from '../content/index.js';

export const ART_CACHE = 'fly-art';

export const canPack = () => typeof caches !== 'undefined';

/** How many of these paths are already stored. */
export async function packStatus(paths) {
  if (!canPack()) return { saved: 0, total: paths.length, supported: false };
  const cache = await caches.open(ART_CACHE);
  let saved = 0;
  for (const p of paths) {
    if (await cache.match(assetUrl(p), { ignoreSearch: true })) saved += 1;
  }
  return { saved, total: paths.length, supported: true };
}

/**
 * Fetch and store every path not already stored. `onProgress` gets
 * {done, total, failed} as it goes. Never throws for a single bad picture.
 */
export async function savePack(paths, onProgress = () => {}) {
  if (!canPack()) return { done: 0, total: paths.length, failed: paths.length };
  const cache = await caches.open(ART_CACHE);
  let done = 0;
  let failed = 0;
  const total = paths.length;

  // A few at a time: fast enough on wi-fi, gentle on a hotel router.
  const queue = [...paths];
  const worker = async () => {
    while (queue.length) {
      const p = queue.shift();
      const url = assetUrl(p);
      try {
        if (!(await cache.match(url, { ignoreSearch: true }))) {
          const res = await fetch(url, { cache: 'no-cache' });
          if (!res.ok) throw new Error(String(res.status));
          await cache.put(url, res);
        }
        done += 1;
      } catch {
        failed += 1;
      }
      onProgress({ done, total, failed });
    }
  };
  await Promise.all([worker(), worker(), worker()]);
  return { done, total, failed };
}

/** Drop every stored picture — for a phone that is running out of room. */
export async function clearPack() {
  if (!canPack()) return false;
  return caches.delete(ART_CACHE);
}
