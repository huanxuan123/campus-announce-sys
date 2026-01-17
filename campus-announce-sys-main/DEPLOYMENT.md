# Web应用部署指南

## 前提条件

1. ✅ Java JDK 11+（已安装：11.0.12）
2. ✅ Maven 3.9.8（已安装）
3. ✅ MySQL 8.0（已安装）
4. ✅ 项目已编译成功（campus-announce-sys.war已生成）
5. ❌ Tomcat服务器（需要安装）

## 安装Tomcat

### 方法1：下载并安装Tomcat（推荐）

1. **下载Tomcat**：
   - 访问：https://tomcat.apache.org/download-90.cgi
   - 下载：Tomcat 9.0.x（Core版本）
   - 选择：64-bit Windows zip

2. **解压Tomcat**：
   - 解压到：`I:\apache-tomcat-9.0.x`
   - 或者：`C:\apache-tomcat-9.0.x`

3. **配置环境变量（可选）**：
   - 右键"此电脑" → "属性"
   - "高级系统设置" → "环境变量"
   - 新建系统变量：
     - 变量名：`CATALINA_HOME`
     - 变量值：`I:\apache-tomcat-9.0.x`
   - 编辑Path变量，添加：`%CATALINA_HOME%\bin`

### 方法2：使用IDE内置Tomcat

如果你使用IntelliJ IDEA或Eclipse，可以直接使用内置的Tomcat：

**IntelliJ IDEA**：
1. File → Settings → Build, Execution, Deployment → Application Servers
2. 点击"+" → Tomcat Server
3. 选择Tomcat安装目录
4. 配置Deployment：
   - Run → Edit Configurations
   - 点击"+" → Artifact
   - 选择war exploded

**Eclipse**：
1. Window → Preferences → Server → Runtime Environments
2. 点击"Add" → Apache Tomcat
3. 选择Tomcat安装目录
4. 右键项目 → Run As → Run on Server

## 部署项目

### 方法1：手动部署（使用外部Tomcat）

1. **复制WAR文件**：
   ```bash
   copy target\campus-announce-sys.war I:\apache-tomcat-9.0.x\webapps\
   ```

2. **启动Tomcat**：
   ```bash
   # Windows
   I:\apache-tomcat-9.0.x\bin\startup.bat

   # 或者双击
   I:\apache-tomcat-9.0.x\bin\startup.bat
   ```

3. **访问应用**：
   - 打开浏览器访问：http://localhost:8080/campus-announce-sys/

4. **停止Tomcat**：
   ```bash
   I:\apache-tomcat-9.0.x\bin\shutdown.bat
   ```

### 方法2：使用Maven插件部署

1. **配置Tomcat Manager**：
   - 编辑：`I:\apache-tomcat-9.0.x\conf\tomcat-users.xml`
   - 添加：
     ```xml
     <role rolename="manager-gui"/>
     <role rolename="manager-script"/>
     <user username="admin" password="admin" roles="manager-gui,manager-script"/>
     ```

2. **修改pom.xml**：
   ```xml
   <plugin>
       <groupId>org.apache.tomcat.maven</groupId>
       <artifactId>tomcat7-maven-plugin</artifactId>
       <version>2.2</version>
   </plugin>
   ```

3. **部署**：
   ```bash
   mvn tomcat7:deploy
   ```

### 方法3：使用IDE部署（推荐开发时使用）

**IntelliJ IDEA**：
1. Run → Edit Configurations
2. 点击"+" → Tomcat Server → Local
3. 配置：
   - Name：Tomcat 9.0.x
   - Tomcat Home：选择Tomcat安装目录
   - Deployment tab：点击"+" → Artifact
   - 选择：campus-announce-sys:war exploded
4. 点击"Run"按钮（绿色三角形）

**Eclipse**：
1. 右键项目 → Run As → Run on Server
2. 选择Tomcat服务器
3. 点击"Finish"

## 访问应用

### 本地访问

部署成功后，在浏览器中访问：

```
http://localhost:8080/campus-announce-sys/
```

### 默认登录账号

- 超级管理员：admin / 123456
- 院系管理员：cs_admin / 123456
- 教师：teacher1 / 123456
- 学生：student1 / 123456

## 常见问题

### 1. 端口被占用

如果8080端口被占用，修改端口：

编辑：`I:\apache-tomcat-9.0.x\conf\server.xml`

找到：
```xml
<Connector port="8080" protocol="HTTP/1.1"
```

改为：
```xml
<Connector port="8081" protocol="HTTP/1.1"
```

访问时使用：http://localhost:8081/campus-announce-sys/

### 2. 数据库连接失败

检查：
- MySQL服务是否启动
- jdbc.properties中的密码是否正确
- 数据库campus_announce是否存在

### 3. 404错误

检查：
- WAR文件是否正确部署到webapps目录
- 访问路径是否正确（注意大小写）

### 4. 500错误

查看日志：
- `I:\apache-tomcat-9.0.x\logs\catalina.out`
- `I:\apache-tomcat-9.0.x\logs\localhost.log`

## 快速开始（推荐流程）

### 最简单的方式（使用IntelliJ IDEA）

1. 下载并安装IntelliJ IDEA（Community版免费）
2. 打开项目：File → Open → 选择campus-announce-sys目录
3. 配置Tomcat：
   - Run → Edit Configurations
   - 点击"+" → Tomcat Server → Local
   - 选择Tomcat安装目录
4. 部署：
   - Deployment tab → 点击"+" → Artifact
   - 选择war exploded
5. 点击"Run"按钮
6. 浏览器自动打开：http://localhost:8080/campus-announce-sys/

### 最简单的方式（使用外部Tomcat）

1. 下载并解压Tomcat到I:\apache-tomcat-9.0.x
2. 复制WAR文件：
   ```bash
   copy target\campus-announce-sys.war I:\apache-tomcat-9.0.x\webapps\
   ```
3. 启动Tomcat：
   ```bash
   I:\apache-tomcat-9.0.x\bin\startup.bat
   ```
4. 浏览器访问：http://localhost:8080/campus-announce-sys/

## 生产环境部署

生产环境部署时，建议：

1. 使用Nginx作为反向代理
2. 配置HTTPS证书
3. 修改Tomcat端口为非标准端口
4. 配置防火墙规则
5. 定期备份数据库
6. 使用专业的部署工具（Jenkins、Docker等）

## 监控和日志

### 查看Tomcat日志

```bash
# 实时查看
tail -f I:\apache-tomcat-9.0.x\logs\catalina.out

# Windows PowerShell
Get-Content I:\apache-tomcat-9.0.x\logs\catalina.out -Wait -Tail 50
```

### 查看应用日志

应用日志位置：
- `I:\apache-tomcat-9.0.x\logs\campus-announce-sys.log`

## 性能优化

### JVM参数优化

编辑：`I:\apache-tomcat-9.0.x\bin\setenv.bat`

添加：
```bash
set CATALINA_OPTS=%CATALINA_OPTS% -Xms512m -Xmx1024m -XX:PermSize=256m -XX:MaxPermSize=512m
```

### 连接池优化

已配置Druid连接池，参数在jdbc.properties中：
- initialSize: 5
- maxActive: 20
- maxWait: 60000ms

根据实际情况调整这些参数。

## 安全建议

1. 修改默认密码
2. 删除或禁用Tomcat Manager应用
3. 配置防火墙规则
4. 定期更新依赖版本
5. 使用HTTPS
6. 实施SQL注入防护（MyBatis已支持）
7. 实施XSS防护

## 下一步

部署成功后，可以开始：

1. 开发各个功能模块（参考TASKS.md）
2. 测试用户登录
3. 测试公告发布
4. 测试公告查询
5. 测试公告统计

祝部署顺利！🚀