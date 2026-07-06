import { useRef, useState } from 'react';

/**
 * Manages editable plugin visibility and drag ordering inside the settings modal.
 *
 * The hook keeps a local copy of plugin settings and uses native drag events to reorder drafts.
 *
 * @param {{id: string, enabled: boolean}[]} plugins Source plugin settings to copy into draft state.
 * @returns {{draftPlugins: object[], draggedId: string | null, dragOverId: string | null, updateEnabled: Function, resetPlugins: Function, startDrag: Function, dragOver: Function, endDrag: Function}} Draft plugins and handlers for settings interactions.
 */
export function usePluginDrafts(plugins) {
  const [draftPlugins, setDraftPlugins] = useState(() => plugins.map((plugin) => ({ ...plugin })));
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const draggedIdRef = useRef(null);

  /**
   * Updates the enabled flag for one draft plugin.
   *
   * @param {string} id Plugin id to update.
   * @param {boolean} enabled Whether the plugin should be visible.
   * @returns {void}
   */
  function updateEnabled(id, enabled) {
    setDraftPlugins((current) =>
      current.map((plugin) => (plugin.id === id ? { ...plugin, enabled } : plugin))
    );
  }

  /**
   * Replaces draft plugins with a fresh copy and clears any active drag state.
   *
   * @param {{id: string, enabled: boolean}[]} nextPlugins Plugin settings to copy.
   * @returns {void}
   */
  function resetPlugins(nextPlugins) {
    setDraftPlugins(nextPlugins.map((plugin) => ({ ...plugin })));
    endDrag();
  }

  /**
   * Moves the currently dragged plugin before the target plugin in draft order.
   *
   * @param {string} targetId Plugin id currently being dragged over.
   * @returns {void}
   */
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

  /**
   * Starts a native drag operation for a plugin row.
   *
   * @param {string} id Plugin id being dragged.
   * @param {DragEvent} event Native drag start event.
   * @returns {void}
   */
  function startDrag(id, event) {
    draggedIdRef.current = id;
    setDraggedId(id);
    event.dataTransfer.effectAllowed = 'move';
  }

  /**
   * Handles drag-over events and reorders the active plugin draft.
   *
   * @param {string} id Plugin id being dragged over.
   * @param {DragEvent} event Native drag-over event.
   * @returns {void}
   */
  function dragOver(id, event) {
    event.preventDefault();
    setDragOverId(id);
    moveDragged(id);
  }

  /**
   * Clears all drag state after a drop or cancelled drag.
   *
   * @returns {void}
   */
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
    resetPlugins,
    startDrag,
    dragOver,
    endDrag
  };
}
