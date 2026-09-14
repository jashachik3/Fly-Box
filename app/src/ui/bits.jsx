import React, { useEffect, useId, useRef, useState } from 'react';
import { assetUrl } from '../content/index.js';

export const Label = ({ children }) => <h2 className="label">{children}</h2>;

export const Card = ({ children, flush = false, ...rest }) => (
  <div className={flush ? 'card flush' : 'card'} {...rest}>{children}</div>
);

export const Empty = ({ children }) => <div className="empty">{children}</div>;

export const Pill = ({ tone = '', children }) => (
  <span className={`pill ${tone}`}>{children}</span>
);

/**
 * Label and control, explicitly associated. The `for`/`id` pair is deliberate
 * rather than relying on the wrapping <label>: implicit association breaks the
 * moment a control is wrapped in anything, and a screen reader announcing
 * "textbox" with no name is a control nobody can fill in.
 */
export function Field({ label, children }) {
  const id = useId();
  const child = React.isValidElement(children)
    ? React.cloneElement(children, { id: children.props.id ?? id })
    : children;
  return (
    <div className="field">
      <label htmlFor={React.isValidElement(child) ? child.props.id : undefined}>{label}</label>
      {child}
    </div>
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

/**
 * Bottom sheet. Focus moves in on open, is trapped while it is open, Escape
 * closes it, and focus returns to whatever opened it. Without the trap you can
 * tab straight out into the tab bar underneath the scrim, which leaves keyboard
 * and switch users stuck behind a dialog that looks closed off.
 *
 * `onDismiss` is for the case where closing would throw work away — the caller
 * can intercept a backdrop tap or an Escape and ask first.
 */
export function Sheet({ title, onClose, onDismiss, children }) {
  const ref = useRef(null);
  const opener = useRef(null);
  const close = onDismiss ?? onClose;

  useEffect(() => {
    opener.current = document.activeElement;
    const first = ref.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    first?.focus();
    return () => {
      if (opener.current instanceof HTMLElement) opener.current.focus();
    };
  }, []);

  function onKeyDown(e) {
    if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
    if (e.key !== 'Tab') return;

    const stops = [...(ref.current?.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? [])];
    if (!stops.length) return;

    const first = stops[0];
    const last = stops[stops.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  return (
    <div
      className="scrim"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      onKeyDown={onKeyDown}
    >
      <div className="sheet" ref={ref} role="dialog" aria-modal="true" aria-label={title}>
        <div className="spread">
          <h3>{title}</h3>
          <button type="button" className="small ghost" onClick={close}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * Picking a fly used to be a native <select> over forty patterns in
 * alphabetical order — three interactions and a scroll, repeated per fly slot,
 * which is most of why the first fish of the day cost thirteen taps.
 *
 * Slate flies come first and are marked, because the app already knows what it
 * recommended; everything else is one search field away.
 */
export function FlyPicker({ value, onChange, options, slateIds = [] }) {
  const [q, setQ] = React.useState('');
  const term = q.trim().toLowerCase();

  const onSlate = options.filter((o) => slateIds.includes(o.value));
  const rest = options.filter((o) => !slateIds.includes(o.value));
  const shown = term
    ? options.filter((o) => o.label.toLowerCase().includes(term))
    : [...onSlate, ...rest.slice(0, 12)];

  const chip = (o) => (
    <button
      key={o.value} type="button" className="chip"
      aria-pressed={value === o.value}
      onClick={() => onChange(o.value)}
    >
      {o.label}
      {slateIds.includes(o.value) && <em className="on-slate">slate</em>}
    </button>
  );

  return (
    <div className="flypicker">
      {!term && onSlate.length > 0 && (
        <>
          <div className="row">{onSlate.map(chip)}</div>
          <div className="tiny">From your slate. Everything else is below.</div>
        </>
      )}
      <div className="row">{term ? shown.map(chip) : rest.slice(0, 12).map(chip)}</div>
      <input
        type="text" value={q} onChange={(e) => setQ(e.target.value)}
        placeholder={`Search all ${options.length} patterns`}
        aria-label="Search patterns"
      />
      {term && shown.length === 0 && <div className="tiny">Nothing matches.</div>}
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

// ---------------------------------------------------------------------------
// Diagrams
// ---------------------------------------------------------------------------
// Knot sequences and leader schematics are SVGs generated from the content, so
// they scale without limit — which is the whole point on a phone. Inline they
// are a legible thumbnail; tapped, they fill the screen and can be pinched.
// A file that is not there removes itself rather than leaving a broken frame.

export function Diagram({ src, alt = '', hint = 'Tap to enlarge' }) {
  const [ok, setOk] = useState(true);
  const [open, setOpen] = useState(false);
  if (!src || !ok) return null;

  return (
    <>
      <button type="button" className="diagbtn" onClick={() => setOpen(true)}
              aria-label={alt ? `${alt} — open full screen` : 'Open diagram full screen'}>
        <img className="diagram" src={assetUrl(src)} alt={alt} loading="lazy"
             onError={() => setOk(false)} />
        <span className="tiny hint">{hint}</span>
      </button>
      {open && <DiagramViewer src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}

function DiagramViewer({ src, alt, onClose }) {
  const ref = useRef(null);
  const opener = useRef(null);

  useEffect(() => {
    opener.current = document.activeElement;
    ref.current?.querySelector('button')?.focus();
    return () => { if (opener.current instanceof HTMLElement) opener.current.focus(); };
  }, []);

  return (
    <div className="viewer" ref={ref} role="dialog" aria-modal="true" aria-label={alt || 'Diagram'}
         onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } }}>
      <div className="viewerbar">
        <span className="tiny">{alt}</span>
        <button type="button" className="small ghost" onClick={onClose}>Close</button>
      </div>
      <div className="viewerbody">
        <img src={assetUrl(src)} alt={alt} />
      </div>
    </div>
  );
}
