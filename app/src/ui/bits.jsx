import React from 'react';

export const Label = ({ children }) => <h2 className="label">{children}</h2>;

export const Card = ({ children, flush = false, ...rest }) => (
  <div className={flush ? 'card flush' : 'card'} {...rest}>{children}</div>
);

export const Empty = ({ children }) => <div className="empty">{children}</div>;

export const Pill = ({ tone = '', children }) => (
  <span className={`pill ${tone}`}>{children}</span>
);

export function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function Select({ value, onChange, options, placeholder, id }) {
  return (
    <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value || null)}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Chips({ value, onChange, options, ariaLabel }) {
  return (
    <div className="row" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="chip"
          aria-pressed={value === o.value}
          onClick={() => onChange(value === o.value ? null : o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Sheet({ title, onClose, children }) {
  return (
    <div className="scrim" role="dialog" aria-modal="true" aria-label={title}
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet">
        <div className="spread">
          <h3>{title}</h3>
          <button type="button" className="small ghost" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Strength of a match recommendation, as a readable badge. */
export const Strength = ({ value }) => (
  <Pill tone={value === 'first-choice' ? 'first' : value === 'situational' ? 'plain' : ''}>
    {value === 'first-choice' ? 'first choice' : value}
  </Pill>
);

export function Meter({ known, learning, total }) {
  const pct = (n) => (total ? `${(n / total) * 100}%` : '0%');
  return (
    <div className="meter" role="img"
         aria-label={`${known} known, ${learning} learning, ${total} total`}>
      <i className="known" style={{ width: pct(known) }} />
      <i className="learning" style={{ width: pct(learning) }} />
    </div>
  );
}

export const hours = (a, b) => (new Date(b) - new Date(a)) / 3.6e6;

export function duration(a, b) {
  const h = hours(a, b ?? new Date().toISOString());
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  return whole ? `${whole}h ${String(mins).padStart(2, '0')}m` : `${mins}m`;
}

export const shortDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export const clock = (iso) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
