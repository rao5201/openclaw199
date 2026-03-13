// 登录功能脚本
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const loginBtn = document.querySelector('.btn-login');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoading = loginBtn.querySelector('.btn-loading');

    // 加载记住的密码
    loadRememberedCredentials();

    // 表单提交处理
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    // 回车键登录
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });

    // 处理登录
    function handleLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            showError('请输入用户名和密码');
            return;
        }

        // 禁用按钮，显示加载状态
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        // 模拟API请求延迟
        setTimeout(() => {
            // 验证用户名密码（演示用）
            if (username === 'admin' && password === 'admin123') {
                // 登录成功
                if (rememberCheckbox.checked) {
                    saveCredentials(username, password);
                } else {
                    clearCredentials();
                }

                // 设置登录状态
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                sessionStorage.setItem('loginTime', new Date().toISOString());

                // 跳转到主页
                window.location.href = 'index.html';
            } else {
                // 登录失败
                showError('用户名或密码错误');
                loginBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                
                // 添加抖动动画
                const card = document.querySelector('.login-card');
                card.style.animation = 'none';
                card.offsetHeight; // 触发重绘
                card.style.animation = 'shake 0.5s ease';
            }
        }, 1000);
    }

    // 显示错误信息
    function showError(message) {
        // 移除旧的错误提示
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // 创建新的错误提示
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.textContent = message;
        loginForm.insertBefore(errorDiv, loginForm.firstChild);

        // 3秒后自动消失
        setTimeout(() => {
            errorDiv.classList.remove('show');
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    // 保存凭证
    function saveCredentials(username, password) {
        localStorage.setItem('rememberedUsername', username);
        localStorage.setItem('rememberedPassword', password);
        localStorage.setItem('rememberCredentials', 'true');
    }

    // 加载记住的凭证
    function loadRememberedCredentials() {
        if (localStorage.getItem('rememberCredentials') === 'true') {
            usernameInput.value = localStorage.getItem('rememberedUsername') || '';
            passwordInput.value = localStorage.getItem('rememberedPassword') || '';
            rememberCheckbox.checked = true;
        }
    }

    // 清除凭证
    function clearCredentials() {
        localStorage.removeItem('rememberedUsername');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberCredentials');
    }
});

// 切换密码显示/隐藏
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🔒';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// 检查是否已登录
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // 检查会话是否过期（24小时）
        const loginTime = sessionStorage.getItem('loginTime');
        if (loginTime) {
            const elapsed = Date.now() - new Date(loginTime).getTime();
            const hours = elapsed / (1000 * 60 * 60);
            
            if (hours < 24) {
                // 会话有效，跳转到主页
                window.location.href = 'index.html';
                return true;
            }
        }
    }
    return false;
}

// 页面加载时检查登录状态
checkLoginStatus();
