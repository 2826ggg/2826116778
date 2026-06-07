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
├── backend/                  # Node.js + Express 后端
├── docker-compose.yml        # Docker 容器编排
└── README.md
```

## 🎯 核心功能

- ✅ 实时行情显示
- ✅ K线图系统
- ✅ 用户注册/登录
- ✅ 交易系统
- ✅ 钱包系统
- ✅ VIP等级
- ✅ 邀请奖励
- ✅ 管理后台
- ✅ 多语言支持

## 🛠️ 技术栈

- 前端: React, Next.js, TailwindCSS
- 后端: Node.js, Express, MySQL, Redis
- 部署: Docker, Nginx
