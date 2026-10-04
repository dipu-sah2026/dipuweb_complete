<?php
// backend/alerts/get_alerts.php
require_once __DIR__ . '/../config/database.php';

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : ($_SESSION['user_id'] ?? 1);

$db = new Database();
$conn = $db->getConnection();
$alertsList = [];

if ($conn) {
    try {
        $stmt = $conn->prepare("SELECT * FROM alerts WHERE user_id = :uid ORDER BY id DESC LIMIT 20");
        $stmt->execute([':uid' => $userId]);
        $alertsList = $stmt->fetchAll();
    } catch (PDOException $e) {}
} else {
    $alerts = readJsonStore('alerts.json');
    $alertsList = array_filter($alerts, function($a) use ($userId) {
        return $a['user_id'] == $userId;
    });
    $alertsList = array_reverse(array_values($alertsList));
}

echo json_encode([
    'status' => 'success',
    'alerts' => $alertsList
]);
