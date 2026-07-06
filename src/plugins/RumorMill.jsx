import { Check, Copy, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import SelectField from '../components/forms/SelectField.jsx';

const RUMOR_MILL_KEY = 'dndash.rumorMill';

const truthOptions = ['Unknown', 'True', 'False', 'Partly True', 'Misleading'];
const statusOptions = ['Unheard', 'Heard', 'Followed Up', 'Resolved'];
const filterOptions = ['Active', 'Unheard', 'Heard', 'Resolved', 'All'];

/**
 * Creates a blank rumor with a unique id.
 *
 * @param {number} [index=1] Index used to seed the generated id.
 * @returns {{id: string, rumor: string, source: string, truth: string, status: string, tags: string, payoff: string, notes: string}} Rumor object.
 */
function createRumor(index = 1) {
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    rumor: '',
    source: '',
    truth: 'Unknown',
    status: 'Unheard',
    tags: '',
    payoff: '',
    notes: ''
  };
}

/**
 * Normalizes a stored rumor for safe rendering and editing.
 *
 * @param {object} rumor Stored rumor data.
 * @param {number} index Rumor index in saved data.
 * @returns {{id: string, rumor: string, source: string, truth: string, status: string, tags: string, payoff: string, notes: string}} Normalized rumor.
 */
function normalizeRumor(rumor, index) {
  return {
    ...createRumor(index + 1),
    ...rumor,
    id: rumor?.id || `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    rumor: rumor?.rumor ?? '',
    source: rumor?.source ?? '',
    truth: truthOptions.includes(rumor?.truth) ? rumor.truth : 'Unknown',
    status: statusOptions.includes(rumor?.status) ? rumor.status : 'Unheard',
    tags: rumor?.tags ?? '',
    payoff: rumor?.payoff ?? '',
    notes: rumor?.notes ?? ''
  };
}

/**
 * Loads rumor state from local storage.
 *
 * @returns {{rumors: object[], activeRumorId: string | null, filter: string}} Saved rumor list state.
 */
function loadSavedRumors() {
  if (typeof window === 'undefined') {
    return {
      rumors: [createRumor()],
      activeRumorId: null,
      filter: 'Active'
    };
  }

  try {
    const saved = JSON.parse(window.localStorage.getItem(RUMOR_MILL_KEY) || '{}');
    const rumors = Array.isArray(saved.rumors) ? saved.rumors.map(normalizeRumor) : [createRumor()];
    const activeRumorId = rumors.some((rumor) => rumor.id === saved.activeRumorId)
      ? saved.activeRumorId
      : rumors[0]?.id || null;

    return {
      rumors,
      activeRumorId,
      filter: filterOptions.includes(saved.filter) ? saved.filter : 'Active'
    };
  } catch {
    const rumor = createRumor();
    return {
      rumors: [rumor],
      activeRumorId: rumor.id,
      filter: 'Active'
    };
  }
}

/**
 * Splits comma-separated tag text into trimmed tags.
 *
 * @param {string} value Comma-separated tag string.
 * @returns {string[]} Nonempty tag values.
 */
function splitTags(value) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/**
 * Returns display text for a rumor title.
 *
 * @param {{rumor: string}} rumor Rumor to title.
 * @returns {string} Rumor text or an untitled fallback.
 */
function getRumorTitle(rumor) {
  return rumor.rumor.trim() || 'Untitled rumor';
}

/**
 * Builds a compact sidebar preview from source or tags.
 *
 * @param {{source: string, tags: string}} rumor Rumor to preview.
 * @returns {string} Preview text.
 */
function getPreview(rumor) {
  if (rumor.source.trim()) return rumor.source.trim();
  const tags = splitTags(rumor.tags);
  return tags.length > 0 ? tags.join(', ') : 'No source yet';
}

/**
 * Filters rumors by status.
 *
 * @param {{status: string}[]} rumors Rumors to filter.
 * @param {string} filter Filter option.
 * @returns {object[]} Filtered rumor list.
 */
function filterRumors(rumors, filter) {
  if (filter === 'All') return rumors;
  if (filter === 'Active') return rumors.filter((rumor) => rumor.status !== 'Resolved');
  return rumors.filter((rumor) => rumor.status === filter);
}

/**
 * Determines the next one-click status action for a rumor.
 *
 * @param {{status: string} | null} rumor Active rumor.
 * @returns {{label: string, status: string} | null} Next action, or null when no action applies.
 */
function getNextStatusAction(rumor) {
  if (!rumor) return null;
  if (rumor.status === 'Unheard') return { label: 'Mark Heard', status: 'Heard' };
  if (rumor.status === 'Heard' || rumor.status === 'Followed Up') {
    return { label: 'Mark Resolved', status: 'Resolved' };
  }
  return null;
}

/**
 * Renders one read-only rumor detail block when a value exists.
 *
 * @param {object} props Component props.
 * @param {string} props.label Detail label.
 * @param {string} props.value Detail value.
 * @param {boolean} [props.wide=false] Whether the detail spans the wide grid style.
 * @returns {JSX.Element | null} Detail block or null for empty values.
 */
function DetailItem({ label, value, wide = false }) {
  if (!value) return null;

  return (
    <div className={`rumor-detail-item ${wide ? 'wide' : ''}`.trim()}>
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

/**
 * Renders one rumor metadata pill when a value exists.
 *
 * @param {object} props Component props.
 * @param {string} props.label Metadata label.
 * @param {string} props.value Metadata value.
 * @returns {JSX.Element | null} Metadata pill or null for empty values.
 */
function ReadMeta({ label, value }) {
  if (!value) return null;

  return (
    <div className="rumor-meta-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

/**
 * Renders comma-separated rumor tags as chips.
 *
 * @param {object} props Component props.
 * @param {string} props.tags Comma-separated tag text.
 * @returns {JSX.Element | null} Tag chip list or null when no tags exist.
 */
function TagList({ tags }) {
  const items = splitTags(tags);
  if (items.length === 0) return null;

  return (
    <div className="rumor-detail-item wide">
      <span>Tags</span>
      <div className="rumor-detail-tags">
        {items.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders the rumor manager card with filters, editing, status changes, and clipboard copy.
 *
 * @param {object} props Component props.
 * @param {object} [props.cardProps={}] Props forwarded to the wrapping {@link PluginCard}.
 * @param {(config: object) => void} [props.requestConfirm] Shared confirmation modal requester.
 * @returns {JSX.Element} Rumor mill list and active rumor editor.
 */
export default function RumorMill({ cardProps = {}, requestConfirm }) {
  const [savedRumors] = useState(loadSavedRumors);
  const [rumors, setRumors] = useState(savedRumors.rumors);
  const [activeRumorId, setActiveRumorId] = useState(savedRumors.activeRumorId || savedRumors.rumors[0]?.id || null);
  const [filter, setFilter] = useState(savedRumors.filter);
  const [copyStatus, setCopyStatus] = useState('');
  const [editing, setEditing] = useState(false);

  const activeRumor = useMemo(
    () => rumors.find((rumor) => rumor.id === activeRumorId) || rumors[0] || null,
    [activeRumorId, rumors]
  );
  const visibleRumors = useMemo(() => filterRumors(rumors, filter), [filter, rumors]);
  const nextStatusAction = getNextStatusAction(activeRumor);

  useEffect(() => {
    if (!activeRumor && rumors.length > 0) {
      setActiveRumorId(rumors[0].id);
    }
  }, [activeRumor, rumors]);

  useEffect(() => {
    window.localStorage.setItem(
      RUMOR_MILL_KEY,
      JSON.stringify({
        rumors,
        activeRumorId: activeRumor?.id || null,
        filter
      })
    );
  }, [activeRumor, activeRumorId, filter, rumors]);

  /**
   * Adds a blank rumor, activates it, and enters edit mode.
   *
   * @returns {void}
   */
  function addRumor() {
    setRumors((current) => {
      const nextRumor = createRumor(current.length + 1);
      setActiveRumorId(nextRumor.id);
      setCopyStatus('');
      setEditing(true);
      return [...current, nextRumor];
    });
  }

  /**
   * Updates a field on one rumor.
   *
   * @param {string} id Rumor id.
   * @param {string} field Field name to update.
   * @param {string} value Replacement value.
   * @returns {void}
   */
  function updateRumor(id, field, value) {
    setRumors((current) =>
      current.map((rumor) => (rumor.id === id ? { ...rumor, [field]: value } : rumor))
    );
    setCopyStatus('');
  }

  /**
   * Removes a rumor and creates a replacement when the last rumor is deleted.
   *
   * @param {string} id Rumor id to remove.
   * @returns {void}
   */
  function removeRumor(id) {
    setRumors((current) => {
      const nextRumors = current.filter((rumor) => rumor.id !== id);
      if (nextRumors.length === 0) {
        const nextRumor = createRumor();
        setActiveRumorId(nextRumor.id);
        return [nextRumor];
      }

      if (activeRumorId === id) {
        setActiveRumorId(nextRumors[0].id);
      }

      return nextRumors;
    });
    setCopyStatus('');
  }

  /**
   * Requests confirmation before deleting a rumor when confirmation is available.
   *
   * @param {{id: string, rumor: string}} rumor Rumor to delete.
   * @returns {void}
   */
  function requestRemoveRumor(rumor) {
    if (!requestConfirm) {
      removeRumor(rumor.id);
      return;
    }

    requestConfirm({
      title: 'Delete Rumor?',
      message: `Delete ${getRumorTitle(rumor)}? This cannot be undone.`,
      confirmLabel: 'Delete',
      onConfirm: () => removeRumor(rumor.id)
    });
  }

  /**
   * Applies the next status action to the active rumor.
   *
   * @returns {void}
   */
  function advanceActiveRumorStatus() {
    if (!activeRumor || !nextStatusAction) return;
    updateRumor(activeRumor.id, 'status', nextStatusAction.status);
    setEditing(false);
  }

  /**
   * Copies the player-facing active rumor text to the clipboard.
   *
   * @async
   * @returns {Promise<void>} Resolves after copy status has been updated.
   */
  async function copyPlayerRumor() {
    if (!activeRumor) return;
    const text = [activeRumor.rumor, activeRumor.source && `Source: ${activeRumor.source}`]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Copy failed');
    }
  }

  return (
    <PluginCard title="Rumor Mill" {...cardProps}>
      <div className="rumor-mill">
        <div className="rumor-toolbar">
          <label className="rumor-filter-field">
            <span>Filter</span>
            <SelectField value={filter} onChange={(event) => setFilter(event.target.value)}>
              {filterOptions.map((option) => (
                <option value={option} key={option}>{option}</option>
              ))}
            </SelectField>
          </label>
          <button type="button" className="btn btn-light btn-sm" onClick={advanceActiveRumorStatus} disabled={!nextStatusAction}>
            <Check size={14} strokeWidth={2.4} />
            {nextStatusAction?.label || 'Resolved'}
          </button>
          <button type="button" className="btn btn-info btn-sm" onClick={addRumor}>
            <Plus size={14} strokeWidth={2.4} />
            Add
          </button>
        </div>

        <div className="rumor-layout">
          <div className="rumor-list">
            {visibleRumors.length > 0 ? (
              visibleRumors.map((rumor) => (
                <button
                  type="button"
                  className={`rumor-list-item ${activeRumor?.id === rumor.id ? 'active' : ''}`}
                  key={rumor.id}
                  onClick={() => {
                    setActiveRumorId(rumor.id);
                    setCopyStatus('');
                    setEditing(false);
                  }}
                >
                  <span>
                    <strong>{rumor.status}</strong>
                    <em>{rumor.truth}</em>
                  </span>
                  <p>{getRumorTitle(rumor)}</p>
                  <small>{getPreview(rumor)}</small>
                </button>
              ))
            ) : (
              <div className="rumor-empty">No rumors match this filter.</div>
            )}
          </div>

          <div className="rumor-editor">
            {activeRumor && (
              <>
                <div className="rumor-editor-actions">
                  <button type="button" className="btn btn-light btn-sm" onClick={copyPlayerRumor} disabled={!activeRumor.rumor.trim()}>
                    <Copy size={14} strokeWidth={2.4} />
                    Copy
                  </button>
                  {copyStatus && <small>{copyStatus}</small>}
                  <button
                    type="button"
                    className="btn btn-light btn-sm rumor-icon-button"
                    onClick={() => setEditing((value) => !value)}
                    aria-label={editing ? 'Done editing rumor' : 'Edit rumor'}
                    title={editing ? 'Done editing' : 'Edit rumor'}
                  >
                    {editing ? <Check size={14} strokeWidth={2.4} /> : <Pencil size={14} strokeWidth={2.4} />}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light btn-sm rumor-delete"
                    onClick={() => requestRemoveRumor(activeRumor)}
                    aria-label="Delete rumor"
                    title="Delete rumor"
                  >
                    <Trash2 size={14} strokeWidth={2.4} />
                  </button>
                </div>

                {editing ? (
                  <>
                    <label className="rumor-field wide">
                      <span>Rumor</span>
                      <textarea
                        className="form-control form-control-sm"
                        rows="3"
                        value={activeRumor.rumor}
                        placeholder="What the players hear..."
                        onChange={(event) => updateRumor(activeRumor.id, 'rumor', event.target.value)}
                      />
                    </label>

                    <div className="rumor-field-grid">
                      <label className="rumor-field">
                        <span>Status</span>
                        <SelectField value={activeRumor.status} onChange={(event) => updateRumor(activeRumor.id, 'status', event.target.value)}>
                          {statusOptions.map((option) => (
                            <option value={option} key={option}>{option}</option>
                          ))}
                        </SelectField>
                      </label>
                      <label className="rumor-field">
                        <span>Truth</span>
                        <SelectField value={activeRumor.truth} onChange={(event) => updateRumor(activeRumor.id, 'truth', event.target.value)}>
                          {truthOptions.map((option) => (
                            <option value={option} key={option}>{option}</option>
                          ))}
                        </SelectField>
                      </label>
                    </div>

                    <div className="rumor-field-grid">
                      <label className="rumor-field">
                        <span>Source</span>
                        <input
                          className="form-control form-control-sm"
                          value={activeRumor.source}
                          placeholder="Tavern gossip, dockworker..."
                          onChange={(event) => updateRumor(activeRumor.id, 'source', event.target.value)}
                        />
                      </label>
                      <label className="rumor-field">
                        <span>Tags</span>
                        <input
                          className="form-control form-control-sm"
                          value={activeRumor.tags}
                          placeholder="cult, docks, missing people"
                          onChange={(event) => updateRumor(activeRumor.id, 'tags', event.target.value)}
                        />
                      </label>
                    </div>

                    <label className="rumor-field wide">
                      <span>DM Truth / Payoff</span>
                      <textarea
                        className="form-control form-control-sm"
                        rows="3"
                        value={activeRumor.payoff}
                        placeholder="What is really going on, or what this points toward..."
                        onChange={(event) => updateRumor(activeRumor.id, 'payoff', event.target.value)}
                      />
                    </label>

                    <label className="rumor-field wide">
                      <span>DM Notes</span>
                      <textarea
                        className="form-control form-control-sm"
                        rows="2"
                        value={activeRumor.notes}
                        placeholder="Private reminders..."
                        onChange={(event) => updateRumor(activeRumor.id, 'notes', event.target.value)}
                      />
                    </label>
                  </>
                ) : (
                  <div className="rumor-read-view">
                    <section className="rumor-player-card">
                      <div className="rumor-player-card-header">
                        <span>Player Rumor</span>
                        {activeRumor.source && <small>{activeRumor.source}</small>}
                      </div>
                      <p className={activeRumor.rumor ? '' : 'rumor-read-empty'}>
                        {activeRumor.rumor || 'No player-facing rumor yet. Use the pencil to add one.'}
                      </p>
                    </section>

                    <div className="rumor-meta-strip">
                      <ReadMeta label="Status" value={activeRumor.status} />
                      <ReadMeta label="Truth" value={activeRumor.truth} />
                    </div>

                    <div className="rumor-read-support">
                      <TagList tags={activeRumor.tags} />
                    </div>

                    {(activeRumor.payoff || activeRumor.notes) && (
                      <section className="rumor-dm-panel">
                        <h4>DM Only</h4>
                        <div className="rumor-detail-grid">
                          <DetailItem label="Truth / Payoff" value={activeRumor.payoff} wide />
                          <DetailItem label="Notes" value={activeRumor.notes} wide />
                        </div>
                      </section>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PluginCard>
  );
}
