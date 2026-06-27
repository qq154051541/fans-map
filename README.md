# 周杰伦歌迷全球分布地图

## 项目简介

这是一个展示周杰伦歌迷全球分布情况的互动地图应用，让世界各地的杰迷能够在地图上标记自己的位置，形成一个全球杰迷网络。

![周杰伦歌迷全球分布地图](imgs/demo.png)

## 功能特点

- 🗺️ **全球地图展示**：基于Leaflet.js实现的交互式地图
- 👥 **用户加入**：杰迷可以在地图上标记自己的位置
- 📷 **头像上传**：支持上传个人头像或选择Emoji
- 📊 **数据可视化**：展示歌迷分布统计和排行
- 💬 **弹幕效果**：实时显示杰迷动态
- 🌍 **地区歌迷会**：展示各地歌迷组织分布

## 技术栈

### 前端
- HTML5 + CSS3
- JavaScript
- Leaflet.js (地图库) + MarkerCluster (标记聚合插件)
- Font Awesome (图标库)

### 数据存储
- gongju.dev JSON Storage (极简 JSON 云存储，无需后端)
- 数据分批存储，索引记录所有批次 ID
- 互动数据（打call + 留言）独立存储

> 本项目为纯前端应用，无需 PHP/数据库即可运行。历史版本曾使用 PHP + `users.json` 存储数据，现已迁移至云端 JSON 存储。`users.json` 为历史残留文件，不再参与线上读写。

## 项目结构

```
├── css/               # 样式文件
│   ├── add.css        # 加入页面样式
│   ├── danmaku.css    # 弹幕样式
│   ├── features.css   # 创意功能样式
│   └── style.css      # 主样式
├── js/                # JavaScript文件
│   ├── add.js         # 加入页面脚本
│   ├── config.js      # 云存储配置与读写
│   ├── danmaku.js     # 弹幕功能
│   ├── features.js    # 创意互动功能
│   ├── hubs.js        # 地区歌迷会数据
│   └── script.js      # 主页面脚本
├── imgs/              # 静态图片资源
├── index.html         # 主页面
├── add.html           # 加入页面
├── creative.html      # 创意介绍页
├── 404.html           # 404 页面
└── users.json         # 历史残留数据文件（已弃用）
```

## 快速开始

### 环境要求
- 任意现代浏览器
- 一个静态文件服务器（如 VS Code Live Server、`python -m http.server`、Nginx 等）

### 部署步骤

1. **克隆项目**
   ```bash
   git clone <项目地址>
   cd fans-map
   ```

2. **配置云存储（可选）**
   - 项目已内置默认的 gongju.dev 存储 ID，开箱即用
   - 如需独立数据空间，参考 `js/config.js` 顶部的注释，替换 `INDEX_ID` 与 `INTERACT_ID`

3. **启动静态服务**
   - 本地预览：在项目根目录运行 `python -m http.server 8000`，浏览器访问 `http://localhost:8000`
   - 或直接用 VS Code Live Server 打开 `index.html`
   - 线上部署：将整个目录上传至任意静态托管（GitHub Pages、Vercel、Netlify、Nginx 等）

4. **访问应用**
   - 打开浏览器访问首页
   - 点击「加入我们」按钮添加你的位置

## 使用指南

### 查看地图
1. 打开主页面 `index.html`
2. 浏览全球杰迷分布
3. 使用图层控制切换显示歌迷会和个人歌迷
4. 查看歌迷会排行榜

### 加入杰迷网络
1. 点击「加入我们」按钮进入添加页面
2. 填写昵称（最多10个字）
3. 选择头像（上传图片或选择Emoji）
4. 在地图上点击选择你的位置
5. 点击「加入网络」按钮提交

## 数据结构

### 用户数据

用户数据通过 gongju.dev 云端存储，每条记录结构如下：

```json
[
  {
    "nickname": "给我五毛",
    "avatar": "https://i1.go2yd.com/image.php?url=YD_cnt_221_01qx4IePZfUh",
    "lat": 26.999475955405558,
    "lng": 113.63265420961241,
    "timestamp": 1769332601762
  }
]
```

数据采用**多批次存储**：当单个批次超过 `BATCH_SIZE_LIMIT`（约 800KB）时自动创建新批次，所有批次 ID 由索引记录，详见 `js/config.js`。

### 互动数据

打call（`loves`）与留言（`messages`）独立存储于 `INTERACT_ID`，结构为：

```json
{
  "loves": { "昵称A": 12, "昵称B": 3 },
  "messages": { "昵称A": ["留言1", "留言2"] }
}
```

### 地区歌迷会数据 (hubs.js)

```javascript
const hubs = [
  {
    name: "北京歌迷会",
    members: 1200,
    lat: 39.9042,
    lng: 116.4074
  },
  // 更多歌迷会...
];
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 已知限制

- **并发写入**：gongju.dev 每次 POST 生成新链接、不可原地修改，多用户同时加入时存在「读后写」覆盖风险（数据丢失）。建议后续接入可原子追加的后端（如 Supabase / Cloudflare Workers + KV）。
- **第三方音源**：唱片播放器依赖非官方 API 获取歌曲链接，可能不稳定，正式上线建议替换为合规音源或跳转链接。

## 贡献指南

欢迎对项目进行贡献！如果你有任何改进建议或发现了bug，请：

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 致谢

- [Leaflet.js](https://leafletjs.com/) - 开源地图库
- [Font Awesome](https://fontawesome.com/) - 图标库
- 所有参与贡献的杰迷朋友

---

> "最美的不是下雨天，是曾与你躲过雨的屋檐"
> — 周杰伦

希望这个项目能让全球的杰迷朋友更加紧密地联系在一起！🎵