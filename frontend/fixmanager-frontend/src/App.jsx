import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import MachinesPage from './pages/MachinesPage';
import UtilisateursPage from './pages/UtilisateursPage';
import DemandesPage from './pages/DemandesPage';
import InterventionsPage from './pages/InterventionsPage';
import DevisPage from './pages/DevisPage';
import FacturesPage from './pages/FacturesPage';

const pagePaths = {
  Dashboard: '/',
  Clients: '/clients',
  Machines: '/machines',
  Utilisateurs: '/utilisateurs',
  Demandes: '/demandes',
  Interventions: '/interventions',
  Devis: '/devis',
  Factures: '/factures',
};

const getPageFromPath = (pathname) => Object.entries(pagePaths)
  .find(([, path]) => path === pathname)?.[0] || 'Dashboard';

/**
 * Composant principal de l'application.
 * Il gere l'etat de la page active pour afficher le bon module selon le menu selectionne.
 */
function App() {
  const [activePage, setActivePage] = useState(() => getPageFromPath(window.location.pathname));
  const [authenticated, setAuthenticated] = useState(null);

  const navigateToPage = (page) => {
    const path = pagePaths[page] || pagePaths.Dashboard;
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setActivePage(pagePaths[page] ? page : 'Dashboard');
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => setAuthenticated(response.ok))
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => setAuthenticated(false);
    window.addEventListener('fixmanager:session-expired', handleSessionExpired);
    return () => window.removeEventListener('fixmanager:session-expired', handleSessionExpired);
  }, []);

  useEffect(() => {
    const handlePopState = () => setActivePage(getPageFromPath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    navigateToPage('Dashboard');
    setAuthenticated(false);
  };

  const handleAuthenticated = () => {
    navigateToPage('Dashboard');
    setAuthenticated(true);
  };

  if (authenticated === null) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f4f4f3] text-slate-500">Chargement...</div>;
  }

  if (!authenticated) {
    return <LoginPage onAuthenticated={handleAuthenticated} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'Clients':
        return <ClientsPage />;
      case 'Machines':
        return <MachinesPage />;
      case 'Utilisateurs':
        return <UtilisateursPage />;
      case 'Demandes':
        return <DemandesPage />;
      case 'Interventions':
        return <InterventionsPage />;
      case 'Devis':
        return <DevisPage />;
      case 'Factures':
        return <FacturesPage />;
      default:
        return <DashboardPage onNavigate={navigateToPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f5] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <Sidebar activePage={activePage} setActivePage={navigateToPage} onLogout={logout} />
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
