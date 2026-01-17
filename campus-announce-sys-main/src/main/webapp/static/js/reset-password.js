/**
 * 重置密码页面业务逻辑
 * 使用统一的common.js工具类
 */

// 重置密码管理
const ResetPasswordPage = {
    token: null,
    
    /**
     * 初始化
     */
    init: function() {
        Logger.log('重置密码页面初始化');
        
        // 从URL获取token
        const urlParams = new URLSearchParams(window.location.search);
        this.token = urlParams.get('token');
        
        if (!this.token) {
            ErrorHandler.showError('无效的重置链接', 'message');
            setTimeout(() => {
                const basePath = AppConfig.apiBaseUrl.replace('/api', '') || '';
                window.location.href = basePath + '/login.jsp';
            }, 2000);
            return;
        }
        
        this.bindEvents();
    },
    
    /**
     * 绑定事件
     */
    bindEvents: function() {
        const resetForm = document.getElementById('resetForm');
        if (resetForm) {
            resetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleResetPassword();
            });
        }
    },
    
    /**
     * 处理重置密码
     */
    handleResetPassword: function() {
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const submitBtn = document.getElementById('submitBtn');
        
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        
        if (!newPassword) {
            ErrorHandler.showError('请输入新密码', 'message');
            return;
        }
        
        if (newPassword.length < 6) {
            ErrorHandler.showError('密码长度不能少于6位', 'message');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            ErrorHandler.showError('两次输入的密码不一致', 'message');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = '重置中...';
        
        Logger.log('重置密码');
        
        ApiClient.postForm('/password/reset', {
            token: this.token,
            newPassword: newPassword
        })
            .then(() => {
                Logger.log('密码重置成功');
                ErrorHandler.showSuccess('密码重置成功', 'message');
                setTimeout(() => {
                    const basePath = AppConfig.apiBaseUrl.replace('/api', '') || '';
                    window.location.href = basePath + '/login.jsp';
                }, 2000);
            })
            .catch(error => {
                Logger.error('重置密码失败', error);
                ErrorHandler.showError(error.message || '网络错误，请稍后重试', 'message');
                submitBtn.disabled = false;
                submitBtn.textContent = '重置密码';
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
    
    // 初始化重置密码页面
    ResetPasswordPage.init();
});
