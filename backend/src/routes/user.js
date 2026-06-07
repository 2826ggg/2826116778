const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.decode(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const conn = await global.db.getConnection();
    const [users] = await conn.query('SELECT id, email, username, vip_level, created_at FROM users WHERE id = ?', [req.user.userId]);
    conn.release();

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user assets
router.get('/assets', verifyToken, async (req, res) => {
  try {
    const conn = await global.db.getConnection();
    
    // Get wallets
    const [wallets] = await conn.query(
      'SELECT currency, balance, frozen, available FROM wallets WHERE user_id = ?',
      [req.user.userId]
    );

    // Get positions
    const [positions] = await conn.query(
      'SELECT symbol, quantity, entry_price FROM positions WHERE user_id = ? AND quantity > 0',
      [req.user.userId]
    );

    conn.release();

    const totalAssets = wallets.reduce((sum, w) => sum + w.balance, 0);
    const frozenAssets = wallets.reduce((sum, w) => sum + w.frozen, 0);
    const availableAssets = wallets.reduce((sum, w) => sum + w.available, 0);

    res.json({
      totalAssets,
      frozenAssets,
      availableAssets,
      positionAssets: positions.length * 100, // Mock calculation
      wallets,
      positions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order history
router.get('/orders', verifyToken, async (req, res) => {
  try {
    const conn = await global.db.getConnection();
    const [orders] = await conn.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 100',
      [req.user.userId]
    );
    conn.release();

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
