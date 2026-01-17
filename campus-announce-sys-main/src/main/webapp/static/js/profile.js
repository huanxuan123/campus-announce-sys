/**
 * 个人信息页面业务逻辑
 * 使用统一的common.js工具类
 */

// 个人信息管理
const ProfilePage = {
    currentUser: null,
    departments: [],
    
    /**
     * 初始化
     */
    init: function() {
        Logger.log('个人信息页面初始化');
        this.loadCurrentUser();
        this.loadDepartments();
    },
    
    /**
     * 加载当前用户信息
     */
    loadCurrentUser: function() {
        ApiClient.get('/currentUser?t=' + Date.now())
            .then(data => {
                if (data.data) {
                    this.currentUser = data.data;
                    document.getElementById('userName').textContent = '欢迎，' + data.data.realName;
                    Logger.log('用户信息已更新', data.data);
                    this.loadProfileData();
                } else {
                    Logger.warn('未登录，跳转到登录页');
                    const basePath = AppConfig.apiBaseUrl.replace('/api', '') || '';
                    window.location.href = basePath + '/login.jsp';
                }
            })
            .catch(error => {
                Logger.error('获取用户信息失败', error);
                const basePath = AppConfig.apiBaseUrl.replace('/api', '') || '';
                window.location.href = basePath + '/login.jsp';
            })
            .finally(() => {
                this.isLoadingUser = false;
            });
    },
    
    /**
     * 加载部门列表
     */
    loadDepartments: function() {
        ApiClient.get('/department/list')
            .then(data => {
                if (data.data) {
                    this.departments = data.data;
                }
            })
            .catch(error => {
                Logger.error('加载部门列表失败', error);
            });
    },
    
    /**
     * 加载个人信息数据
     */
    loadProfileData: function() {
        if (!this.currentUser) {
            Logger.warn('currentUser为空，无法加载表单数据');
            return;
        }
        
        Logger.log('加载表单数据 - 用户信息', this.currentUser);
        
        const userIdEl = document.getElementById('userId');
        const usernameEl = document.getElementById('profileUsername');
        const realNameEl = document.getElementById('realName');
        const userTypeEl = document.getElementById('userType');
        const studentNoEl = document.getElementById('studentNo');
        const emailEl = document.getElementById('email');
        const phoneEl = document.getElementById('phone');
        const deptNameEl = document.getElementById('deptName');
        
        Logger.log('DOM元素检查', {
            userIdEl: !!userIdEl,
            usernameEl: !!usernameEl,
            realNameEl: !!realNameEl,
            userTypeEl: !!userTypeEl,
            studentNoEl: !!studentNoEl,
            emailEl: !!emailEl,
            phoneEl: !!phoneEl,
            deptNameEl: !!deptNameEl
        });
        
        setTimeout(() => {
            if (userIdEl) userIdEl.value = this.currentUser.id;
            if (usernameEl) usernameEl.value = this.currentUser.username;
            if (realNameEl) realNameEl.value = this.currentUser.realName;
            if (userTypeEl) userTypeEl.value = this.getUserTypeName(this.currentUser.userType);
            if (studentNoEl) studentNoEl.value = this.currentUser.studentNo || '';
            if (emailEl) emailEl.value = this.currentUser.email || '';
            if (phoneEl) phoneEl.value = this.currentUser.phone || '';
            
            if (this.currentUser.deptId) {
                const dept = this.departments.find(d => d.id === this.currentUser.deptId);
                if (deptNameEl) deptNameEl.value = dept ? dept.deptName : '';
            } else {
                if (deptNameEl) deptNameEl.value = '';
            }
            
            Logger.log('表单数据已更新（延迟后）', {
                email: emailEl ? emailEl.value : 'not found',
                phone: phoneEl ? phoneEl.value : 'not found'
            });
        }, 100);
    },
    
    /**
     * 获取用户类型名称
     */
    getUserTypeName: function(type) {
        const types = {
            1: '系统管理员',
            2: '部门管理员',
            3: '教师',
            4: '学生'
        };
        return types[type] || '未知';
    },
    
    /**
     * 保存个人信息
     */
    saveProfile: function() {
        if (!this.currentUser) return;
        
        const realName = document.getElementById('realName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!realName) {
            ErrorHandler.showError('请填写真实姓名', 'message');
            return;
        }
        
        const userData = {
            id: this.currentUser.id,
            realName: realName,
            email: email || null,
            phone: phone || null
        };
        
        Logger.log('保存个人信息', userData);
        
        ApiClient.put('/user/' + this.currentUser.id, userData)
            .then(() => {
                Logger.log('个人信息修改成功');
                ErrorHandler.showSuccess('个人信息修改成功', 'message');
                
                // 直接更新当前用户对象，不重新加载
                this.currentUser.realName = realName;
                this.currentUser.email = email || null;
                this.currentUser.phone = phone || null;
                
                Logger.log('直接更新currentUser对象', this.currentUser);
                
                // 直接更新DOM，不重新加载
                const emailEl = document.getElementById('email');
                const phoneEl = document.getElementById('phone');
                
                if (emailEl) {
                    emailEl.value = this.currentUser.email || '';
                    Logger.log('DOM邮箱已更新为', emailEl.value);
                }
                
                if (phoneEl) {
                    phoneEl.value = this.currentUser.phone || '';
                    Logger.log('DOM手机号已更新为', phoneEl.value);
                }
            })
            .catch(error => {
                Logger.error('修改失败', error);
                ErrorHandler.showError(error.message || '修改失败', 'message');
            });
    },
    
    /**
     * 重置表单
     */
    resetForm: function() {
        if (!this.currentUser) return;
        this.loadProfileData();
        ErrorHandler.showSuccess('已重置为原始信息', 'message');
    },
    
    /**
     * 保存密码
     */
    savePassword: function() {
        if (!this.currentUser) return;
        
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!oldPassword || !newPassword || !confirmPassword) {
            ErrorHandler.showError('请填写所有密码字段', 'message');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            ErrorHandler.showError('两次输入的新密码不一致', 'message');
            return;
        }
        
        if (newPassword.length < 6) {
            ErrorHandler.showError('新密码长度不能少于6位', 'message');
            return;
        }
        
        const params = {
            oldPassword: oldPassword,
            newPassword: newPassword
        };
        
        Logger.log('修改密码');
        
        ApiClient.put('/user/' + this.currentUser.id + '/password', null, params)
            .then(() => {
                Logger.log('密码修改成功');
                ErrorHandler.showSuccess('密码修改成功', 'message');
                document.getElementById('passwordForm').reset();
            })
            .catch(error => {
                Logger.error('密码修改失败', error);
                ErrorHandler.showError(error.message || '密码修改失败', 'message');
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
    if (typeof contextPath !== 'undefined' && contextPath && contextPath !== '') {
        AppConfig.apiBaseUrl = contextPath + '/api';
        Logger.log('使用JSP设置的contextPath:', contextPath);
    } else {
        AppConfig.apiBaseUrl = '/api';
        Logger.warn('未找到contextPath，使用默认值 /api');
    }
    
    Logger.log('API基础URL已设置', AppConfig.apiBaseUrl);
    
    // 初始化个人信息页面
    ProfilePage.init();
});

// 暴露给全局使用
window.saveProfile = function() {
    ProfilePage.saveProfile();
};

window.resetForm = function() {
    ProfilePage.resetForm();
};

window.savePassword = function() {
    ProfilePage.savePassword();
};

window.logout = function() {
    ProfilePage.logout();
};
