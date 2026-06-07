const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, phone } = req.body;
    
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const conn = await global.db.getConnection();
    
    // Check if user exists
    const [users] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      conn.release();
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Create user
    await conn.query(
      'INSERT INTO users (id, email, username, password, phone, created_at, vip_level) VALUES (?, ?, ?, ?, ?, NOW(), ?)',
      [userId, email, username, hashedPassword, phone || null, 1]
    );

    // Create wallet
    await conn.query(
      'INSERT INTO wallets (user_id, currency, balance, frozen, available) VALUES (?, ?, ?, ?, ?)',
      [userId, 'USD', 10000, 0, 10000]
    );

    conn.release();

    res.status(201).json({
      message: 'User registered successfully',
      userId: userId
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const conn = await global.db.getConnection();
    
    const [users] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    conn.release();
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.encode({
      userId: user.id,
      email: user.email,
      username: user.username,
      iat: new Date()
    }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        vip_level: user.vip_level
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin login
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'admin123456') {
      const token = jwt.encode({
        adminId: 'admin',
        role: 'superadmin',
        iat: new Date()
      }, JWT_SECRET);
      
      return res.json({
        token,
        admin: {
          id: 'admin',
          username: 'admin',
          role: 'superadmin'
        }
      });
    }
    
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
