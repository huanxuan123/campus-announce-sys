let currentUser = null;
let departments = [];

document.addEventListener('DOMContentLoaded', function() {
    loadCurrentUser();
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
                loadProfileData();
            } else {
                window.location.href = '/login.jsp';
            }
        })
        .catch(error => {
            console.error('获取用户信息失败:', error);
            window.location.href = '/login.jsp';
        });
}

function loadDepartments() {
    fetch('/api/department/list')
        .then(response => response.json())
        .then(data => {
            if (data.code === 200 && data.data) {
                departments = data.data;
            }
        })
        .catch(error => {
            console.error('加载部门列表失败:', error);
        });
}

function loadProfileData() {
    if (!currentUser) return;
    
    document.getElementById('userId').value = currentUser.id;
    document.getElementById('username').value = currentUser.username;
    document.getElementById('realName').value = currentUser.realName;
    document.getElementById('userType').value = getUserTypeName(currentUser.userType);
    document.getElementById('studentNo').value = currentUser.studentNo || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    
    if (currentUser.deptId) {
        const dept = departments.find(d => d.id === currentUser.deptId);
        document.getElementById('deptName').value = dept ? dept.deptName : '';
    } else {
        document.getElementById('deptName').value = '';
    }
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

function saveProfile() {
    if (!currentUser) return;
    
    const realName = document.getElementById('realName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (!realName) {
        showMessage('请填写真实姓名', 'error');
        return;
    }
    
    const userData = {
        id: currentUser.id,
        realName: realName,
        email: email || null,
        phone: phone || null
    };
    
    fetch(`/api/user/${currentUser.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            showMessage('个人信息修改成功', 'success');
            loadCurrentUser();
        } else {
            showMessage(data.message || '修改失败', 'error');
        }
    })
    .catch(error => {
        showMessage('修改失败：' + error.message, 'error');
    });
}

function resetForm() {
    if (!currentUser) return;
    loadProfileData();
    showMessage('已重置为原始信息', 'success');
}

function savePassword() {
    if (!currentUser) return;
    
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
    
    fetch(`/api/user/${currentUser.id}/password?oldPassword=${oldPassword}&newPassword=${newPassword}`, {
        method: 'PUT'
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            showMessage('密码修改成功', 'success');
            document.getElementById('passwordForm').reset();
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
