# 虚拟交易平台 (Virtual Trading Platform)

一个高仿真的虚拟货币与股票模拟交易平台，支持法语界面。

## 🚀 快速开始

### 前置要求
- Docker & Docker Compose
- Node.js 18+ (本地开发)
- MySQL 8.0+

### 一键启动 (Docker)

```bash
# 克隆项目
git clone https://github.com/2826ggg/2826116778.git
cd 2826116778

# 启动所有服务
docker-compose up -d

# 初始化数据库
docker-compose exec backend npm run init:db
```

### 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端网站 | http://localhost:3000 | 用户端交易平台 |
| 后台管理 | http://localhost:3000/admin | 管理员后台 |
| API文档 | http://localhost:5000/api/docs | Swagger API文档 |

### 默认账号

**管理员登录**
- 用户名: `admin`
- 密码: `admin123456`

**演示用户账号**
- 邮箱: `demo@example.com`
- 密码: `demo123456`

## 📁 项目结构

```
.
├── frontend/                 # React + Next.js 前端
│   ├── app/                 # Next.js 应用
│   ├── components/          # React 组件
│   ├── styles/              # TailwindCSS 样式
│   └── public/              # 静态资源
├── backend/                 # Node.js + Express 后端
│   ├── src/
│   │   ├── routes/          # API 路由
│   │   ├── controllers/      # 业务逻辑
│   │   ├── models/          # 数据库模型
│   │   ├── middleware/      # 中间件
│   │   └── services/        # 业务服务
│   └── package.json
├── docker-compose.yml       # Docker 容器编排
├── nginx.conf              # Nginx 配置
└── README.md
```

## 🎯 核心功能

### 用户端
- ✅ 实时行情显示 (BTC, ETH, SOL, XRP, TSLA, AAPL, NVDA, META, AMZN)
- ✅ 完整K线图系统 (8个周期 + 6种技术指标)
- ✅ 用户注册/登录/实名认证
- ✅ 市价/限价买入卖出
- ✅ 持仓管理和历史订单
- ✅ 钱包系统 (USDT/USD/EUR)
- ✅ VIP等级系统
- ✅ 邀请奖励系统
- ✅ 个人资产统计和盈亏曲线
- ✅ 多语言支持 (法语/英文/中文)

### 管理后台
- ✅ 用户管理和资产调整
- ✅ 行情控制系统 (涨跌/横盘设置)
- ✅ K线自动/手动生成
- ✅ 订单管理 (强制成交/取消)
- ✅ 充值/提现管理
- ✅ 财务统计和导出
- ✅ 风控日志查看
- ✅ 权限管理

## 🛠️ 技术栈

### 前端
- React 18
- Next.js 13
- TailwindCSS
- TradingView Charts
- Axios
- Redux

### 后端
- Node.js
- Express.js
- MySQL
- Redis
- WebSocket
- JWT认证

### 部署
- Docker
- Docker Compose
- Nginx

## 📖 详细文档

### 本地开发
```bash
# 后端
cd backend
npm install
npm run dev

# 前端 (新终端)
cd frontend
npm install
npm run dev
```

### 数据库初始化
```bash
npm run init:db
```

### API 文档
http://localhost:5000/api/docs

## 🔐 安全性

- JWT 认证
- Password 加密存储
- SQL 注入防护
- CORS 配置
- 速率限制
- IP 白名单 (管理后台)

## 📊 实时更新

所有价格和K线数据通过 WebSocket 实时推送，确保交易数据的实时性。

## 📝 API 示例

### 用户登录
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "demo123456"
}
```

### 获取行情
```bash
GET /api/market/symbols
```

### 获取K线数据
```bash
GET /api/market/candles?symbol=BTC/USD&period=1h
```

## 🤝 支持

如有问题，请提交 Issue 或联系开发团队。

## 📄 许可证

MIT License

---

**注意**: 本项目仅用于学习演示和模拟交易，不接入真实银行、证券公司或加密货币交易所。
