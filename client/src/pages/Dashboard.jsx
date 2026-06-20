import { useEffect, useState } from 'react';
import { getHistory } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
//import HistoryTable from '../components/HistoryTable';
import './Dashboard.css';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getHistory();
        setHistory(res.data || []);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalReal = history.filter(h => h?.verdict === 'REAL').length;
  const totalFake = history.filter(h => h?.verdict === 'FAKE').length;
  const avgScore = history.length
    ? Math.round(history.reduce((a, b) => a + (b.reliabilityScore || 0), 0) / history.length)
    : 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
            <p className="dashboard-sub">Here's a summary of your fact-checking activity.</p>
          </div>
          <Link to="/analyze" className="btn btn-primary">New Analysis</Link>
        </div>

        {/* Stats Section */}
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

        <div className="history-section">
          <h2 className="history-title">Recent Analyses</h2>

          {loading ? (
            <div className="loading-state">Loading your history...</div>
          ) : history.length === 0 ? (
            <div className="empty-state card">
              <h3>No analyses yet</h3>
              <p>Start fact-checking to see your results here.</p>
            </div>
          ) : (
            <div className="history-list">
              {}
              {history.map((item) => (
                <div key={item._id} className="history-item card">
                  <p>{item.inputText?.substring(0, 100)}...</p>
                  <span>Verdict: <strong>{item.verdict}</strong></span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}