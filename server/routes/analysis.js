const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Analysis = require('../models/Analysis');
const auth = require('../middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // ✅ fixed

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

    const geminiRes = await model.generateContent(prompt);
    const raw = geminiRes.response.text().trim()
      .replace(/```json/g, '').replace(/```/g, '').trim();

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