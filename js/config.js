/**
 * 项目配置文件
 * 使用 JSONBin.io 作为免费 BaaS 服务替代 PHP 后端
 *
 * 使用步骤：
 * 1. 访问 https://jsonbin.io 注册免费账号
 * 2. 在 API Keys 页面获取你的 X-Master-Key
 * 3. 创建一个 Bin，将 users.json 的初始数据粘贴进去，记录返回的 Bin ID
 * 4. 将下面的 API_KEY 和 BIN_ID 填入
 */
const CONFIG = {
    // JSONBin.io API Key（在 https://jsonbin.io/app/api-keys 获取）
    API_KEY: '$2a$10$EHYLJDBkclHDnBHRNLDd2uy3rpp8thMyTWGwu4GumiCYHzsCv6a7m',

    // JSONBin.io Bin ID（创建 Bin 后获取）
    BIN_ID: '6a3542c3f5f4af5e290f20e2',

    // JSONBin.io API 基础地址
    API_BASE: 'https://api.jsonbin.io/v3'
};
