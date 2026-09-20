const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');
const pagesDir = path.join(srcDir, 'pages');
const servicesDir = path.join(srcDir, 'services');

fs.mkdirSync(componentsDir, { recursive: true });
fs.mkdirSync(pagesDir, { recursive: true });
fs.mkdirSync(servicesDir, { recursive: true });

const files = {
  'src/index.css': `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --bg-base: #0a0a0f;
  --bg-elevated: #12121a;
  --card-bg: rgba(26, 26, 46, 0.8);
  --card-border: rgba(255, 255, 255, 0.08);
  --accent-gold: #f0c040;
  --accent-hover: #ffd060;
  --text-primary: #ffffff;
  --text-secondary: #a0a0b0;
  --text-muted: #6b6b80;
  
  --status-green: #00c853;
  --status-amber: #ffab00;
  --status-red: #ff5252;
  --status-blue: #448aff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-base);
  color: var(--text-primary);
  line-height: 1.6;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-base);
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
::selection {
  background: var(--accent-gold);
  color: #000;
}`,

  'src/App.css': `.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  padding-top: 64px; /* offset for navbar */
}`,

  'src/App.jsx': `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import TrackComplaint from './pages/TrackComplaint';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/track" element={<TrackComplaint />} />
            <Route path="/track/:id" element={<TrackComplaint />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;`,

  'src/main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconRetinaUrl: iconRetina,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

  'src/services/api.js': `const BASE_URL = '/api';

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return { data: null, error: errorData.message || 'API Error' };
  }
  const data = await res.json();
  return { data, error: null };
};

export const submitComplaint = async (formData) => {
  try {
    const res = await fetch(\`\${BASE_URL}/complaints\`, { method: 'POST', body: formData });
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getComplaint = async (id) => {
  try {
    const res = await fetch(\`\${BASE_URL}/complaints/\${id}\`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const updateComplaintStatus = async (id, data) => {
  try {
    const res = await fetch(\`\${BASE_URL}/complaints/\${id}/status\`, { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getComplaintHistory = async (id) => {
  try {
    const res = await fetch(\`\${BASE_URL}/complaints/\${id}/history\`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const resolveRouting = async (data) => {
  try {
    const res = await fetch(\`\${BASE_URL}/routing/resolve\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const analyzeVerification = async (data) => {
  try {
    const res = await fetch(\`\${BASE_URL}/verification/analyze\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const checkDuplicate = async (data) => {
  try {
    const res = await fetch(\`\${BASE_URL}/verification/duplicate-check\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getDashboardSummary = async () => {
  try {
    const res = await fetch(\`\${BASE_URL}/dashboard/summary\`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getDashboardIssues = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(\`\${BASE_URL}/dashboard/issues?\${query}\`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getAreaInsight = async (areaId) => {
  try {
    const res = await fetch(\`\${BASE_URL}/dashboard/areas/\${areaId}\`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getAllAreas = async () => {
  try {
    const res = await fetch(\`\${BASE_URL}/dashboard/areas\`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getInsights = async () => {
  try {
    const res = await fetch(\`\${BASE_URL}/dashboard/insights\`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};

export const getBoundaries = async () => {
  try {
    const res = await fetch(\`\${BASE_URL}/dashboard/boundaries\`);
    return handleResponse(res);
  } catch (err) { return { data: null, error: err.message }; }
};`,

  'src/components/Navbar.jsx': `import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/report', label: 'Report Issue' },
    { path: '/track', label: 'Track' },
    { path: '/dashboard', label: 'Dashboard' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          CIVIC <span>HUB</span>
        </Link>
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        <ul className={\`nav-menu \${menuOpen ? 'active' : ''}\`}>
          {navLinks.map((link) => (
            <li className="nav-item" key={link.path}>
              <Link 
                to={link.path} 
                className={\`nav-links \${location.pathname.startsWith(link.path) ? 'active' : ''}\`}
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
}`,
  
  'src/components/Navbar.css': `.navbar {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--card-border);
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
}

.navbar-logo {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.navbar-logo span {
  color: var(--accent-gold);
  text-shadow: 0 0 10px rgba(240, 192, 64, 0.5);
}

.nav-menu {
  display: flex;
  list-style: none;
}

.nav-item {
  margin-left: 2rem;
}

.nav-links {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-links:hover {
  color: var(--text-primary);
}

.nav-links::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: var(--accent-gold);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-links:hover::after, .nav-links.active::after {
  width: 100%;
}
.nav-links.active {
  color: var(--text-primary);
}

.menu-icon {
  display: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .menu-icon {
    display: block;
  }
  .nav-menu {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: absolute;
    top: 64px;
    left: -100%;
    background: var(--card-bg);
    backdrop-filter: blur(12px);
    transition: all 0.3s ease;
  }
  .nav-menu.active {
    left: 0;
  }
  .nav-item {
    margin: 1.5rem 0;
    text-align: center;
  }
}`,

  'src/components/StatusBadge.jsx': `import React from 'react';
import './StatusBadge.css';

export default function StatusBadge({ status, text }) {
  const getStatusClass = () => {
    switch(status.toLowerCase()) {
      case 'resolved':
      case 'likely_genuine':
        return 'status-green';
      case 'routed':
      case 'acknowledged':
      case 'in_progress':
      case 'under_review':
        return 'status-amber';
      case 'needs_review':
      case 'likely_fraudulent':
      case 'open':
      case 'high_priority':
        return 'status-red';
      case 'submitted':
      case 'verified':
      default:
        return 'status-blue';
    }
  };

  return (
    <span className={\`status-badge \${getStatusClass()}\`}>
      {text || status.replace('_', ' ').toUpperCase()}
    </span>
  );
}`,

  'src/components/StatusBadge.css': `.status-badge {
  padding: 4px 12px;
  border-radius: 24px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  display: inline-block;
}

.status-green {
  background-color: rgba(0, 200, 83, 0.15);
  color: var(--status-green);
  border: 1px solid rgba(0, 200, 83, 0.3);
  box-shadow: 0 0 10px rgba(0, 200, 83, 0.2);
}

.status-amber {
  background-color: rgba(255, 171, 0, 0.15);
  color: var(--status-amber);
  border: 1px solid rgba(255, 171, 0, 0.3);
  box-shadow: 0 0 10px rgba(255, 171, 0, 0.2);
}

.status-red {
  background-color: rgba(255, 82, 82, 0.15);
  color: var(--status-red);
  border: 1px solid rgba(255, 82, 82, 0.3);
  box-shadow: 0 0 10px rgba(255, 82, 82, 0.2);
}

.status-blue {
  background-color: rgba(68, 138, 255, 0.15);
  color: var(--status-blue);
  border: 1px solid rgba(68, 138, 255, 0.3);
  box-shadow: 0 0 10px rgba(68, 138, 255, 0.2);
}`,

  'src/components/StatsCard.jsx': `import React, { useEffect, useState } from 'react';
import './StatsCard.css';

export default function StatsCard({ title, value, icon, duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <h3 className="stats-value">{count}</h3>
        <p className="stats-title">{title}</p>
      </div>
    </div>
  );
}`,

  'src/components/StatsCard.css': `.stats-card {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  border-color: rgba(240, 192, 64, 0.3);
}

.stats-icon {
  font-size: 2.5rem;
  margin-right: 1.5rem;
  color: var(--accent-gold);
}

.stats-content {
  display: flex;
  flex-direction: column;
}

.stats-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stats-title {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}`,

  'src/components/ComplaintTimeline.jsx': `import React from 'react';
import './ComplaintTimeline.css';

export default function ComplaintTimeline({ history = [] }) {
  // dummy data fallback if history empty
  const events = history.length ? history : [
    { status: 'SUBMITTED', message: 'Complaint filed successfully.', timestamp: '10:00 AM, Oct 24' },
    { status: 'VERIFIED', message: 'Passed automated duplicate & AI checks.', timestamp: '10:05 AM, Oct 24' },
    { status: 'ROUTED', message: 'Assigned to Ward 42 Sanitation Dept.', timestamp: '10:10 AM, Oct 24' },
    { status: 'IN_PROGRESS', message: 'Team dispatched to location.', timestamp: null }
  ];

  return (
    <div className="timeline-container">
      {events.map((event, idx) => {
        const isCompleted = event.timestamp != null;
        const isCurrent = !isCompleted && (idx === 0 || events[idx - 1].timestamp != null);
        
        return (
          <div key={idx} className={\`timeline-item \${isCompleted ? 'completed' : ''} \${isCurrent ? 'current' : ''}\`}>
            <div className="timeline-marker">
              <div className="dot"></div>
              {idx < events.length - 1 && <div className="line"></div>}
            </div>
            <div className="timeline-content" style={{ animationDelay: \`\${idx * 0.15}s\` }}>
              <h4>{event.status}</h4>
              <p>{event.message}</p>
              {isCompleted && <span className="time">{event.timestamp}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}`,

  'src/components/ComplaintTimeline.css': `.timeline-container {
  padding: 1rem 0;
}

.timeline-item {
  display: flex;
  margin-bottom: 0;
  min-height: 80px;
}

.timeline-marker {
  position: relative;
  width: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1.5rem;
}

.timeline-marker .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--text-muted);
  z-index: 2;
  margin-top: 4px;
}

.timeline-marker .line {
  width: 2px;
  flex: 1;
  background: var(--text-muted);
  border-style: dashed;
  margin-top: 4px;
  margin-bottom: -4px;
}

.completed .timeline-marker .dot {
  background: var(--accent-gold);
  box-shadow: 0 0 8px rgba(240, 192, 64, 0.5);
}

.completed .timeline-marker .line {
  background: var(--accent-gold);
  border-style: solid;
}

.current .timeline-marker .dot {
  background: var(--status-blue);
  box-shadow: 0 0 10px var(--status-blue);
  animation: pulse 1.5s infinite;
}

.timeline-content {
  padding-bottom: 2rem;
  opacity: 0;
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.timeline-content h4 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.timeline-content p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.timeline-content .time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(68, 138, 255, 0.7); }
  70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(68, 138, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(68, 138, 255, 0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`,

  'src/components/VerificationCard.jsx': `import React, { useState } from 'react';
import './VerificationCard.css';
import StatusBadge from './StatusBadge';

export default function VerificationCard({ analysis }) {
  const [expanded, setExpanded] = useState(false);
  
  const defaultAnalysis = analysis || {
    score: 85,
    decision: 'likely_genuine',
    signals: [
      { name: 'Image Metadata', status: 'pass', description: 'EXIF data matches upload time' },
      { name: 'Location Consistency', status: 'pass', description: 'GPS coordinates within city limits' },
      { name: 'Duplicate Check', status: 'warn', description: 'Similar image found in Ward 12 (70% match)' },
      { name: 'Spatial Clustering', status: 'pass', description: 'Consistent with local issue density' }
    ],
    reason: 'High confidence based on metadata and location, minor warning on duplicate check.'
  };

  const getIcon = (status) => {
    if (status === 'pass') return <span className="sig-icon pass">✓</span>;
    if (status === 'fail') return <span className="sig-icon fail">✗</span>;
    return <span className="sig-icon warn">⚠</span>;
  };

  return (
    <div className="verification-card">
      <div className="vc-header">
        <div className="vc-score-ring">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="circle" strokeDasharray={\`\${defaultAnalysis.score}, 100\`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke={defaultAnalysis.score > 70 ? 'var(--status-green)' : 'var(--status-amber)'}/>
            <text x="18" y="20.35" className="percentage">{defaultAnalysis.score}%</text>
          </svg>
        </div>
        <div className="vc-info">
          <h4>AI Verification</h4>
          <StatusBadge status={defaultAnalysis.decision} />
        </div>
      </div>
      
      <div className="vc-toggle" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide Details' : 'Why?'}
      </div>

      {expanded && (
        <div className="vc-details">
          <p className="vc-reason">{defaultAnalysis.reason}</p>
          <ul className="vc-signals">
            {defaultAnalysis.signals.map((sig, i) => (
              <li key={i}>
                {getIcon(sig.status)}
                <div>
                  <strong>{sig.name}</strong>
                  <span>{sig.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}`,

  'src/components/VerificationCard.css': `.verification-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1.25rem;
  backdrop-filter: blur(12px);
}

.vc-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.vc-score-ring {
  width: 60px;
  height: 60px;
}

.circular-chart {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: rgba(255,255,255,0.1);
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke-width: 3.8;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
}

.percentage {
  fill: var(--text-primary);
  font-family: sans-serif;
  font-size: 0.6em;
  text-anchor: middle;
  font-weight: bold;
}

@keyframes progress {
  0% { stroke-dasharray: 0 100; }
}

.vc-info h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.vc-toggle {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--accent-gold);
  cursor: pointer;
  text-align: right;
}
.vc-toggle:hover { text-decoration: underline; }

.vc-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--card-border);
  animation: fadeIn 0.3s;
}

.vc-reason {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.vc-signals {
  list-style: none;
}
.vc-signals li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
}
.vc-signals li strong { display: block; color: var(--text-primary); }
.vc-signals li span { color: var(--text-muted); }

.sig-icon { font-weight: bold; }
.sig-icon.pass { color: var(--status-green); }
.sig-icon.warn { color: var(--status-amber); }
.sig-icon.fail { color: var(--status-red); }

@keyframes fadeIn {
  from { opacity: 0; } to { opacity: 1; }
}`,

  'src/components/RoutingResult.jsx': `import React, { useState } from 'react';
import './RoutingResult.css';

export default function RoutingResult({ result }) {
  const [expanded, setExpanded] = useState(false);
  const data = result || {
    authority_name: 'Mysuru City Corporation - Ward 42',
    authority_type: 'Municipal Ward',
    boundary_version: 'v2026.1',
    confidence: 'high',
    explanation: 'Coordinates fall strictly within MCC Ward 42 boundaries based on latest city surveys.'
  };

  return (
    <div className="routing-result-card">
      <div className="rr-header">
        <div className="rr-icon">✓</div>
        <div className="rr-info">
          <h4>{data.authority_name}</h4>
          <span className="rr-type">{data.authority_type}</span>
        </div>
      </div>
      
      <div className="rr-toggle" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide Details' : 'Why was this selected?'}
      </div>

      {expanded && (
        <div className="rr-details">
          <p>{data.explanation}</p>
          <p className="rr-meta">Boundary mapping version: {data.boundary_version}</p>
        </div>
      )}
    </div>
  );
}`,

  'src/components/RoutingResult.css': `.routing-result-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1.25rem;
  backdrop-filter: blur(12px);
}
.rr-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.rr-icon {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: rgba(0, 200, 83, 0.15);
  color: var(--status-green);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: bold;
}
.rr-info h4 { margin: 0; color: var(--text-primary); font-size: 1rem; }
.rr-type { font-size: 0.8rem; color: var(--text-secondary); background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px; display: inline-block; margin-top: 4px; }
.rr-toggle { margin-top: 1rem; font-size: 0.85rem; color: var(--accent-gold); cursor: pointer; text-align: right; }
.rr-toggle:hover { text-decoration: underline; }
.rr-details { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--card-border); font-size: 0.85rem; color: var(--text-secondary); }
.rr-meta { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; }`,

  'src/components/IssueCard.jsx': `import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import './IssueCard.css';

export default function IssueCard({ issue }) {
  const navigate = useNavigate();
  const d = issue || {
    id: 'MYS-2026-9281',
    type: 'Pothole',
    area: 'Ward 42',
    status: 'open',
    date: '2026-10-24',
    priority: 'high',
    score: 92
  };

  const getIcon = (type) => {
    if (type.includes('Garbage')) return '🗑️';
    if (type.includes('Pothole')) return '🕳️';
    if (type.includes('Light')) return '💡';
    return '📋';
  };

  return (
    <div className="issue-card" onClick={() => navigate(\`/track/\${d.id}\`)}>
      <div className="ic-header">
        <span className="ic-id">{d.id}</span>
        {d.priority === 'high' && <span className="ic-priority">HIGH PRIORITY</span>}
      </div>
      <div className="ic-body">
        <div className="ic-icon">{getIcon(d.type)}</div>
        <div className="ic-details">
          <h4>{d.type}</h4>
          <p>{d.area} • {d.date}</p>
        </div>
      </div>
      <div className="ic-footer">
        <StatusBadge status={d.status} />
        <div className="ic-score">Score: {d.score}%</div>
      </div>
    </div>
  );
}`,

  'src/components/IssueCard.css': `.issue-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 1rem;
  backdrop-filter: blur(12px);
  cursor: pointer;
  transition: all 0.2s;
  display: flex; flex-direction: column; gap: 0.75rem;
}
.issue-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.2); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.ic-header { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; }
.ic-id { color: var(--text-muted); font-family: monospace; }
.ic-priority { color: var(--status-red); font-weight: bold; font-size: 0.65rem; border: 1px solid var(--status-red); padding: 1px 4px; border-radius: 4px; }
.ic-body { display: flex; gap: 1rem; align-items: center; }
.ic-icon { font-size: 2rem; background: rgba(255,255,255,0.05); width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
.ic-details h4 { margin: 0 0 0.25rem 0; color: var(--text-primary); }
.ic-details p { margin: 0; font-size: 0.8rem; color: var(--text-secondary); }
.ic-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; }
.ic-score { font-size: 0.75rem; color: var(--text-muted); }`,

  'src/components/MapView.jsx': `import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import './MapView.css';

function LocationSelector({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if(onLocationSelect) onLocationSelect(e.latlng);
    },
  });
  return null;
}

export default function MapView({ 
  mode = 'display', 
  complaints = [], 
  zones = null, 
  onZoneClick,
  onLocationSelect,
  selectedLocation
}) {
  const defaultCenter = [12.3051, 76.6551]; // Mysuru

  const zoneStyle = (feature) => {
    const density = feature.properties.density || 'low';
    let color = '#00c853';
    if (density === 'medium') color = '#ffab00';
    if (density === 'high') color = '#ff5252';
    return {
      fillColor: color,
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.3
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        if (onZoneClick) onZoneClick(feature);
      }
    });
  };

  return (
    <div className="map-wrapper">
      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}>
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution='&copy; Stadia Maps'
        />
        
        {mode === 'picker' && <LocationSelector onLocationSelect={onLocationSelect} />}
        {mode === 'picker' && selectedLocation && (
          <Marker position={selectedLocation} />
        )}

        {mode === 'display' && zones && (
          <GeoJSON data={zones} style={zoneStyle} onEachFeature={onEachFeature} />
        )}

        {mode === 'display' && complaints.length > 0 && (
          <MarkerClusterGroup chunkedLoading>
            {complaints.map(c => (
              <Marker key={c.id} position={[c.lat, c.lng]}>
                <Popup>
                  <strong>{c.type}</strong><br/>
                  Status: {c.status}
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
    </div>
  );
}`,

  'src/components/MapView.css': `.map-wrapper {
  height: 100%;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--card-border);
}
.leaflet-container {
  background-color: var(--bg-elevated);
}
.leaflet-popup-content-wrapper { background: var(--bg-elevated); color: var(--text-primary); }
.leaflet-popup-tip { background: var(--bg-elevated); }`,

  'src/components/LocationPicker.jsx': `import React, { useState } from 'react';
import MapView from './MapView';
import './LocationPicker.css';

export default function LocationPicker({ onLocationSelected }) {
  const [mapMode, setMapMode] = useState(false);
  const [coords, setCoords] = useState(null);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(c);
          if(onLocationSelected) onLocationSelected(c);
        },
        (err) => alert('Geolocation error: ' + err.message)
      );
    }
  };

  const handleMapSelect = (latlng) => {
    setCoords(latlng);
    if(onLocationSelected) onLocationSelected(latlng);
  };

  return (
    <div className="location-picker">
      {!mapMode ? (
        <div className="lp-buttons">
          <button className="lp-btn primary" onClick={handleGetCurrentLocation}>
            📍 Use Current Location
          </button>
          <button className="lp-btn outline" onClick={() => setMapMode(true)}>
            🗺️ Select on Map
          </button>
        </div>
      ) : (
        <div className="lp-map-container">
          <MapView mode="picker" onLocationSelect={handleMapSelect} selectedLocation={coords} />
          <button className="lp-btn small mt" onClick={() => setMapMode(false)}>Close Map</button>
        </div>
      )}
      {coords && (
        <div className="lp-selected">
          Selected: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
}`,

  'src/components/LocationPicker.css': `.location-picker {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  padding: 1.5rem;
  border-radius: 12px;
}
.lp-buttons { display: flex; gap: 1rem; }
.lp-btn {
  flex: 1; padding: 0.75rem; border-radius: 8px; font-weight: 600; cursor: pointer;
  border: none; transition: all 0.2s; font-family: inherit; font-size: 0.95rem;
}
.lp-btn.primary { background: var(--accent-gold); color: #000; }
.lp-btn.primary:hover { background: var(--accent-hover); }
.lp-btn.outline { background: transparent; border: 1px solid var(--text-muted); color: var(--text-primary); }
.lp-btn.outline:hover { border-color: var(--text-primary); }
.lp-btn.small { padding: 0.5rem; font-size: 0.85rem; background: rgba(255,255,255,0.1); color: white; width: 100%; margin-top: 1rem; }
.lp-map-container { height: 300px; }
.lp-selected { margin-top: 1rem; font-size: 0.9rem; color: var(--status-green); background: rgba(0,200,83,0.1); padding: 0.5rem; border-radius: 4px; text-align: center; }`,

  'src/components/EvidenceUpload.jsx': `import React, { useState } from 'react';
import './EvidenceUpload.css';

export default function EvidenceUpload() {
  const [file, setFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="evidence-upload" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
      {!file ? (
        <div className="eu-empty">
          <div className="eu-icons">📸 📹</div>
          <p>Drag & Drop evidence here</p>
          <div className="eu-actions">
            <label className="eu-btn"><input type="file" hidden accept="image/*" onChange={e => setFile(e.target.files[0])} />Upload Photo</label>
            <label className="eu-btn"><input type="file" hidden accept="video/*" onChange={e => setFile(e.target.files[0])} />Upload Video</label>
          </div>
        </div>
      ) : (
        <div className="eu-file">
          <div className="eu-preview">📎 {file.name} ({(file.size/1024/1024).toFixed(2)} MB)</div>
          <button className="eu-remove" onClick={() => setFile(null)}>Remove</button>
        </div>
      )}
    </div>
  );
}`,

  'src/components/EvidenceUpload.css': `.evidence-upload {
  border: 2px dashed var(--text-muted);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  background: rgba(255,255,255,0.02);
  transition: all 0.3s;
}
.evidence-upload:hover { border-color: var(--accent-gold); background: rgba(240, 192, 64, 0.05); }
.eu-icons { font-size: 2rem; margin-bottom: 1rem; }
.eu-empty p { color: var(--text-secondary); margin-bottom: 1.5rem; }
.eu-actions { display: flex; justify-content: center; gap: 1rem; }
.eu-btn {
  background: var(--bg-elevated); border: 1px solid var(--card-border); color: var(--text-primary);
  padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; transition: 0.2s;
}
.eu-btn:hover { background: rgba(255,255,255,0.1); }
.eu-file { display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; }
.eu-remove { background: var(--status-red); color: white; border: none; padding: 0.25rem 0.75rem; border-radius: 4px; cursor: pointer; }`,

  'src/pages/Home.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="bg-animation"></div>
        <div className="hero-content">
          <h1>See a problem.<br/><span className="gold-text">Report it.</span><br/>Track what happens next.</h1>
          <p>A civic issue reporting and visibility platform for Mysuru.</p>
          <div className="hero-ctas">
            <Link to="/report" className="btn btn-primary">REPORT AN ISSUE</Link>
            <Link to="/track" className="btn btn-outline">VIEW CIVIC STATUS</Link>
          </div>
        </div>
      </div>
      
      <div className="stats-bar">
        <div className="stat-item">
          <h3>2,412</h3><p>Open Issues</p>
        </div>
        <div className="stat-item">
          <h3>145</h3><p>Resolved Today</p>
        </div>
        <div className="stat-item">
          <h3>32</h3><p>Under Verification</p>
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
}`,

  'src/pages/Home.css': `.home-container { width: 100%; min-height: 100vh; }
.hero-section { position: relative; height: 80vh; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
.bg-animation {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
  background: radial-gradient(circle at center, #1a1a2e 0%, var(--bg-base) 100%);
}
.hero-content { z-index: 1; max-width: 800px; padding: 2rem; }
.hero-content h1 { font-size: 4rem; line-height: 1.1; margin-bottom: 1.5rem; color: var(--text-primary); font-weight: 700; letter-spacing: -1px; }
.gold-text { color: var(--accent-gold); }
.hero-content p { font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2.5rem; }
.hero-ctas { display: flex; justify-content: center; gap: 1.5rem; }
.btn { padding: 1rem 2rem; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 1rem; transition: 0.3s; }
.btn-primary { background: var(--accent-gold); color: #000; box-shadow: 0 0 20px rgba(240, 192, 64, 0.3); }
.btn-primary:hover { background: var(--accent-hover); box-shadow: 0 0 30px rgba(240, 192, 64, 0.5); transform: translateY(-2px); }
.btn-outline { background: transparent; border: 2px solid rgba(255,255,255,0.2); color: var(--text-primary); }
.btn-outline:hover { border-color: var(--text-primary); background: rgba(255,255,255,0.05); }

.stats-bar { display: flex; justify-content: space-around; padding: 2rem; background: var(--card-bg); border-top: 1px solid var(--card-border); border-bottom: 1px solid var(--card-border); }
.stat-item { text-align: center; }
.stat-item h3 { font-size: 2.5rem; color: var(--accent-gold); margin-bottom: 0.5rem; }
.stat-item p { color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem; }

.features-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
.feature-card { background: var(--bg-elevated); padding: 2rem; border-radius: 12px; border: 1px solid var(--card-border); text-align: center; transition: 0.3s; }
.feature-card:hover { transform: translateY(-5px); border-color: var(--accent-gold); }
.f-icon { font-size: 3rem; margin-bottom: 1rem; }
.feature-card h3 { margin-bottom: 1rem; color: var(--text-primary); }
.feature-card p { color: var(--text-secondary); font-size: 0.95rem; }

@media (max-width: 768px) {
  .hero-content h1 { font-size: 2.5rem; }
  .hero-ctas { flex-direction: column; }
  .stats-bar { flex-direction: column; gap: 2rem; }
}`,

  'src/pages/ReportIssue.jsx': `import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EvidenceUpload from '../components/EvidenceUpload';
import LocationPicker from '../components/LocationPicker';
import VerificationCard from '../components/VerificationCard';
import RoutingResult from '../components/RoutingResult';
import './ReportIssue.css';

export default function ReportIssue() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [procStep, setProcStep] = useState(0);

  const categories = [
    { id: 'garbage', icon: '🗑️', label: 'Garbage Dump' },
    { id: 'construction', icon: '🏗️', label: 'Construction Waste' },
    { id: 'bin', icon: '🗑️', label: 'Overflowing Bin' },
    { id: 'pothole', icon: '🕳️', label: 'Pothole' },
    { id: 'light', icon: '💡', label: 'Streetlight' },
    { id: 'other', icon: '❓', label: 'Other' }
  ];

  const handleSubmit = () => {
    setSubmitting(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setProcStep(current);
      if (current >= 5) {
        clearInterval(interval);
        setTimeout(() => setStep(5), 500);
      }
    }, 500);
  };

  return (
    <div className="report-container">
      <div className="r-header">
        <h2>Report an Issue</h2>
        {step < 5 && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: \`\${(step/4)*100}%\` }}></div>
          </div>
        )}
      </div>

      <div className="r-content">
        {step === 1 && (
          <div className="step-content fade-in">
            <h3>Step 1: What's the issue?</h3>
            <div className="category-grid">
              {categories.map(c => (
                <div key={c.id} className={\`cat-card \${category === c.id ? 'selected' : ''}\`} onClick={() => setCategory(c.id)}>
                  <div className="cat-icon">{c.icon}</div>
                  <div className="cat-label">{c.label}</div>
                </div>
              ))}
            </div>
            <button className="r-btn-next" disabled={!category} onClick={() => setStep(2)}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content fade-in">
            <h3>Step 2: Describe the issue</h3>
            <textarea className="r-textarea" placeholder="Provide any useful details..."></textarea>
            <p className="r-note">Optional if photo/video is provided</p>
            <div className="r-actions">
              <button className="r-btn-back" onClick={() => setStep(1)}>Back</button>
              <button className="r-btn-next" onClick={() => setStep(3)}>Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content fade-in">
            <h3>Step 3: Provide Evidence</h3>
            <EvidenceUpload />
            <div className="r-actions">
              <button className="r-btn-back" onClick={() => setStep(2)}>Back</button>
              <button className="r-btn-next" onClick={() => setStep(4)}>Next</button>
            </div>
          </div>
        )}

        {step === 4 && !submitting && (
          <div className="step-content fade-in">
            <h3>Step 4: Pin Location</h3>
            <LocationPicker />
            <p className="r-note">The responsible authority will be determined automatically based on coordinates.</p>
            <div className="r-actions">
              <button className="r-btn-back" onClick={() => setStep(3)}>Back</button>
              <button className="r-btn-submit" onClick={handleSubmit}>SUBMIT REPORT</button>
            </div>
          </div>
        )}

        {submitting && step === 4 && (
          <div className="processing-overlay">
            <h3>Processing Submission...</h3>
            <ul className="proc-list">
              <li className={procStep >= 1 ? 'proc-done' : ''}>Evidence received</li>
              <li className={procStep >= 2 ? 'proc-done' : ''}>Issue identified</li>
              <li className={procStep >= 3 ? 'proc-done' : ''}>Location checked</li>
              <li className={procStep >= 4 ? 'proc-done' : ''}>Duplicate check completed</li>
              <li className={procStep >= 5 ? 'proc-done' : ''}>Jurisdiction determined</li>
            </ul>
          </div>
        )}

        {step === 5 && (
          <div className="step-content result-card fade-in">
            <h2 className="success-title">Issue Reported Successfully</h2>
            <div className="r-id-display">MYS-2026-9482</div>
            <p className="r-type-display">Pothole in Ward 42</p>
            
            <div className="r-cards-grid">
              <VerificationCard />
              <RoutingResult />
            </div>
            
            <div className="r-final-actions">
              <Link to="/track/MYS-2026-9482" className="btn btn-primary">TRACK COMPLAINT</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}`,

  'src/pages/ReportIssue.css': `.report-container { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
.r-header { margin-bottom: 2rem; text-align: center; }
.progress-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-top: 1rem; overflow: hidden; }
.progress-fill { height: 100%; background: var(--accent-gold); transition: width 0.3s; }
.step-content { background: var(--card-bg); border: 1px solid var(--card-border); padding: 2rem; border-radius: 12px; backdrop-filter: blur(12px); }
.fade-in { animation: fadeIn 0.4s; }
.category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 2rem 0; }
.cat-card { background: var(--bg-elevated); border: 2px solid transparent; border-radius: 8px; padding: 1.5rem 1rem; text-align: center; cursor: pointer; transition: 0.2s; }
.cat-card:hover { background: rgba(255,255,255,0.05); }
.cat-card.selected { border-color: var(--accent-gold); background: rgba(240, 192, 64, 0.1); }
.cat-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.r-btn-next, .r-btn-submit { background: var(--accent-gold); color: #000; border: none; padding: 0.75rem 2rem; border-radius: 8px; font-weight: bold; cursor: pointer; float: right; font-size: 1rem; }
.r-btn-next:disabled { background: var(--text-muted); cursor: not-allowed; }
.r-btn-back { background: transparent; color: var(--text-primary); border: 1px solid var(--card-border); padding: 0.75rem 2rem; border-radius: 8px; cursor: pointer; }
.r-actions { display: flex; justify-content: space-between; margin-top: 2rem; }
.r-textarea { width: 100%; height: 150px; background: rgba(0,0,0,0.2); border: 1px solid var(--card-border); color: white; padding: 1rem; border-radius: 8px; font-family: inherit; margin: 1.5rem 0 0.5rem 0; resize: none; }
.r-textarea:focus { outline: none; border-color: var(--accent-gold); }
.r-note { font-size: 0.85rem; color: var(--text-muted); }

.processing-overlay { text-align: center; padding: 3rem; }
.proc-list { list-style: none; text-align: left; max-width: 300px; margin: 2rem auto; }
.proc-list li { margin-bottom: 1rem; color: var(--text-muted); display: flex; align-items: center; }
.proc-list li::before { content: '○'; margin-right: 1rem; font-size: 1.2rem; }
.proc-list li.proc-done { color: var(--status-green); }
.proc-list li.proc-done::before { content: '✓'; }

.success-title { color: var(--status-green); margin-bottom: 1rem; text-align: center; }
.r-id-display { font-size: 2.5rem; font-family: monospace; font-weight: bold; text-align: center; color: var(--accent-gold); margin-bottom: 0.5rem; }
.r-type-display { text-align: center; color: var(--text-secondary); margin-bottom: 2rem; }
.r-cards-grid { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
.r-final-actions { text-align: center; }`,

  'src/pages/TrackComplaint.jsx': `import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import ComplaintTimeline from '../components/ComplaintTimeline';
import VerificationCard from '../components/VerificationCard';
import RoutingResult from '../components/RoutingResult';
import './TrackComplaint.css';

export default function TrackComplaint() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="track-search-container">
        <h2>Track Your Report</h2>
        <div className="search-box">
          <input type="text" id="track-id-input" placeholder="MYS-2026-XXXXX" onKeyDown={(e) => {
            if(e.key==='Enter' && e.target.value) navigate(\`/track/\${e.target.value}\`);
          }} />
          <button onClick={() => {
            const val = document.getElementById('track-id-input').value;
            if(val) navigate(\`/track/\${val}\`);
          }}>TRACK</button>
        </div>
      </div>
    );
  }

  return (
    <div className="track-detail-container">
      <div className="td-header">
        <div className="td-title-row">
          <h1>{id}</h1>
          <StatusBadge status="in_progress" />
        </div>
        <p className="td-subtitle">Pothole • Ward 42</p>
      </div>

      <div className="td-grid">
        <div className="td-main">
          <div className="td-card">
            <h3>Timeline</h3>
            <ComplaintTimeline />
          </div>
          <div className="td-card mt">
            <h3>Report Details</h3>
            <p><strong>Description:</strong> Large pothole on the main road, causing traffic issues.</p>
            <p><strong>Date:</strong> Oct 24, 2026</p>
            <div className="td-evidence-mock">
              <div className="mock-img">📷 Evidence Photo</div>
            </div>
          </div>
        </div>
        <div className="td-sidebar">
          <div className="td-widget"><VerificationCard /></div>
          <div className="td-widget"><RoutingResult /></div>
        </div>
      </div>
    </div>
  );
}`,

  'src/pages/TrackComplaint.css': `.track-search-container { max-width: 500px; margin: 10vh auto; text-align: center; padding: 2rem; background: var(--card-bg); border-radius: 12px; border: 1px solid var(--card-border); }
.search-box { display: flex; margin-top: 2rem; }
.search-box input { flex: 1; padding: 1rem; border-radius: 8px 0 0 8px; border: 1px solid var(--card-border); background: rgba(0,0,0,0.2); color: white; font-size: 1rem; }
.search-box button { padding: 1rem 2rem; border-radius: 0 8px 8px 0; border: none; background: var(--accent-gold); font-weight: bold; cursor: pointer; }

.track-detail-container { max-width: 1000px; margin: 2rem auto; padding: 0 1rem; }
.td-header { margin-bottom: 2rem; }
.td-title-row { display: flex; align-items: center; gap: 1rem; }
.td-title-row h1 { font-family: monospace; font-size: 2.5rem; margin: 0; color: var(--accent-gold); }
.td-subtitle { color: var(--text-secondary); font-size: 1.1rem; margin-top: 0.5rem; }

.td-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
.td-card { background: var(--card-bg); padding: 2rem; border-radius: 12px; border: 1px solid var(--card-border); }
.td-card.mt { margin-top: 2rem; }
.td-card h3 { margin-top: 0; margin-bottom: 1.5rem; border-bottom: 1px solid var(--card-border); padding-bottom: 0.5rem; }
.td-evidence-mock { margin-top: 1.5rem; }
.mock-img { width: 100px; height: 100px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; border-radius: 8px; color: var(--text-muted); font-size: 0.8rem; text-align: center; border: 1px dashed var(--card-border); }
.td-widget { margin-bottom: 1.5rem; }
@media (max-width: 768px) { .td-grid { grid-template-columns: 1fr; } }`,

  'src/pages/Dashboard.jsx': `import React, { useState } from 'react';
import StatsCard from '../components/StatsCard';
import MapView from '../components/MapView';
import IssueCard from '../components/IssueCard';
import './Dashboard.css';

export default function Dashboard() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  // Mock geojson for display
  const mockZones = {
    type: "FeatureCollection",
    features: [
      { type: "Feature", properties: { name: "Ward 42", density: "high" }, geometry: { type: "Polygon", coordinates: [[[76.65, 12.30], [76.66, 12.30], [76.66, 12.31], [76.65, 12.31], [76.65, 12.30]]] } },
      { type: "Feature", properties: { name: "Ward 12", density: "low" }, geometry: { type: "Polygon", coordinates: [[[76.64, 12.31], [76.65, 12.31], [76.65, 12.32], [76.64, 12.32], [76.64, 12.31]]] } }
    ]
  };

  const handleZoneClick = (feature) => {
    setSelectedZone(feature.properties);
    setPanelOpen(true);
  };

  return (
    <div className="dash-container">
      <div className="dash-header">
        <h1>MYSURU CIVIC STATUS</h1>
      </div>

      <div className="dash-stats">
        <StatsCard title="Open Issues" value={2412} />
        <StatsCard title="Under Review" value={180} />
        <StatsCard title="In Progress" value={450} />
        <StatsCard title="Resolved Today" value={145} />
      </div>

      <div className="dash-map-section">
        <MapView mode="display" zones={mockZones} onZoneClick={handleZoneClick} />
        
        <div className={\`side-panel \${panelOpen ? 'open' : ''}\`}>
          {selectedZone && (
            <>
              <button className="close-panel" onClick={() => setPanelOpen(false)}>×</button>
              <h2>{selectedZone.name}</h2>
              <div className="panel-stats">
                <div className="ps-item"><span className="ps-val text-red">42</span><span className="ps-lbl">Open</span></div>
                <div className="ps-item"><span className="ps-val text-green">12</span><span className="ps-lbl">Resolved</span></div>
              </div>
              <div className="insight-box">
                <h4>Why is the backlog high?</h4>
                <p>NLP insight: "Multiple streetlight faults reported this week due to recent storms. Teams are prioritized in Ward 42."</p>
              </div>
              <div className="panel-list">
                <h4>Recent Reports</h4>
                <IssueCard issue={{ id:'MYS-11', type:'Pothole', area:selectedZone.name, status:'open', date:'Today', score:90, priority:'high' }} />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="dash-filters">
        <select><option>All Issue Types</option></select>
        <select><option>All Statuses</option></select>
        <select><option>All Areas</option></select>
      </div>

      <div className="dash-grid">
        <IssueCard />
        <IssueCard issue={{ id: 'MYS-2026-9282', type: 'Garbage Dump', area: 'Ward 12', status: 'resolved', date: '2026-10-23', score: 98 }} />
        <IssueCard issue={{ id: 'MYS-2026-9283', type: 'Streetlight', area: 'Ward 42', status: 'under_review', date: '2026-10-24', score: 65 }} />
        <IssueCard issue={{ id: 'MYS-2026-9284', type: 'Overflowing Bin', area: 'Ward 8', status: 'routed', date: '2026-10-24', score: 88 }} />
      </div>
    </div>
  );
}`,

  'src/pages/Dashboard.css': `.dash-container { max-width: 1400px; margin: 0 auto; padding: 2rem 1rem; }
.dash-header h1 { text-align: center; margin-bottom: 2rem; color: var(--text-primary); letter-spacing: 2px; }
.dash-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.dash-map-section { position: relative; height: 500px; margin-bottom: 2rem; border-radius: 12px; overflow: hidden; display: flex; }
.side-panel { position: absolute; top: 0; right: -400px; width: 350px; height: 100%; background: var(--card-bg); backdrop-filter: blur(20px); border-left: 1px solid var(--card-border); padding: 2rem; transition: right 0.3s ease; z-index: 1000; overflow-y: auto; box-shadow: -5px 0 20px rgba(0,0,0,0.5); }
.side-panel.open { right: 0; }
.close-panel { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
.panel-stats { display: flex; gap: 1rem; margin: 1.5rem 0; }
.ps-item { background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; flex: 1; text-align: center; }
.ps-val { display: block; font-size: 1.5rem; font-weight: bold; }
.ps-lbl { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; }
.text-red { color: var(--status-red); } .text-green { color: var(--status-green); }
.insight-box { background: rgba(255,171,0,0.1); border: 1px solid rgba(255,171,0,0.3); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; }
.insight-box h4 { color: var(--status-amber); margin-top: 0; margin-bottom: 0.5rem; }
.insight-box p { font-size: 0.85rem; color: var(--text-secondary); font-style: italic; margin: 0; }
.dash-filters { display: flex; gap: 1rem; margin-bottom: 2rem; }
.dash-filters select { padding: 0.75rem; background: var(--bg-elevated); border: 1px solid var(--card-border); color: white; border-radius: 8px; outline: none; }
.dash-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }`,

  'src/pages/Admin.jsx': `import React, { useState } from 'react';
import VerificationCard from '../components/VerificationCard';
import './Admin.css';

export default function Admin() {
  const [expandedId, setExpandedId] = useState(null);
  
  const mockRows = [
    { id: 'MYS-2026-101', issue: 'Garbage', area: 'Ward 42', verif: 95, priority: 'High', status: 'routed', date: 'Oct 24' },
    { id: 'MYS-2026-102', issue: 'Pothole', area: 'Ward 12', verif: 80, priority: 'Normal', status: 'verified', date: 'Oct 24' },
    { id: 'MYS-2026-103', issue: 'Streetlight', area: 'Ward 8', verif: 40, priority: 'Normal', status: 'needs_review', date: 'Oct 23' }
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>OFFICIAL DASHBOARD</h1>
      </div>
      
      <div className="admin-stats">
        <div className="a-stat"><h3>12</h3><p>Pending Assignment</p></div>
        <div className="a-stat"><h3>5</h3><p>Needs Verification</p></div>
        <div className="a-stat warning"><h3>8</h3><p>High Priority</p></div>
        <div className="a-stat danger"><h3>3</h3><p>Overdue SLAs</p></div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Issue</th><th>Area</th><th>Verif %</th><th>Priority</th><th>Status</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {mockRows.map(row => (
              <React.Fragment key={row.id}>
                <tr className="main-row" onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}>
                  <td>{row.id}</td><td>{row.issue}</td><td>{row.area}</td>
                  <td><span className={\`verif-badge \${row.verif > 70 ? 'high' : 'low'}\`}>{row.verif}%</span></td>
                  <td>{row.priority}</td>
                  <td><span className={\`st-badge \${row.status}\`}>{row.status}</span></td>
                  <td>{row.date}</td>
                </tr>
                {expandedId === row.id && (
                  <tr className="expanded-row">
                    <td colSpan="7">
                      <div className="exp-content">
                        <div className="exp-left">
                          <VerificationCard />
                        </div>
                        <div className="exp-right">
                          <div className="mini-map-placeholder">Mini Map View</div>
                          <div className="action-buttons">
                            <button className="btn-act primary">Acknowledge</button>
                            <button className="btn-act secondary">Assign Team</button>
                            <button className="btn-act success">Mark Resolved</button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`,

  'src/pages/Admin.css': `.admin-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
.admin-header h1 { color: var(--accent-gold); margin-bottom: 2rem; border-bottom: 1px solid var(--card-border); padding-bottom: 1rem; }
.admin-stats { display: flex; gap: 1rem; margin-bottom: 2rem; }
.a-stat { flex: 1; background: var(--card-bg); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--card-border); text-align: center; }
.a-stat h3 { font-size: 2rem; margin-bottom: 0.5rem; }
.a-stat.warning h3 { color: var(--status-amber); }
.a-stat.danger h3 { color: var(--status-red); }
.admin-table-container { background: var(--card-bg); border-radius: 12px; border: 1px solid var(--card-border); overflow: hidden; }
.admin-table { width: 100%; border-collapse: collapse; text-align: left; }
.admin-table th { padding: 1rem; background: rgba(0,0,0,0.5); font-weight: 600; color: var(--text-secondary); text-transform: uppercase; font-size: 0.8rem; }
.admin-table td { padding: 1rem; border-top: 1px solid var(--card-border); font-size: 0.9rem; }
.main-row { cursor: pointer; transition: background 0.2s; }
.main-row:hover { background: rgba(255,255,255,0.05); }
.verif-badge { padding: 2px 6px; border-radius: 4px; font-weight: bold; }
.verif-badge.high { background: rgba(0,200,83,0.2); color: var(--status-green); }
.verif-badge.low { background: rgba(255,82,82,0.2); color: var(--status-red); }
.st-badge { padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; text-transform: uppercase; }
.st-badge.routed { background: rgba(255,171,0,0.2); color: var(--status-amber); }
.st-badge.verified { background: rgba(68,138,255,0.2); color: var(--status-blue); }
.st-badge.needs_review { background: rgba(255,82,82,0.2); color: var(--status-red); }

.expanded-row { background: rgba(0,0,0,0.3); }
.exp-content { display: flex; gap: 2rem; padding: 1rem; }
.exp-left { flex: 1; }
.exp-right { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
.mini-map-placeholder { height: 150px; background: rgba(255,255,255,0.05); border: 1px dashed var(--card-border); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
.action-buttons { display: flex; gap: 0.5rem; }
.btn-act { flex: 1; padding: 0.75rem; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.btn-act.primary { background: var(--status-blue); color: white; }
.btn-act.secondary { background: var(--status-amber); color: black; }
.btn-act.success { background: var(--status-green); color: black; }
.btn-act:hover { filter: brightness(1.1); }`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filename), content);
}

console.log('All files written successfully.');
