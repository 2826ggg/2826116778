CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  vip_level INT DEFAULT 1,
  kyc_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
);

CREATE TABLE IF NOT EXISTS wallets (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  balance DECIMAL(18, 8) DEFAULT 0,
  frozen DECIMAL(18, 8) DEFAULT 0,
  available DECIMAL(18, 8) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_currency (user_id, currency),
  INDEX idx_user_id (user_id)
);

CREATE TABLE IF NOT EXISTS positions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  quantity DECIMAL(18, 8) NOT NULL,
  entry_price DECIMAL(18, 8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_symbol (user_id, symbol),
  INDEX idx_user_id (user_id),
  INDEX idx_symbol (symbol)
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  side ENUM('BUY', 'SELL') NOT NULL,
  quantity DECIMAL(18, 8) NOT NULL,
  price DECIMAL(18, 8) NOT NULL,
  type ENUM('market', 'limit') DEFAULT 'market',
  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  type ENUM('deposit', 'withdrawal', 'trade', 'reward') DEFAULT 'deposit',
  currency VARCHAR(10) DEFAULT 'USD',
  amount DECIMAL(18, 8) NOT NULL,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS market_prices (
  id VARCHAR(36) PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL,
  price DECIMAL(18, 8) NOT NULL,
  high DECIMAL(18, 8),
  low DECIMAL(18, 8),
  volume BIGINT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_symbol_timestamp (symbol, timestamp),
  INDEX idx_symbol (symbol),
  INDEX idx_timestamp (timestamp)
);

-- Insert initial admin
INSERT IGNORE INTO users (id, email, username, password, vip_level) VALUES 
('admin-user', 'admin@trading.local', 'admin', '$2a$10$dXJ3SW6G7P50eS3xQ3D4aOqAMf/dxRe0zcJaAFaK9nGVqLM7Y5XdK', 5);

-- Insert demo user
INSERT IGNORE INTO users (id, email, username, password, phone, vip_level) VALUES 
('demo-user', 'demo@example.com', 'demo', '$2a$10$dXJ3SW6G7P50eS3xQ3D4aOqAMf/dxRe0zcJaAFaK9nGVqLM7Y5XdK', '13800000000', 1);

-- Insert wallets for demo user
INSERT IGNORE INTO wallets (id, user_id, currency, balance, frozen, available) VALUES 
('wallet-usd', 'demo-user', 'USD', 10000, 0, 10000),
('wallet-usdt', 'demo-user', 'USDT', 5000, 0, 5000),
('wallet-eur', 'demo-user', 'EUR', 2000, 0, 2000);
