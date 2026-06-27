# 部署指南

> 本项目已从早期的 PHP + 本地 `users.json` 方案迁移为 **纯前端 + gongju.dev 云端 JSON 存储**，无需任何后端运行环境。

## 一、本地预览

任选一种方式启动静态服务：

```bash
# 方式 1：Python 内置服务器
python -m http.server 8000

# 方式 2：Node http-server
npx http-server -p 8000
```

浏览器访问 `http://localhost:8000` 即可。

> 也可直接用 VS Code 的 Live Server 插件打开 `index.html`。但不建议用 `file://` 协议直接打开，部分浏览器会限制本地文件下的网络请求。

## 二、线上部署

整个目录是纯静态资源，可托管到任意静态站点服务：

| 平台 | 说明 |
| --- | --- |
| GitHub Pages | 推送仓库后在 Settings → Pages 开启，根目录部署 |
| Vercel / Netlify | 导入仓库，框架预设选「Other」，构建命令留空 |
| Nginx / Apache | 将目录上传至站点根目录，按静态文件正常配置即可 |

无需配置 PHP、数据库或写入权限。

## 三、云存储配置

项目默认使用 gongju.dev 作为数据存储，开箱即用。如需独立的数据空间：

1. 打开 `js/config.js`
2. 修改 `INDEX_ID`（存储用户数据批次索引）与 `INTERACT_ID`（存储打call/留言互动数据）
3. 首次使用时，可先清空 `localStorage` 中的 `fansmap_index_id`、`fansmap_interact_id`，让程序自动创建新存储

数据版本号 `DATA_VERSION` 用于在结构变更时强制清除浏览器旧缓存，升级数据结构时递增此值即可。

## 四、已知限制与优化方向

- **并发写入覆盖**：gongju.dev 每次 POST 会生成新链接且不可原地修改，多用户同时提交存在「读后写」覆盖风险。若用户量增长，建议接入可原子追加的后端（如 Supabase、Cloudflare Workers + KV、或自建 PHP 写接口）。
- **历史文件**：根目录的 `users.json` 为旧版 PHP 方案残留，当前已不参与读写，可按需删除或归档。
