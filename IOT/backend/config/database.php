<?php
// backend/config/database.php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'health_monitor_db');

class Database {
    private $host = DB_HOST;
    private $user = DB_USER;
    private $pass = DB_PASS;
    private $dbname = DB_NAME;
    private $conn = null;
    private $isFallback = false;

    public function getConnection() {
        if ($this->conn !== null) {
            return $this->conn;
        }

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->dbname . ";charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->user, $this->pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
            $this->isFallback = false;
        } catch (PDOException $e) {
            // MySQL unavailable - Use JSON File System Fallback
            $this->isFallback = true;
            $this->conn = null;
        }

        return $this->conn;
    }

    public function isFallbackMode() {
        return $this->isFallback;
    }
}

// Global Helper to get JSON store path if database is offline
function getStorageFile($filename) {
    $dir = __DIR__ . '/../../data_store';
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }
    $filepath = $dir . '/' . $filename;
    if (!file_exists($filepath)) {
        file_put_contents($filepath, json_encode([]));
    }
    return $filepath;
}

function readJsonStore($filename) {
    $file = getStorageFile($filename);
    $content = file_get_contents($file);
    return json_decode($content, true) ?: [];
}

function writeJsonStore($filename, $data) {
    $file = getStorageFile($filename);
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

// Seed initial fallback data
(function() {
    $usersFile = getStorageFile('users.json');
    $users = readJsonStore('users.json');
    if (empty($users)) {
        $users[] = [
            'id' => 1,
            'name' => 'Rahul Sharma',
            'mobile' => '9876543210',
            'email' => 'rahul@example.com',
            'otp' => '123456',
            'otp_expiry' => date('Y-m-d H:i:s', strtotime('+10 minutes')),
            'created_at' => date('Y-m-d H:i:s')
        ];
        writeJsonStore('users.json', $users);
    }

    $devices = readJsonStore('api_devices.json');
    if (empty($devices)) {
        $devices[] = [
            'id' => 1,
            'user_id' => 1,
            'api_key' => 'HEALTH-API-998877665544332211',
            'device_name' => 'PulseTemp Sensor-01',
            'status' => 'active',
            'created_at' => date('Y-m-d H:i:s')
        ];
        writeJsonStore('api_devices.json', $devices);
    }

    $health = readJsonStore('health_data.json');
    if (empty($health)) {
        $health[] = [
            'id' => 1,
            'user_id' => 1,
            'temperature' => 98.6,
            'blood_pressure' => '120/80',
            'systolic' => 120,
            'diastolic' => 80,
            'emergency' => 0,
            'created_at' => date('Y-m-d H:i:s')
        ];
        writeJsonStore('health_data.json', $health);
    }

    $alerts = readJsonStore('alerts.json');
    if (empty($alerts)) {
        $alerts[] = [
            'id' => 1,
            'user_id' => 1,
            'alert_message' => 'System Initialized Successfully',
            'alert_type' => 'NORMAL',
            'status' => 'READ',
            'created_at' => date('Y-m-d H:i:s')
        ];
        writeJsonStore('alerts.json', $alerts);
    }
})();
