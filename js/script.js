// 全局功能状态（供 features.js 使用）
const featureState = window.featureState = {
    users: [],
    userMarkers: [],
    connectionMode: false,
    connectionSelected: [],
    connectionLines: [],
    nearestHighlight: [],
    heatmapLayer: null,
    lyricRainActive: false,
    lyricRainTimer: null,
    guessGameActive: false,
    guessScore: 0,
    guessQuestionIndex: 0,
    timelineActive: false,
    timelinePlaying: false,
    timelineProgress: 0,
    timelineTimer: null,
    timelineSpeed: 1,
    vinylSpinning: false,
    tourMarkers: [],
    tourLines: [],
    loves: {},
    messages: {}
};

/**
 * HTML 文本转义，防止 XSS
 * 将 < > & " ' 转义为实体，用于 innerHTML 拼接时保护用户输入
 * @param {string} str - 原始字符串
 * @returns {string} 转义后的安全字符串
 */
function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * 转义字符串以安全嵌入单引号包裹的 JS 字符串字面量与内联事件处理
 * 用于 onclick="sendLove('xxx')" 这类场景，防止昵称包含 ' 或 </script> 等破坏语法
 * @param {string} str - 原始字符串
 * @returns {string} 转义后的安全字符串
 */
function escapeJsString(str) {
    if (str == null) return '';
    return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/`/g, '\\`')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
}

// 初始化地图，默认以中国中部为中心，居中展示中国全境
// 使用 Canvas 渲染器，大幅提升 5000+ 标记点的渲染性能（Canvas 绘制 vs DOM 元素）
const map = L.map('map', {
    zoomControl: false, // 禁用默认缩放控件，我们将重新添加并自定义位置
    attributionControl: false,
    preferCanvas: true,  // 优先使用 Canvas 渲染器
    renderer: L.canvas({ padding: 0.5 }) // Canvas 渲染器，padding 提供平滑滚动画布缓冲
}).setView([34, 105], 4); // 中心点位于中国几何中心（兰州附近），缩放级别 4 覆盖中国全境

// 添加自定义位置的缩放控件
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// 添加版权信息
L.control.attribution({
    position: 'bottomright',
    prefix: false
}).addAttribution('&copy; <a href="https://www.amap.com/">高德地图</a>').addTo(map);

// 加载高德地图 (使用 CSS 滤镜实现深色模式)
const amapLayer = L.tileLayer('https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7', {
    subdomains: '1234',
    maxZoom: 18,
    className: 'dark-filter' // 添加自定义类名以便应用 CSS 滤镜
}).addTo(map);

// 错误处理：如果高德地图加载失败，自动切换到 OpenStreetMap
amapLayer.on('tileerror', function(e) {
    if (!map.hasLayer(osmLayer)) {
        console.warn('高德地图加载失败，切换到 OpenStreetMap backup');
        map.removeLayer(amapLayer);
        osmLayer.addTo(map);
    }
});

// 备用图层：OpenStreetMap (标准)
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    className: 'dark-filter', // 同样应用深色滤镜
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// 定义自定义图标
const hubIcon = L.divIcon({
    className: 'hub-marker', // 使用新的 CSS 类
    html: "<div class='hub-dot'></div>", // 内部只放一个中心点，波纹由伪元素实现
    iconSize: [20, 20], // 调整尺寸
    iconAnchor: [10, 10] // 居中锚点
});

const devIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color: #1785fb; width: 6px; height: 6px; border-radius: 50%; opacity: 0.8;'></div>",
    iconSize: [6, 6],
    iconAnchor: [3, 3]
});

// hubs 数据已移至 hubs.js，请确保在 HTML 中引入该文件

// 模拟数据：生成随机开发者分布点
// 移除随机生成逻辑，改为读取 localStorage

// 创建图层组
const hubsLayer = L.layerGroup().addTo(map);
// 歌迷标记点图层组（直接显示所有标记点，不聚合）
const devsLayer = window.devsLayer = L.layerGroup().addTo(map);

// 渲染核心研发中心 (初始渲染，后续 loadUsers 会更新)
function renderHubs() {
    hubsLayer.clearLayers();
    hubs.forEach(hub => {
        L.marker([hub.lat, hub.lng], { icon: hubIcon })
            .bindPopup(`
                <div style="text-align: center;">
                    <h3 style="margin: 0 0 8px;">${hub.name}</h3>
                    <p style="margin: 0; color: #a0a0a0;"><i class="fa-solid fa-users"></i> 粉丝: <span style="color: #fff; font-weight: bold;">${hub.devs}</span></p>
                    <p style="margin: 4px 0 0; color: #666; font-size: 10px;">${hub.lat.toFixed(4)}, ${hub.lng.toFixed(4)}</p>
                </div>
            `)
            .on('mouseover', function (e) {
                this.openPopup();
            })
            .on('mouseout', function (e) {
                this.closePopup();
            })
            .addTo(hubsLayer);
    });
}
renderHubs();

// 从 GitHub Gist 加载用户数据，云端不可用时 fallback 到虚拟数据
async function loadUsers() {
    devsLayer.clearLayers();
    featureState.users = [];
    featureState.userMarkers = [];

    // 从 Gist 加载云端用户数据（云端不可用时返回空数组）
    const cloudUsers = await loadUsersFromCloud();

    // 加载互动数据（打call + 留言，云端不可用时回退到本地）
    const interactData = await loadInteractData();
    featureState.loves = interactData.loves;
    featureState.messages = interactData.messages;

    let users = cloudUsers;

    // 云端无数据时，使用虚拟数据 fallback，保证地图始终有分布展示
    if (users.length === 0 && typeof MOCK_USERS !== 'undefined' && MOCK_USERS.length > 0) {
        console.info('启用虚拟歌迷数据');
        users = MOCK_USERS;
    }

    // 合并 localStorage 中本地保存的用户（file:// 模式下通过 add.html 加入的用户）
    try {
        const rawLocal = localStorage.getItem('fansmap_local_users');
        if (rawLocal) {
            const localUsers = JSON.parse(rawLocal);
            if (Array.isArray(localUsers) && localUsers.length > 0) {
                users = users.concat(localUsers);
                console.log(`合并 ${localUsers.length} 个本地保存的用户`);
            }
        }
    } catch (e) { /* 忽略本地用户合并错误 */ }
    // 缓存用户数据到 featureState
    featureState.users = users;
        // --- 统计逻辑开始 ---
        
        // 1. 计算歌迷总数
        const totalCount = users.length;
        
        // 更新面板上的总数
        const metricElement = document.querySelector('.metric-value');
        if (metricElement) {
            metricElement.textContent = totalCount.toLocaleString();
        }

        // 2. 更新区域分布图表（按最近的省会归类）
        const chartContainer = document.querySelector('.bar-chart');
        if (chartContainer) {
            const provinceStats = {};
            hubs.forEach(hub => {
                provinceStats[hub.name] = 0;
                hub.devs = 0;
            });

            function getDistSq(lat1, lng1, lat2, lng2) {
                return (lat1 - lat2) ** 2 + (lng1 - lng2) ** 2;
            }

            users.forEach(user => {
                let minD = Infinity;
                let nearestHub = null;
                for (const hub of hubs) {
                    const d = getDistSq(user.lat, user.lng, hub.lat, hub.lng);
                    if (d < minD) { minD = d; nearestHub = hub; }
                }
                if (nearestHub) {
                    provinceStats[nearestHub.name]++;
                    nearestHub.devs++;
                }
            });

            const sortedProvinces = Object.entries(provinceStats)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count);

            const maxCount = sortedProvinces.length > 0 ? sortedProvinces[0].count : 0;

            const chartHtml = sortedProvinces.map(item => {
                const widthPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                const cityName = item.name.replace('歌迷会', '');
                return `
                    <div class="bar-row">
                        <span class="label" style="width: 50px;">${cityName}</span>
                        <div class="bar-bg" style="flex: 1; margin: 0 10px;"><div class="bar-fill" style="width: ${widthPercent}%"></div></div>
                        <span class="value" style="width: 45px; text-align: right;">${item.count}</span>
                    </div>
                `;
            }).join('');

            chartContainer.innerHTML = chartHtml || '<div style="text-align:center; color:#666; font-size:12px; padding:10px;">暂无数据</div>';
        }
        // --- 统计逻辑结束 ---
        
        // 3. 重新渲染hubs
        renderHubs();

        users.forEach(user => {
            // 使用 circleMarker（Canvas 渲染），避免 5000 个 DOM 元素拖慢页面
            const loveCount = featureState.loves[user.nickname] || 0;
            const marker = L.circleMarker([user.lat, user.lng], {
                radius: loveCount > 0 ? 6 : 4,
                fillColor: '#1785fb',
                color: '#1785fb',
                weight: 1,
                opacity: 0.9,
                fillOpacity: 0.7
            });
            featureState.userMarkers.push({ marker, user });

            // 动态生成弹窗内容（每次打开时重新读取 localStorage）
            function buildPopupContent(u) {
                const isImg = u.avatar && (u.avatar.startsWith('data:') || u.avatar.startsWith('http'));
                const avContent = isImg
                    ? `<img src="${u.avatar}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 24 24%22 fill=%22none%22%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%2210%22 stroke=%22%231785fb%22 stroke-width=%222%22/%3E%3Cpath d=%22M12 16V12M12 8H12.01%22 stroke=%22%231785fb%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E'">`
                    : (u.avatar || '👤');
                // 昵称做 HTML 转义，防止 XSS
                const safeNickname = escapeHtml(u.nickname);
                return `
                    <div style="text-align: center;">
                        <div style="font-size: 24px; margin-bottom: 4px; width: 40px; height: 40px; margin: 0 auto 8px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #333;">
                            ${avContent}
                        </div>
                        <h3 style="margin: 0; color: #fff;">${safeNickname}</h3>
                        <p style="margin: 4px 0 0; color: #a0a0a0; font-size: 12px;">加入于: ${new Date(u.timestamp || Date.now()).toLocaleDateString()}</p>
                        ${typeof getLoveHTML === 'function' ? getLoveHTML(u.nickname) : ''}
                        ${typeof getMessageHTML === 'function' ? getMessageHTML(u) : ''}
                    </div>
                `;
            }

            marker.bindPopup(() => buildPopupContent(user), { maxWidth: 250, closeButton: true });
            marker.on('click', function () {
                this.openPopup();
                if (typeof handleConnectionClick === 'function') {
                    handleConnectionClick(marker, user);
                }
            });
            marker.addTo(devsLayer);
        });
}

// 初始加载
loadUsers();

// 图层控制逻辑
document.getElementById('layer-hubs').addEventListener('change', (e) => {
    if (e.target.checked) {
        map.addLayer(hubsLayer);
    } else {
        map.removeLayer(hubsLayer);
    }
});

document.getElementById('layer-devs').addEventListener('change', (e) => {
    if (e.target.checked) {
        map.addLayer(devsLayer);
    } else {
        map.removeLayer(devsLayer);
    }
});

// 简单的交互效果：点击侧边栏高亮
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
    });
});



// 全屏功能
/**
 * 切换全屏模式
 */
function toggleFullscreen() {
    const elem = document.documentElement;
    
    if (!document.fullscreenElement) {
        // 进入全屏
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        // 退出全屏
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

/**
 * 更新全屏按钮状态
 */
function updateFullscreenButton() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (!fullscreenBtn) return;
    
    const icon = fullscreenBtn.querySelector('i');
    if (document.fullscreenElement) {
        icon.className = 'fa-solid fa-compress';
        fullscreenBtn.title = '退出全屏';
    } else {
        icon.className = 'fa-solid fa-expand';
        fullscreenBtn.title = '全屏模式';
    }
}

/**
 * 初始化全屏功能
 */
function initFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', updateFullscreenButton);
    document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
    document.addEventListener('msfullscreenchange', updateFullscreenButton);
}

// 初始化全屏功能
window.addEventListener('DOMContentLoaded', initFullscreen);

/**
 * 初始化面板收起/展开功能
 */
function initPanelToggle() {
    const panel = document.getElementById('panel');
    const toggleBtn = document.getElementById('panel-toggle-btn');
    const expandBtn = document.getElementById('panel-expand-btn');

    if (!panel || !toggleBtn || !expandBtn) return;

    // 收起面板
    toggleBtn.addEventListener('click', () => {
        panel.classList.add('collapsed');
        expandBtn.style.display = 'flex';
        // 触发地图重绘以填充空白区域
        setTimeout(() => map.invalidateSize(), 350);
    });

    // 展开面板
    expandBtn.addEventListener('click', () => {
        panel.classList.remove('collapsed');
        expandBtn.style.display = 'none';
        setTimeout(() => map.invalidateSize(), 350);
    });
}

window.addEventListener('DOMContentLoaded', initPanelToggle);
