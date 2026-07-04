import { useCallback, useState } from 'react';
import NavBar from '../components/NavBar.jsx';
import SettingsModal from '../components/SettingsModal.jsx';
import { useMuuriDashboard } from '../hooks/useMuuriDashboard.js';
import { defaultCheatSheetTabIds } from '../plugins/cheatSheetTabs.js';
import { createInitialPlugins, getPluginComponent } from '../plugins/registry.js';

const DASHBOARD_SETTINGS_KEY = 'dndash.dashboardSettings';
const DEFAULT_COLUMN_COUNT = 3;
const MIN_COLUMN_COUNT = 1;
const MAX_COLUMN_COUNT = 5;

function clampColumnCount(value) {
  const columns = Number(value);
  if (!Number.isFinite(columns)) return DEFAULT_COLUMN_COUNT;
  return Math.min(MAX_COLUMN_COUNT, Math.max(MIN_COLUMN_COUNT, Math.round(columns)));
}

function mergeSavedPlugins(savedPlugins) {
  const defaultPlugins = createInitialPlugins();
  if (!Array.isArray(savedPlugins)) return defaultPlugins;

  const defaultsById = new Map(defaultPlugins.map((plugin) => [plugin.id, plugin]));
  const savedById = new Map(savedPlugins.map((plugin) => [plugin?.id, plugin]));
  const ordered = savedPlugins
    .map((savedPlugin) => {
      const defaultPlugin = defaultsById.get(savedPlugin?.id);
      if (!defaultPlugin) return null;

      return {
        ...defaultPlugin,
        enabled:
          typeof savedPlugin.enabled === 'boolean' ? savedPlugin.enabled : defaultPlugin.enabled
      };
    })
    .filter(Boolean);
  const newPlugins = defaultPlugins.filter((plugin) => !savedById.has(plugin.id));

  return [...ordered, ...newPlugins];
}

function mergeSavedCheatSheetTabIds(savedTabIds) {
  if (!Array.isArray(savedTabIds)) return defaultCheatSheetTabIds;

  const savedIds = new Set(savedTabIds);
  const visibleIds = defaultCheatSheetTabIds.filter((id) => savedIds.has(id));
  return visibleIds.length > 0 ? visibleIds : defaultCheatSheetTabIds;
}

function loadDashboardSettings() {
  if (typeof window === 'undefined') {
    return {
      columns: DEFAULT_COLUMN_COUNT,
      cheatSheetTabIds: defaultCheatSheetTabIds,
      plugins: createInitialPlugins()
    };
  }

  try {
    const savedSettings = JSON.parse(window.localStorage.getItem(DASHBOARD_SETTINGS_KEY) || '{}');
    return {
      columns: clampColumnCount(savedSettings.columns),
      cheatSheetTabIds: mergeSavedCheatSheetTabIds(savedSettings.cheatSheetTabIds),
      plugins: mergeSavedPlugins(savedSettings.plugins)
    };
  } catch {
    return {
      columns: DEFAULT_COLUMN_COUNT,
      cheatSheetTabIds: defaultCheatSheetTabIds,
      plugins: createInitialPlugins()
    };
  }
}

function saveDashboardSettings(settings) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(
    DASHBOARD_SETTINGS_KEY,
    JSON.stringify({
      columns: clampColumnCount(settings.columns),
      cheatSheetTabIds: mergeSavedCheatSheetTabIds(settings.cheatSheetTabIds),
      plugins: settings.plugins.map(({ id, enabled }) => ({ id, enabled }))
    })
  );
}

export default function HomePage({ darkTheme = false, onToggleTheme }) {
  const [dashboardSettings, setDashboardSettings] = useState(loadDashboardSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { plugins, columns, cheatSheetTabIds } = dashboardSettings;
  const enabledPlugins = plugins.filter((plugin) => plugin.enabled);
  const dashboardOrderKey = enabledPlugins.map((plugin) => plugin.id).join('|');

  const updatePluginOrder = useCallback((nextOrder) => {
    setDashboardSettings((currentSettings) => {
      const currentEnabledOrder = currentSettings.plugins
        .filter((plugin) => plugin.enabled)
        .map((plugin) => plugin.id);

      if (nextOrder.join('|') === currentEnabledOrder.join('|')) {
        return currentSettings;
      }

      const byId = new Map(currentSettings.plugins.map((plugin) => [plugin.id, plugin]));
      const ordered = nextOrder.map((id) => byId.get(id)).filter(Boolean);
      const hidden = currentSettings.plugins.filter((plugin) => !nextOrder.includes(plugin.id));
      const nextSettings = {
        ...currentSettings,
        plugins: [...ordered, ...hidden]
      };

      saveDashboardSettings(nextSettings);
      return nextSettings;
    });
  }, []);

  const gridRef = useMuuriDashboard(enabledPlugins, updatePluginOrder);

  function saveSettings(nextSettings) {
    const settings = {
      columns: clampColumnCount(nextSettings.columns),
      cheatSheetTabIds: mergeSavedCheatSheetTabIds(nextSettings.cheatSheetTabIds),
      plugins: nextSettings.plugins.map((plugin) => ({ ...plugin }))
    };

    setDashboardSettings(settings);
    saveDashboardSettings(settings);
    setSettingsOpen(false);
  }

  return (
    <>
      <NavBar
        active="home"
        darkTheme={darkTheme}
        showSettings
        onSettings={() => setSettingsOpen(true)}
        onToggleTheme={onToggleTheme}
      />
      <div className="dash-content container-fluid">
        <div
          key={dashboardOrderKey}
          ref={gridRef}
          className="dashboard-muuri"
          style={{ '--dashboard-columns': columns }}
        >
          {enabledPlugins.map((plugin) => {
            const Component = getPluginComponent(plugin.id);
            if (!Component) return null;

            return (
              <div className="dashboard-muuri-item" data-plugin-id={plugin.id} key={plugin.id}>
                <div className="dashboard-muuri-item-content">
                  <Component visibleCheatSheetTabIds={cheatSheetTabIds} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {settingsOpen && (
        <SettingsModal
          cheatSheetTabIds={cheatSheetTabIds}
          columns={columns}
          defaultPlugins={createInitialPlugins()}
          plugins={plugins}
          onCancel={() => setSettingsOpen(false)}
          onSave={saveSettings}
        />
      )}
    </>
  );
}
