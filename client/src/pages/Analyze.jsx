import { useState } from 'react';
import axios from 'axios';
import ResultCard from '../components/ResultCard';
import './Analyze.css';

const API_BASE_URL = 'https://truthlens-iu5p.onrender.com';

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
    // Basic validation
    if (!text.trim()) { setError('Please enter some text to analyze.'); return; }
    if (text.trim().length < 20) { setError('Please enter at least 20 characters.'); return; }
    
    setError('');
    setResult(null);
    setLoading(true);

    try {
     
      const res = await axios.post(`${API_BASE_URL}/api/analyze`, { 
        text: text, 
        url: url 
      });
      
      setResult(res.data);
    } catch (err) {
      console.error("API Error:", err);
      setError('Analysis failed. Check if backend is running or try again.');
    } finally {
    
      setLoading(false);
    }
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

            {error && <p className="error-text" style={{color: 'red', marginTop: '10px'}}>{error}</p>}

            <button
              className="btn btn-primary btn-full"
              style={{marginTop: '16px', padding: '14px', cursor: loading ? 'not-allowed' : 'pointer'}}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Analyzing with AI..." : "Analyze Now"}
            </button>
          </div>

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
          </div>
        </div>

        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}