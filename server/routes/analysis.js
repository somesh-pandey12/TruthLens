const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const Analysis = require('../models/Analysis');
const auth = require('../middleware/authMiddleware');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'https://truthlens-1-qnnw.onrender.com'; // ✅ updated URL

// POST /api/analysis/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { text, url } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ message: 'Text is too short to analyze' });
    }

    let result;
    try {
      const mlRes = await axios.post(
        `${ML_SERVICE_URL}/analyze`,
        { text: text.trim(), url: url || '' },
        { timeout: 60000 } // ✅ increased to 60s — free tier can take 50s to wake up
      );
      result = mlRes.data;
    } catch (mlErr) {
      console.error('ML Service Error:', mlErr.message);

      if (mlErr.code === 'ECONNREFUSED' || mlErr.code === 'ENOTFOUND') {
        return res.status(503).json({ message: 'ML service is unavailable. Please try again later.' });
      }
      if (mlErr.code === 'ECONNABORTED') {
        return res.status(504).json({ message: 'ML service timed out. Render is waking up — please try again in 30 seconds.' });
      }

      return res.status(500).json({ message: 'ML service error', error: mlErr.message });
    }

    // Save to DB if user is logged in
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await Analysis.create({
          user: decoded.id,
          inputText: text.trim(),
          sourceUrl: url || '',
          reliabilityScore: result.reliabilityScore ?? null,
          verdict: result.verdict ?? 'UNCERTAIN',
          sentiment: result.sentiment ?? 'NEUTRAL',
          explanation: result.explanation ?? '',
          confidence: result.confidence ?? null,
          subjectivity: result.subjectivity ?? null,
        });
      } catch (dbErr) {
        console.warn('DB save skipped:', dbErr.message);
      }
    }

    return res.json(result);

  } catch (err) {
    console.error('Analyze route error:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/analysis/history
router.get('/history', auth, async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-__v');

    return res.json(history);
  } catch (err) {
    console.error('History route error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;