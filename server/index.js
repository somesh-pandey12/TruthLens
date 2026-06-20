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
  "https://truth-lens-eight-ochre.vercel.app",  // your Vercel frontend
  "http://localhost:3000",                        // local dev
  process.env.CLIENT_URL,                         // extra from .env if needed
].filter(Boolean); // removes undefined if CLIENT_URL not set

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, curl)
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
  optionsSuccessStatus: 200 // fixes preflight issues on some browsers
};

app.use(cors(corsOptions));

// 3. Handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

// 4. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 5. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analysis', require('./routes/analysis'));

// 6. Health Check
app.get('/health', (req, res) => res.status(200).json({ 
  status: 'Server is healthy',
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development'
}));

// 7. 404 Handler - unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// 8. Global Error Handling
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);

  // Handle CORS errors specifically
  if (err.message && err.message.startsWith('CORS policy')) {
    return res.status(403).json({ message: err.message });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});