import React, { useState } from 'react';
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
}
