# Render部署指南

## 🚀 将校园公告系统部署到Render（完全免费）

## 前提条件

✅ GitHub账号
✅ 项目已推送到GitHub
✅ 项目包含Dockerfile
✅ Render账号（免费）

## 📋 部署步骤

### 步骤1：注册Render账号

1. 访问：https://render.com/
2. 点击右上角"Sign Up"
3. 选择使用GitHub账号登录
4. 授权GitHub访问权限
5. 完成注册

### 步骤2：创建Web Service

1. 登录Render后，点击右上角"+"
2. 选择"New Web Service"
3. **连接GitHub仓库**：
   - 点击"Connect GitHub"
   - 选择：`huanxuan123/campus-announce-sys`
   - 授权Render访问你的仓库

4. **配置基本信息**：
   - Name: `campus-announce-sys`
   - Region: `Oregon (US West)`（免费层）
   - Branch: `main`

5. **配置构建和部署**：
   ```
   Runtime: Docker
   Docker Context: /
   Dockerfile Path: ./Dockerfile
   Build Command: mvn clean package -DskipTests
   Publish Directory: (留空）
   ```

6. **点击"Advanced"**：
   - **Add Environment Variable**（添加环境变量）

### 步骤3：配置数据库

Render提供免费的PostgreSQL数据库，但你的项目使用MySQL。有两个选择：

#### 选项A：使用Render的PostgreSQL（推荐）

1. **创建PostgreSQL数据库**：
   - 回到Dashboard
   - 点击"+"
   - 选择"PostgreSQL"
   - Name: `campus-announce-db`
   - Region: `Oregon (US West)`
   - Database: `campus_announce`
   - User: `campus_announce_user`
   - 点击"Create Database"

2. **获取数据库连接信息**：
   - 创建完成后，点击数据库名称
   - 找到"External Connection"部分
   - 复制以下信息：
     - Host: `dpg-xxxxx.oregon-postgres.render.com`
     - Port: `5432`
     - Database: `campus_announce`
     - User: `campus_announce_user`
     - Password: 点击"Show"显示密码

3. **修改项目使用PostgreSQL**：
   - 需要修改JDBC驱动和连接字符串
   - 或者使用MySQL兼容模式

#### 选项B：使用Railway MySQL（推荐）

详细步骤请查看：[RAILWAY_MYSQL.md](RAILWAY_MYSQL.md)

**快速步骤**：

1. **创建Railway账号**：
   - 访问：https://railway.app/
   - 使用GitHub账号登录

2. **创建MySQL数据库**：
   - 点击"+ New Project"
   - 选择"Create from Scratch"
   - 点击"+ New Service"
   - 搜索"MySQL"
   - 选择"MySQL"并添加

3. **初始化数据库**：
   - 打开MySQL服务的Console标签
   - 点击"MySQL CLI"
   - 执行init_database_en.sql中的SQL语句

4. **获取连接信息**：
   - Host: `containers-us-west-1.railway.app`
   - Port: `3306`
   - Database: `railway`（或你创建的数据库名）
   - Username: `root`
   - Password: 点击"Show"显示密码

### 步骤4：配置环境变量

回到Web Service配置页面，添加以下环境变量：

```bash
# 数据库连接
JDBC_URL=jdbc:mysql://your-mysql-host:3306/campus_announce?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
JDBC_USERNAME=your_db_username
JDBC_PASSWORD=your_db_password
JDBC_DRIVER=com.mysql.cj.jdbc.Driver

# Druid连接池配置（可选）
druid.initialSize=5
druid.minIdle=5
druid.maxActive=20
druid.maxWait=60000
```

**重要**：
- `JDBC_URL`中的`your-mysql-host`替换为实际的数据库主机
- `JDBC_USERNAME`替换为数据库用户名
- `JDBC_PASSWORD`替换为数据库密码

### 步骤5：部署应用

1. **检查配置**：
   - 确认所有环境变量已添加
   - 确认数据库连接信息正确

2. **点击"Create Web Service"**：
   - Render会自动构建Docker镜像
   - 构建过程需要5-10分钟
   - 可以在"Events"标签查看进度

3. **等待部署完成**：
   - 状态变为"Live"表示部署成功
   - Render会提供一个URL

### 步骤6：访问应用

部署成功后，Render会提供一个URL：
```
https://campus-announce-sys.onrender.com
```

在浏览器中访问这个URL，应该能看到登录页面。

## 🔐 默认登录账号

使用以下账号登录：
- 超级管理员：admin / 123456
- 院系管理员：cs_admin / 123456
- 教师：teacher1 / 123456
- 学生：student1 / 123456

## 📊 监控和日志

### 查看部署日志

1. 打开Web Service
2. 点击"Logs"标签
3. 可以查看：
   - 构建日志
   - 应用日志
   - 错误信息

### 查看指标

1. 打开Web Service
2. 点击"Metrics"标签
3. 可以查看：
   - CPU使用率
   - 内存使用率
   - 响应时间
   - 请求数量

## 🔄 自动部署

配置完成后，每次推送代码到GitHub的main分支，Render会自动重新部署：

```bash
# 修改代码后
git add .
git commit -m "feat: xxx功能"
git push origin main

# Render会自动检测到推送并重新部署
```

## 🐛 常见问题

### Q1: 构建失败 - "Maven not found"

**原因**：Dockerfile中没有安装Maven

**解决**：Dockerfile已经配置了Tomcat镜像，Maven在构建阶段运行

### Q2: 数据库连接失败

**原因**：环境变量配置错误

**解决**：
1. 检查JDBC_URL是否正确
2. 检查JDBC_USERNAME和JDBC_PASSWORD是否正确
3. 检查数据库是否允许远程连接
4. 查看Logs标签的错误信息

### Q3: 访问显示404

**原因**：应用未正确部署或URL错误

**解决**：
1. 等待部署完成（状态为"Live"）
2. 检查URL是否正确
3. 查看Logs标签的错误信息

### Q4: 应用启动失败

**原因**：配置文件错误或依赖问题

**解决**：
1. 查看Logs标签的详细错误
2. 检查applicationContext-render.xml配置
3. 检查Dockerfile是否正确

### Q5: PostgreSQL语法错误

**原因**：使用了MySQL的SQL语法

**解决**：
- 修改SQL脚本为PostgreSQL兼容语法
- 或者使用外部MySQL数据库

## 📋 部署检查清单

- [ ] Render账号已注册
- [ ] GitHub仓库已连接
- [ ] Web Service已创建
- [ ] 数据库已创建（PostgreSQL或MySQL）
- [ ] 环境变量已配置
- - [ ] JDBC_URL
  - [ ] JDBC_USERNAME
  - [ ] JDBC_PASSWORD
  - [ ] JDBC_DRIVER
- [ ] 部署状态为"Live"
- [ ] 可以通过URL访问应用
- [ ] 登录功能正常
- [ ] 数据库连接正常

## 💡 优化建议

### 1. 使用CDN加速

Render自动提供CDN，无需额外配置。

### 2. 启用缓存

在applicationContext-render.xml中配置Spring缓存：

```xml
<cache:annotation-driven/>
```

### 3. 优化数据库连接

根据实际使用情况调整Druid参数：
- `druid.maxActive`：最大连接数
- `druid.minIdle`：最小空闲连接
- `druid.maxWait`：最大等待时间

### 4. 监控资源使用

定期查看Metrics标签：
- CPU使用率不应超过80%
- 内存使用率不应超过80%
- 响应时间应小于500ms

## 🔗 相关链接

- Render官网：https://render.com/
- Render文档：https://render.com/docs
- Render定价：https://render.com/pricing
- PlanetScale（免费MySQL）：https://planetscale.com/
- Railway（免费MySQL）：https://railway.app/

## 📝 项目文件说明

部署相关的文件：

- `Dockerfile` - Docker镜像配置
- `render.yaml` - Render部署配置（可选）
- `applicationContext-render.xml` - Render专用配置文件
- `CLOUD_DEPLOYMENT.md` - 云端部署总指南

## 🎯 下一步

部署成功后，你可以：

1. **测试所有功能**：
   - 用户登录
   - 公告发布
   - 公告查询
   - 数据统计

2. **分享给团队**：
   - 将Render URL发送给团队成员
   - 团队成员可以直接访问和测试

3. **继续开发**：
   - 在本地开发新功能
   - 推送到GitHub
   - Render自动部署

4. **配置自定义域名**（可选）：
   - 在Render中添加自定义域名
   - 配置DNS解析

## 🎉 恭喜！

你的校园公告系统现在已经部署到云端，任何人都可以通过URL访问！

祝使用愉快！🚀