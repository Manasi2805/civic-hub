import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import TrackComplaint from './pages/TrackComplaint';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import CitizenLogin from './pages/CitizenLogin';
import './App.css';

function Navigation() {
  const location = useLocation();

  // Read saved citizen session from localStorage
  let citizenUser = null;
  try {
    const raw = localStorage.getItem('civic_citizen_user');
    if (raw) citizenUser = JSON.parse(raw);
  } catch (err) {
    citizenUser = null;
  }

  const handleSignOut = () => {
    localStorage.removeItem('civic_citizen_user');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        CIVIC HUB
      </Link>

      <div className="nav-links">
        <Link
          to="/report"
          className={`nav-link ${location.pathname === '/report' ? 'active' : ''}`}
        >
          Report Issue
        </Link>
        <Link
          to="/track"
          className={`nav-link ${location.pathname.startsWith('/track') ? 'active' : ''}`}
        >
          Track
        </Link>
        <Link
          to="/dashboard"
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </Link>

        {/* Dynamic Citizen Sign In / Sign Out */}
        {citizenUser && citizenUser.contact ? (
          <button
            type="button"
            className="nav-link"
            onClick={handleSignOut}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#f59e0b',
              fontWeight: 600,
              padding: 0
            }}
          >
            Sign Out ({citizenUser.fullName ? citizenUser.fullName.split(' ')[0] : 'Citizen'})
          </button>
        ) : (
          <Link
            to="/login"
            className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            style={{ color: '#f59e0b', fontWeight: 600 }}
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/track" element={<TrackComplaint />} />
            <Route path="/track/:id" element={<TrackComplaint />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<CitizenLogin />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}