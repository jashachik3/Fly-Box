import React, { useState } from 'react';
import { store } from '../state/db.js';
import { useAsync } from '../state/useAsync.js';
import { Card, Label, Empty } from './bits.jsx';
import Pic, { FlagSheet } from './Pic.jsx';

// Box → Notes: every picture you have flagged, newest first. "Copy for
// Claude" puts them on the clipboard as plain lines — id, then the note — which
// is exactly the shape the prompt fixes get written from.

export default function NotesPanel() {
  const { data: flags, reload } = useAsync(() => store.flags.all(), []);
  const [editing, setEditing] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!flags) return <Empty>Loading…</Empty>;
  const rows = [...flags].sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));

  const asText = () => rows.map((f) => `${f.subject.id} — ${f.note}`).join('\n');

  async function copy() {
    try {
      await navigator.clipboard.writeText(asText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be refused in some contexts; the text is still selectable below.
    }
  }

  return (
    <section className="block">
      <div className="spread">
        <Label>Picture notes</Label>
        {rows.length > 0 && (
          <button type="button" className="small" onClick={copy}>{copied ? 'Copied' : 'Copy for Claude'}</button>
        )}
      </div>
      <div className="tiny">
        Long-press any fly or bug picture anywhere in the app to note what is
        wrong with it. The notes collect here and go out with your backup.
      </div>

      {rows.length === 0 && <Empty>No pictures flagged yet.</Empty>}

      {rows.length > 0 && (
        <Card flush>
          {rows.map((f) => (
            <button type="button" className="listrow" key={f.id} onClick={() => setEditing(f)}>
              <Pic src={f.path} subject={null} />
              <div className="grow">
                <div className="name">{f.subject.label}</div>
                <div className="sub">{f.note}</div>
              </div>
              <span className="tiny">edit</span>
            </button>
          ))}
        </Card>
      )}

      {rows.length > 0 && (
        <details className="whyline">
          <summary className="tiny">As text</summary>
          <pre className="tiny" style={{ whiteSpace: 'pre-wrap', userSelect: 'text' }}>{asText()}</pre>
        </details>
      )}

      {editing && (
        <FlagSheet src={editing.path} subject={editing.subject}
                   onClose={() => setEditing(null)} onSaved={reload} />
      )}
    </section>
  );
}
