import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[88vh] text-center px-4">
      <h1 className="text-5xl font-extrabold mb-4 text-white">
        Fight Misinformation with <span className="text-blue-400">TruthLens</span>
      </h1>
      <p className="text-gray-400 text-lg max-w-2xl mb-8">
        AI-powered fake news detection using NLP and transformer models.
        Paste any article or headline and get an instant credibility analysis.
      </p>
      <div className="flex gap-4">
        <Link to="/analyze"
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold text-lg transition">
          🔍 Analyze News
        </Link>
        <Link to="/register"
          className="border border-gray-600 hover:border-blue-400 px-8 py-3 rounded-xl font-semibold text-lg transition">
          Get Started
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-3 gap-6 mt-16 max-w-4xl">
        {[
          { icon: '🤖', title: 'AI-Powered', desc: 'RoBERTa transformer model for accurate classification' },
          { icon: '📊', title: 'Reliability Score', desc: 'Get a 0–100 credibility score for every article' },
          { icon: '📝', title: 'Detailed Insights', desc: 'Sentiment, subjectivity, and linguistic analysis' },
        ].map((f) => (
          <div key={f.title} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-left">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}