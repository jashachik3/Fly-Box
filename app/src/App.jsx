import React, { useState } from 'react';
import PlanTab from './ui/PlanTab.jsx';
import LearnTab from './ui/LearnTab.jsx';
import LogTab from './ui/LogTab.jsx';
import BoxTab from './ui/BoxTab.jsx';

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
  const [tab, setTab] = useState('log');

  // The trip is app-level state because it is the thing that connects the
  // tabs: a trip sets the Learn deck, seeds a session's recommended slate, and
  // gives the Box a gap list to check against. That loop is the product.
  const [trip, setTrip] = useState({ regionId: null, speciesId: null, month: new Date().getMonth() + 1 });
  const [slate, setSlate] = useState([]);   // [{ flyId, strength, source }]
  const [dueCount, setDueCount] = useState(0);

  const goStudy = () => setTab('learn');
  const goLog = () => setTab('log');

  return (
    <div className="app">
      <header className="head">
        <h1>Fly Box</h1>
        <span className="sub">{SUBTITLE[tab]}</span>
      </header>

      <main>
        {tab === 'plan' && (
          <PlanTab trip={trip} setTrip={setTrip} setSlate={setSlate} onStudy={goStudy} onLog={goLog} />
        )}
        {tab === 'learn' && <LearnTab trip={trip} onDueCount={setDueCount} />}
        {tab === 'log' && <LogTab trip={trip} slate={slate} />}
        {tab === 'box' && <BoxTab slate={slate} trip={trip} />}
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
