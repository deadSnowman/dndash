import { useCallback, useState } from 'react';
import { defaultCheatSheetTabIds } from '../plugins/cheatSheetTabs.js';
import { createInitialPlugins } from '../plugins/registry.js';

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
 * Manages dashboard settings, plugin ordering, collapsed state, and localStorage persistence.
 *
 * @returns {{dashboardSettings: object, plugins: object[], columns: number, cheatSheetTabIds: string[], enabledPlugins: object[], updatePluginOrder: Function, updatePluginCollapsed: Function, saveSettings: Function}} Dashboard settings state and mutation handlers.
 */
export function useDashboardSettings() {
  const [dashboardSettings, setDashboardSettings] = useState(loadDashboardSettings);
  const { plugins, columns, cheatSheetTabIds } = dashboardSettings;
  const enabledPlugins = plugins.filter((plugin) => plugin.enabled);

  /**
   * Reorders enabled plugins from Muuri's visual order and persists the result.
   *
   * Hidden plugins remain after the visible ordered plugins.
   *
   * @param {string[]} nextOrder Enabled plugin ids in visual order.
   * @returns {void}
   */
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

  /**
   * Updates one plugin's collapsed state and persists the dashboard settings.
   *
   * @param {string} pluginId Plugin id to update.
   * @param {boolean} collapsed Whether the plugin card is collapsed.
   * @returns {void}
   */
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
  }

  return {
    dashboardSettings,
    plugins,
    columns,
    cheatSheetTabIds,
    enabledPlugins,
    updatePluginOrder,
    updatePluginCollapsed,
    saveSettings
  };
}
