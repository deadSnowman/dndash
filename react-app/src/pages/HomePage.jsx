import { useCallback, useState } from 'react';
import NavBar from '../components/NavBar.jsx';
import SettingsModal from '../components/SettingsModal.jsx';
import { useMuuriDashboard } from '../hooks/useMuuriDashboard.js';
import { createInitialPlugins, getPluginComponent } from '../plugins/registry.js';

export default function HomePage() {
  const [plugins, setPlugins] = useState(createInitialPlugins);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const enabledPlugins = plugins.filter((plugin) => plugin.enabled);

  const updatePluginOrder = useCallback((nextOrder) => {
    setPlugins((current) => {
      const byId = new Map(current.map((plugin) => [plugin.id, plugin]));
      const ordered = nextOrder.map((id) => byId.get(id)).filter(Boolean);
      const hidden = current.filter((plugin) => !nextOrder.includes(plugin.id));
      return [...ordered, ...hidden];
    });
  }, []);

  const gridRef = useMuuriDashboard(enabledPlugins, updatePluginOrder);

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
            const Component = getPluginComponent(plugin.id);
            if (!Component) return null;

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
