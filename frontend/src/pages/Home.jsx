import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardSummary } from '../services/api';
import './Home.css';

export default function Home() {
  const [stats, setStats] = useState({ open_issues: 2412, resolved_today: 145, under_verification: 32 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await getDashboardSummary();
      if (data && !error) {
        setStats({
          open_issues: data.open_issues || 0,
          resolved_today: data.resolved_today || 0,
          under_verification: data.under_verification || 0
        });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="bg-animation"></div>
        <div className="hero-content">
          <h1>See a problem.<br/><span className="gold-text">Report it.</span><br/>Track what happens next.</h1>
          <p>A civic issue reporting and visibility platform for Mysuru.</p>
          <div className="hero-ctas">
            <Link to="/report" className="btn btn-primary">REPORT AN ISSUE</Link>
            <Link to="/dashboard" className="btn btn-outline">VIEW CIVIC STATUS</Link>
          </div>
        </div>
      </div>
      
      <div className="stats-bar">
        <div className="stat-item">
          <h3>{loading ? '...' : stats.open_issues}</h3><p>Open Issues</p>
        </div>
        <div className="stat-item">
          <h3>{loading ? '...' : stats.resolved_today}</h3><p>Resolved Today</p>
        </div>
        <div className="stat-item">
          <h3>{loading ? '...' : stats.under_verification}</h3><p>Under Verification</p>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="f-icon">📝</div>
          <h3>Report Seamlessly</h3>
          <p>Location-aware forms and evidence upload via phone or desktop.</p>
        </div>
        <div className="feature-card">
          <div className="f-icon">🔍</div>
          <h3>Track Progress</h3>
          <p>Real-time timeline updates on verification, routing, and resolution.</p>
        </div>
        <div className="feature-card">
          <div className="f-icon">📊</div>
          <h3>Full Transparency</h3>
          <p>Public dashboards holding wards accountable for SLA compliance.</p>
        </div>
      </div>
    </div>
  );
}
