import { useRef, useState } from 'react';

export default function SettingsModal({ plugins, onCancel, onSave }) {
  const [draftPlugins, setDraftPlugins] = useState(() => plugins.map((plugin) => ({ ...plugin })));
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const draggedIdRef = useRef(null);

  function updateEnabled(id, enabled) {
    setDraftPlugins((current) =>
      current.map((plugin) => (plugin.id === id ? { ...plugin, enabled } : plugin))
    );
  }

  function moveDragged(targetId) {
    const activeId = draggedIdRef.current;
    if (!activeId || activeId === targetId) return;

    setDraftPlugins((current) => {
      const next = [...current];
      const from = next.findIndex((plugin) => plugin.id === activeId);
      const to = next.findIndex((plugin) => plugin.id === targetId);
      if (from === -1 || to === -1 || from === to) return current;

      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function endDrag() {
    draggedIdRef.current = null;
    setDraggedId(null);
    setDragOverId(null);
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
            {draftPlugins.map((plugin) => (
              <div key={plugin.id}>
                {draggedId && dragOverId === plugin.id && draggedId !== plugin.id && (
                  <div className="settings-drop-preview" aria-hidden="true" />
                )}
                <div
                  className={`settings-plugin-row ${draggedId === plugin.id ? 'is-dragging' : ''}`}
                  draggable
                  onDragStart={(event) => {
                    draggedIdRef.current = plugin.id;
                    setDraggedId(plugin.id);
                    event.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverId(plugin.id);
                    moveDragged(plugin.id);
                  }}
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
