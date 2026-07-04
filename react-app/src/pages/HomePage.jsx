import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Muuri from 'muuri';
import NavBar from '../components/NavBar.jsx';
import SettingsModal from '../components/SettingsModal.jsx';
import CurrencyConverter from '../plugins/CurrencyConverter.jsx';
import LootSplitter from '../plugins/LootSplitter.jsx';
import StatRoller from '../plugins/StatRoller.jsx';
import CheatSheet from '../plugins/CheatSheet.jsx';
import DiceRoller from '../plugins/DiceRoller.jsx';

const pluginComponents = {
  currencyConverter: CurrencyConverter,
  lootSplitter: LootSplitter,
  statRoller: StatRoller,
  cheatSheet: CheatSheet,
  diceRoller: DiceRoller
};

const initialPlugins = [
  { id: 'currencyConverter', name: 'Currency Converter', enabled: true },
  { id: 'lootSplitter', name: 'Loot Splitter', enabled: true },
  { id: 'statRoller', name: 'Stat Roller', enabled: true },
  { id: 'cheatSheet', name: 'Cheat Sheet', enabled: true },
  { id: 'diceRoller', name: 'Die Roller', enabled: true }
];

export default function HomePage() {
  const [plugins, setPlugins] = useState(initialPlugins);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const gridRef = useRef(null);
  const muuriRef = useRef(null);
  const enabledPlugins = plugins.filter((plugin) => plugin.enabled);
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

    const syncPluginOrder = () => {
      const nextOrder = grid
        .getItems()
        .map((item) => item.getElement().dataset.pluginId)
        .filter(Boolean);

      setPlugins((current) => {
        const byId = new Map(current.map((plugin) => [plugin.id, plugin]));
        const ordered = nextOrder.map((id) => byId.get(id)).filter(Boolean);
        const hidden = current.filter((plugin) => !nextOrder.includes(plugin.id));
        return [...ordered, ...hidden];
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      grid.refreshItems().layout();
    });

    grid.getItems().forEach((item) => resizeObserver.observe(item.getElement()));
    grid.on('dragReleaseEnd', syncPluginOrder);
    grid.refreshItems().layout(true);

    return () => {
      grid.off('dragReleaseEnd', syncPluginOrder);
      resizeObserver.disconnect();
      grid.destroy(false);
      if (muuriRef.current === grid) {
        muuriRef.current = null;
      }
    };
  }, [layoutKey]);

  useEffect(() => {
    if (!muuriRef.current) return;

    requestAnimationFrame(() => {
      muuriRef.current?.refreshItems().layout(true);
    });
  }, [layoutKey]);

  function saveSettings(nextPlugins) {
    setPlugins(nextPlugins.map((plugin) => ({ ...plugin })));
    setSettingsOpen(false);
  }

  return (
    <>
      <NavBar active="home" showSettings onSettings={() => setSettingsOpen(true)} />
      <div className="dash-content container-fluid">
        <div ref={gridRef} className="dashboard-muuri">
          {enabledPlugins.map((plugin) => {
            const Component = pluginComponents[plugin.id];
            return (
              <div className="dashboard-muuri-item" data-plugin-id={plugin.id} key={plugin.id}>
                <div className="dashboard-muuri-item-content">
                  <Component />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {settingsOpen && (
        <SettingsModal
          plugins={plugins}
          onCancel={() => setSettingsOpen(false)}
          onSave={saveSettings}
        />
      )}
    </>
  );
}
