import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import Muuri from 'muuri';

/**
 * Reads Muuri item positions and returns plugin ids sorted by their visual layout order.
 *
 * @param {Muuri} grid Muuri grid instance containing dashboard items.
 * @returns {string[]} Plugin ids ordered top-to-bottom and then left-to-right.
 */
function getVisualOrder(grid) {
  return grid
    .getItems()
    .map((item, index) => {
      const element = item.getElement();
      const rect = element.getBoundingClientRect();

      return {
        id: element.dataset.pluginId,
        index,
        left: Math.round(rect.left),
        top: Math.round(rect.top)
      };
    })
    .filter((item) => item.id)
    .sort((a, b) => a.top - b.top || a.left - b.left || a.index - b.index)
    .map((item) => item.id);
}

/**
 * Locks the width of the item being dragged so its card does not resize while detached.
 *
 * @param {import('muuri').Item} item Muuri item entering the drag state.
 * @returns {void}
 */
function freezeDraggedItemWidth(item) {
  const element = item.getElement();
  const width = element.getBoundingClientRect().width;

  if (width > 0) {
    const lockedWidth = `${width}px`;
    element.style.width = lockedWidth;
    element.style.minWidth = lockedWidth;
    element.style.maxWidth = lockedWidth;
  }
}

/**
 * Clears the temporary inline width styles applied while dragging an item.
 *
 * @param {import('muuri').Item} item Muuri item leaving the drag state.
 * @returns {void}
 */
function clearDraggedItemWidth(item) {
  const element = item.getElement();
  element.style.width = '';
  element.style.minWidth = '';
  element.style.maxWidth = '';
}

/**
 * Creates and maintains the Muuri dashboard grid for enabled plugin cards.
 *
 * The hook manages Muuri setup, drag handlers, ResizeObserver refreshes, and visual-order
 * synchronization. It mutates DOM styles only during active drags and destroys Muuri on cleanup.
 *
 * @param {{id: string}[]} enabledPlugins Plugins currently rendered in the dashboard.
 * @param {(orderedIds: string[]) => void} onOrderChange Handler called with visual plugin order after drag release.
 * @returns {React.RefObject<HTMLElement>} Ref to attach to the dashboard grid container.
 */
export function useMuuriDashboard(enabledPlugins, onOrderChange) {
  const gridRef = useRef(null);
  const muuriRef = useRef(null);
  const layoutKey = useMemo(
    () => enabledPlugins.map((plugin) => plugin.id).join('|'),
    [enabledPlugins]
  );

  useLayoutEffect(() => {
    if (!gridRef.current) return undefined;

    const grid = new Muuri(gridRef.current, {
      items: '.dashboard-muuri-item',
      dragEnabled: true,
      dragHandle: '.handle',
      dragContainer: document.body,
      dragStartPredicate(item, event) {
        const source = event.srcEvent?.target || event.target;
        if (source?.closest?.('.card-toggle')) {
          return false;
        }

        return Muuri.ItemDrag.defaultStartPredicate(item, event, {
          distance: 8,
          delay: 0
        });
      },
      dragSortHeuristics: {
        sortInterval: 40,
        minDragDistance: 10,
        minBounceBackAngle: 1
      },
      dragReleaseDuration: 220,
      layout: {
        fillGaps: true,
        rounding: true
      },
      layoutDuration: 220,
      layoutEasing: 'ease'
    });

    muuriRef.current = grid;
    let orderSyncFrame = null;

    const syncPluginOrder = () => {
      if (orderSyncFrame) {
        window.cancelAnimationFrame(orderSyncFrame);
      }

      orderSyncFrame = window.requestAnimationFrame(() => {
        orderSyncFrame = null;
        onOrderChange(getVisualOrder(grid));
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      grid.refreshItems().layout();
    });

    grid.getItems().forEach((item) => resizeObserver.observe(item.getElement()));
    grid.on('dragInit', freezeDraggedItemWidth);
    grid.on('dragReleaseEnd', clearDraggedItemWidth);
    grid.on('dragReleaseEnd', syncPluginOrder);
    grid.refreshItems().layout(true);

    return () => {
      if (orderSyncFrame) {
        window.cancelAnimationFrame(orderSyncFrame);
      }
      grid.off('dragInit', freezeDraggedItemWidth);
      grid.off('dragReleaseEnd', clearDraggedItemWidth);
      grid.off('dragReleaseEnd', syncPluginOrder);
      resizeObserver.disconnect();
      grid.destroy(false);
      if (muuriRef.current === grid) {
        muuriRef.current = null;
      }
    };
  }, [layoutKey, onOrderChange]);

  useEffect(() => {
    if (!muuriRef.current) return;

    requestAnimationFrame(() => {
      muuriRef.current?.refreshItems().layout(true);
    });
  }, [layoutKey]);

  return gridRef;
}
