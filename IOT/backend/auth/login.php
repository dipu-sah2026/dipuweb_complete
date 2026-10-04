<?php
// backend/auth/login.php
require_once __DIR__ . '/../config/database.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$identifier = trim($input['identifier'] ?? ''); // Mobile or Email

if (empty($identifier)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Please provide Mobile Number or Gmail address.'
    ]);
    exit();
}

$otp = sprintf("%06d", mt_rand(100000, 999999));
$otp_expiry = date('Y-m-d H:i:s', strtotime('+10 minutes'));

$db = new Database();
$conn = $db->getConnection();

if ($conn) {
    try {
        $stmt = $conn->prepare("SELECT * FROM users WHERE mobile = :id OR email = :id");
        $stmt->execute([':id' => $identifier]);
        $user = $stmt->fetch();

        if (!$user) {
            // Auto-register default profile for seamless demo experience if user is new
            $name = (filter_var($identifier, FILTER_VALIDATE_EMAIL)) ? explode('@', $identifier)[0] : 'User (' . substr($identifier, -4) . ')';
            $email = (filter_var($identifier, FILTER_VALIDATE_EMAIL)) ? $identifier : $identifier . '@example.com';
            $mobile = (is_numeric($identifier)) ? $identifier : '98765' . rand(10000, 99999);

            $stmtIns = $conn->prepare("INSERT INTO users (name, mobile, email, otp, otp_expiry) VALUES (:name, :mobile, :email, :otp, :otp_expiry)");
            $stmtIns->execute([':name' => ucwords($name), ':mobile' => $mobile, ':email' => $email, ':otp' => $otp, ':otp_expiry' => $otp_expiry]);
            $userId = $conn->lastInsertId();

            $apiKey = 'HEALTH-API-' . strtoupper(substr(md5(uniqid($userId, true)), 0, 16));
            $stmtApi = $conn->prepare("INSERT INTO api_devices (user_id, api_key, device_name) VALUES (:user_id, :api_key, 'IoT Sensor Device')");
            $stmtApi->execute([':user_id' => $userId, ':api_key' => $apiKey]);
        } else {
            $userId = $user['id'];
            $stmtUpd = $conn->prepare("UPDATE users SET otp = :otp, otp_expiry = :otp_expiry WHERE id = :id");
            $stmtUpd->execute([':otp' => $otp, ':otp_expiry' => $otp_expiry, ':id' => $userId]);
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'OTP sent successfully to ' . $identifier,
            'demo_otp' => $otp,
            'user_id' => $userId
        ]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    // Fallback mode
    $users = readJsonStore('users.json');
    $userIndex = -1;
    foreach ($users as $idx => $u) {
        if ($u['mobile'] === $identifier || $u['email'] === $identifier) {
            $userIndex = $idx;
            break;
        }
    }

    if ($userIndex < 0) {
        $userId = count($users) + 1;
        $newUser = [
            'id' => $userId,
            'name' => (filter_var($identifier, FILTER_VALIDATE_EMAIL)) ? explode('@', $identifier)[0] : 'User ' . $userId,
            'mobile' => (is_numeric($identifier)) ? $identifier : '987654321' . $userId,
            'email' => (filter_var($identifier, FILTER_VALIDATE_EMAIL)) ? $identifier : $identifier . '@example.com',
            'otp' => $otp,
            'otp_expiry' => $otp_expiry,
            'created_at' => date('Y-m-d H:i:s')
        ];
        $users[] = $newUser;

        $devices = readJsonStore('api_devices.json');
        $devices[] = [
            'id' => count($devices) + 1,
            'user_id' => $userId,
            'api_key' => 'HEALTH-API-' . strtoupper(substr(md5(uniqid($userId, true)), 0, 16)),
            'device_name' => 'IoT Sensor Device',
            'status' => 'active',
            'created_at' => date('Y-m-d H:i:s')
        ];
        writeJsonStore('api_devices.json', $devices);
    } else {
        $userId = $users[$userIndex]['id'];
        $users[$userIndex]['otp'] = $otp;
        $users[$userIndex]['otp_expiry'] = $otp_expiry;
    }

    writeJsonStore('users.json', $users);

    echo json_encode([
        'status' => 'success',
        'message' => 'OTP sent successfully to ' . $identifier,
        'demo_otp' => $otp,
        'user_id' => $userId
    ]);
}
