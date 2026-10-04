// frontend/js/api.js - API Configuration & Integration Page Script

document.addEventListener('DOMContentLoaded', () => {
    const user = getLoggedInUser();
    const apiKeyInput = document.getElementById('user-api-key-input');
    const connectBtn = document.getElementById('connect-api-btn');
    const generateBtn = document.getElementById('generate-new-key-btn');
    const connectionStatusBox = document.getElementById('api-connection-status');

    if (user && apiKeyInput) {
        apiKeyInput.value = user.api_key || 'HEALTH-API-998877665544332211';
    }

    if (connectBtn) {
        connectBtn.addEventListener('click', async () => {
            const key = apiKeyInput.value.trim();
            if (!key) {
                showToast('Please enter an API Key to test connection', 'warning');
                return;
            }

            connectBtn.disabled = true;
            connectBtn.textContent = 'Connecting...';

            try {
                const response = await fetch('../backend/api/verify_api.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ api_key: key })
                });
                const data = await response.json();
                connectBtn.disabled = false;
                connectBtn.textContent = 'CONNECT API';

                if (connectionStatusBox) {
                    connectionStatusBox.style.display = 'block';
                    if (data.connected) {
                        connectionStatusBox.className = 'status-badge status-normal';
                        connectionStatusBox.style.width = '100%';
                        connectionStatusBox.style.padding = '12px';
                        connectionStatusBox.innerHTML = `🟢 <strong>API Status: Connected & Active</strong><br><small>Device: ${data.device.device_name} (Owner: ${data.device.owner})</small>`;
                        showToast('API Connected Successfully!', 'success');
                    } else {
                        connectionStatusBox.className = 'status-badge status-emergency';
                        connectionStatusBox.style.width = '100%';
                        connectionStatusBox.style.padding = '12px';
                        connectionStatusBox.innerHTML = `❌ <strong>Connection Failed:</strong> ${data.message}`;
                        showToast(data.message, 'error');
                    }
                }
            } catch (e) {
                connectBtn.disabled = false;
                connectBtn.textContent = 'CONNECT API';
                showToast('Error verifying API Key', 'error');
            }
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const user = getLoggedInUser();
            const userId = user ? user.id : 1;

            try {
                const res = await fetch(`../backend/api/generate_api.php?user_id=${userId}`);
                const data = await res.json();
                if (data.status === 'success') {
                    if (apiKeyInput) apiKeyInput.value = data.api_key;
                    if (user) {
                        user.api_key = data.api_key;
                        localStorage.setItem('health_user', JSON.stringify(user));
                    }
                    showToast('New API Key generated & saved!', 'success');
                    updateCodeSnippets(data.api_key);
                }
            } catch (e) {
                showToast('Failed to generate API Key', 'error');
            }
        });
    }

    const currentKey = apiKeyInput ? apiKeyInput.value : 'YOUR_API_KEY';
    updateCodeSnippets(currentKey);
});

function updateCodeSnippets(key) {
    const curlElem = document.getElementById('snippet-curl');
    const arduinoElem = document.getElementById('snippet-arduino');

    if (curlElem) {
        curlElem.textContent = `curl -X POST "${window.location.origin}/backend/api/receive_sensor_data.php" \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "${key}",
    "temperature": 98.6,
    "blood_pressure": "120/80",
    "emergency": false
  }'`;
    }

    if (arduinoElem) {
        arduinoElem.textContent = `#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://your-server-domain/backend/api/receive_sensor_data.php";
const char* apiKey = "${key}";

void sendSensorData(float temp, String bp, bool isEmergency) {
    if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;
        http.begin(client, serverUrl);
        http.addHeader("Content-Type", "application/json");

        String payload = "{\\"api_key\\":\\"" + String(apiKey) + "\\",";
        payload += "\\"temperature\\":" + String(temp, 1) + ",";
        payload += "\\"blood_pressure\\":\\"" + bp + "\\",";
        payload += "\\"emergency\\":" + String(isEmergency ? "true" : "false") + "}";

        int httpCode = http.POST(payload);
        http.end();
    }
}`;
    }
}

function copySnippet(elementId) {
    const elem = document.getElementById(elementId);
    if (elem) {
        navigator.clipboard.writeText(elem.textContent);
        showToast('Code snippet copied to clipboard!', 'success');
    }
}
