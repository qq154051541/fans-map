// 初始化地图
const map = L.map('picker-map', {
    zoomControl: false,
    attributionControl: false
}).setView([34.3416, 108.9398], 3);

// 加载高德深色底图
L.tileLayer('https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7', {
    subdomains: '1234',
    maxZoom: 18,
    className: 'dark-filter'
}).addTo(map);

// 选点标记
let currentMarker = null;

// 更新位置信息的辅助函数
function updateLocation(lat, lng) {
    // 更新隐藏表单域
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;
    
    // 更新显示的文本
    document.getElementById('location-text').textContent = `已选择: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    document.getElementById('location-text').style.color = '#4ade80';

    // 更新地图标记
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }
    
    currentMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color: #1785fb; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px #1785fb;'></div>",
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        })
    }).addTo(map);

    map.setView([lat, lng], 10);
}

// 尝试获取当前定位
if ("geolocation" in navigator) {
    document.getElementById('location-text').textContent = "正在获取当前定位...";
    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        updateLocation(lat, lng);
    }, function(error) {
        console.warn("定位失败:", error);
        document.getElementById('location-text').textContent = "定位失败，请点击地图选择";
    });
}

// 点击地图选点
map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    updateLocation(lat, lng);
});

// 头像选择逻辑
const avatarOptions = document.querySelectorAll('.avatar-option');
const avatarInput = document.getElementById('avatar');
const avatarUpload = document.getElementById('avatar-upload');
const avatarUploadBox = document.getElementById('avatar-upload-box');
const avatarPreview = document.getElementById('avatar-preview');

// 点击上传区域触发文件选择
avatarUploadBox?.addEventListener('click', () => {
    avatarUpload.click();
});

// 1. Emoji 选择
avatarOptions.forEach(option => {
    option.addEventListener('click', () => {
        // 移除其他选中状态
        avatarOptions.forEach(opt => opt.classList.remove('selected'));
        // 选中当前
        option.classList.add('selected');
        // 更新 input 值
        const emoji = option.dataset.val;
        avatarInput.value = emoji;
        // 更新预览
        avatarPreview.innerHTML = `<span style="font-size: 28px;">${emoji}</span>`;
        avatarPreview.classList.add('has-avatar');
        // 清除文件输入
        avatarUpload.value = '';
    });
});

// 2. 文件上传
avatarUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // 检查大小 (2MB，上传后会压缩为缩略图)
    if (file.size > 1024 * 1024 * 2) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '图片过大',
                text: '图片大小不能超过 2MB！',
                icon: 'warning',
                confirmButtonText: '确定',
                background: '#1e1e1e',
                color: '#fff'
            });
        } else {
            alert('图片大小不能超过 2MB！');
        }
        this.value = '';
        return;
    }
    
    // 预览图片
    const reader = new FileReader();
    reader.onload = function(event) {
        avatarPreview.innerHTML = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
        avatarPreview.classList.add('has-avatar');
    };
    reader.readAsDataURL(file);

    // 移除 Emoji 的选中状态
    avatarOptions.forEach(opt => opt.classList.remove('selected'));
    
    // 清空 avatarInput，标记为待上传
    avatarInput.value = 'PENDING_UPLOAD'; 
});

// 默认选中第一个头像 (如果还没值)
if (!avatarInput.value && avatarOptions.length > 0) {
    avatarOptions[0].click();
}

// 表单提交
document.getElementById('join-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nickname = document.getElementById('nickname').value;
    let avatarValue = document.getElementById('avatar').value;
    const lat = parseFloat(document.getElementById('lat').value);
    const lng = parseFloat(document.getElementById('lng').value);
    const fileInput = document.getElementById('avatar-upload');

    if (!lat || !lng) {
        // 检查 Swal 是否存在
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '请选择位置',
                text: '请在地图上点击选择你的位置！',
                icon: 'warning',
                confirmButtonText: '确定',
                background: '#1e1e1e',
                color: '#fff',
                confirmButtonColor: '#1785fb'
            });
        } else {
            alert('请在地图上点击选择你的位置！');
        }
        return;
    }

    // 检查配置是否完整
    if (!CONFIG.INDEX_ID) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '配置错误',
                text: '请在 js/config.js 中配置 gongju.dev 的 INDEX_ID',
                icon: 'error',
                confirmButtonText: '确定',
                background: '#1e1e1e',
                color: '#fff'
            });
        } else {
            alert('请在 js/config.js 中配置 JSONBin.io 的 API_KEY 和 BIN_ID');
        }
        return;
    }

    // 默认头像列表
    const defaultAvatars = ['👨‍💻', '👩‍💻', '🚀', '🤖', '🦊', '🐱', '🐼', '⚡', '🎸', '🎤', '🎨', '✨'];

    /**
     * 将上传的图片压缩为缩略图后转为 Base64 Data URL
     * 压缩为 48x48 像素的 JPEG，控制体积在 2-3KB 左右
     * @param {File} file - 用户上传的图片文件
     * @returns {Promise<string>} 压缩后的 Base64 Data URL 字符串
     */
    function compressAndEncodeImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // 创建 canvas 进行缩放压缩
                    const canvas = document.createElement('canvas');
                    const size = 48; // 缩略图尺寸
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    // 居中裁剪为正方形
                    const minSide = Math.min(img.width, img.height);
                    const sx = (img.width - minSide) / 2;
                    const sy = (img.height - minSide) / 2;
                    ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
                    // 输出为 JPEG，质量 0.7，体积约 2-3KB
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * 保存用户数据到 gongju.dev（支持多批次）
     * 读取最后一个批次 → 追加新用户 → 检查大小 → 未满则整体 POST，满了则创建新批次
     * @param {string} nickname - 昵称
     * @param {string} avatarValue - 头像值（Emoji 或 Base64）
     * @param {number} lat - 纬度
     * @param {number} lng - 经度
     */
    async function saveToJSONBin(nickname, avatarValue, lat, lng) {
        // 先加载索引，获取所有数据批次 ID
        await loadBinIndex();
        const activeId = getActiveBinId();

        // 1. 读取最后一个批次的数据
        const readRes = await fetch(`${CONFIG.API_BASE}/${activeId}`);
        if (!readRes.ok) throw new Error('读取数据失败');
        const currentData = await readRes.json();
        const users = Array.isArray(currentData) ? currentData : [];

        // 2. 构造新用户数据
        const newUser = {
            nickname,
            avatar: avatarValue,
            lat,
            lng,
            timestamp: new Date().getTime()
        };

        // 3. 追加新用户
        users.push(newUser);

        // 4. 检查数据大小
        const dataSize = new Blob([JSON.stringify(users)]).size;

        if (dataSize > CONFIG.BATCH_SIZE_LIMIT) {
            // 当前批次已满，创建新批次只含新用户
            console.log(`当前批次已满 (${(dataSize / 1024).toFixed(1)}KB)，创建新批次...`);
            const newId = await saveDataToCloud([newUser]);
            CONFIG.DATA_IDS.push(newId);
            await updateIndex();
        } else {
            // 未满，整体 POST 更新当前批次
            const newId = await saveDataToCloud(users);
            // 替换最后一个批次 ID
            CONFIG.DATA_IDS[CONFIG.DATA_IDS.length - 1] = newId;
            await updateIndex();
        }

        return newUser;
    }

    // 处理头像：如果是上传的图片，转为 Base64
    // 显示 loading 提示
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 提交中...';

    try {
        if (avatarValue === 'PENDING_UPLOAD' && fileInput.files[0]) {
            // 将图片压缩为缩略图后转为 Base64 存储
            avatarValue = await compressAndEncodeImage(fileInput.files[0]);
        }

        // 保存到 JSONBin.io
        await saveToJSONBin(nickname, avatarValue, lat, lng);

        // 标记已加入，供成就系统解锁「点亮坐标」
        localStorage.setItem('fans_joined', '1');

        // 检查 Swal 是否存在
        if (typeof Swal !== 'undefined') {
            await Swal.fire({
                title: '保存成功！',
                text: '您已成功加入周杰伦歌迷大家庭',
                icon: 'success',
                confirmButtonText: '查看地图',
                background: '#1e1e1e',
                color: '#fff',
                confirmButtonColor: '#1785fb'
            });
        } else {
            alert('保存成功！您已成功加入周杰伦歌迷大家庭');
        }
        
        window.location.href = 'index.html';
    } catch (e) {
        console.error('保存失败:', e);
        
        // 恢复按钮状态
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // 检查 Swal 是否存在
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '保存失败',
                text: e.message || '服务器连接异常',
                icon: 'error',
                confirmButtonText: '确定',
                background: '#1e1e1e',
                color: '#fff'
            });
        } else {
            alert('保存失败: ' + (e.message || '服务器连接异常'));
        }
    }
});
