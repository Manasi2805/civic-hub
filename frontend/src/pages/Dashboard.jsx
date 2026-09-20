import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import MapView from '../components/MapView';
import IssueCard from '../components/IssueCard';
import { getDashboardSummary, getBoundaries, getDashboardIssues, getAllAreas } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ open: 0, open_issues: 0, under_review: 0, under_verification: 0, in_progress: 0, resolved_today: 0 });
  const [zones, setZones] = useState({ type: "FeatureCollection", features: [] });
  const [issues, setIssues] = useState([]);
  const [areas, setAreas] = useState([]);
  
  const [filters, setFilters] = useState({ issue_type: '', status: '', area: '' });
  const [areaInsight, setAreaInsight] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [sumRes, bndRes, issRes, areaRes] = await Promise.all([
        getDashboardSummary(),
        getBoundaries(),
        getDashboardIssues(filters),
        getAllAreas()
      ]);
      if (sumRes.data) setSummary(sumRes.data);
      if (bndRes.data) setZones(bndRes.data);
      if (issRes.data) setIssues(issRes.data);
      if (areaRes.data) setAreas(areaRes.data);
      setLoading(false);
    };
    fetchData();
  }, [filters]);

  const handleZoneClick = (feature) => {
    const props = feature.properties || {};
    setSelectedZone(props);
    setPanelOpen(true);
    
    const zoneName = props.name || props.WARD_NAME || props.zone_name || 'Zone';
    const matched = areas.find(a => {
      const areaName = a.area || a.name || '';
      return areaName.toLowerCase() === zoneName.toLowerCase() || zoneName.toLowerCase().includes(areaName.toLowerCase());
    });

    if (matched) {
      setAreaInsight(matched);
    } else {
      setAreaInsight({
        open: 0,
        resolved: 0,
        insight: `Active civic monitoring in place for ${zoneName}.`
      });
    }
  };

  const getSelectedZoneName = () => {
    if (!selectedZone) return '';
    return selectedZone.name || selectedZone.WARD_NAME || selectedZone.zone_name || 'Selected Zone';
  };

  return (
    <div className="dash-container">
      <div className="dash-header">
        <h1>MYSURU CIVIC STATUS</h1>
      </div>

      <div className="dash-stats">
        <StatsCard title="Open Issues" value={summary.open !== undefined ? summary.open : (summary.open_issues || 0)} />
        <StatsCard title="Under Review" value={summary.under_review !== undefined ? summary.under_review : (summary.under_verification || 0)} />
        <StatsCard title="In Progress" value={summary.in_progress || 0} />
        <StatsCard title="Resolved Today" value={summary.resolved_today || 0} />
      </div>

      <div className="dash-map-section">
        <MapView mode="display" zones={zones} complaints={issues} onZoneClick={handleZoneClick} />
        
        <div className={`side-panel ${panelOpen ? 'open' : ''}`}>
          {selectedZone && (
            <>
              <button className="close-panel" onClick={() => setPanelOpen(false)}>×</button>
              <h2>{getSelectedZoneName()}</h2>
              {areaInsight ? (
                <>
                  <div className="panel-stats">
                    <div className="ps-item"><span className="ps-val text-red">{areaInsight.open !== undefined ? areaInsight.open : areaInsight.open_issues || 0}</span><span className="ps-lbl">Open</span></div>
                    <div className="ps-item"><span className="ps-val text-green">{areaInsight.resolved !== undefined ? areaInsight.resolved : areaInsight.resolved_issues || 0}</span><span className="ps-lbl">Resolved</span></div>
                  </div>
                  {(areaInsight.insight || areaInsight.nlp_insight) && (
                    <div className="insight-box">
                      <h4>Area Insights</h4>
                      <p>{areaInsight.insight || areaInsight.nlp_insight}</p>
                    </div>
                  )}
                </>
              ) : (
                <p style={{padding: '1rem'}}>Loading area insights...</p>
              )}
              <div className="panel-list">
                <h4>Recent Reports in {getSelectedZoneName()}</h4>
                {issues.filter(i => {
                  const iArea = i.area || i.authority_name || '';
                  const zName = getSelectedZoneName();
                  return iArea.toLowerCase().includes(zName.toLowerCase()) || zName.toLowerCase().includes(iArea.toLowerCase());
                }).slice(0, 3).map(iss => (
                  <IssueCard key={iss.id} issue={iss} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="dash-filters">
        <select value={filters.issue_type} onChange={e => setFilters({...filters, issue_type: e.target.value})}>
          <option value="">All Issue Types</option>
          <option value="garbage">Garbage</option>
          <option value="pothole">Pothole</option>
          <option value="light">Streetlight</option>
        </select>
        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select value={filters.area} onChange={e => setFilters({...filters, area: e.target.value})}>
          <option value="">All Areas</option>
          {areas.map((a, idx) => {
            const val = a.area || a.name || `Area ${idx}`;
            return <option key={idx} value={val}>{val}</option>;
          })}
        </select>
      </div>

      {loading ? (
        <div style={{padding: '2rem', textAlign: 'center'}}>Loading issues...</div>
      ) : (
        <div className="dash-grid">
          {issues.length > 0 ? issues.map(iss => <IssueCard key={iss.id} issue={iss} />) : <div style={{gridColumn: '1/-1', textAlign: 'center'}}>No issues found.</div>}
        </div>
      )}
    </div>
  );
}

