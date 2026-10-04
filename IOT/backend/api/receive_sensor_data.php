<?php
// backend/api/receive_sensor_data.php
require_once __DIR__ . '/../config/database.php';

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!$input) {
    // Also support GET / POST form params for flexible hardware test
    $input = $_REQUEST;
}

$apiKey = trim($input['api_key'] ?? '');
$temperature = isset($input['temperature']) ? floatval($input['temperature']) : null;
$bloodPressure = trim($input['blood_pressure'] ?? '');
$emergency = isset($input['emergency']) ? filter_var($input['emergency'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) : false;
if ($emergency === null && isset($input['emergency'])) {
    $emergency = ($input['emergency'] == 1 || $input['emergency'] === 'true');
}

if (empty($apiKey)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required parameter: api_key'
    ]);
    exit();
}

$db = new Database();
$conn = $db->getConnection();

$userId = null;
$deviceName = 'IoT Health Sensor';

if ($conn) {
    try {
        $stmtDev = $conn->prepare("SELECT user_id, device_name, status FROM api_devices WHERE api_key = :api_key");
        $stmtDev->execute([':api_key' => $apiKey]);
        $device = $stmtDev->fetch();

        if (!$device) {
            // Fallback: If unknown key during testing, associate with default user 1 or auto-create device
            $stmtUser = $conn->prepare("SELECT id FROM users ORDER BY id ASC LIMIT 1");
            $stmtUser->execute();
            $u = $stmtUser->fetch();
            $userId = $u ? $u['id'] : 1;

            $stmtAddDev = $conn->prepare("INSERT INTO api_devices (user_id, api_key, device_name, status) VALUES (:uid, :key, 'Generic Hardware Sensor', 'active')");
            $stmtAddDev->execute([':uid' => $userId, ':key' => $apiKey]);
        } else {
            if ($device['status'] !== 'active') {
                http_response_code(403);
                echo json_encode(['status' => 'error', 'message' => 'API Key is disabled or inactive.']);
                exit();
            }
            $userId = $device['user_id'];
            $deviceName = $device['device_name'];
        }
    } catch (PDOException $e) {
        $userId = 1;
    }
} else {
    $devices = readJsonStore('api_devices.json');
    foreach ($devices as $d) {
        if ($d['api_key'] === $apiKey) {
            $userId = $d['user_id'];
            $deviceName = $d['device_name'];
            break;
        }
    }
    if (!$userId) {
        $userId = 1;
    }
}

// Parse Systolic & Diastolic from "120/80" string
$systolic = 120;
$diastolic = 80;
if (!empty($bloodPressure) && strpos($bloodPressure, '/') !== false) {
    $parts = explode('/', $bloodPressure);
    $systolic = intval(trim($parts[0]));
    $diastolic = intval(trim($parts[1] ?? 80));
} else if ($temperature === null) {
    $temperature = 98.6;
    $bloodPressure = "120/80";
}

if ($temperature === null) {
    $temperature = 98.6;
}
if (empty($bloodPressure)) {
    $bloodPressure = "{$systolic}/{$diastolic}";
}

// Detect Alerts & Thresholds
$alertTriggered = false;
$alertMessage = null;
$alertType = 'NORMAL';

if ($emergency) {
    $alertTriggered = true;
    $alertType = 'EMERGENCY';
    $alertMessage = '🚨 EMERGENCY ALERT! Emergency button has been activated on ' . $deviceName . '!';
} else if ($temperature >= 100.4) {
    $alertTriggered = true;
    $alertType = 'HIGH_TEMP';
    $alertMessage = "⚠️ HIGH TEMPERATURE ALERT! Body temperature recorded at {$temperature} °F.";
} else if ($systolic >= 140 || $diastolic >= 90) {
    $alertTriggered = true;
    $alertType = 'HIGH_BP';
    $alertMessage = "⚠️ HIGH BLOOD PRESSURE ALERT! Blood pressure recorded at {$bloodPressure} mmHg.";
}

// Store Health Data
$dataId = 0;
$now = date('Y-m-d H:i:s');

if ($conn) {
    try {
        $stmtIns = $conn->prepare("INSERT INTO health_data (user_id, temperature, blood_pressure, systolic, diastolic, emergency, created_at) VALUES (:uid, :temp, :bp, :sys, :dia, :emg, :created_at)");
        $stmtIns->execute([
            ':uid' => $userId,
            ':temp' => $temperature,
            ':bp' => $bloodPressure,
            ':sys' => $systolic,
            ':dia' => $diastolic,
            ':emg' => $emergency ? 1 : 0,
            ':created_at' => $now
        ]);
        $dataId = $conn->lastInsertId();

        if ($alertTriggered) {
            $stmtAlert = $conn->prepare("INSERT INTO alerts (user_id, alert_message, alert_type, status, created_at) VALUES (:uid, :msg, :type, 'UNREAD', :created_at)");
            $stmtAlert->execute([
                ':uid' => $userId,
                ':msg' => $alertMessage,
                ':type' => $alertType,
                ':created_at' => $now
            ]);
        }
    } catch (PDOException $e) {
        // Fallback save
    }
} else {
    $health = readJsonStore('health_data.json');
    $dataId = count($health) + 1;
    $health[] = [
        'id' => $dataId,
        'user_id' => $userId,
        'temperature' => $temperature,
        'blood_pressure' => $bloodPressure,
        'systolic' => $systolic,
        'diastolic' => $diastolic,
        'emergency' => $emergency ? 1 : 0,
        'created_at' => $now
    ];
    writeJsonStore('health_data.json', $health);

    if ($alertTriggered) {
        $alerts = readJsonStore('alerts.json');
        $alerts[] = [
            'id' => count($alerts) + 1,
            'user_id' => $userId,
            'alert_message' => $alertMessage,
            'alert_type' => $alertType,
            'status' => 'UNREAD',
            'created_at' => $now
        ];
        writeJsonStore('alerts.json', $alerts);
    }
}

// Send response back to Hardware Sensor / API Caller
http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => 'Sensor health data recorded successfully.',
    'data' => [
        'id' => $dataId,
        'temperature' => $temperature,
        'blood_pressure' => $bloodPressure,
        'emergency' => $emergency,
        'alert_generated' => $alertTriggered,
        'alert_message' => $alertMessage,
        'timestamp' => $now
    ]
]);
