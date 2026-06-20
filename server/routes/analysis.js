const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Analysis = require('../models/Analysis');
const auth = require('../middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Retry logic for 429 rate limit
async function callGeminiWithRetry(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const geminiRes = await model.generateContent(prompt);
      return geminiRes.response.text().trim();
    } catch (err) {
      const is429 = err.message?.includes('429');
      if (is429 && i < retries - 1) {
        const wait = (i + 1) * 3000;
        console.log(`Rate limited. Retrying in ${wait/1000}s... (attempt ${i+1}/${retries})`);
        await new Promise(r => setTimeout(r, wait));
      } else if (is429) {
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

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ message: 'Text is too short to analyze' });
    }

    const prompt = `
    You are a fake news detection expert. Analyze this news content for credibility.

    Content: ${text.trim().slice(0, 1000)}
    URL: ${url || 'Not provided'}

    Respond ONLY with valid JSON, no markdown, no extra text:
    {
      "verdict": "REAL" or "FAKE" or "UNCERTAIN",
      "reliabilityScore": <number 0-100>,
      "confidence": <number 0-100>,
      "sentiment": "POSITIVE" or "NEGATIVE" or "NEUTRAL",
      "subjectivity": <number 0-100>,
      "explanation": "<one sentence explaining the verdict>"
    }
    `;

    let raw;
    try {
      raw = await callGeminiWithRetry(prompt);
      raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    } catch (err) {
      if (err.message === 'QUOTA_EXCEEDED') {
        return res.status(429).json({
          message: 'API quota exceeded. Please try again after a minute.'
        });
      }
      throw err;
    }

    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      return res.status(500).json({ message: 'AI returned invalid response. Try again.' });
    }

    // Save to DB if user is logged in
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
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
    console.error('Analyze error:', err.message);
    return res.status(500).json({ message: 'Analysis failed', error: err.message });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-__v');
    return res.json(history);
  } catch (err) {
    console.error('History error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;