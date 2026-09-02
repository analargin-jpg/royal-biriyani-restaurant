const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const { connectDB } = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Royal Biriyani & Fast Food API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    adminPhone: process.env.ADMIN_PHONE || '6384945599',
    restaurantPhone: process.env.RESTAURANT_PHONE || '7418525405'
  });
});

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🍛 Welcome to Royal Biriyani & Fast Food API Server',
    endpoints: {
      health: '/api/health',
      orders: '/api/orders',
      menu: '/api/menu',
      auth: '/api/auth/login'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server with error handling
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Royal Biriyani API Server running on port ${PORT}`);
    console.log(`📍 REST API URL: http://localhost:${PORT}/api`);
    console.log(`📱 Admin WhatsApp: ${process.env.ADMIN_PHONE || '6384945599'}`);
    console.log(`🍴 Restaurant: ${process.env.RESTAURANT_PHONE || '7418525405'}`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${PORT} is currently in use. Please terminate existing processes on port ${PORT}.`);
    } else {
      console.error('Server error:', err.message);
    }
  });
}

module.exports = app;
