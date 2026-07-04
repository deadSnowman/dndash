import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';

const routes = new Set(['/home', '/about']);
const THEME_KEY = 'dndash.theme';

function getRoute() {
  const route = window.location.hash.replace(/^#/, '') || '/home';
  return routes.has(route) ? route : '/home';
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
}

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [theme, setTheme] = useState(getInitialTheme);
  const darkTheme = theme === 'dark';

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '/home';
    }

    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
