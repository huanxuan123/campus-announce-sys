/**
 * 全局通用JavaScript工具类
 * 提供统一的API调用、错误处理、日志记录等功能
 */

// 全局配置
const AppConfig = {
    apiBaseUrl: '', // 由JSP页面设置: ${pageContext.request.contextPath}/api
    timeout: 15000, // 请求超时时间（毫秒）
    enableLog: true // 是否启用日志
};

// 日志工具
const Logger = {
    log: function(message, data) {
        if (AppConfig.enableLog) {
            console.log('[LOG]', message, data || '');
        }
    },
    warn: function(message, data) {
        if (AppConfig.enableLog) {
            console.warn('[WARN]', message, data || '');
        }
    },
    error: function(message, error) {
        console.error('[ERROR]', message, error || '');
    }
};

// 统一的API请求工具
const ApiClient = {
    /**
     * 发送GET请求
     */
    get: function(url, params) {
        return this.request('GET', url, null, params);
    },
    
    /**
     * 发送POST请求
     */
    post: function(url, data) {
        return this.request('POST', url, data);
    },
    
    /**
     * 发送PUT请求
     */
    put: function(url, data) {
        return this.request('PUT', url, data);
    },
    
    /**
     * 发送DELETE请求
     */
    delete: function(url) {
        return this.request('DELETE', url);
    },
    
    /**
     * 发送表单数据请求（application/x-www-form-urlencoded）
     */
    postForm: function(url, data) {
        return this.request('POST', url, data, null, 'form');
    },
    
    /**
     * 统一的请求方法
     */
    request: function(method, url, data, params, contentType) {
        // 构建完整URL
        let fullUrl = AppConfig.apiBaseUrl + url;
        
        // 添加查询参数
        if (params) {
            const queryString = Object.keys(params)
                .filter(key => params[key] != null && params[key] !== '')
                .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
                .join('&');
            if (queryString) {
                fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
            }
        }
        
        Logger.log('API请求', { method, url: fullUrl, data });
        
        // 创建AbortController用于超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), AppConfig.timeout);
        
        // 确定内容类型
        const isFormData = contentType === 'form';
        const requestContentType = isFormData 
            ? 'application/x-www-form-urlencoded' 
            : 'application/json';
        
        // 构建请求配置
        const options = {
            method: method,
            credentials: 'include', // 包含cookie，保持session
            headers: {
                'Content-Type': requestContentType,
                'Accept': 'application/json'
            },
            signal: controller.signal
        };
        
        // 添加请求体
        if (data && (method === 'POST' || method === 'PUT')) {
            if (isFormData) {
                // 表单数据格式
                const formData = new URLSearchParams();
                Object.keys(data).forEach(key => {
                    if (data[key] != null && data[key] !== '') {
                        formData.append(key, data[key]);
                    }
                });
                options.body = formData.toString();
            } else {
                // JSON格式
                options.body = JSON.stringify(data);
            }
        }
        
        return fetch(fullUrl, options)
            .then(response => {
                clearTimeout(timeoutId);
                Logger.log('API响应', { status: response.status, url: fullUrl });
                
                // 检查响应状态
                if (!response.ok) {
                    return this.handleErrorResponse(response);
                }
                
                // 检查响应类型
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    return response.text().then(text => {
                        Logger.warn('响应不是JSON格式', { contentType, text: text.substring(0, 200) });
                        throw new Error('服务器返回的不是JSON格式');
                    });
                }
                
                // 解析JSON响应
                return response.text().then(text => {
                    try {
                        if (text.length === 0) {
                            throw new Error('服务器返回空响应');
                        }
                        const json = JSON.parse(text);
                        Logger.log('API响应解析成功', json);
                        return json;
                    } catch (e) {
                        Logger.error('JSON解析失败', { error: e, text: text.substring(0, 500) });
                        throw new Error('JSON解析失败: ' + e.message);
                    }
                });
            })
            .then(data => {
                // 统一处理API响应格式
                if (data && data.code === 200) {
                    return Promise.resolve(data);
                } else {
                    const errorMsg = data ? (data.message || data.msg || '未知错误') : '服务器返回数据格式错误';
                    Logger.warn('API返回错误', { code: data?.code, message: errorMsg });
                    return Promise.reject(new Error(errorMsg));
                }
            })
            .catch(error => {
                clearTimeout(timeoutId);
                return this.handleError(error, fullUrl);
            });
    },
    
    /**
     * 处理错误响应
     */
    handleErrorResponse: function(response) {
        return response.text().then(text => {
            try {
                const errorData = JSON.parse(text);
                throw new Error(errorData.message || errorData.msg || 'HTTP ' + response.status);
            } catch (e) {
                if (e.message && e.message.startsWith('HTTP')) {
                    throw e;
                }
                throw new Error('HTTP ' + response.status + ': ' + text.substring(0, 100));
            }
        });
    },
    
    /**
     * 统一错误处理
     */
    handleError: function(error, url) {
        let errorMsg = '网络请求失败';
        
        if (error.name === 'AbortError') {
            errorMsg = '请求超时（超过' + (AppConfig.timeout / 1000) + '秒）';
        } else if (error.message) {
            errorMsg = error.message;
        } else if (error.type === 'network') {
            errorMsg = '网络连接错误';
        }
        
        // 检查是否是ERR_INCOMPLETE_CHUNKED_ENCODING错误
        if (errorMsg.includes('ERR_INCOMPLETE') || errorMsg.includes('chunked')) {
            errorMsg = '服务器响应不完整。可能原因：服务器正在重启、网络连接不稳定或响应过大。';
        }
        
        Logger.error('API请求失败', { url, error: errorMsg, originalError: error });
        
        return Promise.reject(new Error(errorMsg));
    }
};

// 全局错误处理
const ErrorHandler = {
    /**
     * 显示错误消息
     */
    showError: function(message, containerId) {
        const container = containerId ? document.getElementById(containerId) : document.body;
        if (!container) {
            alert('错误: ' + message);
            return;
        }
        
        const errorHtml = `
            <div class="error-message" style="
                background: #fee;
                border: 1px solid #fcc;
                border-radius: 4px;
                padding: 16px;
                margin: 16px 0;
                color: #c33;
            ">
                <h3 style="margin: 0 0 8px 0; font-size: 16px;">
                    <i class="fas fa-exclamation-circle"></i> 错误
                </h3>
                <p style="margin: 0; line-height: 1.6;">${this.escapeHtml(message)}</p>
                <button onclick="this.parentElement.remove()" style="
                    margin-top: 12px;
                    padding: 6px 12px;
                    background: #c33;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">关闭</button>
            </div>
        `;
        
        container.insertAdjacentHTML('afterbegin', errorHtml);
    },
    
    /**
     * 显示成功消息
     */
    showSuccess: function(message, containerId) {
        const container = containerId ? document.getElementById(containerId) : document.body;
        if (!container) {
            alert('成功: ' + message);
            return;
        }
        
        const successHtml = `
            <div class="success-message" style="
                background: #efe;
                border: 1px solid #cfc;
                border-radius: 4px;
                padding: 16px;
                margin: 16px 0;
                color: #3c3;
            ">
                <h3 style="margin: 0 0 8px 0; font-size: 16px;">
                    <i class="fas fa-check-circle"></i> 成功
                </h3>
                <p style="margin: 0; line-height: 1.6;">${this.escapeHtml(message)}</p>
            </div>
        `;
        
        container.insertAdjacentHTML('afterbegin', successHtml);
        
        // 3秒后自动消失
        setTimeout(() => {
            const msg = container.querySelector('.success-message');
            if (msg) {
                msg.style.transition = 'opacity 0.3s';
                msg.style.opacity = '0';
                setTimeout(() => msg.remove(), 300);
            }
        }, 3000);
    },
    
    /**
     * HTML转义，防止XSS
     */
    escapeHtml: function(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    /**
     * 初始化全局错误处理
     */
    init: function() {
        // 捕获未处理的Promise错误
        window.addEventListener('unhandledrejection', function(event) {
            Logger.error('未处理的Promise错误', event.reason);
            ErrorHandler.showError('发生未预期的错误: ' + (event.reason?.message || event.reason));
            event.preventDefault();
        });
        
        // 捕获全局JavaScript错误
        window.addEventListener('error', function(event) {
            Logger.error('全局JavaScript错误', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
            ErrorHandler.showError('页面脚本错误: ' + event.message);
        });
    }
};

// 工具函数
const Utils = {
    /**
     * 格式化日期
     */
    formatDate: function(dateValue) {
        if (!dateValue) return '-';
        try {
            let date;
            if (typeof dateValue === 'number') {
                date = new Date(dateValue);
            } else if (typeof dateValue === 'string') {
                date = new Date(dateValue);
            } else {
                return '-';
            }
            
            if (isNaN(date.getTime())) {
                Logger.warn('无效的日期', dateValue);
                return '-';
            }
            
            return date.toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (err) {
            Logger.error('日期格式化失败', { error: err, value: dateValue });
            return String(dateValue);
        }
    },
    
    /**
     * 防抖函数
     */
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    
    /**
     * 节流函数
     */
    throttle: function(func, wait) {
        let lastTime = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastTime >= wait) {
                lastTime = now;
                func.apply(this, args);
            }
        };
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    ErrorHandler.init();
    Logger.log('通用工具模块已加载');
});
