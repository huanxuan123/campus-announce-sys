@echo off
chcp 65001 > nul
echo ========================================
echo Campus Announcement System - Database Export
echo ========================================
echo.

set MYSQL_PATH=I:\MySQL\MySQL Server 8.0\bin\mysqldump.exe
set DATABASE=campus_announce
set OUTPUT_DIR=%~dp0database_backup
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%

echo Output directory: %OUTPUT_DIR%
echo Timestamp: %TIMESTAMP%
echo.

if not exist "%MYSQL_PATH%" (
    echo [ERROR] mysqldump not found at: %MYSQL_PATH%
    echo Please check MySQL installation path
    pause
    exit /b 1
)

if not exist "%OUTPUT_DIR%" (
    mkdir "%OUTPUT_DIR%"
    echo [INFO] Created output directory
)

echo Exporting database...
echo Please enter MySQL root password:
echo.

"%MYSQL_PATH%" -u root -p %DATABASE% --single-transaction --quick --lock-tables=false --routines --triggers --events --set-gtid-purged=OFF > "%OUTPUT_DIR%\campus_announce_%TIMESTAMP%.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Database export successful!
    echo ========================================
    echo.
    echo Export file: %OUTPUT_DIR%\campus_announce_%TIMESTAMP%.sql
    echo.
    
    for %%A in ("%OUTPUT_DIR%\campus_announce_%TIMESTAMP%.sql") do (
        set size=%%~zA
        echo File size: !size! bytes
    )
    echo.
    echo This file can be shared with team members for database import
    echo.
    echo Team members can import using:
    echo   .\import_database.bat
    echo   or
    echo   powershell -ExecutionPolicy Bypass -File import_database.ps1
) else (
    echo.
    echo ========================================
    echo Database export failed!
    echo ========================================
    echo.
    echo Error code: %ERRORLEVEL%
    echo Please check:
    echo   1. MySQL password is correct
    echo   2. MySQL service is running
    echo   3. Database name is correct: %DATABASE%
)

echo.
pause