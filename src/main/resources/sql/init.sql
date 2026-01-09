CREATE DATABASE IF NOT EXISTS campus_announce DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE campus_announce;

DROP TABLE IF EXISTS sys_announcement_read;
DROP TABLE IF EXISTS sys_attachment;
DROP TABLE IF EXISTS sys_announcement;
DROP TABLE IF EXISTS sys_department;
DROP TABLE IF EXISTS sys_user;
DROP TABLE IF EXISTS sys_config;

CREATE TABLE sys_department (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '院系ID',
    dept_name VARCHAR(100) NOT NULL COMMENT '院系名称',
    dept_code VARCHAR(50) NOT NULL UNIQUE COMMENT '院系编码',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_dept_code (dept_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='院系表';

CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    real_name VARCHAR(50) NOT NULL COMMENT '真实姓名',
    user_type TINYINT NOT NULL COMMENT '用户类型：1-超级管理员，2-院系管理员，3-教师，4-学生',
    dept_id BIGINT COMMENT '所属院系ID',
    email VARCHAR(100) COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    student_no VARCHAR(50) COMMENT '学号/工号',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (dept_id) REFERENCES sys_department(id) ON DELETE SET NULL,
    INDEX idx_username (username),
    INDEX idx_student_no (student_no),
    INDEX idx_dept_id (dept_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

CREATE TABLE sys_announcement (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '公告ID',
    title VARCHAR(200) NOT NULL COMMENT '公告标题',
    content TEXT NOT NULL COMMENT '公告内容',
    announcement_type TINYINT NOT NULL COMMENT '公告类型：1-通知，2-活动，3-其他',
    scope TINYINT NOT NULL COMMENT '公告范围：1-全校，2-院系',
    dept_id BIGINT COMMENT '院系ID（院系公告时必填）',
    publisher_id BIGINT NOT NULL COMMENT '发布人ID',
    publish_time DATETIME NOT NULL COMMENT '发布时间',
    deadline DATETIME COMMENT '截止时间',
    is_top TINYINT DEFAULT 0 COMMENT '是否置顶：0-否，1-是',
    top_order INT DEFAULT 0 COMMENT '置顶顺序',
    view_count INT DEFAULT 0 COMMENT '浏览次数',
    status TINYINT DEFAULT 1 COMMENT '状态：0-删除，1-正常',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (dept_id) REFERENCES sys_department(id) ON DELETE CASCADE,
    FOREIGN KEY (publisher_id) REFERENCES sys_user(id) ON DELETE CASCADE,
    INDEX idx_scope_dept (scope, dept_id),
    INDEX idx_publish_time (publish_time),
    INDEX idx_is_top (is_top, top_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告表';

CREATE TABLE sys_attachment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '附件ID',
    announcement_id BIGINT NOT NULL COMMENT '公告ID',
    file_name VARCHAR(200) NOT NULL COMMENT '文件名',
    file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
    file_size BIGINT COMMENT '文件大小（字节）',
    file_type VARCHAR(50) COMMENT '文件类型',
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
    FOREIGN KEY (announcement_id) REFERENCES sys_announcement(id) ON DELETE CASCADE,
    INDEX idx_announcement_id (announcement_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='附件表';

CREATE TABLE sys_announcement_read (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '阅读记录ID',
    announcement_id BIGINT NOT NULL COMMENT '公告ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    read_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '阅读时间',
    FOREIGN KEY (announcement_id) REFERENCES sys_announcement(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES sys_user(id) ON DELETE CASCADE,
    UNIQUE KEY uk_announcement_user (announcement_id, user_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告阅读记录表';

CREATE TABLE sys_config (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '配置ID',
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value VARCHAR(500) NOT NULL COMMENT '配置值',
    config_desc VARCHAR(200) COMMENT '配置描述',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

INSERT INTO sys_config (config_key, config_value, config_desc) VALUES
('announcement_retention_days', '365', '公告保留天数'),
('max_top_announcements', '5', '置顶公告最大数量'),
('max_attachment_size', '10485760', '附件最大大小（字节）'),
('allowed_file_types', 'doc,docx,pdf,jpg,jpeg,png,gif', '允许上传的文件类型');

INSERT INTO sys_department (dept_name, dept_code) VALUES
('计算机学院', 'CS'),
('软件学院', 'SE'),
('信息工程学院', 'IE'),
('电子工程学院', 'EE'),
('机械工程学院', 'ME');

INSERT INTO sys_user (username, password, real_name, user_type, dept_id, email, phone, student_no) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '系统管理员', 1, NULL, 'admin@campus.edu', '13800138000', NULL),
('cs_admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '计算机学院管理员', 2, 1, 'cs_admin@campus.edu', '13800138001', NULL),
('teacher1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '张老师', 3, 1, 'teacher1@campus.edu', '13800138002', 'T20240001'),
('student1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '李同学', 4, 1, 'student1@campus.edu', '13800138003', 'S20240001');