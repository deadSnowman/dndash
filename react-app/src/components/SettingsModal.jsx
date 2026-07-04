import { useState } from 'react';
import NumberInput from './forms/NumberInput.jsx';
import { usePluginDrafts } from '../hooks/usePluginDrafts.js';

export default function SettingsModal({ columns, defaultPlugins, plugins, onCancel, onSave }) {
  const [draftColumns, setDraftColumns] = useState(columns);
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
              onClick={() => onSave({ columns: draftColumns, plugins: draftPlugins })}
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
