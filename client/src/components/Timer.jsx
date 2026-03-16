import React from 'react';

export function Timer({ timeLeft, pct, warning }) {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className={`timer ${warning ? 'timer--warning' : ''}`}>
      <div className="timer__display">{mins}:{secs}</div>
      <div className="timer__bar-bg">
        <div
          className="timer__bar"
          style={{ width: `${pct}%`, backgroundColor: warning ? '#e74c3c' : '#2ecc71' }}
        />
      </div>
    </div>
  );
}
