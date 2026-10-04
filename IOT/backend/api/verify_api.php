<?php
// backend/api/verify_api.php
require_once __DIR__ . '/../config/database.php';

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$apiKey = trim($input['api_key'] ?? $_GET['api_key'] ?? '');

if (empty($apiKey)) {
    echo json_encode([
        'status' => 'error',
        'connected' => false,
        'message' => 'Please enter a valid API Key / Number.'
    ]);
    exit();
}

$db = new Database();
$conn = $db->getConnection();

if ($conn) {
    try {
        $stmt = $conn->prepare("SELECT d.*, u.name as owner_name FROM api_devices d JOIN users u ON d.user_id = u.id WHERE d.api_key = :key");
        $stmt->execute([':key' => $apiKey]);
        $device = $stmt->fetch();

        if ($device) {
            echo json_encode([
                'status' => 'success',
                'connected' => true,
                'message' => 'API Connected Successfully! Sensor is ready to send data.',
                'device' => [
                    'device_name' => $device['device_name'],
                    'owner' => $device['owner_name'],
                    'status' => $device['status'],
                    'api_key' => $device['api_key']
                ]
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'connected' => false,
                'message' => 'Invalid API Key. Device connection failed.'
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'connected' => false, 'message' => $e->getMessage()]);
    }
} else {
    $devices = readJsonStore('api_devices.json');
    $users = readJsonStore('users.json');
    $matched = null;
    $ownerName = 'User';

    foreach ($devices as $d) {
        if ($d['api_key'] === $apiKey) {
            $matched = $d;
            foreach ($users as $u) {
                if ($u['id'] == $d['user_id']) {
                    $ownerName = $u['name'];
                    break;
                }
            }
            break;
        }
    }

    if ($matched) {
        echo json_encode([
            'status' => 'success',
            'connected' => true,
            'message' => 'API Connected Successfully!',
            'device' => [
                'device_name' => $matched['device_name'],
                'owner' => $ownerName,
                'status' => $matched['status'],
                'api_key' => $matched['api_key']
            ]
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'connected' => false,
            'message' => 'Invalid API Key. Device connection failed.'
        ]);
    }
}
