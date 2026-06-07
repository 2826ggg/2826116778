const express = require('express');
const router = express.Router();

// Mock market data
const SYMBOLS = [
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 45000 },
  { symbol: 'ETH/USD', name: 'Ethereum', price: 2500 },
  { symbol: 'SOL/USD', name: 'Solana', price: 25 },
  { symbol: 'XRP/USD', name: 'Ripple', price: 0.5 },
  { symbol: 'TSLA', name: 'Tesla', price: 250 },
  { symbol: 'AAPL', name: 'Apple', price: 180 },
  { symbol: 'NVDA', name: 'Nvidia', price: 450 },
  { symbol: 'META', name: 'Meta', price: 280 },
  { symbol: 'AMZN', name: 'Amazon', price: 170 }
];

// Get symbols
router.get('/symbols', (req, res) => {
  try {
    const symbols = SYMBOLS.map(s => ({
      ...s,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      high: s.price * 1.05,
      low: s.price * 0.95,
      volume: Math.floor(Math.random() * 1000000),
      amount: Math.floor(Math.random() * 10000000)
    }));
    res.json(symbols);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get K-line candles
router.get('/candles', (req, res) => {
  try {
    const { symbol = 'BTC/USD', period = '1h' } = req.query;
    const candles = [];
    let basePrice = 45000;
    
    // Generate 50 candles
    for (let i = 50; i > 0; i--) {
      const change = (Math.random() - 0.5) * 2000;
      const open = basePrice;
      const close = basePrice + change;
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);
      const volume = Math.floor(Math.random() * 5000);
      
      candles.push({
        time: Math.floor(Date.now() / 1000) - i * 3600,
        open,
        close,
        high,
        low,
        volume
      });
      
      basePrice = close;
    }

    res.json({ symbol, period, candles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
