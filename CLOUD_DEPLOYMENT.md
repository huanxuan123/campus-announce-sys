# 部署到云端指南

## 🚀 将校园公告系统部署到云端，让用户可以直接访问

## 方案对比

| 方案 | 难度 | 成本 | 适用场景 | 推荐度 |
|-----|-------|------|---------|--------|
| 云服务器（阿里云/腾讯云） | 中 | ¥100-1000/年 | 生产环境 | ⭐⭐⭐⭐⭐⭐ |
| Render/Railway | 低 | 免费 | 开发测试 | ⭐⭐⭐⭐⭐ |
| Heroku | 低 | 有免费层 | 开发测试 | ⭐⭐⭐⭐ |
| GitHub Pages | 低 | 免费 | 静态展示 | ⭐ |

## 方案1：部署到Render（推荐，免费）

### 步骤1：准备项目

1. **修改数据库配置为环境变量**：
   编辑 `src/main/resources/applicationContext.xml`：

   ```xml
   <!-- 原来的配置 -->
   <property name="url" value="${jdbc.url}"/>
   <property name="username" value="${jdbc.username}"/>
   <property name="password" value="${jdbc.password}"/>

   <!-- 改为环境变量 -->
   <property name="url" value="${JDBC_URL}"/>
   <property name="username" value="${JDBC_USERNAME}"/>
   <property name="password" value="${JDBC_PASSWORD}"/>
   ```

2. **创建Dockerfile**（可选，但推荐）：
   在项目根目录创建 `Dockerfile`：

   ```dockerfile
   FROM tomcat:9.0-jdk11
   COPY target/campus-announce-sys.war /usr/local/tomcat/webapps/
   EXPOSE 8080
   CMD ["catalina.sh", "run"]
   ```

### 步骤2：注册Render账号

1. 访问：https://render.com/
2. 使用GitHub账号登录
3. 点击"New +"

### 步骤3：创建Web Service

1. **选择"Web Service"**
2. **连接GitHub仓库**：
   - 选择：`huanxuan123/campus-announce-sys`
   - 分支：`main`

3. **配置构建和部署**：
   ```
   Build Command: mvn clean package -DskipTests
   Publish Directory: target
   Publish File: campus-announce-sys.war
   Runtime: Docker
   Dockerfile Path: ./Dockerfile
   ```

4. **配置环境变量**：
   ```
   JDBC_URL: jdbc:mysql://your-database-host:3306/campus_announce?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
   JDBC_USERNAME: your_db_username
   JDBC_PASSWORD: your_db_password
   ```

5. **点击"Create Web Service"**

### 步骤4：配置数据库

Render提供免费PostgreSQL，但你需要MySQL：

**选项A：使用Render的PostgreSQL**
- 优点：免费、自动管理
- 缺点：需要修改SQL脚本（PostgreSQL语法略有不同）

**选项B：使用外部MySQL**
- 推荐使用：PlanetScale（免费层）
- 或者：Railway MySQL（免费层）

### 步骤5：访问应用

部署完成后，Render会提供一个URL：
```
https://campus-announce-sys.onrender.com
```

## 方案2：部署到Railway（免费）

### 步骤1：注册Railway

1. 访问：https://railway.app/
2. 使用GitHub账号登录

### 步骤2：创建项目

1. 点击"New Project"
2. 选择"Deploy from GitHub repo"
3. 选择：`huanxuan123/campus-announce-sys`

### 步骤3：配置

1. **添加MySQL数据库**：
   - 点击"+ New Database"
   - 选择：MySQL
   - Railway会自动创建

2. **配置环境变量**：
   ```
   JDBC_URL: jdbc:mysql://mysql.railway.app:3306/railway
   JDBC_USERNAME: root
   JDBC_PASSWORD: [自动生成的密码]
   ```

3. **配置部署**：
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -jar target/campus-announce-sys.war`

### 步骤4：访问应用

Railway会提供URL：
```
https://campus-announce-sys.up.railway.app
```

## 方案3：部署到云服务器（阿里云/腾讯云）

### 步骤1：购买服务器

**学生优惠**：
- 阿里云：https://www.aliyun.com/daily-act/act/student/individual
- 腾讯云：https://cloud.tencent.com/act/campus

**推荐配置**：
- CPU: 2核
- 内存: 4GB
- 系统: CentOS 7.9 或 Ubuntu 20.04
- 价格: 约 ¥100-200/年（学生价）

### 步骤2：安装环境

```bash
# 1. 安装JDK 11
yum install java-11-openjdk

# 2. 安装Tomcat 9
wget https://archive.apache.org/dist/tomcat/tomcat-9/v9.0.x/bin/apache-tomcat-9.0.x.tar.gz
tar -xzf apache-tomcat-9.0.x.tar.gz
mv apache-tomcat-9.0.x /opt/tomcat

# 3. 安装MySQL
yum install mysql-server
systemctl start mysqld
mysql_secure_installation

# 4. 创建数据库
mysql -u root -p < init_database_en.sql
```

### 步骤3：上传WAR文件

```bash
# 使用SCP上传
scp target/campus-announce-sys.war root@your-server:/opt/tomcat/webapps/

# 或使用FTP工具（FileZilla等）
```

### 步骤4：配置防火墙

```bash
# 开放8080端口
firewall-cmd --permanent --add-port=8080/tcp
firewall-cmd --reload
```

### 步骤5：访问应用

```
http://your-server-ip:8080/campus-announce-sys/
```

### 步骤6：配置域名（可选）

1. 购买域名（阿里云/腾讯云）
2. 配置DNS解析
3. 配置Tomcat的server.xml
4. 申请SSL证书（Let's Encrypt免费）

## 方案4：GitHub Pages（仅静态展示）

⚠️ **注意**：GitHub Pages只能托管静态HTML/CSS/JS，不能运行Java Web应用。

### 适用场景

- ✅ 项目介绍页面
- ✅ 功能截图展示
- ✅ 使用文档
- ❌ 不能运行实际应用
- ❌ 不能连接数据库
- ❌ 不能实现登录功能

### 如果只是想展示项目

创建一个简单的静态页面：

```html
<!DOCTYPE html>
<html>
<head>
    <title>校园公告发布系统</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .feature { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
        .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>校园公告发布系统</h1>
    <p>基于SSM框架开发的校园公告管理系统</p>

    <div class="feature">
        <h3>功能特性</h3>
        <ul>
            <li>用户管理（超级管理员、院系管理员、教师、学生）</li>
            <li>公告发布（支持附件、置顶、定时发布）</li>
            <li>公告查询（多条件筛选、分页）</li>
            <li>数据统计（按类型、院系、时间段统计）</li>
        </ul>
    </div>

    <div class="feature">
        <h3>技术栈</h3>
        <ul>
            <li>Spring 5.3.20</li>
            <li>SpringMVC</li>
            <li>MyBatis 3.5.10</li>
            <li>MySQL 8.0</li>
            <li>Druid连接池</li>
        </ul>
    </div>

    <div class="feature">
        <h3>项目地址</h3>
        <p><a href="https://github.com/huanxuan123/campus-announce-sys" class="btn">查看源码</a></p>
    </div>
</body>
</html>
```

保存为 `docs/index.html`，推送到GitHub，GitHub Pages会自动部署。

## 🎯 推荐方案总结

### 如果你想让用户实际使用：

**推荐顺序**：
1. **开发测试**：Render（免费）→ Railway（免费）
2. **生产环境**：阿里云/腾讯云（学生优惠）

### 如果你只是想展示项目：

**使用GitHub Pages**：
- 创建静态介绍页面
- 展示项目截图
- 提供GitHub链接

## 📋 部署检查清单

### Render/Railway部署：
- [ ] 项目已推送到GitHub
- [ ] Dockerfile已创建
- [ ] 环境变量已配置
- [ ] 数据库已创建
- [ ] 部署成功
- [ ] 可以访问应用URL

### 云服务器部署：
- [ ] 服务器已购买
- [ ] JDK已安装
- [ ] Tomcat已安装
- [ ] MySQL已安装
- [ ] 数据库已初始化
- [ ] WAR文件已上传
- [ ] 防火墙已配置
- [ ] 可以通过IP访问
- [ ] 域名已配置（可选）

## 🔗 相关链接

- Render: https://render.com/
- Railway: https://railway.app/
- 阿里云学生优惠: https://www.aliyun.com/daily-act/act/student/individual
- 腾讯云学生优惠: https://cloud.tencent.com/act/campus
- GitHub Pages文档: https://docs.github.com/en/pages

## 💡 下一步

选择一个方案后，我可以帮你：

1. 创建Dockerfile
2. 修改配置文件
3. 创建部署脚本
4. 配置CI/CD自动化部署

选择哪个方案？告诉我，我马上帮你实现！🚀