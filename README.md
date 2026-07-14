# Token 情报局 · Token FBI

> 我们在调查哪家的 token 最香。

一个爱好者自发维护的**免费 AI token 情报站**：汇总现在还能免费拿到的 token——有哪些、效果怎么样、怎么领。
本站非官方、不接暗广，只帮你看清哪家的免费额度最值得冲。

## 站点结构

```
token-fbi/
├── index.html   # 页面骨架（头部 / Hero / 列表 / 关于 / 投稿 / 页脚）
├── style.css    # 样式（深色情报局风 + 琥珀金强调色）
├── app.js       # 卡片数据 + 渲染 + 分类筛选
└── README.md
```

## 怎么加一条情报

打开 `app.js`，找到顶部的 `TOKENS` 数组，复制其中一个 `{...}` 对象粘到数组里，改字段即可：

| 字段 | 含义 |
| --- | --- |
| `name` | 平台名 |
| `type` | 分类：`大模型` / `绘图` / `视频` / `工具`（要加新分类，记得在 `index.html` 的 `#filters` 里加一个按钮） |
| `rating` | 香度 1~5（几颗火 🔥） |
| `quota` | 免费额度说明 |
| `effect` | 效果怎么样 |
| `how` | 怎么拿 |
| `link` | 领取入口链接 |
| `updated` | 更新日期，如 `2026-07-14` |

> 提示：情报有时效，领之前请以各家官方页面为准。

## 本地预览

```bash
cd token-fbi
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，名称建议用 `token-fbi`。
2. 把本目录内容推上去：
   ```bash
   git init
   git add .
   git commit -m "init Token FBI"
   git branch -M main
   git remote add origin git@github.com:hope0719/token-fbi.git
   git push -u origin main
   ```
3. 仓库 **Settings → Pages**，Source 选 `main` 分支根目录，保存。
4. 稍等片刻，访问 `https://hope0719.github.io/token-fbi/` 即可。

## 投稿

发现哪家有新免费额度？两种渠道都欢迎：

- **GitHub**：在仓库提 Issue 或 PR（入口见页脚「去 GitHub 投稿」）。
- **微信**：扫码添加站长微信，备注「Token FBI」，拉你进群直接爆料交流。二维码见页面投稿区。
