const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const { v4: uuidv4 } = require('uuid');

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

// Place buy order
router.post('/buy', verifyToken, async (req, res) => {
  try {
    const { symbol, quantity, price, type = 'market' } = req.body;
    const orderId = uuidv4();
    const conn = await global.db.getConnection();

    // Create order
    await conn.query(
      'INSERT INTO orders (id, user_id, symbol, side, quantity, price, type, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [orderId, req.user.userId, symbol, 'BUY', quantity, price, type, 'COMPLETED']
    );

    // Update or create position
    const [positions] = await conn.query(
      'SELECT * FROM positions WHERE user_id = ? AND symbol = ?',
      [req.user.userId, symbol]
    );

    if (positions.length > 0) {
      const pos = positions[0];
      const newQuantity = pos.quantity + quantity;
      const newEntryPrice = (pos.entry_price * pos.quantity + price * quantity) / newQuantity;
      
      await conn.query(
        'UPDATE positions SET quantity = ?, entry_price = ? WHERE user_id = ? AND symbol = ?',
        [newQuantity, newEntryPrice, req.user.userId, symbol]
      );
    } else {
      await conn.query(
        'INSERT INTO positions (user_id, symbol, quantity, entry_price) VALUES (?, ?, ?, ?)',
        [req.user.userId, symbol, quantity, price]
      );
    }

    // Update wallet
    const amount = quantity * price;
    await conn.query(
      'UPDATE wallets SET available = available - ?, frozen = frozen + ? WHERE user_id = ? AND currency = ?',
      [amount, amount, req.user.userId, 'USD']
    );

    conn.release();

    res.json({
      orderId,
      message: 'Buy order placed successfully',
      order: { symbol, quantity, price, type, side: 'BUY' }
    });
  } catch (error) {
    console.error('Trade error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Place sell order
router.post('/sell', verifyToken, async (req, res) => {
  try {
    const { symbol, quantity, price, type = 'market' } = req.body;
    const orderId = uuidv4();
    const conn = await global.db.getConnection();

    // Check if user has position
    const [positions] = await conn.query(
      'SELECT * FROM positions WHERE user_id = ? AND symbol = ?',
      [req.user.userId, symbol]
    );

    if (positions.length === 0 || positions[0].quantity < quantity) {
      conn.release();
      return res.status(400).json({ error: 'Insufficient position' });
    }

    // Create order
    await conn.query(
      'INSERT INTO orders (id, user_id, symbol, side, quantity, price, type, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [orderId, req.user.userId, symbol, 'SELL', quantity, price, type, 'COMPLETED']
    );

    // Update position
    const newQuantity = positions[0].quantity - quantity;
    if (newQuantity === 0) {
      await conn.query(
        'DELETE FROM positions WHERE user_id = ? AND symbol = ?',
        [req.user.userId, symbol]
      );
    } else {
      await conn.query(
        'UPDATE positions SET quantity = ? WHERE user_id = ? AND symbol = ?',
        [newQuantity, req.user.userId, symbol]
      );
    }

    // Update wallet
    const amount = quantity * price;
    await conn.query(
      'UPDATE wallets SET available = available + ?, frozen = frozen - ? WHERE user_id = ? AND currency = ?',
      [amount, amount, req.user.userId, 'USD']
    );

    conn.release();

    res.json({
      orderId,
      message: 'Sell order placed successfully',
      order: { symbol, quantity, price, type, side: 'SELL' }
    });
  } catch (error) {
    console.error('Trade error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
