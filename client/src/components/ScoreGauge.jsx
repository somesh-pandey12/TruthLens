import React from 'react';

export default function ScoreGauge({ score }) {
  // Score 0 se 100 ke beech hona chahiye
  const percentage = Math.min(Math.max(score, 0), 100);
  
  const getLabel = (s) => (s > 50 ? "Mostly Real" : "Likely Fake");
  const getColor = (s) => (s > 50 ? "#4caf50" : "#f44336");

  return (
    <div className="score-gauge">
      <div style={{ 
        width: '100%', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${percentage}%`, 
          backgroundColor: getColor(percentage), 
          height: '20px',
          transition: 'width 0.5s ease-in-out'
        }} />
      </div>
      <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
        {getLabel(percentage)} ({percentage}%)
      </p>
    </div>
  );
}