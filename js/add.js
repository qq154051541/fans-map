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
const avatarPreview = document.getElementById('avatar-preview');
const fileName = document.getElementById('file-name');

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
        avatarPreview.innerHTML = `<span style="font-size: 24px;">${emoji}</span>`;
        // 清除文件输入
        avatarUpload.value = '';
        fileName.textContent = '';
    });
});

// 2. 文件上传
avatarUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // 检查大小 (10MB = 1024 * 1024 * 10 bytes)
    if (file.size > 1024 * 1024 * 10) {
        // 检查 Swal 是否存在
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '图片过大',
                text: '图片大小不能超过 10MB！',
                icon: 'warning',
                confirmButtonText: '确定',
                background: '#1e1e1e',
                color: '#fff'
            });
        } else {
            alert('图片大小不能超过 10MB！');
        }
        this.value = ''; // 清空
        return;
    }

    fileName.textContent = file.name;
    fileName.style.color = 'var(--text-secondary)'; // 重置颜色
    
    // 预览图片 (前端预览，尚未上传)
    const reader = new FileReader();
    reader.onload = function(event) {
        avatarPreview.innerHTML = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
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

    // --- 服务器上传逻辑 ---
    async function uploadToServer(fileInput, nickname, avatarValue, lat, lng) {
        // 默认头像列表
        const defaultAvatars = ['👨‍💻', '👩‍💻', '🚀', '🤖', '🦊', '🐱', '🐼', '⚡', '🎸', '🎤', '🎨', '✨'];
        
        // 1. 上传图片 (如果有)
        if (avatarValue === 'PENDING_UPLOAD' && fileInput.files[0]) {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            
            try {
                const res = await fetch('upload.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await res.json();
                if (!res.ok || (data.error && data.error.length > 0)) {
                    // 上传失败，随机选择一个默认头像
                    console.warn('图片上传失败，使用默认头像:', data.error);
                    avatarValue = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
                } else {
                    avatarValue = data.url; // 获取服务器返回的URL
                }
            } catch (error) {
                // 网络错误或其他异常，随机选择一个默认头像
                console.warn('图片上传失败，使用默认头像:', error.message);
                avatarValue = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
            }
        }

        // 2. 保存用户数据
        const newUser = {
            nickname,
            avatar: avatarValue,
            lat,
            lng,
            timestamp: new Date().getTime()
        };

        const res = await fetch('save_user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        if (!res.ok) throw new Error('数据保存失败');
        
        return { newUser, avatarValue };
    }

    // 尝试服务器上传
    try {
        const result = await uploadToServer(fileInput, nickname, avatarValue, lat, lng);
        
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
