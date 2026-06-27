/**
 * 周杰伦历年巡回演唱会场次数据
 * 用于「演唱会巡演地图」图层，在地图上展示经典巡演的举办城市
 * 数据为精选代表性场次，按巡演名称分组
 */
const concerts = [
    // ========== 范特西演唱会 (2001-2002) ==========
    { tour: "范特西演唱会", year: 2001, city: "台北", venue: "台北市立体育场", lat: 25.0595, lng: 121.5334 },
    { tour: "范特西演唱会", year: 2002, city: "香港", venue: "香港体育馆", lat: 22.3171, lng: 114.1857 },
    { tour: "范特西演唱会", year: 2002, city: "吉隆坡", venue: "武吉加里尔体育馆", lat: 3.0535, lng: 101.6912 },

    // ========== The One 演唱会 (2002-2004) ==========
    { tour: "The One 演唱会", year: 2002, city: "台北", venue: "台北市立体育场", lat: 25.0595, lng: 121.5334 },
    { tour: "The One 演唱会", year: 2003, city: "北京", venue: "工人体育场", lat: 39.9298, lng: 116.4495 },
    { tour: "The One 演唱会", year: 2003, city: "上海", venue: "上海体育场", lat: 31.1919, lng: 121.4358 },
    { tour: "The One 演唱会", year: 2003, city: "广州", venue: "天河体育中心", lat: 23.1337, lng: 113.3197 },
    { tour: "The One 演唱会", year: 2004, city: "新加坡", venue: "新加坡室内体育馆", lat: 1.3329, lng: 103.7436 },

    // ========== 无与伦比演唱会 (2003-2004) ==========
    { tour: "无与伦比演唱会", year: 2003, city: "台北", venue: "台北市立体育场", lat: 25.0595, lng: 121.5334 },
    { tour: "无与伦比演唱会", year: 2004, city: "香港", venue: "香港体育馆", lat: 22.3171, lng: 114.1857 },
    { tour: "无与伦比演唱会", year: 2004, city: "杭州", venue: "黄龙体育中心", lat: 30.2741, lng: 120.1400 },

    // ========== 2007 世界巡回演唱会 (2007-2008) ==========
    { tour: "2007世界巡回演唱会", year: 2007, city: "台北", venue: "台北小巨蛋", lat: 25.0519, lng: 121.5505 },
    { tour: "2007世界巡回演唱会", year: 2007, city: "上海", venue: "上海体育场", lat: 31.1919, lng: 121.4358 },
    { tour: "2007世界巡回演唱会", year: 2008, city: "北京", venue: "工人体育场", lat: 39.9298, lng: 116.4495 },
    { tour: "2007世界巡回演唱会", year: 2008, city: "成都", venue: "成都市体育中心", lat: 30.6703, lng: 104.0740 },
    { tour: "2007世界巡回演唱会", year: 2008, city: "重庆", venue: "重庆奥体中心", lat: 29.5577, lng: 106.5479 },
    { tour: "2007世界巡回演唱会", year: 2008, city: "东京", venue: "武道馆", lat: 35.6932, lng: 139.7499 },
    { tour: "2007世界巡回演唱会", year: 2008, city: "多伦多", venue: "Air Canada Centre", lat: 43.6435, lng: -79.3791 },

    // ========== 超时代世界巡回演唱会 (2010-2011) ==========
    { tour: "超时代世界巡回演唱会", year: 2010, city: "台北", venue: "台北小巨蛋", lat: 25.0519, lng: 121.5505 },
    { tour: "超时代世界巡回演唱会", year: 2010, city: "上海", venue: "上海体育场", lat: 31.1919, lng: 121.4358 },
    { tour: "超时代世界巡回演唱会", year: 2010, city: "北京", venue: "工人体育场", lat: 39.9298, lng: 116.4495 },
    { tour: "超时代世界巡回演唱会", year: 2010, city: "广州", venue: "天河体育中心", lat: 23.1337, lng: 113.3197 },
    { tour: "超时代世界巡回演唱会", year: 2011, city: "武汉", venue: "武汉体育中心", lat: 30.5483, lng: 114.2668 },
    { tour: "超时代世界巡回演唱会", year: 2011, city: "南京", venue: "南京奥体中心", lat: 32.0051, lng: 118.7372 },
    { tour: "超时代世界巡回演唱会", year: 2011, city: "洛杉矶", venue: "Nokia Theatre", lat: 34.0442, lng: -118.2671 },
    { tour: "超时代世界巡回演唱会", year: 2011, city: "悉尼", venue: "Allphones Arena", lat: -33.8469, lng: 151.0645 },

    // ========== 摩天轮世界巡回演唱会 (2013-2015) ==========
    { tour: "摩天轮世界巡回演唱会", year: 2013, city: "上海", venue: "上海梅赛德斯奔驰文化中心", lat: 31.1872, lng: 121.4855 },
    { tour: "摩天轮世界巡回演唱会", year: 2013, city: "北京", venue: "万事达中心", lat: 39.9073, lng: 116.3478 },
    { tour: "摩天轮世界巡回演唱会", year: 2014, city: "广州", venue: "广州国际体育演艺中心", lat: 23.1467, lng: 113.4639 },
    { tour: "摩天轮世界巡回演唱会", year: 2014, city: "成都", venue: "成都体育中心", lat: 30.6703, lng: 104.0740 },
    { tour: "摩天轮世界巡回演唱会", year: 2014, city: "杭州", venue: "黄龙体育中心", lat: 30.2741, lng: 120.1400 },
    { tour: "摩天轮世界巡回演唱会", year: 2014, city: "武汉", venue: "武汉体育中心", lat: 30.5483, lng: 114.2668 },
    { tour: "摩天轮世界巡回演唱会", year: 2014, city: "西安", venue: "陕西省体育场", lat: 34.2491, lng: 108.9520 },
    { tour: "摩天轮世界巡回演唱会", year: 2015, city: "台北", venue: "台北小巨蛋", lat: 25.0519, lng: 121.5505 },
    { tour: "摩天轮世界巡回演唱会", year: 2015, city: "高雄", venue: "高雄巨蛋", lat: 22.7342, lng: 120.3048 },

    // ========== 地表最强世界巡回演唱会 (2017-2019) ==========
    { tour: "地表最强世界巡回演唱会", year: 2017, city: "北京", venue: "凯迪拉克中心", lat: 39.9073, lng: 116.3478 },
    { tour: "地表最强世界巡回演唱会", year: 2017, city: "上海", venue: "上海梅赛德斯奔驰文化中心", lat: 31.1872, lng: 121.4855 },
    { tour: "地表最强世界巡回演唱会", year: 2017, city: "深圳", venue: "深圳湾体育中心", lat: 22.5256, lng: 113.9440 },
    { tour: "地表最强世界巡回演唱会", year: 2017, city: "南京", venue: "南京奥体中心", lat: 32.0051, lng: 118.7372 },
    { tour: "地表最强世界巡回演唱会", year: 2017, city: "杭州", venue: "黄龙体育中心", lat: 30.2741, lng: 120.1400 },
    { tour: "地表最强世界巡回演唱会", year: 2018, city: "成都", venue: "成都体育中心", lat: 30.6703, lng: 104.0740 },
    { tour: "地表最强世界巡回演唱会", year: 2018, city: "武汉", venue: "武汉体育中心", lat: 30.5483, lng: 114.2668 },
    { tour: "地表最强世界巡回演唱会", year: 2018, city: "济南", venue: "济南奥体中心", lat: 36.6512, lng: 117.1201 },
    { tour: "地表最强世界巡回演唱会", year: 2018, city: "巴黎", venue: "AccorHotels Arena", lat: 48.8395, lng: 2.3783 },
    { tour: "地表最强世界巡回演唱会", year: 2018, city: "伦敦", venue: "The O2 Arena", lat: 51.5030, lng: 0.0032 },
    { tour: "地表最强世界巡回演唱会", year: 2019, city: "悉尼", venue: "Qudos Bank Arena", lat: -33.8469, lng: 151.0645 },
    { tour: "地表最强世界巡回演唱会", year: 2019, city: "墨尔本", venue: "Rod Laver Arena", lat: -37.8220, lng: 144.9780 },

    // ========== 嘉年华世界巡回演唱会 (2019-2024) ==========
    { tour: "嘉年华世界巡回演唱会", year: 2019, city: "上海", venue: "上海体育场", lat: 31.1919, lng: 121.4358 },
    { tour: "嘉年华世界巡回演唱会", year: 2019, city: "北京", venue: "凯迪拉克中心", lat: 39.9073, lng: 116.3478 },
    { tour: "嘉年华世界巡回演唱会", year: 2019, city: "广州", venue: "天河体育中心", lat: 23.1337, lng: 113.3197 },
    { tour: "嘉年华世界巡回演唱会", year: 2023, city: "海口", venue: "海口五源河体育场", lat: 20.0440, lng: 110.3277 },
    { tour: "嘉年华世界巡回演唱会", year: 2023, city: "太原", venue: "山西体育中心", lat: 37.8706, lng: 112.5489 },
    { tour: "嘉年华世界巡回演唱会", year: 2023, city: "呼和浩特", venue: "呼和浩特体育场", lat: 40.8415, lng: 111.7492 },
    { tour: "嘉年华世界巡回演唱会", year: 2024, city: "福州", venue: "福州海峡奥体中心", lat: 26.0745, lng: 119.2965 },
    { tour: "嘉年华世界巡回演唱会", year: 2024, city: "长沙", venue: "长沙贺龙体育中心", lat: 28.1850, lng: 112.9823 },
    { tour: "嘉年华世界巡回演唱会", year: 2024, city: "南京", venue: "南京奥体中心", lat: 32.0051, lng: 118.7372 },
    { tour: "嘉年华世界巡回演唱会", year: 2024, city: "杭州", venue: "杭州奥体中心", lat: 30.1923, lng: 120.2171 },
    { tour: "嘉年华世界巡回演唱会", year: 2024, city: "深圳", venue: "深圳大运中心", lat: 22.6990, lng: 114.2103 }
];

/**
 * 获取所有巡演名称列表（去重，按年份排序）
 * @returns {string[]} 巡演名称数组
 */
function getTourNames() {
    const tours = [...new Set(concerts.map(c => c.tour))];
    return tours.sort((a, b) => {
        const yearA = concerts.find(c => c.tour === a).year;
        const yearB = concerts.find(c => c.tour === b).year;
        return yearA - yearB;
    });
}
