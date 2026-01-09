# 数据库导出和导入工具

## 使用说明

### 导出数据库（项目负责人使用）

当你完成开发并想分享数据库给团队时：

```bash
# 方法1：使用批处理文件（推荐）
.\export_database.bat

# 方法2：使用PowerShell
powershell -ExecutionPolicy Bypass -File export_database.ps1
```

导出的SQL文件会保存在 `database_backup` 目录中，文件名格式：`campus_announce_YYYYMMDD_HHMMSS.sql`

### 导入数据库（团队成员使用）

团队成员克隆项目后，可以使用以下方式导入数据库：

```bash
# 方法1：使用批处理文件（推荐）
.\import_database.bat

# 方法2：使用PowerShell
powershell -ExecutionPolicy Bypass -File import_database.ps1
```

## 功能说明

### 导出功能
- ✅ 导出完整的数据库结构和数据
- ✅ 包含所有表和数据
- ✅ 自动添加时间戳到文件名
- ✅ 保存到database_backup目录

### 导入功能
- ✅ 从SQL文件导入
- ✅ 从备份文件导入
- ✅ 自动创建数据库（如果不存在）
- ✅ 错误提示和验证

## 文件说明

### export_database.bat
- 功能：导出当前数据库为SQL文件
- 输出：database_backup/campus_announce_时间戳.sql
- 使用：项目负责人导出并分享给团队

### import_database.bat
- 功能：从SQL文件导入数据库
- 选项1：从项目中的SQL文件导入（init.sql）
- 选项2：从备份文件导入
- 使用：团队成员克隆项目后快速初始化数据库

## 注意事项

1. **导出时**：
   - 确保MySQL服务正在运行
   - 确保root密码正确
   - 导出的文件可以分享给团队成员

2. **导入时**：
   - 确保MySQL服务正在运行
   - 确保root密码正确
   - 建议先删除旧数据库再导入
   - 或者使用DROP TABLE IF EXISTS语句

3. **备份管理**：
   - 定期导出数据库作为备份
   - 保留多个版本的备份文件
   - 清理过期的备份文件

## 快速开始

### 导出数据库（项目负责人）
```bash
# 运行导出脚本
.\export_database.bat

# 输入MySQL root密码
# 等待导出完成
# 分享 database_backup\campus_announce_时间戳.sql 给团队
```

### 导入数据库（团队成员）
```bash
# 1. 克隆项目
git clone https://github.com/huanxuan123/campus-announce-sys.git

# 2. 运行导入脚本
.\import_database.bat

# 选择选项1：从init.sql导入
# 选择选项2：从备份文件导入

# 输入MySQL root密码
# 等待导入完成
```

## 常见问题

### Q: 导出时提示"Access denied"
**A**: MySQL密码错误，检查root密码是否正确

### Q: 导入时提示"Unknown database"
**A**: 数据库不存在，导入脚本会自动创建

### Q: 导入时提示"Table already exists"
**A**: 数据库已存在，可以先删除或使用DROP TABLE IF EXISTS

### Q: 导出的文件太大
**A**: 正常现象，包含所有表和数据是合理的

## 团队协作流程

1. **项目负责人**：
   - 完成功能开发
   - 导出数据库（包含最新数据）
   - 分享SQL文件给团队

2. **团队成员**：
   - 克隆项目
   - 运行导入脚本
   - 配置jdbc.properties
   - 开始开发

3. **定期同步**：
   - 定期导出数据库备份
   - 团队成员定期从最新备份更新

## 文件位置

- **导出脚本**：export_database.bat
- **导入脚本**：import_database.bat
- **导出目录**：database_backup\
- **项目SQL**：init_database_en.sql（推荐使用）