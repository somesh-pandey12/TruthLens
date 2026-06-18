const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inputText: { type: String, required: true },
  reliabilityScore: { type: Number },
  verdict: { type: String },  // REAL / FAKE / UNCERTAIN
  sentiment: { type: String },
  explanation: { type: String },
  sourceUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);