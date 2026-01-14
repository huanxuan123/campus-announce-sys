<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>公告列表 - 校园公告系统</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary: #667eea;
            --primary-dark: #5568d3;
            --secondary: #764ba2;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --light: #f3f4f6;
            --gray: #6b7280;
            --border: #e5e7eb;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .wrapper {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            padding: 32px;
            border-radius: 12px;
            margin-bottom: 32px;
            box-shadow: var(--shadow-lg);
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }
        
        .header-title {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .header-title h1 {
            font-size: 32px;
            font-weight: 700;
        }
        
        .header-title i {
            font-size: 36px;
            opacity: 0.9;
        }
        
        .header-actions {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .user-card {
            background: rgba(255, 255, 255, 0.15);
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(10px);
        }
        
        .btn {
            padding: 10px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
        }
        
        .btn-primary {
            background: var(--primary);
            color: white;
            box-shadow: var(--shadow);
        }
        
        .btn-primary:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }
        
        .btn-secondary {
            background: white;
            color: var(--primary);
            border: 2px solid white;
        }
        
        .btn-secondary:hover {
            background: transparent;
            color: white;
            border-color: white;
        }
        
        .btn-sm {
            padding: 6px 14px;
            font-size: 12px;
            border-radius: 6px;
        }
        
        .btn-edit {
            background: var(--primary);
            color: white;
        }
        
        .btn-delete {
            background: var(--danger);
            color: white;
        }
        
        .btn-top {
            background: var(--warning);
            color: white;
        }
        
        /* Main Content */
        .main-content {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 24px;
            margin-bottom: 32px;
        }
        
        .sidebar {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: var(--shadow);
            height: fit-content;
            position: sticky;
            top: 20px;
        }
        
        .sidebar-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 16px;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .filter-group {
            margin-bottom: 24px;
        }
        
        .filter-label {
            font-size: 12px;
            font-weight: 600;
            color: var(--gray);
            text-transform: uppercase;
            margin-bottom: 8px;
            display: block;
        }
        
        .filter-options {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .filter-option {
            padding: 8px 12px;
            border: 1px solid var(--border);
            border-radius: 6px;
            background: white;
            cursor: pointer;
            font-size: 13px;
            color: #4b5563;
            transition: all 0.2s;
        }
        
        .filter-option:hover {
            background: var(--light);
            border-color: var(--primary);
        }
        
        .filter-option.active {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
        }
        
        /* Search Area */
        .search-area {
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: var(--shadow);
        }
        
        .search-container {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .search-input {
            flex: 1;
            min-width: 200px;
            padding: 12px 16px;
            border: 2px solid var(--border);
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        
        .search-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .search-select {
            padding: 12px 16px;
            border: 2px solid var(--border);
            border-radius: 8px;
            font-size: 14px;
            background: white;
            cursor: pointer;
            min-width: 150px;
        }
        
        .search-select:focus {
            outline: none;
            border-color: var(--primary);
        }
        
        .btn-search {
            background: var(--primary);
            color: white;
            padding: 12px 28px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .btn-search:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
        }
        
        /* Announcements Grid */
        .announcements {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }
        
        .announcement-card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: var(--shadow);
            transition: all 0.3s ease;
            border-left: 4px solid var(--primary);
            position: relative;
            overflow: hidden;
        }
        
        .announcement-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }
        
        .announcement-card.is-top {
            border-left-color: var(--warning);
            background: linear-gradient(135deg, white 0%, #fef9e7 100%);
        }
        
        .announcement-card.is-top::before {
            content: '★ 置顶';
            position: absolute;
            top: 12px;
            right: 12px;
            background: var(--warning);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 700;
        }
        
        .announcement-header {
            margin-bottom: 12px;
        }
        
        .announcement-type {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .type-1 {
            background: #dbeafe;
            color: #1e40af;
        }
        
        .type-2 {
            background: #fce7f3;
            color: #831843;
        }
        
        .type-3 {
            background: #dbeafe;
            color: #0c4a6e;
        }
        
        .announcement-title {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin: 8px 0;
            line-height: 1.4;
            word-break: break-word;
        }
        
        .announcement-title a {
            color: inherit;
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .announcement-title a:hover {
            color: var(--primary);
        }
        
        .announcement-meta {
            display: flex;
            gap: 12px;
            margin: 12px 0 16px 0;
            font-size: 12px;
            color: var(--gray);
            flex-wrap: wrap;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .announcement-content {
            background: var(--light);
            padding: 12px;
            border-radius: 6px;
            margin: 12px 0;
            font-size: 13px;
            color: #4b5563;
            max-height: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.5;
        }
        
        .announcement-footer {
            display: flex;
            gap: 8px;
            margin-top: 16px;
            padding-top: 12px;
            border-top: 1px solid var(--border);
            flex-wrap: wrap;
        }
        
        .btn-sm:hover {
            transform: translateY(-1px);
        }
        
        .btn-edit:hover {
            background: var(--primary-dark);
        }
        
        .btn-delete:hover {
            background: #dc2626;
        }
        
        .btn-top:hover {
            background: #d97706;
        }
        
        /* Empty State */
        .empty-state {
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
            background: white;
            border-radius: 12px;
            box-shadow: var(--shadow);
        }
        
        .empty-state i {
            font-size: 48px;
            color: var(--border);
            margin-bottom: 16px;
        }
        
        .empty-state h3 {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 8px;
        }
        
        .empty-state p {
            color: var(--gray);
            margin-bottom: 24px;
        }
        
        @media (max-width: 1024px) {
            .main-content {
                grid-template-columns: 1fr;
            }
            
            .sidebar {
                position: static;
            }
            
            .announcements {
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            }
        }
        
        @media (max-width: 768px) {
            .header {
                padding: 20px;
            }
            
            .header-content {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .header-title h1 {
                font-size: 24px;
            }
            
            .announcements {
                grid-template-columns: 1fr;
            }
            
            .search-container {
                flex-direction: column;
            }
            
            .search-input, .search-select {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="header-title">
                    <i class="fas fa-bullhorn"></i>
                    <h1>校园公告</h1>
                </div>
                <div class="header-actions">
                    <div class="user-card">
                        <i class="fas fa-user-circle"></i>
                        <span>${sessionScope.user.realName}</span>
                    </div>
                    <a href="${pageContext.request.contextPath}/api/auth/logout" class="btn btn-secondary">
                        <i class="fas fa-sign-out-alt"></i> 退出
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
            <!-- Sidebar -->
            <div class="sidebar">
                <div class="sidebar-title">
                    <i class="fas fa-filter"></i> 筛选
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">公告类型</label>
                    <div class="filter-options">
                        <div class="filter-option active">
                            <i class="fas fa-th"></i> 全部
                        </div>
                        <div class="filter-option">
                            <i class="fas fa-info-circle"></i> 通知
                        </div>
                        <div class="filter-option">
                            <i class="fas fa-calendar"></i> 活动
                        </div>
                        <div class="filter-option">
                            <i class="fas fa-ellipsis-h"></i> 其他
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Content Area -->
            <div>
                <!-- Search Area -->
                <div class="search-area">
                    <div class="search-container">
                        <input type="text" class="search-input" placeholder="搜索公告标题、内容..." id="searchKeyword">
                        <select class="search-select" id="typeFilter">
                            <option value="">全部类型</option>
                            <option value="1">通知</option>
                            <option value="2">活动</option>
                            <option value="3">其他</option>
                        </select>
                        <button class="btn-search" onclick="searchAnnouncements()">
                            <i class="fas fa-search"></i> 搜索
                        </button>
                    </div>
                </div>
                
                <!-- Announcements Grid -->
                <div class="announcements" id="announcementsList">
                    <c:choose>
                        <c:when test="${empty announcements}">
                            <div class="empty-state">
                                <i class="fas fa-inbox"></i>
                                <h3>暂无公告</h3>
                                <p>当前还没有公告内容，敬请期待</p>
                            </div>
                        </c:when>
                        <c:otherwise>
                            <c:forEach var="announcement" items="${announcements}">
                                <div class="announcement-card ${announcement.isTop == 1 ? 'is-top' : ''}">
                                    <div class="announcement-header">
                                        <span class="announcement-type type-${announcement.announcementType}">
                                            <c:if test="${announcement.announcementType == 1}">📢 通知</c:if>
                                            <c:if test="${announcement.announcementType == 2}">🎉 活动</c:if>
                                            <c:if test="${announcement.announcementType == 3}">📌 其他</c:if>
                                        </span>
                                    </div>
                                    
                                    <h3 class="announcement-title">
                                        <a href="${pageContext.request.contextPath}/announcement/${announcement.id}">
                                            ${announcement.title}
                                        </a>
                                    </h3>
                                    
                                    <div class="announcement-meta">
                                        <span class="meta-item">
                                            <i class="fas fa-user"></i> ${announcement.publisherName}
                                        </span>
                                        <span class="meta-item">
                                            <i class="fas fa-calendar"></i> ${announcement.publishTime}
                                        </span>
                                        <span class="meta-item">
                                            <i class="fas fa-eye"></i> ${announcement.viewCount} 浏览
                                        </span>
                                    </div>
                                    
                                    <div class="announcement-content">
                                        ${announcement.content}
                                    </div>
                                    
                                    <c:if test="${sessionScope.user.userType <= 2}">
                                        <div class="announcement-footer">
                                            <a href="${pageContext.request.contextPath}/admin/announcement/edit/${announcement.id}" class="btn btn-sm btn-edit">
                                                <i class="fas fa-edit"></i> 编辑
                                            </a>
                                            <button class="btn btn-sm btn-delete" onclick="deleteAnnouncement(${announcement.id})">
                                                <i class="fas fa-trash"></i> 删除
                                            </button>
                                            <c:if test="${announcement.isTop == 0}">
                                                <button class="btn btn-sm btn-top" onclick="topAnnouncement(${announcement.id})">
                                                    <i class="fas fa-arrow-up"></i> 置顶
                                                </button>
                                            </c:if>
                                        </div>
                                    </c:if>
                                </div>
                            </c:forEach>
                        </c:otherwise>
                    </c:choose>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function searchAnnouncements() {
            const keyword = document.getElementById('searchKeyword').value;
            const type = document.getElementById('typeFilter').value;
            console.log('Search:', keyword, type);
        }
        
        function deleteAnnouncement(id) {
            if (confirm('确定要删除这条公告吗？')) {
                console.log('Delete announcement:', id);
            }
        }
        
        function topAnnouncement(id) {
            console.log('Top announcement:', id);
        }
    </script>
</body>
</html>
