# GitHub部署指南

## 步骤1：创建GitHub仓库

1. 访问 [GitHub](https://github.com) 并登录你的账号
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - Repository name: `campus-announce-sys`
   - Description: `基于SSM框架的校园公告发布系统，支持公告的精准推送和便捷查询`
   - 选择 Public（公开）或 Private（私有）
   - **不要**勾选 "Initialize this repository with a README"
   - **不要**添加 .gitignore 或 license
4. 点击 "Create repository"

## 步骤2：关联远程仓库

在项目根目录下执行以下命令：

```bash
# 添加远程仓库（将YOUR_USERNAME替换为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/campus-announce-sys.git

# 推送代码到GitHub
git push -u origin main
```

## 步骤3：创建开发分支

```bash
# 创建并切换到dev分支
git checkout -b dev

# 推送dev分支到远程
git push -u origin dev
```

## 步骤4：团队成员协作

### 人员1 - 用户模块

```bash
# 创建功能分支
git checkout -b feature/user-module

# 开发完成后提交
git add .
git commit -m "feat: 实现用户模块功能"

# 推送到远程
git push -u origin feature/user-module

# 在GitHub上创建Pull Request到dev分支
```

### 人员2 - 公告发布模块

```bash
# 创建功能分支
git checkout -b feature/announcement-publish

# 开发完成后提交
git add .
git commit -m "feat: 实现公告发布模块功能"

# 推送到远程
git push -u origin feature-announcement-publish

# 在GitHub上创建Pull Request到dev分支
```

### 人员3 - 公告查询模块

```bash
# 创建功能分支
git checkout -b feature/announcement-query

# 开发完成后提交
git add .
git commit -m "feat: 实现公告查询模块功能"

# 推送到远程
git push -u origin feature-announcement-query

# 在GitHub上创建Pull Request到dev分支
```

### 人员4 - 公告统计模块

```bash
# 创建功能分支
git checkout -b feature/announcement-statistics

# 开发完成后提交
git add .
git commit -m "feat: 实现公告统计模块功能"

# 推送到远程
git push -u origin feature-announcement-statistics

# 在GitHub上创建Pull Request到dev分支
```

## 步骤5：代码审查和合并

1. 每个成员在GitHub上创建Pull Request到dev分支
2. 其他成员进行代码审查（Code Review）
3. 审查通过后合并到dev分支
4. 定期从dev分支合并到main分支

```bash
# 合并dev到main（由项目负责人执行）
git checkout main
git pull origin main
git merge dev
git push origin main
```

## 步骤6：克隆项目（团队成员）

其他团队成员克隆项目：

```bash
git clone https://github.com/YOUR_USERNAME/campus-announce-sys.git
cd campus-announce-sys

# 查看所有分支
git branch -a

# 创建并切换到自己的功能分支
git checkout -b feature/your-module-name
```

## 常用Git命令

```bash
# 查看当前状态
git status

# 查看分支
git branch

# 切换分支
git checkout branch-name

# 拉取最新代码
git pull origin branch-name

# 查看提交历史
git log --oneline

# 查看远程仓库
git remote -v

# 删除远程分支
git push origin --delete branch-name

# 删除本地分支
git branch -d branch-name
```

## 注意事项

1. **不要直接提交到main分支**，所有开发都在功能分支进行
2. **提交前先拉取最新代码**，避免冲突
3. **提交信息要清晰**，使用规范的commit message格式：
   - `feat:` 新功能
   - `fix:` 修复bug
   - `docs:` 文档更新
   - `style:` 代码格式调整
   - `refactor:` 重构
   - `test:` 测试相关
   - `chore:` 构建/工具链相关

4. **定期同步**：每天开始工作前先拉取最新代码
5. **解决冲突**：合并时如果出现冲突，先解决冲突再提交

## 示例工作流程

```bash
# 1. 每天开始工作前
git checkout dev
git pull origin dev

# 2. 创建或切换到自己的功能分支
git checkout feature/user-module

# 3. 合并dev的最新代码
git merge dev

# 4. 开始开发...
# ...编写代码...

# 5. 提交代码
git add .
git commit -m "feat: 实现用户登录功能"

# 6. 推送到远程
git push -u origin feature-user-module

# 7. 在GitHub上创建Pull Request到dev分支
```

## 项目协作最佳实践

1. **小步快跑**：频繁提交，每次提交只做一件事
2. **代码审查**：每个PR都要经过至少一人审查
3. **自动化测试**：添加单元测试，确保代码质量
4. **文档更新**：修改功能时同步更新文档
5. **及时沟通**：遇到问题及时在团队中讨论

## GitHub Issues使用

使用GitHub Issues跟踪bug和功能需求：

1. 创建Issue描述问题或需求
2. 分配给负责人
3. 关联相关的Pull Request
4. 完成后关闭Issue

## 问题排查

### 推送失败
```bash
# 如果推送失败，先拉取再推送
git pull --rebase origin branch-name
git push origin branch-name
```

### 合并冲突
```bash
# 手动解决冲突后
git add .
git commit -m "resolve: 解决合并冲突"
git push origin branch-name
```