/**
 * 弹幕功能模块
 * 包含弹幕配置、创建、发送和初始化功能
 */

// 弹幕功能配置
const danmakuConfig = {
    // 容器配置
    containerId: 'danmaku-container',
    danmakuClass: 'danmaku',

    // 开关
    enabled: true,

    // 发送配置
    minInterval: 1000,  // 最小发送间隔（毫秒）
    maxInterval: 2000,  // 最大发送间隔（毫秒）

    // 动画配置
    minDuration: 20,     // 最小动画持续时间（秒）
    maxDuration: 30,    // 最大动画持续时间（秒）
    speedMultiplier: 1.0, // 速度倍率（1.0 为默认）

    // 样式配置
    colors: ['#ffffff', '#ff69b4', '#1785fb', '#4ade80', '#f59e0b', '#8b5cf6'],
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(2px)',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
    opacity: 0.8,       // 整体透明度

    // 位置配置
    verticalRange: 0.9,  // 垂直方向占用比例（0-1）

    // 歌词库（周杰伦耳熟能详的经典歌词）
    lyrics: [
        // === 晴天 ===
        "故事的小黄花，从出生那年就飘着",
        "童年的荡秋千，随记忆一直晃到现在",
        "刮风这天，我试过握着你手",
        "但偏偏，雨渐渐，大到我看你不见",
        "从前从前，有个人爱你很久",
        "最美的不是下雨天，是曾与你躲过雨的屋檐",
        "好不容易，又能再多爱一天",
        // === 七里香 ===
        "窗外的麻雀，在电线杆上多嘴",
        "你说这一句，很有夏天的感觉",
        "雨下整夜，我的爱溢出就像雨水",
        "院子落叶，跟我的思念厚厚一叠",
        "我接着写，把永远爱你写进诗的结尾",
        // === 稻香 ===
        "还记得你说家是唯一的城堡",
        "随着稻香河流继续奔跑",
        "微微笑，小时候的梦我知道",
        "不要哭让萤火虫带着你逃跑",
        "乡间的歌谣永远的依靠",
        "回家吧，回到最初的美好",
        // === 青花瓷 ===
        "天青色等烟雨，而我在等你",
        "炊烟袅袅升起，隔江千万里",
        "素胚勾勒出青花笔锋浓转淡",
        "瓶身描绘的牡丹一如你初妆",
        // === 夜曲 ===
        "为你弹奏肖邦的夜曲，纪念我死去的爱情",
        "跟夜风一样的声音，心碎的很好听",
        "手在键盘敲很轻，我给的思念很小心",
        // === 简单爱 ===
        "我想就这样牵着你的手不放开",
        "爱可不可以简简单单没有伤害",
        "你靠着我的肩膀，你在我胸口睡着",
        "骑着单车，我陪你看日落",
        // === 听妈妈的话 ===
        "听妈妈的话，别让她受伤",
        "想快快长大才能保护她",
        "美丽的白发，幸福中发芽",
        // === 东风破 ===
        "谁在用琵琶弹奏，一曲东风破",
        "岁月在墙上剥落，看见小时候",
        "枫叶将故事染色，结局我看透",
        // === 发如雪 ===
        "你发如雪，凄美了离别",
        "我焚香感动了谁",
        "邀明月，让回忆皎洁",
        "繁华如三千东流水，我只取一瓢爱了解",
        // === 千里之外 ===
        "我送你离开，千里之外，你无声黑白",
        "沉默年代，或许不该，太遥远的相爱",
        "琴声何来，生死难猜",
        // === 烟花易冷 ===
        "雨纷纷，旧故里草木深",
        "我听闻，你始终一个人",
        "斑驳的城门，盘踞着老树根",
        // === 龙卷风 ===
        "爱情来的太快就像龙卷风",
        "离不开暴风圈来不及逃",
        "爱像一阵风，吹完它就走",
        // === 双截棍 ===
        "快使用双截棍，哼哼哈兮",
        "什么刀枪跟棍棒，我都耍的有模有样",
        // === 珊瑚海 ===
        "海鸟和鱼相爱，只是一场意外",
        "转身离开，分手说不出来",
        // === 蒲公英的约定 ===
        "一起长大的约定，那样清晰",
        "打过勾的我相信",
        "说好要一起旅行，是你如今唯一坚持的任性",
        // === 告白气球 ===
        "塞纳河畔，左岸的咖啡",
        "我手一杯，品尝你的美",
        "亲爱的，爱上你，从那天起，甜蜜的很轻易",
        "拥有你就拥有全世界",
        // === 菊花台 ===
        "菊花残，满地伤，你的笑容已泛黄",
        "花落人断肠，我心事静静躺",
        "北风乱，夜未央，你的影子剪不断",
        // === 安静 ===
        "只剩下钢琴陪我弹了一天",
        "睡着的大提琴，安静的旧旧的",
        "希望他是真的比我还要爱你",
        // === 轨迹 ===
        "我会发着呆然后忘记你",
        "接着紧紧闭上眼",
        "如果说分手是苦痛的起点",
        "那在终点之前我愿意再爱一遍",
        // === 退后 ===
        "我知道你我都没有错，只是忘了怎么退后",
        "信誓旦旦给了承诺，却被时间扑了空",
        "天空灰得像哭过",
        // === 星晴 ===
        "乘着风游荡在蓝天边",
        "一片云掉落在我面前",
        "捏成你的形状，随风跟着我",
        // === 爱在西元前 ===
        "我给你的爱写在西元前",
        "深埋在美索不达米亚平原",
        "喜欢在人潮中你只属于我的那画面",
        // === 可爱女人 ===
        "漂亮的让我面红的可爱女人",
        "温柔的让我心疼的可爱女人",
        // === 反方向的钟 ===
        "穿梭时间的画面的钟",
        "从反方向开始移动",
        // === 一路向北 ===
        "我一路向北，离开有你的季节",
        "方向盘周围，回转着我的后悔",
        // === 甜甜的 ===
        "我轻轻地尝一口你说的爱我",
        "我喜欢的样子你都有",
        // === 暗号 ===
        "我害怕你心碎没人帮你擦眼泪",
        "别接不上我给的暗号",
        // === 园游会 ===
        "琥珀色黄昏像糖在很美的远方",
        "你的脸没有化妆我却疯狂爱上",
        // === 半岛铁盒 ===
        "铁盒的钥匙我找不到，放哪了",
        "走廊上的门窗，我关上",
        // === 爷爷泡的茶 ===
        "爷爷泡的茶，有一种味道叫做家",
        "陆羽泡的茶，像幅泼墨的山水画",
        // === 霍元甲 ===
        "霍霍霍霍霍霍霍霍",
        "活着生命就该完整度过",
        // === 等你下课 ===
        "高中三年，我为什么不好好读书",
        "等你下课，一起走好吗",
        // === 莫吉托 ===
        "麻烦给我的爱人来一杯Mojito",
        "我喜欢阅读她眸中微光",
        // === 兰亭序 ===
        "兰亭临帖，行书如行云流水",
        "无关风月，我题序等你回",
        "情字何解，怎落笔都不对",
        // === 说好的幸福呢 ===
        "怎么了，你累了，说好的幸福呢",
        "你说把爱渐渐放下会走更远",
        // === 枫 ===
        "缓缓飘落的枫叶像思念",
        "我点燃烛火温暖岁末的秋天",
        // === 红尘客栈 ===
        "天涯的尽头是风沙",
        "红尘的故事叫牵挂",
        // === 算什么男人 ===
        "你算什么男人，算什么男人",
        "眼睁睁看她走却不扯断线",
        // === 晴天 ===
        "Re Re Do Re Re Mi Re Do Re",
        "你说把爱放下会走更远",
        // === 不能说的秘密 ===
        "冷咖啡离开了杯垫",
        "我忍住的情绪在很后面",
        // === 回到过去 ===
        "一盏黄黄旧旧的灯",
        "时间在旁闷不吭声",
        // === 本草纲目 ===
        "如果华佗再世，崇洋都被医治",
        // === 搁浅 ===
        "风筝在阴天搁浅",
        "想念还在等待救援",
        // === 威廉古堡 ===
        "不会骑扫把的胖女巫",
        "用拉丁文念咒语啦啦呜"
    ]
};

/**
 * 生成随机弹幕
 * @param {string} text - 弹幕文本
 */
function createDanmaku(text) {
    if (!danmakuConfig.enabled) return;

    const container = document.getElementById(danmakuConfig.containerId);
    if (!container) return;

    // 创建弹幕元素
    const danmaku = document.createElement('div');
    danmaku.className = danmakuConfig.danmakuClass;
    danmaku.textContent = text;

    // 应用样式配置
    danmaku.style.fontSize = danmakuConfig.fontSize;
    danmaku.style.fontWeight = danmakuConfig.fontWeight;
    danmaku.style.padding = danmakuConfig.padding;
    danmaku.style.borderRadius = danmakuConfig.borderRadius;
    danmaku.style.backgroundColor = danmakuConfig.backgroundColor;
    danmaku.style.backdropFilter = danmakuConfig.backdropFilter;
    danmaku.style.textShadow = danmakuConfig.textShadow;
    danmaku.style.opacity = danmakuConfig.opacity;

    // 随机位置（垂直方向）- 在容器高度范围内随机出现
    const maxHeight = container.clientHeight * danmakuConfig.verticalRange;
    const top = Math.random() * (maxHeight - 50);
    danmaku.style.top = `${top}px`;

    // 根据速度倍率计算动画时长
    const baseDuration = danmakuConfig.minDuration + Math.random() * (danmakuConfig.maxDuration - danmakuConfig.minDuration);
    const duration = baseDuration / danmakuConfig.speedMultiplier;
    danmaku.style.animationDuration = `${duration}s`;

    // 随机颜色
    const randomColor = danmakuConfig.colors[Math.floor(Math.random() * danmakuConfig.colors.length)];
    danmaku.style.color = randomColor;

    // 添加到容器
    container.appendChild(danmaku);

    // 动画结束后移除元素
    setTimeout(() => {
        if (danmaku.parentNode) {
            danmaku.parentNode.removeChild(danmaku);
        }
    }, duration * 1000);
}

/**
 * 随机发送周杰伦歌词弹幕
 */
function sendRandomDanmaku() {
    if (!danmakuConfig.enabled) return;

    const lyrics = danmakuConfig.lyrics.length > 0 ? danmakuConfig.lyrics : [];
    if (lyrics.length === 0) return;

    const randomLyric = lyrics[Math.floor(Math.random() * lyrics.length)];
    createDanmaku(randomLyric);
}

// 弹幕调度定时器 ID
let danmakuTimerId = null;

/**
 * 初始化弹幕系统
 */
function initDanmaku() {
    // 立即发送一条弹幕
    sendRandomDanmaku();

    // 按照配置的间隔发送弹幕
    function scheduleNextDanmaku() {
        const interval = danmakuConfig.minInterval + Math.random() * (danmakuConfig.maxInterval - danmakuConfig.minInterval);
        danmakuTimerId = setTimeout(() => {
            sendRandomDanmaku();
            scheduleNextDanmaku();
        }, interval);
    }

    scheduleNextDanmaku();
}

/**
 * 停止弹幕系统
 */
function stopDanmaku() {
    if (danmakuTimerId !== null) {
        clearTimeout(danmakuTimerId);
        danmakuTimerId = null;
    }
    // 清除当前所有弹幕
    const container = document.getElementById(danmakuConfig.containerId);
    if (container) {
        container.innerHTML = '';
    }
}

/**
 * 重启弹幕系统（用于参数变更后重新调度）
 */
function restartDanmaku() {
    stopDanmaku();
    if (danmakuConfig.enabled) {
        initDanmaku();
    }
}

/**
 * 初始化弹幕调节控件
 */
function initDanmakuControls() {
    // 模式选择器（弹幕/歌词雨/关闭 三选一）
    const modeRadios = document.querySelectorAll('input[name="lyric-mode"]');
    const modeOptions = document.querySelectorAll('.mode-option');

    modeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const value = e.target.value;

            // 更新选中框样式
            modeOptions.forEach(opt => opt.classList.remove('active'));
            e.target.closest('.mode-option').classList.add('active');

            if (value === 'danmaku') {
                // 开启弹幕，关闭歌词雨
                danmakuConfig.enabled = true;
                initDanmaku();
                window.featureState.lyricRainActive = false;
                stopLyricRain();
                document.getElementById('btn-lyric-rain')?.classList.remove('active');
            } else if (value === 'lyric-rain') {
                // 开启歌词雨，关闭弹幕
                danmakuConfig.enabled = false;
                stopDanmaku();
                window.featureState.lyricRainActive = true;
                startLyricRain();
                document.getElementById('btn-lyric-rain')?.classList.add('active');
            } else {
                // 全部关闭
                danmakuConfig.enabled = false;
                stopDanmaku();
                window.featureState.lyricRainActive = false;
                stopLyricRain();
                document.getElementById('btn-lyric-rain')?.classList.remove('active');
            }
        });
    });

    // 统一透明度控制（同时影响弹幕和歌词雨）
    const opacityEl = document.getElementById('lyric-opacity');
    const opacityVal = document.getElementById('lyric-opacity-val');
    if (opacityEl) {
        opacityEl.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            danmakuConfig.opacity = val / 100;
            window.featureState.lyricRainOpacity = val / 100;
            if (opacityVal) opacityVal.textContent = val + '%';
        });
    }

    // 统一速度控制
    const speedEl = document.getElementById('lyric-speed');
    const speedVal = document.getElementById('lyric-speed-val');
    if (speedEl) {
        speedEl.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            danmakuConfig.speedMultiplier = 20 / val;
            window.featureState.lyricRainSpeed = 20 / val;
            if (speedVal) {
                speedVal.textContent = danmakuConfig.speedMultiplier.toFixed(1) + 'x';
            }
        });
    }

    // 统一密度控制
    const densityEl = document.getElementById('lyric-density');
    const densityVal = document.getElementById('lyric-density-val');
    if (densityEl) {
        densityEl.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            danmakuConfig.minInterval = Math.max(200, val - 300);
            danmakuConfig.maxInterval = val + 300;
            window.featureState.lyricRainDensity = val;
            if (densityVal) {
                if (val <= 200) densityVal.textContent = '高';
                else if (val <= 500) densityVal.textContent = '中';
                else densityVal.textContent = '低';
            }
        });
        densityEl.addEventListener('change', () => {
            restartDanmaku();
            if (window.featureState.lyricRainActive) {
                stopLyricRain();
                startLyricRain();
            }
        });
    }
}

// 页面加载完成后初始化弹幕系统和控件
window.addEventListener('DOMContentLoaded', () => {
    initDanmaku();
    initDanmakuControls();
});
