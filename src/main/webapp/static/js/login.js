/**
 * 登录页面业务逻辑
 * 使用统一的common.js工具类
 */

// 登录管理
const LoginPage = {
    /**
     * 初始化
     */
    init: function() {
        Logger.log('登录页面初始化');
        
        // 重置登录按钮状态
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = '登录';
        }
        
        // 清除之前的消息
        const messageContainer = document.getElementById('message');
        if (messageContainer) {
            messageContainer.innerHTML = '';
        }
        
        this.bindEvents();
    },
    
    /**
     * 绑定事件
     */
    bindEvents: function() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    },
    
    /**
     * 处理登录
     */
    handleLogin: function() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.querySelector('.btn-login');
        
        if (!username || !password) {
            ErrorHandler.showError('请输入用户名和密码', 'message');
            return;
        }
        
        const loginData = {
            username: username,
            password: password
        };
        
        Logger.log('尝试登录', { username });
        
        // 禁用登录按钮，防止重复提交
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.textContent = '登录中...';
        }
        
        ApiClient.post('/login', loginData)
            .then(data => {
                Logger.log('登录成功', { username });
                ErrorHandler.showSuccess('登录成功，正在跳转...', 'message');
                setTimeout(() => {
                    const basePath = AppConfig.apiBaseUrl.replace('/api', '') || '';
                    window.location.href = basePath + '/index.jsp';
                }, 1000);
            })
            .catch(error => {
                Logger.error('登录失败', error);
                const errorMsg = error.message || '登录失败';
                ErrorHandler.showError(errorMsg, 'message');
                
                // 恢复登录按钮
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.textContent = '登录';
                }
            });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置API基础URL
    if (typeof contextPath !== 'undefined' && contextPath) {
        AppConfig.apiBaseUrl = contextPath + '/api';
    } else {
        AppConfig.apiBaseUrl = '/api';
        Logger.warn('未找到contextPath，使用默认值 /api');
    }
    
    Logger.log('API基础URL已设置', AppConfig.apiBaseUrl);
    
    // 初始化登录页面
    LoginPage.init();
});

// 监听页面显示事件（包括从缓存恢复、前进/后退）
window.addEventListener('pageshow', function(event) {
    Logger.log('页面显示事件触发', { persisted: event.persisted });
    
    // 如果是从缓存恢复的页面，重新初始化
    if (event.persisted) {
        Logger.log('从缓存恢复页面，重新初始化');
        LoginPage.init();
    }
});
