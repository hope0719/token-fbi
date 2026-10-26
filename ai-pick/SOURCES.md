# AI 活动雷达 · 信息源清单

## 〇、已接入的自动同步源（每日 08:00 定时任务）
由 `scripts/sync-from-upstream.js` 自动拉取合并，无需人工介入。

| # | 源 | 入口 | 覆盖内容 |
|---|---|---|---|
| 源1 | JS-banana / ai-opportunity-radar | 上游 `src/data/snapshot.json`（jsDelivr CDN） | 全球黑客松、AI 竞赛、云额度，字段最完整 |
| 源2 | LucianaiB 飞书表「AI 活动推荐」 | `lark-cli base +record-list --as user` | 国内一手活动，含中文备注 |
| 源3 | WaytoAGI Events | `https://events.waytoagi.com/api/events`（公开 REST API） | 国内**线下聚会/峰会/工作坊/黑客松**，含安克黑客松等独家活动 |

> ⚠️ 源1/源2/源3 的任何字段修正都必须写在同步脚本的 `LUC_FIELD_OVERRIDES` / `LUC_NOTE_OVERRIDES` / `WAG_TITLE_ZH` 映射表里，
> **直接改 `data.json` 会在次日被同步覆盖**。

以下为**人工维护**的线索渠道（看到后手工补录，同步脚本不会冲掉）：

## 一、中文资讯流
| 源 | 类型 | 覆盖内容 |
|---|---|---|
| aihot | 资讯站 | AI 行业热点、活动汇总 |
| 微信公众号 | 自媒体 | 各类 AI 活动首发、报名通道 |
| 观猹 | 自媒体 | AI 行业评论、活动速递（活动猹频道入口：https://watcha.cn/r/LLLNp2，人工补录线索源） |
| 机器之心 | 媒体 | 大模型比赛、政策资助首发 |
| 量子位 | 媒体 | AI 资讯、竞赛活动 |
| InfoQ AI 频道 | 媒体 | 开发者视角，含 cloud credits |
| 即刻 App "AI探索"圈 | 社区 | 社区自发分享，偶有独家 |

## 二、竞赛 / 黑客松聚合平台
| 源 | URL | 覆盖内容 |
|---|---|---|
| Devpost | devpost.com | 全球最大黑客松列表站 |
| Kaggle | kaggle.com | AI 竞赛之王，$50K-$100K 奖金 |
| 天池 / DataFountain | tianchi.aliyun.com | 阿里/政府背书国内 AI 竞赛 |
| Hackathon.com | hackathon.com | 国际黑客松聚合 |
| hackathons.world | hackathons.world | 全球黑客松日历 |
| HuggingFace | huggingface.co | 社区活动+模型挑战赛 |
| WaytoAGI Events | events.waytoagi.com | 国内线下 AI 聚会/峰会/黑客松（已接为自动源3） |
| Papers with Code | paperswithcode.com | 附带竞赛+奖金 |

## 三、开发者计划 / Credits 渠道
| 源 | 覆盖内容 |
|---|---|
| AWS 开发者计划 | $5K-$100K credits |
| Azure for Startups | 云额度 + AI 服务 |
| Google Cloud for Startups | 云额度 + Gemini API |
| NVIDIA Developer Program | GPU credits + 硬件 |
| OpenAI | API credits + 开发者活动 |
| Anthropic | API credits + 开发者活动 |

## 四、英文资讯补充
| 源 | URL | 覆盖内容 |
|---|---|---|
| HackerNews | news.ycombinator.com | 早期讨论，比官宣早 1-2 天 |
| TLDR AI | tldr.tech/ai | 英文 AI 周报，覆盖 grant |
| The Batch (Deeplearning.ai) | deeplearning.ai | AI 周报 |
| X/Twitter | x.com | OpenAI/Anthropic/Google AI 官方号 |

## 五、学术 / 研究类
| 源 | 覆盖内容 |
|---|---|
| arXiv | 部分论文附带 dataset challenge |
| NeurIPS / ICML / ICLR | 学术会议挑战赛 |
| Papers with Code | 竞赛+奖金 |

## 六、自媒体平台
| 源 | 覆盖内容 |
|---|---|
| 抖音 | AI 创作大赛、短视频活动 |
| B站 (bilibili) | AI 创作公开赛、开发挑战 |
| 小红书 | AI 活动 KOL 推广 |
| 知乎 | AI 话题圆桌、活动专栏 |
