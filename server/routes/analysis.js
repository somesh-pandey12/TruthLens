const express = require('express');
const router = express.Router();
const axios = require('axios');
const Analysis = require('../models/Analysis');
const auth = require('../middleware/authMiddleware');

router.post('/analyze', async (req, res) => {
  try {
    const { text, url } = req.body;
    const mlRes = await axios.post(`${process.env.ML_SERVICE_URL}/analyze`, { text, url });
    const result = mlRes.data;

    // Save if user is logged in
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const jwt = require('jsonwebtoken');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await Analysis.create({
          user: decoded.id, inputText: text, sourceUrl: url,
          reliabilityScore: result.reliabilityScore,
          verdict: result.verdict, sentiment: result.sentiment,
          explanation: result.explanation
        });
      } catch {}
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'ML service error', error: err.message });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;