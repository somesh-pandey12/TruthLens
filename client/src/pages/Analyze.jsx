import { useState } from 'react';
import { analyzeText } from '../utils/api';
import ResultCard from '../components/ResultCard';

export default function Analyze() {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!text.trim()) { setError('Please enter some text to analyze.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await analyzeText({ text, url });
      setResult(res.data);
    } catch (err) {
      setError('Analysis failed. Make sure all services are running.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">🔍 Analyze News</h1>
      <p className="text-gray-400 mb-6">Paste a headline or full article to check its credibility.</p>

      <textarea
        className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 h-44 mb-3 
                   text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
        placeholder="Paste news article, headline, or social media post here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 mb-4
                   text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        placeholder="Source URL (optional)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {error && <p className="text-red-400 mb-3 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 
                   py-3 rounded-xl font-semibold text-lg transition">
        {loading ? '⏳ Analyzing with AI...' : '🔍 Analyze Now'}
      </button>

      {result && <ResultCard result={result} />}
    </div>
  );
}