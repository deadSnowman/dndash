import { useState } from 'react';
import NavBar from '../components/NavBar.jsx';
import aboutImage from '../assets/ledrungorogin_colored.png';

const featureGroups = [
  {
    title: 'Table Utilities',
    items: ['Currency conversion', 'Loot splitting', 'Dice rolling', 'Stat rolling']
  },
  {
    title: 'DM Generators',
    items: ['NPCs and names', 'Encounters', 'Magic item flavor', 'Monster picking']
  },
  {
    title: 'Reference Tools',
    items: ['Combat actions', 'Conditions', 'Movement', 'Spellcasting basics']
  }
];

export default function AboutPage({ darkTheme = false, onToggleTheme }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="outer-container">
      <NavBar active="about" darkTheme={darkTheme} onToggleTheme={onToggleTheme} />
      <div className="content container body">
        <div className="about-layout">
          <section className="about-copy">
            <p className="about-eyebrow">DnDash</p>
            <h1>A virtual DM screen for D&amp;D</h1>
            <p className="about-lede">
              DnDash keeps the little table jobs close at hand: rolling dice, splitting loot,
              checking rules, sketching NPCs, shaping encounters, and adding quick flavor when
              the session turns in an unexpected direction.
            </p>
            <p>
              It is built as a collection of draggable cards, so each DM or player can keep the
              tools they use most visible and hide the rest. Settings save your layout, card order,
              visible cards, and Cheat Sheet tabs locally in the browser.
            </p>

            <div className="about-feature-grid">
              {featureGroups.map((group) => (
                <div className="about-feature-group" key={group.title}>
                  <h2>{group.title}</h2>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="about-note">
              The goal isn't to replace your books or notes, but help with the flow
              to help keep the story in motion.
            </p>
          </section>

          <aside className={`about-image-panel ${imageLoaded ? 'is-loaded' : ''}`}>
            <div className="about-image-placeholder" aria-hidden="true" />
            <img
              src={aboutImage}
              className="about-image"
              alt="DnDash character illustration"
              decoding="async"
              loading="eager"
              onLoad={() => setImageLoaded(true)}
            />
          </aside>
        </div>
      </div>
      <footer>
        <div className="footer navbar-dark">
          <p>Copyright &copy; 2018 Seth Thomas (deadSnowman)</p>
          <p>
            Fork me on <a href="https://github.com/deadSnowman/dndash">Github</a>
          </p>
          <p>
            Check out my other site <a href="https://skribblecats.com/">Skribble Cats</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
