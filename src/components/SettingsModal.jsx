import { useState } from 'react';
import { GripVertical, RotateCcw } from 'lucide-react';
import NumberInput from './forms/NumberInput.jsx';
import { usePluginDrafts } from '../hooks/usePluginDrafts.js';
import { cheatSheetTabs, defaultCheatSheetTabIds } from '../plugins/cheatSheetTabs.js';

/**
 * Renders the dashboard settings dialog for card order, visibility, columns, and cheat sheet tabs.
 *
 * @param {object} props Component props.
 * @param {string[]} props.cheatSheetTabIds Currently visible cheat sheet tab ids.
 * @param {number | string} props.columns Current dashboard column count.
 * @param {{id: string, name: string, enabled: boolean}[]} props.defaultPlugins Default plugin ordering and visibility.
 * @param {{id: string, name: string, enabled: boolean}[]} props.plugins Current plugin ordering and visibility.
 * @param {() => void} props.onCancel Handler called when the dialog should close without saving.
 * @param {(settings: {cheatSheetTabIds: string[], columns: number | string, plugins: object[]}) => void} props.onSave Handler called with draft settings.
 * @returns {JSX.Element} A modal dialog containing layout, card, and cheat sheet controls.
 */
export default function SettingsModal({
  cheatSheetTabIds,
  columns,
  defaultPlugins,
  plugins,
  onCancel,
  onSave
}) {
  const [draftColumns, setDraftColumns] = useState(columns);
  const [draftCheatSheetTabIds, setDraftCheatSheetTabIds] = useState(cheatSheetTabIds);
  const {
    draftPlugins,
    draggedId,
    dragOverId,
    updateEnabled,
    resetPlugins,
    startDrag,
    dragOver,
    endDrag
  } = usePluginDrafts(plugins);

  /**
   * Enables or disables a cheat sheet tab while keeping at least one tab selected.
   *
   * @param {string} id Cheat sheet tab id to update.
   * @param {boolean} enabled Whether the tab should be included.
   * @returns {void}
   */
  function updateCheatSheetTab(id, enabled) {
    setDraftCheatSheetTabIds((current) => {
      if (enabled) {
        return current.includes(id) ? current : [...current, id];
      }

      if (current.length <= 1) return current;
      return current.filter((tabId) => tabId !== id);
    });
  }

  /**
   * Restores every cheat sheet tab to the visible set.
   *
   * @returns {void}
   */
  function showAllCheatSheetTabs() {
    setDraftCheatSheetTabIds(defaultCheatSheetTabIds);
  }

  return (
    <div
      className="modal-backdrop-custom"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 id="settings-title" className="modal-title">
              Settings
            </h5>
            <button type="button" className="close" onClick={onCancel} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="settings-section">
              <div className="settings-section-header">
                <div>
                  <div className="settings-section-title">Layout</div>
                  <p>Choose how many dashboard columns to use on larger screens.</p>
                </div>
              </div>
              <div className="settings-inline-field">
                <label htmlFor="settings-columns">Columns</label>
                <NumberInput
                  id="settings-columns"
                  className="settings-columns-input"
                  min="1"
                  max="5"
                  value={draftColumns}
                  onChange={(event) => setDraftColumns(event.target.value)}
                />
              </div>
            </div>
            <div className="settings-section">
              <div className="settings-section-header">
                <div>
                  <div className="settings-section-title">Cards</div>
                  <p>Drag cards to reorder them and uncheck cards you want hidden.</p>
                </div>
                <button
                  className="btn btn-light btn-sm settings-small-action"
                  type="button"
                  onClick={() => resetPlugins(defaultPlugins)}
                >
                  <RotateCcw size={14} strokeWidth={2.4} />
                  Reset
                </button>
              </div>
              <div className="settings-card-list">
                {draftPlugins.map((plugin) => (
                  <div key={plugin.id}>
                    {draggedId && dragOverId === plugin.id && draggedId !== plugin.id && (
                      <div className="settings-drop-preview" aria-hidden="true" />
                    )}
                    <div
                      className={`settings-plugin-row ${draggedId === plugin.id ? 'is-dragging' : ''}`}
                      draggable
                      onDragStart={(event) => startDrag(plugin.id, event)}
                      onDragOver={(event) => dragOver(plugin.id, event)}
                      onDrop={(event) => {
                        event.preventDefault();
                        endDrag();
                      }}
                      onDragEnd={endDrag}
                    >
                      <span className="settings-drag-handle" aria-hidden="true">
                        <GripVertical size={16} strokeWidth={2.4} />
                      </span>
                      <label className="settings-plugin-label">
                        <input
                          type="checkbox"
                          checked={plugin.enabled}
                          onChange={(event) => updateEnabled(plugin.id, event.target.checked)}
                        />{' '}
                        {plugin.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="settings-section">
              <div className="settings-section-header">
                <div>
                  <div className="settings-section-title">Cheat Sheet Tabs</div>
                  <p>Pick the reference tabs shown inside the Cheat Sheet card.</p>
                </div>
                <button
                  className="btn btn-light btn-sm settings-small-action"
                  type="button"
                  onClick={showAllCheatSheetTabs}
                >
                  Show all
                </button>
              </div>
              <div className="settings-checkbox-grid">
                {cheatSheetTabs.map((tab) => {
                  const checked = draftCheatSheetTabIds.includes(tab.id);

                  return (
                    <label className="settings-checkbox" key={tab.id}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={checked && draftCheatSheetTabIds.length <= 1}
                        onChange={(event) => updateCheatSheetTab(tab.id, event.target.checked)}
                      />{' '}
                      {tab.title}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-light btn-sm" type="button" onClick={onCancel}>
              Cancel
            </button>
            <button
              className="btn btn-info btn-sm"
              type="button"
              onClick={() =>
                onSave({
                  cheatSheetTabIds: draftCheatSheetTabIds,
                  columns: draftColumns,
                  plugins: draftPlugins
                })
              }
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
