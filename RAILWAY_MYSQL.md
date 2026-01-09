# Railway MySQL配置指南

## 🚀 在Railway上创建免费MySQL数据库

## 前提条件

✅ Railway账号（免费）
✅ GitHub账号

## 步骤1：注册Railway账号

1. 访问：https://railway.app/
2. 点击右上角"Login"
3. 选择使用GitHub账号登录
4. 授权Railway访问你的GitHub
5. 完成注册

## 步骤2：创建MySQL数据库

1. **进入Dashboard**：
   - 登录后，你会看到Railway的Dashboard
   - 点击右上角"+ New Project"

2. **创建新项目**：
   - 点击"+ New Project"
   - 选择"Create from Scratch"
   - 项目名称：`campus-announce-db`
   - 点击"Create Project"

3. **添加MySQL数据库**：
   - 在项目中，点击"+ New Service"
   - 搜索"MySQL"
   - 选择"MySQL"（官方插件）
   - 点击"Add MySQL"

4. **等待创建完成**：
   - Railway会自动创建MySQL数据库
   - 通常需要30-60秒
   - 创建完成后会显示数据库图标

## 步骤3：获取数据库连接信息

1. **打开MySQL服务**：
   - 在Dashboard中，点击刚创建的MySQL服务
   - 你会看到数据库的详细信息

2. **查看连接信息**：
   - 在MySQL服务页面，找到以下信息：
     - **Host**：类似 `containers-us-west-1.railway.app`
     - **Port**：`3306`
     - **Database**：`railway`（默认数据库名）
     - **Username**：`root`（默认用户名）
     - **Password**：点击"Show"显示密码

3. **复制连接信息**：
   - 点击"Connect"按钮
   - 选择"MySQL CLI"或"Connection URL"
   - 复制连接字符串

4. **示例连接字符串**：
   ```
   mysql://root:password@containers-us-west-1.railway.app:3306/railway
   ```

## 步骤4：初始化数据库

### 方法1：使用Railway内置终端（推荐）

1. **打开MySQL服务**
2. **点击"Console"标签**
3. **点击"MySQL CLI"**
4. **在终端中执行**：
   ```sql
   -- 创建数据库campus_announce
   CREATE DATABASE IF NOT EXISTS campus_announce DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

   -- 使用campus_announce数据库
   USE campus_announce;

   -- 执行初始化脚本
   -- 复制项目中的init_database_en.sql内容，粘贴到这里执行
   ```

### 方法2：使用本地MySQL客户端

1. **使用Railway提供的连接信息**：
   ```bash
   mysql -h containers-us-west-1.railway.app -P 3306 -u root -p railway < init_database_en.sql
   ```

2. **或者使用MySQL Workbench**：
   - Host: `containers-us-west-1.railway.app`
   - Port: `3306`
   - Username: `root`
   - Password: [Railway显示的密码]
   - Database: `railway`
   - 执行init_database_en.sql

### 方法3：使用项目中的SQL脚本

1. **修改init_database_en.sql**：
   - 在文件开头添加：
     ```sql
     USE campus_announce;
     ```

2. **在Railway Console中执行**：
   - 打开MySQL服务的Console标签
   - 点击"MySQL CLI"
   - 复制修改后的SQL内容
   - 粘贴到终端中执行

## 步骤5：配置到Render

### 1. 打开Render的Web Service配置

1. 登录Render
2. 打开campus-announce-sys服务
3. 点击"Environment"标签

### 2. 添加环境变量

添加以下环境变量：

```bash
# 数据库连接
JDBC_URL=jdbc:mysql://containers-us-west-1.railway.app:3306/campus_announce?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
JDBC_USERNAME=root
JDBC_PASSWORD=your_railway_mysql_password
JDBC_DRIVER=com.mysql.cj.jdbc.Driver

# Druid连接池配置
druid.initialSize=5
druid.minIdle=5
druid.maxActive=20
druid.maxWait=60000
```

**重要**：
- `containers-us-west-1.railway.app` 替换为实际的Host
- `your_railway_mysql_password` 替换为Railway显示的密码
- `campus_announce` 是你创建的数据库名

### 3. 验证配置

1. **检查环境变量**：
   - 确认所有变量都已添加
   - 确认密码正确

2. **重新部署**：
   - 点击"Manual Deploy"
   - 或推送代码到GitHub触发自动部署

## 步骤6：测试数据库连接

### 1. 查看Render日志

1. 打开Web Service
2. 点击"Logs"标签
3. 查看是否有数据库连接错误

### 2. 测试登录

部署成功后，访问应用：
```
https://campus-announce-sys.onrender.com
```

使用默认账号登录：
- 超级管理员：admin / 123456
- 院系管理员：cs_admin / 123456
- 教师：teacher1 / 123456
- 学生：student1 / 123456

## 📊 Railway管理界面

### 查看数据库状态

1. **打开MySQL服务**
2. **查看Metrics标签**：
   - CPU使用率
   - 内存使用率
   - 磁盘使用率
   - 网络流量

### 查看连接数

1. **打开MySQL服务**
2. **查看Connections标签**：
   - 当前连接数
   - 活跃连接数
   - 连接历史

### 执行SQL查询

1. **打开MySQL服务**
2. **点击"Console"标签**
3. **点击"MySQL CLI"**
4. **执行SQL查询**：
   ```sql
   SHOW TABLES;
   SELECT * FROM sys_user;
   SELECT COUNT(*) FROM sys_announcement;
   ```

## 💾 备份数据库

### 自动备份

Railway提供自动备份功能：
1. 打开MySQL服务
2. 点击"Settings"标签
3. 找到"Backups"部分
4. 启用自动备份

### 手动备份

1. **使用mysqldump**：
   ```bash
   mysqldump -h containers-us-west-1.railway.app -u root -p campus_announce > backup.sql
   ```

2. **使用Railway Console**：
   - 打开MySQL CLI
   - 执行：
     ```sql
     -- 导出所有表
     -- 使用Railway的导出功能
     ```

## 🔐 安全配置

### 1. 修改默认密码

1. **打开MySQL服务**
2. **点击"Settings"标签**
3. 找到"Credentials"部分
4. 点击"Rotate Password"
5. 生成新密码
6. **重要**：更新Render的环境变量中的`JDBC_PASSWORD`

### 2. 限制访问IP（可选）

1. **打开MySQL服务**
2. **点击"Settings"标签**
3. 找到"Networking"部分
4. 添加允许访问的IP地址
5. **注意**：需要添加Render的IP地址

## 🐛 常见问题

### Q1: 无法连接到Railway MySQL

**原因**：防火墙或网络问题

**解决**：
1. 检查Render的环境变量是否正确
2. 检查Railway MySQL是否正在运行
3. 检查密码是否正确
4. 查看Render Logs的错误信息

### Q2: 数据库连接超时

**原因**：网络延迟或连接数过多

**解决**：
1. 增加Druid的maxWait值
2. 检查Railway的连接数限制
3. 优化SQL查询

### Q3: 数据库未初始化

**原因**：SQL脚本未执行

**解决**：
1. 打开Railway MySQL Console
2. 执行init_database_en.sql
3. 验证表是否创建：`SHOW TABLES;`

### Q4: 密码错误

**原因**：Render的环境变量密码与Railway不一致

**解决**：
1. 在Railway中复制正确的密码
2. 更新Render的JDBC_PASSWORD环境变量
3. 重新部署应用

### Q5: 数据库已满

**原因**：Railway免费层有存储限制

**解决**：
1. 清理旧数据
2. 升级到付费计划
3. 或者使用其他MySQL服务

## 📋 配置检查清单

### Railway配置：
- [ ] Railway账号已注册
- [ ] MySQL数据库已创建
- [ ] 数据库campus_announce已创建
- [ ] 初始化SQL脚本已执行
- [ ] 6张表已创建
- [ ] 测试数据已插入

### Render配置：
- [ ] JDBC_URL已配置
- [ ] JDBC_USERNAME已配置
- [ ] JDBC_PASSWORD已配置
- [ ] JDBC_DRIVER已配置
- [ ] 应用已重新部署
- [ ] 可以成功登录
- [ ] 数据库连接正常

## 💡 优化建议

### 1. 监控资源使用

定期查看Railway的Metrics：
- CPU使用率不应超过80%
- 内存使用率不应超过80%
- 磁盘使用率不应超过80%

### 2. 优化连接池

根据实际使用调整Druid参数：
- `druid.maxActive`：根据并发用户数调整
- `druid.minIdle`：保持最小空闲连接
- `druid.maxWait`：根据网络延迟调整

### 3. 定期备份

启用Railway的自动备份功能，防止数据丢失。

## 🔗 相关链接

- Railway官网：https://railway.app/
- Railway文档：https://docs.railway.app/
- Railway定价：https://railway.app/pricing
- MySQL文档：https://dev.mysql.com/doc/

## 📝 快速参考

### Railway MySQL连接信息格式

```
Host: containers-us-west-1.railway.app
Port: 3306
Database: railway
Username: root
Password: [在Railway中显示]
```

### Render环境变量格式

```bash
JDBC_URL=jdbc:mysql://[Host]:3306/[Database]?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
JDBC_USERNAME=[Username]
JDBC_PASSWORD=[Password]
JDBC_DRIVER=com.mysql.cj.jdbc.Driver
```

## 🎯 下一步

配置完成后：

1. **测试应用**：访问Render URL并登录
2. **测试功能**：发布公告、查询公告等
3. **监控日志**：查看Render Logs
4. **监控数据库**：查看Railway Metrics

## 🎉 完成！

你的Railway MySQL数据库已经配置完成，可以连接到Render应用了！

祝使用愉快！🚀