# Virtual Trading Platform - Docker 部署指南

## 系统要求

- **操作系统**: Linux, macOS, 或 Windows (with WSL2)
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **内存**: 至少 4GB RAM
- **磁盘**: 至少 2GB 可用空间
- **网络**: 需要 3000, 5000, 3306, 6379 端口

## 快速开始（推荐方式）

### 方式1：一键启动（最简单）

```bash
# 1. 克隆项目
git clone https://github.com/2826ggg/2826116778.git
cd 2826116778

# 2. 给脚本添加执行权限
chmod +x *.sh

# 3. 启动所有服务
./start.sh

# 等待 30-60 秒，直到看到"Platform is running!"的消息
```

### 方式2：手动 Docker 启动

```bash
# 1. 构建镜像
docker-compose build

# 2. 启动服务
docker-compose up -d

# 3. 初始化数据库
docker-compose exec backend npm run init:db
```

## 访问地址

| 服务 | URL | 说明 |
|------|-----|------|
| 🌐 **前端** | http://localhost:3000 | 用户交易界面 |
| 🔧 **后端** | http://localhost:5000/api | REST API |
| 📚 **API文档** | http://localhost:5000/api/docs | Swagger 接口文档 |
| 🔑 **管理后台** | http://localhost:3000/admin | 管理员面板 |

## 默认账号

### 👤 普通用户
```
邮箱: demo@example.com
密码: demo123456
初始资金: $10,000 USD
```

### 🔐 管理员
```
用户名: admin
密码: admin123456
权限: 超级管理员
```

## 常用命令

### 查看状态
```bash
./status.sh
```

### 查看日志
```bash
# 查看所有日志
docker-compose logs -f

# 只看后端日志
docker-compose logs -f backend

# 只看前端日志
docker-compose logs -f frontend

# 只看数据库日志
docker-compose logs -f mysql
```

### 停止服务
```bash
./stop.sh
```

### 重启服务
```bash
docker-compose restart

# 或重启特定服务
docker-compose restart backend
docker-compose restart frontend
```

### 重新初始化数据库
```bash
docker-compose exec backend npm run init:db
```

### 完全清理（删除所有数据）
```bash
./reset.sh
```

### 进入容器
```bash
# 进入后端容器
docker-compose exec backend sh

# 进入数据库容器
docker-compose exec mysql mysql -u trading_user -p trading_platform

# 进入 Redis 容器
docker-compose exec redis redis-cli
```

## 故障排除

### 问题：Docker 无法启动

**解决方案：**
1. 确保 Docker 守护进程在运行
2. 在 macOS/Windows 上，打开 Docker Desktop
3. 检查 Docker 权限：`docker ps`

### 问题：端口已被占用

**查找占用进程：**
```bash
# Linux/macOS
lsof -i :3000   # 前端
lsof -i :5000   # 后端
lsof -i :3306   # MySQL
lsof -i :6379   # Redis

# Windows
netstat -ano | findstr :3000
```

**修改端口（编辑 docker-compose.yml）：**
```yaml
services:
  frontend:
    ports:
      - "3001:3000"  # 改为 3001
  
  backend:
    ports:
      - "5001:5000"  # 改为 5001
```

### 问题：数据库连接失败

**解决步骤：**
1. 检查 MySQL 容器状态：`docker-compose logs mysql`
2. 重启数据库：`docker-compose restart mysql`
3. 重新初始化：`docker-compose exec backend npm run init:db`

### 问题：前端无法连接后端

**检查项：**
1. 后端是否运行：`docker-compose logs backend`
2. 检查 API URL：在 `frontend/.env.local` 中确认 `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
3. 重新启动前端：`docker-compose restart frontend`

### 问题：登录失败

**排查步骤：**
1. 检查数据库是否初始化：`docker-compose exec mysql mysql -u trading_user -p trading_platform -e "SELECT COUNT(*) FROM users;"`
2. 确认演示账户存在：`docker-compose exec mysql mysql -u trading_user -p trading_platform -e "SELECT * FROM users WHERE email='demo@example.com';"`
3. 如果不存在，重新初始化：`docker-compose exec backend npm run init:db`

## 监控与维护

### 查看容器资源使用
```bash
docker stats
```

### 备份数据库
```bash
# 导出数据库
docker-compose exec -T mysql mysqldump -u trading_user -p trading_platform > backup.sql

# 输入密码：trading_pass
```

### 恢复数据库
```bash
# 导入数据库
docker-compose exec -T mysql mysql -u trading_user -p trading_platform < backup.sql
```

### 查看数据库内容
```bash
# 连接到 MySQL
docker-compose exec mysql mysql -u trading_user -p trading_platform

# 常用查询
SHOW TABLES;                          # 查看所有表
SELECT * FROM users;                  # 查看用户
SELECT * FROM orders;                 # 查看订单
SELECT * FROM wallets;                # 查看钱包
SELECT * FROM positions;              # 查看持仓
```

## 性能调优

### 增加资源限制

编辑 `docker-compose.yml`：

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 启用 Redis 缓存

Redis 已在 docker-compose.yml 中配置，可直接使用。

## 生产部署建议

### 安全配置

1. **更改默认密码**
   ```yaml
   # docker-compose.yml
   MYSQL_ROOT_PASSWORD: your_strong_password
   MYSQL_PASSWORD: your_trading_password
   JWT_SECRET: your_very_long_random_secret
   ```

2. **启用 HTTPS**
   ```bash
   # 获取 SSL 证书（使用 Let's Encrypt）
   certbot certonly --standalone -d yourdomain.com
   ```

3. **配置防火墙**
   ```bash
   # 只允许必要的端口
   ufw allow 80    # HTTP
   ufw allow 443   # HTTPS
   ufw allow 22    # SSH
   ```

### 监控与日志

```bash
# 使用 ELK Stack 进行日志管理
# 使用 Prometheus + Grafana 进行监控
# 查看官方文档了解配置方法
```

## 升级指南

### 更新代码
```bash
git pull origin main

# 重新构建镜像
docker-compose build --no-cache

# 重启服务
docker-compose up -d
```

### 数据库迁移
```bash
# 备份现有数据
docker-compose exec -T mysql mysqldump -u trading_user -p trading_platform > backup_v1.sql

# 更新数据库架构
docker-compose exec backend npm run migrate
```

## 常见问题 FAQ

### Q: 如何修改初始余额？
A: 编辑 `backend/sql/init.sql`，修改 `wallets` 表中的 `balance` 值。

### Q: 如何添加新的交易品种？
A: 在 `backend/src/routes/market.js` 中的 `SYMBOLS` 数组中添加新品种。

### Q: 如何修改 VIP 等级权限？
A: 编辑后端配置文件中的权限设置。

### Q: 平台是否安全用于生产？
A: 这是一个演示项目。生产环境需要额外的安全措施（HTTPS、防火墙、DDoS 防护等）。

### Q: 如何导出数据？
A: 使用 `mysqldump` 导出 SQL 或使用管理界面的导出功能。

## 获取帮助

- 📚 **文档**: 查看项目中的 README.md 和 DEPLOYMENT.md
- 🐛 **问题**: 在 [GitHub Issues](https://github.com/2826ggg/2826116778/issues) 上报告问题
- 💬 **讨论**: 在 [GitHub Discussions](https://github.com/2826ggg/2826116778/discussions) 上讨论
- 📧 **邮件**: 发送到 support@trading.local

## 许可证

MIT License - 详见 LICENSE 文件

---

**祝你使用愉快！如果有帮助，请给个 Star ⭐**
