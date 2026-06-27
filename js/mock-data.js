/**
 * 虚拟歌迷数据（Mock Data）
 *
 * 当前状态：已迁移到云端 GitHub Gist 存储，本地不再生成虚拟用户。
 * 2000 个用户数据已上传至云端 Gist 的 users.json 文件。
 *
 * 本文件保留空数组作为 fallback 占位，当云端不可用时地图将显示空状态。
 * 如需恢复本地虚拟数据，可取消下方 generateMockUsers 相关注释。
 *
 * 数据结构与真实用户一致：{ nickname, avatar, lat, lng, timestamp }
 */

/**
 * 虚拟用户列表（已迁移到云端，本地置空）
 * 云端 Gist 不可用时 fallback 为空数组，地图将不显示标记点
 */
const MOCK_USERS = [];
