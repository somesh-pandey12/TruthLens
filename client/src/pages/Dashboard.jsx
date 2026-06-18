import { useEffect, useState } from 'react';
import { getHistory } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getHistory()
      .then(res => setHistory(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalReal = history.filter(h => h.verdict === 'REAL').length;
  const totalFake = history.filter(h => h.verdict === 'FAKE').length;
  const avgScore = history.length
    ? Math.round(history.reduce((a, b) => a + b.reliabilityScore, 0) / history.length)
    : 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="dashboard-sub">Here's a summary of your fact-checking activity.</p>
          </div>
          <Link to="/analyze" className="btn btn-primary">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Analysis
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { label: 'Total Analyzed', value: history.length, color: '#3b82f6' },
            { label: 'Verified Real', value: totalReal, color: '#10b981' },
            { label: 'Flagged Fake', value: totalFake, color: '#ef4444' },
            { label: 'Avg. Score', value: `${avgScore}%`, color: '#f59e0b' },
          ].map((s) => (
            <div key={s.label} className="stat-card card">
              <span className="stat-card-label">{s.label}</span>
              <span className="stat-card-value" style={{ color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* History */}
        <div className="history-section">
          <h2 className="history-title">Recent Analyses</h2>

          {loading ? (
            <div className="loading-state">
              <span className="spinner" style={{borderColor:'var(--border-hover)',borderTopColor:'var(--blue)'}} />
              <span>Loading your history…</span>
            </div>
          ) : history.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-icon">🔍</div>
              <h3>No analyses yet</h3>
              <p>Start fact-checking news articles and your history will appear here.</p>
              <Link to="/analyze" className="btn btn-primary" style={{marginTop:'16px'}}>Analyze your first article</Link>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => {
                const isReal = item.verdict === 'REAL';
                const isFake = item.verdict === 'FAKE';
                return (
                  <div key={item._id} className="history-item card">
                    <div className="history-item-left">
                      <div className={`history-dot ${isReal ? 'dot-green' : isFake ? 'dot-red' : 'dot-yellow'}`} />
                      <div>
                        <p className="history-text">{item.inputText?.substring(0, 120)}…</p>
                        <div className="history-meta">
                          <span className={`badge ${isReal ? 'badge-green' : isFake ? 'badge-red' : 'badge-yellow'}`}>
                            {item.verdict}
                          </span>
                          <span className="history-score">Score: {item.reliabilityScore}%</span>
                          {item.sentiment && <span className="history-sentiment">{item.sentiment}</span>}
                          <span className="history-date">{new Date(item.createdAt).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'})}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}