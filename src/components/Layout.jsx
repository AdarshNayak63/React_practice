import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { LayoutDashboard, Ticket, FileBarChart, Languages, LogOut } from 'lucide-react';
import { ROUTES, ASSETS } from '../authConfig';

const pageTitles = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.TRANSACTIONS]: 'Transactions',
  [ROUTES.QR_DETAILS]: 'QR Details',
  [ROUTES.LANGUAGE_UPDATE]: 'Language Update',
};

export default function Layout({ children }) {
  const auth = useAuth();
  const location = useLocation();

  const username = auth.user?.profile?.preferred_username || auth.user?.profile?.name || 'Merchant';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo-wrap">
          <img src={ASSETS.PNB_LOGO} alt="PNB" className="logo" />
        </div>

        <nav className="nav-list">
          <NavLink to={ROUTES.DASHBOARD} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink to={ROUTES.TRANSACTIONS} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileBarChart size={16} />
            Transactions
          </NavLink>
          <NavLink to={ROUTES.QR_DETAILS} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Ticket size={16} />
            QR Details
          </NavLink>
          <NavLink to={ROUTES.LANGUAGE_UPDATE} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Languages size={16} />
            Language Update
          </NavLink>
        </nav>

        <button type="button" className="nav-item nav-logout" onClick={() => auth.signoutRedirect()}>
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <h1>{pageTitles[location.pathname] || 'Dashboard'}</h1>
          <div className="user-pill">{username}</div>
        </header>

        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}
