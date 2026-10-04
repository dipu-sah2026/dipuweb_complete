<?php
// backend/api/generate_api.php
require_once __DIR__ . '/../config/database.php';

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : ($_SESSION['user_id'] ?? 1);
$deviceName = trim($_GET['device_name'] ?? 'IoT Health Monitor Sensor');

$newApiKey = 'HEALTH-API-' . strtoupper(substr(md5(uniqid($userId . rand(), true)), 0, 18));

$db = new Database();
$conn = $db->getConnection();

if ($conn) {
    try {
        $stmt = $conn->prepare("INSERT INTO api_devices (user_id, api_key, device_name, status) VALUES (:uid, :key, :name, 'active')");
        $stmt->execute([':uid' => $userId, ':key' => $newApiKey, ':name' => $deviceName]);
    } catch (PDOException $e) {
        // Handle error
    }
} else {
    $devices = readJsonStore('api_devices.json');
    $devices[] = [
        'id' => count($devices) + 1,
        'user_id' => $userId,
        'api_key' => $newApiKey,
        'device_name' => $deviceName,
        'status' => 'active',
        'created_at' => date('Y-m-d H:i:s')
    ];
    writeJsonStore('api_devices.json', $devices);
}

echo json_encode([
    'status' => 'success',
    'message' => 'New API Key generated successfully.',
    'api_key' => $newApiKey,
    'device_name' => $deviceName
]);
