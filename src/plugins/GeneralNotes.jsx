import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';

const GENERAL_NOTES_KEY = 'dndash.generalNotes';

/**
 * Creates a blank note section with a unique id.
 *
 * @param {number} [index=1] Display index used in the default title.
 * @returns {{id: string, title: string, body: string}} Note object.
 */
function createNote(index = 1) {
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    title: `Note ${index}`,
    body: ''
  };
}

/**
 * Normalizes a stored note for safe rendering and editing.
 *
 * @param {object} note Stored note data.
 * @param {number} index Note index in saved data.
 * @returns {{id: string, title: string, body: string}} Normalized note.
 */
function normalizeNote(note, index) {
  return {
    ...createNote(index + 1),
    ...note,
    id: note?.id || `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    title: note?.title || `Note ${index + 1}`,
    body: note?.body ?? ''
  };
}

/**
 * Loads notes and active note selection from local storage.
 *
 * @returns {{notes: object[], activeNoteId: string | null}} Saved notes state.
 */
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

/**
 * Builds a compact note preview for the sidebar.
 *
 * @param {string} body Note body text.
 * @returns {string} Collapsed whitespace preview or an empty-state label.
 */
function getPreview(body) {
  const trimmed = body.replace(/\s+/g, ' ').trim();
  return trimmed || 'No notes yet';
}

/**
 * Renders the general notes card with section list, editor, persistence, and deletion confirmation.
 *
 * @param {object} props Component props.
 * @param {object} [props.cardProps={}] Props forwarded to the wrapping {@link PluginCard}.
 * @param {(config: object) => void} [props.requestConfirm] Shared confirmation modal requester.
 * @returns {JSX.Element} Notes manager with sidebar and active note editor.
 */
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

  /**
   * Adds a new note and makes it active.
   *
   * @returns {void}
   */
  function addNote() {
    setNotes((current) => {
      const nextNote = createNote(current.length + 1);
      setActiveNoteId(nextNote.id);
      return [...current, nextNote];
    });
  }

  /**
   * Updates a field on one note.
   *
   * @param {string} id Note id.
   * @param {string} field Field name to update.
   * @param {string} value Replacement value.
   * @returns {void}
   */
  function updateNote(id, field, value) {
    setNotes((current) =>
      current.map((note) => (note.id === id ? { ...note, [field]: value } : note))
    );
  }

  /**
   * Removes a note and creates a replacement when the last note is deleted.
   *
   * @param {string} id Note id to remove.
   * @returns {void}
   */
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

  /**
   * Requests confirmation before deleting a note when confirmation is available.
   *
   * @param {{id: string, title: string, body: string}} note Note to delete.
   * @returns {void}
   */
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
