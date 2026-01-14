<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>忘记密码 - 校园公告系统</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/login.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <h1>忘记密码</h1>
            <p class="subtitle">请输入您的注册邮箱，我们将发送重置链接到您的邮箱</p>
            
            <form id="forgotForm" onsubmit="return false;">
                <div class="form-group">
                    <label for="email">邮箱</label>
                    <input type="email" id="email" name="email" placeholder="请输入您的邮箱" required>
                </div>
                
                <button type="submit" class="btn-primary" id="submitBtn">发送重置邮件</button>
            </form>
            
            <div class="links">
                <a href="login.jsp">返回登录</a>
                <a href="register.jsp">注册账号</a>
            </div>
        </div>
    </div>

    <script src="${pageContext.request.contextPath}/static/js/forgot-password.js"></script>
</body>
</html>