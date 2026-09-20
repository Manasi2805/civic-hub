import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const citizenUser = JSON.parse(localStorage.getItem('civic_citizen_user') || '{}');
  const navLinks = [

    { path: '/report', label: 'Report Issue' },
    { path: '/track', label: 'Track' },
    { path: '/dashboard', label: 'Dashboard' }
  ];
  const handleSignOut = () => {
    localStorage.removeItem('civic_citizen_user');
    window.location.reload();
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          CIVIC <span>HUB</span>
        </Link>
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li className="nav-item" key={link.path}>
              <Link
                to={link.path}
                className={`nav-links ${location.pathname.startsWith(link.path) ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
