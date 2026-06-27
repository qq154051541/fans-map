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
        // 取消选中，恢复原样式
        window.featureState.connectionSelected.splice(idx, 1);
        marker.setStyle({ color: '#1785fb', fillColor: '#1785fb', radius: 4 });
    } else {
        window.featureState.connectionSelected.push({ marker, user });
        // 选中高亮：改为粉色
        marker.setStyle({ color: '#ff69b4', fillColor: '#ff69b4', radius: 7 });

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
        s.marker.setStyle({ color: '#1785fb', fillColor: '#1785fb', radius: 4 });
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
// 2. 距离最近的歌迷（基于浏览器定位）
// ============================================

/**
 * 获取浏览器当前定位，标记自身位置并找出最近的10个歌迷连线显示距离
 */
function showNearestFans() {
    clearNearestHighlights();

    if (window.featureState.users.length < 2) {
        Swal.fire({ icon: 'info', title: '歌迷数据不足', text: '当前歌迷数量太少，无法查找附近歌迷' });
        return;
    }

    // 弹出加载提示
    Swal.fire({
        title: '正在获取定位...',
        text: '请在浏览器弹窗中允许定位权限',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    if (!navigator.geolocation) {
        Swal.fire({ icon: 'error', title: '不支持定位', text: '当前浏览器不支持地理定位功能' });
        return;
    }

    /**
     * 定位成功回调：标记自身位置 + 查找最近10个歌迷并连线
     * @param {GeolocationPosition} pos - 浏览器定位结果
     */
    function onLocateSuccess(pos) {
        Swal.close();
        const myLat = pos.coords.latitude;
        const myLng = pos.coords.longitude;

        // 在地图上标记自身位置（红色脉冲标记）
        const myIcon = L.divIcon({
            className: 'my-location-marker',
            html: '<div class="my-location-dot"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        const myMarker = L.marker([myLat, myLng], { icon: myIcon, zIndexOffset: 1000 })
            .bindPopup('<div style="text-align:center;"><b style="color:#ef4444;">我的位置</b></div>')
            .addTo(map);
        window.featureState.nearestHighlight.push(myMarker);
        window.featureState.myLocationMarker = myMarker;

        // 计算所有歌迷到自身的距离并排序
        const distances = window.featureState.users.map(u => ({
            user: u,
            dist: haversineDistance(myLat, myLng, u.lat, u.lng)
        })).sort((a, b) => a.dist - b.dist);

        const nearest10 = distances.slice(0, 10);

        nearest10.forEach((item) => {
            const markerData = window.featureState.userMarkers.find(m => m.user === item.user);
            if (markerData) {
                // Canvas 标记高亮：改为金色 + 放大
                markerData.marker.setStyle({
                    color: '#fbbf24',
                    fillColor: '#f59e0b',
                    radius: 8,
                    weight: 2
                });
                window.featureState.nearestHighlight.push(markerData.marker);

                // 画连线（带距离标签，不自动消失）
                drawNearestLine(myLat, myLng, item.user, item.dist);
            }
        });

        // 缩放视野到自身+最近歌迷范围
        const allLatLngs = [[myLat, myLng], ...nearest10.map(n => [n.user.lat, n.user.lng])];
        map.fitBounds(L.latLngBounds(allLatLngs).pad(0.2));

        Swal.fire({
            icon: 'success',
            title: `已找到 ${nearest10.length} 位附近歌迷`,
            text: `最近: ${nearest10[0].dist.toFixed(1)}km，最远: ${nearest10[nearest10.length - 1].dist.toFixed(1)}km`,
            timer: 3000,
            showConfirmButton: false
        });
    }

    /**
     * 定位失败回调：提示错误信息
     * @param {GeolocationPositionError} err - 定位错误对象
     */
    function onLocateError(err) {
        let msg = '定位失败';
        if (err.code === 1) msg = '定位权限被拒绝，请在浏览器设置中允许定位权限';
        else if (err.code === 2) msg = '定位不可用，请检查网络或GPS';
        else if (err.code === 3) msg = '定位超时，请重试';
        Swal.fire({ icon: 'error', title: '定位失败', text: msg });
    }

    navigator.geolocation.getCurrentPosition(onLocateSuccess, onLocateError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    });
}

/**
 * 画一条从自身位置到附近歌迷的连线（带距离标签，不自动消失）
 * @param {number} myLat - 自身纬度
 * @param {number} myLng - 自身经度
 * @param {Object} user - 目标歌迷数据
 * @param {number} dist - 距离（km）
 */
function drawNearestLine(myLat, myLng, user, dist) {
    const latlngs = [[myLat, myLng], [user.lat, user.lng]];
    const line = L.polyline(latlngs, {
        color: '#f59e0b',
        weight: 2,
        opacity: 0.7,
        dashArray: '6 4'
    }).addTo(map);

    // 中点添加距离标签
    const midLat = (myLat + user.lat) / 2;
    const midLng = (myLng + user.lng) / 2;
    const label = L.marker([midLat, midLng], {
        icon: L.divIcon({
            className: 'nearest-distance-label',
            html: `<span class="dist-badge">${dist.toFixed(1)}km</span>`,
            iconSize: [60, 20],
            iconAnchor: [30, 10]
        })
    }).addTo(map);

    window.featureState.connectionLines.push({ line, label });
}

/**
 * 清除最近歌迷高亮和自身位置标记
 */
function clearNearestHighlights() {
    window.featureState.nearestHighlight.forEach(marker => {
        if (marker === window.featureState.myLocationMarker) {
            // 自身位置标记是 L.marker，直接移除
            map.removeLayer(marker);
        } else {
            // 歌迷标记是 circleMarker，恢复样式
            marker.setStyle({ color: '#1785fb', fillColor: '#1785fb', radius: 4, weight: 1 });
        }
    });
    window.featureState.nearestHighlight = [];
    window.featureState.myLocationMarker = null;
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
 * 在地图上绘制热力图层（基于 Canvas 径向渐变叠加）
 * 该函数只负责绘制，不处理按钮/图例/事件绑定，便于移动地图后重绘复用
 * @returns {L.ImageOverlay|null} 创建的热力图层，无数据时返回 null
 */
function drawHeatmap() {
    if (!window.featureState.users || window.featureState.users.length === 0) return null;

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
    return L.imageOverlay(heatCanvas.toDataURL(), bounds, {
        opacity: 0.7,
        interactive: false
    });
}

/**
 * 热力图重绘回调：地图移动/缩放后按新视口重绘热力图层
 */
function onHeatmapMoveEnd() {
    if (!window.featureState.heatmapLayer) return;
    map.removeLayer(window.featureState.heatmapLayer);
    const newLayer = drawHeatmap();
    if (newLayer) {
        newLayer.addTo(map);
        window.featureState.heatmapLayer = newLayer;
    } else {
        window.featureState.heatmapLayer = null;
    }
}

/**
 * 切换热力图显示
 */
function toggleHeatmap() {
    const btn = document.getElementById('btn-heatmap');
    if (window.featureState.heatmapLayer) {
        // 关闭：移除图层、解绑事件、移除图例
        map.off('moveend', onHeatmapMoveEnd);
        map.removeLayer(window.featureState.heatmapLayer);
        window.featureState.heatmapLayer = null;
        document.querySelector('.heatmap-legend')?.remove();
        btn?.classList.remove('active');
        return;
    }

    // 开启：绘制图层、绑定事件、添加图例
    const layer = drawHeatmap();
    if (!layer) return;
    layer.addTo(map);
    window.featureState.heatmapLayer = layer;
    btn?.classList.add('active');

    // 地图移动时重绘（绑定一次，关闭时统一解绑）
    map.on('moveend', onHeatmapMoveEnd);

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
}

// ============================================
// 4. 唱片旋转播放器
// ============================================

const vinylPlaylist = [
    { title: "七里香", artist: "周杰伦", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/99/4e/e2/994ee285-7c0d-73ab-85b7-8d3899a17242/mzaf_12441330510018253101.plus.aac.p.m4a" },
    { title: "晴天", artist: "周杰伦", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/20/d0/e7/20d0e7db-9c12-795a-d738-2fc3dde4ac9a/mzaf_10317517925583301645.plus.aac.p.m4a" },
    { title: "稻香", artist: "周杰伦", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/c3/c4/e0/c3c4e033-2bd0-e0fc-3195-3ec68299f19f/mzaf_9545722078596740089.plus.aac.p.m4a" },
    { title: "青花瓷", artist: "周杰伦", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/fd/18/39/fd18396a-1c71-5bde-be0f-9dcaa00e4b6f/mzaf_11928526430545533608.plus.aac.p.m4a" },
    { title: "夜曲", artist: "周杰伦", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/cd/80/49/cd8049a8-f655-a320-fe39-399582e94ed4/mzaf_2752455179820135985.plus.aac.p.m4a" },
    { title: "告白气球", artist: "周杰伦", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/8f/bc/20/8fbc20d5-ed30-3c34-7e66-2201ffba3695/mzaf_1061751424505493111.plus.aac.p.m4a" },
    { title: "简单爱", artist: "周杰伦", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/a3/b0/88/a3b088c9-dac4-fa2e-5292-94d64d50a46e/mzaf_806348827827822268.plus.aac.p.m4a" },
    { title: "听妈妈的话", artist: "周杰伦", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/74/e1/a6/74e1a6f6-79e5-22ce-59ec-7a50b6d5f5e0/mzaf_17280939928446393714.plus.aac.p.m4a" },
];
let vinylIndex = 0;
let vinylPlaying = false;

// HTML5 Audio 播放器
const vinylAudio = new Audio();

/**
 * 通过 iTunes Search API 搜索歌曲的 30 秒预览片段
 * 作为硬编码链接的动态补充（新增歌曲时自动获取预览链接）
 * @param {string} title - 歌曲名
 * @param {string} artist - 歌手名
 * @returns {Promise<string|null>} 30秒预览URL或null
 */
async function fetchPreviewFromItunes(title, artist) {
    try {
        const term = encodeURIComponent(`${artist} ${title}`);
        const res = await fetch(`https://itunes.apple.com/search?term=${term}&media=music&limit=5&country=tw`);
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.results || data.results.length === 0) return null;

        // 优先匹配歌手名包含"周杰"的结果
        const track = data.results.find(r =>
            r.artistName && r.artistName.includes('周杰') && r.previewUrl
        ) || data.results.find(r => r.previewUrl);

        return track ? track.previewUrl : null;
    } catch (e) {
        console.warn('iTunes 搜索失败:', e);
        return null;
    }
}

/**
 * 获取歌曲播放链接（优先使用硬编码预览，动态获取作为补充）
 * @param {Object} song - 歌曲对象 { title, artist, preview? }
 * @returns {Promise<string|null>} 播放URL或null
 */
async function fetchSongUrl(song) {
    // 优先使用硬编码的 iTunes 预览链接
    if (song.preview) return song.preview;
    // 动态从 iTunes API 获取
    return await fetchPreviewFromItunes(song.title, song.artist);
}

/**
 * 播放当前歌曲
 */
async function playCurrentSong() {
    const song = vinylPlaylist[vinylIndex];

    // 更新UI为加载状态
    const titleEl = document.getElementById('vinyl-title');
    if (titleEl) titleEl.textContent = song.title + ' (加载中...)';

    const url = await fetchSongUrl(song);

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
    // 留言内容做 HTML 转义，防止 XSS
    const msgList = userMessages.map(m =>
        `<div style="font-size:11px; color:#a0a0a0; padding:2px 0; border-bottom:1px solid #333;">${escapeHtml(m)}</div>`
    ).join('');
    // 昵称同时做 JS 字符串转义（用于内联事件），保证语法安全
    const safeNickJs = escapeJsString(user.nickname);

    return `
        <div class="message-bubble" style="margin-top:8px;">
            ${userMessages.length > 0 ? msgList : '<span style="color:#666;">还没有留言~</span>'}
        </div>
        <div style="display:flex; gap:4px; margin-top:6px;">
            <input type="text" class="msg-input" placeholder="说点什么..."
                style="flex:1; background:#121212; border:1px solid #333; border-radius:4px; padding:4px 8px; color:#fff; font-size:11px; outline:none;">
            <button onclick="leaveMessage('${safeNickJs}', event)"
                style="background:var(--accent-color); border:none; border-radius:4px; padding:4px 8px; color:#fff; font-size:11px; cursor:pointer;">
                留言
            </button>
        </div>
    `;
}

/**
 * 给用户留言（保存到云端）
 * @param {string} nickname - 用户昵称
 * @param {Event} event - 点击事件，用于定位同弹窗内的输入框
 */
async function leaveMessage(nickname, event) {
    // 从点击按钮向上找到弹窗容器，再查找输入框，避免依赖昵称拼接 id
    const popupContent = event.target.closest('.leaflet-popup-content');
    const input = popupContent ? popupContent.querySelector('.msg-input') : null;
    if (!input || !input.value.trim()) return;

    const msgText = input.value.trim();
    if (!window.featureState.messages[nickname]) window.featureState.messages[nickname] = [];
    window.featureState.messages[nickname].push(msgText);

    // 保存到云端
    await saveInteractData(window.featureState.loves, window.featureState.messages);

    // 成就统计：累计留言数
    const stats = getAchievementStats();
    updateAchievementStats({ messageCount: (stats.messageCount || 0) + 1 });

    input.value = '';

    if (popupContent) {
        const bubble = popupContent.querySelector('.message-bubble');
        if (bubble) {
            const noMsg = bubble.querySelector('span');
            if (noMsg && noMsg.textContent.includes('还没有留言')) noMsg.remove();
            const newMsg = document.createElement('div');
            newMsg.style.cssText = 'font-size:11px; color:#a0a0a0; padding:2px 0; border-bottom:1px solid #333;';
            // textContent 天然安全，防止 XSS
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

    // 成就统计：累计打call次数
    const stats = getAchievementStats();
    updateAchievementStats({ loveCount: (stats.loveCount || 0) + 1 });

    // 爱心飘浮动画
    const heart = document.createElement('div');
    heart.className = 'love-burst';
    heart.textContent = '❤️';
    heart.style.left = (event.clientX - 10) + 'px';
    heart.style.top = (event.clientY - 10) + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);

    // 更新弹窗内计数显示：从按钮向上找弹窗内的 .love-count，避免依赖昵称拼 id
    const popupContent = event.target.closest('.leaflet-popup-content');
    const countEl = popupContent ? popupContent.querySelector('.love-count') : null;
    if (countEl) countEl.textContent = `❤️ ${window.featureState.loves[nickname]}`;

    // 更新地图标记上的角标（Canvas 标记：有打call时放大+变色）
    const markerData = window.featureState.userMarkers.find(m => m.user.nickname === nickname);
    if (markerData) {
        const loveCount = window.featureState.loves[nickname] || 0;
        markerData.marker.setStyle({
            radius: loveCount > 0 ? 6 : 4,
            color: loveCount > 0 ? '#ff69b4' : '#1785fb',
            fillColor: loveCount > 0 ? '#ff69b4' : '#1785fb'
        });
    }
}

/**
 * 获取爱心按钮 HTML
 * @param {string} nickname - 用户昵称
 * @returns {string} HTML
 */
function getLoveHTML(nickname) {
    const count = window.featureState.loves[nickname] || 0;
    // 昵称做 JS 字符串转义，安全嵌入内联事件
    const safeNickJs = escapeJsString(nickname);
    return `
        <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
            <button class="love-btn" onclick="sendLove('${safeNickJs}', event)">
                <i class="fa-solid fa-heart"></i> 打call
            </button>
            <span class="love-count" style="background:rgba(255,20,147,0.15); padding:2px 8px; border-radius:10px;">
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

    // 成就统计：记录最佳得分率（仅当至少答了1题）
    if (total > 0) {
        const rate = score / total;
        const stats = getAchievementStats();
        const bestRate = Math.max(stats.guessBestRate || 0, rate);
        updateAchievementStats({ guessBestRate: bestRate });
    }

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

    // 初始状态：隐藏所有用户标记（Canvas 标记用 opacity 控制）
    let hidden = 0;
    featureState.userMarkers.forEach(({ marker }) => {
        marker.setStyle({ opacity: 0, fillOpacity: 0 });
        hidden++;
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
        marker.setStyle({ opacity: 0.9, fillOpacity: 0.7 });
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
                // Canvas 标记：通过 opacity 控制显示
                marker.setStyle({ opacity: 0.9, fillOpacity: 0.7 });
                newCount++;
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
// 11. 演唱会巡演地图
// ============================================

/**
 * 切换演唱会巡演图层显示
 * 开启时自动定位到巡演分布范围，并弹出巡演选择浮层
 */
function toggleTourMap() {
    const btn = document.getElementById('btn-tour');
    const isOn = btn?.classList.contains('active');

    if (isOn) {
        // 关闭：移除浮层、清除标记和连线
        btn?.classList.remove('active');
        document.querySelector('.tour-panel')?.remove();
        clearTourLayers();
    } else {
        // 开启
        btn?.classList.add('active');
        // 定位到巡演分布范围（以中国为中心）
        if (typeof map !== 'undefined') map.setView([30, 110], 3);
        showTourPanel();
        unlockAchievement('tour_explorer');
    }
}

/**
 * 清除巡演标记和连线
 */
function clearTourLayers() {
    if (typeof map === 'undefined') return;
    window.featureState.tourMarkers?.forEach(m => map.removeLayer(m));
    window.featureState.tourLines?.forEach(l => map.removeLayer(l));
    window.featureState.tourMarkers = [];
    window.featureState.tourLines = [];
}

/**
 * 显示巡演选择浮层，列出所有巡演，点击可定位到对应场次
 */
function showTourPanel() {
    document.querySelector('.tour-panel')?.remove();
    if (typeof concerts === 'undefined') return;

    const tours = getTourNames();
    const panel = document.createElement('div');
    panel.className = 'tour-panel';
    panel.innerHTML = `
        <button class="tour-close-btn" onclick="document.getElementById('btn-tour').click()"><i class="fa-solid fa-xmark"></i></button>
        <h4><i class="fa-solid fa-guitar"></i> 周杰伦巡演地图</h4>
        <p class="tour-tip">点击巡演名，定位到该轮巡演场次</p>
        <div class="tour-list">
            ${tours.map(t => {
                const count = concerts.filter(c => c.tour === t).length;
                const years = concerts.filter(c => c.tour === t).map(c => c.year);
                const yearRange = Math.min(...years) === Math.max(...years)
                    ? Math.min(...years)
                    : `${Math.min(...years)}-${Math.max(...years)}`;
                return `<button class="tour-item" onclick="focusTour('${escapeJsString(t)}')">
                    <span class="tour-name">${escapeHtml(t)}</span>
                    <span class="tour-meta">${yearRange} · ${count}场</span>
                </button>`;
            }).join('')}
        </div>
    `;
    document.getElementById('map').appendChild(panel);
}

/**
 * 定位到指定巡演的所有场次，标记演出地点并注明时间，绘制连接线
 * @param {string} tourName - 巡演名称
 */
function focusTour(tourName) {
    const tourConcerts = concerts.filter(c => c.tour === tourName);
    if (tourConcerts.length === 0) return;

    // 更新巡演列表选中状态：移除其他项的 active，给当前项添加 active
    document.querySelectorAll('.tour-item').forEach(item => {
        const nameEl = item.querySelector('.tour-name');
        item.classList.toggle('active', nameEl && nameEl.textContent === tourName);
    });

    // 清除旧的巡演标记和连线
    clearTourLayers();

    // 按年份顺序排序（同年按城市名）
    const sorted = [...tourConcerts].sort((a, b) => a.year - b.year || a.city.localeCompare(b.city));

    // 为每个场次添加金色脉冲标记 + 永久时间标签 + 详情弹窗
    sorted.forEach((c) => {
        const icon = L.divIcon({
            className: 'concert-marker',
            html: '<div class="concert-dot"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        const marker = L.marker([c.lat, c.lng], { icon })
            .bindTooltip(
                `<div class="concert-label"><span class="concert-year">${c.year}</span> ${escapeHtml(c.city)}</div>`,
                { permanent: true, direction: 'top', offset: [0, -8], className: 'concert-tooltip' }
            )
            .bindPopup(`
                <div style="text-align:center; min-width:160px;">
                    <h3 style="margin:0 0 6px; color:#f59e0b; font-size:14px;">${escapeHtml(c.tour)}</h3>
                    <p style="margin:2px 0; color:#fff; font-size:14px;"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(c.city)}</p>
                    <p style="margin:2px 0; color:#a0a0a0; font-size:12px;">${escapeHtml(c.venue)}</p>
                    <p style="margin:4px 0 0; color:#fbbf24; font-size:13px;"><i class="fa-solid fa-calendar"></i> ${c.year}年</p>
                </div>
            `, { maxWidth: 220 })
            .addTo(map);

        window.featureState.tourMarkers.push(marker);
    });

    // 按年份顺序用虚线连接各场次
    for (let i = 0; i < sorted.length - 1; i++) {
        const line = L.polyline(
            [[sorted[i].lat, sorted[i].lng], [sorted[i + 1].lat, sorted[i + 1].lng]],
            { color: '#f59e0b', weight: 2, opacity: 0.6, dashArray: '6 6', className: 'tour-line' }
        ).addTo(map);
        window.featureState.tourLines.push(line);
    }

    // 自动缩放视野到所有场次范围
    if (window.featureState.tourMarkers.length > 0) {
        const group = L.featureGroup(window.featureState.tourMarkers);
        map.fitBounds(group.getBounds().pad(0.3));
    }
}

// ============================================
// 12. 成就勋章系统
// ============================================

/**
 * 成就定义表
 * id: 唯一标识；name: 名称；desc: 描述；icon: 图标（emoji）
 * check: (stats) => boolean，根据统计数据判断是否解锁
 */
const ACHIEVEMENTS = [
    { id: 'first_visit', name: '初来乍到', desc: '访问歌迷地图', icon: '👋', check: () => true },
    { id: 'join', name: '点亮坐标', desc: '加入杰迷网络', icon: '📍', check: s => s.joined },
    { id: 'love_1', name: '应援新星', desc: '为歌迷打call 1 次', icon: '💖', check: s => s.loveCount >= 1 },
    { id: 'love_10', name: '应援达人', desc: '累计打call 10 次', icon: '🔥', check: s => s.loveCount >= 10 },
    { id: 'message', name: '留言先锋', desc: '留下第一条留言', icon: '✍️', check: s => s.messageCount >= 1 },
    { id: 'connect', name: '牵线搭桥', desc: '使用歌迷连线功能', icon: '🔗', check: s => s.usedConnect },
    { id: 'nearest', name: '寻友雷达', desc: '查看附近歌迷', icon: '📡', check: s => s.usedNearest },
    { id: 'heatmap', name: '热力观察者', desc: '开启歌迷热力图', icon: '🌡️', check: s => s.usedHeatmap },
    { id: 'guess_pass', name: '歌词达人', desc: '猜歌得分率 ≥ 60%', icon: '🎮', check: s => s.guessBestRate >= 0.6 },
    { id: 'guess_perfect', name: '歌神', desc: '猜歌全部答对', icon: '👑', check: s => s.guessBestRate >= 1 },
    { id: 'timeline', name: '时光旅人', desc: '使用时光轴回放', icon: '⏳', check: s => s.usedTimeline },
    { id: 'tour_explorer', name: '巡演追随者', desc: '查看演唱会巡演地图', icon: '🎸', check: s => s.usedTour },
    { id: 'theme', name: '变色龙', desc: '切换季节主题', icon: '🎨', check: s => s.usedTheme }
];

/** localStorage 键名 */
const ACH_KEY = 'fans_achievements';
const ACH_STATS_KEY = 'fans_achievement_stats';

/**
 * 读取成就解锁记录
 * @returns {Object} { 成就id: 解锁时间戳 }
 */
function getAchievements() {
    try {
        return JSON.parse(localStorage.getItem(ACH_KEY) || '{}');
    } catch { return {}; }
}

/**
 * 读取成就统计数据
 * @returns {Object} 统计数据
 */
function getAchievementStats() {
    try {
        return JSON.parse(localStorage.getItem(ACH_STATS_KEY) || '{}');
    } catch { return {}; }
}

/**
 * 保存成就统计数据
 * @param {Object} stats - 统计数据
 */
function saveAchievementStats(stats) {
    localStorage.setItem(ACH_STATS_KEY, JSON.stringify(stats));
}

/**
 * 更新成就统计字段并尝试解锁
 * @param {Object} patch - 需要合并更新的字段
 */
function updateAchievementStats(patch) {
    const stats = { ...getAchievementStats(), ...patch };
    saveAchievementStats(stats);
    // 自动检查所有成就是否解锁
    ACHIEVEMENTS.forEach(a => {
        if (!getAchievements()[a.id] && a.check(stats)) {
            unlockAchievement(a.id);
        }
    });
}

/**
 * 解锁指定成就（若尚未解锁），并弹出提示
 * @param {string} id - 成就 id
 */
function unlockAchievement(id) {
    const ach = getAchievements();
    if (ach[id]) return; // 已解锁
    const def = ACHIEVEMENTS.find(a => a.id === id);
    if (!def) return;
    ach[id] = Date.now();
    localStorage.setItem(ACH_KEY, JSON.stringify(ach));
    showAchievementToast(def);
}

/**
 * 显示成就解锁提示
 * @param {Object} def - 成就定义
 */
function showAchievementToast(def) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <div class="ach-toast-icon">${def.icon}</div>
        <div class="ach-toast-body">
            <div class="ach-toast-title">🏆 成就解锁</div>
            <div class="ach-toast-name">${def.name}</div>
            <div class="ach-toast-desc">${def.desc}</div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

/**
 * 显示成就勋章墙弹窗
 */
function showAchievementWall() {
    document.querySelector('.achievement-wall')?.remove();
    const unlocked = getAchievements();
    const total = ACHIEVEMENTS.length;
    const unlockedCount = Object.keys(unlocked).length;

    const wall = document.createElement('div');
    wall.className = 'achievement-wall';
    wall.innerHTML = `
        <button class="ach-wall-close" onclick="this.closest('.achievement-wall').remove()"><i class="fa-solid fa-xmark"></i></button>
        <h3><i class="fa-solid fa-trophy"></i> 成就勋章墙</h3>
        <div class="ach-progress">已解锁 ${unlockedCount} / ${total}</div>
        <div class="ach-progress-bar"><div class="ach-progress-fill" style="width:${(unlockedCount / total * 100).toFixed(0)}%"></div></div>
        <div class="ach-grid">
            ${ACHIEVEMENTS.map(a => {
                const isUnlocked = !!unlocked[a.id];
                return `<div class="ach-item ${isUnlocked ? 'unlocked' : 'locked'}" title="${escapeHtml(a.desc)}">
                    <div class="ach-icon">${isUnlocked ? a.icon : '🔒'}</div>
                    <div class="ach-name">${escapeHtml(a.name)}</div>
                    <div class="ach-desc">${escapeHtml(a.desc)}</div>
                </div>`;
            }).join('')}
        </div>
    `;
    document.body.appendChild(wall);
    // 点击遮罩关闭
    wall.addEventListener('click', (e) => {
        if (e.target === wall) wall.remove();
    });
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
    document.getElementById('btn-connect')?.addEventListener('click', () => {
        toggleConnectionMode();
        if (window.featureState.connectionMode) updateAchievementStats({ usedConnect: true });
    });
    document.getElementById('btn-nearest')?.addEventListener('click', () => {
        toggleNearestFans();
        if (window.featureState.nearestHighlight.length > 0) updateAchievementStats({ usedNearest: true });
    });
    document.getElementById('btn-heatmap')?.addEventListener('click', () => {
        toggleHeatmap();
        if (window.featureState.heatmapLayer) updateAchievementStats({ usedHeatmap: true });
    });
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
    document.getElementById('btn-timeline')?.addEventListener('click', () => {
        toggleTimeline();
        if (window.featureState.timelineActive) updateAchievementStats({ usedTimeline: true });
    });

    // 巡演地图按钮
    document.getElementById('btn-tour')?.addEventListener('click', toggleTourMap);

    // 成就勋章墙按钮
    document.getElementById('btn-achievement')?.addEventListener('click', showAchievementWall);

    // 季节主题按钮
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            switchTheme(dot.dataset.theme);
            updateAchievementStats({ usedTheme: true });
        });
    });

    // 首次访问解锁「初来乍到」
    unlockAchievement('first_visit');

    // 若用户曾加入过（通过 localStorage 标记），解锁「点亮坐标」
    if (localStorage.getItem('fans_joined') === '1') {
        updateAchievementStats({ joined: true });
    }
}

window.addEventListener('DOMContentLoaded', initFeatures);
