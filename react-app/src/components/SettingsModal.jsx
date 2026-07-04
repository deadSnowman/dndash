import { useState } from 'react';
import NumberInput from './forms/NumberInput.jsx';
import { usePluginDrafts } from '../hooks/usePluginDrafts.js';
import { cheatSheetTabs } from '../plugins/cheatSheetTabs.js';

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

  function updateCheatSheetTab(id, enabled) {
    setDraftCheatSheetTabIds((current) => {
      if (enabled) {
        return current.includes(id) ? current : [...current, id];
      }

      if (current.length <= 1) return current;
      return current.filter((tabId) => tabId !== id);
    });
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
              <label className="settings-field">
                <span>Columns</span>
                <NumberInput
                  className="settings-columns-input"
                  min="1"
                  max="5"
                  value={draftColumns}
                  onChange={(event) => setDraftColumns(event.target.value)}
                />
              </label>
            </div>
            <div className="settings-section">
              <div className="settings-section-title">Cards</div>
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
                      {'\u2630'}
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
            <div className="settings-section">
              <div className="settings-section-title">Cheat Sheet Tabs</div>
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
            <button
              className="btn btn-outline-secondary btn-sm mr-auto"
              type="button"
              onClick={() => resetPlugins(defaultPlugins)}
            >
              Reset cards
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
              OK
            </button>
            <button className="btn btn-light btn-sm" type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
