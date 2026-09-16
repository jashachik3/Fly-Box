import React, { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../content/index.js';
import { store } from '../state/db.js';
import { Sheet } from './bits.jsx';

// Every fly and bug picture in the app comes through here, so every one of
// them can be flagged. Long-press (or right-click at a desk) opens a sheet:
// what is wrong with this picture, in tying terms. The note is kept on the
// phone, shows in Box → Notes, and rides out with the backup export. The
// pictures are generated, and the person who can tell a Gotcha from a
// not-quite-Gotcha is the one holding the phone — this is how that gets
// captured without a separate sitting.
//
// A picture that fails to load removes itself rather than leaving a broken
// frame, same as before.

const HOLD_MS = 550;

export const flagId = (path) => `flag:${path}`;

export function useLongPress(onFire) {
  const timer = useRef(null);
  const moved = useRef(false);
  const clear = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
  return {
    onPointerDown: (e) => {
      if (e.button != null && e.button !== 0) return;
      moved.current = false;
      clear();
      timer.current = setTimeout(() => { timer.current = null; if (!moved.current) onFire(); }, HOLD_MS);
    },
    onPointerMove: () => { moved.current = true; clear(); },
    onPointerUp: clear,
    onPointerCancel: clear,
    onPointerLeave: clear,
    onContextMenu: (e) => { e.preventDefault(); onFire(); },
  };
}

/**
 * `subject` is what the picture is of: { kind: 'fly' | 'organism', id, label }.
 * Without a subject the picture is plain — nothing to flag against.
 */
export default function Pic({ src, subject, className = 'thumb', alt = '' }) {
  const [ok, setOk] = useState(true);
  const [open, setOpen] = useState(false);
  const press = useLongPress(() => { if (subject) setOpen(true); });
  if (!src || !ok) return null;

  return (
    <>
      <img
        className={className} src={assetUrl(src)} alt={alt} loading="lazy" draggable={false}
        onError={() => setOk(false)}
        {...(subject ? press : {})}
        style={subject ? { touchAction: 'pan-y', WebkitTouchCallout: 'none', userSelect: 'none' } : undefined}
      />
      {open && <FlagSheet src={src} subject={subject} onClose={() => setOpen(false)} />}
    </>
  );
}

export function FlagSheet({ src, subject, onClose, onSaved }) {
  const id = flagId(src);
  const [note, setNote] = useState('');
  const [existing, setExisting] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    store.flags.get(id).then((f) => { if (alive && f) { setExisting(f); setNote(f.note ?? ''); } });
    return () => { alive = false; };
  }, [id]);

  async function save() {
    const text = note.trim();
    if (!text) return;
    setBusy(true);
    const now = new Date().toISOString();
    await store.flags.put({
      id, path: src,
      subject: { kind: subject.kind, id: subject.id, label: subject.label },
      note: text,
      at: existing?.at ?? now,
      updatedAt: now,
    });
    setBusy(false);
    onSaved?.();
    onClose();
  }

  async function remove() {
    setBusy(true);
    await store.flags.remove(id);
    setBusy(false);
    onSaved?.();
    onClose();
  }

  return (
    <Sheet title="Flag this picture" onClose={onClose}>
      <div className="flagpic">
        <img src={assetUrl(src)} alt="" />
        <div>
          <div className="name">{subject.label}</div>
          <div className="tiny">{subject.id}</div>
        </div>
      </div>
      <label className="tiny" htmlFor="flag-note">What is wrong, in tying terms?</label>
      <textarea id="flag-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. head should be one blob of hot glue, not two beads; wing too dense; rides point-down"
                autoFocus />
      <div className="btnrow">
        {existing && (
          <button type="button" className="ghost" onClick={remove} disabled={busy}>Remove flag</button>
        )}
        <button type="button" className="primary" onClick={save} disabled={busy || !note.trim()}>
          {existing ? 'Update' : 'Save flag'}
        </button>
      </div>
      <div className="tiny">
        Flags live on this phone and go out with your backup. Box → Notes lists
        them, with a button that copies them as text to paste to Claude.
      </div>
    </Sheet>
  );
}
