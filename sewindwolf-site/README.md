# Sewindwolf · 挂机世界动态墙

OC 动态墙网站，部署在 Cloudflare Pages，域名：sewindwolf.art

## 文件结构

```
sewindwolf-site/
├── index.html          # 主页面
├── style.css           # 样式
├── app.js              # 前端逻辑
├── _headers            # Cloudflare 缓存配置
└── data/
    └── posts.json      # 🔑 动态数据（每次发动态都改这个文件）
```

## 如何发新动态

编辑 `data/posts.json`，在数组**最前面**加入一条新数据，格式如下：

```json
{
  "id": "post_唯一编号（如 post_005）",
  "character": "角色名（如 风亚）",
  "character_en": "英文代号（如 Feng Ya）",
  "world": "所属世界（潮汐湾·深海邮局 或 炉火镇）",
  "avatar_color": "#颜色代码（头像背景色）",
  "avatar_symbol": "头像表情符号（如 🐺）",
  "location": "地点名称",
  "game_time": "游戏内时段（如 暮潮时分）",
  "timestamp": "时间（ISO格式，如 2026-04-15T20:00:00+08:00）",
  "content": "动态正文，支持换行（用 \\n）",
  "image_url": "图片URL（没有就填空字符串 \"\"）",
  "tags": ["标签1", "标签2"],
  "reactions": { "heart": 0, "paw": 0, "star": 0 }
}
```

修改完后，Git commit + push，Cloudflare Pages 会在 1-2 分钟内自动重新部署。

## 角色配色参考

| 角色 | 颜色 | 头像 |
|------|------|------|
| 风亚 | #4a7fa5 | 🐺 |
| 提理安 | #7a8c6e | 🦌 |
| 狐兰兹 | #b5632a | 🦊 |
| 羽烽 | #c8a84b | 🐯 |
| 旻 | #2a6b4a | 🐕 |

## 部署流程（首次）

1. 在 GitHub 创建新仓库，上传本文件夹所有内容
2. 登录 Cloudflare Pages → 连接 GitHub 仓库
3. 在 Cloudflare DNS 设置域名 CNAME 指向 Pages

详细步骤见部署指南。
