/**
 * 弹幕功能模块
 * 包含弹幕配置、创建、发送和初始化功能
 */

// 弹幕功能配置
const danmakuConfig = {
    // 容器配置
    containerId: 'danmaku-container',
    danmakuClass: 'danmaku',
    
    // 发送配置
    minInterval: 1000,  // 最小发送间隔（毫秒）
    maxInterval: 2000,  // 最大发送间隔（毫秒）
    
    // 动画配置
    minDuration: 20,     // 最小动画持续时间（秒）
    maxDuration: 30,    // 最大动画持续时间（秒）
    
    // 样式配置
    colors: ['#ffffff', '#ff69b4', '#1785fb', '#4ade80', '#f59e0b', '#8b5cf6'],
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(2px)',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
    
    // 位置配置
    verticalRange: 0.9,  // 垂直方向占用比例（0-1）
    
    // 歌词库
    lyrics: [
        "最美的不是下雨天，是曾与你躲过雨的屋檐",
        "天青色等烟雨，而我在等你",
        "从前从前，有个人爱你很久",
        "雨下整夜，我的爱溢出就像雨水",
        "故事的小黄花，从出生那年就飘着",
        "迷迷蒙蒙，你给的梦",
        "我想就这样牵着你的手不放开",
        "听妈妈的话，别让她受伤",
        "窗外的麻雀，在电线杆上多嘴",
        "谁在用琵琶弹奏，东风破",
        "一壶漂泊，浪迹天涯难入喉",
        "我送你离开，千里之外，你无声黑白",
        "烟花易冷，人事易分",
        "发如雪，凄美了离别",
        "夜的第七章，打字机继续推向接近事实的那下一行",
        "印第安老斑鸠，腿短毛不多",
        "龙卷风，离不开暴风圈来不及逃",
        "晴天，故事的小黄花",
        "七里香，雨下整夜我的爱溢出就像雨水",
        "青花瓷，天青色等烟雨而我在等你",
        "双截棍，快使用双截棍哼哼哈兮",
        "稻香，还记得你说家是唯一的城堡",
        "以父之名，荣耀的背后刻着一道孤独",
        "夜曲，为你弹奏肖邦的夜曲",
        "兰亭序，兰亭临帖行书如行云流水",
        "你发如雪，凄美了离别，我焚香感动了谁",
        "狼牙月，伊人憔悴，我举杯，饮尽了风雪",
        "如果超人会飞，那就让我在空中停一停歇",
        "那些爱过的感觉都太深刻，我都还记得",
        "我晒干了沉默，悔得很冲动，就算这是做错，也只是怕错过",
        "海鸟和鱼相爱，只是一场意外",
        "从前从前，有个人爱你很久，偏偏，风渐渐，把距离吹得好远",
        "雨纷纷，旧故里草木深，我听闻，你始终一个人",
        "繁华如三千东流水，我只取一瓢爱了解",
        "你说把爱渐渐放下会走更远，又何必去改变已错过的时间",
        "我用漂亮的押韵，形容被掠夺一空的爱情",
        "请你回头，我会陪你一直走到最后",
        "看不见你的笑我怎么睡得着，你的身影这么近我却抱不到",
        "如果邪恶是华丽残酷的乐章，它的终场我会亲手写上",
        "我想就这样牵着你的手不放开，爱可不可以简简单单没有伤害",
        "听妈妈的话别让她受伤，想快快长大才能保护她",
        "最美的不是下雨天，是曾与你躲过雨的屋檐",
        "天青色等烟雨而我在等你，炊烟袅袅升起隔江千万里",
        "故事的小黄花，从出生那年就飘着，童年的荡秋千，随记忆一直晃到现在",
        "迷迷蒙蒙，你给的梦，像一场雾，让人看不清楚",
        "窗外的麻雀，在电线杆上多嘴，你说这一句，很有夏天的感觉",
        "谁在用琵琶弹奏，东风破，岁月在墙上剥落，看见小时候",
        "一壶漂泊，浪迹天涯难入喉，你走之后，酒暖回忆思念瘦",
        "我送你离开，千里之外，你无声黑白，沉默年代，或许不该，太遥远的相爱",
        "珊瑚海，海平面远方开始阴霾，悲伤要怎么平静纯白",
        "七里香，院子落叶，跟我的思念厚厚一叠",
        "晴天，从前从前，有个人爱你很久，等到失去后才懂得珍惜",
        "青花瓷，素胚勾勒出青花笔锋浓转淡，瓶身描绘的牡丹一如你初妆",
        "东风破，谁在用琵琶弹奏，东风破，枫叶将故事染色结局我看透",
        "发如雪，君不见，高堂明镜悲白发，朝如青丝暮成雪",
        "夜曲，为你弹奏肖邦的夜曲，纪念我死去的爱情",
        "以父之名，我们每个人都有罪，犯着不同的罪",
        "稻香，不要哭让萤火虫带着你逃跑，乡间的歌谣永远的依靠",
        "双截棍，快使用双截棍，哼哼哈兮，快使用双截棍，哼哼哈兮",
        "龙卷风，爱情来的太快就像龙卷风，离不开暴风圈来不及逃",
        "晴天，从前从前，有个人爱你很久，偏偏，风渐渐，把距离吹得好远",
        "七里香，雨下整夜，我的爱溢出就像雨水，窗台蝴蝶，像诗里纷飞的美丽章节",
        "青花瓷，天青色等烟雨，而我在等你，炊烟袅袅升起，隔江千万里",
        "东风破，一盏离愁孤单伫立在窗口，我在门后假装你人还没走",
        "发如雪，你发如雪，凄美了离别，我焚香感动了谁，邀明月，让回忆皎洁",
        "夜曲，为你弹奏肖邦的夜曲，纪念我死去的爱情，而我为你隐姓埋名，在月光下弹琴",
        "以父之名，荣耀的背后刻着一道孤独，闭上双眼我又看见，当年那梦的画面",
        "稻香，还记得你说家是唯一的城堡，随着稻香河流继续奔跑，微微笑，小时候的梦我知道",
        "双截棍，快使用双截棍，哼哼哈兮，习武之人切记，仁者无敌",
        "龙卷风，爱情来的太快就像龙卷风，离不开暴风圈来不及逃，我不能再想，我不能再想",
        "晴天，从前从前，有个人爱你很久，等到失去后才懂得珍惜，为什么没有好好保护你",
        "七里香，雨下整夜，我的爱溢出就像雨水，窗台蝴蝶，像诗里纷飞的美丽章节",
        "青花瓷，素胚勾勒出青花笔锋浓转淡，瓶身描绘的牡丹一如你初妆，冉冉檀香透过窗心事我了然",
        "东风破，谁在用琵琶弹奏，东风破，岁月在墙上剥落，看见小时候",
        "发如雪，君不见，高堂明镜悲白发，朝如青丝暮成雪，人生得意须尽欢，莫使金樽空对月",
        "夜曲，为你弹奏肖邦的夜曲，纪念我死去的爱情，而我为你隐姓埋名，在月光下弹琴",
        "以父之名，我们每个人都有罪，犯着不同的罪，我能决定谁对，谁又该要沉睡",
        "稻香，不要哭让萤火虫带着你逃跑，乡间的歌谣永远的依靠，回家吧，回到最初的美好",
        "双截棍，快使用双截棍，哼哼哈兮，快使用双截棍，哼哼哈兮，习武之人切记，仁者无敌",
        "龙卷风，爱情来的太快就像龙卷风，离不开暴风圈来不及逃，我不能再想，我不能再想，我不我不我不能",
        "晴天，从前从前，有个人爱你很久，偏偏，风渐渐，把距离吹得好远，好不容易，又能再多爱一天",
        "七里香，雨下整夜，我的爱溢出就像雨水，窗台蝴蝶，像诗里纷飞的美丽章节，我接着写，把永远爱你写进诗的结尾",
        "青花瓷，天青色等烟雨，而我在等你，炊烟袅袅升起，隔江千万里，在瓶底书汉隶仿前朝的飘逸"
    ]
};

/**
 * 生成随机弹幕
 * @param {string} text - 弹幕文本
 */
function createDanmaku(text) {
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
    
    // 随机位置（垂直方向）- 在容器高度范围内随机出现
    const maxHeight = container.clientHeight * danmakuConfig.verticalRange;
    const top = Math.random() * (maxHeight - 50);
    danmaku.style.top = `${top}px`;
    
    // 随机速度
    const duration = danmakuConfig.minDuration + Math.random() * (danmakuConfig.maxDuration - danmakuConfig.minDuration);
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
    const lyrics = danmakuConfig.lyrics.length > 0 ? danmakuConfig.lyrics : [];
    if (lyrics.length === 0) return;
    
    const randomLyric = lyrics[Math.floor(Math.random() * lyrics.length)];
    createDanmaku(randomLyric);
}

/**
 * 初始化弹幕系统
 */
function initDanmaku() {
    // 立即发送一条弹幕
    sendRandomDanmaku();
    
    // 按照配置的间隔发送弹幕
    function scheduleNextDanmaku() {
        const interval = danmakuConfig.minInterval + Math.random() * (danmakuConfig.maxInterval - danmakuConfig.minInterval);
        setTimeout(() => {
            sendRandomDanmaku();
            scheduleNextDanmaku();
        }, interval);
    }
    
    scheduleNextDanmaku();
}

// 页面加载完成后初始化弹幕系统
window.addEventListener('DOMContentLoaded', initDanmaku);