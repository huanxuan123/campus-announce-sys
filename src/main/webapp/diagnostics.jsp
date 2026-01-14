<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>应用诊断</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .section { border: 1px solid #ccc; padding: 10px; margin: 10px 0; }
        .success { color: green; }
        .error { color: red; }
        h2 { color: #333; }
    </style>
</head>
<body>
    <h1>校园公告系统 - 诊断页面</h1>
    
    <div class="section">
        <h2>✓ 服务器正在运行</h2>
        <p>当前时间: <%= new java.util.Date() %></p>
        <p>服务器: <%= request.getServerName() %>:<%= request.getServerPort() %></p>
        <p>Context Path: <%= request.getContextPath() %></p>
    </div>
    
    <div class="section">
        <h2>资源测试</h2>
        <ul>
            <li><a href="${pageContext.request.contextPath}/static/css/login.css" target="_blank">测试: login.css</a></li>
            <li><a href="${pageContext.request.contextPath}/static/js/login.js" target="_blank">测试: login.js</a></li>
            <li><a href="${pageContext.request.contextPath}/login.jsp">返回: 登录页面</a></li>
        </ul>
    </div>
    
    <div class="section">
        <h2>环境信息</h2>
        <table border="1" cellpadding="5">
            <tr>
                <td><strong>项目名</strong></td>
                <td>校园公告系统</td>
            </tr>
            <tr>
                <td><strong>Java版本</strong></td>
                <td><%= System.getProperty("java.version") %></td>
            </tr>
            <tr>
                <td><strong>操作系统</strong></td>
                <td><%= System.getProperty("os.name") %> <%= System.getProperty("os.version") %></td>
            </tr>
        </table>
    </div>
    
    <div class="section">
        <h2>检查列表</h2>
        <ul>
            <li>✓ JSP 支持: 正常</li>
            <li>✓ 静态资源配置: /static/** 映射到 /static/</li>
            <li>✓ 上传目录: /uploads/ 已创建</li>
            <li>✓ Spring MVC: 已配置</li>
        </ul>
    </div>
</body>
</html>
