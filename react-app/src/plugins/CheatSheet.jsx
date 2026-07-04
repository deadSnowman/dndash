import { useRef, useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import conditionsHtml from '../../../components/plugin-cards/cheat-sheet/conditions.html?raw';
import actionsHtml from '../../../components/plugin-cards/cheat-sheet/actions.html?raw';

const tabs = [
  { title: 'Conditions', content: conditionsHtml },
  { title: 'Actions', content: actionsHtml }
];

export default function CheatSheet({ cardProps = {} }) {
  const [active, setActive] = useState(0);
  const contentRef = useRef(null);

  function jumpToCondition(event) {
    const link = event.target.closest('.condition-list a');
    if (!link || !contentRef.current?.contains(link)) return;

    const id = link.getAttribute('href')?.slice(1);
    const target = id ? contentRef.current.querySelector(`#${CSS.escape(id)}`) : null;
    if (!target) return;

    event.preventDefault();
    contentRef.current.scrollTo({
      top: target.offsetTop - contentRef.current.offsetTop,
      behavior: 'smooth'
    });
  }

  return (
    <PluginCard title="Cheat Sheet" dragHandleProps={cardProps.dragHandleProps}>
      <ul className="nav nav-tabs cheat-sheet-tabs" id="cheatSheetTab">
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
      <div
        className="cheat-sheet-tab-content"
        ref={contentRef}
        onClick={jumpToCondition}
        dangerouslySetInnerHTML={{ __html: tabs[active].content }}
      />
    </PluginCard>
  );
}
