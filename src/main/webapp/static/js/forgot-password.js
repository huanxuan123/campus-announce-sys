/**
 * 忘记密码页面业务逻辑
 * 使用统一的common.js工具类
 */

// 忘记密码管理
const ForgotPasswordPage = {
    /**
     * 初始化
     */
    init: function() {
        Logger.log('忘记密码页面初始化');
        this.bindEvents();
    },
    
    /**
     * 绑定事件
     */
    bindEvents: function() {
        const forgotForm = document.getElementById('forgotForm');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }
    },
    
    /**
     * 处理忘记密码
     */
    handleForgotPassword: function() {
        const emailInput = document.getElementById('email');
        const submitBtn = document.getElementById('submitBtn');
        const email = emailInput.value.trim();
        
        if (!email) {
            ErrorHandler.showError('请输入邮箱', 'message');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            ErrorHandler.showError('请输入有效的邮箱地址', 'message');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = '发送中...';
        
        Logger.log('发送密码重置邮件', { email });
        
        ApiClient.postForm('/password/forgot', { email: email })
            .then(() => {
                Logger.log('密码重置邮件发送成功');
                ErrorHandler.showSuccess('重置邮件已发送，请查收', 'message');
                setTimeout(() => {
                    const basePath = AppConfig.apiBaseUrl.replace('/api', '') || '';
                    window.location.href = basePath + '/login.jsp';
                }, 2000);
            })
            .catch(error => {
                Logger.error('发送密码重置邮件失败', error);
                ErrorHandler.showError(error.message || '网络错误，请稍后重试', 'message');
                submitBtn.disabled = false;
                submitBtn.textContent = '发送重置邮件';
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
    
    // 初始化忘记密码页面
    ForgotPasswordPage.init();
});
