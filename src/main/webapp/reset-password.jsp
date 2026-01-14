<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>重置密码 - 校园公告系统</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/login.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <h1>重置密码</h1>
            <p class="subtitle">请输入您的新密码</p>
            
            <form id="resetForm" onsubmit="return false;">
                <div class="form-group">
                    <label for="newPassword">新密码</label>
                    <input type="password" id="newPassword" name="newPassword" placeholder="请输入新密码" required>
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">确认密码</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="请再次输入新密码" required>
                </div>
                
                <button type="submit" class="btn-primary" id="submitBtn">重置密码</button>
            </form>
            
            <div class="links">
                <a href="/login.jsp">返回登录</a>
            </div>
        </div>
    </div>

    <!-- 引入通用工具和业务逻辑 -->
    <script>
        // 设置全局配置
        var contextPath = '${pageContext.request.contextPath}';
    </script>
    <script src="${pageContext.request.contextPath}/static/js/common.js"></script>
    <script src="${pageContext.request.contextPath}/static/js/reset-password.js"></script>
</body>
</html>