# Token FBI 部署说明

## 站点结构

本站由 `build.py`（纯 Python 标准库，无第三方依赖）从 `data.json` 生成静态站点到 `dist/`。

| 文件 | 作用 |
| --- | --- |
| `data.json` | 唯一数据真源：`items`（编辑收录 + 赞助位）、`retired`（下架名单） |
| `build.py` | 构建器：生成首页、`intel/item-NNN/` 详情页、`table/`、`about/`、`sponsor/`、404、`robots.txt`、`sitemap.xml`、`llms.txt`、`llms-full.txt`、公开 `data.json`、IndexNow 密钥、`_version.txt` |
| `assets/` | 图片素材，整体复制到 `dist/img/`（36 张 OG 分享图 + favicon 全套 + logo） |
| `poster-doubao-laxin.jpg` | 豆包拉新海报，复制到 `dist/` 根目录（`data.json` 的 `poster_url` 以绝对路径引用它） |

构建命令（本地与 Cloudflare 一致）：

```
python3 build.py
```

## 公开地址

- 正式域名：`https://token-fbi.com/`
- Cloudflare Pages 生产别名：`https://token-fbi.pages.dev/`，301 跳转到正式域名，保留路径和查询参数。
- 预览分支：`https://<分支名>.token-fbi.pages.dev`，已开启 Cloudflare Access 登录访问限制。

## 部署平台与归档

- **唯一正式部署平台：Cloudflare Pages**，GitHub `main` 提交自动构建并发布。
- **GitHub Pages 已于 2026-10-02 关闭**；历史 Actions 与 deployment 记录只作历史记录，不代表仍在发布。
- `.github/workflows/indexnow.yml` 保留，用于主站上线后的搜索引擎通知，不负责站点部署。
- 旧 `.edgeone/` 已完整归档到 `archive/edgeone-legacy/`，仅用于历史追溯，不参与当前构建或部署。

## Cloudflare Pages 设置

已连接 `hope0719/token-fbi`，当前设置（**无需改动**）：

| 项目 | 值 |
| --- | --- |
| 生产分支 | `main` |
| 框架预设 | 无 / None |
| 构建命令 | `npm run build` → `python3 build.py` |
| 构建输出目录 | `dist` |
| 根目录 | 仓库根目录 |

自定义域名 `token-fbi.com` 通过代理的 `CNAME @ → token-fbi.pages.dev` 绑定。

## 部署流程

1. 修改 `data.json`，新条目运行 `python3 scripts/assign_detail_ids.py` 分配固定详情 ID（该脚本同时为新条目写入 `added`＝当天日期，供首页「新增」五角星使用）。
2. 本地验证：`python3 build.py`，检查 `dist/` 产物完整。
3. 提交并推送到 `main`；Cloudflare Git 集成会自动重建并发布。
4. 验证线上：`curl https://token-fbi.com/_version.txt` 应等于本次提交 SHA。未核对前不称"已上线"。

> 推送到非 `main` 分支会生成预览部署，不影响生产。

## 图片素材

- `assets/og/*.jpg`：1200×630 分享图（站点默认图 + 每条详情页专属图）
- `assets/logo.png`：512×512 站点 logo
- `assets/favicon.ico`、`favicon-16x16.png`、`favicon-32x32.png`、`apple-touch-icon.png`、`icon-192.png`、`icon-512.png`

素材由 `gen_og_images.py` 在本地用 headless Chrome 生成。**该脚本依赖 Chrome，不在 Cloudflare 构建阶段运行**，因此图片必须先在本地生成并提交进仓库。数据变动后的完整流程：

```
python3 gen_og_images.py && python3 build.py
```

## 搜索引擎发现

- 正式域名是首页 canonical；`robots.txt` 放行全部主流 AI 爬虫（含 GPTBot、ClaudeBot、PerplexityBot、OAI-SearchBot、Bytespider、Baiduspider）。
- `sitemap.xml` 含首页、详情页、完整情报表、合作赞助页。
- `llms.txt` / `llms-full.txt` 提供 AI 可直接引用的全量条目（含已下架名单与下架原因）。
- `.github/workflows/indexnow.yml` 在 `main` 有新提交时轮询线上 `/_version.txt`，与本次提交 SHA 一致后从线上 `sitemap.xml` 批量推送 IndexNow。

## IndexNow 密钥

密钥同时写在两处，必须保持一致：

- `build.py` 的 `INDEXNOW_KEY` 常量（构建时输出到 `dist/<key>.txt`）
- 仓库根目录 `.indexnow-key`（供 GitHub Actions 读取）

参考：[Cloudflare Pages Git 集成](https://developers.cloudflare.com/pages/configuration/git-integration/) · [Cloudflare Pages 自定义域名](https://developers.cloudflare.com/pages/configuration/custom-domains/)

## 永久详情网址

- 每个条目的 `detail_slug` 固定为 **4 位序号 + 4 位小写英文字母**，共 8 位，例如 `/intel/0001abcd/`。
- ID 写入 `data.json` 后永久保留；排序、改名或移入观望区都不重新编号，不复用已分配的 ID。
- 添加新条目后先运行 `python3 scripts/assign_detail_ids.py`，再运行 `npm run check`。构建会拒绝缺失、重复或格式错误的 ID。
- `legacy_detail_paths` 保存旧详情路径，构建为 Cloudflare Pages `dist/_redirects` 中的 301 规则；保留原推广 302 规则。
- 首页、详情 canonical、结构化数据、情报表、sitemap 与 llms 输出使用同一个固定 ID。
- 观望与下架条目保留状态说明页，历史链接可以继续定位到对应条目。

## 首页「新增」五角星

- 条目在 `data.json` 里带 `added`（首次收录日期，`YYYY-MM-DD`）且距今不足 `NEW_DAYS` 天时，首页卡片**右上角**显示一枚金色五角星 ★。
- `added` 由 `scripts/assign_detail_ids.py` 在分配详情 ID 时**自动写入当天日期**，不要手工维护；缺失 `added` 的条目（2026-10-07 之前收录的历史条目）一律视为非新增，不会显示星标。
- 星标只出现在首页情报卡，不进完整情报表、不进详情页；页面不显示任何日期，"3 天" 仅是星标的存活窗口。
- 静态站只在 push 时重建，因此星标由页面内一小段脚本按 `data-exp`（到期时刻）自行摘除，避免超过 3 天后仍未重新部署的页面把星标一直挂着。
- 调整保留天数：改 `build.py` 顶部的 `NEW_DAYS`（默认 3）。
- **时区口径（务必遵守）**：`added` 的窗口判定与星标到期时刻一律按**北京时间（UTC+8）**计算，不依赖构建机时区。本机是 CST、Cloudflare 构建机是 UTC，两边结果必须完全一致 —— 验证方式：`TZ=UTC python3 build.py` 与本地构建产出的 `data-exp` 应逐字节相同。若改回用 `date.today()` / 裸 `datetime.now()`，会出现两种故障：① 到期时刻随构建机漂移 8 小时（线上曾出现北京 10-10 08:00 而非 00:00）；② 北京时间 00:00–08:00 之间构建时 UTC 仍停在前一天，当天新增条目**不出星**。
- 校验：构建日志末尾的 `newstar=N` 为注入自摘脚本的页面数（正常为 1，即首页）；或直接跑 `python3 scripts/check_star.py`（比对 `data.json` 的 `added` 口径与首页实际渲染结果，不符即非 0 退出）。
