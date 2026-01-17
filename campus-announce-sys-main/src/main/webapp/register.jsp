<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>校园公告系统 - 注册</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/login.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box register-box">
            <div class="login-header">
                <h1>校园公告系统</h1>
                <p>注册账号</p>
            </div>
            
            <form id="registerForm" class="login-form">
                <div class="form-group">
                    <label for="username">用户名</label>
                    <input type="text" id="username" name="username" placeholder="请输入用户名" required>
                </div>
                
                <div class="form-group">
                    <label for="password">密码</label>
                    <input type="password" id="password" name="password" placeholder="请输入密码" required>
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">确认密码</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="请再次输入密码" required>
                </div>
                
                <div class="form-group">
                    <label for="realName">真实姓名</label>
                    <input type="text" id="realName" name="realName" placeholder="请输入真实姓名" required>
                </div>
                
                <div class="form-group">
                    <label for="userType">用户类型</label>
                    <select id="userType" name="userType" required>
                        <option value="">请选择用户类型</option>
                        <option value="3">教师</option>
                        <option value="4">学生</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="deptId">所属部门</label>
                    <select id="deptId" name="deptId" required>
                        <option value="">请选择部门</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="studentNo">学号/工号</label>
                    <input type="text" id="studentNo" name="studentNo" placeholder="请输入学号或工号">
                </div>
                
                <div class="form-group">
                    <label for="email">邮箱</label>
                    <input type="email" id="email" name="email" placeholder="请输入邮箱">
                </div>
                
                <div class="form-group">
                    <label for="phone">手机号</label>
                    <input type="tel" id="phone" name="phone" placeholder="请输入手机号">
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-login">注册</button>
                    <a href="${pageContext.request.contextPath}/login.jsp" class="btn-register">返回登录</a>
                </div>
            </form>
            
            <div id="message" class="message"></div>
        </div>
    </div>
    
    <!-- 引入通用工具和业务逻辑 -->
    <script>
        // 设置全局配置
        var contextPath = '${pageContext.request.contextPath}';
    </script>
    <script src="${pageContext.request.contextPath}/static/js/common.js"></script>
    <script src="${pageContext.request.contextPath}/static/js/register.js"></script>
</body>
</html>
