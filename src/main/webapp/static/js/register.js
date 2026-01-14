/**
 * 注册页面业务逻辑
 * 使用统一的common.js工具类
 */

// 注册管理
const RegisterPage = {
    departments: [],
    
    /**
     * 初始化
     */
    init: function() {
        Logger.log('注册页面初始化');
        this.loadDepartments();
        this.bindEvents();
    },
    
    /**
     * 绑定事件
     */
    bindEvents: function() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    },
    
    /**
     * 加载部门列表
     */
    loadDepartments: function() {
        ApiClient.get('/department/list')
            .then(data => {
                if (data.data) {
                    this.departments = data.data;
                    const deptSelect = document.getElementById('deptId');
                    if (deptSelect) {
                        deptSelect.innerHTML = '<option value="">请选择部门</option>';
                        data.data.forEach(dept => {
                            const option = document.createElement('option');
                            option.value = dept.id;
                            option.textContent = dept.deptName;
                            deptSelect.appendChild(option);
                        });
                    }
                }
            })
            .catch(error => {
                Logger.error('加载部门列表失败', error);
            });
    },
    
    /**
     * 处理注册
     */
    handleRegister: function() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const realName = document.getElementById('realName').value.trim();
        const userType = document.getElementById('userType').value;
        const deptId = document.getElementById('deptId').value;
        const studentNo = document.getElementById('studentNo').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!username || !password || !confirmPassword || !realName || !userType || !deptId) {
            ErrorHandler.showError('请填写必填项', 'message');
            return;
        }
        
        if (password !== confirmPassword) {
            ErrorHandler.showError('两次输入的密码不一致', 'message');
            return;
        }
        
        if (password.length < 6) {
            ErrorHandler.showError('密码长度不能少于6位', 'message');
            return;
        }
        
        const registerData = {
            username: username,
            password: password,
            realName: realName,
            userType: parseInt(userType),
            deptId: parseInt(deptId),
            studentNo: studentNo || null,
            email: email || null,
            phone: phone || null,
            status: 1
        };
        
        Logger.log('尝试注册', { username });
        
        ApiClient.post('/register', registerData)
            .then(() => {
                Logger.log('注册成功', { username });
                ErrorHandler.showSuccess('注册成功，正在跳转到登录页面...', 'message');
                setTimeout(() => {
                    const basePath = AppConfig.apiBaseUrl.replace('/api', '') || '';
                    window.location.href = basePath + '/login.jsp';
                }, 1500);
            })
            .catch(error => {
                Logger.error('注册失败', error);
                ErrorHandler.showError(error.message || '注册失败', 'message');
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
    
    // 初始化注册页面
    RegisterPage.init();
});
