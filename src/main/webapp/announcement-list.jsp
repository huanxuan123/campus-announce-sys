<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>公告管理 - 校园公告系统</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/css/user.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px 32px;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .header .icon {
            font-size: 32px;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
        }
        
        .btn-logout {
            padding: 8px 20px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .btn-logout:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .toolbar {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
            padding: 0 32px;
        }
        
        .btn {
            padding: 10px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .btn-secondary {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
        }
        
        .btn-secondary:hover {
            background: #f0f0f0;
            color: white;
        }
        
        .search-bar {
            display: flex;
            gap: 12px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            align-items: center;
        }
        
        .search-input {
            flex: 1;
            padding: 10px 16px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s ease;
        }
        
        .search-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }
        
        .search-select {
            padding: 10px 16px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            background: white;
            outline: none;
            cursor: pointer;
            transition: border-color 0.3s ease;
        }
        
        .search-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }
        
        .btn-search {
            background: #667eea;
            color: white;
            padding: 10px 24px;
            border-radius: 6px;
        }
        
        .btn-search:hover {
            background: #556b2f;
        }
        
        .table-wrapper {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        
        thead {
            background: #f8f9fa;
        }
        
        th {
            padding: 16px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #e0e0e0;
            font-size: 14px;
        }
        
        td {
            padding: 16px;
            border-bottom: 1px solid #f0f0f0;
            color: #555;
            font-size: 14px;
            transition: background-color 0.2s ease;
        }
        
        tr:hover {
            background-color: #f8f9fa;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .badge-1 {
            background: #e3f2fd;
            color: #1565c0;
        }
        
        .badge-2 {
            background: #f3e5f5;
            color: #6a1b9a;
        }
        
        .badge-3 {
            background: #e8f5e9;
            color: #2e7d32;
        }
        
        .badge-1 {
            background: #667eea;
            color: white;
        }
        
        .badge-2 {
            background: #764ba2;
            color: white;
        }
        
        .status-0 {
            background: #ffcccc;
            color: #b71c1c;
        }
        
        .status-1 {
            background: #c8e6c9;
            color: #1b5e20;
        }
        
        .btn-sm {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        
        .btn-edit {
            background: #667eea;
            color: white;
        }
        
        .btn-edit:hover {
            background: #556b2f;
        }
        
        .btn-delete {
            background: #dc3545;
            color: white;
        }
        
        .btn-delete:hover {
            background: #b91c48;
        }
        
        .btn-cancel-top {
            background: #f59e0b;
            color: #666;
            border: 1px solid #d4a371;
        }
        
        .btn-cancel-top:hover {
            background: #d4a371;
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            max-width: 700px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: #333;
        }
        
        .close {
            font-size: 28px;
            cursor: pointer;
            color: #999;
            transition: color 0.2s ease;
            line-height: 1;
        }
        
        .close:hover {
            color: #666;
        }
        
        .modal-body {
            padding: 24px;
            max-height: 60vh;
            overflow-y: auto;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
            font-size: 14px;
        }
        
        .form-input, .form-textarea, .form-select {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s ease;
            font-family: inherit;
        }
        
        .form-input:focus, .form-textarea:focus, .form-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }
        
        .form-textarea {
            min-height: 200px;
            resize: vertical;
            font-family: inherit;
        }
        
        .form-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
        }
        
        .announcement-detail {
            line-height: 1.8;
            color: #555;
        }
        
        .detail-row {
            display: flex;
            margin-bottom: 12px;
            align-items: center;
        }
        
        .detail-row .label {
            font-weight: 500;
            color: #667eea;
            min-width: 80px;
        }
        
        .detail-row span {
            color: #333;
        }
        
        .detail-content {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 8px;
            margin-top: 12px;
            line-height: 1.6;
        }
        
        .message {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            max-width: 400px;
            display: none;
            animation: slideIn 0.3s ease;
        }
        
        .message.success {
            background: #d4edda;
            color: #155724;
            border-left: 4px solid #c3e6cb;
        }
        
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border-left: 4px solid #f5c6cb;
        }
        
        .loading {
            text-align: center;
            padding: 60px;
            color: #999;
        }
        
        .loading::after {
            content: '';
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-radius: 50%;
            border-top-color: #667eea;
            border-right-color: transparent;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        
        .empty-state {
            text-align: center;
            padding: 80px 40px;
            color: #999;
        }
        
        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 16px;
            color: #ccc;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="icon">📢</span> 公告管理</h1>
            <div class="user-info">
                <span id="userName">加载中...</span>
                <button class="btn-logout" onclick="logout()">退出登录</button>
            </div>
        </div>

        <div class="toolbar">
            <button class="btn btn-primary" onclick="showCreateModal()">
                <span style="font-size: 16px;">➕</span> 新建公告
            </button>
            <button class="btn btn-secondary" onclick="loadAnnouncements()">
                <span style="font-size: 16px;">🔄</span> 刷新列表
            </button>
        </div>

        <div class="search-bar">
            <input type="text" id="searchTitle" placeholder="🔍 搜索公告标题..." class="search-input">
            <select id="searchType" class="search-select">
                <option value="">所有类型</option>
                <option value="1">📢 通知</option>
                <option value="2">🎉 活动</option>
                <option value="3">📄 其他</option>
            </select>
            <select id="searchScope" class="search-select">
                <option value="">所有范围</option>
                <option value="1">🌐 全校</option>
                <option value="2">🏫 院系</option>
            </select>
            <button class="btn btn-search" onclick="loadAnnouncements()">
                <span style="font-size: 16px;">🔍</span> 搜索
            </button>
        </div>

        <div class="table-wrapper">
            <table id="announcementTable">
                <thead>
                    <tr>
                        <th style="width: 35%;">标题</th>
                        <th style="width: 10%;">类型</th>
                        <th style="width: 10%;">范围</th>
                        <th style="width: 15%;">发布人</th>
                        <th style="width: 15%;">发布时间</th>
                        <th style="width: 10%;">浏览量</th>
                        <th style="width: 10%;">置顶</th>
                        <th style="width: 10%;">状态</th>
                        <th style="width: 15%;">操作</th>
                    </tr>
                </thead>
                <tbody id="announcementList">
                    <tr>
                        <td colspan="9" class="loading">
                            <div class="loading"></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="message" class="message"></div>

        <div id="createModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>➕ 新建公告</h2>
                    <span class="close" onclick="closeModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="announcementForm">
                        <div class="form-group">
                            <label>标题 <span class="required">*</span></label>
                            <input type="text" id="title" name="title" required class="form-input" placeholder="请输入公告标题">
                        </div>
                        <div class="form-group">
                            <label>公告类型 <span class="required">*</span></label>
                            <select id="announcementType" name="announcementType" required class="form-input">
                                <option value="1">📢 通知</option>
                                <option value="2">🎉 活动</option>
                                <option value="3">📄 其他</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>公告范围 <span class="required">*</span></label>
                            <select id="scope" name="scope" required class="form-input" onchange="handleScopeChange()">
                                <option value="1">🌐 全校</option>
                                <option value="2">🏫 院系</option>
                            </select>
                        </div>
                        <div class="form-group" id="deptGroup" style="display: none;">
                            <label>所属院系 <span class="required">*</span></label>
                            <select id="deptId" name="deptId" class="form-input">
                                <option value="">请选择院系</option>
                                <c:forEach items="${departments}" var="dept">
                                    <option value="${dept.id}">${dept.deptName}</option>
                                </c:forEach>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>内容 <span class="required">*</span></label>
                            <textarea id="content" name="content" required class="form-textarea" rows="10" placeholder="请输入公告内容"></textarea>
                        </div>
                        <div class="form-group">
                            <label>截止时间</label>
                            <input type="datetime-local" id="deadline" name="deadline" class="form-input">
                        </div>
                        <div class="form-group">
                            <label>是否置顶</label>
                            <input type="checkbox" id="isTop" name="isTop" onchange="handleTopChange()">
                        </div>
                        <div class="form-group" id="topOrderGroup" style="display: none;">
                            <label>置顶顺序</label>
                            <input type="number" id="topOrder" name="topOrder" min="1" max="10" class="form-input" placeholder="数字越小越靠前">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <span style="font-size: 16px;">✓</span> 发布
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="closeModal()">
                                <span style="font-size: 16px;">✕</span> 取消
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div id="editModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>✏️ 编辑公告</h2>
                    <span class="close" onclick="closeEditModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="editForm">
                        <input type="hidden" id="editId" name="id">
                        <div class="form-group">
                            <label>标题 <span class="required">*</span></label>
                            <input type="text" id="editTitle" name="title" required class="form-input">
                        </div>
                        <div class="form-group">
                            <label>公告类型 <span class="required">*</span></label>
                            <select id="editAnnouncementType" name="announcementType" required class="form-input">
                                <option value="1">📢 通知</option>
                                <option value="2">🎉 活动</option>
                                <option value="3">📄 其他</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>公告范围 <span class="required">*</span></label>
                            <select id="editScope" name="scope" required class="form-input" onchange="handleEditScopeChange()">
                                <option value="1">🌐 全校</option>
                                <option value="2">🏫 院系</option>
                            </select>
                        </div>
                        <div class="form-group" id="editDeptGroup" style="display: none;">
                            <label>所属院系 <span class="required">*</span></label>
                            <select id="editDeptId" name="deptId" class="form-input">
                                <option value="">请选择院系</option>
                                <c:forEach items="${departments}" var="dept">
                                    <option value="${dept.id}">${dept.deptName}</option>
                                </c:forEach>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>内容 <span class="required">*</span></label>
                            <textarea id="editContent" name="content" required class="form-textarea" rows="10"></textarea>
                        </div>
                        <div class="form-group">
                            <label>截止时间</label>
                            <input type="datetime-local" id="editDeadline" name="deadline" class="form-input">
                        </div>
                        <div class="form-group">
                            <label>是否置顶</label>
                            <input type="checkbox" id="editIsTop" name="isTop" onchange="handleEditTopChange()">
                        </div>
                        <div class="form-group" id="editTopOrderGroup" style="display: none;">
                            <label>置顶顺序</label>
                            <input type="number" id="editTopOrder" name="topOrder" min="1" max="10" class="form-input" placeholder="数字越小越靠前">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">
                                <span style="font-size: 16px;">💾</span> 更新
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="closeEditModal()">
                                <span style="font-size: 16px;">✕</span> 取消
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div id="viewModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>📄 公告详情</h2>
                    <span class="close" onclick="closeViewModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="announcement-detail">
                        <h3 id="viewTitle"></h3>
                        <div class="detail-row">
                            <span class="label">类型：</span>
                            <span id="viewType"></span>
                        </div>
                        <div class="detail-row">
                            <span class="label">范围：</span>
                            <span id="viewScope"></span>
                        </div>
                        <div class="detail-row">
                            <span class="label">发布人：</span>
                            <span id="viewPublisher"></span>
                        </div>
                        <div class="detail-row">
                            <span class="label">发布时间：</span>
                            <span id="viewPublishTime"></span>
                        </div>
                        <div class="detail-row">
                            <span class="label">浏览量：</span>
                            <span id="viewCount"></span>
                        </div>
                        <div class="detail-row">
                            <span class="label">截止时间：</span>
                            <span id="viewDeadline"></span>
                        </div>
                        <div class="detail-content">
                            <span class="label">内容：</span>
                            <div id="viewContent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentUser = null;
        let departments = [];

        document.addEventListener('DOMContentLoaded', function() {
            loadUserInfo();
            loadDepartments();
            loadAnnouncements();
        });

        function loadUserInfo() {
            fetch('/api/currentUser')
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200 && data.data) {
                        currentUser = data.data;
                        document.getElementById('userName').textContent = '欢迎，' + currentUser.realName;
                        
                        if (currentUser.userType === 3 || currentUser.userType === 4) {
                            document.querySelector('.toolbar').style.display = 'none';
                        }
                    } else {
                        window.location.href = '/login.jsp';
                    }
                })
                .catch(error => {
                    console.error('获取用户信息失败:', error);
                    window.location.href = '/login.jsp';
                });
        }

        function loadDepartments() {
            fetch('/api/department/list')
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        departments = data.data;
                    }
                });
        }

        function loadAnnouncements() {
            const title = document.getElementById('searchTitle').value;
            const announcementType = document.getElementById('searchType').value;
            const scope = document.getElementById('searchScope').value;
            
            let url = '/api/announcement/list';
            const params = new URLSearchParams();
            if (title) params.append('title', title);
            if (announcementType) params.append('announcementType', announcementType);
            if (scope) params.append('scope', scope);
            
            fetch(url + '?' + params.toString())
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        renderAnnouncements(data.data);
                    } else {
                        showMessage(data.message || '加载失败', 'error');
                    }
                })
                .catch(error => {
                    showMessage('网络错误：' + error.message, 'error');
                });
        }

        function renderAnnouncements(announcements) {
            const tbody = document.getElementById('announcementList');
            
            if (!announcements || announcements.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="9" class="empty-state">
                            <div class="empty-state-icon">📭</div>
                            <div>暂无公告数据</div>
                        </td>
                    </tr>
                `;
                return;
            }
            
            tbody.innerHTML = '';
            
            announcements.forEach(ann => {
                const typeLabels = {1: '📢 通知', 2: '🎉 活动', 3: '📄 其他'};
                const scopeLabels = {1: '🌐 全校', 2: '🏫 院系'};
                const statusLabels = {0: '草稿', 1: '已发布'};
                
                const tr = document.createElement('tr');
                
                const tdTitle = document.createElement('td');
                const link = document.createElement('a');
                link.href = '#';
                link.onclick = function() { viewAnnouncement(ann.id); };
                link.textContent = ann.title;
                link.style.color = '#667eea';
                link.style.textDecoration = 'none';
                link.style.fontWeight = '500';
                tdTitle.appendChild(link);
                
                const tdType = document.createElement('td');
                const spanType = document.createElement('span');
                spanType.className = 'badge badge-' + ann.announcementType;
                spanType.textContent = typeLabels[ann.announcementType];
                tdType.appendChild(spanType);
                
                const tdScope = document.createElement('td');
                const spanScope = document.createElement('span');
                spanScope.className = 'badge badge-' + ann.scope;
                spanScope.textContent = scopeLabels[ann.scope];
                tdScope.appendChild(spanScope);
                
                const tdPublisher = document.createElement('td');
                tdPublisher.textContent = ann.publisherName || '-';
                tr.appendChild(tdPublisher);
                
                const tdPublishTime = document.createElement('td');
                tdPublishTime.textContent = formatDate(ann.publishTime);
                tr.appendChild(tdPublishTime);
                
                const tdViewCount = document.createElement('td');
                tdViewCount.textContent = ann.viewCount || 0;
                tr.appendChild(tdViewCount);
                
                const tdIsTop = document.createElement('td');
                tdIsTop.textContent = ann.isTop ? '是 (' + ann.topOrder + ')' : '否';
                tr.appendChild(tdIsTop);
                
                const tdStatus = document.createElement('td');
                const spanStatus = document.createElement('span');
                spanStatus.className = 'status status-' + ann.status;
                spanStatus.textContent = statusLabels[ann.status];
                tdStatus.appendChild(spanStatus);
                
                const tdActions = document.createElement('td');
                tdActions.style.textAlign = 'right';
                
                const btnEdit = document.createElement('button');
                btnEdit.className = 'btn btn-sm btn-edit';
                btnEdit.textContent = '✏️ 编辑';
                btnEdit.onclick = function() { editAnnouncement(ann.id); };
                tdActions.appendChild(btnEdit);
                
                const btnDelete = document.createElement('button');
                btnDelete.className = 'btn btn-sm btn-delete';
                btnDelete.textContent = '🗑️ 删除';
                btnDelete.onclick = function() { deleteAnnouncement(ann.id); };
                tdActions.appendChild(btnDelete);
                
                if (ann.isTop) {
                    const btnCancelTop = document.createElement('button');
                    btnCancelTop.className = 'btn btn-sm btn-cancel-top';
                    btnCancelTop.textContent = '📌 取消置顶';
                    btnCancelTop.onclick = function() { cancelTop(ann.id); };
                    tdActions.appendChild(btnCancelTop);
                }
                
                tbody.appendChild(tr);
            });
        }

        function formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        function showCreateModal() {
            document.getElementById('createModal').style.display = 'block';
            document.getElementById('announcementForm').reset();
            handleScopeChange();
        }

        function closeModal() {
            document.getElementById('createModal').style.display = 'none';
        }

        function editAnnouncement(id) {
            fetch('/api/announcement/' + id)
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        const ann = data.data;
                        document.getElementById('editId').value = ann.id;
                        document.getElementById('editTitle').value = ann.title;
                        document.getElementById('editAnnouncementType').value = ann.announcementType;
                        document.getElementById('editScope').value = ann.scope;
                        document.getElementById('editDeptId').value = ann.deptId || '';
                        document.getElementById('editContent').value = ann.content;
                        document.getElementById('editDeadline').value = ann.deadline ? ann.deadline.substring(0, 16) : '';
                        document.getElementById('editIsTop').checked = ann.isTop === 1;
                        document.getElementById('editTopOrder').value = ann.topOrder || 1;
                        
                        handleEditScopeChange();
                        document.getElementById('editModal').style.display = 'block';
                    } else {
                        showMessage(data.message || '加载失败', 'error');
                    }
                })
                .catch(error => {
                    showMessage('网络错误：' + error.message, 'error');
                });
        }

        function closeEditModal() {
            document.getElementById('editModal').style.display = 'none';
        }

        function handleScopeChange() {
            const scope = document.getElementById('scope').value;
            const deptGroup = document.getElementById('deptGroup');
            const topOrderGroup = document.getElementById('topOrderGroup');
            
            if (scope === '2') {
                deptGroup.style.display = 'block';
                topOrderGroup.style.display = 'block';
            } else {
                deptGroup.style.display = 'none';
                topOrderGroup.style.display = 'none';
            }
        }

        function handleEditScopeChange() {
            const scope = document.getElementById('editScope').value;
            const editDeptGroup = document.getElementById('editDeptGroup');
            const editTopOrderGroup = document.getElementById('editTopOrderGroup');
            
            if (scope === '2') {
                editDeptGroup.style.display = 'block';
                editTopOrderGroup.style.display = 'block';
            } else {
                editDeptGroup.style.display = 'none';
                editTopOrderGroup.style.display = 'none';
            }
        }

        function handleTopChange() {
            const isTop = document.getElementById('isTop').checked;
            const topOrderGroup = document.getElementById('topOrderGroup');
            
            if (isTop) {
                topOrderGroup.style.display = 'block';
            } else {
                topOrderGroup.style.display = 'none';
            }
        }

        function handleEditTopChange() {
            const isTop = document.getElementById('editIsTop').checked;
            const editTopOrderGroup = document.getElementById('editTopOrderGroup');
            
            if (isTop) {
                editTopOrderGroup.style.display = 'block';
            } else {
                editTopOrderGroup.style.display = 'none';
            }
        }

        function saveAnnouncement(e) {
            e.preventDefault();
            
            const announcement = {
                title: document.getElementById('title').value,
                announcementType: parseInt(document.getElementById('announcementType').value),
                scope: parseInt(document.getElementById('scope').value),
                content: document.getElementById('content').value,
                deadline: document.getElementById('deadline').value || null,
                isTop: document.getElementById('isTop').checked ? 1 : 0,
                topOrder: document.getElementById('isTop').checked ? parseInt(document.getElementById('topOrder').value) : 0
            };
            
            if (announcement.scope === 2) {
                announcement.deptId = parseInt(document.getElementById('deptId').value);
            }
            
            fetch('/api/announcement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(announcement)
            })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    showMessage('公告创建成功', 'success');
                    closeModal();
                    loadAnnouncements();
                } else {
                    showMessage(data.message || '创建失败', 'error');
                }
            })
            .catch(error => {
                showMessage('网络错误：' + error.message, 'error');
            });
        }

        function updateAnnouncement(e) {
            e.preventDefault();
            
            const announcement = {
                id: parseInt(document.getElementById('editId').value),
                title: document.getElementById('editTitle').value,
                announcementType: parseInt(document.getElementById('editAnnouncementType').value),
                scope: parseInt(document.getElementById('editScope').value),
                content: document.getElementById('editContent').value,
                deadline: document.getElementById('editDeadline').value || null,
                isTop: document.getElementById('editIsTop').checked ? 1 : 0,
                topOrder: document.getElementById('editIsTop').checked ? parseInt(document.getElementById('editTopOrder').value) : 0
            };
            
            if (announcement.scope === 2) {
                announcement.deptId = parseInt(document.getElementById('editDeptId').value);
            }
            
            fetch('/api/announcement/' + announcement.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(announcement)
            })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    showMessage('公告更新成功', 'success');
                    closeEditModal();
                    loadAnnouncements();
                } else {
                    showMessage(data.message || '更新失败', 'error');
                }
            })
            .catch(error => {
                showMessage('网络错误：' + error.message, 'error');
            });
        }

        function deleteAnnouncement(id) {
            if (!confirm('确定要删除这条公告吗？')) {
                return;
            }
            
            fetch('/api/announcement/' + id, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    showMessage('删除成功', 'success');
                    loadAnnouncements();
                } else {
                    showMessage(data.message || '删除失败', 'error');
                }
            })
            .catch(error => {
                showMessage('网络错误：' + error.message, 'error');
            });
        }

        function setTopStatus(id, isTop, topOrder) {
            const params = new URLSearchParams();
            params.append('isTop', isTop);
            if (isTop) {
                params.append('topOrder', topOrder || 1);
            }
            
            fetch('/api/announcement/' + id + '/top?' + params.toString(), {
                method: 'PUT'
            })
            .then(response => response.json())
            .then(data => {
                if (data.code === 200) {
                    showMessage('设置成功', 'success');
                    loadAnnouncements();
                } else {
                    showMessage(data.message || '设置失败', 'error');
                }
            })
            .catch(error => {
                showMessage('网络错误：' + error.message, 'error');
            });
        }

        function cancelTop(id) {
            setTopStatus(id, 0, 0);
        }

        function viewAnnouncement(id) {
            fetch('/api/announcement/' + id)
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        const ann = data.data;
                        const typeLabels = {1: '📢 通知', 2: '🎉 活动', 3: '📄 其他'};
                        const scopeLabels = {1: '🌐 全校', 2: '🏫 院系'};
                        
                        document.getElementById('viewTitle').textContent = ann.title;
                        document.getElementById('viewType').textContent = typeLabels[ann.announcementType];
                        document.getElementById('viewScope').textContent = scopeLabels[ann.scope];
                        document.getElementById('viewPublisher').textContent = ann.publisherName || '-';
                        document.getElementById('viewPublishTime').textContent = formatDate(ann.publishTime);
                        document.getElementById('viewCount').textContent = ann.viewCount || 0;
                        document.getElementById('viewDeadline').textContent = ann.deadline ? formatDate(ann.deadline) : '无';
                        document.getElementById('viewContent').innerHTML = ann.content.replace(/\n/g, '<br>');
                        
                        document.getElementById('viewModal').style.display = 'block';
                        
                        fetch('/api/announcement/' + id + '/read', {
                            method: 'POST'
                        });
                    } else {
                        showMessage(data.message || '加载失败', 'error');
                    }
                });
        }

        function closeViewModal() {
            document.getElementById('viewModal').style.display = 'none';
        }

        function showMessage(msg, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = msg;
            messageDiv.className = 'message message-' + type;
            messageDiv.style.display = 'block';
            
            if (type === 'success') {
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 3000);
            }
        }

        function logout() {
            if (confirm('确定要退出登录吗？')) {
                fetch('/api/logout', {
                    method: 'POST'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 200) {
                        window.location.href = '/login.jsp';
                    }
                });
            });
        }

        document.getElementById('announcementForm').addEventListener('submit', saveAnnouncement);
        document.getElementById('editForm').addEventListener('submit', updateAnnouncement);
    </script>
</body>
</html>
