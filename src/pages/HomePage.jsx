import { useCallback, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal.jsx';
import NavBar from '../components/NavBar.jsx';
import SettingsModal from '../components/SettingsModal.jsx';
import { useMuuriDashboard } from '../hooks/useMuuriDashboard.js';
import { defaultCheatSheetTabIds } from '../plugins/cheatSheetTabs.js';
import { createInitialPlugins, getPluginComponent } from '../plugins/registry.js';

const DASHBOARD_SETTINGS_KEY = 'dndash.dashboardSettings';
const DEFAULT_COLUMN_COUNT = 3;
const MIN_COLUMN_COUNT = 1;
const MAX_COLUMN_COUNT = 5;

/**
 * Coerces a dashboard column count into the supported range.
 *
 * Invalid values fall back to the default column count.
 *
 * @param {number | string} value Raw column count from settings or storage.
 * @returns {number} Integer column count between the configured minimum and maximum.
 */
function clampColumnCount(value) {
  const columns = Number(value);
  if (!Number.isFinite(columns)) return DEFAULT_COLUMN_COUNT;
  return Math.min(MAX_COLUMN_COUNT, Math.max(MIN_COLUMN_COUNT, Math.round(columns)));
}

/**
 * Merges saved plugin preferences with the current registry defaults.
 *
 * Saved plugins keep order, enabled state, and collapsed state; newly registered plugins are appended.
 *
 * @param {unknown} savedPlugins Plugin settings loaded from storage.
 * @returns {{id: string, name: string, enabled: boolean, collapsed?: boolean}[]} Normalized plugin settings.
 */
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
          typeof savedPlugin.enabled === 'boolean' ? savedPlugin.enabled : defaultPlugin.enabled,
        collapsed: typeof savedPlugin.collapsed === 'boolean' ? savedPlugin.collapsed : false
      };
    })
    .filter(Boolean);
  const newPlugins = defaultPlugins.filter((plugin) => !savedById.has(plugin.id));

  return [...ordered, ...newPlugins];
}

/**
 * Keeps only known cheat sheet tab ids from saved settings.
 *
 * If saved settings contain no visible known tabs, all default tabs are restored.
 *
 * @param {unknown} savedTabIds Saved cheat sheet tab ids.
 * @returns {string[]} Visible cheat sheet tab ids.
 */
function mergeSavedCheatSheetTabIds(savedTabIds) {
  if (!Array.isArray(savedTabIds)) return defaultCheatSheetTabIds;

  const savedIds = new Set(savedTabIds);
  const visibleIds = defaultCheatSheetTabIds.filter((id) => savedIds.has(id));
  return visibleIds.length > 0 ? visibleIds : defaultCheatSheetTabIds;
}

/**
 * Loads dashboard settings from local storage with defensive fallbacks.
 *
 * @returns {{columns: number, cheatSheetTabIds: string[], plugins: object[]}} Dashboard settings for initial React state.
 */
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

/**
 * Persists dashboard settings to local storage in a compact, registry-independent shape.
 *
 * This has the side effect of writing `dndash.dashboardSettings` in the browser.
 *
 * @param {{columns: number | string, cheatSheetTabIds: string[], plugins: object[]}} settings Dashboard settings to persist.
 * @returns {void}
 */
function saveDashboardSettings(settings) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(
    DASHBOARD_SETTINGS_KEY,
    JSON.stringify({
      columns: clampColumnCount(settings.columns),
      cheatSheetTabIds: mergeSavedCheatSheetTabIds(settings.cheatSheetTabIds),
      plugins: settings.plugins.map(({ id, enabled, collapsed }) => ({
        id,
        enabled,
        collapsed: collapsed === true
      }))
    })
  );
}

/**
 * Renders the main dashboard page with draggable plugin cards and settings management.
 *
 * @param {object} props Component props.
 * @param {boolean} [props.darkTheme=false] Whether the current app theme is dark.
 * @param {() => void} props.onToggleTheme Handler called when the navbar theme toggle is clicked.
 * @returns {JSX.Element} The dashboard page, settings modal, and optional confirmation modal.
 */
export default function HomePage({ darkTheme = false, onToggleTheme }) {
  const [dashboardSettings, setDashboardSettings] = useState(loadDashboardSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState(null);
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

  const updatePluginCollapsed = useCallback((pluginId, collapsed) => {
    setDashboardSettings((currentSettings) => {
      const nextPlugins = currentSettings.plugins.map((plugin) =>
        plugin.id === pluginId ? { ...plugin, collapsed } : plugin
      );
      const nextSettings = {
        ...currentSettings,
        plugins: nextPlugins
      };

      saveDashboardSettings(nextSettings);
      return nextSettings;
    });
  }, []);

  const gridRef = useMuuriDashboard(enabledPlugins, updatePluginOrder);

  /**
   * Applies settings from the modal and persists them.
   *
   * @param {{columns: number | string, cheatSheetTabIds: string[], plugins: object[]}} nextSettings Draft settings from the modal.
   * @returns {void}
   */
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

  /**
   * Opens the shared confirmation modal for a plugin-initiated action.
   *
   * @param {{title: string, message: string, cancelLabel?: string, confirmLabel?: string, onConfirm: () => void}} config Modal configuration.
   * @returns {void}
   */
  function requestConfirm(config) {
    setConfirmConfig(config);
  }

  /**
   * Closes the shared confirmation modal.
   *
   * @returns {void}
   */
  function closeConfirm() {
    setConfirmConfig(null);
  }

  /**
   * Runs the pending confirmation callback and closes the modal.
   *
   * @returns {void}
   */
  function confirmAction() {
    const action = confirmConfig?.onConfirm;
    closeConfirm();
    action?.();
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
                  <Component
                    cardProps={{
                      isCollapsed: plugin.collapsed === true,
                      onCollapsedChange: (collapsed) => updatePluginCollapsed(plugin.id, collapsed)
                    }}
                    requestConfirm={requestConfirm}
                    visibleCheatSheetTabIds={cheatSheetTabIds}
                  />
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
      {confirmConfig && (
        <ConfirmModal
          cancelLabel={confirmConfig.cancelLabel}
          confirmLabel={confirmConfig.confirmLabel}
          message={confirmConfig.message}
          title={confirmConfig.title}
          onCancel={closeConfirm}
          onConfirm={confirmAction}
        />
      )}
    </>
  );
}
