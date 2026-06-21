const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const Analysis = require('../models/Analysis');
const auth = require('../middleware/authMiddleware');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

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
        { timeout: 60000 }
      );
      result = mlRes.data;
    } catch (mlErr) {
      console.error('ML Service Error:', mlErr.message);
      if (mlErr.code === 'ECONNREFUSED')
        return res.status(503).json({ message: 'ML service not running. Start Python service.' });
      if (mlErr.response?.status === 429)
        return res.status(429).json({ message: 'Gemini quota exceeded. Try again in a minute.' });
      return res.status(500).json({ message: 'ML service error', error: mlErr.message });
    }

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
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
    console.error('Analyze error:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user.id })
      .sort({ createdAt: -1 }).limit(20).select('-__v');
    return res.json(history);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;