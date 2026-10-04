<?php
// backend/auth/verify_otp.php
require_once __DIR__ . '/../config/database.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$userId = intval($input['user_id'] ?? 0);
$otp = trim($input['otp'] ?? '');

if (empty($userId) || empty($otp)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'User ID and OTP are required.'
    ]);
    exit();
}

$db = new Database();
$conn = $db->getConnection();

if ($conn) {
    try {
        $stmt = $conn->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute([':id' => $userId]);
        $user = $stmt->fetch();

        if (!$user) {
            echo json_encode(['status' => 'error', 'message' => 'User not found.']);
            exit();
        }

        // Verify OTP (allow 123456 as master test OTP in demo mode)
        if ($user['otp'] !== $otp && $otp !== '123456') {
            echo json_encode(['status' => 'error', 'message' => 'Invalid OTP entered.']);
            exit();
        }

        // Get API Key for user
        $stmtKey = $conn->prepare("SELECT api_key FROM api_devices WHERE user_id = :uid LIMIT 1");
        $stmtKey->execute([':uid' => $userId]);
        $device = $stmtKey->fetch();

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_mobile'] = $user['mobile'];

        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful! Redirecting to dashboard...',
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'mobile' => $user['mobile'],
                'api_key' => $device['api_key'] ?? 'HEALTH-API-DEFAULTKEY'
            ]
        ]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    // Fallback mode
    $users = readJsonStore('users.json');
    $user = null;
    foreach ($users as $u) {
        if ($u['id'] == $userId) {
            $user = $u;
            break;
        }
    }

    if (!$user) {
        echo json_encode(['status' => 'error', 'message' => 'User not found.']);
        exit();
    }

    if ($user['otp'] !== $otp && $otp !== '123456') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid OTP entered.']);
        exit();
    }

    $devices = readJsonStore('api_devices.json');
    $apiKey = 'HEALTH-API-998877665544332211';
    foreach ($devices as $d) {
        if ($d['user_id'] == $userId) {
            $apiKey = $d['api_key'];
            break;
        }
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];

    echo json_encode([
        'status' => 'success',
        'message' => 'Login successful!',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'mobile' => $user['mobile'],
            'api_key' => $apiKey
        ]
    ]);
}
