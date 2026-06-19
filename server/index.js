const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// 1. Security Headers:
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginEmbedderPolicy: false 
}));

// 2. CORS Configuration
const clientOrigin = process.env.CLIENT_URL;
if (!clientOrigin) {
  console.warn("WARNING: CLIENT_URL is not set in environment variables!");
}

const corsOptions = {
  origin: clientOrigin || "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true 
};
app.use(cors(corsOptions));

// 3. Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 4. Trailing Slash Fix:
app.use((req, res, next) => {
  if (req.path.slice(-1) === '/' && req.path.length > 1) {
    const safePath = req.path.slice(0, -1);
    res.redirect(301, safePath);
  } else {
    next();
  }
});

// 5. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analysis', require('./routes/analysis'));

// 6. Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'Server is healthy' }));

// 7. Global Error Handling
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(err.status || 500).json({ 
    message: err.message || 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err : {} 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));