<?php
require_once 'config.php';
header('Content-Type: application/json; charset=utf-8');

// 从 users.json 读取数据
if (file_exists('users.json')) {
    $content = file_get_contents('users.json');
    if ($content) {
        echo $content;
    } else {
        echo '[]';
    }
} else {
    echo '[]';
}
?>
