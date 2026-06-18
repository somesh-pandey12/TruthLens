import { useState } from 'react';
import { analyzeText } from '../utils/api';
import ResultCard from '../components/ResultCard';
import './Analyze.css';

const examples = [
  "Scientists discover that drinking coffee every morning extends life by 20 years, according to a new Harvard study.",
  "The government announced new tax relief measures for small businesses effective from next month.",
  "BREAKING: Aliens have landed in Times Square and world leaders are meeting secretly.",
];

export default function Analyze() {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e) => {
    setText(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async () => {
    if (!text.trim()) { setError('Please enter some text to analyze.'); return; }
    if (text.trim().length < 20) { setError('Please enter at least 20 characters for accurate analysis.'); return; }
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await analyzeText({ text, url });
      setResult(res.data);
    } catch (err) {
      setError('Analysis failed. Make sure all services are running on ports 5000 and 8000.');
    }
    setLoading(false);
  };

  const loadExample = (ex) => {
    setText(ex);
    setCharCount(ex.length);
    setResult(null);
    setError('');
  };

  return (
    <div className="analyze-page">
      <div className="analyze-inner">
        <div className="analyze-header">
          <h1 className="analyze-title">Analyze Content</h1>
          <p className="analyze-sub">Paste any news article, headline, or social media post to check its credibility.</p>
        </div>

        <div className="analyze-layout">
          {/* Input Panel */}
          <div className="input-panel card">
            <div className="panel-header">
              <span className="panel-title">Content to Analyze</span>
              <span className="char-count">{charCount} chars</span>
            </div>

            <textarea
              className="input analyze-textarea"
              placeholder="Paste news article, headline, or social media post here..."
              value={text}
              onChange={handleTextChange}
            />

            <div className="input-group" style={{marginTop: '12px', marginBottom: 0}}>
              <label className="input-label">Source URL (optional)</label>
              <input
                className="input"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button
              className="btn btn-primary btn-full"
              style={{marginTop: '16px', padding: '14px'}}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Analyze Now
                </>
              )}
            </button>
          </div>

          {/* Sidebar */}
          <div className="analyze-sidebar">
            <div className="card">
              <p className="panel-title" style={{marginBottom:'12px'}}>Try an example</p>
              <div className="examples-list">
                {examples.map((ex, i) => (
                  <button key={i} className="example-btn" onClick={() => loadExample(ex)}>
                    <span className="example-num">{i + 1}</span>
                    <span className="example-text">{ex.substring(0, 75)}…</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="card tips-card">
              <p className="panel-title" style={{marginBottom:'12px'}}>For best results</p>
              <ul className="tips-list">
                <li>Use full articles (100+ words) for higher accuracy</li>
                <li>Include the original source URL when possible</li>
                <li>Works with English language content only</li>
                <li>Longer text = more accurate verdict</li>
              </ul>
            </div>
          </div>
        </div>

        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}