/**
 * 创意功能模块集合
 * 包含：歌迷连线、最近歌迷、热力图、唱片播放器、歌词雨、
 *       季节主题、留言板、应援打call、猜歌游戏、时光轴回放
 */

// ============================================
// 全局状态（由 script.js 定义，通过 window.window.featureState 引用）
// ============================================

// ============================================
// 猜歌题库
// ============================================
const guessQuestions = [
    { lyric: "天青色等烟雨，而我在等你", answer: "青花瓷", options: ["青花瓷", "兰亭序", "东风破", "发如雪"] },
    { lyric: "最美的不是下雨天，是曾与你躲过雨的屋檐", answer: "不能说的秘密", options: ["晴天", "不能说的秘密", "轨迹", "退后"] },
    { lyric: "雨下整夜，我的爱溢出就像雨水", answer: "七里香", options: ["七里香", "晴天", "稻香", "星晴"] },
    { lyric: "还记得你说家是唯一的城堡", answer: "稻香", options: ["稻香", "甜甜的", "简单爱", "星晴"] },
    { lyric: "为你弹奏肖邦的夜曲，纪念我死去的爱情", answer: "夜曲", options: ["夜曲", "安静", "退后", "搁浅"] },
    { lyric: "荣耀的背后刻着一道孤独", answer: "以父之名", options: ["以父之名", "夜的第七章", "止战之殇", "逆鳞"] },
    { lyric: "谁在用琵琶弹奏，东风破", answer: "东风破", options: ["东风破", "青花瓷", "发如雪", "兰亭序"] },
    { lyric: "你发如雪，凄美了离别", answer: "发如雪", options: ["发如雪", "东风破", "青花瓷", "菊花台"] },
    { lyric: "我想就这样牵着你的手不放开", answer: "简单爱", options: ["简单爱", "甜甜的", "告白气球", "爱你没差"] },
    { lyric: "听妈妈的话，别让她受伤", answer: "听妈妈的话", options: ["听妈妈的话", "稻香", "甜甜的", "蜗牛"] },
    { lyric: "我送你离开，千里之外", answer: "千里之外", options: ["千里之外", "东风破", "菊花台", "烟花易冷"] },
    { lyric: "海鸟和鱼相爱，只是一场意外", answer: "珊瑚海", options: ["珊瑚海", "花海", "搁浅", "轨迹"] },
    { lyric: "爱情来的太快就像龙卷风", answer: "龙卷风", options: ["龙卷风", "暗号", "晴天", "星晴"] },
    { lyric: "快使用双截棍，哼哼哈兮", answer: "双截棍", options: ["双截棍", "霍元甲", "本草纲目", "忍者"] },
    { lyric: "塞纳河畔，左岸的咖啡", answer: "告白气球", options: ["告白气球", "莫吉托", "迷迭香", "园游会"] },
    { lyric: "菊花残，满地伤", answer: "菊花台", options: ["菊花台", "发如雪", "东风破", "烟花易冷"] },
    { lyric: "缓缓飘落的枫叶像思念", answer: "枫", options: ["枫", "晴天", "轨迹", "退后"] },
    { lyric: "一起长大的约定，那样清晰", answer: "蒲公英的约定", options: ["蒲公英的约定", "晴天", "简单爱", "等你下课"] },
    { lyric: "我知道你我都没有错，只是忘了怎么退后", answer: "退后", options: ["退后", "搁浅", "安静", "轨迹"] },
    { lyric: "麻烦给我的爱人来一杯Mojito", answer: "Mojito", options: ["Mojito", "告白气球", "迷迭香", "园游会"] },
    { lyric: "我只能永远读着对白，读着我给你的伤害", answer: "搁浅", options: ["搁浅", "退后", "安静", "轨迹"] },
    { lyric: "乘着风游荡在蓝天边", answer: "星晴", options: ["星晴", "晴天", "稻香", "简单爱"] },
    { lyric: "我一路向北，离开有你的季节", answer: "一路向北", options: ["一路向北", "退后", "轨迹", "搁浅"] },
    { lyric: "爷爷泡的茶，有一种味道叫做家", answer: "爷爷泡的茶", options: ["爷爷泡的茶", "稻香", "听妈妈的话", "蜗牛"] },
    { lyric: "窗外的麻雀，在电线杆上多嘴", answer: "七里香", options: ["七里香", "晴天", "星晴", "稻香"] },
];

// ============================================
// 1. 歌迷连线
// ============================================

/**
 * 切换歌迷连线模式
 */
function toggleConnectionMode() {
    window.featureState.connectionMode = !window.featureState.connectionMode;
    const btn = document.getElementById('btn-connect');
    if (btn) btn.classList.toggle('active', window.featureState.connectionMode);

    if (!window.featureState.connectionMode) {
        // 退出连线模式，清除选中状态
        window.featureState.connectionSelected = [];
        clearConnectionHighlights();
    }
}

/**
 * 处理连线模式下的用户标记点击
 * @param {L.Marker} marker - 被点击的标记
 * @param {Object} user - 用户数据
 */
function handleConnectionClick(marker, user) {
    if (!window.featureState.connectionMode) return;

    const idx = window.featureState.connectionSelected.findIndex(s => s.user.nickname === user.nickname);
    if (idx !== -1) {
        // 取消选中
        window.featureState.connectionSelected.splice(idx, 1);
        marker.getElement()?.classList.remove('connect-selected');
    } else {
        window.featureState.connectionSelected.push({ marker, user });
        marker.getElement()?.classList.add('connect-selected');

        // 选了两个就连线
        if (window.featureState.connectionSelected.length === 2) {
            drawConnectionLine(
                window.featureState.connectionSelected[0],
                window.featureState.connectionSelected[1]
            );
            // 清除选中，准备下一对
            setTimeout(() => {
                clearConnectionHighlights();
                window.featureState.connectionSelected = [];
            }, 500);
        }
    }
}

/**
 * 在两个歌迷之间画弧线
 */
function drawConnectionLine(a, b) {
    const latlngs = [];
    const steps = 50;
    const midLat = (a.user.lat + b.user.lat) / 2;
    const midLng = (a.user.lng + b.user.lng) / 2;
    // 计算弧线高度
    const dist = Math.sqrt((a.user.lat - b.user.lat) ** 2 + (a.user.lng - b.user.lng) ** 2);
    const offset = dist * 0.2;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = (1 - t) * a.user.lat + t * b.user.lat + Math.sin(Math.PI * t) * offset;
        const lng = (1 - t) * a.user.lng + t * b.user.lng;
        latlngs.push([lat, lng]);
    }

    const line = L.polyline(latlngs, {
        color: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#ff69b4',
        weight: 2,
        dashArray: '8 4',
        className: 'connection-line'
    }).addTo(map);

    // 中点添加距离标签
    const distance = haversineDistance(a.user.lat, a.user.lng, b.user.lat, b.user.lng);
    const midPoint = latlngs[Math.floor(steps / 2)];
    const label = L.marker(midPoint, {
        icon: L.divIcon({
            className: 'connection-label',
            html: `<i class="fa-solid fa-heart"></i> ${distance.toFixed(0)}km`,
            iconSize: [80, 24],
            iconAnchor: [40, 12]
        })
    }).addTo(map);

    window.featureState.connectionLines.push({ line, label });

    // 5秒后淡出消失
    setTimeout(() => {
        line.setStyle({ opacity: 0, weight: 0 });
        map.removeLayer(label);
        map.removeLayer(line);
        window.featureState.connectionLines = window.featureState.connectionLines.filter(l => l !== line);
    }, 5000);
}

/**
 * 清除连线选中高亮
 */
function clearConnectionHighlights() {
    window.featureState.connectionSelected.forEach(s => {
        s.marker.getElement()?.classList.remove('connect-selected');
    });
}

/**
 * 清除所有连线
 */
function clearAllConnections() {
    window.featureState.connectionLines.forEach(({ line, label }) => {
        map.removeLayer(line);
        map.removeLayer(label);
    });
    window.featureState.connectionLines = [];
}

// ============================================
// 2. 距离最近的歌迷
// ============================================

/**
 * 高亮显示距离当前用户最近的3个歌迷
 */
function showNearestFans() {
    clearNearestHighlights();

    if (window.featureState.users.length < 2) return;

    // 取最后一个用户作为"当前用户"（最新加入的）
    const currentUser = window.featureState.users[window.featureState.users.length - 1];
    const others = window.featureState.users.filter(u => u !== currentUser);

    // 计算距离并排序
    const distances = others.map(u => ({
        user: u,
        dist: haversineDistance(currentUser.lat, currentUser.lng, u.lat, u.lng)
    })).sort((a, b) => a.dist - b.dist);

    const nearest3 = distances.slice(0, 3);

    nearest3.forEach((item, idx) => {
        const markerData = window.featureState.userMarkers.find(m => m.user === item.user);
        if (markerData) {
            const el = markerData.marker.getElement();
            if (el) {
                el.classList.add('nearest-marker');
                // 添加排名徽章
                const badge = document.createElement('span');
                badge.className = 'nearest-badge';
                badge.textContent = `TOP${idx + 1}`;
                el.style.position = 'relative';
                el.appendChild(badge);
            }
            window.featureState.nearestHighlight.push(markerData.marker);
        }
    });

    // 同时画连线到最近3个
    nearest3.forEach(item => {
        const markerData = window.featureState.userMarkers.find(m => m.user === item.user);
        if (markerData) {
            drawConnectionLine(
                { marker: null, user: currentUser },
                { marker: markerData.marker, user: item.user }
            );
        }
    });
}

/**
 * 清除最近歌迷高亮
 */
function clearNearestHighlights() {
    window.featureState.nearestHighlight.forEach(marker => {
        const el = marker.getElement();
        if (el) {
            el.classList.remove('nearest-marker');
            const badge = el.querySelector('.nearest-badge');
            if (badge) badge.remove();
        }
    });
    window.featureState.nearestHighlight = [];
    clearAllConnections();
}

/**
 * 切换最近歌迷显示
 */
function toggleNearestFans() {
    if (window.featureState.nearestHighlight.length > 0) {
        clearNearestHighlights();
        clearAllConnections();
        document.getElementById('btn-nearest')?.classList.remove('active');
    } else {
        showNearestFans();
        document.getElementById('btn-nearest')?.classList.add('active');
    }
}

// ============================================
// 3. 城市热力图
// ============================================

/**
 * 切换热力图显示
 */
function toggleHeatmap() {
    const btn = document.getElementById('btn-heatmap');
    if (window.featureState.heatmapLayer) {
        map.removeLayer(window.featureState.heatmapLayer);
        window.featureState.heatmapLayer = null;
        // 移除图例
        document.querySelector('.heatmap-legend')?.remove();
        btn?.classList.remove('active');
        return;
    }

    // 使用 Canvas 绘制热力点
    const heatCanvas = document.createElement('canvas');
    heatCanvas.width = map.getSize().x;
    heatCanvas.height = map.getSize().y;
    const ctx = heatCanvas.getContext('2d');

    window.featureState.users.forEach(user => {
        const point = map.latLngToContainerPoint([user.lat, user.lng]);
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 40);
        gradient.addColorStop(0, 'rgba(255, 105, 180, 0.6)');
        gradient.addColorStop(0.4, 'rgba(255, 165, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(point.x - 40, point.y - 40, 80, 80);
    });

    // 叠加 hubs 的热力
    hubs.forEach(hub => {
        const point = map.latLngToContainerPoint([hub.lat, hub.lng]);
        const radius = Math.min(60 + (hub.devs || 0) * 5, 120);
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
        gradient.addColorStop(0, 'rgba(255, 69, 180, 0.8)');
        gradient.addColorStop(0.3, 'rgba(255, 140, 0, 0.5)');
        gradient.addColorStop(0.7, 'rgba(255, 200, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2);
    });

    // 将 Canvas 转为 Leaflet 图层
    const bounds = map.getBounds();
    const overlay = L.imageOverlay(heatCanvas.toDataURL(), bounds, {
        opacity: 0.7,
        interactive: false
    }).addTo(map);

    window.featureState.heatmapLayer = overlay;
    btn?.classList.add('active');

    // 添加图例
    if (!document.querySelector('.heatmap-legend')) {
        const legend = document.createElement('div');
        legend.className = 'heatmap-legend';
        legend.innerHTML = `
            <div>歌迷密度</div>
            <div class="gradient-bar"></div>
            <div class="legend-labels">
                <span>低</span><span>中</span><span>高</span>
            </div>
        `;
        document.getElementById('map').appendChild(legend);
    }

    // 地图移动时重绘
    const redrawHeatmap = () => {
        if (!window.featureState.heatmapLayer) return;
        map.removeLayer(window.featureState.heatmapLayer);
        window.featureState.heatmapLayer = null;
        toggleHeatmap();
    };
    map.off('moveend', redrawHeatmap);
    map.on('moveend', redrawHeatmap);
}

// ============================================
// 4. 唱片旋转播放器
// ============================================

const vinylPlaylist = [
    { title: "七里香", artist: "周杰伦" },
    { title: "晴天", artist: "周杰伦" },
    { title: "稻香", artist: "周杰伦" },
    { title: "青花瓷", artist: "周杰伦" },
    { title: "夜曲", artist: "周杰伦" },
    { title: "告白气球", artist: "周杰伦" },
    { title: "简单爱", artist: "周杰伦" },
    { title: "听妈妈的话", artist: "周杰伦" },
];
let vinylIndex = 0;
let vinylPlaying = false;

// HTML5 Audio 播放器
const vinylAudio = new Audio();
vinylAudio.crossOrigin = 'anonymous';

// 歌曲缓存：{ 歌名: 播放URL }
const vinylUrlCache = {};

/**
 * 通过网易云音乐 API 搜索歌曲并获取播放链接
 * @param {string} keyword - 搜索关键词
 * @returns {Promise<string|null>} 播放URL或null
 */
async function fetchSongUrl(keyword) {
    // 检查缓存
    if (vinylUrlCache[keyword]) return vinylUrlCache[keyword];

    try {
        // 搜索歌曲
        const searchRes = await fetch(`https://api.7boe.top/search?keywords=${encodeURIComponent(keyword)}&limit=10&type=1`);
        const searchData = await searchRes.json();

        if (!searchData.result?.songs?.length) return null;

        // 遍历搜索结果，找到可播放的歌曲
        for (const song of searchData.result.songs) {
            const urlRes = await fetch(`https://api.7boe.top/song/url?id=${song.id}`);
            const urlData = await urlRes.json();

            if (urlData.data?.[0]?.url) {
                const url = urlData.data[0].url;
                // 缓存结果
                vinylUrlCache[keyword] = url;
                return url;
            }
        }
        return null;
    } catch (e) {
        console.warn('获取歌曲链接失败:', e);
        return null;
    }
}

/**
 * 播放当前歌曲
 */
async function playCurrentSong() {
    const song = vinylPlaylist[vinylIndex];
    const keyword = `${song.title} ${song.artist}`;

    // 更新UI为加载状态
    const titleEl = document.getElementById('vinyl-title');
    if (titleEl) titleEl.textContent = song.title + ' (加载中...)';

    const url = await fetchSongUrl(keyword);

    if (url) {
        vinylAudio.src = url;
        vinylAudio.play().catch(e => console.warn('播放失败:', e));
        if (titleEl) titleEl.textContent = song.title;
    } else {
        if (titleEl) titleEl.textContent = song.title + ' (暂无音源)';
        // 3秒后恢复原标题
        setTimeout(() => {
            if (titleEl) titleEl.textContent = vinylPlaylist[vinylIndex].title;
        }, 3000);
    }
}

// 歌曲播放结束自动下一首
vinylAudio.addEventListener('ended', () => {
    vinylNext();
});

/**
 * 初始化唱片播放器
 */
function initVinylPlayer() {
    const container = document.createElement('div');
    container.className = 'vinyl-player';
    container.id = 'vinyl-player';
    container.innerHTML = `
        <div class="vinyl-disc" id="vinyl-disc" title="点击播放/暂停"></div>
        <div class="vinyl-info">
            <div class="vinyl-title" id="vinyl-title">${vinylPlaylist[0].title}</div>
            <div class="vinyl-artist" id="vinyl-artist">${vinylPlaylist[0].artist}</div>
        </div>
        <div class="vinyl-controls">
            <button class="vinyl-btn" id="vinyl-prev" title="上一首"><i class="fa-solid fa-backward-step"></i></button>
            <button class="vinyl-btn" id="vinyl-next" title="下一首"><i class="fa-solid fa-forward-step"></i></button>
        </div>
    `;
    document.getElementById('map').appendChild(container);

    // 点击唱片切换播放
    document.getElementById('vinyl-disc').addEventListener('click', toggleVinylSpin);
    document.getElementById('vinyl-prev').addEventListener('click', vinylPrev);
    document.getElementById('vinyl-next').addEventListener('click', vinylNext);
}

/**
 * 切换唱片旋转状态（播放/暂停）
 */
function toggleVinylSpin() {
    const disc = document.getElementById('vinyl-disc');
    vinylPlaying = !vinylPlaying;
    disc?.classList.toggle('spinning', vinylPlaying);

    if (vinylPlaying) {
        playCurrentSong();
    } else {
        vinylAudio.pause();
    }
}

/**
 * 上一首
 */
function vinylPrev() {
    vinylIndex = (vinylIndex - 1 + vinylPlaylist.length) % vinylPlaylist.length;
    updateVinylInfo();
    if (vinylPlaying) {
        playCurrentSong();
    }
}

/**
 * 下一首
 */
function vinylNext() {
    vinylIndex = (vinylIndex + 1) % vinylPlaylist.length;
    updateVinylInfo();
    if (vinylPlaying) {
        playCurrentSong();
    }
}

/**
 * 更新唱片信息
 */
function updateVinylInfo() {
    const song = vinylPlaylist[vinylIndex];
    document.getElementById('vinyl-title').textContent = song.title;
    document.getElementById('vinyl-artist').textContent = song.artist;
}

// ============================================
// 5. 歌词雨特效
// ============================================

// 歌词雨参数（由面板控件调节）
window.featureState.lyricRainOpacity = 0.8;
window.featureState.lyricRainSpeed = 1.0;
window.featureState.lyricRainDensity = 300;

/**
 * 切换歌词雨特效
 */
function toggleLyricRain() {
    const btn = document.getElementById('btn-lyric-rain');
    window.featureState.lyricRainActive = !window.featureState.lyricRainActive;

    if (window.featureState.lyricRainActive) {
        // 开启歌词雨时，关闭弹幕（互斥）
        if (danmakuConfig.enabled) {
            danmakuConfig.enabled = false;
            stopDanmaku();
        }
        startLyricRain();
        btn?.classList.add('active');
    } else {
        stopLyricRain();
        btn?.classList.remove('active');
    }

    // 同步更新选中框状态
    updateModeSelector();
}

/**
 * 同步更新模式选择器的选中状态
 */
function updateModeSelector() {
    const modeOptions = document.querySelectorAll('.mode-option');
    const modeRadios = document.querySelectorAll('input[name="lyric-mode"]');
    modeOptions.forEach(opt => opt.classList.remove('active'));

    if (window.featureState.lyricRainActive) {
        document.getElementById('mode-lyric-rain')?.classList.add('active');
        document.querySelector('input[name="lyric-mode"][value="lyric-rain"]').checked = true;
    } else if (danmakuConfig.enabled) {
        document.getElementById('mode-danmaku')?.classList.add('active');
        document.querySelector('input[name="lyric-mode"][value="danmaku"]').checked = true;
    } else {
        document.getElementById('mode-none')?.classList.add('active');
        document.querySelector('input[name="lyric-mode"][value="none"]').checked = true;
    }
}

/**
 * 启动歌词雨
 */
function startLyricRain() {
    const mapEl = document.getElementById('map');
    let container = document.querySelector('.lyric-rain-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'lyric-rain-container';
        mapEl.appendChild(container);
    }

    const lyrics = danmakuConfig.lyrics;

    /**
     * 创建一列歌词雨
     */
    function createColumn() {
        if (!window.featureState.lyricRainActive) return;

        const col = document.createElement('div');
        col.className = 'lyric-rain-column';

        const x = Math.random() * (mapEl.offsetWidth - 20);
        col.style.left = x + 'px';

        // 随机取 3-8 个字
        const charCount = 3 + Math.floor(Math.random() * 6);
        const randomLyric = lyrics[Math.floor(Math.random() * lyrics.length)];
        const text = randomLyric.substring(0, charCount);
        col.textContent = text;

        // 根据速度倍率计算动画时长
        const baseDuration = 6 + Math.random() * 8;
        const duration = baseDuration / window.featureState.lyricRainSpeed;
        col.style.animationDuration = duration + 's';
        col.style.fontSize = (12 + Math.random() * 6) + 'px';

        // 应用透明度
        col.style.setProperty('--rain-opacity', window.featureState.lyricRainOpacity);

        container.appendChild(col);

        setTimeout(() => {
            if (col.parentNode) col.parentNode.removeChild(col);
        }, duration * 1000);
    }

    // 根据密度计算间隔
    const interval = window.featureState.lyricRainDensity;
    window.featureState.lyricRainTimer = setInterval(() => {
        if (window.featureState.lyricRainActive) {
            createColumn();
        }
    }, interval);
}

/**
 * 停止歌词雨
 */
function stopLyricRain() {
    if (window.featureState.lyricRainTimer) {
        clearInterval(window.featureState.lyricRainTimer);
        window.featureState.lyricRainTimer = null;
    }
    const container = document.querySelector('.lyric-rain-container');
    if (container) container.innerHTML = '';
}

// ============================================
// 6. 季节主题切换
// ============================================

/**
 * 切换季节主题
 * @param {string} theme - 主题名称: default, spring, summer, autumn, winter
 */
function switchTheme(theme) {
    const body = document.body;
    // 移除所有主题类
    body.classList.remove('theme-spring', 'theme-summer', 'theme-autumn', 'theme-winter');

    if (theme !== 'default') {
        body.classList.add('theme-' + theme);
    }

    // 更新选中状态
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.theme === theme);
    });

    localStorage.setItem('fans_theme', theme);
}

// ============================================
// 7. 歌迷留言板
// ============================================

/**
 * 为用户标记的 popup 添加留言功能
 * @param {Object} user - 用户数据
 * @returns {string} 留言 HTML
 */
function getMessageHTML(user) {
    const userMessages = (window.featureState.messages && window.featureState.messages[user.nickname]) || [];
    const msgList = userMessages.map(m =>
        `<div style="font-size:11px; color:#a0a0a0; padding:2px 0; border-bottom:1px solid #333;">${m}</div>`
    ).join('');

    return `
        <div class="message-bubble" style="margin-top:8px;">
            ${userMessages.length > 0 ? msgList : '<span style="color:#666;">还没有留言~</span>'}
        </div>
        <div style="display:flex; gap:4px; margin-top:6px;">
            <input type="text" id="msg-input-${user.nickname}" placeholder="说点什么..."
                style="flex:1; background:#121212; border:1px solid #333; border-radius:4px; padding:4px 8px; color:#fff; font-size:11px; outline:none;">
            <button onclick="leaveMessage('${user.nickname}')" 
                style="background:var(--accent-color); border:none; border-radius:4px; padding:4px 8px; color:#fff; font-size:11px; cursor:pointer;">
                留言
            </button>
        </div>
    `;
}

/**
 * 给用户留言（保存到云端）
 * @param {string} nickname - 用户昵称
 */
async function leaveMessage(nickname) {
    const input = document.getElementById('msg-input-' + nickname);
    if (!input || !input.value.trim()) return;

    const msgText = input.value.trim();
    if (!window.featureState.messages[nickname]) window.featureState.messages[nickname] = [];
    window.featureState.messages[nickname].push(msgText);

    // 保存到云端
    await saveInteractData(window.featureState.loves, window.featureState.messages);

    input.value = '';

    // 从 input 向上找到弹窗容器，再找留言气泡
    const popupContent = input.closest('.leaflet-popup-content');
    if (popupContent) {
        const bubble = popupContent.querySelector('.message-bubble');
        if (bubble) {
            const noMsg = bubble.querySelector('span');
            if (noMsg && noMsg.textContent.includes('还没有留言')) noMsg.remove();
            const newMsg = document.createElement('div');
            newMsg.style.cssText = 'font-size:11px; color:#a0a0a0; padding:2px 0; border-bottom:1px solid #333;';
            newMsg.textContent = msgText;
            bubble.appendChild(newMsg);
        }
    }
}

// ============================================
// 8. 应援打call
// ============================================

/**
 * 给用户送爱心（保存到云端）
 * @param {string} nickname - 用户昵称
 * @param {Event} event - 点击事件
 */
async function sendLove(nickname, event) {
    // 增加计数
    if (!window.featureState.loves[nickname]) window.featureState.loves[nickname] = 0;
    window.featureState.loves[nickname]++;

    // 保存到云端（不阻塞动画）
    saveInteractData(window.featureState.loves, window.featureState.messages);

    // 爱心飘浮动画
    const heart = document.createElement('div');
    heart.className = 'love-burst';
    heart.textContent = '❤️';
    heart.style.left = (event.clientX - 10) + 'px';
    heart.style.top = (event.clientY - 10) + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);

    // 更新弹窗内计数显示
    const countEl = document.getElementById('love-count-' + nickname);
    if (countEl) countEl.innerHTML = `❤️ ${window.featureState.loves[nickname]}`;

    // 更新地图标记上的角标
    const markerData = window.featureState.userMarkers.find(m => m.user.nickname === nickname);
    if (markerData) {
        const iconEl = markerData.marker.getElement();
        if (iconEl) {
            const wrap = iconEl.querySelector('.user-marker-wrap');
            if (wrap) {
                let badge = wrap.querySelector('.love-badge');
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'love-badge';
                    wrap.appendChild(badge);
                }
                badge.textContent = `❤️${window.featureState.loves[nickname]}`;
            }
        }
    }
}

/**
 * 获取爱心按钮 HTML
 * @param {string} nickname - 用户昵称
 * @returns {string} HTML
 */
function getLoveHTML(nickname) {
    const count = window.featureState.loves[nickname] || 0;
    return `
        <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
            <button class="love-btn" onclick="sendLove('${nickname}', event)">
                <i class="fa-solid fa-heart"></i> 打call
            </button>
            <span class="love-count" id="love-count-${nickname}" style="background:rgba(255,20,147,0.15); padding:2px 8px; border-radius:10px;">
                ❤️ ${count}
            </span>
        </div>
    `;
}

// ============================================
// 9. 猜歌小游戏
// ============================================

/**
 * 启动猜歌游戏
 */
function startGuessGame() {
    window.featureState.guessGameActive = true;
    window.featureState.guessScore = 0;
    window.featureState.guessQuestionIndex = 0;

    // 随机打乱题库
    guessQuestions.sort(() => Math.random() - 0.5);

    showGuessQuestion();
}

/**
 * 显示当前猜歌题目
 */
function showGuessQuestion() {
    if (!window.featureState.guessGameActive) return;
    if (window.featureState.guessQuestionIndex >= guessQuestions.length) {
        endGuessGame();
        return;
    }

    const q = guessQuestions[window.featureState.guessQuestionIndex];
    // 打乱选项
    const shuffled = [...q.options].sort(() => Math.random() - 0.5);

    // 移除旧面板
    document.querySelector('.guess-game-panel')?.remove();

    const panel = document.createElement('div');
    panel.className = 'guess-game-panel';
    panel.innerHTML = `
        <button class="guess-close-btn" onclick="endGuessGame()"><i class="fa-solid fa-xmark"></i></button>
        <h4><i class="fa-solid fa-music"></i> 猜歌挑战</h4>
        <div class="guess-lyric">"${q.lyric}"</div>
        <div class="guess-options">
            ${shuffled.map(opt => `
                <button class="guess-option" onclick="checkGuess(this, '${opt}', '${q.answer}')">
                    ${opt}
                </button>
            `).join('')}
        </div>
        <div class="guess-score">得分: ${window.featureState.guessScore} / ${window.featureState.guessQuestionIndex}</div>
    `;
    document.getElementById('map').appendChild(panel);
}

/**
 * 检查猜歌答案
 * @param {HTMLElement} btn - 被点击的按钮
 * @param {string} selected - 选择的答案
 * @param {string} correct - 正确答案
 */
function checkGuess(btn, selected, correct) {
    const allBtns = btn.parentElement.querySelectorAll('.guess-option');
    allBtns.forEach(b => b.disabled = true);

    if (selected === correct) {
        btn.classList.add('correct');
        window.featureState.guessScore++;
    } else {
        btn.classList.add('wrong');
        // 高亮正确答案
        allBtns.forEach(b => {
            if (b.textContent.trim() === correct) b.classList.add('correct');
        });
    }

    // 1.5秒后下一题
    setTimeout(() => {
        window.featureState.guessQuestionIndex++;
        showGuessQuestion();
    }, 1500);
}

/**
 * 结束猜歌游戏
 */
function endGuessGame() {
    window.featureState.guessGameActive = false;
    document.querySelector('.guess-game-panel')?.remove();

    const total = window.featureState.guessQuestionIndex;
    const score = window.featureState.guessScore;

    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: '猜歌结束！',
            html: `<p style="font-size:24px; color:#ff69b4;">${score} / ${total}</p>
                   <p style="color:#a0a0a0;">${score >= total * 0.8 ? '你是真正的杰迷！' : score >= total * 0.5 ? '不错哦~' : '再接再厉！'}</p>`,
            background: '#1e1e1e',
            color: '#fff',
            confirmButtonText: '确定',
            confirmButtonColor: '#ff69b4'
        });
    } else {
        alert(`猜歌结束！得分: ${score} / ${total}`);
    }

    document.getElementById('btn-guess')?.classList.remove('active');
}

// ============================================
// 10. 时光轴回放
// ============================================

/**
 * 切换时光轴面板
 */
function toggleTimeline() {
    const btn = document.getElementById('btn-timeline');
    window.featureState.timelineActive = !window.featureState.timelineActive;

    if (window.featureState.timelineActive) {
        showTimelineBar();
        btn?.classList.add('active');
    } else {
        hideTimelineBar();
        btn?.classList.remove('active');
    }
}

/**
 * 显示时光轴底栏
 */
function showTimelineBar() {
    if (document.querySelector('.timeline-bar')) return;

    const bar = document.createElement('div');
    bar.className = 'timeline-bar';
    bar.innerHTML = `
        <button class="timeline-btn" id="timeline-play" title="播放/暂停" onclick="toggleTimelinePlay()">
            <i class="fa-solid fa-play"></i>
        </button>
        <div class="timeline-track" onclick="seekTimeline(event)">
            <div class="timeline-progress" id="timeline-progress"></div>
        </div>
        <div class="timeline-date" id="timeline-date">--</div>
        <div class="timeline-speed" id="timeline-speed" onclick="cycleTimelineSpeed()">1x</div>
    `;
    document.getElementById('map').appendChild(bar);

    // 初始状态：隐藏所有用户标记
    let hidden = 0;
    featureState.userMarkers.forEach(({ marker }) => {
        const el = marker.getElement();
        if (el) {
            el.classList.add('timeline-hidden');
            hidden++;
        }
    });
    console.log(`时光轴: 已隐藏 ${hidden}/${featureState.userMarkers.length} 个标记`);
}

/**
 * 隐藏时光轴底栏
 */
function hideTimelineBar() {
    stopTimelinePlay();
    document.querySelector('.timeline-bar')?.remove();

    // 恢复所有用户标记
    featureState.userMarkers.forEach(({ marker }) => {
        const el = marker.getElement();
        if (el) {
            el.classList.remove('timeline-hidden');
            el.classList.remove('timeline-visible');
        }
    });

    window.featureState.timelineProgress = 0;
}

/**
 * 切换时光轴播放/暂停
 */
function toggleTimelinePlay() {
    if (window.featureState.timelinePlaying) {
        stopTimelinePlay();
    } else {
        startTimelinePlay();
    }
}

/**
 * 开始播放时光轴
 */
function startTimelinePlay() {
    window.featureState.timelinePlaying = true;
    const playBtn = document.getElementById('timeline-play');
    if (playBtn) {
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        playBtn.classList.add('playing');
    }

    // 按时间排序用户
    const sorted = [...featureState.userMarkers].sort((a, b) =>
        (a.user.timestamp || 0) - (b.user.timestamp || 0)
    );
    if (sorted.length === 0) {
        console.warn('时光轴: 没有用户数据');
        return;
    }

    const minTime = sorted[0].user.timestamp || Date.now() - 86400000 * 30;
    const maxTime = sorted[sorted.length - 1].user.timestamp || Date.now();
    const totalTime = maxTime - minTime || 1;

    console.log(`时光轴: 时间范围 ${new Date(minTime).toLocaleDateString()} ~ ${new Date(maxTime).toLocaleDateString()}，共 ${sorted.length} 个用户`);

    // 记录已显示的索引
    const shownSet = new Set();

    window.featureState.timelineTimer = setInterval(() => {
        window.featureState.timelineProgress += 0.5 * window.featureState.timelineSpeed;
        if (window.featureState.timelineProgress >= 100) {
            window.featureState.timelineProgress = 100;
            stopTimelinePlay();
        }

        // 更新进度条
        const progressEl = document.getElementById('timeline-progress');
        if (progressEl) progressEl.style.width = window.featureState.timelineProgress + '%';

        // 更新日期
        const currentTime = minTime + (totalTime * window.featureState.timelineProgress / 100);
        const dateEl = document.getElementById('timeline-date');
        if (dateEl) dateEl.textContent = new Date(currentTime).toLocaleDateString();

        // 按时间显示标记
        let newCount = 0;
        sorted.forEach(({ marker, user }, idx) => {
            const userTime = user.timestamp || minTime;
            if (userTime <= currentTime && !shownSet.has(idx)) {
                shownSet.add(idx);
                const el = marker.getElement();
                if (el && el.classList.contains('timeline-hidden')) {
                    el.classList.remove('timeline-hidden');
                    el.classList.add('timeline-visible');
                    newCount++;
                }
            }
        });

        if (newCount > 0 && window.featureState.timelineProgress % 10 < 1) {
            console.log(`时光轴: 进度 ${window.featureState.timelineProgress.toFixed(0)}%，已显示 ${shownSet.size} 个标记`);
        }
    }, 50);
}

/**
 * 停止播放时光轴
 */
function stopTimelinePlay() {
    window.featureState.timelinePlaying = false;
    if (window.featureState.timelineTimer) {
        clearInterval(window.featureState.timelineTimer);
        window.featureState.timelineTimer = null;
    }
    const playBtn = document.getElementById('timeline-play');
    if (playBtn) {
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        playBtn.classList.remove('playing');
    }
}

/**
 * 点击时光轴跳转
 * @param {Event} event - 点击事件
 */
function seekTimeline(event) {
    const track = event.currentTarget;
    const rect = track.getBoundingClientRect();
    window.featureState.timelineProgress = ((event.clientX - rect.left) / rect.width) * 100;
    window.featureState.timelineProgress = Math.max(0, Math.min(100, window.featureState.timelineProgress));

    const progressEl = document.getElementById('timeline-progress');
    if (progressEl) progressEl.style.width = window.featureState.timelineProgress + '%';
}

/**
 * 切换播放速度
 */
function cycleTimelineSpeed() {
    const speeds = [1, 2, 4, 8];
    const idx = speeds.indexOf(window.featureState.timelineSpeed);
    window.featureState.timelineSpeed = speeds[(idx + 1) % speeds.length];
    const speedEl = document.getElementById('timeline-speed');
    if (speedEl) speedEl.textContent = window.featureState.timelineSpeed + 'x';
}

// ============================================
// 工具函数
// ============================================

/**
 * 计算 Haversine 距离（千米）
 * @param {number} lat1 - 纬度1
 * @param {number} lng1 - 经度1
 * @param {number} lat2 - 纬度2
 * @param {number} lng2 - 经度2
 * @returns {number} 距离（千米）
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ============================================
// 初始化所有功能
// ============================================

/**
 * 初始化创意功能面板和交互
 */
function initFeatures() {
    // 恢复保存的主题
    const savedTheme = localStorage.getItem('fans_theme') || 'default';
    switchTheme(savedTheme);

    // 初始化唱片播放器
    initVinylPlayer();

    // 绑定功能按钮事件
    document.getElementById('btn-connect')?.addEventListener('click', toggleConnectionMode);
    document.getElementById('btn-nearest')?.addEventListener('click', toggleNearestFans);
    document.getElementById('btn-heatmap')?.addEventListener('click', toggleHeatmap);
    document.getElementById('btn-lyric-rain')?.addEventListener('click', toggleLyricRain);
    document.getElementById('btn-guess')?.addEventListener('click', () => {
        const btn = document.getElementById('btn-guess');
        if (window.featureState.guessGameActive) {
            endGuessGame();
        } else {
            btn?.classList.add('active');
            startGuessGame();
        }
    });
    document.getElementById('btn-timeline')?.addEventListener('click', toggleTimeline);

    // 季节主题按钮
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.addEventListener('click', () => switchTheme(dot.dataset.theme));
    });
}

window.addEventListener('DOMContentLoaded', initFeatures);
