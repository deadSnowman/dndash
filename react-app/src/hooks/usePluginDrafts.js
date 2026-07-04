import { useRef, useState } from 'react';

export function usePluginDrafts(plugins) {
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

  function startDrag(id, event) {
    draggedIdRef.current = id;
    setDraggedId(id);
    event.dataTransfer.effectAllowed = 'move';
  }

  function dragOver(id, event) {
    event.preventDefault();
    setDragOverId(id);
    moveDragged(id);
  }

  function endDrag() {
    draggedIdRef.current = null;
    setDraggedId(null);
    setDragOverId(null);
  }

  return {
    draftPlugins,
    draggedId,
    dragOverId,
    updateEnabled,
    startDrag,
    dragOver,
    endDrag
  };
}
