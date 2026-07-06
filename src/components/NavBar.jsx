import { Moon, Settings, Sun } from 'lucide-react';

/**
 * Renders the shared top navigation with route links, theme toggle, and optional settings action.
 *
 * @param {object} props Component props.
 * @param {'home' | 'about'} [props.active='home'] Route name to mark as active.
 * @param {boolean} [props.darkTheme=false] Whether the current theme is dark.
 * @param {boolean} [props.showSettings=false] Whether to render the settings button.
 * @param {() => void} [props.onSettings] Handler called when the settings button is clicked.
 * @param {() => void} [props.onToggleTheme] Handler called when the theme toggle is clicked.
 * @returns {JSX.Element} A Bootstrap navbar with DnDash navigation controls.
 */
export default function NavBar({
  active = 'home',
  darkTheme = false,
  showSettings = false,
  onSettings,
  onToggleTheme
}) {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark py-0">
      <a className="navbar-brand" href="#/home">
        DnDash
      </a>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className={`nav-item ${active === 'home' ? 'active' : ''}`}>
            <a className="nav-link py-0" href="#/home">
              Home
            </a>
          </li>
          <li className={`nav-item ${active === 'about' ? 'active' : ''}`}>
            <a className="nav-link py-0" href="#/about">
              About
            </a>
          </li>
        </ul>
        {onToggleTheme && (
          <button
            type="button"
            className="btn btn-outline-info btn-sm settings-button"
            onClick={onToggleTheme}
            aria-label={darkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
            title={darkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {darkTheme ? <Sun size={18} strokeWidth={2.2} /> : <Moon size={18} strokeWidth={2.2} />}
          </button>
        )}
        {showSettings && (
          <button type="button" className="btn btn-outline-info btn-sm settings-button" onClick={onSettings}>
            <Settings size={18} strokeWidth={2.2} />
          </button>
        )}
      </div>
    </nav>
  );
}
