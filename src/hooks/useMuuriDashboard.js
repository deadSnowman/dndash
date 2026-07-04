import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import Muuri from 'muuri';

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
    grid.on('dragReleaseEnd', syncPluginOrder);
    grid.refreshItems().layout(true);

    return () => {
      if (orderSyncFrame) {
        window.cancelAnimationFrame(orderSyncFrame);
      }
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
