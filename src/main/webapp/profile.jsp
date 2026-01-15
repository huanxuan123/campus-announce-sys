<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>个人信息 - 校园公告系统</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/profile.css">
</head>
<body>
    <div class="header">
        <h1>校园公告系统</h1>
        <div class="user-info">
            <span id="userName">加载中...</span>
            <button class="btn-logout" onclick="logout()">退出登录</button>
        </div>
    </div>
    
    <div class="container">
        <div class="sidebar">
            <a href="${pageContext.request.contextPath}/index.jsp" class="nav-item">首页</a>
            <a href="${pageContext.request.contextPath}/profile.jsp" class="nav-item active">个人信息</a>
            <a href="${pageContext.request.contextPath}/user-list.jsp" class="nav-item">用户管理</a>
            <a href="${pageContext.request.contextPath}/announcement-list.jsp" class="nav-item">公告管理</a>
            <a href="#" class="nav-item">统计分析</a>
        </div>
        
        <div class="main-content">
            <div class="page-header">
                <h2>个人信息</h2>
            </div>
            
            <div class="profile-form">
                <form id="profileForm">
                    <input type="hidden" id="userId" name="id">
                    
                    <div class="form-group">
                        <label for="username">用户名</label>
                        <input type="text" id="username" name="username" readonly>
                    </div>
                    
                    <div class="form-group">
                        <label for="realName">真实姓名 *</label>
                        <input type="text" id="realName" name="realName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="userType">用户类型</label>
                        <input type="text" id="userType" name="userType" readonly>
                    </div>
                    
                    <div class="form-group">
                        <label for="deptName">所属部门</label>
                        <input type="text" id="deptName" name="deptName" readonly>
                    </div>
                    
                    <div class="form-group">
                        <label for="studentNo">学号/工号</label>
                        <input type="text" id="studentNo" name="studentNo" readonly>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">邮箱</label>
                        <input type="email" id="email" name="email">
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">手机号</label>
                        <input type="tel" id="phone" name="phone">
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-save" onclick="saveProfile()">保存修改</button>
                        <button type="button" class="btn-cancel" onclick="resetForm()">重置</button>
                    </div>
                </form>
            </div>
            
            <div class="password-section">
                <h3>修改密码</h3>
                <form id="passwordForm">
                    <div class="form-group">
                        <label for="oldPassword">原密码 *</label>
                        <input type="password" id="oldPassword" name="oldPassword" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="newPassword">新密码 *</label>
                        <input type="password" id="newPassword" name="newPassword" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="confirmPassword">确认新密码 *</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-save" onclick="savePassword()">修改密码</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <div id="message" class="message"></div>
    
    <!-- 引入通用工具和业务逻辑 -->
    <script>
        // 设置全局配置
        var contextPath = '${pageContext.request.contextPath}';
    </script>
    <script src="${pageContext.request.contextPath}/static/js/common.js"></script>
    <script src="${pageContext.request.contextPath}/static/js/profile.js"></script>
</body>
</html>
