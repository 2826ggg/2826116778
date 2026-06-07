# Virtual Trading Platform - Backend

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

## Environment Variables

Edit `.env` with your configuration:

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=trading_user
DB_PASSWORD=trading_pass
DB_NAME=trading_platform
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_secret_key
API_PORT=5000
```

## Development

```bash
# Start development server
npm run dev

# Initialize database
npm run init:db
```

## Production

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login

### Market
- `GET /api/market/symbols` - Get all symbols
- `GET /api/market/candles` - Get K-line data

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/user/assets` - Get user assets
- `GET /api/user/orders` - Get order history

### Trading
- `POST /api/trade/buy` - Place buy order
- `POST /api/trade/sell` - Place sell order

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `GET /api/wallet/transactions` - Get transactions

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:userId` - Get user details
- `POST /api/admin/users/:userId/balance` - Update user balance
- `GET /api/admin/orders` - Get all orders
