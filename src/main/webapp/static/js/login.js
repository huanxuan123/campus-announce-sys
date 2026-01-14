document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            showMessage('请输入用户名和密码', 'error');
            return;
        }
        
        const loginData = {
            username: username,
            password: password
        };
        
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                showMessage('登录成功，正在跳转...', 'success');
                setTimeout(function() {
                    window.location.href = '/index.jsp';
                }, 1000);
            } else {
                showMessage(data.message || '登录失败', 'error');
            }
        })
        .catch(error => {
            showMessage('登录失败：' + error.message, 'error');
        });
    });

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
