# 虚拟交易平台快速启动指南

## 系统要求

- Docker & Docker Compose
- 至少 4GB RAM
- 2GB 磁盘空间

## 快速开始

### 方式 1: 使用 Docker（推荐）

```bash
# 克隆项目
git clone https://github.com/2826ggg/2826116778.git
cd 2826116778

# 给脚本执行权限
chmod +x *.sh

# 启动所有服务
./start.sh
```

访问：
- **前端**: http://localhost:3000
- **后端 API**: http://localhost:5000/api
- **API 文档**: http://localhost:5000/api/docs

### 方式 2: 本地开发

#### 后端启动

```bash
cd backend
npm install
cp .env.example .env
npm run init:db  # 初始化数据库
npm run dev
```

#### 前端启动（新终端）

```bash
cd frontend
npm install
npm run dev
```

## 默认账号

### 演示用户
- 邮箱: `demo@example.com`
- 密码: `demo123456`
- 初始资金: $10,000 USD

### 管理员
- 用户名: `admin`
- 密码: `admin123456`
- 后台地址: http://localhost:3000/admin

## 常用命令

```bash
# 查看所有服务状态
./status.sh

# 停止所有服务
./stop.sh

# 查看日志
docker-compose logs -f

# 只查看后端日志
docker-compose logs -f backend

# 只查看前端日志
docker-compose logs -f frontend

# 重启所有服务
docker-compose restart

# 重新初始化数据库
docker-compose exec backend npm run init:db
```

## 项目结构

```
2826116778/
├── frontend/              # React + Next.js 前端
│   ├── app/              # Next.js 应用页面
│   ├── components/       # React 组件
│   ├── lib/              # 工具和 stores
│   ├── styles/           # CSS 样式
│   └── public/            # 静态资源
├── backend/              # Node.js + Express 后端
│   ├── src/
│   │   ├── routes/       # API 路由
│   │   ├── scripts/      # 初始化脚本
│   │   └── index.js      # 主文件
│   ├── sql/              # 数据库脚本
│   └── Dockerfile
├── docker-compose.yml    # Docker 编排
├── nginx.conf            # Nginx 配置
└── README.md
```

## 技术栈

### 前端
- React 18
- Next.js 13
- TailwindCSS
- Recharts (图表)
- Zustand (状态管理)

### 后端
- Node.js
- Express.js
- MySQL 8.0
- Redis
- WebSocket
- JWT 认证

### 部署
- Docker
- Docker Compose
- Nginx

## 核心功能

### 用户端 ✅
- [x] 用户注册/登录
- [x] 实时行情显示
- [x] K线图系统
- [x] 买入/卖出交易
- [x] 持仓管理
- [x] 资产统计
- [x] 钱包系统
- [ ] VIP 等级系统
- [ ] 邀请奖励
- [ ] 技术指标
- [ ] 多语言支持

### 管理后台 (计划中)
- [ ] 用户管理
- [ ] 资产调整
- [ ] 行情控制
- [ ] 订单管理
- [ ] 财务统计
- [ ] 权限管理

## 故障排除

### MySQL 连接错误
```bash
# 检查 MySQL 是否运行
docker-compose logs mysql

# 重启 MySQL
docker-compose restart mysql
```

### 端口被占用
```bash
# 修改 docker-compose.yml 中的端口
# 例如改成 3001, 5001 等
```

### 数据库初始化失败
```bash
# 手动初始化
docker-compose exec backend npm run init:db
```

## 安全提示

⚠️ **这是虚拟交易平台，仅用于学习和演示，不涉及真实资金！**

- 不要在生产环境使用默认密码
- 修改 JWT_SECRET
- 使用 HTTPS
- 配置防火墙

## 支持和反馈

如有问题，请在 GitHub 提交 Issue。

## 许可证

MIT License
