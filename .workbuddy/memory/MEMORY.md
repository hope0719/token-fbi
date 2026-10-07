# Token FBI 项目长期记忆

## 数据来源
- app.js 中 TOKENS 数组是唯一数据源，所有卡片字段：name / type / modality / rating / quota / effect / how / link / updated / limited（可选）
- 分类规则：type="工具" → 工具；modality 含 GLM5.2 → GLM5.2；其余 → 大模型

## 排序列规则
- "前"：较新模型（GLM-5.x / Kimi K2.x / Hy3 / DeepSeek V4 / MiniMax-M3 等同期或更晚）
- "后"：在这些模型之前发布的模型

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

## 2026-07-17 新增条目
- 智谱 GLM-4.7-Flash（完全免费永久，替代 GLM-4.5-Flash）
- CometAPI（Kimi K2 每月 10万输入+100万输出，免费层）
- OpenRouter（35+ 免费模型聚合，BYOK 每月 100 万次）
