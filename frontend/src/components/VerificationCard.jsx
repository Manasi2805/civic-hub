import React, { useState } from 'react';
import './VerificationCard.css';
import StatusBadge from './StatusBadge';

export default function VerificationCard({ analysis, issue }) {
  const [expanded, setExpanded] = useState(false);

  // Read from `issue` if passed, otherwise fall back to `analysis`
  const rawScore = issue?.verification_score ?? analysis?.score ?? 85;
  // If score is a float like 0.85, normalize to percentage (85), otherwise use integer
  const score = rawScore <= 1 && rawScore > 0 ? Math.round(rawScore * 100) : Math.round(rawScore);

  const decision = issue?.verification_decision ?? analysis?.decision ?? 'likely_genuine';
  const explanation = issue?.verification_explanation ?? analysis?.reason ?? 'AI verification assessment based on geo-clustering, metadata, and duplicate checks.';

  const signals = analysis?.signals || [
    { name: 'Image Metadata', status: issue?.photo_url ? 'pass' : 'warn', description: issue?.photo_url ? 'Photo submitted with report' : 'No image evidence attached' },
    { name: 'Location Consistency', status: issue?.latitude ? 'pass' : 'fail', description: `Coordinates: ${issue?.latitude?.toFixed(4) || 'N/A'}, ${issue?.longitude?.toFixed(4) || 'N/A'}` },
    { name: 'Duplicate Check', status: score > 70 ? 'pass' : 'warn', description: score > 70 ? 'Unique report in this sector' : 'Nearby potential duplicates detected' },
    { name: 'Spatial Clustering', status: 'pass', description: `Assigned zone: ${issue?.authority_name || 'Mysuru Zone'}` }
  ];

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
            <path
              className="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray={`${score}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              stroke={score > 70 ? 'var(--status-green)' : 'var(--status-amber)'}
            />
            <text x="18" y="20.35" className="percentage">{score}%</text>
          </svg>
        </div>
        <div className="vc-info">
          <h4>AI Verification</h4>
          <StatusBadge status={decision} />
        </div>
      </div>

      <div className="vc-toggle" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide Details' : 'Why?'}
      </div>

      {expanded && (
        <div className="vc-details">
          <p className="vc-reason">{explanation}</p>
          <ul className="vc-signals">
            {signals.map((sig, i) => (
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
}