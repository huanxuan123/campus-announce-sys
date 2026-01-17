<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>系统参数设置</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 30px;
        }
        
        h2 {
            color: #333;
            margin-bottom: 20px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        
        .table-wrapper {
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        th {
            background-color: #007bff;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        
        td {
            border-bottom: 1px solid #ddd;
            padding: 12px;
        }
        
        tr:hover {
            background-color: #f9f9f9;
        }
        
        .btn {
            padding: 6px 12px;
            margin-right: 5px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .btn-edit {
            background-color: #28a745;
            color: white;
        }
        
        .btn-edit:hover {
            background-color: #218838;
        }
        
        .config-type {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .config-type.integer {
            background-color: #e3f2fd;
            color: #1565c0;
        }
        
        .config-type.string {
            background-color: #f3e5f5;
            color: #6a1b9a;
        }
        
        .config-type.boolean {
            background-color: #e8f5e9;
            color: #2e7d32;
        }
        
        .status {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .status.enabled {
            background-color: #c8e6c9;
            color: #1b5e20;
        }
        
        .status.disabled {
            background-color: #ffcccc;
            color: #b71c1c;
        }
        
        .alert {
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 4px;
            display: none;
        }
        
        .alert.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            display: block;
        }
        
        .alert.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            display: block;
        }
        
        .description {
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>🔧 系统参数设置</h2>
        
        <div id="alert" class="alert"></div>
        
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>参数名称</th>
                        <th>参数键</th>
                        <th>参数值</th>
                        <th>参数类型</th>
                        <th>状态</th>
                        <th>描述</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <c:choose>
                        <c:when test="${empty configs}">
                            <tr>
                                <td colspan="7" style="text-align: center; color: #999;">暂无配置数据</td>
                            </tr>
                        </c:when>
                        <c:otherwise>
                            <c:forEach items="${configs}" var="config">
                                <tr>
                                    <td><strong>${config.configName}</strong></td>
                                    <td><code>${config.configKey}</code></td>
                                    <td>
                                        <input type="text" class="config-value" data-config-key="${config.configKey}" 
                                               data-config-id="${config.id}" value="${config.configValue}" 
                                               style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                                    </td>
                                    <td>
                                        <span class="config-type ${fn:toLowerCase(config.configType)}">
                                            ${config.configType}
                                        </span>
                                    </td>
                                    <td>
                                        <span class="status ${config.status == 1 ? 'enabled' : 'disabled'}">
                                            ${config.status == 1 ? '启用' : '禁用'}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="description">${config.description}</div>
                                    </td>
                                    <td>
                                        <button class="btn btn-edit" 
                                                onclick="saveConfig('${config.configKey}', this)">保存</button>
                                    </td>
                                </tr>
                            </c:forEach>
                        </c:otherwise>
                    </c:choose>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        // 显示提示信息
        function showAlert(message, type) {
            const alertDiv = document.getElementById('alert');
            alertDiv.textContent = message;
            alertDiv.className = 'alert ' + type;
            setTimeout(() => {
                alertDiv.className = 'alert';
            }, 3000);
        }

        // 保存配置
        function saveConfig(configKey, button) {
            const configValue = document.querySelector('[data-config-key="' + configKey + '"]').value;
            
            if (!configValue || configValue.trim() === '') {
                showAlert('配置值不能为空', 'error');
                return;
            }

            // 显示保存中的状态
            const originalText = button.textContent;
            button.textContent = '保存中...';
            button.disabled = true;

            fetch('/admin/config/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'configKey=' + encodeURIComponent(configKey) + 
                      '&configValue=' + encodeURIComponent(configValue)
            })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    showAlert(data.msg || '配置保存成功', 'success');
                } else {
                    showAlert(data.msg || '配置保存失败', 'error');
                }
            })
            .catch(error => {
                showAlert('网络错误：' + error.message, 'error');
            })
            .finally(() => {
                button.textContent = originalText;
                button.disabled = false;
            });
        }

        // 页面加载完成后的初始化
        document.addEventListener('DOMContentLoaded', function() {
            console.log('系统参数设置页面已加载');
        });
    </script>
</body>
</html>
