import { Settings } from 'lucide-react';

export default function NavBar({ active = 'home', showSettings = false, onSettings }) {
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
        {showSettings && (
          <button type="button" className="btn btn-outline-info btn-sm settings-button" onClick={onSettings}>
            <Settings size={18} strokeWidth={2.2} />
          </button>
        )}
      </div>
    </nav>
  );
}
