import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import StatusBadge from '../components/StatusBadge';
import ComplaintTimeline from '../components/ComplaintTimeline';
import VerificationCard from '../components/VerificationCard';
import RoutingResult from '../components/RoutingResult';

export default function TrackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    fetch(`http://localhost:8000/api/complaints/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Complaint ${id} not found (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setIssue(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // If visiting /track without an ID, show a lookup search bar
  if (!id) {
    return (
      <div className="track-detail-container" style={{ padding: '3rem', textAlign: 'center', color: '#fff' }}>
        <h2>Track Your Complaint</h2>
        <p style={{ color: '#888', marginBottom: '1.5rem' }}>Enter your Complaint Reference Number (e.g., MYS-2026-00001)</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchInput.trim()) navigate(`/track/${searchInput.trim()}`);
          }}
          style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
        >
          <input
            type="text"
            placeholder="MYS-2026-00001"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              padding: '10px 16px',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1px solid #333',
              background: '#1a1a24',
              color: '#fff',
              width: '280px'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              background: '#f59e0b',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Track
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="track-detail-container" style={{ padding: '2rem', color: '#fff' }}>
        <h2>Loading complaint {id}...</h2>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="track-detail-container" style={{ padding: '2rem', color: '#ff6b6b' }}>
        <h2>Failed to load details</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="track-detail-container">
      {/* Existing issue layout */}
      <div className="td-header">
        <div className="td-title-row">
          <h1>{issue.id}</h1>
          <StatusBadge status={issue.status || 'submitted'} />
        </div>
        <p className="td-subtitle">
          {issue.issue_type ? issue.issue_type.toUpperCase() : 'CIVIC ISSUE'} • {issue.authority_name || 'Mysuru'}
        </p>
      </div>

      <div className="td-grid">
        <div className="td-main">
          <div className="td-card">
            <h3>Timeline</h3>
            <ComplaintTimeline issue={issue} complaintId={issue.id} />
          </div>
          <div className="td-card mt">
            <h3>Report Details</h3>
            <p><strong>Description:</strong> {issue.description || 'No description provided.'}</p>
            <p><strong>Reporter:</strong> {issue.reporter_name || 'Anonymous'}</p>
            <p><strong>Coordinates:</strong> {issue.latitude}, {issue.longitude}</p>
            <div className="td-evidence-mock">
              {issue.photo_url ? (
                <img
                  src={issue.photo_url.startsWith('http') ? issue.photo_url : `http://localhost:8000${issue.photo_url}`}
                  alt="Evidence"
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
                />
              ) : (
                <div className="mock-img">📷 No photo uploaded</div>
              )}
            </div>
          </div>
        </div>

        <div className="td-sidebar">
          <div className="td-widget">
            <VerificationCard
              score={issue.verification_score}
              decision={issue.verification_decision}
              issue={issue}
            />
          </div>
          <div className="td-widget">
            <RoutingResult
              authority={issue.authority_name}
              explanation={issue.routing_explanation}
              issue={issue}
            />
          </div>
        </div>
      </div>
    </div>
  );
}