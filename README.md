# 校园公告发布系统

基于SSM（Spring + SpringMVC + MyBatis）框架开发的校园公告发布系统，支持公告的精准推送和便捷查询。

## 技术栈

- **后端框架**: Spring 5.3.20, SpringMVC, MyBatis 3.5.10
- **数据库**: MySQL 8.0
- **连接池**: Druid 1.2.11
- **前端**: JSP + JSTL
- **构建工具**: Maven

## 项目结构

```
campus-announce-sys/
├── src/
│   ├── main/
│   │   ├── java/com/campus/announce/
│   │   │   ├── common/              # 公共类
│   │   │   │   └── Result.java      # 统一返回结果
│   │   │   ├── entity/              # 实体类
│   │   │   │   ├── User.java
│   │   │   │   ├── Announcement.java
│   │   │   │   ├── Department.java
│   │   │   │   └── Attachment.java
│   │   │   ├── mapper/              # Mapper接口
│   │   │   │   ├── user/           # 用户模块Mapper
│   │   │   │   ├── announcement/    # 公告发布模块Mapper
│   │   │   │   ├── query/          # 公告查询模块Mapper
│   │   │   │   └── statistics/     # 公告统计模块Mapper
│   │   │   ├── service/            # Service层（待实现）
│   │   │   │   ├── user/
│   │   │   │   ├── announcement/
│   │   │   │   ├── query/
│   │   │   │   └── statistics/
│   │   │   ├── controller/          # Controller层（待实现）
│   │   │   │   ├── user/
│   │   │   │   ├── announcement/
│   │   │   │   ├── query/
│   │   │   │   └── statistics/
│   │   │   └── interceptor/        # 拦截器
│   │   │       └── LoginInterceptor.java
│   │   ├── resources/
│   │   │   ├── mapper/             # MyBatis映射文件
│   │   │   │   ├── user/
│   │   │   │   ├── announcement/
│   │   │   │   ├── query/
│   │   │   │   └── statistics/
│   │   │   ├── sql/                # SQL脚本
│   │   │   │   └── init.sql
│   │   │   ├── applicationContext.xml
│   │   │   ├── spring-mvc.xml
│   │   │   ├── mybatis-config.xml
│   │   │   └── jdbc.properties
│   │   └── webapp/
│   │       ├── WEB-INF/
│   │       │   ├── views/          # JSP页面（待实现）
│   │       │   └── web.xml
│   │       └── static/             # 静态资源（待实现）
└── pom.xml
```

## 团队分工

### 人员1 - 用户模块
**负责内容**:
- 用户登录/注册
- 用户信息管理（增删改查）
- 密码找回
- 权限控制
- 系统参数配置

**需要实现的包**:
- `com.campus.announce.service.user.*`
- `com.campus.announce.controller.user.*`
- `src/main/webapp/WEB-INF/views/user/*`

**涉及表**:
- `sys_user`
- `sys_department`
- `sys_config`

### 人员2 - 公告发布模块
**负责内容**:
- 公告发布（全校/院系）
- 公告修改/删除
- 公告置顶管理
- 附件上传管理

**需要实现的包**:
- `com.campus.announce.service.announcement.*`
- `com.campus.announce.controller.announcement.*`
- `src/main/webapp/WEB-INF/views/announcement/*`

**涉及表**:
- `sys_announcement`
- `sys_attachment`

### 人员3 - 公告查询模块
**负责内容**:
- 多条件查询（标题、类型、院系、时间）
- 公告列表展示
- 未读公告提示
- 公告详情查看

**需要实现的包**:
- `com.campus.announce.service.query.*`
- `com.campus.announce.controller.query.*`
- `src/main/webapp/WEB-INF/views/query/*`

**涉及表**:
- `sys_announcement`
- `sys_announcement_read`

### 人员4 - 公告统计模块
**负责内容**:
- 按类型统计
- 按院系统计
- 按时间段统计
- 已读/未读统计

**需要实现的包**:
- `com.campus.announce.service.statistics.*`
- `com.campus.announce.controller.statistics.*`
- `src/main/webapp/WEB-INF/views/statistics/*`

**涉及表**:
- `sys_announcement`
- `sys_announcement_read`
- `sys_user`

## 数据库初始化

1. 创建数据库:
```sql
CREATE DATABASE campus_announce DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 执行初始化脚本:
```bash
mysql -u root -p campus_announce < src/main/resources/sql/init.sql
```

3. 修改数据库配置:
编辑 `src/main/resources/jdbc.properties`，修改数据库连接信息

## 默认账号

- **超级管理员**: admin / 123456
- **院系管理员**: cs_admin / 123456
- **教师**: teacher1 / 123456
- **学生**: student1 / 123456

## 开发规范

1. **代码提交前**:
   - 确保代码编译通过
   - 遵循Java命名规范
   - 添加必要的注释

2. **Git分支管理**:
   - `main`: 主分支，稳定版本
   - `dev`: 开发分支
   - `feature/xxx`: 功能分支
   - `fix/xxx`: 修复分支

3. **协作流程**:
   - 每个人在自己的功能分支上开发
   - 开发完成后提交Pull Request到dev分支
   - 代码审查通过后合并到dev分支
   - 定期从dev合并到main

## 快速开始

1. 克隆项目:
```bash
git clone <repository-url>
cd campus-announce-sys
```

2. 修改数据库配置:
编辑 `src/main/resources/jdbc.properties`

3. 编译项目:
```bash
mvn clean package
```

4. 部署到Tomcat:
将 `target/campus-announce-sys.war` 部署到Tomcat的webapps目录

5. 访问系统:
```
http://localhost:8080/campus-announce-sys/
```

## 待实现功能

- [ ] Service层实现
- [ ] Controller层实现
- [ ] JSP页面开发
- [ ] 文件上传功能
- [ ] 邮件发送功能（密码找回）
- [ ] 单元测试
- [ ] 日志记录完善

## 注意事项

1. 密码需要加密存储（建议使用BCrypt）
2. 文件上传需要限制大小和类型
3. 敏感信息不要提交到Git
4. 定期备份数据库
5. 注意SQL注入防护（使用MyBatis参数化查询）

## 联系方式

如有问题，请联系项目负责人或团队成员。