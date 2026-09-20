import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import './IssueCard.css';

export default function IssueCard({ issue }) {
  const navigate = useNavigate();
  const d = issue || {
    id: 'MYS-2026-9281',
    issue_type: 'Pothole',
    area: 'Ward 42',
    status: 'open',
    date: '2026-10-24',
    priority: 'high',
    verification_score: 92
  };

  const type = d.issue_type || d.type || 'General Issue';
  const area = d.area || d.authority_name || 'Mysuru Zone';
  const dateStr = d.created_at ? new Date(d.created_at).toLocaleDateString() : (d.date || 'Today');
  
  let score = 85;
  if (d.verification_score !== undefined && d.verification_score !== null) {
    score = d.verification_score <= 1 ? Math.round(d.verification_score * 100) : Math.round(d.verification_score);
  } else if (d.score !== undefined) {
    score = d.score;
  }

  const isHighPriority = d.priority === 'high' || (typeof d.priority === 'number' && (d.priority > 70 || d.priority > 0.7));

  const getIcon = (t) => {
    const safeType = (t || '').toLowerCase();
    if (safeType.includes('garbage') || safeType.includes('waste')) return '🗑️';
    if (safeType.includes('pothole') || safeType.includes('road')) return '🕳️';
    if (safeType.includes('light') || safeType.includes('electric')) return '💡';
    if (safeType.includes('water') || safeType.includes('pipe')) return '💧';
    return '📋';
  };

  return (
    <div className="issue-card" onClick={() => navigate(`/track/${d.id}`)}>
      <div className="ic-header">
        <span className="ic-id">{d.id}</span>
        {isHighPriority && <span className="ic-priority">HIGH PRIORITY</span>}
      </div>
      <div className="ic-body">
        <div className="ic-icon">{getIcon(type)}</div>
        <div className="ic-details">
          <h4>{type}</h4>
          <p>{area} • {dateStr}</p>
        </div>
      </div>
      <div className="ic-footer">
        <StatusBadge status={d.status} />
        <div className="ic-score">Verif Score: {score}%</div>
      </div>
    </div>
  );
}
