# 自动更新 · 执行摘要

## 2026-10-04（首次执行，09:00 定时触发）
- **状态**：成功。站点已重建并验证 200。
- **关键发现**：本地 `/Users/hope/Desktop/token 无限/token-fbi` 初始为空（非 git 仓库）。实际仓库在 GitHub `hope0719/token-fbi`，站点已迁移为 `data.json` + `build.py` → Cloudflare Pages 自动部署（旧版 `app.js`/`TOKENS` 已废弃）。本次先 `git clone` 再更新。
- **新增 4 条免费 token 情报**（均经多源核实、国内可访问、真实免费）：
  1. 腾讯元器（混元 Hunyuan，新模型→数组前）— 新户 1 亿 Token + 10 万次/月免费 API。
  2. DeepSeek 开放平台（DeepSeek V4，新模型→数组前）— 新开发者 500 万 Tokens(30天) + 网页/App 长期免费。
  3. 百度千帆（文心 ERNIE，较老→数组后）— ERNIE-Speed/Lite 长期免费 + 新户每模型 100 万 Tokens(3个月)。
  4. 讯飞星火（Spark，较老→数组后）— Spark Lite 永久免费 API + 星辰 MaaS 0 元无限量。
- **数据变更**：`total` 40→44，`last_updated`→2026-10-04；无重复、无付费抵扣券。
- **构建/部署**：`python3 build.py` 成功（44 项 / 43 详情页）；commit `a5eab3d`；`git push -u origin main` 成功；Cloudflare Pages 重建后 `token-fbi.com` 200、`/data.json` 已更新。
- **已修正**：将本自动化存储的指令从过时的 `app.js`/`TOKENS` 改为真实 `data.json`+`build.py` 流程（保留每天 9 点调度），避免后续执行失败。

## 2026-10-05（第二次执行，09:00 定时触发；push 于 10-06 00:49 续跑完成）
- **状态**：成功。站点已重建并验证 200，线上 `data.json` 同步（last_updated=2026-10-05、total=46）。
- **新增 2 条真实免费情报**（经多源核实、排除 items/retired 已收录平台）：
  1. APMIX（限时活动，模型 `gpt-6-luna-free`，共享 100 亿加权 Tokens 池，10/2 开启，OpenAI/Anthropic 兼容，免费档即可；海外服务）→ 较新模型置数组前。
  2. 智谱AI / Z.AI 开放平台（长期免费，新户 2000 万 Tokens + GLM-4.7-Flash 等注册即免，国内直连）→ 较新模型置数组前。
- **数据变更**：total 44→46，last_updated→2026-10-05；无重复、无付费抵扣券。
- **构建/部署**：`python3 build.py` 成功（46 项 / 45 详情页）；commit `f354c72`；首次 `git push -u origin main` 静默失败（origin/main 停在 a5eab3d，本地 `ahead 1`），续跑后推送成功；Cloudflare Pages 重建后 `token-fbi.com` 200、`/_version.txt`=f354c72、线上 `data.json` 已更新。
- **关键注意**：
  - 推送失败时 `git status` 显示 `ahead 1`，不可误判为已完成；必须以线上 `_version.txt` 与 `data.json` 复核为准。
  - 构建侧 `CAT_LABEL` 仅支持 model/tool/event，任务描述的 `GLM5.2` 分类在实际 build.py 不存在，新建条目统一用 `category:"model"`。
  - 腾讯云 TokenHub 搜索显示重新开放"新户每模型 100 万 Tokens（至 2026-12-31）”，但其在 `retired` 列表（原因：活动收口），本次按排除规则未收录，标记待人工复核。

## 2026-10-06（手动下架，非定时触发）
- **状态**：成功。用户明确指令将「腾讯元器」与「DeepSeek 开放平台」下架，并永不上架。
- **数据变更**：从 `items` 移除 2 条，移入 `retired` 并标注 reason 为「用户明确要求永不上架（2026-10-06）」；`total` 46→44，`last_updated`→2026-10-06。
- **构建/部署**：`python3 build.py` 成功（44 项 / 43 详情页）；commit `992d601`；`git push -u origin main` 成功；Cloudflare Pages 重建后 `token-fbi.com` 200、`/_version.txt`=992d601、线上 `data.json` 已更新（last_updated=2026-10-06, total=44）。
- **规则沉淀**：项目 `MEMORY.md` 已追加「永不上架黑名单」，后续自动更新发现同名平台时应跳过并记录待人工复核。

## 2026-10-06（手动移入观望区，非定时触发）
- **状态**：成功。用户指令将「七牛云 AI 推理」移入观望区。
- **数据/功能变更**：
  - `data.json` 新增 `watchlist` 数组（`name` / `url` / `reason`）。
  - 将「七牛云 AI 推理」从 `items` 移入 `watchlist`。
  - 修改 `build.py`：加载 `watchlist`、生成观望区 HTML、在首页「下架名单」前渲染；观望区不计入 `total`。
  - `total` 44→43，`last_updated`→2026-10-06。
- **构建/部署**：`python3 build.py` 成功（43 项 / 42 详情页）；commit `201b1ed`（含 `data.json` + `build.py`）；`git push -u origin main` 成功；Cloudflare Pages 重建后 `token-fbi.com` 200、`/_version.txt`=201b1ed、线上 `data.json` 已更新（last_updated=2026-10-06, total=43）。
- **规则沉淀**：项目 `MEMORY.md` 已追加「观望区机制」，说明使用场景与后续流转规则（可移回 `items` 或转入 `retired`）。

## 2026-10-06（手动关闭站长推荐角标，非定时触发）
- **状态**：成功。用户指令去掉卡片右上角的「站长推荐」标识。
- **变更**：修改 `build.py`，将 `RECO_NAMES` 从 `["阶跃星辰 StepFun", "美团 longcat 大模型", "Google Antigravity（反重力）"]` 清空为 `[]`；`RECO_SET` 同步为空，所有卡片不再渲染「⭐ 站长推荐」角标。
- **构建/部署**：`python3 build.py` 成功（43 项 / 42 详情页）；commit `e487f35`（仅 `build.py`）；`git push -u origin main` 成功；Cloudflare Pages 重建后 `token-fbi.com` 200、`/_version.txt`=e487f35。
- **规则沉淀**：项目 `MEMORY.md` 已追加「站长推荐角标（关闭）」规则，说明如需恢复可修改 `RECO_NAMES` 列表。

## 2026-10-06（手动恢复站长推荐角标，非定时触发）
- **状态**：成功。用户指令在 WorkBuddy 国际版卡片右上角加回「站长推荐」标识。
- **变更**：修改 `build.py`，将 `RECO_NAMES` 从 `[]` 恢复为 `["WorkBuddy 国际版"]`；仅 WorkBuddy 国际版卡片渲染「⭐ 站长推荐」角标。
- **构建/部署**：`python3 build.py` 成功（43 项 / 42 详情页）；commit `db84972`（仅 `build.py`）；`git push -u origin main` 成功；Cloudflare Pages 重建后 `token-fbi.com` 200、`/_version.txt`=db84972。
- **规则沉淀**：项目 `MEMORY.md` 已更新「站长推荐角标」规则，当前 `RECO_NAMES = ["WorkBuddy 国际版"]`。

## 2026-10-06（手动将百度千帆与讯飞星火移入观望区，非定时触发）
- **状态**：成功。用户指令将「百度千帆（文心）」与「讯飞星火（开放平台）」移入观望区。
- **变更**：修改 `data.json`，将 2 条记录从 `items` 移入 `watchlist`（保留 `name` / `url` / `reason`），reason 标注为「用户于 2026-10-06 要求移入观望区，待观察免费额度政策是否稳定」。
- **数据变更**：`total` 43→41，`last_updated`→2026-10-06。
- **构建/部署**：`python3 build.py` 成功（41 项 / 40 详情页）；commit `81cda1e`（仅 `data.json`）；`git push -u origin main` 成功；Cloudflare Pages 重建后 `token-fbi.com` 200、`/_version.txt`=81cda1e、线上 `data.json` 已更新（last_updated=2026-10-06, total=41）。
- **规则沉淀**：项目 `MEMORY.md` 已更新「观望区机制」当前条目列表。

## 2026-10-08（09:00 定时自动更新）
- **状态**：成功。站点已重建并验证 200，线上 `_version.txt` 与提交一致。
- **新增 2 条情报**（append 到 items 末尾，未插队）：腾讯 LightVela（新用户免费 1 个月 + 4500 AI 积分，需实名 + 0 元支付）；Freebuff（广告资助免费 coding agent，$0/月无卡，每天约 10 小时 GLM 5.3 Flash / DeepSeek V4.1 Flash，标 region=国际）。另加 2 条观望：Coderblock、百度 AI Studio。
- **数据变更**：items 39→41，total 41，last_updated 2026-10-08；新条目均带 `added` 字段触发首页星标，`check_star.py` 通过。
- **构建/部署**：commit `3ec1d05`，push 成功；Cloudflare Pages 重建后首页 200、线上 data.json 已更新（items 38 = 41 剔 3 条赞助，属正常）。
- **关键注意（下次务必先看）**：
  - 远端常领先本地（用户白天会改 build.py / data.json）。push 被拒后**不要手工解 data.json 冲突**：改为 `rebase --abort` → 导出新增条目 → `reset --hard origin/main` → 重跑 append → 重分配 ID → 重建。
  - 远端 2026-10-07 起新增 `added` 字段（YYYY-MM-DD）驱动首页「新增」五角星（3 天，UTC+8），**新条目必须写入 `added`**，否则首页无新增标记。
  - `scripts/assign_detail_ids.py` 已升级，会同时处理 items/watchlist/retired 并写入 added；构建后建议再跑 `scripts/check_star.py`。

## 2026-10-09（09:00 定时自动更新）
- **状态**：成功。构建通过、推送成功、线上首页 200 且 `_version.txt` 与提交一致。
- **新增 2 条情报**（append 到 items 末尾，未插队）：豆包工作（30 天订阅，限时活动，validity=2026-10-17，国内）；OVHcloud AI Endpoints（免费层，region=国际，匿名档免注册免 Key，约 2 RPM，8 款开源模型）。另加 3 条观望：LLM7.io、FreeTheAI、Codiv.ai（OpenJev）。
- **数据变更**：items 39→41，total=41，watchlist 19→22，last_updated=2026-10-09；新条目 `added=2026-10-09` 触发首页星标，`check_star.py` 通过（6 个星标）。
- **构建/部署**：commit `b11a242`，push 成功（79f9fda..b11a242，HEAD=origin/main）；Cloudflare 重建后首页 200、线上 data.json last_updated=2026-10-09。
- **关键注意（下次先看）**：
  - 本次未新建 **Step 5 Preview 限时免费一周** 卡片：按「同一平台的免费活动不单独收录」约定（见 retired 中 GLM-5.3-Flash 并入 ZCode），且 Cline / Kilo Code 已是独立卡片、StepFun 卡片 modality 已含 step-5-preview。已记入项目 MEMORY.md「收录边界约定复核（2026-10-09）」，待用户裁定是否单独成卡。
  - 搜索时 `freellm.net` / `inferencehub.org` / `freetokens.custats.info` 是高频来源，但属第三方目录（非官方），需二次交叉验证；`awesome-freellm-apis` 类竞品 GitHub 清单禁止整批灌入。
  - 国际小型聚合站（LLM7.io / FreeTheAI / Codiv.ai / Y-API）与带返佣的公益中转站（Conduit / AgentRouter / DoCode / JustDoWork）一律不进 items，最多进 watchlist。

## 2026-10-10（09:00 定时自动更新）
- **状态**：成功。构建通过、推送成功、线上首页 200 且 `_version.txt` 与提交 `ebe01d9` 一致。
- **新增 1 条情报**（append 到 items 末尾，未插队）：Step 5 Preview 限时免费（Nous Portal / OpenCode）— event / 限时活动 / validity=2026-10-15 / region=国际 / detail_slug=0081fhdd。另加 3 条观望：Nous Portal、Cerebras Cloud、Kite AI Marathon。
- **数据变更**：items 41→42，total=42，watchlist 22→25，last_updated=2026-10-10；新条目 `added=2026-10-10`，`check_star.py` 通过（4 星标）；data-exp 本地与 TZ=UTC 构建一致。
- **构建/部署**：commit `ebe01d9`；远端已领先（46a07fd / 5bf54dd 仅改 build.py），`git stash`（MEMORY.md 挡住 rebase）→ `git rebase origin/main` → `stash pop` → 用远端 build.py 重跑 build → push 成功（5bf54dd..ebe01d9）。
- **关键注意（下次先看）**：
  - **Step 5 Preview 本次改为单独成卡**（推翻 10-09「不单独收录」的临时约定）：因其新增了 Nous Portal 这一第三方平台入口、且为 10-08 起的限时活动（validity=2026-10-15）。若用户认为与 `阶跃星辰 StepFun` 卡重复，可随时移入 retired/watchlist。
  - **推送被拒处理**：先 `git fetch` 看远端改了什么；若仅 build.py 等非 data.json 文件变化 → 直接 `git rebase origin/main`（比 reset --hard 重跑更省事）。被已跟踪的 `.workbuddy/memory/MEMORY.md` 挡住时先 `git stash push -- <该文件>`。
  - **CodeBuddy 国内版** 与站点 `WorkBuddy` 卡同属 codebuddy.cn 生态（WorkBuddy 卡 entry_url 即 codebuddy.cn），**不单独成卡**，避免重复。
  - 国际聚合器（Nous Portal / Y-API / Parasail）与海外消费级 Agent（Meta Muse AI）一律不进 items，最多 watchlist；需绑卡的免费层（Cerebras）亦移入 watchlist。

## 2026-10-11（09:00 定时自动更新）
- **状态**：成功。构建通过、推送成功（`ebe01d9..16aeae8`）、线上首页 200 且 `_version.txt` 与提交 `16aeae8` 一致（重建约 20s 完成，本地=远端）。
- **新增 1 条情报**（append 到 items 末尾，未插队）：智谱 AutoClaw 每周登录福利（GLM-5.3-Flash）— event / 限时活动 / validity=2026-10-16 / 国内 / detail_slug=0085puck。10/12 登录领 10,000 Credits（约 1 亿 Tokens），10/13–10/16 每日 800 Credits（约 800 万），最高合计约 1.32 亿 Tokens。另加 2 条观望：AionClaw（杭州趣猿，SEO 稿来源待核）、Claude Max / Team 月度 API 额度（需付费订阅）。
- **数据变更**：items 42→43，total=43（线上公开 40 = 43 剔 3 赞助），watchlist 25→27，last_updated=2026-10-11；新条目 `added=2026-10-11`，`check_star.py` 通过（4 星标）。三个新详情页线上均 200。
- **关键注意（下次先看）**：
  - **AutoClaw 不与 ZCode 合并**：同厂不同产品（ZCode=Coding Plan 订阅；AutoClaw=桌面 Agent，独立注册与 credits），已记入项目 MEMORY.md。
  - **不收的同平台活动**：腾讯混元 Hy3 限免 / Hy4 preview 夜间限免（延至 10-31，属接入 WorkBuddy 的模型级活动，站内已有 WorkBuddy 卡）、OpenCode Zen 的 Exo Free / Muse Spark 1.3（已有 OpenCode Zen 卡）、Qoder CN 每日 100 Credits、国际版 TRAE 7 天试用。
  - **不收的其他类型**：海外小型工具 signup credit（Mio $50 / Viktor $100 / Valyu $10–20）、身份限定类（GitHub Copilot Pro 教师 / ChatGPT for Teachers）。
  - 本次远端与本地同起点，推送一次成功，无需 rebase；`http.version=HTTP/1.1`、无代理的既有配置保持不变即可。

## 2026-10-06（09:00 定时自动更新）
- **状态**：成功。站点已重建并验证 200，线上 `data.json` 同步（last_updated=2026-10-06）。
- **新增 4 条真实免费情报**（经多源核实、排除 items/retired/watchlist 已收录与付费券；SambaNova 因需绑卡已排除）：
  1. Mistral La Plateforme（Experiment 免费档，手机验证，约 10 亿 Tokens/月）— 新模型置数组前。
  2. xAI Grok / console.x.ai（新账户 $25 额度，无需绑卡）— 新模型置数组前。
  3. Cohere Trial Key（无限期免费 Key，非商用低 RPS）— 成熟稳定置数组后。
  4. 腾讯云混元大模型（hunyuan-lite 永久免费 + 新户 100 万 Token/年）— 成熟稳定置数组后。
- **数据变更**：total 41→45，last_updated→2026-10-06；无重复、无付费抵扣券。
- **构建/部署**：`build.py` 须用 managed Python 3.13（系统 3.9 不支持新 f-string PEP 701）；成功（45 项 / 44 详情页）；commit `3184b5b`；`git push -u origin main` 成功；Cloudflare Pages 重建后 `token-fbi.com` 200、`/data.json` last_updated=2026-10-06。
- **关键注意**：
  - 线上 `data.json` 的 `items` 为 42 而非 45：build.py 仅发布非赞助条目（`editorial = items 去掉 sponsored`），根 `data.json` 含 45 条（含 3 条 sponsored）。新增 4 条均非赞助，已上线，无需处理。
  - 推送前确认无死代理（git 全局 socks5 127.0.0.1:7890 已移除、`http.version=HTTP/1.1`）；远端 HEAD 与本地提交一致。

## 2026-10-12（09:00 定时自动更新）
- **状态**：成功。构建通过、推送成功（`16aeae8..e815b65`，无 rebase）、线上首页 200 且 `_version.txt` 与提交 `e815b65` 一致，新详情页 200。
- **新增 1 条情报**（append 到 items 末尾，未插队）：联通云 Coding Plan（免费体验）— tool / **free_type=免费层** / 国内 / detail_slug=0088pexh。Lite ¥0/月 1.8 万次/月、Pro ¥0/月 最高 9 万次/月，合计 12,000 免费名额先到先得，Key 有效期 31 天，OpenAI 兼容可接 OpenClaw。另加 2 条观望：Heicode 智能研发平台（0089dcan）、Tokenator API（0090zloz）。
- **数据变更**：items 43→44，total=44（线上公开 41 = 44 剔 3 赞助），watchlist 27→29，last_updated=2026-10-12；`check_star.py` 通过（3 星标）。
- **关键注意（下次先看）**：
  - **限量名额制但无 ISO 截止日 → 用 `free_type=免费层`，不要硬凑「限时活动」**：收录硬门槛要求限时活动必须带 validity，官方未公布日期时编造日期会污染数据。联通云 Coding Plan 即按此处理。
  - **地方政府/运营商定向补贴券不收**：上海张江算力/模型/语料券、江苏省省级词元券（单家最高 500 万）虽名为「券」，但属区域或企业定向、非全国个人公开可领，按门槛排除。
  - **专用小模型免费 API 不收**：HAL-X AI THX-01（322M 决策/分类模型，免注册免 Key）不属通用大模型 token 额度，不符合站点定位。
  - **同活动续期不新开卡**：AutoClaw 10/12–10/16 新一期（最高 1.32 亿 Tokens）与 10-11 卡 `0085puck` 为同一活动续期；Step 5 Preview 10-15 开源属模型开源发布，站内已有卡。
  - 本次远端与本地同起点，推送一次成功；`.workbuddy/memory/MEMORY.md` 仍有未提交改动（历次遗留），未影响本次 push。

## 2026-10-13（09:00 定时自动更新）
- **状态**：成功。构建通过、推送成功、线上首页 200 且 `_version.txt` 与提交一致。
- **items 无新增**：约 13 次搜索未发现满足硬门槛的新平台；命中项全部为已收录或已在 retired/watchlist（Groq/Kimi/Gemini/GitHub Copilot 早已 retired）。**watchlist +2**：京东云 JoyCode（`0091fxiq`，额度口径 5000/50000 冲突待核）、Gonka Broker（`0092onmi`，国际、免费 1M–1.25M Tokens/月、需手机验证且拒 +86、6 RPM）。**既有卡复核 1 条**：硅基流动 `0013uppn` 更新 note+last_verified（官方页需登录无法核实；第三方称小模型永久免费 2026-09 已取消、2000 万 token 无官方出处；free-llm.com 仍称保留滚动免费小模型 → 未改 quota/free_type）。
- **数据变更**：items 43（不变），watchlist 29→31，total 43，last_updated=2026-10-13；`check_star.py` 通过（2 星标）；92 条 slug 全部有效唯一。
- **构建/部署**：commit `e9fb073`（仅 data.json，dist 被 .gitignore 忽略）；`git push -u origin main` 成功。
- **关键注意（下次先看）**：
  - **`.workbuddy/` 已在 .gitignore 中，但历史 memory 文件仍被跟踪** → `git add .workbuddy/...` 会报「paths are ignored」且退出码 1，会打断 `&&` 链导致后续 push 不执行。要么用 `git add -f`，要么把 memory 提交单独放最后、不与 push 串联。本次因此重跑了一次 push。
  - **搜索源已高度饱和**：smzdm「全网 AI 产品免费权益清单」（每日更新）、freellm.net、free-llm.com、models.hummingg.com、toolfreebie.com 是主要线索源；国内厂商（阿里/火山/商汤/讯飞/腾讯/智谱）免费额度近两周无实质变化，后续「零新增」将成常态，不必强行凑条目。
  - **判定沿用**：消费级免费（ChatGPT 免费层/腾讯元宝）与折扣（TraeCode 1 折、MiniMax 首月 5 折）不进 items；需订阅在效的活动（MiniMax Code 10/10–10/18 签到送 Reset Card）不收；返还代金券（阿里 AI 用量加速）与无门槛代金券（硅基流动 16 元）属抵扣券，排除。
  - 记忆治理：本次已将项目 `MEMORY.md` 由 18.2KB 精简重写至约 3KB（含观望区清单合并），后续新条目只需在其中追加一行。
