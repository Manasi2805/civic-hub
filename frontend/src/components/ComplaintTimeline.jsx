import React from 'react';
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
          <div key={idx} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
            <div className="timeline-marker">
              <div className="dot"></div>
              {idx < events.length - 1 && <div className="line"></div>}
            </div>
            <div className="timeline-content" style={{ animationDelay: `${idx * 0.15}s` }}>
              <h4>{event.status}</h4>
              <p>{event.message}</p>
              {isCompleted && <span className="time">{event.timestamp}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
