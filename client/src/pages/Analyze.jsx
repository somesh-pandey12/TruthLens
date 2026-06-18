import { useState } from 'react';
import { analyzeText } from '../utils/api';
import ResultCard from '../components/ResultCard';

export default function Analyze() {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await analyzeText({ text, url });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🔍 Analyze News</h1>
      <textarea
        className="w-full border rounded p-3 h-40 mb-3"
        placeholder="Paste news article or headline here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        className="w-full border rounded p-3 mb-3"
        placeholder="Source URL (optional)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {result && <ResultCard result={result} />}
    </div>
  );
}