import './ResultCard.css';
import ScoreGauge from './ScoreGauge';

export default function ResultCard({ result }) {
  const isReal = result.verdict === 'REAL';
  const isFake = result.verdict === 'FAKE';
  const score = result.reliabilityScore;

  const verdictClass = isReal ? 'verdict-real' : isFake ? 'verdict-fake' : 'verdict-uncertain';
  const verdictLabel = isReal ? '✓ Likely Real' : isFake ? '✗ Likely Fake' : '~ Uncertain';
  const scoreColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className={`result-card animate-in ${verdictClass}`}>
      <div className="result-header">
        <div>
          <p className="result-label">Analysis Complete</p>
          <h2 className="result-title">Content Verification Report</h2>
        </div>
        <span className={`verdict-badge ${verdictClass}`}>{verdictLabel}</span>
      </div>

      {}
      <div className="score-section">
        <div className="score-top">
          <span className="score-label">Reliability Score</span>
          <span className="score-value" style={{ color: scoreColor }}>{score}%</span>
        </div>
        
        {}
        <div style={{ margin: '15px 0' }}>
            <ScoreGauge score={score} />
        </div>

        <div className="score-track">
          <div
            className="score-fill"
            style={{ width: `${score}%`, background: scoreColor }}
          />
        </div>
        <div className="score-markers">
          <span>Low credibility</span>
          <span>High credibility</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Confidence</span>
          <span className="stat-value">{result.confidence}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Sentiment</span>
          <span className={`stat-value sentiment-${result.sentiment?.toLowerCase()}`}>{result.sentiment}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Subjectivity</span>
          <span className="stat-value">{result.subjectivity}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Verdict</span>
          <span className={`stat-value ${isReal ? 'text-green' : 'text-red'}`}>{result.verdict}</span>
        </div>
      </div>

      {/* Explanation */}
      {result.explanation && (
        <div className="explanation-box">
          <p className="explanation-label">📋 AI Explanation</p>
          <p className="explanation-text">{result.explanation}</p>
        </div>
      )}
    </div>
  );
}