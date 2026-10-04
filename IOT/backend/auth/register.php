<?php
// backend/auth/register.php
require_once __DIR__ . '/../config/database.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$name = trim($input['name'] ?? '');
$mobile = trim($input['mobile'] ?? '');
$email = trim($input['email'] ?? '');

if (empty($name) || empty($mobile) || empty($email)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields (Name, Mobile, Email) are required.'
    ]);
    exit();
}

$otp = sprintf("%06d", mt_rand(100000, 999999));
$otp_expiry = date('Y-m-d H:i:s', strtotime('+10 minutes'));

$db = new Database();
$conn = $db->getConnection();

if ($conn) {
    try {
        // Check if user already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE mobile = :mobile OR email = :email");
        $stmt->execute([':mobile' => $mobile, ':email' => $email]);
        $existing = $stmt->fetch();

        if ($existing) {
            // Update OTP for existing user
            $stmt = $conn->prepare("UPDATE users SET name = :name, otp = :otp, otp_expiry = :otp_expiry WHERE id = :id");
            $stmt->execute([':name' => $name, ':otp' => $otp, ':otp_expiry' => $otp_expiry, ':id' => $existing['id']]);
            $userId = $existing['id'];
        } else {
            // Insert new user
            $stmt = $conn->prepare("INSERT INTO users (name, mobile, email, otp, otp_expiry) VALUES (:name, :mobile, :email, :otp, :otp_expiry)");
            $stmt->execute([':name' => $name, ':mobile' => $mobile, ':email' => $email, ':otp' => $otp, ':otp_expiry' => $otp_expiry]);
            $userId = $conn->lastInsertId();

            // Create default API key for user
            $apiKey = 'HEALTH-API-' . strtoupper(substr(md5(uniqid($userId, true)), 0, 16));
            $stmtApi = $conn->prepare("INSERT INTO api_devices (user_id, api_key, device_name) VALUES (:user_id, :api_key, 'IoT Sensor Device')");
            $stmtApi->execute([':user_id' => $userId, ':api_key' => $apiKey]);
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Registration initiated. OTP sent to your registered mobile and email.',
            'demo_otp' => $otp, // For demo purpose so user can see it
            'user_id' => $userId,
            'mobile' => $mobile,
            'email' => $email
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
} else {
    // JSON Fallback
    $users = readJsonStore('users.json');
    $userIndex = -1;
    foreach ($users as $idx => $u) {
        if ($u['mobile'] === $mobile || $u['email'] === $email) {
            $userIndex = $idx;
            break;
        }
    }

    if ($userIndex >= 0) {
        $users[$userIndex]['name'] = $name;
        $users[$userIndex]['otp'] = $otp;
        $users[$userIndex]['otp_expiry'] = $otp_expiry;
        $userId = $users[$userIndex]['id'];
    } else {
        $userId = count($users) + 1;
        $users[] = [
            'id' => $userId,
            'name' => $name,
            'mobile' => $mobile,
            'email' => $email,
            'otp' => $otp,
            'otp_expiry' => $otp_expiry,
            'created_at' => date('Y-m-d H:i:s')
        ];

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
    }

    writeJsonStore('users.json', $users);

    echo json_encode([
        'status' => 'success',
        'message' => 'Registration initiated. OTP sent to mobile & email.',
        'demo_otp' => $otp,
        'user_id' => $userId,
        'mobile' => $mobile,
        'email' => $email
    ]);
}
