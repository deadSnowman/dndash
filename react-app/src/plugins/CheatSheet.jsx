import { useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import conditionsHtml from '../../../components/plugin-cards/cheat-sheet/conditions.html?raw';
import actionsHtml from '../../../components/plugin-cards/cheat-sheet/actions.html?raw';

const tabs = [
  { title: 'Conditions', content: conditionsHtml },
  { title: 'Actions', content: actionsHtml }
];

export default function CheatSheet({ cardProps = {} }) {
  const [active, setActive] = useState(0);

  return (
    <PluginCard title="Cheat Sheet" dragHandleProps={cardProps.dragHandleProps}>
      <ul className="nav nav-tabs nav-fill" id="cheatSheetTab">
        {tabs.map((tab, index) => (
          <li className="nav-item" key={tab.title}>
            <button
              type="button"
              className={`nav-link ${active === index ? 'active' : ''}`}
              onClick={() => setActive(index)}
            >
              {tab.title}
            </button>
          </li>
        ))}
      </ul>
      <div className="cheat-sheet-tab-content" dangerouslySetInnerHTML={{ __html: tabs[active].content }} />
    </PluginCard>
  );
}
