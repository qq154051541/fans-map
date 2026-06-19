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

    // 歌词库
    lyrics: [
        // === 晴天 ===
        "最美的不是下雨天，是曾与你躲过雨的屋檐",
        "从前从前，有个人爱你很久",
        "晴天，故事的小黄花",
        "从前从前，有个人爱你很久，偏偏，风渐渐，把距离吹得好远",
        "从前从前，有个人爱你很久，等到失去后才懂得珍惜",
        "好不容易，又能再多爱一天",
        "故事的小黄花，从出生那年就飘着，童年的荡秋千，随记忆一直晃到现在",
        "刮风这天，我试过握着你手",
        "但偏偏，雨渐渐，大到我看你不见",
        // === 青花瓷 ===
        "天青色等烟雨，而我在等你",
        "青花瓷，天青色等烟雨而我在等你",
        "天青色等烟雨而我在等你，炊烟袅袅升起隔江千万里",
        "素胚勾勒出青花笔锋浓转淡，瓶身描绘的牡丹一如你初妆",
        "冉冉檀香透过窗心事我了然",
        "在瓶底书汉隶仿前朝的飘逸",
        "如传世的青花瓷自顾自美丽",
        "色白花青的锦鲤跃然于碗底",
        "帘外芭蕉惹骤雨门环惹铜绿",
        // === 七里香 ===
        "雨下整夜，我的爱溢出就像雨水",
        "七里香，雨下整夜我的爱溢出就像雨水",
        "窗台蝴蝶，像诗里纷飞的美丽章节",
        "院子落叶，跟我的思念厚厚一叠",
        "我接着写，把永远爱你写进诗的结尾",
        "秋刀鱼的滋味，猫跟你都想了解",
        "初恋的香味就这样被我们寻回",
        "那温暖的阳光，像刚摘的鲜艳草莓",
        // === 稻香 ===
        "稻香，还记得你说家是唯一的城堡",
        "随着稻香河流继续奔跑，微微笑，小时候的梦我知道",
        "不要哭让萤火虫带着你逃跑，乡间的歌谣永远的依靠",
        "回家吧，回到最初的美好",
        "所谓的那快乐，赤脚在田里追蜻蜓追到累了",
        "珍惜一切就算没有拥有",
        // === 夜曲 ===
        "夜曲，为你弹奏肖邦的夜曲",
        "纪念我死去的爱情",
        "而我为你隐姓埋名，在月光下弹琴",
        "为你弹奏肖邦的夜曲，纪念我死去的爱情",
        "跟夜风一样的声音，心碎的很好听",
        "手在键盘敲很轻，我给的思念很小心",
        // === 以父之名 ===
        "以父之名，荣耀的背后刻着一道孤独",
        "闭上双眼我又看见，当年那梦的画面",
        "我们每个人都有罪，犯着不同的罪",
        "我能决定谁对，谁又该要沉睡",
        "微凉的晨露，沾湿黑礼服",
        // === 东风破 ===
        "谁在用琵琶弹奏，东风破",
        "岁月在墙上剥落，看见小时候",
        "枫叶将故事染色结局我看透",
        "一盏离愁孤单伫立在窗口，我在门后假装你人还没走",
        "荒烟漫草的年头，就连分手都很沉默",
        // === 发如雪 ===
        "发如雪，凄美了离别",
        "你发如雪，凄美了离别，我焚香感动了谁",
        "邀明月，让回忆皎洁",
        "君不见，高堂明镜悲白发，朝如青丝暮成雪",
        "繁华如三千东流水，我只取一瓢爱了解",
        "铜镜映无邪，扎马尾，你若撒野，我定把酒奉陪",
        // === 简单爱 ===
        "我想就这样牵着你的手不放开",
        "爱可不可以简简单单没有伤害",
        "我想大声宣布，对你依依不舍",
        "骑着单车，我陪你看日落",
        "河边的风，在吹着头发飘动",
        // === 听妈妈的话 ===
        "听妈妈的话，别让她受伤",
        "想快快长大才能保护她",
        "听妈妈的话别让她受伤",
        "美丽的白发，幸福中发芽",
        "天使的魔法，温暖中慈祥",
        // === 千里之外 ===
        "我送你离开，千里之外，你无声黑白",
        "沉默年代，或许不该，太遥远的相爱",
        "琴声何来，生死难猜",
        "闻泪声入林，寻梨花白，只得一行青苔",
        // === 烟花易冷 ===
        "烟花易冷，人事易分",
        "雨纷纷，旧故里草木深，我听闻，你始终一个人",
        "斑驳的城门，盘踞着老树根",
        "石板上回荡的是再等",
        "雨纷纷，旧故里草木深",
        // === 龙卷风 ===
        "龙卷风，离不开暴风圈来不及逃",
        "爱情来的太快就像龙卷风",
        "我不能再想，我不能再想",
        "爱像一阵风，吹完它就走",
        "这样的节奏，谁都无可奈何",
        // === 双截棍 ===
        "双截棍，快使用双截棍哼哼哈兮",
        "习武之人切记，仁者无敌",
        "快使用双截棍，哼哼哈兮",
        "什么刀枪跟棍棒，我都耍的有模有样",
        // === 珊瑚海 ===
        "海鸟和鱼相爱，只是一场意外",
        "珊瑚海，海平面远方开始阴霾",
        "转身离开，分手说不出来",
        "海鸟跟鱼相爱，只是一场意外",
        // === 兰亭序 ===
        "兰亭序，兰亭临帖行书如行云流水",
        "无关风月，我题序等你回",
        "悬笔一绝，那岸边浪千叠",
        "情字何解，怎落笔都不对",
        // === 安静 ===
        "只剩下钢琴陪我弹了一天",
        "睡着的大提琴，安静的旧旧的",
        "希望他是真的比我还要爱你",
        "我没有这种天分，包容你也接受他",
        // === 轨迹 ===
        "我会发着呆然后忘记你，接着紧紧闭上眼",
        "想着那一天会有人代替，让我不再想念你",
        "如果说分手是苦痛的起点，那在终点之前我愿意再爱一遍",
        // === 退后 ===
        "我知道你我都没有错，只是忘了怎么退后",
        "信誓旦旦给了承诺，却被时间扑了空",
        "天空灰得像哭过，离开你以后并没有更自由",
        // === 蒲公英的约定 ===
        "一起长大的约定，那样清晰，打过勾的我相信",
        "说好要一起旅行，是你如今，唯一坚持的任性",
        "而我已经分不清，你是友情还是错过的爱情",
        // === 不能说的秘密 ===
        "只缘感君一回顾，使我思君朝与暮",
        "最美的不是下雨天，是曾与你躲过雨的屋檐",
        "冷咖啡离开了杯垫，我忍住的情绪在很后面",
        // === 说好的幸福呢 ===
        "你说把爱渐渐放下会走更远，又何必去改变已错过的时间",
        "你说把爱渐渐放下会走更远",
        "怎么了，你累了，说好的幸福呢",
        // === 搁浅 ===
        "我只能永远读着对白，读着我给你的伤害",
        "我原谅不了我，就请你当作我已不在",
        "我睁开双眼，看着空白",
        // === 枫 ===
        "缓缓飘落的枫叶像思念",
        "我点燃烛火温暖岁末的秋天",
        "极光掠过天边，北风掠过想你的容颜",
        // === 告白气球 ===
        "塞纳河畔，左岸的咖啡",
        "我手一杯，品尝你的美",
        "亲爱的，爱上你，从那天起，甜蜜的很轻易",
        "拥有你就拥有全世界",
        // === 等你下课 ===
        "高中三年，我为什么，为什么不好好读书",
        "学校旁的广场，我在这等钟声响",
        "等你下课一起走好吗",
        // === 莫吉托 ===
        "麻烦给我的爱人来一杯Mojito",
        "我喜欢阅读她眸中微光",
        "我的世界已因为她为你准备好了",
        // === 锦瑟 ===
        "锦瑟无端五十弦，一弦一柱思华年",
        // === 暗号 ===
        "我想要的，你却给不了我",
        "我害怕你心碎没人帮你擦眼泪",
        // === 迷迭香 ===
        "迷迭香，你微笑的模样",
        "你的嘴角，微微上翘，性感的无可救药",
        // === 园游会 ===
        "琥珀色黄昏像糖在很美的远方",
        "你的脸没有化妆我却疯狂爱上",
        "我喜欢的样子你都有",
        // === 甜甜的 ===
        "我轻轻地尝一口你说的爱我",
        "我喜欢的样子你都有",
        "你每个微小动作，都让我心动",
        // === 星晴 ===
        "乘着风游荡在蓝天边，一片云掉落在我面前",
        "捏成你的形状，随风跟着我，一口一口吃掉忧愁",
        // === 回到过去 ===
        "一盏黄黄旧旧的灯，时间在旁闷不吭声",
        "寂寞下手毫无分寸，不懂轻重",
        // === 爱在西元前 ===
        "祭司神殿征战弓箭是谁的从前",
        "喜欢在人潮中你只属于我的那画面",
        "我给你的爱写在西元前，深埋在美索不达米亚平原",
        // === 搁浅 ===
        "风筝在阴天搁浅，想念还在等待救援",
        // === 一路向北 ===
        "我一路向北，离开有你的季节",
        "方向盘周围，回转着我的后悔",
        "你站的方位，跟我之间隔着泪",
        // === 可爱女人 ===
        "世界这样大，而我而我，只是只小小的小小的蚂蚁",
        "漂亮的让我面红的可爱女人",
        "温柔的让我心疼的可爱女人",
        // === 反方向的钟 ===
        "迷迷蒙蒙，你给的梦",
        "像一场雾，让人看不清楚",
        "穿梭时间的画面的钟，从反方向开始移动",
        // === 威廉古堡 ===
        "不会骑扫把的胖女巫，用拉丁文念咒语啦啦呜",
        "猪血汤加上几滴她爱吃的葱",
        // === 印第安老斑鸠 ===
        "印第安老斑鸠，腿短毛不多",
        "灌木丛旁，诡异的微笑",
        // === 爷爷泡的茶 ===
        "爷爷泡的茶，有一种味道叫做家",
        "陆羽泡的茶，像幅泼墨的山水画",
        // === 半岛铁盒 ===
        "铁盒的钥匙我找不到，放哪了",
        "走廊上的门窗，我关上",
        // === 暗号 ===
        "我想要的你却给不了我",
        "我害怕你心碎没人帮你擦眼泪",
        // === 红尘客栈 ===
        "剑客来了，红尘客栈，谁的江湖",
        "天涯的尽头是风沙，红尘的故事叫牵挂",
        // === 天涯过客 ===
        "琴声何来，生死难猜",
        "风起雁南下，故人看花",
        // === 霍元甲 ===
        "霍霍霍霍霍霍霍霍，霍家拳的套路招式灵活",
        "活着生命就该完整度过",
        // === 本草纲目 ===
        "如果华佗再世，崇洋都被医治",
        "让我来调配，让你服下这味药",
        // === 千山万水 ===
        "千山万水，无数黑夜，等一轮明月",
        // === 菊花台 ===
        "菊花残，满地伤，你的笑容已泛黄",
        "花落人断肠，我心事静静躺",
        "北风乱，夜未央，你的影子剪不断",
        // === 告白气球 ===
        "花店玫瑰，名字写错谁",
        "告白气球，风吹到对街",
        // === 其他经典 ===
        "一壶漂泊，浪迹天涯难入喉",
        "你走之后，酒暖回忆思念瘦",
        "如果超人会飞，那就让我在空中停一停歇",
        "那些爱过的感觉都太深刻，我都还记得",
        "我晒干了沉默，悔得很冲动",
        "请你回头，我会陪你一直走到最后",
        "看不见你的笑我怎么睡得着",
        "你的身影这么近我却抱不到",
        "如果邪恶是华丽残酷的乐章，它的终场我会亲手写上",
        "我用漂亮的押韵，形容被掠夺一空的爱情",
        "狼牙月，伊人憔悴，我举杯，饮尽了风雪",
        "窗外的麻雀，在电线杆上多嘴，你说这一句，很有夏天的感觉",
        "夜的第七章，打字机继续推向接近事实的那下一行",
        "海鸟和鱼相爱，只是一场意外",
        "珊瑚海，海平面远方开始阴霾，悲伤要怎么平静纯白",
        "繁华如三千东流水，我只取一瓢爱了解",
        "你说把爱渐渐放下会走更远，又何必去改变已错过的时间",
        "我送你离开，千里之外，你无声黑白，沉默年代，或许不该，太遥远的相爱",
        "故事的小黄花，从出生那年就飘着，童年的荡秋千，随记忆一直晃到现在"
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
    // 开关
    const toggleEl = document.getElementById('danmaku-toggle');
    if (toggleEl) {
        toggleEl.addEventListener('change', (e) => {
            danmakuConfig.enabled = e.target.checked;
            if (danmakuConfig.enabled) {
                initDanmaku();
            } else {
                stopDanmaku();
            }
        });
    }

    // 透明度
    const opacityEl = document.getElementById('danmaku-opacity');
    const opacityVal = document.getElementById('danmaku-opacity-val');
    if (opacityEl) {
        opacityEl.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            danmakuConfig.opacity = val / 100;
            if (opacityVal) opacityVal.textContent = val + '%';
        });
    }

    // 速度
    const speedEl = document.getElementById('danmaku-speed');
    const speedVal = document.getElementById('danmaku-speed-val');
    if (speedEl) {
        speedEl.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            // 滑块值 20 = 1.0x，值越小速度越快
            danmakuConfig.speedMultiplier = 20 / val;
            if (speedVal) {
                const display = danmakuConfig.speedMultiplier.toFixed(1) + 'x';
                speedVal.textContent = display;
            }
        });
    }

    // 密度
    const densityEl = document.getElementById('danmaku-density');
    const densityVal = document.getElementById('danmaku-density-val');
    if (densityEl) {
        densityEl.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            // 密度值越小 = 弹幕越密集
            danmakuConfig.minInterval = Math.max(200, val - 500);
            danmakuConfig.maxInterval = val + 500;
            if (densityVal) {
                if (val <= 1000) densityVal.textContent = '高';
                else if (val <= 2500) densityVal.textContent = '中';
                else densityVal.textContent = '低';
            }
        });
        // 松开滑块后重启弹幕调度
        densityEl.addEventListener('change', () => {
            restartDanmaku();
        });
    }
}

// 页面加载完成后初始化弹幕系统和控件
window.addEventListener('DOMContentLoaded', () => {
    initDanmaku();
    initDanmakuControls();
});
