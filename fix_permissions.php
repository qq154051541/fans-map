<?php
/**
 * 修复 users.json 文件的权限问题
 */

$usersFile = 'users.json';
$dir = dirname(__FILE__);

echo "检查用户数据文件权限...\n";

// 检查目录权限
echo "目录: $dir\n";
echo "目录权限: " . substr(sprintf('%o', fileperms($dir)), -4) . "\n";

// 检查文件是否存在
if (file_exists($usersFile)) {
    echo "文件存在: $usersFile\n";
    echo "文件权限: " . substr(sprintf('%o', fileperms($usersFile)), -4) . "\n";
} else {
    echo "文件不存在，尝试创建...\n";
    // 创建空文件
    if (file_put_contents($usersFile, '[]')) {
        echo "文件创建成功\n";
        // 设置权限
        chmod($usersFile, 0666);
        echo "权限设置为 0666\n";
    } else {
        echo "创建文件失败，请检查目录权限\n";
    }
}

// 测试写入权限
testWritePermission($usersFile);

function testWritePermission($file) {
    echo "\n测试写入权限...\n";
    $testData = ['test' => 'data'];
    $result = file_put_contents($file, json_encode($testData));
    if ($result !== false) {
        echo "写入测试成功\n";
        // 恢复原始数据
        file_put_contents($file, '[]');
    } else {
        echo "写入测试失败，请检查权限\n";
    }
}

echo "\n权限检查完成\n";
?>