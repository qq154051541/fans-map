// 歌迷会数据
const hubs = [
    { name: "北京歌迷会", lat: 39.9042, lng: 116.4074, president: "张伟" }, // 天安门
    { name: "上海歌迷会", lat: 31.2304, lng: 121.4737,  president: "李娜" }, // 人民广场
    { name: "天津歌迷会", lat: 39.1248, lng: 117.2009,  president: "王强" }, // 天津站附近
    { name: "重庆歌迷会", lat: 29.5630, lng: 106.5516, president: "刘洋" }, // 解放碑
    { name: "石家庄歌迷会", lat: 38.0428, lng: 114.5149,  president: "赵敏" }, // 博物院
    { name: "太原歌迷会", lat: 37.8706, lng: 112.5489,  president: "孙杰" }, // 五一广场
    { name: "西安歌迷会", lat: 34.3416, lng: 108.9398,  president: "周涛" }, // 钟楼
    { name: "济南歌迷会", lat: 36.6512, lng: 117.1201,  president: "吴刚" }, // 泉城广场
    { name: "郑州歌迷会", lat: 34.7466, lng: 113.6253,  president: "郑平" }, // 二七塔
    { name: "沈阳歌迷会", lat: 41.8057, lng: 123.4315,  president: "王磊" }, // 市府广场
    { name: "长春歌迷会", lat: 43.8171, lng: 125.3235,  president: "李明" }, // 人民广场
    { name: "哈尔滨歌迷会", lat: 45.7738, lng: 126.6190,  president: "张勇" }, // 圣索菲亚教堂附近 (修正)
    { name: "南京歌迷会", lat: 32.0603, lng: 118.7969,  president: "陈静" }, // 新街口
    { name: "杭州歌迷会", lat: 30.2741, lng: 120.1551,  president: "林峰" }, // 武林广场
    { name: "合肥歌迷会", lat: 31.8206, lng: 117.2272,  president: "裤衩" }, // 市府广场
    { name: "福州歌迷会", lat: 26.0745, lng: 119.2965,  president: "黄波" }, // 五一广场
    { name: "南昌歌迷会", lat: 28.6830, lng: 115.8579,  president: "周婷" }, // 八一广场
    { name: "武汉歌迷会", lat: 30.5928, lng: 114.3055,  president: "朱丽" }, // 江汉路
    { name: "长沙歌迷会", lat: 28.2282, lng: 112.9388,  president: "何杰" }, // 五一广场
    { name: "广州歌迷会", lat: 23.1291, lng: 113.2644,  president: "陈伟" }, // 越秀公园
    { name: "南宁歌迷会", lat: 22.8170, lng: 108.3665,  president: "韦强" }, // 朝阳广场
    { name: "海口歌迷会", lat: 20.0440, lng: 110.3277,  president: "林海" }, // 人民公园 (修正)
    { name: "成都歌迷会", lat: 30.6586, lng: 104.0648,  president: "张敏" }, // 天府广场 (修正)
    { name: "贵阳歌迷会", lat: 26.5783, lng: 106.7135,  president: "王军" }, // 喷水池 (修正)
    { name: "昆明歌迷会", lat: 25.0406, lng: 102.7122,  president: "杨丽" }, // 翠湖 (修正)
    { name: "拉萨歌迷会", lat: 29.6500, lng: 91.1172,  president: "扎西" }, // 布达拉宫附近 (修正)
    { name: "兰州歌迷会", lat: 36.0611, lng: 103.8343,  president: "马强" }, // 东方红广场
    { name: "西宁歌迷会", lat: 36.6171, lng: 101.7782,  president: "李华" }, // 中心广场
    { name: "银川歌迷会", lat: 38.4872, lng: 106.2309,  president: "马燕" }, // 光明广场
    { name: "乌鲁木齐歌迷会", lat: 43.8256, lng: 87.6168,  president: "阿依古丽" }, // 人民广场
    { name: "呼和浩特歌迷会", lat: 40.8415, lng: 111.7492,  president: "巴特尔" }, // 新华广场
    { name: "香港歌迷会", lat: 22.2783, lng: 114.1747,  president: "陈大文" }, // 湾仔 (修正)
    { name: "澳门歌迷会", lat: 22.1944, lng: 113.5482,  president: "何超" }, // 大三巴 (修正)
    { name: "台北歌迷会", lat: 25.0330, lng: 121.5654,  president: "林志豪" } // 101大楼
];
