# 唯一生产工作目录

**规范路径**：`/Users/hope/Desktop/token 情报局/生产仓库-token-fbi`
**远端**：`https://github.com/hope0719/token-fbi.git`（分支 `main`）
**线上**：`https://token-fbi.com`（Cloudflare Pages，push 即构建）

所有改数据、改模板、构建、提交、推送都只在本目录进行。除本目录外，桌面上任何
`token-fbi-*` 目录都只是历史副本，**不参与生产，不要在其中编辑或推送**。

## 目录职责

| 路径 | 状态 | 说明 |
|---|---|---|
| `生产仓库-token-fbi/`（本目录） | ✅ 唯一生产 | `data.json` + `build.py` + `traffic.json`，唯一可 push 的克隆 |
| `归档-历史副本/token-fbi-2026-09-25/` | 🧊 只读 | 9 月旧站形态，git 远端已禁用推送 |
| `归档-历史副本/token-fbi-next-2026-09-29/` | 🧊 只读 | 9 月底改版中间态，无 git |
| `归档-历史副本/token-fbi-maintenance-2026-10-20/` | 🧊 只读 | 10-20 维护快照，落后生产 1 个提交，git 远端已禁用推送 |
| `数据与构建/token-fbi-data/` | 🧊 只读 | 9 月旧流水线（`build_site.py`，41 条数据），勿再使用 |

## 为什么收敛

历史上有 3 个克隆共用同一个 GitHub 远端。克隆内容陈旧但 `git status` 是干净的，
一旦在错的目录里改数据再 push，生产站会被旧数据覆盖，而 `_version.txt` 只校验提交
SHA、发现不了内容回退。因此：

1. 只认本目录；
2. 归档克隆已把 `origin` 改名为 `archived-donot-push`，push URL 指向无效协议，防止误推；
3. 需要新的实验分支时，在本目录开 `git worktree`，不要整目录复制。

## 每日更新流程

```bash
cd "/Users/hope/Desktop/token 情报局/生产仓库-token-fbi"
# 改 data.json -> 分配 ID -> 构建 -> 校验 -> 提交 -> 推送 -> 核对 _version.txt
```
