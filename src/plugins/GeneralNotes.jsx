import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';

const GENERAL_NOTES_KEY = 'dndash.generalNotes';

function createNote(index = 1) {
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    title: `Note ${index}`,
    body: ''
  };
}

function normalizeNote(note, index) {
  return {
    ...createNote(index + 1),
    ...note,
    id: note?.id || `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    title: note?.title || `Note ${index + 1}`,
    body: note?.body ?? ''
  };
}

function loadSavedNotes() {
  if (typeof window === 'undefined') {
    return {
      notes: [createNote()],
      activeNoteId: null
    };
  }

  try {
    const saved = JSON.parse(window.localStorage.getItem(GENERAL_NOTES_KEY) || '{}');
    const notes = Array.isArray(saved.notes) ? saved.notes.map(normalizeNote) : [createNote()];
    const activeNoteId = notes.some((note) => note.id === saved.activeNoteId)
      ? saved.activeNoteId
      : notes[0]?.id || null;

    return {
      notes,
      activeNoteId
    };
  } catch {
    const note = createNote();
    return {
      notes: [note],
      activeNoteId: note.id
    };
  }
}

function getPreview(body) {
  const trimmed = body.replace(/\s+/g, ' ').trim();
  return trimmed || 'No notes yet';
}

export default function GeneralNotes({ cardProps = {}, requestConfirm }) {
  const [savedNotes] = useState(loadSavedNotes);
  const [notes, setNotes] = useState(savedNotes.notes);
  const [activeNoteId, setActiveNoteId] = useState(savedNotes.activeNoteId || savedNotes.notes[0]?.id || null);

  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeNoteId) || notes[0] || null,
    [activeNoteId, notes]
  );

  useEffect(() => {
    if (!activeNote && notes.length > 0) {
      setActiveNoteId(notes[0].id);
    }
  }, [activeNote, notes]);

  useEffect(() => {
    window.localStorage.setItem(
      GENERAL_NOTES_KEY,
      JSON.stringify({
        notes,
        activeNoteId: activeNote?.id || null
      })
    );
  }, [activeNote, activeNoteId, notes]);

  function addNote() {
    setNotes((current) => {
      const nextNote = createNote(current.length + 1);
      setActiveNoteId(nextNote.id);
      return [...current, nextNote];
    });
  }

  function updateNote(id, field, value) {
    setNotes((current) =>
      current.map((note) => (note.id === id ? { ...note, [field]: value } : note))
    );
  }

  function removeNote(id) {
    setNotes((current) => {
      const nextNotes = current.filter((note) => note.id !== id);
      if (nextNotes.length === 0) {
        const nextNote = createNote();
        setActiveNoteId(nextNote.id);
        return [nextNote];
      }

      if (activeNoteId === id) {
        setActiveNoteId(nextNotes[0].id);
      }

      return nextNotes;
    });
  }

  function requestRemoveNote(note) {
    if (notes.length <= 1 && !note.body.trim() && note.title === 'Note 1') return;

    if (!requestConfirm) {
      removeNote(note.id);
      return;
    }

    requestConfirm({
      title: 'Delete Note?',
      message: `Delete ${note.title || 'this note'}? This cannot be undone.`,
      confirmLabel: 'Delete',
      onConfirm: () => removeNote(note.id)
    });
  }

  return (
    <PluginCard title="General Notes" {...cardProps}>
      <div className="general-notes">
        <div className="notes-sidebar">
          <div className="notes-sidebar-header">
            <span>Sections</span>
            <button type="button" className="btn btn-info btn-sm notes-icon-button" onClick={addNote} aria-label="Add note section" title="Add note section">
              <Plus size={14} strokeWidth={2.4} />
            </button>
          </div>

          <div className="notes-section-list">
            {notes.map((note) => (
              <button
                type="button"
                className={`notes-section-button ${activeNote?.id === note.id ? 'active' : ''}`}
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
              >
                <strong>{note.title || 'Untitled'}</strong>
                <small>{getPreview(note.body)}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="notes-editor">
          {activeNote && (
            <>
              <div className="notes-editor-header">
                <label className="notes-title-field">
                  <span>Title</span>
                  <input
                    className="form-control form-control-sm"
                    value={activeNote.title}
                    onChange={(event) => updateNote(activeNote.id, 'title', event.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="btn btn-light btn-sm notes-icon-button"
                  onClick={() => requestRemoveNote(activeNote)}
                  aria-label={`Delete ${activeNote.title || 'note'}`}
                  title="Delete note"
                >
                  <Trash2 size={14} strokeWidth={2.4} />
                </button>
              </div>

              <label className="notes-body-field">
                <span>Notes</span>
                <textarea
                  className="form-control form-control-sm"
                  value={activeNote.body}
                  placeholder="Session ideas, NPC reminders, loose threads..."
                  onChange={(event) => updateNote(activeNote.id, 'body', event.target.value)}
                />
              </label>
            </>
          )}
        </div>
      </div>
    </PluginCard>
  );
}
