/**
 * 首页业务逻辑
 * 使用统一的common.js工具类
 */

// 首页管理
const IndexPage = {
    currentUser: null,
    
    /**
     * 初始化
     */
    init: function() {
        Logger.log('首页初始化');
        this.loadUserInfo();
    },
    
    /**
     * 加载用户信息
     */
    loadUserInfo: function() {
        ApiClient.get('/currentUser')
            .then(data => {
                if (data.data) {
                    this.currentUser = data.data;
                    document.getElementById('userName').textContent = '欢迎，' + data.data.realName;
                } else {
                    Logger.warn('未登录，跳转到登录页');
                    window.location.href = AppConfig.apiBaseUrl.replace('/api', '') + '/login.jsp';
                }
            })
            .catch(error => {
                Logger.error('加载用户信息失败', error);
                ErrorHandler.showError('获取用户信息失败：' + error.message);
                window.location.href = AppConfig.apiBaseUrl.replace('/api', '') + '/login.jsp';
            });
    },
    
    /**
     * 退出登录
     */
    logout: function() {
        if (confirm('确定要退出登录吗？')) {
            ApiClient.post('/logout')
                .then(() => {
                    ErrorHandler.showSuccess('退出成功');
                    setTimeout(() => {
                        const basePath = AppConfig.apiBaseUrl.replace('/api', '') || '';
                        window.location.href = basePath + '/login.jsp';
                    }, 1000);
                })
                .catch(error => {
                    Logger.error('退出登录失败', error);
                    ErrorHandler.showError('退出失败：' + error.message);
                });
        }
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
    
    // 初始化首页
    IndexPage.init();
});

// 暴露给全局使用
window.logout = function() {
    IndexPage.logout();
};
