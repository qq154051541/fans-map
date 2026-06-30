/**
 * 像素画生成模块（照片马赛克）
 * 功能：点击地区歌迷会标记后，用该地区所有歌迷的头像拼成周杰伦专辑封面，
 *       头像不够时随机重复使用，远看是专辑封面，近看是歌迷头像
 */

// ============================================
// 专辑封面预设（16张录音室专辑）
// cover 指向 imgs/albums/ 下的真实封面图片
// colors/accent 用于图片加载失败时的渐变兜底
// ============================================
const ALBUM_COVERS = [
    { name: 'Jay', subtitle: 'Jay (2000)', cover: 'imgs/albums/jay.webp', colors: ['#3a1a00', '#8b4513', '#cd853f'], accent: '#ffd700' },
    { name: '范特西', subtitle: 'Fantasy (2001)', cover: 'imgs/albums/fantasy.webp', colors: ['#1a0033', '#4a148c', '#880e4f'], accent: '#ffd700' },
    { name: '八度空间', subtitle: 'The Eight Dimensions (2002)', cover: 'imgs/albums/eight-dimensions.webp', colors: ['#1a1a2e', '#16213e', '#0f3460'], accent: '#e94560' },
    { name: '叶惠美', subtitle: 'Yeh Hui-Mei (2003)', cover: 'imgs/albums/yeh-hui-mei.webp', colors: ['#2c1810', '#5d4037', '#8d6e63'], accent: '#ffb74d' },
    { name: '七里香', subtitle: 'Common Jasmin Orange (2004)', cover: 'imgs/albums/common-jasmin.webp', colors: ['#0d2818', '#1b5e20', '#2e7d32'], accent: '#a5d6a7' },
    { name: '十一月的萧邦', subtitle: "November's Chopin (2005)", cover: 'imgs/albums/novembers-chopin.webp', colors: ['#1a1a1a', '#3c3c3c', '#5c5c5c'], accent: '#cfd8dc' },
    { name: '依然范特西', subtitle: 'Still Fantasy (2006)', cover: 'imgs/albums/still-fantasy.webp', colors: ['#1a0033', '#311b92', '#5e35b1'], accent: '#b39ddb' },
    { name: '我很忙', subtitle: 'On the Run (2007)', cover: 'imgs/albums/on-the-run.webp', colors: ['#0d1b0d', '#1b3a1b', '#3d6b3d'], accent: '#aed581' },
    { name: '魔杰座', subtitle: 'Capricorn (2008)', cover: 'imgs/albums/capricorn.webp', colors: ['#1a0d2e', '#4a148c', '#6a1b9a'], accent: '#ce93d8' },
    { name: '跨时代', subtitle: 'The Era (2010)', cover: 'imgs/albums/the-era.jpg', colors: ['#0a0a1a', '#1a237e', '#283593'], accent: '#7986cb' },
    { name: '惊叹号', subtitle: 'Exclamation Mark (2011)', cover: 'imgs/albums/exclamation.webp', colors: ['#1a0000', '#b71c1c', '#d32f2f'], accent: '#ff8a80' },
    { name: '十二新作', subtitle: 'Opus 12 (2012)', cover: 'imgs/albums/opus-12.webp', colors: ['#0d1f1f', '#004d40', '#00695c'], accent: '#80cbc4' },
    { name: '哎呦，不错哦', subtitle: 'Aiyo, Not Bad (2014)', cover: 'imgs/albums/aiyo-not-bad.webp', colors: ['#1a1a0d', '#33691e', '#558b2f'], accent: '#c5e1a5' },
    { name: '床边故事', subtitle: 'Bedtime Stories (2016)', cover: 'imgs/albums/bedtime-stories.webp', colors: ['#0a0a1a', '#1a237e', '#283593'], accent: '#9fa8da' },
    { name: '最伟大的作品', subtitle: 'Greatest Works of Art (2022)', cover: 'imgs/albums/greatest-works.webp', colors: ['#1a0d0d', '#5d4037', '#8d6e63'], accent: '#d7ccc8' },
    { name: '太阳之子', subtitle: 'Son of the Sun (2026)', cover: 'imgs/albums/son-of-sun.webp', colors: ['#1a0d00', '#e65100', '#ff6f00'], accent: '#ffcc80' } 
];

// 当前选中的专辑索引
let currentAlbumIndex = 0;

/**
 * 根据 hub 名称查找属于该 hub 的所有用户
 * 使用与 script.js 相同的"最近 hub"算法归类
 * @param {string} hubName - 歌迷会名称
 * @returns {Array} 属于该地区的用户数组
 */
function getUsersByHub(hubName) {
    const hub = hubs.find(h => h.name === hubName);
    if (!hub) return [];
    return featureState.users.filter(user => {
        let minD = Infinity;
        let nearestHub = null;
        for (const h of hubs) {
            const d = (user.lat - h.lat) ** 2 + (user.lng - h.lng) ** 2;
            if (d < minD) { minD = d; nearestHub = h; }
        }
        return nearestHub && nearestHub.name === hubName;
    });
}

/**
 * 加载专辑封面图片
 * @param {Object} album - 专辑预设
 * @returns {Promise<HTMLImageElement|null>} 封面图片，加载失败返回 null
 */
function loadAlbumCover(album) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = album.cover;
    });
}

/**
 * 在 canvas 上绘制专辑封面背景
 * 优先使用真实封面图片，加载失败时用渐变兜底
 * @param {CanvasRenderingContext2D} ctx - canvas 2D 上下文
 * @param {number} size - canvas 尺寸（正方形）
 * @param {HTMLImageElement|null} coverImg - 封面图片，为 null 时使用渐变兜底
 * @param {Object} album - 专辑封面预设
 */
function drawAlbumBackground(ctx, size, coverImg, album) {
    if (coverImg) {
        // 绘制真实封面图片，铺满整个 canvas
        ctx.drawImage(coverImg, 0, 0, size, size);
        return;
    }
    // 兜底：图片加载失败时绘制多段渐变背景
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, album.colors[0]);
    gradient.addColorStop(0.5, album.colors[1]);
    gradient.addColorStop(1, album.colors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // 绘制装饰性光晕
    const glowGradient = ctx.createRadialGradient(size * 0.7, size * 0.3, 0, size * 0.7, size * 0.3, size * 0.5);
    glowGradient.addColorStop(0, album.accent + '55');
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, size, size);

    // 绘制副标题
    ctx.fillStyle = album.accent + 'dd';
    ctx.font = `${size * 0.035}px "Microsoft YaHei", sans-serif`;
    ctx.fillText(album.subtitle, size / 2, size * 0.52);

    // 绘制装饰圆环
    ctx.strokeStyle = album.accent + '33';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(size / 2, size * 0.4, size * 0.25, 0, Math.PI * 2);
    ctx.stroke();
}

/**
 * 加载单个头像图片
 * 支持 data:URL、http(s) URL、emoji 文字
 * @param {Object} user - 用户对象
 * @returns {Promise<{img?:HTMLImageElement, emoji?:string, type:string}>} 头像数据
 */
function loadAvatar(user) {
    return new Promise((resolve) => {
        const avatar = user.avatar;
        if (avatar && (avatar.startsWith('data:') || avatar.startsWith('http'))) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve({ img, type: 'image' });
            img.onerror = () => resolve({ emoji: '👤', type: 'emoji' });
            img.src = avatar;
        } else {
            resolve({ emoji: avatar || '👤', type: 'emoji' });
        }
    });
}

/**
 * 获取 canvas 指定区域的平均颜色
 * @param {CanvasRenderingContext2D} ctx - canvas 2D 上下文
 * @param {number} x - 区域左上角 x
 * @param {number} y - 区域左上角 y
 * @param {number} w - 区域宽度
 * @param {number} h - 区域高度
 * @returns {{r:number, g:number, b:number}} RGB 颜色对象
 */
function getAverageColor(ctx, x, y, w, h) {
    const data = ctx.getImageData(x, y, w, h).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
    }
    return {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count)
    };
}

/**
 * 计算头像的平均颜色
 * 将头像缩放到小尺寸后取像素平均值，用于照片马赛克颜色匹配
 * @param {Object} avatarData - 头像数据
 * @returns {{r:number, g:number, b:number}} 平均 RGB 颜色
 */
function getAvatarAverageColor(avatarData) {
    const sample = 8;
    const tmp = document.createElement('canvas');
    tmp.width = sample;
    tmp.height = sample;
    const tctx = tmp.getContext('2d');
    if (avatarData.type === 'image') {
        tctx.drawImage(avatarData.img, 0, 0, sample, sample);
        return getAverageColor(tctx, 0, 0, sample, sample);
    }
    // emoji 文字头像：用中间灰色近似（实际绘制时叠加在封面底色上，颜色由底色决定）
    return { r: 128, g: 128, b: 128 };
}

/**
 * 从预取的整张像素数据中计算指定网格区块的平均颜色
 * 避免逐格调用 getImageData，大幅提升马赛克生成性能
 * @param {number} col - 列索引
 * @param {number} row - 行索引
 * @param {number} cellSize - 每格像素尺寸
 * @param {Uint8ClampedArray} data - 整张封面的像素数据
 * @param {number} canvasSize - 画布总尺寸
 * @returns {{r:number, g:number, b:number}} 平均 RGB 颜色
 */
function getCellAverageColor(col, row, cellSize, data, canvasSize) {
    let r = 0, g = 0, b = 0, count = 0;
    const startX = Math.floor(col * cellSize);
    const startY = Math.floor(row * cellSize);
    const endX = Math.min(Math.floor((col + 1) * cellSize), canvasSize);
    const endY = Math.min(Math.floor((row + 1) * cellSize), canvasSize);
    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const idx = (y * canvasSize + x) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
        }
    }
    return { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) };
}

/**
 * 计算两个 RGB 颜色的欧氏距离
 * @param {{r,g,b}} c1 - 颜色1
 * @param {{r,g,b}} c2 - 颜色2
 * @returns {number} 颜色距离（越小越接近）
 */
function colorDistance(c1, c2) {
    return Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2);
}

/**
 * 从头像池中找出平均颜色最接近目标颜色的头像
 * 在距离最小的前若干个中随机选取，避免重复使用同一头像导致单调
 * @param {Array} avatars - 头像数据数组（每项含 avgColor 字段）
 * @param {{r,g,b}} targetColor - 目标颜色
 * @returns {Object} 最匹配的头像数据
 */
function findClosestAvatar(avatars, targetColor) {
    const ranked = avatars.map(a => ({ avatar: a, dist: colorDistance(a.avgColor, targetColor) }));
    ranked.sort((a, b) => a.dist - b.dist);
    // 在距离最小的前 20%（至少 3 个）中随机选一个，增加多样性
    const poolSize = Math.max(3, Math.ceil(ranked.length * 0.2));
    const idx = Math.floor(Math.random() * Math.min(poolSize, ranked.length));
    return ranked[idx].avatar;
}

/**
 * 在指定位置绘制单个头像
 * @param {CanvasRenderingContext2D} ctx - canvas 2D 上下文
 * @param {Object} avatarData - 头像数据
 * @param {number} x - 左上角 x 坐标
 * @param {number} y - 左上角 y 坐标
 * @param {number} size - 像素尺寸
 */
function drawAvatarCell(ctx, avatarData, x, y, size) {
    if (avatarData.type === 'image') {
        ctx.drawImage(avatarData.img, x, y, size, size);
    } else {
        // emoji 文字头像：只画 emoji 文字，不画背景（让封面底色透出，不被深色块覆盖）
        ctx.fillStyle = '#fff';
        ctx.font = `${size * 0.6}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(avatarData.emoji, x + size / 2, y + size / 2);
    }
}

/**
 * 生成照片马赛克像素画并显示在模态框中
 * 用歌迷头像铺满整个专辑封面，头像不够时随机重复使用
 * 远看是专辑封面，近看是歌迷头像
 * @param {string} hubName - 歌迷会名称
 */
async function generatePixelArt(hubName) {
    const users = getUsersByHub(hubName);
    if (users.length === 0) {
        Swal.fire({ title: '暂无歌迷', text: `${hubName} 还没有歌迷数据`, icon: 'info' });
        return;
    }

    // 显示加载提示
    Swal.fire({
        title: '正在生成像素画...',
        text: `用 ${users.length} 位歌迷头像拼成专辑封面`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    const album = ALBUM_COVERS[currentAlbumIndex];
    const canvasSize = 720;
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');

    // 1. 加载真实专辑封面图片
    const coverImg = await loadAlbumCover(album);

    // 2. 在离屏 canvas 上绘制专辑封面背景（用于取色）
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = canvasSize;
    bgCanvas.height = canvasSize;
    const bgCtx = bgCanvas.getContext('2d');
    drawAlbumBackground(bgCtx, canvasSize, coverImg, album);

    // 2. 计算网格：网格越密，远看越能还原专辑封面图案（头像不够时随机复用）
    const gridSize = users.length >= 1024 ? 48 : users.length >= 576 ? 42 : users.length >= 256 ? 36 : 32;
    const cellSize = canvasSize / gridSize;

    // 3. 并行加载所有头像
    const avatarPromises = users.map(u => loadAvatar(u));
    const avatars = await Promise.all(avatarPromises);

    // 3.5 预计算每个头像的平均颜色，用于照片马赛克颜色匹配
    avatars.forEach(a => { a.avgColor = getAvatarAverageColor(a); });

    // 3.6 一次性获取整个专辑封面的像素数据，避免逐格调用 getImageData
    const bgData = bgCtx.getImageData(0, 0, canvasSize, canvasSize).data;

    // 4. 先绘制完整专辑封面作为背景（保留封面细节图案，不只是色块）
    drawAlbumBackground(ctx, canvasSize, coverImg, album);

    // 5. 逐格叠加半透明头像：近看可见歌迷头像，远看保留专辑封面图案
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const x = col * cellSize;
            const y = row * cellSize;

            // 从预取像素数据中计算该区块的平均颜色，用于匹配头像
            const targetColor = getCellAverageColor(col, row, cellSize, bgData, canvasSize);

            // 匹配颜色最接近的头像，让头像与封面该区域色调协调
            const avatarData = findClosestAvatar(avatars, targetColor);

            // 半透明绘制头像（叠加在完整封面上，近看可见头像不破坏封面图案）
            ctx.globalAlpha = 0.4;
            drawAvatarCell(ctx, avatarData, x, y, cellSize);
            ctx.globalAlpha = 1;
        }
    }

    // 5. 顶部叠加专辑标题（半透明遮罩 + 文字）
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    // ctx.fillRect(0, canvasSize * 0.28, canvasSize, canvasSize * 0.2);
    // ctx.fillStyle = album.accent;
    // ctx.font = `bold ${canvasSize * 0.08}px "Microsoft YaHei", sans-serif`;
    // ctx.textAlign = 'center';
    // ctx.textBaseline = 'middle';
    // ctx.shadowColor = 'rgba(0,0,0,0.9)';
    // ctx.shadowBlur = 15;
    // ctx.fillText(`《${album.name}》`, canvasSize / 2, canvasSize * 0.36);
    // ctx.shadowBlur = 0;

    // 6. 绘制底部信息栏（左中右三栏展示）
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, canvasSize - 60, canvasSize, 60);
    // 左：地区歌迷信息
    ctx.fillStyle = album.accent + 'cc';
    ctx.font = `15px "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${hubName} · ${users.length} 位歌迷`, 20, canvasSize - 30);
    // 中：专辑名称（大字）
    ctx.fillStyle = album.accent;
    ctx.font = `bold ${canvasSize * 0.06}px "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 30;
    ctx.fillText(album.name, canvasSize / 2, canvasSize - 30);
    ctx.shadowBlur = 0;
    // 右：周杰伦歌迷地图
    ctx.fillStyle = album.accent + 'cc';
    ctx.font = `15px "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(`周杰伦歌迷地图`, canvasSize - 20, canvasSize - 30);

    // 7. 显示结果
    const dataURL = canvas.toDataURL('image/png');
    showPixelArtModal(dataURL, hubName, users.length, album.name);
}

/**
 * 显示像素画模态框
 * @param {string} dataURL - canvas 生成的图片 data URL
 * @param {string} hubName - 歌迷会名称
 * @param {number} userCount - 歌迷人数
 * @param {string} albumName - 专辑名称
 */
function showPixelArtModal(dataURL, hubName, userCount, albumName) {
    // 构建专辑选择按钮
    const albumOptions = ALBUM_COVERS.map((a, i) =>
        `<button class="pa-album-btn ${i === currentAlbumIndex ? 'active' : ''}" data-index="${i}">${a.name}</button>`
    ).join('');

    Swal.fire({
        title: `${hubName} · 像素画`,
        html: `
            <div class="pa-modal-content">
                <img src="${dataURL}" class="pa-result-img" alt="像素画" />
                <div class="pa-info">${userCount} 位歌迷头像拼成《${albumName}》</div>
                <div class="pa-album-selector">
                    <span class="pa-label">切换专辑：</span>
                    ${albumOptions}
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-download"></i> 保存图片',
        cancelButtonText: '关闭',
        width: 'min(600px, 95vw)',
        customClass: {
            popup: 'pa-swal-popup',
            confirmButton: 'pa-btn-download',
            cancelButton: 'pa-btn-close'
        },
        didOpen: () => {
            // 绑定专辑切换
            document.querySelectorAll('.pa-album-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    currentAlbumIndex = parseInt(btn.dataset.index, 10);
                    Swal.close();
                    generatePixelArt(hubName);
                });
            });
        },
        preConfirm: () => {
            // 触发下载
            const link = document.createElement('a');
            link.download = `${hubName}_像素画_${albumName}.png`;
            link.href = dataURL;
            link.click();
            return false; // 不关闭弹窗
        }
    });
}
