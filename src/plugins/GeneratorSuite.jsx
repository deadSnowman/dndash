import { useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import LocationGenerator from './LocationGenerator.jsx';
import MagicItemQuirkGenerator from './MagicItemQuirkGenerator.jsx';
import NpcGenerator from './NpcGenerator.jsx';

const generatorTabs = [
  { id: 'npc', label: 'NPC', Component: NpcGenerator },
  { id: 'location', label: 'Location', Component: LocationGenerator },
  { id: 'magicItem', label: 'Magic Item', Component: MagicItemQuirkGenerator }
];

export default function GeneratorSuite({ cardProps = {} }) {
  const [activeTab, setActiveTab] = useState(generatorTabs[0].id);

  return (
    <PluginCard title="Quick Generators" dragHandleProps={cardProps.dragHandleProps}>
      <div className="generator-suite">
        <div className="generator-suite-tabs" role="tablist" aria-label="Quick generators">
          {generatorTabs.map((tab) => (
            <button
              type="button"
              className={`generator-suite-tab ${activeTab === tab.id ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`generator-panel-${tab.id}`}
              id={`generator-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {generatorTabs.map(({ id, Component }) => (
          <div
            className="generator-suite-panel"
            hidden={activeTab !== id}
            id={`generator-panel-${id}`}
            role="tabpanel"
            aria-labelledby={`generator-tab-${id}`}
            key={id}
          >
            <Component embedded />
          </div>
        ))}
      </div>
    </PluginCard>
  );
}
