/**
 * 用户管理页面业务逻辑
 * 使用统一的common.js工具类
 */

// 用户管理
const UserPage = {
    currentUser: null,
    users: [],
    departments: [],
    
    /**
     * 初始化
     */
    init: function() {
        Logger.log('用户管理页面初始化');
        this.loadCurrentUser();
        this.loadUsers();
        this.loadDepartments();
    },
    
    /**
     * 加载当前用户信息
     */
    loadCurrentUser: function() {
        ApiClient.get('/currentUser')
            .then(data => {
                if (data.data) {
                    this.currentUser = data.data;
                    document.getElementById('userName').textContent = '欢迎，' + data.data.realName;
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
            });
    },
    
    /**
     * 加载用户列表
     */
    loadUsers: function() {
        ApiClient.get('/user/list')
            .then(data => {
                if (data.data) {
                    this.users = data.data;
                    this.renderUserTable(this.users);
                } else {
                    ErrorHandler.showError('加载用户列表失败', 'message');
                }
            })
            .catch(error => {
                Logger.error('加载用户列表失败', error);
                ErrorHandler.showError('加载用户列表失败：' + error.message, 'message');
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
                    const deptSelect = document.getElementById('deptId');
                    if (deptSelect) {
                        deptSelect.innerHTML = '<option value="">请选择</option>';
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
     * 检查是否可以查看用户
     */
    canViewUser: function(targetUser) {
        if (!this.currentUser) return false;
        
        const currentUserType = this.currentUser.userType;
        const targetUserType = targetUser.userType;
        
        if (currentUserType === 1) {
            return true;
        }
        
        if (currentUserType === 2) {
            return targetUserType === 3 || targetUserType === 4;
        }
        
        if (currentUserType === 3) {
            return targetUserType === 3 || targetUserType === 4;
        }
        
        if (currentUserType === 4) {
            return targetUserType === 4;
        }
        
        return false;
    },
    
    /**
     * 渲染用户表格
     */
    renderUserTable: function(userList) {
        const tbody = document.getElementById('userTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const visibleUsers = userList.filter(user => this.canViewUser(user));
        
        if (visibleUsers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:40px;color:#999;">暂无用户数据</td></tr>';
            return;
        }
        
        visibleUsers.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = 
                '<td>' + user.id + '</td>' +
                '<td>' + ErrorHandler.escapeHtml(user.username) + '</td>' +
                '<td>' + ErrorHandler.escapeHtml(user.realName) + '</td>' +
                '<td><span class="user-type-badge">' + this.getUserTypeName(user.userType) + '</span></td>' +
                '<td>' + this.getDeptName(user.deptId) + '</td>' +
                '<td>' + (user.studentNo ? ErrorHandler.escapeHtml(user.studentNo) : '-') + '</td>' +
                '<td>' + (user.email ? ErrorHandler.escapeHtml(user.email) : '-') + '</td>' +
                '<td>' + (user.phone ? ErrorHandler.escapeHtml(user.phone) : '-') + '</td>' +
                '<td><span class="status-badge ' + (user.status === 1 ? 'active' : 'inactive') + '">' + (user.status === 1 ? '启用' : '禁用') + '</span></td>' +
                '<td>' +
                    '<div class="action-buttons">' +
                        (this.canModifyPassword(user) ? '<button class="btn-action btn-password" onclick="UserPage.showPasswordModal(' + user.id + ')">修改密码</button>' : '') +
                        (this.canEditUser(user) ? '<button class="btn-action btn-edit" onclick="UserPage.editUser(' + user.id + ')">编辑</button>' : '') +
                        (this.canDeleteUser(user) ? '<button class="btn-action btn-delete" onclick="UserPage.deleteUser(' + user.id + ')">删除</button>' : '') +
                    '</div>' +
                '</td>';
            tbody.appendChild(tr);
        });
    },
    
    /**
     * 检查是否可以修改密码
     */
    canModifyPassword: function(user) {
        if (!this.currentUser) return false;
        return this.currentUser.userType === 1 || this.currentUser.id === user.id;
    },
    
    /**
     * 检查是否可以编辑用户
     */
    canEditUser: function(user) {
        if (!this.currentUser) return false;
        return this.currentUser.userType === 1;
    },
    
    /**
     * 检查是否可以删除用户
     */
    canDeleteUser: function(user) {
        if (!this.currentUser) return false;
        return this.currentUser.userType === 1;
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
     * 获取部门名称
     */
    getDeptName: function(deptId) {
        if (!deptId) return '-';
        const dept = this.departments.find(d => d.id === deptId);
        return dept ? ErrorHandler.escapeHtml(dept.deptName) : '-';
    },
    
    /**
     * 搜索用户
     */
    searchUsers: function() {
        const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
        const userTypeFilter = document.getElementById('userTypeFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        
        let filteredUsers = this.users.filter(user => this.canViewUser(user));
        
        if (searchInput) {
            filteredUsers = filteredUsers.filter(user => 
                user.username.toLowerCase().includes(searchInput) ||
                user.realName.toLowerCase().includes(searchInput) ||
                (user.studentNo && user.studentNo.toLowerCase().includes(searchInput))
            );
        }
        
        if (userTypeFilter) {
            filteredUsers = filteredUsers.filter(user => user.userType === parseInt(userTypeFilter));
        }
        
        if (statusFilter !== '') {
            filteredUsers = filteredUsers.filter(user => user.status === parseInt(statusFilter));
        }
        
        this.renderUserTable(filteredUsers);
    },
    
    /**
     * 显示添加用户模态框
     */
    showAddModal: function() {
        if (!this.currentUser || this.currentUser.userType !== 1) {
            ErrorHandler.showError('只有超级管理员可以添加用户', 'message');
            return;
        }
        
        document.getElementById('modalTitle').textContent = '添加用户';
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = '';
        document.getElementById('password').value = '';
        document.getElementById('userModal').classList.add('show');
    },
    
    /**
     * 编辑用户
     */
    editUser: function(id) {
        if (!this.currentUser || this.currentUser.userType !== 1) {
            ErrorHandler.showError('只有超级管理员可以编辑用户', 'message');
            return;
        }
        
        const user = this.users.find(u => u.id === id);
        if (!user) return;
        
        document.getElementById('modalTitle').textContent = '编辑用户';
        document.getElementById('userId').value = user.id;
        document.getElementById('username').value = user.username;
        document.getElementById('realName').value = user.realName;
        document.getElementById('userType').value = user.userType;
        document.getElementById('deptId').value = user.deptId || '';
        document.getElementById('studentNo').value = user.studentNo || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('status').value = user.status;
        
        document.getElementById('userModal').classList.add('show');
    },
    
    /**
     * 关闭模态框
     */
    closeModal: function() {
        document.getElementById('userModal').classList.remove('show');
    },
    
    /**
     * 保存用户
     */
    saveUser: function() {
        const userId = document.getElementById('userId').value;
        const username = document.getElementById('username').value.trim();
        const realName = document.getElementById('realName').value.trim();
        const userType = document.getElementById('userType').value;
        const deptId = document.getElementById('deptId').value;
        const studentNo = document.getElementById('studentNo').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const status = document.getElementById('status').value;
        const password = document.getElementById('password').value;
        
        if (!username || !realName || !userType) {
            ErrorHandler.showError('请填写必填项', 'message');
            return;
        }
        
        if (!userId && !password) {
            ErrorHandler.showError('请输入密码', 'message');
            return;
        }
        
        if (password && password.length < 6) {
            ErrorHandler.showError('密码长度不能少于6位', 'message');
            return;
        }
        
        const userData = {
            username: username,
            realName: realName,
            userType: parseInt(userType),
            deptId: deptId ? parseInt(deptId) : null,
            studentNo: studentNo || null,
            email: email || null,
            phone: phone || null,
            status: parseInt(status)
        };
        
        if (!userId) {
            userData.password = password;
        }
        
        if (userId && password) {
            userData.password = password;
        }
        
        Logger.log('保存用户', { userId, username });
        
        const url = userId ? '/user/' + userId : '/user';
        const method = userId ? 'put' : 'post';
        
        ApiClient[method](url, userData)
            .then(() => {
                Logger.log('用户保存成功');
                ErrorHandler.showSuccess(userId ? '更新成功' : '添加成功', 'message');
                this.closeModal();
                this.loadUsers();
            })
            .catch(error => {
                Logger.error('保存用户失败', error);
                ErrorHandler.showError(error.message || '操作失败', 'message');
            });
    },
    
    /**
     * 删除用户
     */
    deleteUser: function(id) {
        if (!this.currentUser || this.currentUser.userType !== 1) {
            ErrorHandler.showError('只有超级管理员可以删除用户', 'message');
            return;
        }
        
        if (!confirm('确定要删除该用户吗？')) return;
        
        Logger.log('删除用户', { id });
        
        ApiClient.delete('/user/' + id)
            .then(() => {
                Logger.log('用户删除成功');
                ErrorHandler.showSuccess('删除成功', 'message');
                this.loadUsers();
            })
            .catch(error => {
                Logger.error('删除用户失败', error);
                ErrorHandler.showError(error.message || '删除失败', 'message');
            });
    },
    
    /**
     * 显示修改密码模态框
     */
    showPasswordModal: function(id) {
        if (!this.currentUser) return;
        if (this.currentUser.userType !== 1 && this.currentUser.id !== id) {
            ErrorHandler.showError('您只能修改自己的密码', 'message');
            return;
        }
        
        document.getElementById('passwordUserId').value = id;
        document.getElementById('passwordForm').reset();
        
        const oldPasswordGroup = document.getElementById('oldPasswordGroup');
        if (oldPasswordGroup) {
            if (this.currentUser.userType === 1) {
                oldPasswordGroup.style.display = 'none';
            } else {
                oldPasswordGroup.style.display = 'flex';
            }
        }
        
        document.getElementById('passwordModal').classList.add('show');
    },
    
    /**
     * 关闭密码模态框
     */
    closePasswordModal: function() {
        document.getElementById('passwordModal').classList.remove('show');
    },
    
    /**
     * 保存密码
     */
    savePassword: function() {
        const userId = document.getElementById('passwordUserId').value;
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (this.currentUser.userType !== 1) {
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
        } else {
            if (!newPassword || !confirmPassword) {
                ErrorHandler.showError('请填写新密码', 'message');
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
        }
        
        const params = {};
        if (this.currentUser.userType === 1) {
            params.newPassword = newPassword;
        } else {
            params.oldPassword = oldPassword;
            params.newPassword = newPassword;
        }
        
        Logger.log('修改密码', { userId });
        
        const url = this.currentUser.userType === 1 
            ? '/user/' + userId + '/admin-password'
            : '/user/' + userId + '/password';
        
        ApiClient.put(url, null, params)
            .then(() => {
                Logger.log('密码修改成功');
                ErrorHandler.showSuccess('密码修改成功', 'message');
                this.closePasswordModal();
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
    if (typeof contextPath !== 'undefined' && contextPath) {
        AppConfig.apiBaseUrl = contextPath + '/api';
    } else {
        AppConfig.apiBaseUrl = '/api';
        Logger.warn('未找到contextPath，使用默认值 /api');
    }
    
    Logger.log('API基础URL已设置', AppConfig.apiBaseUrl);
    
    // 初始化用户管理页面
    UserPage.init();
});

// 暴露给全局使用
window.searchUsers = function() {
    UserPage.searchUsers();
};

window.showAddModal = function() {
    UserPage.showAddModal();
};

window.editUser = function(id) {
    UserPage.editUser(id);
};

window.closeModal = function() {
    UserPage.closeModal();
};

window.saveUser = function() {
    UserPage.saveUser();
};

window.deleteUser = function(id) {
    UserPage.deleteUser(id);
};

window.showPasswordModal = function(id) {
    UserPage.showPasswordModal(id);
};

window.closePasswordModal = function() {
    UserPage.closePasswordModal();
};

window.savePassword = function() {
    UserPage.savePassword();
};

window.logout = function() {
    UserPage.logout();
};
