// Fly Box — user layer: storage
// ---------------------------------------------------------------------------
// A thin store over two interchangeable drivers:
//
//   indexedDbDriver  — the phone. Survives republishes and offline use.
//   memoryDriver     — tests and Node. Same API, no persistence.
//
// Two drivers is not over-engineering: it is what makes the log testable
// outside a browser, and IndexedDB is exactly the kind of thing you want a
// passing test for before a season of data is sitting in it.
//
// Collections: 'sessions' | 'catches' | 'presets' | 'review' | 'meta'
// 'flags' — notes on pictures that are wrong, so they come out with the backup
// and get fixed in a batch instead of being forgotten on the water.

const COLLECTIONS = ['sessions', 'catches', 'presets', 'review', 'box', 'gear', 'setups', 'meta', 'flags'];

// ---------------------------------------------------------------------------
// Memory driver
// ---------------------------------------------------------------------------

export function memoryDriver() {
  const db = new Map(COLLECTIONS.map((c) => [c, new Map()]));
  const col = (c) => {
    if (!db.has(c)) throw new Error(`unknown collection "${c}"`);
    return db.get(c);
  };
  return {
    async put(c, rec) { col(c).set(rec.id, structuredClone(rec)); return rec; },
    async get(c, id) { const v = col(c).get(id); return v ? structuredClone(v) : null; },
    async all(c) { return [...col(c).values()].map((v) => structuredClone(v)); },
    async remove(c, id) { col(c).delete(id); },
    async clear(c) { col(c).clear(); },
  };
}

// ---------------------------------------------------------------------------
// IndexedDB driver
// ---------------------------------------------------------------------------

export function indexedDbDriver({ name = 'flybox', version = 3 } = {}) {
  let dbp = null;

  const open = () => (dbp ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(name, version);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const c of COLLECTIONS) {
        if (!db.objectStoreNames.contains(c)) db.createObjectStore(c, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));

  const tx = async (c, mode, fn) => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const t = db.transaction(c, mode);
      const req = fn(t.objectStore(c));
      t.oncomplete = () => resolve(req?.result);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });
  };

  return {
    put: (c, rec) => tx(c, 'readwrite', (s) => s.put(rec)).then(() => rec),
    get: (c, id) => tx(c, 'readonly', (s) => s.get(id)).then((v) => v ?? null),
    all: (c) => tx(c, 'readonly', (s) => s.getAll()).then((v) => v ?? []),
    remove: (c, id) => tx(c, 'readwrite', (s) => s.delete(id)).then(() => undefined),
    clear: (c) => tx(c, 'readwrite', (s) => s.clear()).then(() => undefined),
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export function createStore(driver = defaultDriver()) {
  return {
    driver,

    sessions: collection(driver, 'sessions'),
    catches: collection(driver, 'catches'),
    presets: collection(driver, 'presets'),
    review: collection(driver, 'review'),
    box: collection(driver, 'box'),
    gear: collection(driver, 'gear'),
    setups: collection(driver, 'setups'),
    meta: collection(driver, 'meta'),
    flags: collection(driver, 'flags'),

    async snapshot() {
      const [sessions, catches, presets, review, box, gear, setups, flags] = await Promise.all([
        driver.all('sessions'), driver.all('catches'),
        driver.all('presets'), driver.all('review'), driver.all('box'),
        driver.all('gear'), driver.all('setups'), driver.all('flags'),
      ]);
      return { sessions, catches, presets, review, box, gear, setups, flags };
    },
  };
}

function collection(driver, nameOfCollection) {
  return {
    put: (rec) => driver.put(nameOfCollection, rec),
    get: (id) => driver.get(nameOfCollection, id),
    all: () => driver.all(nameOfCollection),
    remove: (id) => driver.remove(nameOfCollection, id),
    clear: () => driver.clear(nameOfCollection),
    async where(predicate) {
      return (await driver.all(nameOfCollection)).filter(predicate);
    },
    async putMany(recs) {
      for (const r of recs) await driver.put(nameOfCollection, r);
      return recs;
    },
  };
}

function defaultDriver() {
  return typeof indexedDB !== 'undefined' ? indexedDbDriver() : memoryDriver();
}

// ---------------------------------------------------------------------------
// Backup nag
// ---------------------------------------------------------------------------
// A private PWA with no account means the browser holds the only copy of the
// log, and browsers evict storage. This is the smallest honest guard: count
// sessions since the last export and say something when it drifts.

export async function backupStatus(store, { everyN = 10, firstNag = 3 } = {}) {
  const meta = await store.meta.get('backup');
  const sessions = await store.sessions.all();
  const since = sessions.filter((s) => !meta?.lastExportAt || s.startedAt > meta.lastExportAt).length;
  return {
    lastExportAt: meta?.lastExportAt ?? null,
    sessionsSinceExport: since,
    // Nagging from the very first session trains you to ignore the banner.
    due: meta?.lastExportAt ? since >= everyN : sessions.length >= firstNag,
  };
}

export async function markExported(store, at = new Date().toISOString()) {
  return store.meta.put({ id: 'backup', lastExportAt: at });
}
