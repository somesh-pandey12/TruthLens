const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Analysis = require('../models/Analysis');
const auth = require('../middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

async function callGemini(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await model.generateContent(prompt);
      return res.response.text().trim();
    } catch (err) {
      if (err.message?.includes('429') && i < retries - 1) {
        await new Promise(r => setTimeout(r, (i + 1) * 3000));
      } else if (err.message?.includes('429')) {
        throw new Error('QUOTA_EXCEEDED');
      } else {
        throw err;
      }
    }
  }
}

router.post('/analyze', async (req, res) => {
  try {
    const { text, url } = req.body;
    if (!text || text.trim().length < 10)
      return res.status(400).json({ message: 'Text is too short to analyze' });

    const prompt = `You are a fake news detection expert. Analyze this news content.
Content: ${text.trim().slice(0, 1000)}
URL: ${url || 'Not provided'}
Respond ONLY with valid JSON, no markdown:
{"verdict":"REAL or FAKE or UNCERTAIN","reliabilityScore":0-100,"confidence":0-100,"sentiment":"POSITIVE or NEGATIVE or NEUTRAL","subjectivity":0-100,"explanation":"one sentence"}`;

    let raw;
    try {
      raw = await callGemini(prompt);
      raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    } catch (err) {
      if (err.message === 'QUOTA_EXCEEDED')
        return res.status(429).json({ message: 'Quota exceeded. Try again in a minute.' });
      throw err;
    }

    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      return res.status(500).json({ message: 'AI returned invalid response. Try again.' });
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
    return res.status(500).json({ message: 'Analysis failed', error: err.message });
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