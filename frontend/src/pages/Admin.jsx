import React, { useState, useEffect } from 'react';
import VerificationCard from '../components/VerificationCard';
import { getDashboardSummary, getDashboardIssues, updateComplaintStatus, getComplaint } from '../services/api';
import './Admin.css';

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'civicadmin2026'
};

export default function Admin() {
  // Session-backed authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('civic_admin_auth') === 'true';
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Dashboard states
  const [expandedId, setExpandedId] = useState(null);
  const [summary, setSummary] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedData, setExpandedData] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      loginForm.username === ADMIN_CREDENTIALS.username &&
      loginForm.password === ADMIN_CREDENTIALS.password
    ) {
      sessionStorage.setItem('civic_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid administrator credentials.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('civic_admin_auth');
    setIsAuthenticated(false);
    setExpandedId(null);
    setExpandedData(null);
  };

  const fetchData = async () => {
    setLoading(true);
    const [sumRes, issRes] = await Promise.all([
      getDashboardSummary(),
      getDashboardIssues()
    ]);
    if (sumRes?.data) setSummary(sumRes.data);
    if (issRes?.data) setIssues(issRes.data);
    setLoading(false);
  };

  const handleRowClick = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedData(null);
      return;
    }
    setExpandedId(id);
    setExpandedData(null);
    const res = await getComplaint(id);
    if (res?.data) setExpandedData(res.data);
  };

  const handleStatusUpdate = async (id, status) => {
    await updateComplaintStatus(id, { status });
    fetchData();
  };

  const handlePriorityUpdate = async (id, priority) => {
    await updateComplaintStatus(id, { priority });
    fetchData();
  };

  // 1. Unauthenticated Login Gate
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-box">
          <h2>Admin Access</h2>
          <p>Enter administrator credentials to view and update official civic records.</p>

          {authError && <div className="admin-auth-error">{authError}</div>}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-login-field">
              <label>Username</label>
              <input
                type="text"
                required
                placeholder="admin"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              />
            </div>

            <div className="admin-login-field">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>

            <button type="submit" className="admin-login-btn">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard View
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>OFFICIAL DASHBOARD</h1>
        <button onClick={handleLogout} className="admin-logout-btn">
          Sign Out
        </button>
      </div>

      <div className="admin-stats">
        <div className="a-stat">
          <h3>{summary.pending_assignment || 0}</h3>
          <p>Pending Assignment</p>
        </div>
        <div className="a-stat">
          <h3>{summary.under_verification || 0}</h3>
          <p>Needs Verification</p>
        </div>
        <div className="a-stat warning">
          <h3>{summary.high_priority || 0}</h3>
          <p>High Priority</p>
        </div>
        <div className="a-stat danger">
          <h3>{summary.overdue_slas || 0}</h3>
          <p>Overdue SLAs</p>
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <p style={{ padding: '2rem' }}>Loading...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ISSUE</th>
                <th>AREA</th>
                <th>VERIF %</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>LAST MODIFIED</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((row) => (
                <React.Fragment key={row.id}>
                  <tr className="main-row" onClick={() => handleRowClick(row.id)}>
                    <td>{row.id}</td>
                    <td>{row.issue_type}</td>
                    <td>{row.area || row.authority_name || 'Mysuru (Unassigned)'}</td>
                    <td>
                      <span className={`verif-badge ${row.verification_score > 0.7 ? 'high' : 'low'}`}>
                        {row.verification_score <= 1 && row.verification_score > 0
                          ? Math.round(row.verification_score * 100)
                          : Math.round(row.verification_score)}%
                      </span> </td>
                    <td>{row.priority}</td>
                    <td>
                      <span className={`st-badge ${row.status}`}>{row.status}</span>
                    </td>
                    <td>{row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                  {expandedId === row.id && (
                    <tr className="expanded-row">
                      <td colSpan="7">
                        <div className="exp-content">
                          {expandedData ? (
                            <>
                              <div className="exp-left">
                                <VerificationCard analysis={expandedData.verification} />
                              </div>
                              <div className="exp-right">
                                <div className="mini-map-placeholder">
                                  {expandedData.location
                                    ? `Lat: ${expandedData.location.lat}, Lng: ${expandedData.location.lng}`
                                    : 'Mini Map View'}
                                </div>
                                <div className="action-buttons">
                                  <button
                                    className="btn-act primary"
                                    onClick={() => handleStatusUpdate(row.id, 'acknowledged')}
                                  >
                                    Acknowledge
                                  </button>
                                  <button
                                    className="btn-act secondary"
                                    onClick={() => handleStatusUpdate(row.id, 'in_progress')}
                                  >
                                    Assign Team
                                  </button>
                                  <button
                                    className="btn-act success"
                                    onClick={() => handleStatusUpdate(row.id, 'resolved')}
                                  >
                                    Mark Resolved
                                  </button>
                                </div>

                                {/* Priority Assignment Section */}
                                <div style={{ marginTop: '12px' }}>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                                    Assign Priority:
                                  </span>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                      type="button"
                                      className="btn-act"
                                      style={{ background: 'var(--status-red)', color: '#fff', padding: '6px 12px' }}
                                      onClick={() => handlePriorityUpdate(row.id, 'High')}
                                    >
                                      High
                                    </button>
                                    <button
                                      type="button"
                                      className="btn-act"
                                      style={{ background: 'var(--status-amber)', color: '#000', padding: '6px 12px' }}
                                      onClick={() => handlePriorityUpdate(row.id, 'Medium')}
                                    >
                                      Medium
                                    </button>
                                    <button
                                      type="button"
                                      className="btn-act"
                                      style={{ background: 'var(--status-blue)', color: '#fff', padding: '6px 12px' }}
                                      onClick={() => handlePriorityUpdate(row.id, 'Low')}
                                    >
                                      Low
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p style={{ padding: '1rem' }}>Loading details...</p>
                          )}
                        </div>
                      </td>
                      <td>
                        {issue.updated_at
                          ? new Date(issue.updated_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                          : issue.created_at
                            ? new Date(issue.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                            : new Date().toLocaleDateString()
                        }
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}