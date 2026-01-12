# 团队协作完整流程图

## 🎯 项目协作架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                          │
│                    GitHub仓库                                    │
│            https://github.com/huanxuan123/             │
│              campus-announce-sys.git                   │
│                                                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                 │ │
│  │         项目负责人（你）                          │ │
│  │                                                 │ │
│  │  1. 开发功能                                  │ │
│  │  2. 导出数据库（包含最新数据）              │ │
│  │  3. 分享SQL文件给团队                          │ │
│  │  4. 推送到GitHub                                 │ │
│  │                                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                 │ │
│  │         团队成员（4人）                           │ │
│  │                                                 │ │
│  │  ┌────────────────────────────────────────────┐    │ │
│  │  │                                    │    │ │
│  │  │  人员1：用户模块                │    │ │
│  │  │  1. 克隆项目                  │    │ │
│  │  │  2. 导入数据库                  │    │ │
│  │  │  3. 配置jdbc.properties          │    │ │
│  │  │  4. 在IDEA中打开项目          │    │ │
│  │  │  5. 配置Tomcat                  │    │ │
│  │  │  6. 开始开发                    │    │ │
│  │  │  7. 提交代码                  │    │ │
│  │  │  8. 创建PR到dev分支            │    │ │
│  │  └────────────────────────────────────┘    │ │
│  │                                    │    │ │
│  │  ┌────────────────────────────────────────────┐    │ │
│  │  │                                    │    │ │
│  │  │  人员2：公告发布模块          │    │ │
│  │  │  1. 克隆项目                  │    │ │
│  │  │  2. 导入数据库                  │    │ │
│  │  │  3. 配置jdbc.properties          │    │ │
│  │  │  4. 在IDEA中打开项目          │    │ │
│  │  │  5. 配置Tomcat                  │    │ │
│  │  │  6. 开始开发                    │    │ │
│  │  │  7. 提交代码                  │    │ │
│  │  │  8. 创建PR到dev分支            │    │ │
│  │  └────────────────────────────────────┘    │ │
│  │                                    │    │ │
│  │  ┌────────────────────────────────────────────┐    │ │
│  │  │                                    │    │ │
│  │  │  人员3：公告查询模块          │    │ │
│  │  │  1. 克隆项目                  │    │ │
│  │  │  2. 导入数据库                  │    │ │
│  │  │  3. 配置jdbc.properties          │    │ │
│  │  │  4. 在IDEA中打开项目          │    │ │
│  │  │  5. 配置Tomcat                  │    │ │
│  │  │  6. 开始开发                    │    │ │
│  │  │  7. 提交代码                  │    │ │
│  │  │  8. 创建PR到dev分支            │    │ │
│  │  └────────────────────────────────────┘    │ │
│  │                                    │    │ │
│  │  ┌────────────────────────────────────────────┐    │ │
│  │  │                                    │    │ │
│  │  │  人员4：公告统计模块          │    │ │
│  │  │  1. 克隆项目                  │    │ │
│  │  │  2. 导入数据库                  │    │ │
│  │  │  3. 配置jdbc.properties          │    │ │
│  │  │  4. 在IDEA中打开项目          │    │ │
│  │  │  5. 配置Tomcat                  │    │ │
│  │  │  6. 开始开发                    │    │ │
│  │  │  7. 提交代码                  │    │ │
│  │  │  8. 创建PR到dev分支            │    │ │
│  │  └────────────────────────────────────┘    │ │
│  │                                    │ │
└─────────────────────────────────────────────────────────────┘
                                                          │
└─────────────────────────────────────────────────────────────────────┘
```

## 📋 详细协作流程

### 阶段1：项目准备（项目负责人）

```
1. 创建SSM框架
   ├── Spring配置
   ├── SpringMVC配置
   ├── MyBatis配置
   ├── 数据库设计
   └── 模块化包结构

2. 编写SQL初始化脚本
   ├── init.sql（中文注释）
   └── init_database_en.sql（英文注释，推荐）

3. 创建文档
   ├── README.md（项目说明）
   ├── TASKS.md（开发任务清单）
   ├── DEPLOYMENT.md（部署指南）
   ├── GITHUB_GUIDE.md（GitHub协作指南）
   └── TEAM_SETUP.md（团队设置指南）

4. 创建数据库工具
   ├── init_database.bat（初始化工具）
   ├── export_database_mysqldump.bat（导出工具）
   ├── import_database.bat（导入工具）
   └── DATABASE_TOOLS.md（工具说明）

5. 初始化Git仓库
   ├── git init
   ├── git add .
   └── git commit -m "Initial commit"

6. 推送到GitHub
   ├── 创建GitHub仓库
   ├── git remote add origin
   └── git push -u origin main
```

### 阶段2：团队成员开始（每人独立执行）

```
每个团队成员按照以下步骤操作：

┌─────────────────────────────────────────────────────────────┐
│  步骤1：克隆项目                                  │
├─────────────────────────────────────────────────────────────┤
│                                                          │
│  git clone https://github.com/huanxuan123/         │
│   campus-announce-sys.git                             │
│                                                          │
│  cd campus-announce-sys                                │
│                                                          │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  步骤2：初始化数据库（必需！）                      │
├─────────────────────────────────────────────────────────────┤
│                                                          │
│  方法1：使用批处理文件（推荐）                    │
│  .\import_database.bat                                  │
│                                                          │
│  选择：从init.sql导入                               │
│  输入MySQL root密码                                  │
│  等待导入完成                                          │
│                                                          │
│                                                          │
│  方法2：手动执行SQL（备用）                      │
│  mysql -u root -p -e "CREATE DATABASE..."            │
│  mysql -u root -p campus_announce < init.sql            │
│                                                          │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  步骤3：配置数据库连接                            │
├─────────────────────────────────────────────────────────────┤
│                                                          │
│  1. 复制配置文件模板                              │
│  copy src\main\resources\jdbc.properties.example       │
│   src\main\resources\jdbc.properties                 │
│                                                          │
│  2. 编辑jdbc.properties                              │
│  使用文本编辑器打开                              │
│  修改：jdbc.password=你的MySQL密码                   │
│                                                          │
│  3. （可选）在IDEA中配置数据库连接                │
│  View → Tool Windows → Database                   │
│  点击"+" → Data Source → MySQL                   │
│  填写连接信息并测试                               │
│                                                          │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  步骤4：在IDEA中打开项目                        │
├─────────────────────────────────────────────────────────────┤
│                                                          │
│  1. 打开IntelliJ IDEA                              │
│  File → Open                                       │
│  2. 选择项目目录                                  │
│  h:\javabc\campus-announce-sys                      │
│  3. 等待Maven依赖下载完成                           │
│  （右下角显示进度条）                            │
│                                                          │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  步骤5：配置Tomcat服务器                         │
├─────────────────────────────────────────────────────────────┤
│                                                          │
│  1. Run → Edit Configurations                       │
│  2. 点击"+" → Tomcat Server → Local              │
│  3. 配置Tomcat                                      │
│  Name: Tomcat 9.0.x                              │
│  Tomcat Home: 选择Tomcat安装目录                   │
│  4. 配置Deployment                                │
│  Deployment tab → 点击"+" → Artifact              │
│  选择：campus-announce-sys:war exploded            │
│  Application context: /campus-announce-sys          │
│  5. 点击"Run"按钮（绿色三角形）                  │
│  6. 浏览器自动打开                                  │
│  http://localhost:8080/campus-announce-sys/            │
│                                                          │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  步骤6：开始开发                                  │
├─────────────────────────────────────────────────────────────┤
│                                                          │
│  1. 创建功能分支                                  │
│  git checkout -b feature/user-module              │
│  git checkout -b feature/announcement-publish      │
│  git checkout -b feature/announcement-query       │
│  git checkout -b feature/announcement-statistics    │
│                                                          │
│  2. 开始开发                                      │
│  参考TASKS.md中的任务清单                          │
│  实现对应模块的功能                              │
│                                                          │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  步骤7：提交代码                                  │
├─────────────────────────────────────────────────────────────┤
│                                                          │
│  git add .                                         │
│  git commit -m "feat: 实现xxx功能"                │
│                                                          │
│  8. 推送到远程                                  │
│  git push -u origin feature-user-module              │
│  git push -u origin feature-announcement-publish      │
│  git push -u origin feature-announcement-query       │
│  git push -u origin feature-announcement-statistics    │
│                                                          │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  步骤8：创建Pull Request到dev分支               │
├─────────────────────────────────────────────────────────────┤
│                                                          │
│  1. 在GitHub上打开项目                               │
│  https://github.com/huanxuan123/                     │
│   campus-announce-sys                              │
│                                                          │
│  2. 点击"Pull requests"标签                       │
│  3. 点击"New pull request"                         │
│  4. 选择：base: dev                              │
│  5. 选择：compare: feature/your-module → dev       │
│  6. 填写PR标题和描述                            │
│  7. 点击"Create pull request"                       │
│                                                          │
└─────────────────────────────────────────────────────────────┘
```

### 阶段3：代码审查和合并

```
项目负责人和团队成员进行代码审查：

┌─────────────────────────────────────────────────────────────┐
│  代码审查                                          │
├─────────────────────────────────────────────────────────────┤
│                                                          │
│  1. 团队成员审查其他成员的PR                     │
│  2. 检查代码质量                                  │
│  3. 提出修改建议                                  │
│  4. 在PR中讨论问题                                │
│  5. 审查通过后批准合并                           │
│                                                          │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  合并到dev分支                                     │
├─────────────────────────────────────────────────────────────┤
│                                                          │
│  1. 项目负责人合并PR到dev分支                      │
│  2. 确认合并成功，无冲突                           │
│  3. 删除已合并的功能分支                          │
│  4. 推送更新后的dev分支到GitHub                  │
│                                                          │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  团队成员同步最新代码                             │
├─────────────────────────────────────────────────────────────┤
│                                                          │
│  每个团队成员执行：                              │
│  1. git checkout dev                              │
│  2. git pull origin dev                          │
│  3. git checkout feature/your-module                 │
│  4. git merge dev                                 │
│  5. 解决冲突（如果有）                              │
│  6. 继续开发                                    │
│                                                          │
└─────────────────────────────────────────────────────────────┘
```

### 阶段4：定期更新和发布

```
项目定期更新和发布：

┌─────────────────────────────────────────────────────────────┐
│  定期更新                                          │
├─────────────────────────────────────────────────────────────┤
│                                                          │
│  1. 项目负责人导出最新数据库                      │
│  2. 分享SQL文件给团队                          │
│  3. 推送到GitHub                                  │
│                                                          │
│  4. 通知团队成员更新代码                          │
│                                                          │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│  发布到main分支                                     │
├─────────────────────────────────────────────────────────────┤
│                                                          │
│  1. 所有功能开发完成                              │
│  2. 所有测试通过                                  │
│  3. 从dev合并到main                             │
│  4. 推送到GitHub                                  │
│  5. 打tag（可选）                                │
│  git tag -v v1.0.0                             │
│                                                          │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Git分支管理

```
main分支（生产版本）
├── 稳定版本
├── 经过充分测试
└── 可以部署到生产环境

dev分支（开发版本）
├── 开发中的功能
├── 不稳定版本
└── 用于日常开发

feature分支（功能分支）
├── feature/user-module（用户模块）
├── feature/announcement-publish（公告发布模块）
├── feature/announcement-query（公告查询模块）
└── feature/announcement-statistics（公告统计模块）
```

## 🔄 团队成员每日工作流

```
每天开始工作前（每个团队成员）：

1. 切换到dev分支
   git checkout dev

2. 拉取最新代码
   git pull origin dev

3. 切换到自己的功能分支
   git checkout feature/user-module
   或
   git checkout feature/announcement-publish
   或
   git checkout feature/announcement-query
   或
   git checkout feature/announcement-statistics

4. 合并dev的最新代码
   git merge dev

5. 开始开发
   在IDEA中编写代码

6. 测试功能
   在IDEA中运行项目并测试

7. 提交代码
   git add .
   git commit -m "feat: 实现xxx功能"

8. 推送到远程
   git push origin feature-user-module

9. 创建PR到dev分支
   在GitHub上创建Pull Request
```

## 📝 常见协作场景

### 场景1：多人同时修改同一文件

```
问题：A和B同时修改了同一个文件
解决方法：
1. A先拉取最新代码
   git pull origin dev
   git merge dev

2. 解决冲突
   手动解决冲突或使用IDEA的合并工具

3. 提交并推送
   git add .
   git commit -m "fix: 解决合并冲突"
   git push origin feature-user-module
```

### 场景2：数据库结构变更

```
问题：项目负责人更新了数据库结构
解决方法：
1. 项目负责人导出最新数据库
   .\export_database_mysqldump.bat
   分享SQL文件给团队

2. 团队成员更新数据库
   .\import_database.bat
   从最新备份文件导入

3. 重新初始化数据库（如果需要）
   .\init_database.bat
```

### 场景3：新成员加入团队

```
新成员加入的步骤：

1. 项目负责人邀请成员到GitHub仓库
   Settings → Collaborators → Add people

2. 新成员克隆项目
   git clone https://github.com/huanxuan123/campus-announce-sys.git

3. 新成员初始化数据库
   .\import_database.bat

4. 新成员配置IDEA
   打开项目，配置Tomcat

5. 新成员创建功能分支
   git checkout -b feature/user-module
   或其他功能分支

6. 开始开发
   参考TASKS.md中的任务清单
```

## 🎯 快速开始命令

### 项目负责人

```bash
# 1. 导出最新数据库
.\export_database_mysqldump.bat

# 2. 推送到GitHub
git add .
git commit -m "backup: 更新数据库备份"
git push origin main

# 3. 通知团队成员
# 在GitHub上@团队成员或创建Issue
```

### 团队成员（每个人）

```bash
# 1. 克隆项目
git clone https://github.com/huanxuan123/campus-announce-sys.git
cd campus-announce-sys

# 2. 初始化数据库
.\import_database.bat
# 选择：从init.sql导入
# 输入MySQL root密码

# 3. 配置数据库连接
copy src\main\resources\jdbc.properties.example src\main\resources\jdbc.properties
# 编辑jdbc.properties，修改密码

# 4. 在IDEA中打开项目
# File → Open → 选择项目目录

# 5. 配置Tomcat
# Run → Edit Configurations → + → Tomcat Server

# 6. 创建功能分支
git checkout -b feature/user-module
# 或其他功能分支

# 7. 开始开发
# 参考TASKS.md中的任务清单

# 8. 提交代码
git add .
git commit -m "feat: 实现xxx功能"

# 9. 推送到远程
git push origin feature-user-module

# 10. 创建PR到dev分支
# 在GitHub上创建Pull Request
```

## 📋 完整的文件清单

### 项目根目录文件

```
campus-announce-sys/
├── src/                          # 源代码
│   ├── java/com/campus/announce/    # Java源代码
│   │   ├── common/                # 公共类
│   │   ├── entity/                # 实体类
│   │   ├── mapper/                # Mapper接口
│   │   │   ├── user/           # 用户模块Mapper
│   │   │   ├── announcement/    # 公告发布模块Mapper
│   │   │   ├── query/          # 公告查询模块Mapper
│   │   │   └── statistics/     # 公告统计模块Mapper
│   │   ├── service/               # Service接口
│   │   │   ├── user/           # 用户模块Service
│   │   │   ├── announcement/    # 公告发布模块Service
│   │   │   ├── query/          # 公告查询模块Service
│   │   │   └── statistics/     # 公告统计模块Service
│   │   ├── controller/            # Controller层（待实现）
│   │   ├── interceptor/         # 拦截器
│   │   └── resources/             # 配置文件
│   │       ├── mapper/           # MyBatis映射文件
│   │       ├── sql/            # SQL脚本
│   │       ├── jdbc.properties.example  # 数据库配置模板
│   │       ├── applicationContext.xml  # Spring配置
│   │       ├── spring-mvc.xml      # SpringMVC配置
│   │       └── mybatis-config.xml  # MyBatis配置
│   └── webapp/                  # 前端资源
│       ├── WEB-INF/
│       │   ├── web.xml        # Web配置
│       │   └── views/         # JSP页面（待实现）
│       ├── index.jsp            # 首页
│       └── static/             # 静态资源（待创建）
├── pom.xml                      # Maven配置
├── .gitignore                    # Git忽略文件
├── export_database_mysqldump.bat  # 数据库导出工具
├── import_database.bat           # 数据库导入工具
├── init_database.bat             # 数据库初始化工具
├── DATABASE_TOOLS.md            # 数据库工具说明
├── README.md                    # 项目说明
├── TASKS.md                    # 开发任务清单
├── TEAM_SETUP.md               # 团队设置指南
├── DEPLOYMENT.md               # 部署指南
├── GITHUB_GUIDE.md             # GitHub协作指南
└── TEAM_COLLABORATION.md       # 团队协作流程（本文件）
```

## 🚀 现在可以开始团队协作了！

所有工具和文档都已准备就绪，团队成员可以按照上述流程开始开发。

### 项目负责人

1. ✅ 创建了完整的SSM框架
2. ✅ 设计了模块化的代码结构
3. ✅ 创建了数据库工具和脚本
4. ✅ 编写了详细的文档
5. ✅ 初始化了Git仓库并推送到GitHub

### 团队成员

1. 克隆项目
2. 初始化数据库
3. 配置IDEA和Tomcat
4. 创建功能分支
5. 开始开发
6. 提交代码
7. 创建PR到dev分支

### 关键文档

- [README.md](README.md) - 项目说明和快速开始
- [TEAM_SETUP.md](TEAM_SETUP.md) - 团队设置指南
- [TASKS.md](TASKS.md) - 开发任务清单
- [DEPLOYMENT.md](DEPLOYMENT.md) - 部署指南
- [GITHUB_GUIDE.md](GITHUB_GUIDE.md) - GitHub协作指南
- [DATABASE_TOOLS.md](DATABASE_TOOLS.md) - 数据库工具说明
- [TEAM_COLLABORATION.md](TEAM_COLLABORATION.md) - 团队协作流程（本文件）

### 数据库工具

- `export_database_mysqldump.bat` - 导出工具（推荐）
- `import_database.bat` - 导入工具
- `init_database.bat` - 初始化工具

### Git仓库

- GitHub: https://github.com/huanxuan123/campus-announce-sys.git
- main分支：稳定版本
- dev分支：开发版本
- feature分支：功能分支

开始协作吧！🚀