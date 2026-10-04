// frontend/js/main.js - Global Utilities and Session Management

const API_BASE = '../backend';

// Global helper to show toast notifications
function showToast(message, type = 'info') {
    let existingToast = document.querySelector('.toast-msg');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-msg toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';
    if (type === 'emergency') icon = '🚨';

    toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(100%)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Get logged in user details from LocalStorage or Session
function getLoggedInUser() {
    const userJson = localStorage.getItem('health_user');
    if (userJson) {
        try {
            return JSON.parse(userJson);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Update Nav UI based on user login state
function updateNavbar() {
    const user = getLoggedInUser();
    const navAuthContainer = document.getElementById('nav-auth-container');
    if (!navAuthContainer) return;

    if (user) {
        navAuthContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 0.9rem; font-weight: 600; color: #38bdf8;">👤 ${user.name}</span>
                <button onclick="logoutUser()" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.85rem;">Logout</button>
            </div>
        `;
    } else {
        navAuthContainer.innerHTML = `
            <a href="login.html" class="nav-link btn-nav-primary">Sign In / Register</a>
        `;
    }
}

function logoutUser() {
    localStorage.removeItem('health_user');
    showToast('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
});
