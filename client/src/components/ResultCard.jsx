export default function ResultCard({ result }) {
  const isReal = result.verdict === 'REAL';
  const isFake = result.verdict === 'FAKE';

  const scoreColor = result.reliabilityScore >= 70
    ? 'text-green-400' : result.reliabilityScore >= 40
    ? 'text-yellow-400' : 'text-red-400';

  const bgColor = isReal ? 'border-green-500' : isFake ? 'border-red-500' : 'border-yellow-500';
  const badge = isReal ? 'bg-green-600' : isFake ? 'bg-red-600' : 'bg-yellow-600';

  return (
    <div className={`mt-8 p-6 bg-gray-900 border-2 ${bgColor} rounded-2xl`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Analysis Result</h2>
        <span className={`${badge} px-4 py-1 rounded-full text-sm font-semibold`}>
          {result.verdict}
        </span>
      </div>

      {/* Score Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-gray-400 text-sm">Reliability Score</span>
          <span className={`font-bold text-xl ${scoreColor}`}>{result.reliabilityScore}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-700 ${
              result.reliabilityScore >= 70 ? 'bg-green-500' :
              result.reliabilityScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${result.reliabilityScore}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-xs mb-1">Confidence</p>
          <p className="text-white font-semibold text-lg">{result.confidence}%</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-xs mb-1">Sentiment</p>
          <p className="text-white font-semibold text-lg">{result.sentiment}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-xs mb-1">Subjectivity</p>
          <p className="text-white font-semibold text-lg">{result.subjectivity}%</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-xs mb-1">Verdict</p>
          <p className={`font-semibold text-lg ${isReal ? 'text-green-400' : 'text-red-400'}`}>
            {result.verdict}
          </p>
        </div>
      </div>

      {/* Explanation */}
      {result.explanation && (
        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="text-gray-400 text-xs mb-1">📝 Explanation</p>
          <p className="text-gray-200 text-sm">{result.explanation}</p>
        </div>
      )}
    </div>
  );
}