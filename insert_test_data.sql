USE campus_announce;

INSERT INTO sys_department (dept_name, dept_code) VALUES
('计算机学院', 'CS'),
('软件学院', 'SE'),
('信息工程学院', 'IE'),
('电子工程学院', 'EE'),
('机械工程学院', 'ME');

INSERT INTO sys_user (username, password, real_name, user_type, dept_id, email, phone, student_no) VALUES
('admin', 'admin123', '系统管理员', 1, NULL, 'admin@campus.edu', '13800138000', NULL),
('cs_admin', 'admin123', '计算机学院管理员', 2, 1, 'cs_admin@campus.edu', '13800138001', NULL),
('teacher1', '123456', '张老师', 3, 1, 'teacher1@campus.edu', '13800138002', 'T20240001'),
('student1', '123456', '李同学', 4, 1, 'student1@campus.edu', '13800138003', 'S20240001');
