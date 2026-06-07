# 🚀 Virtual Trading Platform - 完整部署指南

## 📋 项目概述

虚拟货币与股票模拟交易平台，支持：
- 实时行情数据
- K线图表系统
- 模拟交易执行
- 用户资产管理
- 管理后台控制
- 多语言支持（扩展中）

## 🎯 快速开始（5分钟）

### 前置要求
```bash
✅ Docker & Docker Compose
✅ Git
✅ 至少 4GB RAM
✅ 2GB 磁盘空间
```

### 一键启动

```bash
# 1. 克隆项目
git clone https://github.com/2826ggg/2826116778.git
cd 2826116778

# 2. 赋予脚本执行权限
chmod +x *.sh

# 3. 启动所有服务
./start.sh
```

### 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 🌐 前端网站 | http://localhost:3000 | 用户交易平台 |
| 📡 后端API | http://localhost:5000/api | REST API 接口 |
| 📚 API文档 | http://localhost:5000/api/docs | Swagger 文档 |
| 🔧 管理后台 | http://localhost:3000/admin | 管理员面板 |

## 🔐 默认账号

### 普通用户
```
邮箱: demo@example.com
密码: demo123456
初始资金: $10,000 USD
```

### 管理员
```
用户名: admin
密码: admin123456
权限: 超级管理员
```

## 📦 本地开发

### 环境配置

```bash
# 后端
cd backend
cp .env.example .env
npm install

# 前端
cd ../frontend
npm install
```

### 启动开发服务器

#### 后端（终端1）
```bash
cd backend
npm run dev
# 服务运行在 http://localhost:5000
```

#### 前端（终端2）
```bash
cd frontend
npm run dev
# 服务运行在 http://localhost:3000
```

#### 数据库初始化
```bash
cd backend
npm run init:db
```

## 🏗️ 项目架构

### 目录结构

```
2826116778/
├── frontend/                 # React + Next.js 前端
│   ├── app/
│   │   ├── page.jsx         # 首页
│   │   ├── login/           # 登录页
│   │   ├── register/        # 注册页
│   │   ├── market/          # 行情页
│   │   ├── trade/           # 交易页
│   │   ├── profile/         # 个人页
│   │   └── admin/           # 管理后台
│   ├── components/          # React 组件
│   │   ├── Navbar.jsx
│   │   ├── PriceChart.jsx
│   │   └── MarketTable.jsx
│   ├── lib/
│   │   └── store.js         # Zustand 状态管理
│   ├── styles/
│   │   └── globals.css      # 全局样式
│   ├── package.json
│   └── Dockerfile
│
├── backend/                 # Node.js + Express 后端
│   ├── src/
│   │   ├── index.js         # 主文件
│   │   ├── routes/          # API 路由
│   │   │   ├── auth.js      # 认证
│   │   │   ├── market.js    # 行情
│   │   │   ├── user.js      # 用户
│   │   │   ├── trade.js     # 交易
│   │   │   ├── wallet.js    # 钱包
│   │   │   └── admin.js     # 管理
│   │   └── scripts/
│   │       └── init-db.js   # 数据库初始化
│   ├── sql/
│   │   └── init.sql         # SQL 脚本
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml       # Docker 编排
├── nginx.conf              # Nginx 配置
├── start.sh                # 启动脚本
├── stop.sh                 # 停止脚本
├── status.sh               # 状态脚本
├── install-deps.sh         # 依赖安装
├── package.json            # 项目配置
└── QUICKSTART.md           # 快速指南
```

## 🛠️ 常用命令

### Docker 命令

```bash
# 查看所有服务状态
./status.sh

# 查看实时日志
docker-compose logs -f

# 只看后端日志
docker-compose logs -f backend

# 只看前端日志
docker-compose logs -f frontend

# 只看数据库日志
docker-compose logs -f mysql

# 停止所有服务
./stop.sh

# 重启所有服务
docker-compose restart

# 进入后端容器
docker-compose exec backend sh

# 进入 MySQL 容器
docker-compose exec mysql mysql -u trading_user -p trading_platform
```

### 数据库操作

```bash
# 初始化数据库
docker-compose exec backend npm run init:db

# 连接到 MySQL
docker-compose exec mysql mysql -u trading_user -p trading_platform

# 查看所有用户
SELECT * FROM users;

# 查看所有订单
SELECT * FROM orders;

# 查看钱包余额
SELECT * FROM wallets;
```

## 📡 API 文档

### 认证相关

#### 用户注册
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "testuser",
  "password": "password123",
  "phone": "13800000000"
}
```

#### 用户登录
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "demo123456"
}

响应:
{
  "token": "eyJhbGc...",
  "user": {
    "id": "demo-user",
    "email": "demo@example.com",
    "username": "demo",
    "vip_level": 1
  }
}
```

### 行情相关

#### 获取所有交易品种
```bash
GET /api/market/symbols

响应:
[
  {
    "symbol": "BTC/USD",
    "name": "Bitcoin",
    "price": 45000,
    "change": 250,
    "changePercent": 0.56,
    "high": 46000,
    "low": 44000,
    "volume": 1000000
  },
  ...
]
```

#### 获取K线数据
```bash
GET /api/market/candles?symbol=BTC/USD&period=1h

响应:
{
  "symbol": "BTC/USD",
  "period": "1h",
  "candles": [
    {
      "time": 1686151200,
      "open": 45000,
      "close": 45500,
      "high": 46000,
      "low": 44500,
      "volume": 50000
    },
    ...
  ]
}
```

### 交易相关

#### 买入订单
```bash
POST /api/trade/buy
Authorization: Bearer <token>
Content-Type: application/json

{
  "symbol": "BTC/USD",
  "quantity": 0.5,
  "price": 45000,
  "type": "limit"
}
```

#### 卖出订单
```bash
POST /api/trade/sell
Authorization: Bearer <token>
Content-Type: application/json

{
  "symbol": "BTC/USD",
  "quantity": 0.5,
  "price": 46000,
  "type": "limit"
}
```

### 用户相关

#### 获取个人信息
```bash
GET /api/user/profile
Authorization: Bearer <token>
```

#### 获取资产信息
```bash
GET /api/user/assets
Authorization: Bearer <token>
```

#### 获取订单历史
```bash
GET /api/user/orders
Authorization: Bearer <token>
```

### 钱包相关

#### 获取钱包余额
```bash
GET /api/wallet/balance
Authorization: Bearer <token>
```

#### 获取交易记录
```bash
GET /api/wallet/transactions
Authorization: Bearer <token>
```

### 管理员相关

#### 管理员登录
```bash
POST /api/auth/admin-login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123456"
}
```

#### 获取所有用户
```bash
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### 获取用户详情
```bash
GET /api/admin/users/:userId
Authorization: Bearer <admin_token>
```

#### 调整用户余额
```bash
POST /api/admin/users/:userId/balance
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "currency": "USD",
  "amount": 1000
}
```

#### 获取所有订单
```bash
GET /api/admin/orders
Authorization: Bearer <admin_token>
```

## 🔧 故障排除

### Docker 无法启动
```bash
# 检查 Docker 是否运行
docker ps

# 查看错误日志
docker-compose logs

# 重新构建镜像
docker-compose build --no-cache
```

### 数据库连接失败
```bash
# 检查 MySQL 是否运行
docker-compose logs mysql

# 重启数据库
docker-compose restart mysql

# 重新初始化
docker-compose exec backend npm run init:db
```

### 前端无法连接到后端
```bash
# 检查后端是否运行
docker-compose logs backend

# 检查网络配置
docker network ls

# 重新启动
./stop.sh && sleep 5 && ./start.sh
```

### 端口被占用
```bash
# 修改 docker-compose.yml 中的端口配置
# 例如将 3000 改为 3001
ports:
  - "3001:3000"
```

## 📊 技术栈详情

### 前端
- **框架**: Next.js 13 (React 18)
- **样式**: TailwindCSS 3
- **状态管理**: Zustand
- **图表**: Recharts
- **HTTP客户端**: Axios
- **认证**: JWT + Cookies

### 后端
- **运行时**: Node.js 18
- **框架**: Express.js
- **数据库**: MySQL 8.0
- **缓存**: Redis 7
- **实时通讯**: WebSocket
- **认证**: JWT
- **密码加密**: bcryptjs

### 基础设施
- **容器化**: Docker
- **编排**: Docker Compose
- **反向代理**: Nginx
- **操作系统**: Linux (Alpine)

## 🎓 学习资源

- [Next.js 文档](https://nextjs.org)
- [Express.js 文档](https://expressjs.com)
- [MySQL 文档](https://dev.mysql.com)
- [Docker 文档](https://docs.docker.com)
- [TailwindCSS 文档](https://tailwindcss.com)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## ⚖️ 免责声明

⚠️ **本项目仅用于学习和演示用途**

- 这是一个**虚拟交易平台**，不涉及真实资金
- 不接入任何真实银行或交易所
- 所有数据都是模拟数据
- 仅用于教学、展示和测试

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 支持与反馈

- 📧 Email: support@trading.local
- 🐛 Issues: [GitHub Issues](https://github.com/2826ggg/2826116778/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/2826ggg/2826116778/discussions)

---

**Made with ❤️ by Trading Team**

⭐ 如果觉得有帮助，请给个 Star！
