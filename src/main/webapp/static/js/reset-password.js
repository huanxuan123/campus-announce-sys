document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('resetForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitBtn = document.getElementById('submitBtn');

    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
        alert('无效的重置链接');
        window.location.href = '/login.jsp';
        return;
    }

    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        
        if (!newPassword) {
            alert('请输入新密码');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('密码长度不能少于6位');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = '重置中...';
        
        fetch('/api/password/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'token=' + encodeURIComponent(token) + '&newPassword=' + encodeURIComponent(newPassword)
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                alert(data.message);
                window.location.href = '/login.jsp';
            } else {
                alert(data.message || '重置失败');
                submitBtn.disabled = false;
                submitBtn.textContent = '重置密码';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('网络错误，请稍后重试');
            submitBtn.disabled = false;
            submitBtn.textContent = '重置密码';
        });
    });
});