<?php
// backend/notifications/send_notification.php
require_once __DIR__ . '/../config/database.php';

function sendEmergencyNotification($userId, $message) {
    $db = new Database();
    $conn = $db->getConnection();
    $user = null;

    if ($conn) {
        try {
            $stmt = $conn->prepare("SELECT * FROM users WHERE id = :id");
            $stmt->execute([':id' => $userId]);
            $user = $stmt->fetch();
        } catch (PDOException $e) {}
    } else {
        $users = readJsonStore('users.json');
        foreach ($users as $u) {
            if ($u['id'] == $userId) {
                $user = $u;
                break;
            }
        }
    }

    $userName = $user ? $user['name'] : 'Logged User';
    $userMobile = $user ? $user['mobile'] : '9876543210';
    $userEmail = $user ? $user['email'] : 'user@example.com';

    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'user_id' => $userId,
        'user_name' => $userName,
        'mobile' => $userMobile,
        'email' => $userEmail,
        'message' => $message,
        'sms_status' => 'SENT_SIMULATED',
        'email_status' => 'SENT_SIMULATED'
    ];

    $logFile = getStorageFile('notification_logs.json');
    $logs = json_decode(file_get_contents($logFile), true) ?: [];
    array_unshift($logs, $logEntry);
    file_put_contents($logFile, json_encode(array_slice($logs, 0, 50), JSON_PRETTY_PRINT));

    return $logEntry;
}

if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $userId = intval($input['user_id'] ?? 1);
    $msg = trim($input['message'] ?? '🚨 Emergency sensor button pushed!');
    $res = sendEmergencyNotification($userId, $msg);
    echo json_encode(['status' => 'success', 'notification' => $res]);
}
