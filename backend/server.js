const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration (Render / Vercel ready)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://dipueditx.in',
  'https://www.dipueditx.in',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/production for custom domains
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/faqs', require('./routes/faqRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

const mongoose = require('mongoose');

// Helper to format uptime into human-readable string
const formatUptime = (uptimeSeconds) => {
  const days = Math.floor(uptimeSeconds / (3600 * 24));
  const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(' ');
};

// Helper for Mongo connection state
const getDbStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

// Comprehensive Health Check Handler
const healthCheckHandler = (req, res) => {
  const memory = process.memoryUsage();
  const uptimeSeconds = process.uptime();
  const dbStatus = getDbStatus();

  res.status(200).json({
    status: 'healthy',
    message: 'DipuEditX API is active and running 24/7',
    agency: 'DipuEditX - Video Editor & AI Video Creator',
    domain: 'dipueditx.in',
    timestamp: new Date().toISOString(),
    istTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    uptime: {
      seconds: Math.floor(uptimeSeconds),
      humanReadable: formatUptime(uptimeSeconds),
    },
    database: {
      status: dbStatus,
      connected: dbStatus === 'connected',
    },
    system: {
      memoryUsedMB: (memory.heapUsed / 1024 / 1024).toFixed(2),
      memoryTotalMB: (memory.heapTotal / 1024 / 1024).toFixed(2),
      rssMB: (memory.rss / 1024 / 1024).toFixed(2),
      nodeVersion: process.version,
      platform: process.platform,
    },
    monitoringTip: 'Ping this endpoint or /ping every 5 to 14 minutes using Cron-Job.org or UptimeRobot to keep Render instance awake 24/7.',
  });
};

// Minimal lightweight ping endpoint for automated keep-alive bots
const pingHandler = (req, res) => {
  res.status(200).send('PONG - DipuEditX is awake');
};

// Health & Ping Endpoints
app.get('/health', healthCheckHandler);
app.get('/api/health', healthCheckHandler);
app.get('/ping', pingHandler);
app.get('/api/ping', pingHandler);

// Root route
app.get('/', (req, res) => {
  res.send('🚀 DipuEditX Agency API is online and running. Visit https://dipueditx.in for the official website.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DipuEditX API Server running on port ${PORT}`);
  console.log(`📡 Health Check URL: http://localhost:${PORT}/health`);
  console.log(`⚡ Keep-Alive Ping: http://localhost:${PORT}/ping`);

  // Optional: Auto Self-Ping Worker for Render / Cloud hosting
  // Automatically pings the server every 13 minutes if KEEP_ALIVE_URL or RENDER_EXTERNAL_URL is set
  const selfPingUrl = process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL;
  if (selfPingUrl) {
    const PING_INTERVAL_MS = 13 * 60 * 1000; // 13 minutes (Render sleeps after 15 mins)
    console.log(`🛡️ Keep-Alive Self-Pinger activated for: ${selfPingUrl}/ping (Every 13 mins)`);

    setInterval(async () => {
      try {
        const target = `${selfPingUrl.replace(/\/$/, '')}/ping`;
        await fetch(target);
        console.log(`[Keep-Alive Auto Ping]: Successfully pinged ${target} at ${new Date().toLocaleTimeString('en-IN')}`);
      } catch (err) {
        console.warn(`[Keep-Alive Ping Warning]: ${err.message}`);
      }
    }, PING_INTERVAL_MS);
  }
});

