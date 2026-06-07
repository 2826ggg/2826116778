const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

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

// Get wallet balance
router.get('/balance', verifyToken, async (req, res) => {
  try {
    const conn = await global.db.getConnection();
    const [wallets] = await conn.query(
      'SELECT currency, balance, frozen, available FROM wallets WHERE user_id = ?',
      [req.user.userId]
    );
    conn.release();

    res.json({ wallets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction history
router.get('/transactions', verifyToken, async (req, res) => {
  try {
    const conn = await global.db.getConnection();
    const [transactions] = await conn.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 100',
      [req.user.userId]
    );
    conn.release();

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
