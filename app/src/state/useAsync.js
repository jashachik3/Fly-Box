import { useCallback, useEffect, useState } from 'react';

/**
 * Minimal async data hook. `reload()` is returned rather than baked into a
 * global store: the log is small, refetching is cheap, and one obvious way to
 * refresh beats a cache that can disagree with IndexedDB.
 */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    run()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));
    return () => { alive = false; };
  }, [run, tick]);

  return { ...state, reload: () => setTick((t) => t + 1) };
}
