<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>公告详情 - 校园公告系统</title>
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
            max-width: 900px;
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
        
        .content {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .announcement-type {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 16px;
        }
        
        .type-1 {
            background: #e3f2fd;
            color: #1e40af;
        }
        
        .type-2 {
            background: #fef3c7;
            color: #d97706;
        }
        
        .type-3 {
            background: #f3f4f6;
            color: #6b7280;
        }
        
        .announcement-scope {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 16px;
            background: #f3f4f6;
            color: #6b7280;
        }
        
        .announcement-title {
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 16px;
        }
        
        .announcement-meta {
            display: flex;
            gap: 24px;
            margin-bottom: 24px;
            padding-bottom: 24px;
            border-bottom: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .announcement-body {
            line-height: 1.8;
            color: #374151;
            font-size: 16px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .announcement-body p {
            margin-bottom: 16px;
        }
        
        .attachments {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
        }
        
        .attachments-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
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
            transition: all 0.2s;
        }
        
        .attachment-item:hover {
            background: #f3f4f6;
            border-color: #667eea;
        }
        
        .attachment-info {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
        }
        
        .attachment-icon {
            font-size: 24px;
            color: #667eea;
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
            padding: 8px 16px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .btn-download:hover {
            background: #5568d3;
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
        
        .message {
            position: fixed;
            top: 20px;
            right: 20px;
            display: block;
            z-index: 1001;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                gap: 16px;
            }
            
            .announcement-meta {
                flex-direction: column;
                gap: 12px;
            }
            
            .content {
                padding: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <div class="header-content">
                <div class="header-title">
                    <h1><a href="${pageContext.request.contextPath}/announcement-list.jsp" style="color: white; text-decoration: none;">公告详情</a></h1>
                </div>
                <div class="header-actions">
                    <a href="${pageContext.request.contextPath}/announcement-list.jsp" class="btn btn-secondary">
                        返回列表
                    </a>
                </div>
            </div>
        </div>
        
        <div class="content" id="announcementContent">
            <div class="loading">
                <div class="loading-spinner">⏳</div>
                <p>正在加载公告详情...</p>
            </div>
        </div>
    </div>
    
    <div id="message" class="message"></div>
    
    <script>
        var contextPath = '${pageContext.request.contextPath}';
    </script>
    <script src="${pageContext.request.contextPath}/static/js/common.js"></script>
    <script src="${pageContext.request.contextPath}/static/js/announcement-detail.js"></script>
</body>
</html>
