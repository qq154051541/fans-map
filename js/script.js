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
    loves: {},
    messages: {}
};

// 初始化地图，设置中心点为中国视图
const map = L.map('map', {
    zoomControl: false, // 禁用默认缩放控件，我们将重新添加并自定义位置
    attributionControl: false
}).setView([34.3416, 108.9398], 4); // 以西安为中心，缩放级别 4，覆盖中国大部分区域

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

// 从 gongju.dev 加载用户数据（支持多批次）
async function loadUsers() {
    devsLayer.clearLayers();
    featureState.users = [];
    featureState.userMarkers = [];
    
    // 先加载索引，获取所有数据批次 ID
    await loadBinIndex();

    // 加载互动数据（打call + 留言）
    const interactData = await loadInteractData();
    featureState.loves = interactData.loves;
    featureState.messages = interactData.messages;

    if (CONFIG.DATA_IDS.length === 0) {
        console.error('没有可用的数据批次');
        return;
    }

    try {
        // 从所有批次并行读取数据
        const fetchPromises = CONFIG.DATA_IDS.map(dataId =>
            fetch(`${CONFIG.API_BASE}/${dataId}`)
            .then(response => {
                if (!response.ok) throw new Error(`批次 ${dataId} 加载失败`);
                return response.json();
            })
            .then(data => {
                // gongju.dev 可能将数据包裹在 content 字段中
                if (data && data.content && Array.isArray(data.content)) return data.content;
                return Array.isArray(data) ? data : [];
            })
            .catch(err => {
                console.error(`加载批次 ${dataId} 失败:`, err);
                return [];
            })
        );

        const allBatches = await Promise.all(fetchPromises);
        // 合并所有批次数据
        const users = allBatches.flat();
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
            const avatar = user.avatar || '';
            const isImage = avatar.startsWith('imgs/') || avatar.startsWith('data:image') || avatar.startsWith('http://') || avatar.startsWith('https://');
            const avatarContent = isImage 
                ? `<img src="${avatar}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%2210%22 stroke=%22%231785fb%22 stroke-width=%222%22/%3E%3Cpath d=%22M12 16V12M12 8H12.01%22 stroke=%22%231785fb%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E'">`
                : (avatar || '👤');

            // 获取打call数量
            const loveCount = featureState.loves[user.nickname] || 0;
            const loveBadge = loveCount > 0
                ? `<div class="love-badge">❤️${loveCount}</div>`
                : '';

            const userIcon = L.divIcon({
                className: 'user-marker',
                html: `<div class="user-marker-wrap">
                    <div style="
                        background-color: #1e1e1e;
                        border: 2px solid #1785fb;
                        border-radius: 50%;
                        width: 24px; height: 24px;
                        display: flex; justify-content: center; align-items: center;
                        font-size: 14px;
                        box-shadow: 0 0 8px rgba(23, 133, 251, 0.5);
                        overflow: hidden;
                    ">${avatarContent}</div>
                    ${loveBadge}
                </div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            const marker = L.marker([user.lat, user.lng], { icon: userIcon });
            featureState.userMarkers.push({ marker, user });

            // 动态生成弹窗内容（每次打开时重新读取 localStorage）
            function buildPopupContent(u) {
                const isImg = u.avatar && (u.avatar.startsWith('data:') || u.avatar.startsWith('http'));
                const avContent = isImg
                    ? `<img src="${u.avatar}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 24 24%22 fill=%22none%22%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%2210%22 stroke=%22%231785fb%22 stroke-width=%222%22/%3E%3Cpath d=%22M12 16V12M12 8H12.01%22 stroke=%22%231785fb%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E'">`
                    : (u.avatar || '👤');
                return `
                    <div style="text-align: center;">
                        <div style="font-size: 24px; margin-bottom: 4px; width: 40px; height: 40px; margin: 0 auto 8px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #333;">
                            ${avContent}
                        </div>
                        <h3 style="margin: 0; color: #fff;">${u.nickname}</h3>
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
    } catch (err) {
        console.error('加载用户数据失败:', err);
    }
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
