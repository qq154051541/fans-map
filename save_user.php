<?php
/**
 * 保存用户数据到 users.json 文件
 */

// 读取请求数据
$input = file_get_contents('php://input');
$userData = json_decode($input, true);

if (!$userData) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data']);
    exit;
}

// 确保数据包含必要字段
if (!isset($userData['nickname']) || !isset($userData['avatar']) || 
    !isset($userData['lat']) || !isset($userData['lng'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// 读取现有数据
$usersFile = 'users.json';
$currentData = [];

if (file_exists($usersFile)) {
    $jsonData = file_get_contents($usersFile);
    if ($jsonData) {
        $currentData = json_decode($jsonData, true);
        if (!is_array($currentData)) {
            $currentData = [];
        }
    }
}

// 追加新数据
$currentData[] = $userData;

// 写回文件
if (file_put_contents($usersFile, json_encode($currentData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    http_response_code(200);
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save data']);
}
?>