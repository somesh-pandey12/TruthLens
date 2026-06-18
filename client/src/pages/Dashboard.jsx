import { useEffect, useState } from 'react';
import { getHistory } from '../utils/api';

export default function Dashboard() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory().then(res => setHistory(res.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">📊 My Dashboard</h1>
      {history.length === 0 ? (
        <p className="text-gray-400">No analyses yet. Go analyze some news!</p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item._id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item.verdict === 'REAL' ? 'bg-green-700' :
                  item.verdict === 'FAKE' ? 'bg-red-700' : 'bg-yellow-700'}`}>
                  {item.verdict}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm line-clamp-2">{item.inputText}</p>
              <p className="text-blue-400 text-sm mt-1">Score: {item.reliabilityScore}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}