# 🏥 Health Monitoring & Emergency Alert System

An end-to-end IoT Health Monitoring Website that collects **Body Temperature (°F)** and **Blood Pressure (mmHg)** from hardware sensors (ESP8266 / ESP32 / Arduino) via REST API, stores data in a **PHP + MySQL** backend, visualizes health trends with dynamic charts, and triggers real-time **Emergency Alerts** with siren audio and notifications when the physical emergency panic button is activated.

---

## 📁 Project Folder Structure

```
c:\Dipu sah\IOT\
├── frontend/
│   ├── index.html           # Home page with hero preview & navbar
│   ├── login.html           # Sign In / Register & OTP verification
│   ├── about.html           # System architecture & project overview
│   ├── contact.html         # Emergency hotline & support contact form
│   ├── dashboard.html       # Patient health metrics, charts & alert status
│   ├── api.html             # API Key configuration & integration snippets
│   ├── css/
│   │   └── style.css        # Professional medical dark UI stylesheet
│   └── js/
│       ├── main.js          # Session manager, navbar & toast alerts
│       ├── login.js         # OTP timer & registration logic
│       ├── dashboard.js     # Live 3s polling, Chart.js & siren sound
│       └── api.js           # API Key connection verifier & snippet code
│
├── backend/
│   ├── config/
│   │   └── database.php     # PDO MySQL connection & JSON fallback
│   ├── auth/
│   │   ├── register.php     # User registration endpoint
│   │   ├── login.php        # OTP generation endpoint
│   │   └── verify_otp.php   # OTP verification & session setup
│   ├── api/
│   │   ├── receive_sensor_data.php  # Receive JSON payloads from sensor
│   │   ├── get_sensor_data.php      # Dashboard data provider
│   │   ├── verify_api.php           # Validate sensor API Key
│   │   └── generate_api.php         # Generate new device API Key
│   ├── alerts/
│   │   ├── emergency_alert.php      # Trigger/resolve panic alerts
│   │   └── get_alerts.php           # Retrieve alert logs
│   └── notifications/
│       └── send_notification.php    # Dispatch SMS/Email alerts
│
├── database/
│   └── database.sql         # Full MySQL Database Schema
│
├── simulator/
│   └── sensor_simulator.html# Hardware Sensor Payload Test Unit
│
└── README.md
```

---

## 🚀 How to Run & Test the Project

### Option A: Using PHP Built-in Server (Easiest - No XAMPP required!)
1. Open PowerShell or Command Prompt in `c:\Dipu sah\IOT`.
2. Run the PHP built-in server command:
   ```bash
   php -S localhost:8000
   ```
3. Open your browser and visit:
   - **Main Website:** [http://localhost:8000/frontend/index.html](http://localhost:8000/frontend/index.html)
   - **Health Dashboard:** [http://localhost:8000/frontend/dashboard.html](http://localhost:8000/frontend/dashboard.html)
   - **Sensor Simulator Tool:** [http://localhost:8000/simulator/sensor_simulator.html](http://localhost:8000/simulator/sensor_simulator.html)

*(Note: The PHP backend automatically handles local JSON file fallback if MySQL server is not active, making the site work immediately out-of-the-box!)*

---

### Option B: Using XAMPP / WAMP (Production Setup with MySQL)
1. Copy the `IOT` folder to your XAMPP `htdocs` directory (e.g. `C:\xampp\htdocs\IOT`).
2. Open **phpMyAdmin** at [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Create a new database named `health_monitor_db`.
4. Import the file `database/database.sql` into `health_monitor_db`.
5. Open your browser: [http://localhost/IOT/frontend/index.html](http://localhost/IOT/frontend/index.html).

---

## 📡 Sensor API Integration

Hardware sensors (ESP8266, ESP32, Arduino) send JSON telemetry data to:
`POST /backend/api/receive_sensor_data.php`

### Sample JSON Payload:
```json
{
  "api_key": "HEALTH-API-998877665544332211",
  "temperature": 98.6,
  "blood_pressure": "120/80",
  "emergency": false
}
```

### Emergency Panic Button Payload:
```json
{
  "api_key": "HEALTH-API-998877665544332211",
  "temperature": 99.2,
  "blood_pressure": "130/85",
  "emergency": true
}
```

---

## 🚨 Emergency Alert Flow

1. Patient presses Emergency Button on Hardware Sensor (or simulator).
2. Sensor sends `"emergency": true` to PHP API (`receive_sensor_data.php`).
3. PHP Backend registers emergency alert entry in database.
4. Logged-in user's website dashboard polls updated status within 3 seconds.
5. Flashing Red Alert Modal banner appears, emergency siren sound plays, and SMS/Email log is generated.

---

## 🔑 Demo Login Credentials
- **Mobile / Email:** `9876543210` or `rahul@gmail.com`
- **Demo OTP:** `123456` (or auto-generated on screen)
