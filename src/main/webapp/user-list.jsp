<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户管理 - 校园公告系统</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/user.css">
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
            <a href="${pageContext.request.contextPath}/profile.jsp" class="nav-item">个人信息</a>
            <a href="${pageContext.request.contextPath}/user-list.jsp" class="nav-item active">用户管理</a>
            <a href="${pageContext.request.contextPath}/announcement-list.jsp" class="nav-item">公告管理</a>
            <a href="#" class="nav-item">统计分析</a>
        </div>
        
        <div class="main-content">
            <div class="page-header">
                <h2>用户管理</h2>
                <button class="btn-add" onclick="showAddModal()">添加用户</button>
            </div>
            
            <div class="search-bar">
                <input type="text" id="searchInput" placeholder="搜索用户名、真实姓名、学号/工号">
                <select id="userTypeFilter">
                    <option value="">全部类型</option>
                    <option value="1">系统管理员</option>
                    <option value="2">部门管理员</option>
                    <option value="3">教师</option>
                    <option value="4">学生</option>
                </select>
                <select id="statusFilter">
                    <option value="">全部状态</option>
                    <option value="1">启用</option>
                    <option value="0">禁用</option>
                </select>
                <button class="btn-search" onclick="searchUsers()">搜索</button>
            </div>
            
            <div class="table-container">
                <table class="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>用户名</th>
                            <th>真实姓名</th>
                            <th>用户类型</th>
                            <th>部门</th>
                            <th>学号/工号</th>
                            <th>邮箱</th>
                            <th>手机号</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="userTableBody">
                        <tr>
                            <td colspan="10" class="loading">加载中...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <div id="userModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">添加用户</h3>
                <span class="close" onclick="closeModal()">&times;</span>
            </div>
            <form id="userForm" class="modal-body">
                <input type="hidden" id="userFormUserId" name="id">
                
                <div class="form-group">
                    <label for="username">用户名 *</label>
                    <input type="text" id="userFormUsername" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="realName">真实姓名 *</label>
                    <input type="text" id="realName" name="realName" required>
                </div>
                
                <div class="form-group">
                    <label for="userType">用户类型 *</label>
                    <select id="userType" name="userType" required>
                        <option value="">请选择</option>
                        <option value="1">系统管理员</option>
                        <option value="2">部门管理员</option>
                        <option value="3">教师</option>
                        <option value="4">学生</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="deptId">所属部门</label>
                    <select id="deptId" name="deptId">
                        <option value="">请选择</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="studentNo">学号/工号</label>
                    <input type="text" id="studentNo" name="studentNo">
                </div>
                
                <div class="form-group">
                    <label for="email">邮箱</label>
                    <input type="email" id="email" name="email">
                </div>
                
                <div class="form-group">
                    <label for="phone">手机号</label>
                    <input type="tel" id="phone" name="phone">
                </div>
                
                <div class="form-group">
                    <label for="status">状态</label>
                    <select id="status" name="status">
                        <option value="1">启用</option>
                        <option value="0">禁用</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="password">密码 *</label>
                    <input type="password" id="password" name="password" placeholder="请输入密码（至少6位）" required>
                </div>
            </form>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeModal()">取消</button>
                <button class="btn-save" onclick="saveUser()">保存</button>
            </div>
        </div>
    </div>
    
    <div id="passwordModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>修改密码</h3>
                <span class="close" onclick="closePasswordModal()">&times;</span>
            </div>
            <form id="passwordForm" class="modal-body">
                <input type="hidden" id="passwordUserId" name="id">
                
                <div class="form-group" id="oldPasswordGroup" style="display: none;">
                    <label for="oldPassword">原密码 *</label>
                    <input type="password" id="oldPassword" name="oldPassword">
                </div>
                
                <div class="form-group">
                    <label for="newPassword">新密码 *</label>
                    <input type="password" id="newPassword" name="newPassword" required>
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">确认新密码 *</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required>
                </div>
            </form>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closePasswordModal()">取消</button>
                <button class="btn-save" onclick="savePassword()">保存</button>
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
    <script src="${pageContext.request.contextPath}/static/js/user.js"></script>
</body>
</html>
