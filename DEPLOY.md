# Token FBI 自动发布

## 现有公开地址

- GitHub Pages：`https://hope0719.github.io/token-fbi/`，从本仓库 `main` 分支根目录自动发布。
- Cloudflare Pages：`https://token-fbi.pages.dev/`，已连接本仓库 `main` 分支，以 `npm run build` 构建 `dist/`。公开页面与全部五个资源文件已核对。
- 正式域名：`https://token-fbi.com/`，在同一 Cloudflare 帐户的 Pages 项目中绑定根域；域名可用后作为站内分享地址。
- README 中的 WorkBuddy 主站是另一条发布链路。不能仅凭当前页面一致，就认定它会随 GitHub 推送自动更新；每次更新需单独核对。

## Cloudflare Pages 构建设置

Cloudflare Pages 已连接 `hope0719/token-fbi`，当前设置：

| 项目 | 值 |
| --- | --- |
| 生产分支 | `main` |
| 框架预设 | 无 / None |
| 构建命令 | `npm run build` |
| 构建输出目录 | `dist` |
| 根目录 | 仓库根目录 |

根域名在 Pages 的「自定义域名」中绑定，DNS 记录为代理的 `CNAME @ → token-fbi.pages.dev`。发布前应检查域名状态、HTTPS 证书、首页与资源文件，并确认页面分享地址指向正式域名。

Cloudflare Git 集成会在 `main` 有新提交时自动重新构建并发布。构建脚本复制运行站点必需的五个源文件，并额外生成可直接抓取的首页卡片、`robots.txt`、`sitemap.xml`、`llms.txt`、IndexNow 验证文件和部署版本文件；仓库中的文章、草稿、工具和本地素材不会成为 Pages 站点文件。

## 搜索引擎发现

- 正式域名 `https://token-fbi.com/` 是首页的 canonical URL。Cloudflare Pages、GitHub Pages 等其他地址的相同页面也指向它。
- 构建时从 `app.js` 的现有卡片数据与筛选规则生成静态 HTML，搜索引擎不用执行 JavaScript 就能看到当前卡片。浏览器运行 JavaScript 后仍使用原有交互。
- `robots.txt` 放行抓取并声明 `sitemap.xml`；站点地图目前只包含唯一的公开首页。
- GitHub Actions 的 `indexnow.yml` 等待 Cloudflare Pages 发布同一提交后，将首页变更通知 IndexNow 参与的搜索引擎。IndexNow 的接收回执不等于已收录。
- Google Search Console 与 Bing Webmaster Tools 的站点验证及 sitemap 提交需要在对应账号中完成；站点文件上线本身不保证收录或排名。

## 日常更新

1. 根据官方来源核对情报，在 `app.js` 的 `TOKENS` 中新增或修改卡片，并更新该卡的 `updated` 日期；必要时同步 README 更新记录。
2. 在仓库目录运行 `npm run check`，确认脚本语法和发布文件完整。
3. 提交并推送到 `main`。GitHub Pages 会自动发布；接入 Git 集成后的 Cloudflare Pages 也会自动发布。
4. 查看两处部署结果，并以线上 `app.js` 内容或哈希与本地文件对比，确认公开页面确实更新。未完成这一步时，不把更新称作已上线。

参考：[Cloudflare Pages Git 集成](https://developers.cloudflare.com/pages/configuration/git-integration/) · [Cloudflare Pages 自定义域名](https://developers.cloudflare.com/pages/configuration/custom-domains/)
