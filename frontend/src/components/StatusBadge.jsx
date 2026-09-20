import React from 'react';
import './StatusBadge.css';

export default function StatusBadge({ status, text }) {
  const safeStatus = (status || 'submitted').toLowerCase();
  const getStatusClass = () => {
    switch(safeStatus) {
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
    <span className={`status-badge ${getStatusClass()}`}>
      {text || safeStatus.replace('_', ' ').toUpperCase()}
    </span>
  );
}
