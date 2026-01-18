<%@ page contentType="text/html;charset=UTF-8" language="java" 
         buffer="64kb" autoFlush="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>公告列表 - 校园公告系统</title>
    <link rel="icon" type="image/x-icon" href="${pageContext.request.contextPath}/favicon.ico">
    <!-- 使用本地Unicode字符，避免CDN加载超时 -->
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
        
        .announcement-scope {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 8px;
            margin-left: 8px;
            background: #f3f4f6;
            color: #6b7280;
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
        
        .sidebar-divider {
            height: 1px;
            background: var(--border);
            margin: 24px 0;
        }
        
        .btn-system-settings {
            width: 100%;
            padding: 12px 16px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .btn-system-settings:hover {
            background: var(--primary-dark);
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            justify-content: center;
            align-items: center;
        }
        
        .modal.show {
            display: flex;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid var(--border);
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 18px;
            color: #1f2937;
        }
        
        .modal-header .close {
            font-size: 28px;
            cursor: pointer;
            color: var(--gray);
            transition: color 0.2s;
        }
        
        .modal-header .close:hover {
            color: var(--danger);
        }
        
        .modal-body {
            padding: 24px;
        }
        
        .settings-group {
            margin-bottom: 20px;
        }
        
        .settings-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: #374151;
            font-weight: 500;
        }
        
        .settings-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--border);
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s;
        }
        
        .settings-input:focus {
            outline: none;
            border-color: var(--primary);
        }
        
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            padding: 20px 24px;
            border-top: 1px solid var(--border);
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
                    <h1><a href="${pageContext.request.contextPath}/index.jsp" style="color: white; text-decoration: none;">校园公告</a></h1>
                </div>
                <div class="header-actions">
                    <div class="user-card">
                        <i class="fas fa-user-circle"></i>
                        <span id="userName">加载中...</span>
                    </div>
                    <button id="publishBtn" onclick="AnnouncementList.showPublishForm()" class="btn btn-primary" style="display: none;">
                        <i class="fas fa-plus"></i> 发布公告
                    </button>
                    <button onclick="AnnouncementList.logout()" class="btn btn-secondary">
                        <i class="fas fa-sign-out-alt"></i> 退出
                    </button>
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
                
                <div class="sidebar-divider"></div>
                
                <div class="sidebar-title">
                    <i class="fas fa-cog"></i> 系统设置
                </div>
                
                <div class="filter-group">
                    <button class="btn-system-settings" onclick="AnnouncementList.showSystemSettings()">
                        <i class="fas fa-sliders-h"></i> 系统参数设置
                    </button>
                </div>
            </div>
            
            <!-- Content Area -->
            <div class="content-area">
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
                        <select class="search-select" id="deptFilter">
                            <option value="">全部院系</option>
                            <option value="1">计算机学院</option>
                            <option value="2">软件学院</option>
                            <option value="3">信息工程学院</option>
                            <option value="4">电子工程学院</option>
                            <option value="5">机械工程学院</option>
                        </select>
                        <input type="date" class="search-select" placeholder="开始时间" id="startTime">
                        <input type="date" class="search-select" placeholder="结束时间" id="endTime">
                        <button class="btn-search" onclick="AnnouncementList.searchAnnouncements()">
                            <i class="fas fa-search"></i> 搜索
                        </button>
                    </div>
                </div>
                
                <!-- Announcements Grid -->
                <div class="announcements" id="announcementsList">
                    <div class="empty-state">
                        <i class="fas fa-spinner fa-spin"></i>
                        <h3>正在加载公告...</h3>
                        <p>请稍候，如果长时间无响应，请检查浏览器控制台</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 系统参数设置模态框 -->
    <div id="systemSettingsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>系统参数设置</h3>
                <span class="close" onclick="AnnouncementList.closeSystemSettings()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="settings-group">
                    <label class="settings-label">公告保留时长（天）</label>
                    <input type="number" id="retentionDays" class="settings-input" min="0" placeholder="0表示永久保留">
                </div>
                <div class="settings-group">
                    <label class="settings-label">置顶公告数量限制</label>
                    <input type="number" id="maxTopAnnouncements" class="settings-input" min="0" placeholder="0表示不限制">
                </div>
                <div class="settings-group">
                    <label class="settings-label">单个附件大小限制（MB）</label>
                    <input type="number" id="maxAttachmentSize" class="settings-input" min="0" step="0.1" placeholder="0表示不限制">
                </div>
                <div class="settings-group">
                    <label class="settings-label">允许的文件类型</label>
                    <input type="text" id="allowedFileTypes" class="settings-input" placeholder="例如：jpg,png,pdf,doc,docx">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="AnnouncementList.closeSystemSettings()">取消</button>
                <button class="btn btn-primary" onclick="AnnouncementList.saveSystemSettings()">保存</button>
            </div>
        </div>
    </div>
    <!-- 引入通用工具和业务逻辑 -->
    <script>
        // 设置全局配置
        var contextPath = '${pageContext.request.contextPath}';
    </script>

    <script src="${pageContext.request.contextPath}/static/js/common.js"></script>
    <script src="${pageContext.request.contextPath}/static/js/announcement-list.js"></script>
</body>
</html>
