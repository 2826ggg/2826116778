const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const WebSocket = require('ws');
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'trading_user',
  password: process.env.DB_PASSWORD || 'trading_pass',
  database: process.env.DB_NAME || 'trading_platform',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_POOL_SIZE) || 10,
  queueLimit: 0
});

// Make pool available globally
global.db = pool;

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/market', require('./routes/market'));
app.use('/api/user', require('./routes/user'));
app.use('/api/trade', require('./routes/trade'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Swagger API docs
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'Trading Platform API',
    version: '1.0.0',
    endpoints: [
      { method: 'POST', path: '/api/auth/register', description: 'User registration' },
      { method: 'POST', path: '/api/auth/login', description: 'User login' },
      { method: 'GET', path: '/api/market/symbols', description: 'Get market symbols' },
      { method: 'GET', path: '/api/market/candles', description: 'Get K-line candles' },
      { method: 'POST', path: '/api/trade/buy', description: 'Place buy order' },
      { method: 'POST', path: '/api/trade/sell', description: 'Place sell order' },
      { method: 'GET', path: '/api/user/profile', description: 'Get user profile' },
      { method: 'GET', path: '/api/wallet/balance', description: 'Get wallet balance' }
    ]
  });
});

// WebSocket handler
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'subscribe') {
        ws.symbol = data.symbol;
        // Send initial price
        ws.send(JSON.stringify({
          type: 'price',
          symbol: data.symbol,
          price: Math.random() * 100000,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (e) {
      console.error('WebSocket error:', e);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.API_PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API docs available at http://localhost:${PORT}/api/docs`);
});

module.exports = { app, pool, wss };
