document.addEventListener('DOMContentLoaded', function() {
    const forgotForm = document.getElementById('forgotForm');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submitBtn');

    forgotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
            alert('请输入邮箱');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('请输入有效的邮箱地址');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = '发送中...';
        
        fetch('/api/password/forgot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'email=' + encodeURIComponent(email)
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                alert(data.message);
                window.location.href = 'login.jsp';
            } else {
                alert(data.message || '发送失败');
                submitBtn.disabled = false;
                submitBtn.textContent = '发送重置邮件';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('网络错误，请稍后重试');
            submitBtn.disabled = false;
            submitBtn.textContent = '发送重置邮件';
        });
    });
});