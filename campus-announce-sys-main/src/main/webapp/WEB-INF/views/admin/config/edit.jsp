<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>编辑系统参数</title>
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
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 30px;
        }
        
        h2 {
            color: #333;
            margin-bottom: 30px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        
        input, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            font-family: inherit;
        }
        
        input:focus, textarea:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }
        
        textarea {
            resize: vertical;
            min-height: 100px;
        }
        
        .form-text {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 30px;
        }
        
        button {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-save {
            background-color: #007bff;
            color: white;
        }
        
        .btn-save:hover {
            background-color: #0056b3;
        }
        
        .btn-cancel {
            background-color: #6c757d;
            color: white;
        }
        
        .btn-cancel:hover {
            background-color: #545b62;
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
        
        .read-only {
            background-color: #f5f5f5;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>编辑系统参数</h2>
        
        <div id="alert" class="alert"></div>
        
        <c:choose>
            <c:when test="${not empty config}">
                <form id="configForm">
                    <div class="form-group">
                        <label for="configName">参数名称 *</label>
                        <input type="text" id="configName" value="${config.configName}" 
                               class="read-only" readonly>
                    </div>
                    
                    <div class="form-group">
                        <label for="configKey">参数键 *</label>
                        <input type="text" id="configKey" name="configKey" value="${config.configKey}" 
                               class="read-only" readonly>
                    </div>
                    
                    <div class="form-group">
                        <label for="configType">参数类型</label>
                        <input type="text" value="${config.configType}" class="read-only" readonly>
                        <div class="form-text">
                            <c:choose>
                                <c:when test="${config.configType == 'INTEGER'}">
                                    请输入整数
                                </c:when>
                                <c:when test="${config.configType == 'BOOLEAN'}">
                                    请输入 true 或 false
                                </c:when>
                                <c:otherwise>
                                    请输入文本
                                </c:otherwise>
                            </c:choose>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="configValue">参数值 *</label>
                        <c:choose>
                            <c:when test="${config.configType == 'INTEGER'}">
                                <input type="number" id="configValue" name="configValue" 
                                       value="${config.configValue}" required>
                            </c:when>
                            <c:otherwise>
                                <textarea id="configValue" name="configValue" required>${config.configValue}</textarea>
                            </c:otherwise>
                        </c:choose>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">描述</label>
                        <textarea id="description" readonly class="read-only">${config.description}</textarea>
                    </div>
                    
                    <div class="button-group">
                        <button type="button" class="btn-save" onclick="saveConfig()">保存</button>
                        <button type="button" class="btn-cancel" onclick="goBack()">返回</button>
                    </div>
                </form>
            </c:when>
            <c:otherwise>
                <div class="alert error">配置不存在</div>
                <button class="btn-cancel" onclick="goBack()">返回</button>
            </c:otherwise>
        </c:choose>
    </div>

    <script>
        function showAlert(message, type) {
            const alertDiv = document.getElementById('alert');
            alertDiv.textContent = message;
            alertDiv.className = 'alert ' + type;
        }

        function saveConfig() {
            const configKey = document.getElementById('configKey').value;
            const configValue = document.getElementById('configValue').value;

            if (!configValue || configValue.trim() === '') {
                showAlert('参数值不能为空', 'error');
                return;
            }

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
                    showAlert('保存成功', 'success');
                    setTimeout(() => {
                        goBack();
                    }, 1500);
                } else {
                    showAlert(data.msg || '保存失败', 'error');
                }
            })
            .catch(error => {
                showAlert('网络错误：' + error.message, 'error');
            });
        }

        function goBack() {
            window.location.href = '/admin/config/list';
        }
    </script>
</body>
</html>
