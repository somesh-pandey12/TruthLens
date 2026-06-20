const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper — generate token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Helper — send user response
const sendUserResponse = (res, token, user, extra = {}) =>
  res.json({
    token,
    name: user.name,
    email: user.email,
    avatar: user.avatar || null,
    ...extra
  });

// ─────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: 'Invalid email format' });

    // Check duplicate
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(400).json({ message: 'Email already in use' });

    // Hash & create
    const hashed = await bcrypt.hash(password, 12); // 12 rounds = more secure
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed
    });

    const token = generateToken(user._id);
    return sendUserResponse(res, token, user);

  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Google-only accounts can't login with password
    if (!user.password)
      return res.status(400).json({ message: 'This account uses Google Sign-In. Please login with Google.' });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    return sendUserResponse(res, token, user);

  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/google
// ─────────────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential)
      return res.status(400).json({ message: 'Google credential is required' });

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload)
      return res.status(401).json({ message: 'Invalid Google token payload' });

    const { sub: googleId, email, name, picture } = payload;

    if (!email)
      return res.status(400).json({ message: 'Google account has no email' });

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // New user — create account
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        avatar: picture,
        password: null,
      });
    } else {
      // Existing user — link Google if not already linked
      let updated = false;
      if (!user.googleId) { user.googleId = googleId; updated = true; }
      if (!user.avatar && picture) { user.avatar = picture; updated = true; }
      if (updated) await user.save();
    }

    const token = generateToken(user._id);
    return sendUserResponse(res, token, user, { avatar: user.avatar || picture });

  } catch (err) {
    console.error('Google auth error:', err.message);

    if (err.message?.includes('Token used too late'))
      return res.status(401).json({ message: 'Google token expired. Please sign in again.' });

    if (err.message?.includes('Invalid token'))
      return res.status(401).json({ message: 'Invalid Google token. Please try again.' });

    return res.status(401).json({ message: 'Google authentication failed' });
  }
});

module.exports = router;