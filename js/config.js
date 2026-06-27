/**
 * 项目配置文件
 * 使用 GitHub Gist 作为 JSON 云存储
 *
 * 特点：
 * - 国内可访问（GitHub API 在国内一般可用）
 * - 官方支持 CORS，纯前端可直接调用
 * - 免费：认证后 5000 次/小时
 * - 支持 PATCH 更新已有 Gist（无需每次创建新 ID）
 * - 单个 Gist 文件上限 1MB，足够存储数千用户
 *
 * 架构：单个 Gist 包含多个文件
 * - users.json    → 真实用户数据数组
 * - interact.json → 打call + 留言数据
 *
 * 安全提示：
 * GitHub Token 会暴露在前端代码中，请务必创建仅含 gist 权限的
 * Fine-grained Token（或 classic token 只勾选 gist scope），
 * 这样即使泄露也只能操作 Gist，无法访问你的其他 GitHub 数据。
 *
 * 使用前请完成配置：
 * 1. 访问 https://github.com/settings/tokens/new
 * 2. 创建 Token，仅勾选 "gist" 权限
 * 3. 将 Token 填入下方 GITHUB_TOKEN 字段
 * 4. 首次运行时自动创建 Gist，ID 存入 localStorage
 */
const CONFIG = {
    // GitHub Gist API 基础地址
    API_BASE: 'https://api.github.com/gists',

    // ★★★ 请填入你的 GitHub Personal Access Token（仅 gist 权限）★★★
    // 获取地址：https://github.com/settings/tokens/new
    GITHUB_TOKEN: 'YOUR_GITHUB_TOKEN_HERE',

    // 数据版本号（更新数据时递增此值，自动清除旧缓存）
    DATA_VERSION: 'v5_gist_20260628',

    // Gist ID（首次运行时自动创建，之后从 localStorage 读取）
    get GIST_ID() {
        if (localStorage.getItem('fansmap_data_version') !== this.DATA_VERSION) {
            localStorage.removeItem('fansmap_gist_id');
            localStorage.setItem('fansmap_data_version', this.DATA_VERSION);
        }
        return localStorage.getItem('fansmap_gist_id') || '';
    },
    set GIST_ID(val) {
        localStorage.setItem('fansmap_gist_id', val);
    }
};

/**
 * 检测当前是否以 file:// 协议打开（直接双击 HTML 文件）
 * file:// 协议下 origin 为 null，浏览器会阻止所有跨域 fetch 请求
 * @returns {boolean} 是否为本地文件协议
 */
function isLocalFileMode() {
    return window.location.protocol === 'file:';
}

/**
 * 检测 GitHub Token 是否已正确配置（非占位符）
 * @returns {boolean} Token 是否可用
 */
function isApiKeyConfigured() {
    return CONFIG.GITHUB_TOKEN &&
           CONFIG.GITHUB_TOKEN !== 'YOUR_GITHUB_TOKEN_HERE' &&
           !CONFIG.GITHUB_TOKEN.startsWith('YOUR_');
}

/**
 * 云端可用性标志
 * 首次请求失败后置为 false，后续请求直接跳过，控制台保持干净
 * 持久化到 localStorage，后续访问也跳过；24 小时后自动重试
 */
const CLOUD_UNAVAILABLE_KEY = 'fansmap_cloud_unavailable_at';
const CLOUD_RETRY_INTERVAL = 24 * 60 * 60 * 1000;

/**
 * 读取持久化的云端不可用时间戳，超过重试间隔则视为可重新探测
 * @returns {boolean} 当前是否应认为云端可用
 */
function getInitialCloudAvailable() {
    if (isLocalFileMode()) return false;
    if (!isApiKeyConfigured()) return false;
    try {
        const ts = localStorage.getItem(CLOUD_UNAVAILABLE_KEY);
        if (!ts) return true;
        if (Date.now() - parseInt(ts, 10) > CLOUD_RETRY_INTERVAL) {
            localStorage.removeItem(CLOUD_UNAVAILABLE_KEY);
            return true;
        }
        return false;
    } catch (e) {
        return true;
    }
}

let CLOUD_AVAILABLE = getInitialCloudAvailable();

/**
 * 标记云端不可用（请求失败时调用）
 */
function markCloudUnavailable() {
    if (CLOUD_AVAILABLE) {
        CLOUD_AVAILABLE = false;
        try {
            localStorage.setItem(CLOUD_UNAVAILABLE_KEY, String(Date.now()));
        } catch (e) { /* 忽略 */ }
        console.info('%c☁️ 云端数据服务不可用，已切换到本地模式', 'color:#f59e0b;');
    }
}

/**
 * 标记云端可用（请求成功时调用）
 */
function markCloudAvailable() {
    if (!CLOUD_AVAILABLE) {
        CLOUD_AVAILABLE = true;
    }
    try {
        localStorage.removeItem(CLOUD_UNAVAILABLE_KEY);
    } catch (e) { /* 忽略 */ }
}

/**
 * 是否应跳过云端请求
 * @returns {boolean} 是否应跳过
 */
function shouldSkipCloud() {
    return isLocalFileMode() || !isApiKeyConfigured() || !CLOUD_AVAILABLE;
}

/**
 * 显示一次性提示：建议通过 HTTP 服务器访问以获得完整功能
 */
function showLocalModeNotice() {
    if (localStorage.getItem('fans_local_notice_shown')) return;
    localStorage.setItem('fans_local_notice_shown', '1');
    console.info(
        '%c🎵 当前为本地文件模式（file://）\n' +
        '云端数据同步已关闭，将使用本地虚拟数据。\n' +
        '如需完整功能，请通过 HTTP 服务器访问：\n' +
        '  1. 在项目目录运行 python -m http.server 8000\n' +
        '  2. 浏览器访问 http://localhost:8000',
        'color: #ff69b4; font-size: 13px; line-height: 1.6;'
    );
}

// file:// 模式或 Token 未配置时输出提示
if (isLocalFileMode()) {
    showLocalModeNotice();
}
if (!isApiKeyConfigured() && !isLocalFileMode()) {
    console.warn(
        '%c⚠️ GitHub Token 未配置\n' +
        '请在 js/config.js 中填入你的 GitHub Token（仅 gist 权限）\n' +
        '获取地址：https://github.com/settings/tokens/new\n' +
        '未配置前将使用本地虚拟数据，云端功能不可用',
        'color: #f59e0b; font-size: 13px; line-height: 1.6;'
    );
}

/**
 * 构建 GitHub API 认证请求头
 * @returns {Object} 包含 Authorization 的请求头对象
 */
function cloudHeaders() {
    return {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
    };
}

/**
 * 首次使用时自动创建 Gist（含 users.json 和 interact.json 两个文件）
 * 创建成功后 Gist ID 存入 localStorage，后续不再创建
 * @returns {Promise<boolean>} 初始化是否成功
 */
async function ensureCloudInitialized() {
    if (shouldSkipCloud()) return false;
    if (CONFIG.GIST_ID) return true;

    try {
        const res = await fetch(CONFIG.API_BASE, {
            method: 'POST',
            headers: cloudHeaders(),
            body: JSON.stringify({
                description: '周杰伦歌迷地图数据存储（自动创建）',
                public: false,
                files: {
                    'users.json': {
                        content: JSON.stringify([], null, 2)
                    },
                    'interact.json': {
                        content: JSON.stringify({
                            loves: {},
                            messages: {},
                            createdAt: new Date().toISOString()
                        }, null, 2)
                    }
                }
            })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `HTTP ${res.status}`);
        }
        const result = await res.json();
        CONFIG.GIST_ID = result.id;
        console.log(`✅ Gist 已创建，ID: ${CONFIG.GIST_ID}`);
        console.log(`   管理地址: ${result.html_url}`);
        return true;
    } catch (err) {
        console.error('创建 Gist 失败:', err.message);
        markCloudUnavailable();
        return false;
    }
}

// ============================================
// 用户数据 云端读写
// ============================================

/**
 * 从 Gist 加载所有真实用户数据
 * @returns {Promise<Array>} 用户数据数组（云端不可用时返回空数组）
 */
async function loadUsersFromCloud() {
    if (shouldSkipCloud()) return [];
    await ensureCloudInitialized();
    if (!CONFIG.GIST_ID) return [];

    try {
        const res = await fetch(`${CONFIG.API_BASE}/${CONFIG.GIST_ID}`, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const gist = await res.json();

        const file = gist.files && gist.files['users.json'];
        if (!file || !file.content) return [];

        const users = JSON.parse(file.content);
        markCloudAvailable();
        console.log(`从 Gist 加载了 ${users.length} 个用户`);
        return Array.isArray(users) ? users : [];
    } catch (err) {
        markCloudUnavailable();
        return [];
    }
}

/**
 * 保存用户数据到 Gist（PATCH 更新 users.json 文件）
 * @param {Array} users - 完整的用户数据数组
 * @returns {Promise<boolean>} 是否保存成功
 */
async function saveUsersToCloud(users) {
    if (shouldSkipCloud()) return false;
    await ensureCloudInitialized();
    if (!CONFIG.GIST_ID) return false;

    try {
        const res = await fetch(`${CONFIG.API_BASE}/${CONFIG.GIST_ID}`, {
            method: 'PATCH',
            headers: cloudHeaders(),
            body: JSON.stringify({
                files: {
                    'users.json': {
                        content: JSON.stringify(users, null, 2)
                    }
                }
            })
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `HTTP ${res.status}`);
        }
        markCloudAvailable();
        console.log(`用户数据已保存到 Gist（${users.length} 个用户）`);
        return true;
    } catch (err) {
        console.error('保存用户数据到 Gist 失败:', err.message);
        markCloudUnavailable();
        return false;
    }
}

// ============================================
// 互动数据（打call + 留言）本地持久化层
// ============================================

/** localStorage 键名 */
const INTERACT_LOCAL_KEY = 'fansmap_interact_data';

/**
 * 将互动数据保存到 localStorage（本地兜底）
 * @param {Object} loves - 打call数据
 * @param {Object} messages - 留言数据
 */
function saveInteractLocal(loves, messages) {
    try {
        localStorage.setItem(INTERACT_LOCAL_KEY, JSON.stringify({
            loves: loves || {},
            messages: messages || {},
            savedAt: Date.now()
        }));
    } catch (e) {
        console.error('本地保存互动数据失败:', e);
    }
}

/**
 * 从 localStorage 读取互动数据
 * @returns {{loves: Object, messages: Object}} 互动数据
 */
function loadInteractLocal() {
    try {
        const raw = localStorage.getItem(INTERACT_LOCAL_KEY);
        if (!raw) return { loves: {}, messages: {} };
        const data = JSON.parse(raw);
        return {
            loves: data.loves || {},
            messages: data.messages || {}
        };
    } catch (e) {
        return { loves: {}, messages: {} };
    }
}

/**
 * 合并两份互动数据（本地与云端）
 * 打call：取两者中的较大值；留言：合并数组并去重
 * @param {{loves:Object, messages:Object}} a - 数据源 A
 * @param {{loves:Object, messages:Object}} b - 数据源 B
 * @returns {{loves:Object, messages:Object}} 合并后的数据
 */
function mergeInteractData(a, b) {
    const allNicknames = new Set([
        ...Object.keys(a.loves || {}),
        ...Object.keys(b.loves || {}),
        ...Object.keys(a.messages || {}),
        ...Object.keys(b.messages || {})
    ]);
    const loves = {};
    const messages = {};
    allNicknames.forEach(nick => {
        const la = (a.loves && a.loves[nick]) || 0;
        const lb = (b.loves && b.loves[nick]) || 0;
        if (la || lb) loves[nick] = Math.max(la, lb);
        const ma = (a.messages && a.messages[nick]) || [];
        const mb = (b.messages && b.messages[nick]) || [];
        if (ma.length || mb.length) {
            const seen = new Set();
            messages[nick] = [];
            [...ma, ...mb].forEach(m => {
                if (!seen.has(m)) { seen.add(m); messages[nick].push(m); }
            });
        }
    });
    return { loves, messages };
}

// ============================================
// 互动数据 云端读写
// ============================================

/**
 * 从 Gist 加载互动数据（云端不可用时回退到本地 localStorage）
 * @returns {Promise<{loves: Object, messages: Object}>} 互动数据
 */
async function loadInteractData() {
    const localData = loadInteractLocal();
    if (shouldSkipCloud()) return localData;
    await ensureCloudInitialized();
    if (!CONFIG.GIST_ID) return localData;

    try {
        const res = await fetch(`${CONFIG.API_BASE}/${CONFIG.GIST_ID}`, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        if (!res.ok) return localData;
        const gist = await res.json();

        const file = gist.files && gist.files['interact.json'];
        if (!file || !file.content) return localData;

        const record = JSON.parse(file.content);
        const cloudData = {
            loves: record.loves || {},
            messages: record.messages || {}
        };
        markCloudAvailable();
        return mergeInteractData(cloudData, localData);
    } catch (err) {
        markCloudUnavailable();
        return localData;
    }
}

/**
 * 保存互动数据到 Gist（同时写入本地 localStorage）
 * 使用 PATCH 更新 interact.json 文件
 * @param {Object} loves - 打call数据
 * @param {Object} messages - 留言数据
 * @returns {Promise<boolean>} 云端是否保存成功
 */
async function saveInteractData(loves, messages) {
    saveInteractLocal(loves, messages);
    if (shouldSkipCloud()) return false;
    await ensureCloudInitialized();
    if (!CONFIG.GIST_ID) return false;

    try {
        const res = await fetch(`${CONFIG.API_BASE}/${CONFIG.GIST_ID}`, {
            method: 'PATCH',
            headers: cloudHeaders(),
            body: JSON.stringify({
                files: {
                    'interact.json': {
                        content: JSON.stringify({
                            loves,
                            messages,
                            updatedAt: new Date().toISOString()
                        }, null, 2)
                    }
                }
            })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        markCloudAvailable();
        return true;
    } catch (err) {
        markCloudUnavailable();
        return false;
    }
}
