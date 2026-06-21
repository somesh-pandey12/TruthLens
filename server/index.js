const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// 1. Security Headers
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginEmbedderPolicy: false
}));

// 2. CORS Configuration
const allowedOrigins = [
  "https://truth-lens-eight-ochre.vercel.app",
  "http://localhost:3000", // ✅ local frontend
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked for origin: ${origin}`);
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 3. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analysis', require('./routes/analysis'));

// 4. Health Check
app.get('/health', (req, res) => res.status(200).json({
  status: 'Server is healthy',
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development'
}));

// 5. 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  if (err.message?.startsWith('CORS policy')) {
    return res.status(403).json({ message: err.message });
  }
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);

  // 8. Self-ping to keep Render free tier awake (every 14 minutes)
  const SELF_URL = process.env.RENDER_EXTERNAL_URL;
  if (SELF_URL && process.env.NODE_ENV === 'production') {
    setInterval(async () => {
      try {
        const res = await fetch(`${SELF_URL}/health`);
        console.log(`Self-ping OK: ${res.status} at ${new Date().toISOString()}`);
      } catch (e) {
        console.warn(`Self-ping failed: ${e.message}`);
      }
    }, 14 * 60 * 1000); // 14 minutes
    console.log(`Self-ping active → ${SELF_URL}/health`);
  }
});