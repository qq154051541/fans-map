/**
 * 2026周杰伦「嘉年华Ⅱ」世界巡回演唱会行程数据
 * 数据来源：官方审批公示、大麦/猫眼平台、媒体报道（2026年6月整理）
 * 仅包含 2026 年场次，按时间顺序排列
 */
const CONCERTS_2026 = [
    {
        id: 1,
        city: "杭州",
        theme: "烟花杭州",
        tour: "嘉年华Ⅱ",
        startDate: "2026-04-03",
        endDate: "2026-04-05",
        shows: 3,
        venue: "杭州奥体中心体育场",
        venueNickname: "大莲花",
        address: "浙江省杭州市萧山区",
        lat: 30.1923,
        lng: 120.2171,
        capacity: "约 8 万人/场",
        priceRange: "780 - 2380 元",
        priceTiers: ["看台 780", "看台 1080", "看台 1380", "看台 1680", "看台 1980", "内场 2380"],
        platforms: ["大麦", "猫眼"],
        platformLinks: {
            "大麦": "https://www.damai.cn",
            "猫眼": "https://www.maoyan.com"
        },
        saleStatus: "已售罄",
        concertStatus: "finished",
        highlight: "巡演首站 · 全球首唱《太阳之子》雨中开唱",
        image: "imgs/concert-2026/hangzhou.jpg"
    },
    {
        id: 2,
        city: "南宁",
        theme: "甜甜的南宁",
        tour: "嘉年华Ⅱ",
        startDate: "2026-04-17",
        endDate: "2026-04-19",
        shows: 3,
        venue: "广西体育中心主体育场",
        venueNickname: "",
        address: "广西南宁市五象新区",
        lat: 22.7589,
        lng: 108.3827,
        capacity: "约 6 万人/场",
        priceRange: "580 - 2080 元",
        priceTiers: ["看台 580", "看台 780", "看台 1080", "看台 1380", "内场 1880", "内场 2080"],
        platforms: ["大麦", "猫眼"],
        platformLinks: {
            "大麦": "https://www.damai.cn",
            "猫眼": "https://www.maoyan.com"
        },
        saleStatus: "已售罄",
        concertStatus: "finished",
        highlight: "与广西「三月三」假期完美重合 · 新增为 S.H.E 创作的歌曲",
        image: "imgs/concert-2026/nanning.jpg"
    },
    {
        id: 3,
        city: "温州",
        theme: "蜗牛",
        tour: "嘉年华Ⅱ",
        startDate: "2026-05-15",
        endDate: "2026-05-17",
        shows: 3,
        venue: "温州奥体中心体育场",
        venueNickname: "",
        address: "浙江省温州市瓯海区",
        lat: 27.9574,
        lng: 120.6790,
        capacity: "约 4 万人/场",
        priceRange: "580 - 2380 元",
        priceTiers: ["看台 580", "看台 780", "看台 1080", "看台 1380", "看台 1880", "内场 2380"],
        platforms: ["大麦", "猫眼", "票星球"],
        platformLinks: {
            "大麦": "https://www.damai.cn",
            "猫眼": "https://www.maoyan.com",
            "票星球": "https://www.piaoxingqiu.com"
        },
        saleStatus: "已售罄",
        concertStatus: "finished",
        highlight: "近 12 万观众刷新上座纪录 · 150 万人同时在线抢票",
        image: "imgs/concert-2026/wenzhou.jpg"
    },
    {
        id: 4,
        city: "北京",
        theme: "龙拳",
        tour: "嘉年华Ⅱ",
        startDate: "2026-06-26",
        endDate: "2026-06-28",
        shows: 3,
        venue: "北京国家体育场",
        venueNickname: "鸟巢",
        address: "北京市朝阳区国家体育场南路",
        lat: 39.9929,
        lng: 116.3964,
        capacity: "约 9 万人/场",
        priceRange: "580 - 2580 元",
        priceTiers: ["看台 580", "看台 880", "看台 1280", "看台 1880", "内场 2580"],
        platforms: ["大麦", "猫眼"],
        platformLinks: {
            "大麦": "https://www.damai.cn",
            "猫眼": "https://www.maoyan.com"
        },
        saleStatus: "前三轮已售罄 · 待补票",
        concertStatus: "ongoing",
        highlight: "鸟巢连开三场 · 前三轮预售全部秒罄",
        image: "imgs/concert-2026/beijing.jpg"
    },
    {
        id: 5,
        city: "南京",
        theme: "爱在·南京·嘉年华",
        tour: "嘉年华Ⅱ",
        startDate: "2026-09-24",
        endDate: "2026-09-26",
        shows: 3,
        venue: "南京奥体中心体育场",
        venueNickname: "",
        address: "江苏省南京市建邺区",
        lat: 32.0051,
        lng: 118.7372,
        capacity: "约 6 万人/场",
        priceRange: "待公布",
        priceTiers: [],
        platforms: ["大麦"],
        platformLinks: {
            "大麦": "https://www.damai.cn"
        },
        saleStatus: "待开票",
        concertStatus: "upcoming",
        highlight: "时隔 2 年重返南京 · 大麦平台 641.5 万人标记「想看」",
        image: "imgs/concert-2026/nanjing.jpg"
    },
    {
        id: 6,
        city: "青岛",
        theme: "爱琴海·青岛·嘉年华",
        tour: "嘉年华Ⅱ",
        startDate: "2026-10-03",
        endDate: "2026-10-05",
        shows: 3,
        venue: "青岛市民健身中心体育场",
        venueNickname: "",
        address: "山东省青岛市高新区",
        lat: 36.2637,
        lng: 120.2899,
        capacity: "约 5 万人/场",
        priceRange: "待公布",
        priceTiers: [],
        platforms: ["待定"],
        platformLinks: {},
        saleStatus: "待开票 · 6月15日刚获批",
        concertStatus: "upcoming",
        highlight: "国庆假期连唱三天 · 巡演收官之站",
        image: "imgs/concert-2026/qingdao.jpg"
    }
];

/**
 * 状态文案映射
 */
const STATUS_LABELS = {
    finished: { text: "已举办", icon: "fa-check-circle", color: "#22c55e" },
    ongoing: { text: "进行中", icon: "fa-circle-dot", color: "#f59e0b" },
    upcoming: { text: "待开票", icon: "fa-clock", color: "#3b82f6" }
};
