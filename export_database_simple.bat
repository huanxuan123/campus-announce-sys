@echo off
chcp 65001 > nul
echo ========================================
echo Campus Announcement System - Database Export
echo ========================================
echo.

set MYSQL_PATH=I:\MySQL\MySQL Server 8.0\bin\mysql.exe
set DATABASE=campus_announce
set OUTPUT_DIR=%~dp0database_backup
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%

echo Output directory: %OUTPUT_DIR%
echo Timestamp: %TIMESTAMP%
echo.

if not exist "%OUTPUT_DIR%" (
    mkdir "%OUTPUT_DIR%"
    echo [INFO] Output directory created
)

echo Exporting database...
echo Please enter MySQL root password:
echo.

"%MYSQL_PATH%" -u root -p %DATABASE% --skip-column-names --no-create-db > "%OUTPUT_DIR%\campus_announce_%TIMESTAMP%.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Database export successful!
    echo ========================================
    echo.
    echo Export file: %OUTPUT_DIR%\campus_announce_%TIMESTAMP%.sql
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
    echo Please check if MySQL password is correct
)

echo.
pause