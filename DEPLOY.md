# Token FBI 自动发布

## 现有公开地址

- GitHub Pages：`https://hope0719.github.io/token-fbi/`，从本仓库 `main` 分支根目录自动发布。
- Cloudflare Pages：`https://token-fbi.pages.dev/`，已连接本仓库 `main` 分支，以 `npm run build` 构建 `dist/`。公开页面与全部五个资源文件已核对。
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

绑定正式域名时，在 Pages 的「自定义域名」中添加，并按向导配置 DNS。域名生效及线上内容核对通过后，再把 README 和页面分享文案中的主地址改成正式域名。

Cloudflare Git 集成会在 `main` 有新提交时自动重新构建并发布。构建脚本只把运行站点必需的五个文件复制到 `dist/`；仓库中的文章、草稿、工具和本地素材不会成为 Pages 站点文件。

## 日常更新

1. 根据官方来源核对情报，在 `app.js` 的 `TOKENS` 中新增或修改卡片，并更新该卡的 `updated` 日期；必要时同步 README 更新记录。
2. 在仓库目录运行 `npm run check`，确认脚本语法和发布文件完整。
3. 提交并推送到 `main`。GitHub Pages 会自动发布；接入 Git 集成后的 Cloudflare Pages 也会自动发布。
4. 查看两处部署结果，并以线上 `app.js` 内容或哈希与本地文件对比，确认公开页面确实更新。未完成这一步时，不把更新称作已上线。

参考：[Cloudflare Pages Git 集成](https://developers.cloudflare.com/pages/configuration/git-integration/) · [Cloudflare Pages 自定义域名](https://developers.cloudflare.com/pages/configuration/custom-domains/)
