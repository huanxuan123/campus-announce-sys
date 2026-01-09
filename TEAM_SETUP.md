# 团队成员快速开始指南

## 🎯 重要：每个人都需要初始化数据库！

**是的，每个人克隆项目后都需要在自己的MySQL中初始化数据库！**

## 📋 完整的克隆和设置流程

### 步骤1：克隆项目

```bash
git clone https://github.com/huanxuan123/campus-announce-sys.git
cd campus-announce-sys
```

### 步骤2：初始化数据库（必需！）

每个人都需要在自己的MySQL中创建数据库：

**方法1：使用批处理文件（推荐）**
```bash
# 双击运行
init_database.bat

# 或在命令行运行
init_database.bat
```

**方法2：手动执行SQL**
```bash
# 1. 创建数据库
mysql -u root -p -e "CREATE DATABASE campus_announce DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. 执行初始化脚本
mysql -u root -p campus_announce < init_database_en.sql
```

**方法3：从备份文件导入（快速）**
```bash
# 如果项目负责人已经导出数据库并分享了备份文件
.\import_database.bat
# 选择选项2：从备份文件导入
```

**验证数据库是否创建成功：**
```bash
mysql -u root -p campus_announce -e "SHOW TABLES;"
```

应该看到6张表：
- sys_department
- sys_user
- sys_announcement
- sys_attachment
- sys_announcement_read
- sys_config

### 步骤3：配置数据库连接

```bash
# 1. 复制配置文件模板
copy src\main\resources\jdbc.properties.example src\main\resources\jdbc.properties

# 2. 编辑jdbc.properties，修改数据库密码
# 使用文本编辑器打开 src\main\resources\jdbc.properties
# 修改：jdbc.password=你的MySQL root密码
```

### 步骤4：在IDEA中打开项目

1. 打开IntelliJ IDEA
2. File → Open
3. 选择：`campus-announce-sys`目录
4. 等待Maven依赖下载完成（右下角进度条）

### 步骤5：配置数据库连接（可选，但推荐）

在IDEA中配置数据库连接可以方便查看和管理数据：

1. View → Tool Windows → Database（或按Alt+1）
2. 点击"+" → Data Source → MySQL
3. 填写连接信息：
   - Host: localhost
   - Port: 3306
   - Database: campus_announce
   - User: root
   - Password: 你的MySQL密码
4. 点击"Test Connection"测试连接
5. 点击"OK"保存

### 步骤6：配置Tomcat并运行

1. Run → Edit Configurations
2. 点击"+" → Tomcat Server → Local
3. 配置Tomcat：
   - Name: Tomcat 9.0.x
   - Tomcat Home: 选择Tomcat安装目录
4. Deployment tab：
   - 点击"+" → Artifact
   - 选择：campus-announce-sys:war exploded
   - Application context: /campus-announce-sys
5. 点击绿色三角形"Run"按钮
6. 浏览器自动打开：http://localhost:8080/campus-announce-sys/

## 🤔 为什么每个人都需要初始化数据库？

### 原因1：数据库不在Git仓库中

Git仓库只包含：
✅ 源代码（.java文件）
✅ 配置文件（.xml文件）
✅ SQL脚本（init.sql, init_database_en.sql）
✅ 前端页面（.jsp文件）
✅ Maven配置（pom.xml）

Git仓库不包含：
❌ 数据库数据（campus_announce数据库）
❌ 编译后的文件（target目录）
❌ IDE配置（.idea目录）
❌ 数据库密码（jdbc.properties）

### 原因2：每个人都有自己的MySQL

- 每个开发者的电脑都有自己的MySQL服务器
- 数据库是本地的，不是共享的
- 每个人都需要在自己的MySQL中创建数据库

### 原因3：数据库太大且包含敏感信息

- 数据库包含用户数据、公告数据等
- 不适合放在Git仓库中
- 每个人需要自己的测试数据

## 📊 项目结构说明

### Git仓库（共享的）
```
campus-announce-sys/
├── src/main/
│   ├── java/              # 源代码
│   ├── resources/         # 配置文件和SQL脚本
│   │   ├── mapper/       # MyBatis映射文件
│   │   ├── sql/          # SQL初始化脚本
│   │   └── jdbc.properties.example  # 数据库配置模板
│   └── webapp/          # 前端页面
├── pom.xml              # Maven配置
├── README.md            # 项目说明
├── TASKS.md            # 开发任务清单
└── DEPLOYMENT.md       # 部署指南
```

### 本地环境（每个人自己的）
```
MySQL数据库（本地）
├── campus_announce
│   ├── sys_department
│   ├── sys_user
│   ├── sys_announcement
│   ├── sys_attachment
│   ├── sys_announcement_read
│   └── sys_config

IDEA配置（本地）
├── .idea/
└── target/              # 编译后的文件
```

## 🔐 默认测试账号

数据库初始化成功后，可以使用以下账号登录：

| 用户类型 | 用户名 | 密码 | 说明 |
|---------|--------|------|------|
| 超级管理员 | admin | 123456 | 可以管理所有院系和用户 |
| 院系管理员 | cs_admin | 123456 | 管理计算机学院的公告 |
| 教师 | teacher1 | 123456 | 可以发布和查看公告 |
| 学生 | student1 | 123456 | 可以查看公告 |

## 🚀 快速检查清单

克隆项目后，按照以下清单检查：

- [ ] Git克隆成功
- [ ] MySQL服务正在运行
- [ ] 数据库campus_announce已创建
- [ ] 6张表已创建
- [ ] jdbc.properties已配置（密码已修改）
- [ ] IDEA中项目已打开
- [ ] Maven依赖已下载完成
- [ ] Tomcat已配置
- [ ] 项目可以成功运行
- [ ] 浏览器可以访问http://localhost:8080/campus-announce-sys/

## 🐛 常见问题

### Q1: 执行SQL脚本时提示"Access denied"

**原因**：MySQL密码错误

**解决**：
- 检查MySQL root密码是否正确
- 确保MySQL服务正在运行

### Q2: 执行SQL脚本时提示"Unknown database"

**原因**：数据库campus_announce不存在

**解决**：
- 先执行创建数据库的命令
- 再执行初始化脚本

### Q3: IDEA中连接数据库失败

**原因**：驱动未下载或连接信息错误

**解决**：
- 点击"Download missing driver files"
- 检查Host、Port、Database、User、Password是否正确

### Q4: 运行项目时提示"Database connection failed"

**原因**：jdbc.properties配置错误

**解决**：
- 检查jdbc.properties中的密码是否正确
- 检查MySQL服务是否正在运行
- 检查数据库名是否为campus_announce

### Q5: 浏览器访问显示404

**原因**：Tomcat未正确部署或URL错误

**解决**：
- 检查WAR文件是否部署到webapps目录
- 检查URL是否为http://localhost:8080/campus-announce-sys/
- 注意大小写

## 📝 开发工作流

### 日常开发流程

```bash
# 1. 每天开始工作前
git checkout dev
git pull origin dev
git checkout feature/your-module
git merge dev

# 2. 开发功能...
# ...编写代码...

# 3. 测试功能
# 在IDEA中运行项目并测试

# 4. 提交代码
git add .
git commit -m "feat: 实现xxx功能"

# 5. 推送到远程
git push origin feature-your-module

# 6. 在GitHub上创建Pull Request到dev分支
```

### 定期同步代码

- **每天开始工作前**：从dev分支拉取最新代码
- **完成功能后**：推送到自己的功能分支
- **代码审查**：在GitHub上创建PR
- **合并后**：从dev分支合并到自己的功能分支

## 📚 相关文档

- [README.md](README.md) - 项目说明
- [DEPLOYMENT.md](DEPLOYMENT.md) - 部署指南
- [TASKS.md](TASKS.md) - 开发任务清单
- [GITHUB_GUIDE.md](GITHUB_GUIDE.md) - GitHub协作指南

## 🎯 开始开发吧！

按照以上步骤完成设置后，你就可以开始开发了！

参考[TASKS.md](TASKS.md)中的任务清单，开始实现你的功能模块。

祝开发顺利！🚀