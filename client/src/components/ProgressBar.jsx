import React from 'react';

export function ProgressBar({ current, total, label }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="progress">
      {label && <span className="progress__label">{label}</span>}
      <div className="progress__bar-bg">
        <div className="progress__bar" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress__count">{current} / {total}</span>
    </div>
  );
}
