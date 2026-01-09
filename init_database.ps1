# MySQL数据库初始化脚本
$mysqlPath = "I:\MySQL\MySQL Server 8.0\bin\mysql.exe"
$database = "campus_announce"
$username = "root"

Write-Host "请输入MySQL $username 的密码:" -ForegroundColor Yellow
$password = Read-Host -AsSecureString
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Write-Host "`n正在执行SQL初始化脚本..." -ForegroundColor Green

$sqlScript = @"
CREATE DATABASE IF NOT EXISTS $database DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE $database;

DROP TABLE IF EXISTS sys_announcement_read;
DROP TABLE IF EXISTS sys_attachment;
DROP TABLE IF EXISTS sys_announcement;
DROP TABLE IF EXISTS sys_department;
DROP TABLE IF EXISTS sys_user;
DROP TABLE IF EXISTS sys_config;

CREATE TABLE sys_department (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Department ID',
    dept_name VARCHAR(100) NOT NULL COMMENT 'Department Name',
    dept_code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Department Code',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time',
    INDEX idx_dept_code (dept_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Department Table';

CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'User ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Username',
    password VARCHAR(100) NOT NULL COMMENT 'Password',
    real_name VARCHAR(50) NOT NULL COMMENT 'Real Name',
    user_type TINYINT NOT NULL COMMENT 'User Type: 1-Super Admin, 2-Dept Admin, 3-Teacher, 4-Student',
    dept_id BIGINT COMMENT 'Department ID',
    email VARCHAR(100) COMMENT 'Email',
    phone VARCHAR(20) COMMENT 'Phone',
    student_no VARCHAR(50) COMMENT 'Student/Employee Number',
    status TINYINT DEFAULT 1 COMMENT 'Status: 0-Disabled, 1-Enabled',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time',
    FOREIGN KEY (dept_id) REFERENCES sys_department(id) ON DELETE SET NULL,
    INDEX idx_username (username),
    INDEX idx_student_no (student_no),
    INDEX idx_dept_id (dept_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User Table';

CREATE TABLE sys_announcement (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Announcement ID',
    title VARCHAR(200) NOT NULL COMMENT 'Announcement Title',
    content TEXT NOT NULL COMMENT 'Announcement Content',
    announcement_type TINYINT NOT NULL COMMENT 'Announcement Type: 1-Notice, 2-Activity, 3-Other',
    scope TINYINT NOT NULL COMMENT 'Announcement Scope: 1-Whole School, 2-Department',
    dept_id BIGINT COMMENT 'Department ID (Required for dept announcements)',
    publisher_id BIGINT NOT NULL COMMENT 'Publisher ID',
    publish_time DATETIME NOT NULL COMMENT 'Publish Time',
    deadline DATETIME COMMENT 'Deadline',
    is_top TINYINT DEFAULT 0 COMMENT 'Is Top: 0-No, 1-Yes',
    top_order INT DEFAULT 0 COMMENT 'Top Order',
    view_count INT DEFAULT 0 COMMENT 'View Count',
    status TINYINT DEFAULT 1 COMMENT 'Status: 0-Deleted, 1-Normal',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time',
    FOREIGN KEY (dept_id) REFERENCES sys_department(id) ON DELETE CASCADE,
    FOREIGN KEY (publisher_id) REFERENCES sys_user(id) ON DELETE CASCADE,
    INDEX idx_scope_dept (scope, dept_id),
    INDEX idx_publish_time (publish_time),
    INDEX idx_is_top (is_top, top_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Announcement Table';

CREATE TABLE sys_attachment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Attachment ID',
    announcement_id BIGINT NOT NULL COMMENT 'Announcement ID',
    file_name VARCHAR(200) NOT NULL COMMENT 'File Name',
    file_path VARCHAR(500) NOT NULL COMMENT 'File Path',
    file_size BIGINT COMMENT 'File Size (bytes)',
    file_type VARCHAR(50) COMMENT 'File Type',
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Upload Time',
    FOREIGN KEY (announcement_id) REFERENCES sys_announcement(id) ON DELETE CASCADE,
    INDEX idx_announcement_id (announcement_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Attachment Table';

CREATE TABLE sys_announcement_read (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Read Record ID',
    announcement_id BIGINT NOT NULL COMMENT 'Announcement ID',
    user_id BIGINT NOT NULL COMMENT 'User ID',
    read_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Read Time',
    FOREIGN KEY (announcement_id) REFERENCES sys_announcement(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES sys_user(id) ON DELETE CASCADE,
    UNIQUE KEY uk_announcement_user (announcement_id, user_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Announcement Read Record Table';

CREATE TABLE sys_config (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'Config ID',
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT 'Config Key',
    config_value VARCHAR(500) NOT NULL COMMENT 'Config Value',
    config_desc VARCHAR(200) COMMENT 'Config Description',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Create Time',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update Time',
    INDEX idx_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='System Config Table';

INSERT INTO sys_config (config_key, config_value, config_desc) VALUES
('announcement_retention_days', '365', 'Announcement Retention Days'),
('max_top_announcements', '5', 'Max Top Announcements'),
('max_attachment_size', '10485760', 'Max Attachment Size (bytes)'),
('allowed_file_types', 'doc,docx,pdf,jpg,jpeg,png,gif', 'Allowed File Types');

INSERT INTO sys_department (dept_name, dept_code) VALUES
('Computer Science', 'CS'),
('Software Engineering', 'SE'),
('Information Engineering', 'IE'),
('Electronic Engineering', 'EE'),
('Mechanical Engineering', 'ME');

INSERT INTO sys_user (username, password, real_name, user_type, dept_id, email, phone, student_no) VALUES
('admin', '\$2a\$10\$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'System Admin', 1, NULL, 'admin@campus.edu', '13800138000', NULL),
('cs_admin', '\$2a\$10\$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'CS Dept Admin', 2, 1, 'cs_admin@campus.edu', '13800138001', NULL),
('teacher1', '\$2a\$10\$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'Teacher Zhang', 3, 1, 'teacher1@campus.edu', '13800138002', 'T20240001'),
('student1', '\$2a\$10\$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'Student Li', 4, 1, 'student1@campus.edu', '13800138003', 'S20240001');
"@

# 将SQL脚本写入临时文件
$tempFile = [System.IO.Path]::GetTempFileName()
[System.IO.File]::WriteAllText($tempFile, $sqlScript, [System.Text.Encoding]::UTF8)

try {
    # 执行SQL脚本
    $process = Start-Process -FilePath $mysqlPath -ArgumentList "-u$username", "-p$plainPassword", $database -RedirectStandardInput $tempFile -Wait -PassThru -NoNewWindow
    
    if ($process.ExitCode -eq 0) {
        Write-Host "`n数据库初始化成功！" -ForegroundColor Green
        Write-Host "`n默认测试账号：" -ForegroundColor Cyan
        Write-Host "  超级管理员: admin / 123456" -ForegroundColor White
        Write-Host "  院系管理员: cs_admin / 123456" -ForegroundColor White
        Write-Host "  教师: teacher1 / 123456" -ForegroundColor White
        Write-Host "  学生: student1 / 123456" -ForegroundColor White
    } else {
        Write-Host "`n数据库初始化失败！" -ForegroundColor Red
        Write-Host "错误代码: $($process.ExitCode)" -ForegroundColor Red
    }
} finally {
    # 删除临时文件
    if (Test-Path $tempFile) {
        Remove-Item $tempFile -Force
    }
}

Write-Host "`n按任意键退出..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")