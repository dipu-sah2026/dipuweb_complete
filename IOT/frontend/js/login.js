// frontend/js/login.js - Authentication & OTP handling

let currentUserId = null;
let otpCountdownTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-step-form');
    const otpForm = document.getElementById('otp-step-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const nameGroup = document.getElementById('name-group');
    const authSubmitBtn = document.getElementById('auth-submit-btn');

    let mode = 'login'; // 'login' or 'register'

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            mode = 'login';
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            nameGroup.style.display = 'none';
            authSubmitBtn.textContent = 'Generate OTP';
        });

        tabRegister.addEventListener('click', () => {
            mode = 'register';
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            nameGroup.style.display = 'block';
            authSubmitBtn.textContent = 'Register & Send OTP';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const identifier = document.getElementById('identifier-input').value.trim();
            const name = document.getElementById('name-input')?.value.trim() || '';

            if (!identifier) {
                showToast('Please enter your Mobile Number or Email', 'error');
                return;
            }

            authSubmitBtn.disabled = true;
            authSubmitBtn.textContent = 'Generating OTP...';

            try {
                const endpoint = mode === 'register' ? '../backend/auth/register.php' : '../backend/auth/login.php';
                const payload = mode === 'register' 
                    ? { name: name || 'User', mobile: identifier, email: identifier.includes('@') ? identifier : `${identifier}@example.com` }
                    : { identifier };

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                authSubmitBtn.disabled = false;
                authSubmitBtn.textContent = mode === 'register' ? 'Register & Send OTP' : 'Generate OTP';

                if (data.status === 'success') {
                    currentUserId = data.user_id;
                    showToast(data.message + ` (Demo OTP: ${data.demo_otp})`, 'success');
                    
                    // Show OTP Banner on UI
                    const demoBox = document.getElementById('demo-otp-banner');
                    if (demoBox) {
                        demoBox.style.display = 'block';
                        demoBox.innerHTML = `🔑 <strong>DEMO OTP CODE:</strong> <span style="font-size: 1.2rem; font-weight:800; color:#10b981;">${data.demo_otp}</span>`;
                    }

                    // Transition to OTP Form
                    loginForm.style.display = 'none';
                    otpForm.style.display = 'block';
                    startOtpTimer();
                    setupOtpInputs();
                } else {
                    showToast(data.message, 'error');
                }
            } catch (error) {
                authSubmitBtn.disabled = false;
                showToast('Error connecting to backend API', 'error');
            }
        });
    }

    if (otpForm) {
        otpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = document.querySelectorAll('.otp-input');
            let otp = '';
            inputs.forEach(input => otp += input.value);

            if (otp.length < 6) {
                showToast('Please enter full 6-digit OTP code', 'warning');
                return;
            }

            const verifyBtn = document.getElementById('otp-verify-btn');
            verifyBtn.disabled = true;
            verifyBtn.textContent = 'Verifying...';

            try {
                const response = await fetch('../backend/auth/verify_otp.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: currentUserId, otp: otp })
                });

                const data = await response.json();
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Verify & Login';

                if (data.status === 'success') {
                    showToast('OTP Verification Successful! Logging in...', 'success');
                    localStorage.setItem('health_user', JSON.stringify(data.user));
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    showToast(data.message, 'error');
                }
            } catch (error) {
                verifyBtn.disabled = false;
                showToast('Server error during OTP verification', 'error');
            }
        });
    }
});

function setupOtpInputs() {
    const inputs = document.querySelectorAll('.otp-input');
    inputs.forEach((input, index) => {
        input.value = '';
        input.addEventListener('keyup', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            } else if (e.key === 'Backspace') {
                if (index > 0) {
                    inputs[index - 1].focus();
                }
            }
        });
    });
    if (inputs.length > 0) inputs[0].focus();
}

function startOtpTimer() {
    let timeLeft = 60;
    const timerElem = document.getElementById('timer-seconds');
    const resendBtn = document.getElementById('resend-otp-btn');
    if (resendBtn) resendBtn.disabled = true;

    if (otpCountdownTimer) clearInterval(otpCountdownTimer);

    otpCountdownTimer = setInterval(() => {
        timeLeft--;
        if (timerElem) timerElem.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(otpCountdownTimer);
            if (resendBtn) resendBtn.disabled = false;
        }
    }, 1000);
}
