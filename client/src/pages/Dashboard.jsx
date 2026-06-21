import { useEffect, useState } from 'react';
import { getHistory } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getHistory();
        setHistory(res.data || []);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalReal = history.filter(h => h?.verdict === 'REAL').length;
  const totalFake = history.filter(h => h?.verdict === 'FAKE').length;
  const totalUncertain = history.filter(h => h?.verdict === 'UNCERTAIN').length;
  const avgScore = history.length
    ? Math.round(history.reduce((a, b) => a + (b.reliabilityScore || 0), 0) / history.length)
    : 0;

  const filtered = filter === 'ALL' ? history : history.filter(h => h.verdict === filter);

  const getVerdictColor = (verdict) => {
    if (verdict === 'REAL') return '#10b981';
    if (verdict === 'FAKE') return '#ef4444';
    return '#f59e0b';
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const handleShare = (item) => {
    const text = `I analyzed this on VerifyAI:\n"${item.inputText?.substring(0, 100)}..."\nVerdict: ${item.verdict} | Score: ${item.reliabilityScore}%`;
    navigator.clipboard.writeText(text);
    alert('Result copied to clipboard!');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
            </h1>
            <p className="dashboard-sub">Here's a summary of your fact-checking activity.</p>
          </div>
          <Link to="/analyze" className="btn btn-primary">+ New Analysis</Link>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { label: 'Total Analyzed', value: history.length, color: '#3b82f6', icon: '📊' },
            { label: 'Verified Real', value: totalReal, color: '#10b981', icon: '✅' },
            { label: 'Flagged Fake', value: totalFake, color: '#ef4444', icon: '❌' },
            { label: 'Uncertain', value: totalUncertain, color: '#f59e0b', icon: '⚠️' },
            { label: 'Avg. Score', value: `${avgScore}%`, color: '#8b5cf6', icon: '🎯' },
          ].map((s) => (
            <div key={s.label} className="stat-card card">
              <span className="stat-card-icon">{s.icon}</span>
              <span className="stat-card-value" style={{ color: s.color }}>{s.value}</span>
              <span className="stat-card-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="history-section">
          <div className="history-header">
            <h2 className="history-title">Recent Analyses</h2>
            <div className="filter-tabs">
              {['ALL', 'REAL', 'FAKE', 'UNCERTAIN'].map(f => (
                <button
                  key={f}
                  className={`filter-tab ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading your history...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state card">
              <p style={{ fontSize: '48px' }}>🔍</p>
              <h3>No analyses yet</h3>
              <p>Start fact-checking to see your results here.</p>
              <Link to="/analyze" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Analyze Now
              </Link>
            </div>
          ) : (
            <div className="history-list">
              {filtered.map((item) => (
                <div key={item._id} className="history-item card">
                  <div className="history-item-top">
                    <div className="history-verdict" style={{ color: getVerdictColor(item.verdict) }}>
                      {item.verdict === 'REAL' ? '✅' : item.verdict === 'FAKE' ? '❌' : '⚠️'} {item.verdict}
                    </div>
                    <div className="history-score" style={{ color: getScoreColor(item.reliabilityScore) }}>
                      {item.reliabilityScore}%
                    </div>
                  </div>
                  <p className="history-text">"{item.inputText?.substring(0, 120)}..."</p>
                  <div className="history-meta">
                    <span className="history-sentiment">
                      Sentiment: <strong>{item.sentiment}</strong>
                    </span>
                    <span className="history-date">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                    <button
                      className="share-btn"
                      onClick={() => handleShare(item)}
                      title="Copy to clipboard"
                    >
                      📋 Share
                    </button>
                  </div>
                  {item.explanation && (
                    <p className="history-explanation">💡 {item.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}