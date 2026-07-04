import { usePluginDrafts } from '../hooks/usePluginDrafts.js';

export default function SettingsModal({ plugins, onCancel, onSave }) {
  const {
    draftPlugins,
    draggedId,
    dragOverId,
    updateEnabled,
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
          <div className="modal-footer">
            <button className="btn btn-info btn-sm" type="button" onClick={() => onSave(draftPlugins)}>
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
