document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');
    const deptSelect = document.getElementById('deptId');

    loadDepartments();

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
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
            showMessage('请填写必填项', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('两次输入的密码不一致', 'error');
            return;
        }
        
        if (password.length < 6) {
            showMessage('密码长度不能少于6位', 'error');
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
        
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                showMessage('注册成功，正在跳转到登录页面...', 'success');
                setTimeout(function() {
                    window.location.href = '/login.jsp';
                }, 1500);
            } else {
                showMessage(data.message || '注册失败', 'error');
            }
        })
        .catch(error => {
            showMessage('注册失败：' + error.message, 'error');
        });
    });

    function loadDepartments() {
        fetch('/api/department/list')
            .then(response => response.json())
            .then(data => {
                if (data.code === 200 && data.data) {
                    deptSelect.innerHTML = '<option value="">请选择部门</option>';
                    data.data.forEach(dept => {
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

    function showMessage(msg, type) {
        messageDiv.textContent = msg;
        messageDiv.className = 'message ' + type;
        messageDiv.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(function() {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    }
});
