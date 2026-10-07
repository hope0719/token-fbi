# Token FBI 项目长期记忆

## 数据来源（2026-10-07 纠正）
- **唯一数据源是 `data.json` 的 `items` 数组**（早期 app.js 时代已废弃，本站改由 `build.py` 从 `data.json` 生成 `dist/` 静态站，Cloudflare Pages 自动构建）。
- 每张卡字段（data.json 现行 schema）：`name` / `vendor` / `category`（model|tool|event）/ `free_type`（长期免费|注册赠送|限时活动|每日赠送|免费层|付费中转）/ `quota` / `validity`（限时活动 ISO 截止日）/ `region`（国内留空|国际）/ `gates`（绑卡/手机号等门槛）/ `note` / `sponsored`（赞助位标记）/ `entry_url` / `intel_url` / `signup` / `modality` / `last_verified` / `update_source`。
- 另设 `watchlist`（观望区）与 `retired`（下架名单）两个独立数组，均不计入 `total`，不进首页卡片与完整情报表。
- 分类规则（`build.py` 的 `catOf`）：`category="tool"` → 工具；`modality` 含 GLM5.2 → GLM5.2；其余 → 大模型。

## 收录硬门槛（2026-10-07 新增，任一不满足即不收或先入 watchlist）
1. 确有**可公开领取**的真实免费额度；**排除**付费抵扣券、绑卡付费、纯赞助（赞助位单独隔离，禁止标「免费」）。
2. 限时活动（`free_type=限时活动` 或 `category=event`）**必须带 `validity` ISO 截止日**，构建时自动加「限时」角标。
3. 国内可直连优先；「国际」only 且需海外网络环境的单独标注，不与国内卡混排。
4. 同构聚合器（OpenRouter 式）只保留 1–2 个代表，不堆量。
5. 来源须经过滤：**禁止从竞品 GitHub `awesome-free-llm` 类清单整批灌入**；每条须人工核验免费额度口径后再入 `items`。

## 详情页永久 ID 体系（2026-10-07 新推送 3abf809，必读）
- 每个条目（items + watchlist + retired 全部）必须带 `detail_slug`：**4 位数字 + 4 位小写字母**，共 8 位，例如 `/intel/0001hgwg/`。
- ID 写入 `data.json` 后**永久保留**；排序、改名、移入观望区/下架都不重新编号，已分配 ID 不复用。
- **强制流程（新增条目时）**：先 `python3 scripts/assign_detail_ids.py` 分配 ID → 再 `npm run check`（即 `build.py`）。`build.py` 会在以下情况**直接报错中断**：缺 `detail_slug` / 格式不符 `/^[0-9]{4}[a-z]{4}$/` / ID 重复。脚本按现有最大序号 +1 顺延，后缀由 name 的 sha256 派生，保留已有 ID。
- **展望/下架条目也保留状态说明页**（free_type 标「观望」/「已下架」、note=原 reason），旧分享链接有归宿，不再跳首页或 404。
- `legacy_detail_paths`（旧详情路径数组）由构建写入 `dist/_redirects` 为 **301 一跳到固定 ID**；路径须以 `/intel/` 开头且不含 `?#\n\r`。
- DEPLOY.md 已同步：新条目流程改为「分配 ID → npm run check → build → 推送」。

## 排序列规则
- **新增一律追加到 `items` 数组末尾，不插入前面**（用户 2026-10-07 明确指示：「之后再发现新的，补到后面，不要插到前面」）。
- `build.py` 的 `editorial = [it for it in items if not it.get("sponsored")]` 直接按 `data.json` 的 `items` 数组**自然顺序**渲染，**无额外排序逻辑**；因此自动化/手动新增条目只需 `append` 到 `items` 末尾即落在页面最后（赞助位仍按自身逻辑置顶/置底，不受此影响）。
- 历史已存在的「新模型段在前、老模型段在后」顺序**保持现状**，不再为后续新增刻意前置；如需整体重排，再单独处理。

## 2026-07-19 新增条目
- ZenMux（DeepSeek V4 Pro/Flash 永久免费无限调用，无需实名，国内低延迟）
- 腾讯云 TokenHub（新人 100 万 Tokens，90 天有效，活动至 2026-12-31，首次调用自动领取）
- 天翼云息壤/电信（2500 万 Tokens/模型，2 周有效，新老用户均可，需实名）

## 筛选标准
- 只收录真实免费 token，排除付费抵扣券（如 PPIO 派欧云 50 元代金券已排除）
- 限时活动必须加 limited 字段（ISO 日期）和角标

## 永不上架黑名单（2026-10-06 用户明确指定）
- **腾讯元器**（https://yuanqi.tencent.com）
- **DeepSeek 开放平台**（https://platform.deepseek.com）
- 规则：以上两个平台无论后续是否推出免费额度活动，均不得再次加入 `items` 数组；自动更新任务在发现疑似同名平台时应跳过并记录日志待人工复核。

## 观望区机制（2026-10-06 新增）
- 数据结构：`data.json` 新增 `watchlist` 数组，字段为 `name` / `url` / `reason`。
- 使用场景：用户要求「移入观望区」的平台，或自动更新发现额度政策不稳定、待观察的平台。
- 规则：
  - 观望区平台**不**计入 `total`，也不出现在首页卡片与完整情报表中。
  - 观望区在首页「下架名单」之前独立渲染，保留官网入口与观望原因。
  - 后续若政策明朗，可移回 `items`；若确认收紧或停止免费，则移入 `retired`。
- 当前观望区条目：
  - **七牛云 AI 推理**（https://s.qiniu.com/VV7Zfa），原因：待观察免费额度政策是否稳定。
  - **百度千帆（文心）**（https://qianfan.cloud.baidu.com），原因：用户于 2026-10-06 要求移入观望区，待观察免费额度政策是否稳定。
  - **讯飞星火（开放平台）**（https://www.xfyun.cn），原因：用户于 2026-10-06 要求移入观望区，待观察免费额度政策是否稳定。
  - **APMIX**（https://apmix.ai/event）、**智谱AI（Z.AI 开放平台）**（https://open.bigmodel.cn）、**Mistral La Plateforme**（https://console.mistral.ai）、**xAI Grok（console.x.ai）**（https://console.x.ai）、**Cohere Trial Key**（https://dashboard.cohere.com）、**腾讯云混元大模型**（https://cloud.tencent.com/product/hunyuan），原因：均为用户于 2026-10-07 指定移入观望区，待观察免费额度政策是否稳定。

## 站长推荐角标
- 实现：`build.py` 中硬编码 `RECO_NAMES`，命中条目会在卡片右上角显示「⭐ 站长推荐」角标。
- 2026-10-06：用户先去掉了「站长推荐」角标，将 `RECO_NAMES` 清空为 `[]`。
- 2026-10-06（稍后）：用户要求给 WorkBuddy 国际版卡片加回「站长推荐」角标，将 `RECO_NAMES` 改为 `["WorkBuddy 国际版"]`。
- 当前规则：`RECO_NAMES = ["WorkBuddy 国际版"]`，仅 WorkBuddy 国际版显示「站长推荐」角标。
- 后续如需调整，修改 `build.py` 中的 `RECO_NAMES` 列表即可。

## 新增五角星（2026-10-07 用户要求，已实现）
- 规则：条目**收录后 3 天内在首页卡片右上角显示一枚金色五角星 ★**，到期自动消失。
- 判据字段：`data.json` 条目的 `added`（首次收录日期 `YYYY-MM-DD`），收录当天算第 1 天，满 `NEW_DAYS`（`build.py` 顶部，默认 3）天即过期。
- `added` 由 `scripts/assign_detail_ids.py` 在分配 `detail_slug` 时**自动写入当天日期**，不要手工维护；缺字段的历史条目视为非新增。
- 只作用于**首页情报卡**（`render_card`），不进完整情报表、不进详情页；页面不显示日期。
- 静态站只在 push 时重建，所以星标由页面内的一小段脚本（标记 `tf-new-star-sweep`，仅首页注入）按 `data-exp` 到期时刻自行摘除 —— 否则超过 3 天未部署的旧页面会一直挂着星标。
- 校验：构建日志 `newstar=N`（N＝注入自摘脚本的页面数，正常 1）；星标不影响「站长推荐」角标与分类标签的排布。


- 智谱 GLM-4.7-Flash（完全免费永久，替代 GLM-4.5-Flash）
- CometAPI（Kimi K2 每月 10万输入+100万输出，免费层）
- OpenRouter（35+ 免费模型聚合，BYOK 每月 100 万次）

## 近期问题复盘（2026-10-07）
- 10-04 曾从 `候选来源.md` 整批拉取 3 个竞品 GitHub `awesome-free-llm` 仓库做差集灌入，门槛仅为 `✅/⚠️` 松判断，导致随后 `retired` 累积至 17、`watchlist` 至 9（一边收一边砍）。
- **约定**：今后新增一律走「收录硬门槛」逐条核验，不再整批灌；海外-only、付费中转、试用额度过小、返佣聚合的不收或先入 watchlist。
- 当前 44 条中仍有边界项待你确认是否清理：蓝博科技（lanbuff，`付费中转`+赞助）、腾讯云服务器（空 `free_type`+赞助）、Token Harbor/OrcaRouter/UnoRouter（三个同构国际聚合器）。
- **2026-10-07 22:33 推送（3abf809）已落实上述收紧**：Token Harbor / OrcaRouter / UnoRouter / Novita AI / Fireworks AI 五个同构国际聚合器已移入 watchlist（reason：「暂列观望，待进一步观察免费额度政策与实际可用性」）；items 44→39，watchlist 9→14。蓝博科技、腾讯云服务器仍保留（赞助位，待你最终裁定）。
