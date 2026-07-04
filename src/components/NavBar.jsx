import { Moon, Settings, Sun } from 'lucide-react';

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
