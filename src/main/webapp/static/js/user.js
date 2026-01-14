let currentUser = null;
let users = [];
let departments = [];

document.addEventListener('DOMContentLoaded', function() {
    loadCurrentUser();
    loadUsers();
    loadDepartments();
});

function loadCurrentUser() {
    fetch('/api/currentUser')
        .then(response => response.json())
        .then(data => {
            if (data.code === 200 && data.data) {
                currentUser = data.data;
                document.getElementById('userName').textContent = '欢迎，' + data.data.realName;
                localStorage.setItem('currentUser', JSON.stringify(data.data));
            } else {
                window.location.href = '/login.jsp';
            }
        })
        .catch(error => {
            console.error('获取用户信息失败:', error);
            window.location.href = '/login.jsp';
        });
}

function loadUsers() {
    fetch('/api/user/list')
        .then(response => response.json())
        .then(data => {
            if (data.code === 200 && data.data) {
                users = data.data;
                renderUserTable(users);
            } else {
                showMessage('加载用户列表失败', 'error');
            }
        })
        .catch(error => {
            console.error('加载用户列表失败:', error);
            showMessage('加载用户列表失败', 'error');
        });
}

function loadDepartments() {
    fetch('/api/department/list')
        .then(response => response.json())
        .then(data => {
            if (data.code === 200 && data.data) {
                departments = data.data;
                const deptSelect = document.getElementById('deptId');
                deptSelect.innerHTML = '<option value="">请选择</option>';
                departments.forEach(dept => {
                    const option = document.createElement('option');
                    option.value = dept.id;
                    option.textContent = dept.deptName;
                    deptSelect.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('加载部门列表失败:', error);
        });
}

function canViewUser(targetUser) {
    if (!currentUser) return false;
    
    const currentUserType = currentUser.userType;
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
}

function renderUserTable(userList) {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';
    
    const visibleUsers = userList.filter(user => canViewUser(user));
    
    if (visibleUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:40px;color:#999;">暂无用户数据</td></tr>';
        return;
    }
    
    visibleUsers.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.realName}</td>
            <td><span class="user-type-badge">${getUserTypeName(user.userType)}</span></td>
            <td>${getDeptName(user.deptId)}</td>
            <td>${user.studentNo || '-'}</td>
            <td>${user.email || '-'}</td>
            <td>${user.phone || '-'}</td>
            <td><span class="status-badge ${user.status === 1 ? 'active' : 'inactive'}">${user.status === 1 ? '启用' : '禁用'}</span></td>
            <td>
                <div class="action-buttons">
                    ${canModifyPassword(user) ? `<button class="btn-action btn-password" onclick="showPasswordModal(${user.id})">修改密码</button>` : ''}
                    ${canEditUser(user) ? `<button class="btn-action btn-edit" onclick="editUser(${user.id})">编辑</button>` : ''}
                    ${canDeleteUser(user) ? `<button class="btn-action btn-delete" onclick="deleteUser(${user.id})">删除</button>` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function canModifyPassword(user) {
    if (!currentUser) return false;
    return currentUser.userType === 1 || currentUser.id === user.id;
}

function canEditUser(user) {
    if (!currentUser) return false;
    return currentUser.userType === 1;
}

function canDeleteUser(user) {
    if (!currentUser) return false;
    return currentUser.userType === 1;
}

function getUserTypeName(type) {
    const types = {
        1: '系统管理员',
        2: '部门管理员',
        3: '教师',
        4: '学生'
    };
    return types[type] || '未知';
}

function getDeptName(deptId) {
    if (!deptId) return '-';
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.deptName : '-';
}

function searchUsers() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const userTypeFilter = document.getElementById('userTypeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredUsers = users.filter(user => canViewUser(user));
    
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
    
    renderUserTable(filteredUsers);
}

function showAddModal() {
    if (!currentUser || currentUser.userType !== 1) {
        showMessage('只有超级管理员可以添加用户', 'error');
        return;
    }
    
    document.getElementById('modalTitle').textContent = '添加用户';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userModal').classList.add('show');
}

function editUser(id) {
    if (!currentUser || currentUser.userType !== 1) {
        showMessage('只有超级管理员可以编辑用户', 'error');
        return;
    }
    
    const user = users.find(u => u.id === id);
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
}

function closeModal() {
    document.getElementById('userModal').classList.remove('show');
}

function saveUser() {
    const userId = document.getElementById('userId').value;
    const username = document.getElementById('username').value.trim();
    const realName = document.getElementById('realName').value.trim();
    const userType = document.getElementById('userType').value;
    const deptId = document.getElementById('deptId').value;
    const studentNo = document.getElementById('studentNo').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const status = document.getElementById('status').value;
    
    if (!username || !realName || !userType) {
        showMessage('请填写必填项', 'error');
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
    
    const url = userId ? `/api/user/${userId}` : '/api/user';
    const method = userId ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            showMessage(userId ? '更新成功' : '添加成功', 'success');
            closeModal();
            loadUsers();
        } else {
            showMessage(data.message || '操作失败', 'error');
        }
    })
    .catch(error => {
        showMessage('操作失败：' + error.message, 'error');
    });
}

function deleteUser(id) {
    if (!currentUser || currentUser.userType !== 1) {
        showMessage('只有超级管理员可以删除用户', 'error');
        return;
    }
    
    if (!confirm('确定要删除该用户吗？')) return;
    
    fetch(`/api/user/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            showMessage('删除成功', 'success');
            loadUsers();
        } else {
            showMessage(data.message || '删除失败', 'error');
        }
    })
    .catch(error => {
        showMessage('删除失败：' + error.message, 'error');
    });
}

function showPasswordModal(id) {
    if (!currentUser) return;
    if (currentUser.userType !== 1 && currentUser.id !== id) {
        showMessage('您只能修改自己的密码', 'error');
        return;
    }
    
    document.getElementById('passwordUserId').value = id;
    document.getElementById('passwordForm').reset();
    document.getElementById('passwordModal').classList.add('show');
}

function closePasswordModal() {
    document.getElementById('passwordModal').classList.remove('show');
}

function savePassword() {
    const userId = document.getElementById('passwordUserId').value;
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!oldPassword || !newPassword || !confirmPassword) {
        showMessage('请填写所有密码字段', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showMessage('两次输入的新密码不一致', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showMessage('新密码长度不能少于6位', 'error');
        return;
    }
    
    fetch(`/api/user/${userId}/password?oldPassword=${oldPassword}&newPassword=${newPassword}`, {
        method: 'PUT'
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            showMessage('密码修改成功', 'success');
            closePasswordModal();
        } else {
            showMessage(data.message || '密码修改失败', 'error');
        }
    })
    .catch(error => {
        showMessage('密码修改失败：' + error.message, 'error');
    });
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        fetch('/api/logout', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                localStorage.removeItem('currentUser');
                window.location.href = '/login.jsp';
            }
        })
        .catch(error => {
            console.error('退出登录失败:', error);
        });
    }
}

function showMessage(msg, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = msg;
    messageDiv.className = 'message ' + type;
    
    if (type === 'success') {
        setTimeout(function() {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}
