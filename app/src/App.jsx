import React, { useEffect, useState } from 'react';
import PlanTab from './ui/PlanTab.jsx';
import LearnTab from './ui/LearnTab.jsx';
import LogTab from './ui/LogTab.jsx';
import BoxTab from './ui/BoxTab.jsx';
import { store } from './state/db.js';
import { useAsync } from './state/useAsync.js';
import { Empty } from './ui/bits.jsx';

const TABS = [
  { id: 'plan', label: 'Plan' },
  { id: 'learn', label: 'Learn' },
  { id: 'log', label: 'Log' },
  { id: 'box', label: 'Box' },
];

const SUBTITLE = {
  plan: 'where, when, what on',
  learn: 'drill it before you need it',
  log: 'what actually happened',
  box: 'what you are carrying',
};

export default function App() {
  // Boot reads two things: whether there is any history, and whether a slate
  // was left loaded. Both change where you land and what you see.
  const boot = useAsync(async () => ({
    hasHistory: (await store.sessions.all()).length > 0,
    slate: await store.meta.get('slate'),
    trip: await store.meta.get('trip'),
    seen: await store.meta.get('seen-intro'),
  }), []);

  const [tab, setTab] = useState(null);
  const [trip, setTrip] = useState({ regionId: null, speciesId: null, month: new Date().getMonth() + 1 });
  const [slate, setSlate] = useState(null);
  const [studyTrip, setStudyTrip] = useState(false);
  const [dueCount, setDueCount] = useState(0);
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    if (!boot.data || tab) return;
    // A first-time user landing on an empty Log tab reads "rates need finished
    // sessions" and has no idea the app is for planning a trip. Send them where
    // the work starts; send everyone else back to the log.
    setTab(boot.data.hasHistory ? 'log' : 'plan');
    setIntro(!boot.data.seen);
    if (boot.data.slate) {
      const { id, ...rest } = boot.data.slate;
      void id;
      setSlate(rest);
    }
    if (boot.data.trip) {
      const { id, ...rest } = boot.data.trip;
      void id;
      setTrip((t) => ({ ...t, ...rest }));
    }
  }, [boot.data, tab]);

  // The slate and the trip both survive a reload. They used to live only in
  // React state, so a refresh between planning and fishing lost the lot — and
  // the Box tab quietly stopped being able to tell you what to pack.
  useEffect(() => {
    if (!boot.data) return;
    if (slate) store.meta.put({ id: 'slate', ...slate });
    else if (boot.data.slate) store.meta.remove('slate');
  }, [slate, boot.data]);

  useEffect(() => {
    if (!boot.data || !trip.regionId) return;
    store.meta.put({ id: 'trip', ...trip });
  }, [trip, boot.data]);

  const liveSlate = slate && {
    ...slate,
    stale: slate.regionId !== trip.regionId || slate.month !== trip.month,
  };

  const goStudy = () => { setStudyTrip(true); setTab('learn'); };
  const goLog = () => setTab('log');

  function dismissIntro() {
    setIntro(false);
    store.meta.put({ id: 'seen-intro', at: new Date().toISOString() });
  }

  if (!tab) return <div className="app"><Empty>Loading…</Empty></div>;

  return (
    <div className="app">
      <header className="head">
        <h1>Fly Box</h1>
        <span className="sub">{SUBTITLE[tab]}</span>
      </header>

      <main>
        {intro && (
          <div className="intro">
            <strong>Four tabs, in the order you use them.</strong>
            <ul className="plain">
              <li><b>Plan</b> — pick where and when, get the fish, what is hatching, and a fly slate.</li>
              <li><b>Learn</b> — drill that slate before the trip, not on the water.</li>
              <li><b>Log</b> — record the hours and the fish. This is what makes the rest yours.</li>
              <li><b>Box</b> — what flies and gear you actually own, and what is missing.</li>
            </ul>
            <button type="button" className="small" onClick={dismissIntro}>Got it</button>
          </div>
        )}

        {tab === 'plan' && (
          <PlanTab trip={trip} setTrip={setTrip} setSlate={setSlate} onStudy={goStudy} onLog={goLog} />
        )}
        {tab === 'learn' && (
          <LearnTab trip={trip} onDueCount={setDueCount}
                    tripOnly={studyTrip} setTripOnly={setStudyTrip} />
        )}
        {tab === 'log' && <LogTab trip={trip} slate={liveSlate} />}
        {tab === 'box' && <BoxTab slate={liveSlate} trip={trip} />}
      </main>

      <nav className="tabs" aria-label="Sections">
        <div className="inner">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
            >
              {t.label}
              {t.id === 'learn' && dueCount > 0 && (
                <span className="badge">{dueCount > 99 ? '99+' : dueCount}</span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
