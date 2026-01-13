@echo off
chcp 65001 > nul
echo ========================================
echo 校园公告系统 - 数据库初始化
echo ========================================
echo.

set MYSQL_PATH=I:\MySQL\MySQL Server 8.0\bin\mysql.exe
set DATABASE=campus_announce
set SQL_FILE=%~dp0src\main\resources\sql\init.sql

echo MySQL路径: %MYSQL_PATH%
echo 数据库名: %DATABASE%
echo SQL文件: %SQL_FILE%
echo.

if not exist "%MYSQL_PATH%" (
    echo [错误] 找不到MySQL客户端程序！
    echo 请检查MySQL安装路径是否正确。
    echo.
    pause
    exit /b 1
)

if not exist "%SQL_FILE%" (
    echo [错误] 找不到SQL初始化脚本！
    echo 请检查SQL文件是否存在。
    echo.
    pause
    exit /b 1
)

echo 正在初始化数据库...
echo 请输入MySQL root密码：
echo.

"%MYSQL_PATH%" -u root -p %DATABASE% < "%SQL_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo 数据库初始化成功！
    echo ========================================
    echo.
    echo 默认测试账号：
    echo   超级管理员: admin / 123456
    echo   院系管理员: cs_admin / 123456
    echo   教师: teacher1 / 123456
    echo   学生: student1 / 123456
    echo.
) else (
    echo.
    echo ========================================
    echo 数据库初始化失败！
    echo ========================================
    echo.
    echo 错误代码: %ERRORLEVEL%
    echo 请检查MySQL密码是否正确，以及SQL文件是否有语法错误。
    echo.
)

pause