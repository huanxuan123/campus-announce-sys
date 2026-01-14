<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>校园公告系统 - 登录</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/login.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <h1>校园公告系统</h1>
                <p>欢迎登录</p>
            </div>
            
            <form id="loginForm" class="login-form" method="POST">
                <div class="form-group">
                    <label for="username">用户名</label>
                    <input type="text" id="username" name="username" placeholder="请输入用户名" required>
                </div>
                
                <div class="form-group">
                    <label for="password">密码</label>
                    <input type="password" id="password" name="password" placeholder="请输入密码" required>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-login">登录</button>
                    <a href="${pageContext.request.contextPath}/register.jsp" class="btn-register">注册账号</a>
                </div>
                
                <div class="form-footer">
                    <a href="${pageContext.request.contextPath}/forgot-password.jsp">忘记密码？</a>
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
    <script src="${pageContext.request.contextPath}/static/js/login.js"></script>
</body>
</html>
