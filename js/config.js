/**
 * 项目配置文件
 * 使用 gongju.dev JSON Storage 作为极简 JSON 云存储
 *
 * 特点：
 * - 无需注册，无需 API Key
 * - 支持 CORS，纯前端可直接调用
 * - 永久存储，数据不会过期
 * - 每次保存生成新链接（不可修改已有数据）
 *
 * 多批次策略：数据分批存储，索引记录所有批次 ID
 * 写入时追加到最后一个批次，满了则创建新批次
 */
const CONFIG = {
    // gongju.dev API 基础地址
    API_BASE: 'https://api.gongju.dev/api/json-storage',

    // 数据版本号（更新数据时递增此值，自动清除旧缓存）
    DATA_VERSION: 'v3_20200620',

    // 索引 ID（存储所有数据批次 ID 列表）
    // 优先从 localStorage 读取最新索引 ID，版本不匹配则使用硬编码值
    get INDEX_ID() {
        if (localStorage.getItem('fansmap_data_version') !== this.DATA_VERSION) {
            // 版本不匹配，清除旧缓存
            localStorage.removeItem('fansmap_index_id');
            localStorage.removeItem('fansmap_interact_id');
            localStorage.setItem('fansmap_data_version', this.DATA_VERSION);
        }
        return localStorage.getItem('fansmap_index_id') || 'Wt3U8Z9T';
    },
    set INDEX_ID(val) {
        localStorage.setItem('fansmap_index_id', val);
    },

    // 数据批次 ID 列表（运行时从索引加载）
    DATA_IDS: [],

    // 单批次大小上限（字节），约 800KB
    BATCH_SIZE_LIMIT: 800000,

    // 互动数据（打call+留言）存储 ID
    get INTERACT_ID() {
        return localStorage.getItem('fansmap_interact_id') || 'yo2GDknj';
    },
    set INTERACT_ID(val) {
        localStorage.setItem('fansmap_interact_id', val);
    }
};

/**
 * 从索引加载所有数据批次 ID
 * 索引格式：{ "dataIds": ["id1", "id2", ...], "totalUsers": 20000 }
 * 或兼容旧格式：{ "dataId": "xxx" } / 直接是用户数据数组
 * @returns {Promise<string[]>} 数据批次 ID 列表
 */
async function loadBinIndex() {
    if (!CONFIG.INDEX_ID) {
        console.error('请在 js/config.js 中配置 INDEX_ID');
        return [];
    }

    try {
        const res = await fetch(`${CONFIG.API_BASE}/${CONFIG.INDEX_ID}`);
        if (!res.ok) throw new Error('索引加载失败');
        let data = await res.json();

        // gongju.dev 可能将数据包裹在 content 字段中
        if (data && data.content && typeof data.content === 'object') {
            data = data.content;
        }

        if (data && data.dataIds && Array.isArray(data.dataIds)) {
            // 新格式：多批次索引
            CONFIG.DATA_IDS = data.dataIds;
            // 同时读取互动数据 ID
            if (data.interactId) {
                CONFIG.INTERACT_ID = data.interactId;
            }
        } else if (data && data.dataId) {
            // 兼容旧格式：单数据 ID
            CONFIG.DATA_IDS = [data.dataId];
        } else if (Array.isArray(data) && data.length > 0) {
            // 兼容最旧格式：直接是用户数据数组
            CONFIG.DATA_IDS = [CONFIG.INDEX_ID];
        }
        console.log(`已加载 ${CONFIG.DATA_IDS.length} 个数据批次, 互动数据ID: ${CONFIG.INTERACT_ID || '无'}`);
        return CONFIG.DATA_IDS;
    } catch (err) {
        console.error('加载索引失败:', err);
        CONFIG.DATA_IDS = [CONFIG.INDEX_ID];
        return CONFIG.DATA_IDS;
    }
}

/**
 * 保存数据到 gongju.dev（POST 创建新链接）
 * @param {Array} users - 完整的用户数据数组
 * @returns {Promise<string>} 新的数据 ID
 */
async function saveDataToCloud(users) {
    const res = await fetch(CONFIG.API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: users })
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => '保存失败');
        throw new Error(errText);
    }

    const result = await res.json();
    if (!result.success || !result.id) {
        throw new Error('保存失败：未返回有效 ID');
    }

    console.log(`数据已保存，新 ID: ${result.id}`);
    return result.id;
}

/**
 * 更新索引，记录所有数据批次 ID
 */
async function updateIndex() {
    try {
        const res = await fetch(CONFIG.API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: {
                    dataIds: CONFIG.DATA_IDS,
                    interactId: CONFIG.INTERACT_ID,
                    totalUsers: 'dynamic',
                    updatedAt: new Date().toISOString()
                }
            })
        });

        if (res.ok) {
            const result = await res.json();
            if (result.success && result.id) {
                CONFIG.INDEX_ID = result.id;
                console.log(`索引已更新: ${CONFIG.INDEX_ID}`);
            }
        }
    } catch (err) {
        console.error('更新索引失败:', err);
    }
}

/**
 * 获取最后一个（活跃）批次 ID
 * @returns {string} 活跃批次 ID
 */
function getActiveBinId() {
    return CONFIG.DATA_IDS[CONFIG.DATA_IDS.length - 1] || CONFIG.INDEX_ID;
}

// ============================================
// 互动数据（打call + 留言）云端存储
// ============================================

/**
 * 从云端加载互动数据
 * @returns {Promise<{loves: Object, messages: Object}>} 互动数据
 */
async function loadInteractData() {
    if (!CONFIG.INTERACT_ID) {
        return { loves: {}, messages: {} };
    }
    try {
        const res = await fetch(`${CONFIG.API_BASE}/${CONFIG.INTERACT_ID}`);
        if (!res.ok) return { loves: {}, messages: {} };
        let data = await res.json();
        // gongju.dev 可能将数据包裹在 content 字段中
        if (data && data.content) data = data.content;
        return {
            loves: data.loves || {},
            messages: data.messages || {}
        };
    } catch (err) {
        console.error('加载互动数据失败:', err);
        return { loves: {}, messages: {} };
    }
}

/**
 * 保存互动数据到云端
 * @param {Object} loves - 打call数据
 * @param {Object} messages - 留言数据
 * @returns {Promise<boolean>} 是否成功
 */
async function saveInteractData(loves, messages) {
    try {
        const res = await fetch(CONFIG.API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: { loves, messages, updatedAt: new Date().toISOString() } })
        });
        if (!res.ok) throw new Error('保存失败');
        const result = await res.json();
        if (result.success && result.id) {
            CONFIG.INTERACT_ID = result.id;
            // 同步更新索引，确保刷新后能找到最新的互动数据 ID
            await updateIndex();
            console.log(`互动数据已保存，新 ID: ${result.id}`);
            return true;
        }
        return false;
    } catch (err) {
        console.error('保存互动数据失败:', err);
        return false;
    }
}
