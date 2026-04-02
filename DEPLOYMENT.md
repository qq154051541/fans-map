# 部署指南

## 权限问题解决方法

### 问题描述
当在服务器上运行时，可能会遇到以下错误：
```
Warning: file_put_contents(users.json): Failed to open stream: Permission denied in /www/wwwroot/fans-map/save_user.php on line 42 
{"error":"Failed to save data"}
```

### 解决方案

#### 方法 1：使用 fix_permissions.php 脚本
1. 上传 `fix_permissions.php` 文件到服务器
2. 在浏览器中访问 `http://your-domain/fans-map/fix_permissions.php`
3. 脚本会自动检查和修复权限设置

#### 方法 2：手动设置权限
1. 登录服务器
2. 进入 fans-map 目录
3. 执行以下命令：
   ```bash
   # 设置目录权限
   chmod 755 .
   
   # 设置 users.json 文件权限
   chmod 666 users.json
   
   # 如果 users.json 文件不存在，创建它
   echo '[]' > users.json
   chmod 666 users.json
   ```

### 服务器环境要求
- PHP 5.6 或更高版本
- 允许 file_put_contents 函数执行
- 目录和文件有正确的写入权限

### 安全建议
- 确保 `users.json` 文件位于非公开访问目录，或通过 `.htaccess` 限制访问
- 定期清理 `users.json` 文件，避免文件过大
- 考虑使用数据库存储用户数据，以提高安全性和性能
