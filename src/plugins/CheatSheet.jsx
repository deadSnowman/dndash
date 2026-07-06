import { useRef, useState } from 'react';
import PluginCard from '../components/PluginCard.jsx';
import { getVisibleCheatSheetTabs } from './cheatSheetTabs.js';

/**
 * Renders the rules cheat sheet card with configurable tab visibility.
 *
 * @param {object} props Component props.
 * @param {object} [props.cardProps={}] Props forwarded to the wrapping {@link PluginCard}.
 * @param {string[]} [props.visibleCheatSheetTabIds] Tab ids selected in dashboard settings.
 * @returns {JSX.Element} Tabbed cheat sheet content rendered from bundled HTML snippets.
 */
export default function CheatSheet({ cardProps = {}, visibleCheatSheetTabIds }) {
  const [active, setActive] = useState(0);
  const contentRef = useRef(null);
  const tabs = getVisibleCheatSheetTabs(visibleCheatSheetTabIds);
  const activeIndex = Math.min(active, tabs.length - 1);

  /**
   * Smooth-scrolls in-card anchor links to the referenced cheat sheet section.
   *
   * @param {React.MouseEvent<HTMLElement>} event Click event from the cheat sheet content container.
   * @returns {void}
   */
  function jumpToSection(event) {
    const link = event.target.closest('.cheat-sheet-link-list a');
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

  /**
   * Selects a cheat sheet tab and resets the scroll position.
   *
   * @param {number} index Tab index to activate.
   * @returns {void}
   */
  function selectTab(index) {
    setActive(index);
    contentRef.current?.scrollTo({ top: 0 });
  }

  return (
    <PluginCard title="Cheat Sheet" {...cardProps}>
      <ul className="nav nav-tabs cheat-sheet-tabs" id="cheatSheetTab">
        {tabs.map((tab, index) => (
          <li className="nav-item" key={tab.title}>
            <button
              type="button"
              className={`nav-link ${activeIndex === index ? 'active' : ''}`}
              onClick={() => selectTab(index)}
            >
              {tab.title}
            </button>
          </li>
        ))}
      </ul>
      <div
        className="cheat-sheet-tab-content"
        ref={contentRef}
        onClick={jumpToSection}
        dangerouslySetInnerHTML={{ __html: tabs[activeIndex].content }}
      />
    </PluginCard>
  );
}
