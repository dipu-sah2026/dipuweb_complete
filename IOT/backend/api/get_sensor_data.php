<?php
// backend/api/get_sensor_data.php
require_once __DIR__ . '/../config/database.php';

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : ($_SESSION['user_id'] ?? 1);

$db = new Database();
$conn = $db->getConnection();

$latestReading = null;
$history = [];
$latestAlert = null;
$unreadAlertCount = 0;

if ($conn) {
    try {
        // Fetch latest reading
        $stmtLatest = $conn->prepare("SELECT * FROM health_data WHERE user_id = :uid ORDER BY id DESC LIMIT 1");
        $stmtLatest->execute([':uid' => $userId]);
        $latestReading = $stmtLatest->fetch();

        // Fetch historical readings (last 15)
        $stmtHist = $conn->prepare("SELECT * FROM (SELECT * FROM health_data WHERE user_id = :uid ORDER BY id DESC LIMIT 15) sub ORDER BY id ASC");
        $stmtHist->execute([':uid' => $userId]);
        $history = $stmtHist->fetchAll();

        // Fetch latest active alert
        $stmtAlert = $conn->prepare("SELECT * FROM alerts WHERE user_id = :uid ORDER BY id DESC LIMIT 1");
        $stmtAlert->execute([':uid' => $userId]);
        $latestAlert = $stmtAlert->fetch();

        // Count unread alerts
        $stmtCount = $conn->prepare("SELECT COUNT(*) as unread FROM alerts WHERE user_id = :uid AND status = 'UNREAD'");
        $stmtCount->execute([':uid' => $userId]);
        $resCount = $stmtCount->fetch();
        $unreadAlertCount = $resCount ? intval($resCount['unread']) : 0;
    } catch (PDOException $e) {
        // Fallback
    }
}

if (!$latestReading) {
    $healthStore = readJsonStore('health_data.json');
    $userHealth = array_filter($healthStore, function($item) use ($userId) {
        return $item['user_id'] == $userId;
    });

    if (!empty($userHealth)) {
        $userHealth = array_values($userHealth);
        $latestReading = end($userHealth);
        $history = array_slice($userHealth, -15);
    } else {
        $latestReading = [
            'id' => 1,
            'user_id' => $userId,
            'temperature' => 98.6,
            'blood_pressure' => '120/80',
            'systolic' => 120,
            'diastolic' => 80,
            'emergency' => 0,
            'created_at' => date('Y-m-d H:i:s')
        ];
        $history = [$latestReading];
    }

    $alertStore = readJsonStore('alerts.json');
    $userAlerts = array_filter($alertStore, function($item) use ($userId) {
        return $item['user_id'] == $userId;
    });
    if (!empty($userAlerts)) {
        $userAlerts = array_values($userAlerts);
        $latestAlert = end($userAlerts);
        $unreadAlertCount = count(array_filter($userAlerts, function($a) {
            return ($a['status'] ?? 'UNREAD') === 'UNREAD';
        }));
    }
}

// Determine System Status & Alerts
$systemStatus = [
    'code' => 'NORMAL',
    'badge_class' => 'status-normal',
    'icon' => '🟢',
    'title' => 'System Operational',
    'message' => 'No Emergency Alert'
];

$emergencyActive = false;
$alertMessage = "🟢 No Emergency Alert";

if ($latestReading && ($latestReading['emergency'] == 1 || $latestReading['emergency'] === true)) {
    $emergencyActive = true;
    $systemStatus = [
        'code' => 'EMERGENCY',
        'badge_class' => 'status-emergency',
        'icon' => '🚨',
        'title' => 'EMERGENCY ALERT ACTIVATED',
        'message' => 'Emergency button has been activated on sensor!'
    ];
    $alertMessage = "🚨 EMERGENCY ALERT! Emergency button has been activated. Please check the patient immediately.";
} else if ($latestAlert && $latestAlert['status'] === 'UNREAD' && $latestAlert['alert_type'] === 'EMERGENCY') {
    $emergencyActive = true;
    $systemStatus = [
        'code' => 'EMERGENCY',
        'badge_class' => 'status-emergency',
        'icon' => '🚨',
        'title' => 'EMERGENCY ALERT',
        'message' => $latestAlert['alert_message']
    ];
    $alertMessage = $latestAlert['alert_message'];
} else if ($latestReading && floatval($latestReading['temperature']) >= 100.4) {
    $systemStatus = [
        'code' => 'WARNING_TEMP',
        'badge_class' => 'status-warning',
        'icon' => '⚠️',
        'title' => 'High Temperature Warning',
        'message' => "High Fever Detected: {$latestReading['temperature']} °F"
    ];
    $alertMessage = "⚠️ Warning: High Body Temperature ({$latestReading['temperature']} °F)";
} else if ($latestReading && intval($latestReading['systolic'] ?? 120) >= 140) {
    $systemStatus = [
        'code' => 'WARNING_BP',
        'badge_class' => 'status-warning',
        'icon' => '⚠️',
        'title' => 'High BP Warning',
        'message' => "Hypertension Stage 1: {$latestReading['blood_pressure']} mmHg"
    ];
    $alertMessage = "⚠️ Warning: High Blood Pressure ({$latestReading['blood_pressure']} mmHg)";
}

$lastUpdatedFormatted = $latestReading ? date('h:i A, d M Y', strtotime($latestReading['created_at'])) : date('h:i A');

echo json_encode([
    'status' => 'success',
    'user_id' => $userId,
    'current' => [
        'temperature' => floatval($latestReading['temperature'] ?? 98.6),
        'blood_pressure' => $latestReading['blood_pressure'] ?? '120/80',
        'systolic' => intval($latestReading['systolic'] ?? 120),
        'diastolic' => intval($latestReading['diastolic'] ?? 80),
        'emergency' => (bool)($latestReading['emergency'] ?? false),
        'timestamp' => $latestReading['created_at'] ?? date('Y-m-d H:i:s'),
        'last_updated_formatted' => $lastUpdatedFormatted
    ],
    'system_status' => $systemStatus,
    'alert_status' => [
        'is_emergency' => $emergencyActive,
        'message' => $alertMessage,
        'unread_count' => $unreadAlertCount,
        'latest_alert' => $latestAlert
    ],
    'history' => array_map(function($h) {
        return [
            'id' => $h['id'],
            'temp' => floatval($h['temperature']),
            'bp' => $h['blood_pressure'],
            'sys' => intval($h['systolic'] ?? 120),
            'dia' => intval($h['diastolic'] ?? 80),
            'time' => date('h:i A', strtotime($h['created_at'])),
            'date' => date('d M', strtotime($h['created_at']))
        ];
    }, $history)
]);
