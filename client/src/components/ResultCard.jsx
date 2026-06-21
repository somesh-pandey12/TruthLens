import './ResultCard.css';
import ScoreGauge from './ScoreGauge';

export default function ResultCard({ result }) {
  const isReal = result.verdict === 'REAL';
  const isFake = result.verdict === 'FAKE';
  const score = result.reliabilityScore;

  const verdictClass = isReal ? 'verdict-real' : isFake ? 'verdict-fake' : 'verdict-uncertain';
  const verdictLabel = isReal ? '✅ Likely Real' : isFake ? '❌ Likely Fake' : '⚠️ Uncertain';
  const verdictDesc = isReal
    ? 'This content appears credible based on AI analysis.'
    : isFake
    ? 'This content shows signs of misinformation.'
    : 'This content could not be conclusively verified.';
  const scoreColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  const handleShare = () => {
    const text = `VerifyAI Analysis Result:\nVerdict: ${result.verdict}\nReliability Score: ${score}%\nExplanation: ${result.explanation}`;
    navigator.clipboard.writeText(text);
    alert('Result copied to clipboard! 📋');
  };

  return (
    <div className={`result-card animate-in ${verdictClass}`}>

      {/* Header */}
      <div className="result-header">
        <div>
          <p className="result-label">Analysis Complete</p>
          <h2 className="result-title">Content Verification Report</h2>
          <p className="result-verdict-desc">{verdictDesc}</p>
        </div>
        <div className="result-header-right">
          <span className={`verdict-badge ${verdictClass}`}>{verdictLabel}</span>
          <button className="share-result-btn" onClick={handleShare} title="Share result">
            📋 Share
          </button>
        </div>
      </div>

      {/* Score */}
      <div className="score-section">
        <div className="score-top">
          <span className="score-label">Reliability Score</span>
          <span className="score-value" style={{ color: scoreColor }}>{score}%</span>
        </div>
        <div style={{ margin: '15px 0' }}>
          <ScoreGauge score={score} />
        </div>
        <div className="score-track">
          <div className="score-fill" style={{ width: `${score}%`, background: scoreColor }} />
        </div>
        <div className="score-markers">
          <span>Low credibility</span>
          <span>High credibility</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Confidence</span>
          <span className="stat-value">{result.confidence}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Sentiment</span>
          <span className={`stat-value sentiment-${result.sentiment?.toLowerCase()}`}>
            {result.sentiment === 'POSITIVE' ? '😊' : result.sentiment === 'NEGATIVE' ? '😟' : '😐'} {result.sentiment}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Subjectivity</span>
          <span className="stat-value">{result.subjectivity}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Verdict</span>
          <span className={`stat-value ${isReal ? 'text-green' : isFake ? 'text-red' : 'text-yellow'}`}>
            {result.verdict}
          </span>
        </div>
      </div>

      {/* Explanation */}
      {result.explanation && (
        <div className="explanation-box">
          <p className="explanation-label">🤖 AI Explanation</p>
          <p className="explanation-text">{result.explanation}</p>
        </div>
      )}

      {/* Red Flags */}
      {result.redFlags && result.redFlags.length > 0 && (
        <div className="red-flags-box">
          <p className="explanation-label">🚩 Red Flags Detected</p>
          <ul className="red-flags-list">
            {result.redFlags.map((flag, i) => (
              <li key={i} className="red-flag-item">⚠️ {flag}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}