<?php
// backend/alerts/emergency_alert.php
require_once __DIR__ . '/../config/database.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$userId = intval($input['user_id'] ?? ($_SESSION['user_id'] ?? 1));
$message = trim($input['message'] ?? '🚨 EMERGENCY ALERT! Sensor panic button pressed by patient!');
$action = trim($input['action'] ?? 'trigger'); // trigger, resolve, mark_read

$db = new Database();
$conn = $db->getConnection();
$now = date('Y-m-d H:i:s');

if ($action === 'trigger') {
    if ($conn) {
        try {
            $stmt = $conn->prepare("INSERT INTO alerts (user_id, alert_message, alert_type, status, created_at) VALUES (:uid, :msg, 'EMERGENCY', 'UNREAD', :created_at)");
            $stmt->execute([':uid' => $userId, ':msg' => $message, ':created_at' => $now]);
            
            // Also flag emergency in latest health record
            $stmtHealth = $conn->prepare("UPDATE health_data SET emergency = 1 WHERE user_id = :uid ORDER BY id DESC LIMIT 1");
            $stmtHealth->execute([':uid' => $userId]);
        } catch (PDOException $e) {}
    } else {
        $alerts = readJsonStore('alerts.json');
        $alerts[] = [
            'id' => count($alerts) + 1,
            'user_id' => $userId,
            'alert_message' => $message,
            'alert_type' => 'EMERGENCY',
            'status' => 'UNREAD',
            'created_at' => $now
        ];
        writeJsonStore('alerts.json', $alerts);
    }

    // Trigger external notification simulated email/SMS log
    require_once __DIR__ . '/../notifications/send_notification.php';
    sendEmergencyNotification($userId, $message);

    echo json_encode([
        'status' => 'success',
        'alert_triggered' => true,
        'message' => '🚨 Emergency Alert generated! Notification dispatched to logged-in user.'
    ]);
} else if ($action === 'resolve' || $action === 'mark_read') {
    if ($conn) {
        try {
            $stmt = $conn->prepare("UPDATE alerts SET status = 'RESOLVED' WHERE user_id = :uid AND status = 'UNREAD'");
            $stmt->execute([':uid' => $userId]);
            
            $stmtHealth = $conn->prepare("UPDATE health_data SET emergency = 0 WHERE user_id = :uid ORDER BY id DESC LIMIT 1");
            $stmtHealth->execute([':uid' => $userId]);
        } catch (PDOException $e) {}
    } else {
        $alerts = readJsonStore('alerts.json');
        foreach ($alerts as &$a) {
            if ($a['user_id'] == $userId) {
                $a['status'] = 'RESOLVED';
            }
        }
        writeJsonStore('alerts.json', $alerts);

        $health = readJsonStore('health_data.json');
        if (!empty($health)) {
            $health[count($health) - 1]['emergency'] = 0;
            writeJsonStore('health_data.json', $health);
        }
    }

    echo json_encode([
        'status' => 'success',
        'alert_triggered' => false,
        'message' => 'Emergency status resolved.'
    ]);
}
