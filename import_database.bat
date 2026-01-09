@echo off
chcp 65001 > nul
echo ========================================
echo 校园公告系统 - 数据库导入工具
echo ========================================
echo.

set MYSQL_PATH=I:\MySQL\MySQL Server 8.0\bin\mysql.exe
set DATABASE=campus_announce

echo.
echo 请选择导入方式:
echo.
echo 1. 从SQL文件导入（推荐）
echo 2. 从备份文件导入
echo.

set /p choice=
if %ERRORLEVEL% EQU 0 set choice=1

if "%choice%"=="1" goto import_sql
if "%choice%"=="2" goto import_backup
goto invalid_choice

:import_sql
echo.
echo ========================================
echo 从SQL文件导入数据库
echo ========================================
echo.
echo 正在查找SQL文件...
echo.

if exist "init_database_en.sql" (
    set SQL_FILE=init_database_en.sql
    echo [找到] init_database_en.sql
) else if exist "src\main\resources\sql\init.sql" (
    set SQL_FILE=src\main\resources\sql\init.sql
    echo [找到] src\main\resources\sql\init.sql
) else (
    echo.
    echo [错误] 未找到SQL文件！
    echo 请确保以下文件存在：
    echo   - init_database_en.sql
    echo   - src\main\resources\sql\init.sql
    pause
    exit /b 1
)

echo.
echo 请输入MySQL root密码：
echo.

"%MYSQL_PATH%" -u root -p %DATABASE% < "%SQL_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo 数据库导入成功！
    echo ========================================
    echo.
    echo 已成功导入数据库: %DATABASE%
    echo.
    echo 可以开始使用系统了
) else (
    echo.
    echo ========================================
    echo 数据库导入失败！
    echo ========================================
    echo.
    echo 错误代码: %ERRORLEVEL%
    echo 请检查：
    echo   1. MySQL密码是否正确
    echo   2. MySQL服务是否正在运行
    echo   3. SQL文件路径是否正确
)

pause
goto end

:import_backup
echo.
echo ========================================
echo 从备份文件导入数据库
echo ========================================
echo.
echo 正在查找备份文件...
echo.

set /p BACKUP_FILE=

:select_backup
echo.
echo 可用的备份文件:
dir /b "%~dp0database_backup" | findstr /i "\.sql$"
echo.
echo 请输入备份文件名（或输入q退出）：
set /p BACKUP_FILE=

if "%BACKUP_FILE%"=="q" goto end
if "%BACKUP_FILE%"=="" goto select_backup

echo.
echo 正在导入备份文件: %BACKUP_FILE%
echo.

if not exist "%~dp0database_backup\%BACKUP_FILE%" (
    echo.
    echo [错误] 文件不存在: %BACKUP_FILE%
    pause
    goto select_backup
)

echo.
echo 请输入MySQL root密码：
echo.

"%MYSQL_PATH%" -u root -p %DATABASE% < "%~dp0database_backup\%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo 数据库导入成功！
    echo ========================================
    echo.
    echo 已成功导入备份: %BACKUP_FILE%
) else (
    echo.
    echo ========================================
    echo 数据库导入失败！
    echo ========================================
    echo.
    echo 错误代码: %ERRORLEVEL%
)

pause
goto end

:invalid_choice
echo.
echo [错误] 无效的选择！
pause

:end