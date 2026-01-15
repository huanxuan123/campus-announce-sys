<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>公告管理 - 校园公告系统</title>
    <link rel="icon" type="image/x-icon" href="${pageContext.request.contextPath}/favicon.ico">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .wrapper {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin-bottom: 24px;
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header-title {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .header-title h1 {
            font-size: 24px;
            font-weight: 600;
        }
        
        .header-actions {
            display: flex;
            gap: 12px;
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-primary {
            background: white;
            color: #667eea;
        }
        
        .btn-primary:hover {
            background: #f8f9fa;
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }
        
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .btn-success {
            background: #10b981;
            color: white;
        }
        
        .btn-success:hover {
            background: #059669;
        }
        
        .btn-danger {
            background: #ef4444;
            color: white;
        }
        
        .btn-danger:hover {
            background: #dc2626;
        }
        
        .content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }
        
        .card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .card-full {
            grid-column: 1 / -1;
        }
        
        .card-title {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-group {
            margin-bottom: 16px;
        }
        
        .info-label {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 4px;
            display: block;
        }
        
        .info-value {
            font-size: 14px;
            color: #374151;
            font-weight: 500;
        }
        
        .info-value.highlight {
            color: #667eea;
            font-weight: 600;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: #374151;
            font-weight: 500;
        }
        
        .form-input, .form-select, .form-textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s;
        }
        
        .form-input:focus, .form-select:focus, .form-textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .form-textarea {
            min-height: 200px;
            resize: vertical;
        }
        
        .loading {
            text-align: center;
            padding: 60px 20px;
            color: #6b7280;
        }
        
        .loading-spinner {
            font-size: 48px;
            margin-bottom: 16px;
        }
        
        .error {
            text-align: center;
            padding: 60px 20px;
            color: #ef4444;
        }
        
        .error-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }
        
        .attachment-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .attachment-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
        
        .attachment-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .attachment-icon {
            font-size: 24px;
        }
        
        .attachment-name {
            font-size: 14px;
            color: #374151;
            font-weight: 500;
        }
        
        .attachment-size {
            font-size: 12px;
            color: #6b7280;
        }
        
        .btn-download {
            padding: 6px 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
        }
        
        .btn-download:hover {
            background: #5568d3;
        }
        
        .empty-attachments {
            text-align: center;
            padding: 40px 20px;
            color: #6b7280;
        }
        
        @media (max-width: 1024px) {
            .content {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                gap: 16px;
            }
            
            .card {
                padding: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <div class="header-content">
                <div class="header-title">
                    <h1><a href="${pageContext.request.contextPath}/announcement-list.jsp" style="color: white; text-decoration: none;">公告管理</a></h1>
                </div>
                <div class="header-actions">
                    <a href="${pageContext.request.contextPath}/announcement-list.jsp" class="btn btn-secondary">
                        返回列表
                    </a>
                </div>
            </div>
        </div>
        
        <div class="content" id="mainContent">
            <div class="loading">
                <div class="loading-spinner">⏳</div>
                <p>正在加载公告信息...</p>
            </div>
        </div>
    </div>
    
    <script>
        var contextPath = '${pageContext.request.contextPath}';
    </script>
    <script src="${pageContext.request.contextPath}/static/js/common.js"></script>
    <script src="${pageContext.request.contextPath}/static/js/announcement-admin-detail.js"></script>
</body>
</html>
