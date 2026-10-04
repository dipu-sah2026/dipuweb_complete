// frontend/js/dashboard.js - Dynamic Health Dashboard & Live Polling

let tempChart = null;
let bpChart = null;
let pollInterval = null;
let alertAudioCtx = null;
let isSirenPlaying = false;
let sirenOsc = null;

document.addEventListener('DOMContentLoaded', () => {
    const user = getLoggedInUser();
    const welcomeUserElem = document.getElementById('welcome-user-name');
    if (welcomeUserElem) {
        welcomeUserElem.textContent = user ? user.name : 'Patient';
    }

    initCharts();
    fetchDashboardData();

    // Poll backend every 3 seconds for real-time sensor updates
    pollInterval = setInterval(fetchDashboardData, 3000);

    const resolveBtn = document.getElementById('resolve-alert-btn');
    if (resolveBtn) {
        resolveBtn.addEventListener('click', resolveEmergency);
    }
});

async function fetchDashboardData() {
    const user = getLoggedInUser();
    const userId = user ? user.id : 1;

    try {
        const response = await fetch(`../backend/api/get_sensor_data.php?user_id=${userId}`);
        const data = await response.json();

        if (data.status === 'success') {
            updateDashboardUI(data);
        }
    } catch (error) {
        console.error('Error fetching sensor data:', error);
    }
}

function updateDashboardUI(data) {
    const current = data.current;
    const sysStatus = data.system_status;
    const alertStatus = data.alert_status;

    // Update Temperature Card
    const tempValElem = document.getElementById('temp-value');
    if (tempValElem) {
        tempValElem.textContent = current.temperature.toFixed(1);
    }

    // Update Blood Pressure Card
    const bpValElem = document.getElementById('bp-value');
    if (bpValElem) {
        bpValElem.textContent = current.blood_pressure;
    }

    // Update Last Updated Timestamp
    const lastUpdateElem = document.getElementById('last-updated-time');
    if (lastUpdateElem) {
        lastUpdateElem.textContent = current.last_updated_formatted;
    }

    // Update System Status Indicator
    const sysStatusBadge = document.getElementById('system-status-badge');
    if (sysStatusBadge) {
        sysStatusBadge.className = `status-badge ${sysStatus.badge_class}`;
        sysStatusBadge.innerHTML = `${sysStatus.icon} <span>${sysStatus.title}</span>`;
    }

    // Update Alert Banner
    const alertBox = document.getElementById('emergency-banner');
    const alertMsgElem = document.getElementById('alert-message-text');
    const alertCardText = document.getElementById('dashboard-alert-text');

    if (alertCardText) {
        alertCardText.textContent = alertStatus.message;
    }

    if (alertStatus.is_emergency) {
        if (alertBox) alertBox.style.display = 'flex';
        if (alertMsgElem) alertMsgElem.textContent = alertStatus.message;
        playEmergencySiren();
    } else {
        if (alertBox) alertBox.style.display = 'none';
        stopEmergencySiren();
    }

    // Update Charts
    updateCharts(data.history);

    // Update History Table
    updateHistoryTable(data.history);
}

function initCharts() {
    const ctxTemp = document.getElementById('tempChart')?.getContext('2d');
    const ctxBp = document.getElementById('bpChart')?.getContext('2d');

    if (ctxTemp) {
        tempChart = new Chart(ctxTemp, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Body Temperature (°F)',
                    data: [],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' }, suggestedMin: 95, suggestedMax: 105 }
                }
            }
        });
    }

    if (ctxBp) {
        bpChart = new Chart(ctxBp, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Systolic (mmHg)',
                        data: [],
                        borderColor: '#06b6d4',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.3
                    },
                    {
                        label: 'Diastolic (mmHg)',
                        data: [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#94a3b8' } } },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' }, suggestedMin: 50, suggestedMax: 160 }
                }
            }
        });
    }
}

function updateCharts(history) {
    if (!history || history.length === 0) return;

    const labels = history.map(h => h.time);
    const temps = history.map(h => h.temp);
    const systolics = history.map(h => h.sys);
    const diastolics = history.map(h => h.dia);

    if (tempChart) {
        tempChart.data.labels = labels;
        tempChart.data.datasets[0].data = temps;
        tempChart.update();
    }

    if (bpChart) {
        bpChart.data.labels = labels;
        bpChart.data.datasets[0].data = systolics;
        bpChart.data.datasets[1].data = diastolics;
        bpChart.update();
    }
}

function updateHistoryTable(history) {
    const tableBody = document.getElementById('history-table-body');
    if (!tableBody || !history) return;

    tableBody.innerHTML = history.slice(-8).reverse().map(h => {
        let statusBadge = `<span class="status-badge status-normal">Normal</span>`;
        if (h.temp >= 100.4) {
            statusBadge = `<span class="status-badge status-warning">High Temp</span>`;
        } else if (h.sys >= 140) {
            statusBadge = `<span class="status-badge status-warning">High BP</span>`;
        }

        return `
            <tr>
                <td>${h.time}, ${h.date}</td>
                <td><strong>${h.temp} °F</strong></td>
                <td><strong>${h.bp} mmHg</strong></td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

async function resolveEmergency() {
    const user = getLoggedInUser();
    const userId = user ? user.id : 1;

    try {
        const response = await fetch('../backend/alerts/emergency_alert.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, action: 'resolve' })
        });
        const data = await response.json();
        if (data.status === 'success') {
            stopEmergencySiren();
            showToast('Emergency alert resolved', 'success');
            fetchDashboardData();
        }
    } catch (e) {
        console.error('Error resolving alert', e);
    }
}

// Web Audio API Emergency Siren Sound Generator
function playEmergencySiren() {
    if (isSirenPlaying) return;
    try {
        if (!alertAudioCtx) {
            alertAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (alertAudioCtx.state === 'suspended') {
            alertAudioCtx.resume();
        }

        sirenOsc = alertAudioCtx.createOscillator();
        const gainNode = alertAudioCtx.createGain();

        sirenOsc.type = 'sawtooth';
        sirenOsc.frequency.setValueAtTime(600, alertAudioCtx.currentTime);
        sirenOsc.frequency.linearRampToValueAtTime(900, alertAudioCtx.currentTime + 0.3);

        gainNode.gain.setValueAtTime(0.15, alertAudioCtx.currentTime);

        sirenOsc.connect(gainNode);
        gainNode.connect(alertAudioCtx.destination);

        sirenOsc.start();
        isSirenPlaying = true;
    } catch (e) {
        console.log('Audio autoplay restricted by browser');
    }
}

function stopEmergencySiren() {
    if (sirenOsc) {
        try {
            sirenOsc.stop();
            sirenOsc.disconnect();
        } catch (e) {}
        sirenOsc = null;
    }
    isSirenPlaying = false;
}

// Helper function to simulate sensor send directly from dashboard toolbar
async function simulateSensorAction(type) {
    const user = getLoggedInUser();
    const apiKey = user && user.api_key ? user.api_key : 'HEALTH-API-998877665544332211';

    let payload = {
        api_key: apiKey,
        temperature: 98.6,
        blood_pressure: "120/80",
        emergency: false
    };

    if (type === 'high_temp') {
        payload.temperature = 101.8;
    } else if (type === 'high_bp') {
        payload.blood_pressure = "150/95";
    } else if (type === 'emergency') {
        payload.emergency = true;
        payload.temperature = 99.2;
    }

    try {
        const response = await fetch('../backend/api/receive_sensor_data.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const res = await response.json();
        showToast(res.message, type === 'emergency' ? 'emergency' : 'success');
        fetchDashboardData();
    } catch (err) {
        showToast('Error sending simulated sensor payload', 'error');
    }
}
