import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal.jsx';
import NavBar from '../components/NavBar.jsx';
import SettingsModal from '../components/SettingsModal.jsx';
import { useDashboardSettings } from '../hooks/useDashboardSettings.js';
import { useMuuriDashboard } from '../hooks/useMuuriDashboard.js';
import { createInitialPlugins, getPluginComponent } from '../plugins/registry.js';

/**
 * Renders the main dashboard page with draggable plugin cards and settings management.
 *
 * @param {object} props Component props.
 * @param {boolean} [props.darkTheme=false] Whether the current app theme is dark.
 * @param {() => void} props.onToggleTheme Handler called when the navbar theme toggle is clicked.
 * @returns {JSX.Element} The dashboard page, settings modal, and optional confirmation modal.
 */
export default function HomePage({ darkTheme = false, onToggleTheme }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const {
    plugins,
    columns,
    cheatSheetTabIds,
    enabledPlugins,
    updatePluginOrder,
    updatePluginCollapsed,
    saveSettings
  } = useDashboardSettings();
  const dashboardOrderKey = enabledPlugins.map((plugin) => plugin.id).join('|');
  const gridRef = useMuuriDashboard(enabledPlugins, updatePluginOrder);

  /**
   * Saves modal settings through the dashboard settings hook and closes the modal.
   *
   * @param {{columns: number | string, cheatSheetTabIds: string[], plugins: object[]}} nextSettings Draft settings from the modal.
   * @returns {void}
   */
  function saveAndCloseSettings(nextSettings) {
    saveSettings(nextSettings);
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
          onSave={saveAndCloseSettings}
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
