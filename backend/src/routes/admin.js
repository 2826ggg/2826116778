const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.decode(token, JWT_SECRET);
    if (decoded.role !== 'superadmin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all users
router.get('/users', verifyAdminToken, async (req, res) => {
  try {
    const conn = await global.db.getConnection();
    const [users] = await conn.query('SELECT id, email, username, vip_level, created_at FROM users LIMIT 100');
    conn.release();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user details
router.get('/users/:userId', verifyAdminToken, async (req, res) => {
  try {
    const conn = await global.db.getConnection();
    const [users] = await conn.query('SELECT * FROM users WHERE id = ?', [req.params.userId]);
    const [wallets] = await conn.query('SELECT * FROM wallets WHERE user_id = ?', [req.params.userId]);
    const [positions] = await conn.query('SELECT * FROM positions WHERE user_id = ?', [req.params.userId]);
    conn.release();

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0], wallets, positions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user balance
router.post('/users/:userId/balance', verifyAdminToken, async (req, res) => {
  try {
    const { currency = 'USD', amount } = req.body;
    const conn = await global.db.getConnection();

    await conn.query(
      'UPDATE wallets SET available = available + ?, balance = balance + ? WHERE user_id = ? AND currency = ?',
      [amount, amount, req.params.userId, currency]
    );

    conn.release();
    res.json({ message: 'Balance updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders
router.get('/orders', verifyAdminToken, async (req, res) => {
  try {
    const conn = await global.db.getConnection();
    const [orders] = await conn.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 500');
    conn.release();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
