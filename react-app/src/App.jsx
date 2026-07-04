import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';

const routes = new Set(['/home', '/about']);

function getRoute() {
  const route = window.location.hash.replace(/^#/, '') || '/home';
  return routes.has(route) ? route : '/home';
}

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '/home';
    }

    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="app-shell">
      {route === '/about' ? <AboutPage /> : <HomePage />}
    </div>
  );
}
