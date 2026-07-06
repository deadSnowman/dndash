import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';

const routes = new Set(['/home', '/about']);
const THEME_KEY = 'dndash.theme';

/**
 * Reads the current hash route and falls back to the home page for unknown routes.
 *
 * @returns {'/home' | '/about'} The normalized route to render.
 */
function getRoute() {
  const route = window.location.hash.replace(/^#/, '') || '/home';
  return routes.has(route) ? route : '/home';
}

/**
 * Reads the saved theme preference from browser storage.
 *
 * @returns {'light' | 'dark'} The initial theme name, defaulting to light outside the browser.
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
}

/**
 * Renders the DnDash application shell and chooses the active hash-routed page.
 *
 * @returns {JSX.Element} The themed app wrapper containing either the home or about page.
 */
export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [theme, setTheme] = useState(getInitialTheme);
  const darkTheme = theme === 'dark';

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '/home';
    }

    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  /**
   * Toggles the document theme and persists the next value to local storage.
   *
   * @returns {void}
   */
  function toggleTheme() {
    setTheme((current) => {
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(THEME_KEY, nextTheme);
      return nextTheme;
    });
  }

  return (
    <div className="app-shell" data-theme={theme}>
      {route === '/about' ? (
        <AboutPage darkTheme={darkTheme} onToggleTheme={toggleTheme} />
      ) : (
        <HomePage darkTheme={darkTheme} onToggleTheme={toggleTheme} />
      )}
    </div>
  );
}
