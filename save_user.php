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

// 添加时间戳
if (!isset($userData['timestamp'])) {
    $userData['timestamp'] = time() * 1000; // 毫秒时间戳
}

// 读取现有数据
$usersFile = 'users.json';
$currentData = [];

// 检查目录权限
$dir = dirname(__FILE__);
if (!is_writable($dir)) {
    http_response_code(500);
    echo json_encode(['error' => 'Directory not writable']);
    exit;
}

// 检查文件是否存在
if (file_exists($usersFile)) {
    // 检查文件权限
    if (!is_writable($usersFile)) {
        // 尝试修改权限
        if (!chmod($usersFile, 0666)) {
            http_response_code(500);
            echo json_encode(['error' => 'File not writable']);
            exit;
        }
    }
    
    $jsonData = file_get_contents($usersFile);
    if ($jsonData) {
        $currentData = json_decode($jsonData, true);
        if (!is_array($currentData)) {
            $currentData = [];
        }
    }
} else {
    // 文件不存在，尝试创建
    if (!file_put_contents($usersFile, '[]')) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create file']);
        exit;
    }
    // 设置权限
    chmod($usersFile, 0666);
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