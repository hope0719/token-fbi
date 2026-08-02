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

## 2026-07-17 新增条目
- 智谱 GLM-4.7-Flash（完全免费永久，替代 GLM-4.5-Flash）
- CometAPI（Kimi K2 每月 10万输入+100万输出，免费层）
- OpenRouter（35+ 免费模型聚合，BYOK 每月 100 万次）
