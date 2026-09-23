/* =========================================================
 * Token 情报局 · Token FBI
 * 卡片数据都在下面的 TOKENS 数组里。
 * 想加一条情报？复制一个 {...} 对象粘进去就行，字段说明见每个属性。
 *   - modality：模型类型（文本模型 / 多模态大模型 / 全模态模型 等），显示在名字右边
 * ========================================================= */

const TOKENS = [
  {
    name: "WorkBuddy",
    type: "工具",
    modality: "HY3（混元3） · HY4 preview（混元4） · DeepSeek-V4.1-Flash · 文本模型",
    rating: 5,
    quota: "HY3（混元3）限免至 2026-09-30；HY4 preview 权益调整：新用户（含此前没体验过的老用户）首开对话后 14 天每日免费额度，已体验过的老用户闲时夜间（23:00-次日 9:00）免费、其余时间耗积分；DeepSeek-V4.1-Flash 0.03x 优惠倍率持续至 2026-09-23",
    signup: "新用户注册送 2000 积分；HY4 preview 新用户（含此前没体验过的老用户）首次开启后享 14 天每日免费额度",
    effect: "腾讯混元 AI 工作台，HY3（混元3）与 HY4 preview（混元4）均可直接调用，速度很快；写代码、查资料、做自动化都好用。HY3 限免至 2026-09-30；HY4 preview 分两档——新用户首开后 14 天每日免费，老用户仅夜间 23:00-次日 9:00 免费；DeepSeek-V4.1-Flash 国内独家合作，0.03x 为站内最低倍率，优惠持续到 2026-09-23；注意 HY4 为纯文本大模型、暂不具备多模态，调用其做视频/图像等生成会切到多模态模型并正常扣积分；免费体验高峰期可能排队",
    link: "https://curl.qcloud.com/8dvDMEyi",
    limited: "2026-10-10",
    updated: "2026-09-11",
    v2: true
  },

  {
    name: "阿里云 Qoder（灵码）",
    type: "工具",
    modality: "Qwen3.8-Flash（限免中） · Qwen3.8-Max · 代码模型",
    rating: 5,
    quota: "官方 9/18 活动：① Qwen3.8-Flash 计费系数由 0.1× 降至 0×，9/18 10:00 - 9/30 23:59 调用不扣 Credits，Qoder 国际版与 CN 版新老个人用户均可，无需领取资格；② 每天 10:00 起登录桌面端可领 100 通用 Credits（每笔 30 天有效、未到期可累积，每轮限领一次、错过不补）",
    effect: "阿里云官方编程助手（原灵码）。Qwen3.8-Flash 擅长代码编写、长文档处理、图像理解与工具调用，套餐额度可省给其他模型；100 Credits 计入 Add-on 资源包，桌面端 / IDE / JetBrains 插件 / CLI / 网页与移动端通用。⚠️ 免费期结束后按届时公示系数计费；每日奖励需在桌面端左下角「用量面板 → 🎁 礼物图标」手动领取",
    link: "https://www.aliyun.com/product/lingma?userCode=ygtxup80",
    extraAction: { text: "49 元特惠", link: "https://my.feishu.cn/docx/OAqmdEMaUovF0JxsLqW6E2Fcnwf" },
    badge: "九月限定",
    limited: "2026-09-30",
    updated: "2026-09-18",
    v2: true
  },

  {
    name: "GLM-5.3-Flash（Ox-Alpha）",
    type: "大模型",
    modality: "原生多模态大模型 · 300B 参数",
    rating: 5,
    quota: "未订阅用户免费发放 7 天体验卡（0 成本上手，每天限量 10,000 张）；Coding Plan 可用额度提升至原来的 3 倍；套餐用户账号内体验卡数量已重置",
    effect: "智谱首个原生多模态模型，仅 300B 参数却超越上代旗舰 GLM-5.2、比肩 Opus 4.8；定价为 GLM-5.3 的 1/10（限时折扣 1/20，约 Opus 4.8 的 1/40）。能直接看界面、看渲染结果，边写代码边观察、测试、改进；进一步支持 Office、金融研究、专业文档等场景，可完整交付 PPTX / PDF / DOCX / XLSX",
    link: "https://bigmodel.cn/activity/trial-card/PU9MTWG0PM",
    tone: "yellow",
    updated: "2026-08-27",
    v2: true
  },

  {
    name: "蓝博科技（lanbuff）",
    type: "工具",
    modality: "DeepSeek V4 / GLM-5.3 / 千问 3.8 等主流模型中转",
    rating: 4,
    quota: "老牌大模型中转站：聚合 DeepSeek V4、GLM-5.3、千问 3.8 等主流模型，整体价格比较实惠",
    effect: "长期稳定运营，调用成功率较高；一个账号打通多家厂商模型，兼容 OpenAI 接口，省去逐家注册与充值的麻烦",
    link: "https://lanbuff.app",
    pin: 4,
    alwaysShow: true,
    updated: "2026-09-17",
    v2: true
  },

  {
    name: "阶跃星辰 StepFun",
    type: "大模型",
    modality: "step-5-preview · step-3.7-flash · step-3.5-flash · step-router-v1 · 全模态（文本/图像/语音）",
    rating: 4,
    quota: "Step Plan 免费体验回归：注册即送 15 天，用完再送 15 天（合计约 1 个月）；每成功邀请 1 位好友再 +15 天，最高累计 90 天。免费档 Flash Mini 每月 400M Credits（4 亿积分），旗舰模型通用。⚠️ 每天名额有限，当天领完需等第二天再领",
    effect: "阶跃星辰自研全模态平台，免费档可用 step-5-preview、step-3.7-flash、step-3.5-flash、step-router-v1 等模型，覆盖文本 / 视觉理解 / 图像编辑 / 语音（stepaudio-2.5 系列）。API 兼容 OpenAI 与 Claude 格式，改个 Base URL 就能接进 Cursor、Claude Code、Cherry Studio、NextChat 等工具。实测：step-3.7-flash 文本约 2s、视觉 OCR 正确；step-3.5-flash 约 1.3s 适合高频任务；step-5-preview 冷启动偏慢（约 30s+）。⚠️ 免费额度用尽直接返回 429，不会自动扣余额；step-router-v1 不支持图像输入",
    link: "https://platform.stepfun.com",
    /* ↓↓↓ 多邀请码自动轮换：后期要加码 / 换码，只动下面这个数组，别的代码都不用改 ↓↓↓
       失效或不想用的码直接从数组里删掉即可，轮换会自动跳过。 */
    inviteBase: "https://platform.stepfun.com/",
    inviteCodes: ["AATGOEHF", "KLXGHREZ", "UVGCGRGG"],
    inviteParam: "invite_code_v2",
    pin: 5,
    alwaysShow: true,
    updated: "2026-09-23",
    v2: true
  },
  {
    name: "Cline",
    type: "工具",
    modality: "DeepSeek-V4.1-Flash · GLM-5.3-Flash · Muse Spark 1.3 · 文本模型",
    rating: 4,
    quota: "免费模型不绑信用卡即可直接用，有额度限制但日常 coding 够用",
    effect: "开源编程 Agent（VS Code 插件）。免费档直连 DeepSeek-V4.1-Flash、GLM-5.3-Flash、Muse Spark 1.3，不需绑卡。进阶玩法：注册后拿到 API Key，经 9router 等中转接进其他工具，等于把客户端内的免费额度解放出来用",
    link: "https://cline.bot",
    updated: "2026-09-23",
    v2: true
  },
  {
    name: "Kilo Code",
    type: "工具",
    modality: "NVIDIA Nemotron 3 Ultra（550B） · Nex-N2.5-Pro · MiniMax M2.7 · Laguna S 2.1 · 腾讯混元 Hy3 等 16 个免费模型",
    rating: 4,
    quota: "16 个免费模型长期可用（真免费、非试用期），不要 API key、不要信用卡，注册即用；有新模型上线会自动进列表",
    effect: "开源 AI 编程 Agent，VS Code / JetBrains / CLI 全支持。免费模型含腾讯混元 Hy3 与 NVIDIA Nemotron 3 Ultra（550B），覆盖门槛型号，可直接当日常主力，列表实时更新",
    link: "https://kilocode.ai",
    updated: "2026-09-23",
    v2: true
  },
  {
    name: "Verdent AI",
    type: "工具",
    modality: "GLM-5.3-Flash · DeepSeek V4 Flash（0731） · 另有 Claude / GPT / Gemini 等旗舰模型（需付费额度）",
    rating: 3,
    quota: "GLM-5.3-Flash 与 DeepSeek V4 Flash 当前完全免费，按 5 小时 / 每周滚动限额（非硬性上限，日常编码基本打不满）；新用户另赠 7 天 + 100 credits 试用旗舰模型，付费档 $19/月起",
    effect: "多智能体并行编程平台（桌面端 + VS Code / JetBrains 扩展），每个 agent 跑在独立 git worktree 里互不冲突，自带 Plan Mode、Verifier 子智能体校验与 DiffLens 可视化 diff。GLM-5.3-Flash 会看图自检前端渲染结果再改，DeepSeek V4 Flash 偏重推理与 agentic 任务，两只分工基本覆盖日常编码。⚠️ 免费仅限这两只 flash 模型，旗舰模型要消耗 credits",
    link: "https://verdent.ai",
    updated: "2026-09-23",
    v2: true
  },

  {
    name: "腾讯 Marvis（马维斯）",
    type: "工具",
    modality: "混元 / DeepSeek V4 · 操作系统级 AI 助手",
    rating: 4,
    quota: "每人每天 1000 万免费 Token（当前完全免费，无需邀请码，长期免费不现实但现免费用）",
    effect: "腾讯操作系统级 AI 助手，一句话调度 6 个 Agent 并行干文件/系统/应用/网页/搜索任务；效率模式用混元 + DeepSeek V4 云端模型，隐私模式走本地 Qwen 端侧模型，数据不出域，支持 Win/Mac/安卓/iOS 跨端操控",
    link: "https://marvis.qq.com",
    updated: "2026-07-24",
    v2: true
  },

  {
    name: "火山引擎 Ark 协作计划（字节）",
    type: "大模型",
    modality: "GLM5.2 · 文本模型",
    rating: 5,
    quota: "每天免费 300 万 token（解决小问题即切换，超额才扣费）",
    effect: "可调用 GLM5.2 等模型，适合日常高频小任务",
    link: "https://console.volcengine.com/ark/region:cn-beijing/openManagement/rewardPlan",
    updated: "2026-07-14",
    v2: true
  },

  {
    name: "七牛云 AI 推理",
    type: "大模型",
    modality: "千问 3.8 Max / DeepSeek V4 Flash / Kimi K3 / GLM-5.3-Flash · 文本模型",
    rating: 5,
    quota: "300 万 token，新用户再送 1000 万 token（可直接用于千问 3.8 Max / DeepSeek V4 Flash / Kimi K3 / GLM-5.3-Flash）",
    effect: "直接调用千问 3.8 Max、DeepSeek V4 Flash、Kimi K3、智谱 GLM-5.3-Flash 等热门模型，免工具调用，注册登录即可拿 API；GLM-5.3-Flash 已上架，原生多模态、性价比高。⚠️ 注册与开 Key 请在浏览器操作，勿直接在微信内打开链接（会失败）",
    link: "https://s.qiniu.com/VV7Zfa",
    updated: "2026-08-28",
    v2: true
  },

  {
    name: "美团 catpaw（App）",
    type: "工具",
    modality: "GLM-5.3-Flash · LongCat 等 · 多模型聚合",
    rating: 5,
    tone: "green",
    quota: "新用户登录即送 1200 积分；LongCat 免费不限量；GLM-5.3-Flash 已上线（通用 Agent 能力 × 美团生态深度融合）",
    effect: "美团旗下 AI App，多模型聚合平台。GLM-5.3-Flash 正式上线 CatPaw！原生多模态、300B 参数比肩 Opus 4.8、定价仅 GLM-5.3 的 1/10。LongCat 同样免费不限量使用；界面类 WorkBuddy / Codex，对话 + 编程场景全覆盖",
    link: "https://catpaw.meituan.com/",
    updated: "2026-08-28",
    v2: true
  },

  {
    name: "豆包拉新项目",
    type: "项目",
    modality: "网盘拉新 · 多平台带赚",
    rating: 4,
    quota: "豆包拉新一单 15 元，迅雷网盘一单 15 元，夸克网盘 13 元，各种拉新项目，免费带赚",
    effect: "多平台拉新变现项目：豆包 / 迅雷网盘 / 夸克网盘等，单笔佣金 13-15 元，零门槛免费参与，扫码加微信了解详情并获取推广素材",
    link: "#",
    tone: "orange",
    poster: "poster-doubao-laxin.jpg",
    /* 广告卡片，单独管理：永远展示，不参与下方精选规则 */
    alwaysShow: true,
    updated: "2026-08-22",
    v2: true
  },

  {
    name: "2026 微信小程序开发大赛",
    type: "大模型",
    modality: "DeepSeek V4 Flash · 文本模型（Coding Plan 免费 Token）",
    rating: 4,
    quota: "报名截止 10 月 17；报名后约 7-10 天收到 tokenplan 计划卡片，内含 DeepSeek V4 Flash 大额额度，单卡可用量高达 1 个亿",
    effect: "网站站长亲测：纯度极高、速度很好、量大管够；无需提交小程序也能领，别担心。⚠️ 近期反馈：部分用户报名后未收到 tokenplan 卡片，建议先确认是否仍在活动期内",
    link: "https://contest.weixin.qq.com/eventDetails?id=4598379302114656257",
    limited: "2026-10-17",
    updated: "2026-09-15",
    v2: true
  },

  {
    name: "硅基流动 SiliconFlow",
    type: "大模型",
    modality: "DeepSeek V4 Pro / GLM-5.3 / Kimi K3 / 千问 3.8 等 · 全模型聚合",
    rating: 4,
    quota: "邀请好友奖励：每邀请 1 位得 14 元额度",
    effect: "聚合海量开源大模型，DeepSeek V4 / GLM-5.3 / Kimi / 千问 3.8 等门槛模型可直接调用，文本 / 图像多模态 API，兼容 OpenAI 格式",
    link: "https://cloud.siliconflow.cn/i/HgdEna2e",
    updated: "2026-09-04",
    v2: true
  },

  {
    name: "NVIDIA NIM 免费 API",
    type: "大模型",
    modality: "多模型聚合（文本 / 多模态）",
    rating: 5,
    quota: "标 Free Endpoint 的模型免费调用，提供 H100 算力（速率有限制，个人学习/测试够用）",
    effect: "可调 MiniMax M2.7、GLM-5.1、Kimi K2.5、DeepSeek V3.2、Gemma 4、Llama 4 等顶级模型，兼容 OpenAI SDK",
    link: "https://build.nvidia.com",
    updated: "2026-07-15",
    v2: true
  },

  {
    name: "商汤 Token Plan（sensenova）",
    type: "大模型",
    modality: "SenseNova 6.7 Flash-Lite / U1 Fast / DeepSeek V4 Flash · 日日新系列 · 文本模型",
    rating: 3,
    quota: "限时免费公测：每个模型每 5 小时 1500 次调用（首月免费体验，按次数计非 Token）",
    effect: "限免额度已从 500 次/5h 加码到 1500 次/5h，且新增 SenseNova 6.7 Flash-Lite、SenseNova U1 Fast 等自研模型可选；DeepSeek V4 Flash 依旧在列，适合跑 Agent、图表分析、办公自动化和多模态任务。⚠️ 注意：日日新系列近期模型错误频发（报错率高），白天不建议使用，晚间相对稳定，介意的话避开白天高峰",
    link: "https://www.sensenova.cn/token-plan",
    updated: "2026-08-07",
    v2: true
  },

  {
    name: "Agnes AI",
    type: "大模型",
    modality: "全模态模型",
    rating: 5,
    quota: "不限期全模态免费，API 每分钟 20 次请求（RPM 20 以内）",
    effect: "Agnes2.0 全模态模型，文本 / 图像 / 视频全能适配，官方承诺持续升级并保持免费；多模态调用建议配合官方社区 skill（github.com/lj1270998580-crypto/Agnes-help-skill）",
    link: "https://platform.agnes-ai.com",
    updated: "2026-08-03",
    v2: true
  },

  {
    name: "美团 longcat 大模型",
    type: "大模型",
    modality: "LongCat 2.0 · 文本模型",
    rating: 5,
    quota: "新用户免费 1000 万 token，很耐用；续购 9.9 元买 5000 万",
    effect: "美团旗下大模型，免费额度大方、性价比高，适合长期日常高频使用",
    link: "https://longcat.chat/platform/product",
    updated: "2026-07-14",
    v2: true
  },

  /* ========== 较老模型平台 ========== */

  {
    name: "OpenRouter",
    type: "大模型",
    modality: "35+ 聚合模型（Kimi K2 / Qwen3-Next-80B / Llama 等）",
    rating: 3,
    quota: "注册即享永久免费模型（BYOK 用户每月 100 万次请求）；免费模型每日 50 次（充值 $10 后升至 1000 次/日）",
    effect: "一站式聚合 500+ 模型（GPT/Claude/Gemini/Kimi/DeepSeek 等），OpenAI 兼容接口，一个 Key 切所有模型。⚠️ 实测反馈：GLM-5.2(free) 当前报 429 错误用不了（限流/上游不可用），免费模型可用性不稳定",
    link: "https://openrouter.ai",
    updated: "2026-08-19",
    v2: true
  },

  /* ========== 降级区：2026-08-07 下调两星，暂列末位观察 ========== */

  {
    name: "BazaarLink",
    type: "大模型",
    modality: "DeepSeek V4 Flash · 1M 上下文 · OpenAI 兼容网关",
    rating: 2,
    quota: "DeepSeek V4 Flash 长期免费：10 RPM / 每天 150 次（不绑卡、不充值、无试用期；充值账户额度 ×3 至 450 次/天）",
    effect: "中国台湾集聯科技有限公司（統一編號 62232477，登記於苗栗縣頭份市）运营的 OpenAI 完全兼容多模型聚合网关，数据驻留 AWS Tokyo（非大陆、非美本土）。免费档开放 DeepSeek-V4-Flash（284B MoE、激活 13B、1M tokens 超长上下文、最大输出 38.4 万 tokens）。支持把 model 设为「auto:free」自动路由到零成本模型；可直接对接 Claude Code、Cursor、LangChain、Dify、LiteLLM 等；额度按请求 token 数动态加权扣减，短问答实际可用次数远超 150 次",
    link: "https://bazaarlink.ai/free",
    updated: "2026-07-31",
    v2: true
  },

  {
    name: "HuggingFace Inference API",
    type: "大模型",
    modality: "DeepSeek V4 / Qwen3 / Mistral 等 · 开源模型",
    rating: 2,
    quota: "免费共享推理端点，无需信用卡（限流，适合原型验证；PRO $9/月或自部署解锁更高额度）",
    effect: "全球最大开源模型社区提供的免费推理 API，覆盖 DeepSeek-V4、Qwen3-235B、Mistral Large 3、Llama 等上千开源模型，无需绑卡即可用 OpenAI 兼容接口调用，适合个人开发与模型对比测试",
    link: "https://huggingface.co",
    updated: "2026-07-24",
    v2: true
  },

  {
    name: "月之暗面 Kimi 开放平台",
    type: "大模型",
    modality: "Kimi K2.6 / K2.5 · 长上下文 MoE 模型",
    rating: 2,
    quota: "新用户注册赠送 15 元体验金（永久有效，按量抵扣，无需绑卡）",
    effect: "月之暗面官方平台，Kimi K2.6 最新最智能、长程代码编写更强更稳；K2.5 支持百万上下文、视觉+文本、思考/非思考模式，3 RPM 限速但超长文本处理一流",
    link: "https://platform.moonshot.cn",
    updated: "2026-07-23",
    v2: true
  },

  {
    name: "魔搭社区 ModelScope",
    type: "大模型",
    modality: "Qwen 系列 / LUX / Stable Diffusion 等 · 文本+多模态",
    rating: 1,
    quota: "已切换『魔豆』计费体系，每日免费调用次数较此前明显下调（原每天 2000 次 RPD 缩水）；注册即享、无需实名即可注册，但需留意额度变动",
    effect: "阿里达摩院开源社区，收录 17 万+ 开源模型，生态完整、国内访问稳定；API-Inference 支持文本/图像等多模态，适合原型验证与模型体验。⚠️ 2026-08 起改采『魔豆』计费，免费调用次数较此前明显减少",
    link: "https://modelscope.cn",
    updated: "2026-08-07",
    v2: true
  },

  {
    name: "OpenStarry",
    type: "工具",
    modality: "GLM 5.2 / DeepSeek V4 / Kimi K2.6 / MiniMax M3 等 40+ 模型",
    rating: 1,
    quota: "注册即赠 200 次免费调用（Coding Plan + Token Plan 按量计费，一个 Key 接入 40+ 国产及国际模型）",
    effect: "国产大模型 API 聚合中转平台，统一管理多家提供商，一行代码改动随时切换模型；覆盖最新 GLM 5.2 / Kimi K2.6 / DeepSeek V4 / MiniMax M3 / Qwen3.7-Max 等",
    link: "https://www.openstarry.com",
    updated: "2026-07-23",
    v2: true
  },

  {
    name: "OpenCode Zen",
    type: "工具",
    modality: "DeepSeek V4 Flash Free / MiMo-V2.5 Free / LongCat-2.0 Free / Nemotron 3 Ultra Free / Big Pickle 等",
    rating: 3,
    quota: "多个精选模型限时免费（DeepSeek V4 Flash Free、MiMo-V2.5 Free、North Mini Code Free、Nemotron 3 Ultra Free、Big Pickle），无需付费；余额低于 $5 才自动充值",
    effect: "OpenCode（16 万+ Star 开源编程 Agent）自带的 Zen 模型网关，专为 coding agent 基准测试挑选并验证的模型，OpenAI 兼容接口，可配到任意编程客户端",
    link: "https://opencode.ai/zen",
    updated: "2026-09-23",
    v2: true
  },

  {
    name: "微信 AI 小程序成长计划（云开发 CloudBase）",
    type: "大模型",
    modality: "Hy3 + Hy Image 3.0 · 文本/生图",
    rating: 3,
    quota: "10 亿大模型 Token + 10 万张 AI 生图（本轮加码后额度，自申请起 6 个月有效），另送 6 个月个人版云开发环境",
    effect: "腾讯云开发 CloudBase 联合微信小程序的开发者扶持计划，模型已全面升级为混元 Hy3 与 Hy Image 3.0；全行业无类目限制，小游戏开发者同享。10 亿 Token 足够把 AI 能力『用厚』在产品里，老用户自动升级或领 120 元代金券",
    link: "https://cloud.tencent.com/developer/article/2705075",
    limited: "2026-12-31",
    updated: "2026-07-29",
    v2: true
  },


  {
    name: "腾讯云 TokenHub",
    type: "大模型",
    modality: "Hy3 · DeepSeek V4 · GLM-5 · MiniMax-M2.7 · Kimi-K2.5 等",
    rating: 3,
    quota: "语言/多模态理解模型各 100 万 Tokens（官方文档最新口径：有效期 1 年）+ HY-Image-V3.0 生图 50 次 + 视频生成 50 积分 + 混元 3D 100 积分，活动持续至 2026-12-31",
    effect: "腾讯云大模型服务平台，覆盖 Hy3、DeepSeek-V4-Pro/Flash、GLM-5.2/5.1、Kimi-K2.6/K2.5、MiniMax-M3/M2.7 等 16+ 主流模型，免费包已扩展到文本+生图+视频+3D 全线；首次调用自动领取，OpenAI 兼容 API，一个 Key 切多模型",
    link: "https://cloud.tencent.com/product/tokenhub",
    limited: "2026-12-31",
    updated: "2026-07-30",
    v2: true
  },

  {
    name: "天翼云息壤（电信）",
    type: "大模型",
    modality: "GLM-5 · DeepSeek V4 · Qwen3.5 · Doubao 等约 18 个主流模型",
    rating: 2,
    quota: "文本类模型 2500 万 Tokens/模型（有效期 2 周，从首次使用算起）；DeepSeek V4 Pro/Flash 各 50 万 Tokens",
    effect: "中国电信旗下全栈国产化智算平台，\"国模+国芯+国云\"融合底座，支持 GLM-5、DeepSeek-V4、Qwen3.5、Doubao-Seed-2.0-pro 等约 18 个主流大模型，适合政企/科研/个人开发者",
    link: "https://www.ctyun.cn/product/maas",
    updated: "2026-07-19",
    v2: true
  },

  /* ========== 倒数第二：太行HUB（2026-08-12 新增） ========== */

  {
    name: "太行HUB（token.taiha.cn）",
    type: "大模型",
    modality: "DeepSeek-V4-Flash / GLM-5.3 / GLM-5.3-Flash / Kimi-K3",
    rating: 5,
    quota: "新用户注册送 2 元余额（按量抵扣）；模型价格比各大官方低 20%-37%，无充值手续费、无最低消费门槛",
    effect: "A股上市公司旗下合规聚合平台（增值电信 + EDI 双证），一个 Key 直连 DeepSeek-V4-Flash / GLM-5.3 / GLM-5.3-Flash / Kimi-K3 等门槛级热门模型；完全兼容 OpenAI 协议，base_url https://api.taiha.cn/v1，Claude Code / Cursor / Dify 等工具即插即用；价格比官网直降 20%-37%，支持开发票与企业对公采购",
    link: "https://token.taiha.cn/sign-up?aff=Ox6S",
    updated: "2026-08-12",
    v2: true
  },

  /* ========== 国家超算互联网 SCNet（2026-08-21 新增，DeepSeek V4 低价平替渠道） ========== */

  {
    name: "国家超算互联网 SCNet",
    type: "大模型",
    modality: "DeepSeek V4 Pro / V4 Flash · GLM-5.2 · MiniMax-M3 · Kimi-K2.6 等",
    rating: 4,
    quota: "Token Plan 包月：基础版 ¥30/月 → 60,000 Credits（原价 ¥50）；标准版 ¥110 → 240,000；高级版 ¥265 → 600,000。兼容 OpenAI / Anthropic 接口，Credits 按实际消耗折算抵扣",
    effect: "科技部牵头、中科曙光支撑的国家级算力平台，把全国超算/智算中心资源统一对外。前段时间 DeepSeek 涨价期间，大量用户反馈 SCNet 的套餐价格相较官方渠道更划算；目前 DeepSeek 价格已回调，是否仍具成本优势需结合自身用量与官方最新定价自行衡量。V4-Flash 缓存命中低至 0.012 元/百万 Token、未命中输入 0.6 元、输出 1.2 元，对比官方峰值便宜约 7-8.3 倍（V4 Pro 便宜约 1.75-7 倍）；不用对话数据训练。⚠️ 槽点：并发/稳定性一般、高峰需排队；新模型上架滞后；资源包与余额扣减逻辑绕（需关注算力券/补贴包多重叠加）。适合能接受排队、想压成本的重度调用",
    link: "https://www.scnet.cn/",
    updated: "2026-09-15",
    v2: true
  },

  /* ========== B.AI（孙哥 Justin Sun 的 AI 聚合平台，2026-09-02 修正：非百度 + 换邀请链接 + 前移 4 位） ========== */

  {
    name: "B.AI（AI 模型聚合平台）",
    type: "大模型",
    modality: "GLM-5.3-Flash / Qwen3.8-Flash / Hy3 / MiMo-V2.5 · 多模型一折",
    rating: 4,
    quota: "免费模型已全部取消，现按原价 1 折计费：GLM-5.3-Flash、Qwen3.8-Flash、Hy3、MiMo-V2.5 等多款模型均为一折付费，平台已无任何完全免费的模型",
    effect: "孙哥（孙宇晨 Justin Sun）的 AI 模型聚合平台 b.ai（⚠️ 不是百度官方），聚合接入 OpenAI / Anthropic / Google / DeepSeek / 月之暗面 / 千问 / Z.ai / MiniMax 等第三方模型，走 LLM 聚合 + Web3 钱包支付路线；⚠️ 2026-09 起不再有 0 Credits 免费模型，全部改为一折计费，性价比优势明显减弱，入手前请先核算实际价格",
    link: "https://chat.b.ai/chat?invite_code=CQLBPC",
    updated: "2026-09-17",
    v2: true
  },

  /* ========== 末尾：MonkeyCode（2026-08-12 新增） ========== */

  {
    name: "MonkeyCode（长亭）",
    type: "工具",
    modality: "GLM / Kimi / MiniMax / Qwen / DeepSeek 等 · 全主流模型",
    rating: 3,
    quota: "免费档 ¥0 永久：每天 30M Token（3000 万），云开发环境 1C/4G、1 个任务并发；每日签到 100 积分，每邀请 1 位新用户 +5000 积分",
    effect: "长亭科技（Chaitin）出品的在线 AI 编程开发平台，浏览器即用、自带云端开发环境与终端，可跑 Agent 做开发/调研/文档/数据分析，PC 与手机数据实时同步；内置 GLM/Kimi/MiniMax/Qwen/DeepSeek 等主流模型；GitHub 全量开源（AGPLv3）。⚠️ 免费档限基础模型范围 + 单任务并发",
    link: "https://monkeycode-ai.com/?ic=019fe974-4b9e-7186-b8a6-2901baec7c2e",
    updated: "2026-08-12",
    v2: true
  },

  /* ========== 末尾：点点 AI（小红书 dots3-note-prev，2026-08-18 新增） ========== */

  {
    name: "点点 AI（小红书 dots3-note-prev）",
    type: "大模型",
    modality: "dots3-note-prev · 文本 / 图像 / 视频 / 音频 多模态 MoE（512K 上下文）",
    rating: 5,
    quota: "限时免费公测中：20 RPM（每分钟请求）、50 万 TPM（每分钟 Token），官方暂未公布硬性上限",
    effect: "小红书 dots 模型实验室官方 AI 平台，自研 dots3-note-prev 多模态 MoE（280B 总参 / 16B 激活，512K 超长上下文），统一理解文本 / 图像 / 视频 / 音频，针对长程 Agent 任务优化，内置 Self-Critiquing 自主纠错；小红书官方评测称其综合表现优于 GLM-5.2。国内用户小红书扫码或手机号即可登录，门槛低。⚠️ 用户实测：输出速度很快，但不擅长写代码",
    link: "https://dots.ai/platform/apikeys",
    updated: "2026-08-18",
    v2: true
  },

  /* ========== 末尾：TeleAgent（星辰超级智能体，2026-08-19 新增） ========== */

  {
    name: "TeleAgent（星辰超级智能体）",
    type: "工具",
    modality: "中国电信星辰大模型 · 系统级 AI Agent（对话 / 编程 / 深度调研 / 文档办公）",
    rating: 3,
    quota: "每天 6000 万 token（官方活动口径）；桌面版本地驻留，数据存于本地硬盘，不强制上传",
    effect: "中国电信天翼 AI 出品的「星辰超级智能体」桌面版，系统级 AI 办公助手（Windows 10+/macOS 13+）：可整理文件、Word/Excel 提取与汇总、深度调研与资讯抓取、写文档做 PPT、写代码做应用；跨软件自由穿梭（搜索网页、算 Excel、填 Word），思路透明可随时介入修正，支持可扩展 Skill、自主任务调度、持久化记忆；本地驻留适合处理财务报表、商业机密等敏感信息",
    link: "https://www.teleai.com.cn/product/teleagent",
    updated: "2026-08-19",
    v2: true
  },

  /* ========== 末尾：GMI Cloud（2026-08-27 新增，minimax-3m + GLM + agens-2.5-flash 均免费） ========== */

  {
    name: "GMI Cloud（gmi-serving）",
    type: "大模型",
    modality: "MiniMax-3M + GLM 智谱 + agens-2.5-flash · 文本模型（均免费）",
    rating: 5,
    quota: "MiniMax-3M、GLM 智谱、agens-2.5-flash 当前全部免费调用（OpenAI 兼容接口，一个 Key 切多模型）",
    effect: "GMI Cloud 的 API 网关，主打免费模型：MiniMax-3M 日常对话、写文案够用，响应快；GLM 智谱中文理解稳，总结改写很顺手；agens-2.5-flash 同样免费可用，适合高频小任务与 Agent 调用",
    link: "https://console.gmicloud.ai",
    updated: "2026-08-27",
    v2: true
  },

  /* ========== 末尾：AMD 免费 API 与开发者计划（2026-09-02 新增） ========== */

  {
    name: "AMD 免费 API 与开发者计划",
    type: "大模型",
    modality: "AMD 免费 API · 裸机 Instinct GPU / Fireworks 托管推理 · 开发者福利",
    rating: 5,
    quota: "免费 API 入口：developer.amd.com.cn/radeon/tokenfactory；AMD AI 开发者计划另给最高 $100 免费云额度（裸机 AMD Instinct GPU）、$50 Fireworks AI 额度（托管 LLM 推理）、1 个月 deeplearning.ai 私享 Discord 权限，以及活动/GPU+AI PC 抽奖资格",
    effect: "AMD 免费 API 速度快，比英伟达免费的好用很多。开发者计划申请步骤：① 打开 studentoffers.co/offer/amd-ai-developer-program ② 加入 AMD AI 开发者计划 ③ 打开 Member Perks ④ 申请 AMD Cloud 或 Fireworks 额度 ⑤ 填写 affiliation / intended use / 公开主页 ⑥ 等待 2-3 个工作日审批。⚠️ AMD 云额度激活后 30 天过期；Fireworks 额度 90 天有效；额度审批通过后可用",
    link: "https://developer.amd.com.cn/radeon/tokenfactory",
    tone: "green",
    alwaysShow: true,
    updated: "2026-09-02",
    v2: true
  },

  /* ========== 秒哒（字节跳动 · AI 应用生成工具，2026-09-02 新增） ========== */

  {
    name: "秒哒（百度）",
    type: "工具",
    modality: "AI 应用生成工具 · 一句话造应用 · 0 代码搓小程序",
    rating: 5,
    quota: "一句话生成完整可用的应用/小程序，0 代码 0 成本，适合普通人快速上手",
    effect: "百度秒哒是零代码 AI 应用生成工具，推荐给新手使用：用自然语言描述需求即可生成并运行小程序/网页应用，支持对话式迭代、组件拖拽与一键发布；没有编程基础也能把想法快速做成可运行产品",
    link: "https://www.miaoda.cn/?invitecode=user-7a0wz6474m4k",
    tone: "orange",
    alwaysShow: true,
    updated: "2026-09-15",
    v2: true
  },

  /* ========== 小米 MiMo · 开放邀测（2026-09-09 新增） ========== */

  {
    name: "小米 MiMo（Xiaomi）",
    type: "工具",
    modality: "MiMo-X-Pro-Preview / MiMo-X-Flash-Preview · 混合多模态模型",
    rating: 4,
    quota: "桌面客户端开放邀测，限时限量免费体验；一站式写 PPT、改设计图、做数据分析、剪短视频、跑代码、生成 3D 建模",
    effect: "小米全新 MiMo 桌面客户端：写 PPT / 改设计图 / 数据分析 / 剪短视频 / 跑代码 / 生成 3D 建模全都能干，限时限量免费邀测，长线全能型创作小助手",
    link: "https://s.mi.cn/NNI4kZp9",
    alwaysShow: true,
    updated: "2026-09-09",
    v2: true
  },

  /* ========== LobsterAI 有道龙虾（2026-09-10 新增） ========== */

  {
    name: "LobsterAI 有道龙虾",
    type: "工具",
    modality: "DeepSeek-V4.1 · 文本模型",
    rating: 4,
    quota: "下载安装即可使用 DeepSeek-V4.1 模型",
    effect: "网易有道出品的 AI 应用（有道龙虾），内置 DeepSeek-V4.1 等主流大模型，拿来就能对话、写内容、跑任务，上手零门槛",
    link: "https://lobsterai.youdao.com/#/index?keyfrom=invitation",
    updated: "2026-09-15",
    v2: true
  },
  {
    name: "云工开物学生专区",
    type: "工具",
    modality: "智能体自主编程 · Qwen3.8 / GLM-5.3 / DeepSeek-V4 等多模型",
    rating: 4,
    quota: "Qoder CN 学生专享：完成阿里云学生认证，领取 300 元云工开物代金券，下单即可抵扣 1 个月专业版权益，多模型任选，每人限抵扣 1 次",
    effect: "阿里云「云工开物」学生专区：智能体自主编程，支持 Qwen3.8、GLM-5.3、DeepSeek-V4 等多模型任选，写代码、做论文一站搞定",
    link: "https://university.aliyun.com/course/promotion28-activity?clubTaskBiz=subTask..12836123..10290..&userCode=ygtxup80",
    badge: "学生专享",
    updated: "2026-09-15",
    v2: true
  }

];



/* ---- 渲染逻辑（一般不用改） ---- */
const MAX = 5;
const cardBox = document.getElementById("cards");
const filters = document.getElementById("filters");
let motionReady = false;

function playCardMotion() {
  if (!motionReady || !window.gsap) return;
  const cards = cardBox.querySelectorAll(".card");
  if (!cards.length) return;
  window.gsap.from(cards, {
    autoAlpha: 0,
    y: 12,
    duration: 0.32,
    ease: "power2.out",
    stagger: { amount: Math.min(cards.length * 0.028, 0.42) },
    clearProps: "transform,visibility,opacity"
  });
}

function fmtMd(d) {
  const p = d.split("-");
  return parseInt(p[1], 10) + "/" + parseInt(p[2], 10);
}

function cleanText(value) {
  return String(value).replace(/[—–]/g, "-");
}

function fire(rating) {
  let s = "";
  for (let i = 1; i <= MAX; i++) {
    s += i <= rating ? "★" : '<span class="dim">★</span>';
  }
  return s;
}


function seg(t) {
  if (!t) return "";
  const m = t.matchAll(/(\d[.\d]*\s*(?:万|亿|千万|百万)?(?:\s*Tokens?|\s*token|\s*次|元|积分|RPM|TPM)?)/gi);
  let out = "", last = 0;
  for (const mo of m) {
    out += t.slice(last, mo.index) + '<b class="num">' + mo[0] + '</b>';
    last = mo.index + mo[0].length;
  }
  out += t.slice(last);
  return out;
}


/* ========== 观望名单（不推荐优先领取） ========== */
const DONOTS = [
  {
    name: "火山引擎 Ark 协作计划（字节）",
    why: "可用模型数量、分量都比较少，性价比一般；唯一亮点是每日可重置额度（单模型最高 500 万 Token/天，Doubao-Seed-2.1-pro 同档，申请后最高可提到 5000 万/天）",
    link: "https://console.volcengine.com/ark/region:cn-beijing/openManagement/rewardPlan"
  },
  {
    name: "NVIDIA NIM 免费 API",
    why: "国内用户注册使用比较慢，网速也比较卡",
    link: "https://build.nvidia.com"
  },
  {
    name: "商汤 Token Plan（sensenova）",
    why: "使用效果特别差，网速很卡",
    link: "https://www.sensenova.cn/token-plan"
  },
  {
    name: "BazaarLink",
    why: "目前仅千问 3.7 Flash 免费",
    link: "https://bazaarlink.ai/free"
  },
  {
    name: "HuggingFace Inference API",
    why: "未发现是否有免费额度，整个页面不方便查找",
    link: "https://huggingface.co"
  },
  {
    name: "魔搭社区 ModelScope",
    why: "可使用的额度极小",
    link: "https://modelscope.cn"
  },
  {
    name: "OpenStarry",
    why: "仅允许免费调用 200 次",
    link: "https://www.openstarry.com"
  },
  {
    name: "腾讯云 TokenHub",
    why: "可使用量极少，仅新用户可使用 100 万到 300 万",
    link: "https://cloud.tencent.com/product/tokenhub"
  },
  {
    name: "基元律动",
    why: "目前看起来极不稳定，且多名用户反馈体验较差",
    link: "https://tokenrhythm.studio"
  },
  {
    name: "ZenMux",
    why: "免费额度大幅缩水，需充值解锁才能正常使用",
    link: "https://zenmux.ai"
  },
  {
    name: "天翼云息壤（电信）",
    why: "免费额度太低：DeepSeek V4 Pro/Flash 各仅 50 万 Tokens，且使用期限时 2 周",
    link: "https://www.ctyun.cn/product/maas"
  },
  {
    name: "七牛云 AI 推理",
    why: "暂移入观望：注册与开 Key 必须在浏览器操作（微信内直接打开会失败），新人上手门槛偏高，持续观察中",
    link: "https://s.qiniu.com/VV7Zfa"
  },
  {
    name: "太行HUB（token.taiha.cn）",
    why: "暂移入观望：以低价聚合为主、免费额度偏薄（新用户仅送 2 元余额），整体性价比待进一步观察",
    link: "https://token.taiha.cn/sign-up?aff=Ox6S"
  },
  {
    name: "B.AI（AI 模型聚合平台）",
    why: "免费模型已全部取消，改为一折计费，无免费额度可领",
    link: "https://chat.b.ai/chat?invite_code=CQLBPC"
  },
  {
    name: "Google Gemini API",
    why: "长期免费层很稳（AI Studio 免费用 Flash / Pro、Gemini CLI 每天 1000 次请求），但 Gemini 系列不在本站精选门槛内，暂列观望",
    link: "https://aistudio.google.com/"
  },
  {
    name: "GitHub Copilot Free",
    why: "每月 2000 次代码补全 + 50 次 Chat，模型为 GPT-4o / Claude Sonnet，均不在精选门槛内；轻度用户够用，暂列观望",
    link: "https://github.com/features/copilot"
  },
  {
    name: "Groq",
    why: "自研 LPU 推理极快（500+ tokens/s），免费层每天 1000 次请求 / 20 万 Token，但托管的开源模型不在精选门槛内，暂列观望",
    link: "https://console.groq.com"
  },
  {
    name: "Cerebras",
    why: "每天 100 万 Token、约 3000 tokens/s，但仅 Llama 4 Scout / Qwen3 32B 且上下文只有 8192，不在精选门槛内，暂列观望",
    link: "https://inference.cerebras.ai"
  },
  {
    name: "阿里云百炼",
    why: "新用户 100 万 Token 永久有效、通义千问代码模型每日 100 万，但未明确开放本站门槛型号，暂列观望",
    link: "https://bailian.console.aliyun.com"
  },
  {
    name: "腾讯云混元",
    why: "100 万 Token/年、按年发放，额度偏少且需实名开通，暂列观望",
    link: "https://cloud.tencent.com/product/hunyuan"
  },
  {
    name: "百度千帆",
    why: "每个模型 100 万 Token、有效期 3 个月，需逐个模型分别领取，上手成本偏高，暂列观望",
    link: "https://console.bce.baidu.com/qianfan"
  }
];

/* ========== 精选规则（2026-09-19 起，与 README「精选模型与收录标准」对齐） ==========
 * 只展示「提供 ≥ 门槛型号」的卡片。门槛即首页「精选门槛」6 个型号：
 *   DeepSeek V4 · GLM 5.2 · Kimi K3 · 千问 3.8 Max · Hy3 · LongCat 2.0
 * 同系列更高版本自动命中（DeepSeek V4.1/Pro/Flash、GLM-5.3-Flash、千问 3.8 Max/Flash、Hy4 等）；
 * 低于门槛的型号（DeepSeek 3.2、GLM 5/5.1、Kimi K2.6、Qwen 3.5、Hy2 等）一律不展示。
 * 判定：卡片 name + modality 归一化（转小写、去掉空格/连字符/点/·）后匹配正则。
 * ⚠️ 改动门槛请同步改 index.html 的 .model-list 与 README 的收录标准表格，三处必须一致。
 * 广告卡（豆包拉新）设 alwaysShow: true 绕过本规则，单独放行；UI 看起来与普通卡片无异。 */
const FEATURED_RULES = [
  { label: "DeepSeek V4",   re: /deepseekv(?:[4-9]|1\d)/ },
  { label: "GLM 5.2",       re: /glm5(?:[2-9]|1\d)|glm[6-9]/ },
  { label: "Kimi K3",       re: /kimik(?:[3-9]|1\d)/ },
  { label: "千问 3.8 Max",  re: /(?:千问|qwen)3(?:[8-9]|1\d)|(?:千问|qwen)[4-9]/ },
  { label: "Hy3",           re: /hy(?:[3-9]|1\d)/ },
  { label: "LongCat 2.0",   re: /longcat/ }
];
function isFeatured(t) {
  const text = (t.name + " " + (t.modality || "")).toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "");
  return FEATURED_RULES.some(r => r.re.test(text));
}

/* ========== 邀请码自动轮换（inviteBase + inviteCodes）==========
 * 卡片只要带这两个字段就会自动轮换邀请码。**后期要加码 / 换码，只改 inviteCodes 数组，
 * 其它代码一行都不用动**；某个码失效或被平台停用了，直接从数组里删掉即可，轮换会自动跳过。
 *   inviteBase:  "https://platform.stepfun.com/"   基础地址（不带参数）
 *   inviteCodes: ["AATGOEHF", "KLXGHREZ", ...]     邀请码池
 *   inviteParam: "invite_code_v2"                  可省略，默认 invite_code_v2
 * 轮换策略：按「自然日」轮换——同一天内所有访客拿到同一个码（方便判断哪个码在起作用），
 *   每天 0 点自动切到下一个；当天结果存 localStorage，刷新页面不跳码。
 *   只有一个码时，行为与写死 link 完全一致。 */
function pickInvite(t) {
  const codes = t.inviteCodes;
  if (!t.inviteBase || !Array.isArray(codes) || !codes.length) return null;
  const dayNo = Math.floor(Date.now() / 86400000);   // UTC 自然日序号
  const byDay = () => codes[((dayNo % codes.length) + codes.length) % codes.length];
  let code = null;
  try {
    const KEY = "tfb_invite_" + t.name;
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && saved.day === dayNo && codes.indexOf(saved.code) > -1) {
      code = saved.code;                              // 当天已选过，保持不变
    } else {
      code = byDay();
      localStorage.setItem(KEY, JSON.stringify({ day: dayNo, code: code }));
    }
  } catch (e) {
    code = byDay();                                   // 隐私模式 / 禁用存储时按天兜底
  }
  return t.inviteBase + "?" + (t.inviteParam || "invite_code_v2") + "=" + encodeURIComponent(code);
}

/* 观望名单中的平台：其官网大卡不再展示（数据保留在 TOKENS，移出观望名单后自动恢复） */
const DONOT_NAMES = new Set(DONOTS.map(d => d.name));
/* VISIBLE：去掉观望名单 + 必须命中精选规则（alwaysShow 广告卡单独放行） */
const VISIBLE_RAW = TOKENS.filter(t => !DONOT_NAMES.has(t.name) && (t.alwaysShow || isFeatured(t)));

/* ========== 固定位次（pin） ==========
 * 带 pin 字段的卡会被强制排到指定显示位（1-based），不受数组顺序、
 * 后续新增/删除卡片影响。⚠️ 未经用户明确指示，禁止改动或移除这些卡的 pin。 */
const VISIBLE = (() => {
  const out = VISIBLE_RAW.slice();
  out.filter(t => t.pin).sort((a, b) => a.pin - b.pin).forEach(t => {
    const i = out.indexOf(t);
    if (i > -1) {
      out.splice(i, 1);
      out.splice(Math.min(t.pin - 1, out.length), 0, t);
    }
  });
  return out;
})();

/* 平台归属地标注（卡片左下角/观望行）：能查清的确切写国家/地区，
   查不清主体的一律标「国外」；大陆平台不在此表、不标注。 */
const REGION_BY_NAME = {
  "Agnes AI": "新加坡",
  "OpenRouter": "美国",
  "GMI Cloud（gmi-serving）": "美国",
  "B.AI（AI 模型聚合平台）": "国外",
  "NVIDIA NIM 免费 API": "美国",
  "HuggingFace Inference API": "美国",
  "BazaarLink": "中国台湾",
  "OpenCode Zen": "国外",
  "基元律动": "国外",
  "ZenMux": "国外",
  "AMD 免费 API 与开发者计划": "美国",
  "Cline": "国外",
  "Kilo Code": "国外",
  "Verdent AI": "国外",
  "Google Gemini API": "美国",
  "GitHub Copilot Free": "美国",
  "Groq": "美国",
  "Cerebras": "美国"
};

/* 归类规则（只分两类）：
 *   - 工具：App 类（type === "工具"）
 *   - 大模型：其余所有模型平台
 */
function catOf(t) {
  if (t.type === "工具") return "工具";
  return "大模型";
}

function render(type) {
  const list = type === "all" ? VISIBLE : VISIBLE.filter(t => catOf(t) === type);
  const emptyEl = document.getElementById("empty-state");
  if (!list.length) {
    cardBox.innerHTML = "";
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }
  if (emptyEl) emptyEl.style.display = "none";
  cardBox.innerHTML = list.map(_t => {
    const t = _t;
    /* TRAE 多链接随机分流：有 traeLinks 数组时，每次加载随机挑一个码展示，
       让不同访问者分散到不同分享码。单码时行为不变。 */
    let link = t.link;
    if (Array.isArray(t.traeLinks) && t.traeLinks.length) {
      const code = t.traeLinks[Math.floor(Math.random() * t.traeLinks.length)];
      link = "https://www.trae.cn/work-fission/" + code + "?utm_source=copy_link&utm_medium=friends_invite";
    }
    /* 邀请码自动轮换（优先于写死的 link） */
    const inv = pickInvite(t);
    if (inv) link = inv;
    const btn = t.poster
      ? `<button class="card-link card-poster-trigger" type="button" data-poster="${t.poster}" aria-label="查看详情海报">查看详情 <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" /></svg></button>`
      : `<a class="card-link" href="${link}" target="_blank" rel="noopener">查看详情 <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" /></svg></a>`;
    /* v2 折叠式正文：免费段 = quota + signup + charge 合并；效果段 = modality 模型 + effect */
    const freeSeg = [t.quota, t.signup, t.charge].filter(Boolean).map(s => cleanText(s)).join("。");
    const effSeg = [t.modality ? "可直连模型：" + cleanText(t.modality) : null, t.effect ? cleanText(t.effect) : null].filter(Boolean).join("。");
    const region = REGION_BY_NAME[t.name] ? `<span class="card-region">${cleanText(REGION_BY_NAME[t.name])}</span>` : '';
    return `
    <article class="card${t.tone ? ' tone-' + t.tone : ''}">
      ${t.badge ? `<span class="card-corner-badge">${cleanText(t.badge)}</span>` : ''}
      <div class="card-rating" title="香度 ${t.rating}/5">
        <span class="card-stars">${fire(t.rating)}</span>
        <span class="card-meta">
          <span class="card-type">${catOf(t)}</span>
          ${t.limited ? `<span class="card-limit-row"><span class="card-badge-inline">⏱ 限时 ${fmtMd(t.limited)}</span></span>` : ''}
        </span>
      </div>
      <div class="card-title-row">
        <h3 class="card-name">${cleanText(t.name)}</h3>
        ${region}
      </div>
      <p class="card-modality">${cleanText(t.modality)}</p>
      <hr class="card-divider" />
      ${freeSeg ? `<div class="card-field"><span class="ico">♪</span><span class="v">${seg(freeSeg)}</span></div>` : ''}
      ${effSeg ? `<div class="card-field"><span class="ico">✦</span><span class="v">${seg(effSeg)}</span></div>` : ''}
      <div class="card-action">
        ${t.extraAction ? `<a class="card-btn-secondary" href="${t.extraAction.link}" target="_blank" rel="noopener">${cleanText(t.extraAction.text)}</a>` : ''}
        ${btn}
      </div>
      <div class="card-footer">
        <div class="card-date">更新于 ${t.updated}</div>
      </div>
    </article>
  `;
  }).join("");
  playCardMotion();
}

filters.addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  filters.querySelectorAll(".chip").forEach(c => c.classList.remove("is-active"));
  btn.classList.add("is-active");
  filters.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", String(c === btn)));
  render(btn.dataset.type);
});

/* Hero 数据大字报 */
(function initStats() {
  const models = VISIBLE.filter(t => catOf(t) === "大模型").length;
  const tools = VISIBLE.filter(t => catOf(t) === "工具").length;
  const limited = VISIBLE.filter(t => t.limited).length;
  const latest = VISIBLE.slice().sort((a, b) => b.updated.localeCompare(a.updated))[0]?.updated || "—";
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("stat-models", models);
  set("stat-tools", tools);
  set("stat-limited", limited);
  set("stat-updated", latest);
  set("list-total", `已收录 ${VISIBLE.length} 条有效线索`);
})();

/* 回到顶部按钮 */
const backBtn = document.getElementById("backToTop");
const hero = document.getElementById("top");
if (backBtn && hero && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(([entry]) => {
    backBtn.classList.toggle("is-visible", !entry.isIntersecting);
  }, { threshold: 0.08 });
  observer.observe(hero);
  backBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

const wechatTrigger = document.querySelector(".wechat-trigger");
const qrcodeBox = document.getElementById("qrcode-wechat");
if (wechatTrigger && qrcodeBox) {
  wechatTrigger.addEventListener("click", () => {
    const isOpen = qrcodeBox.hasAttribute("hidden");
    qrcodeBox.toggleAttribute("hidden", !isOpen);
    wechatTrigger.setAttribute("aria-expanded", String(isOpen));
  });
}

render("all");

/* 海报弹窗：项目卡点击「立取领取」时弹出海报图片 */
(function initPosterModal() {
  const triggers = document.querySelectorAll(".card-poster-trigger");
  if (!triggers.length) return;

  let overlay = null;

  function createOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "poster-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "项目详情海报");
    overlay.innerHTML = '<div class="poster-backdrop"></div><div class="poster-dialog"><button class="poster-close" type="button" aria-label="关闭"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button><img class="poster-img" alt="项目详情海报" /><p class="poster-tip">长按海报右下角二维码，备注「Token-FBI」</p></div>';
    document.body.appendChild(overlay);

    const close = () => { overlay.classList.remove("is-open"); setTimeout(() => { overlay.style.display = "none"; }, 220); };
    overlay.querySelector(".poster-backdrop").addEventListener("click", close);
    overlay.querySelector(".poster-close").addEventListener("click", close);
    document.addEventListener("keydown", e => { if ((e.key === "Escape" || e.key === "Esc") && overlay.classList.contains("is-open")) close(); });

    return overlay;
  }

  triggers.forEach(btn => {
    btn.addEventListener("click", () => {
      const src = btn.dataset.poster || "";
      if (!src) return;
      const dlg = createOverlay();
      const img = dlg.querySelector(".poster-img");
      img.src = src;
      img.onerror = () => { img.alt = "海报加载失败"; };
      dlg.style.display = "flex";
      requestAnimationFrame(() => { dlg.classList.add("is-open"); });
    });
  });
})();

(function renderWatchout() {
  const box = document.getElementById("watchout-cards");
  const emptyEl = document.getElementById("watchout-empty");
  if (!box) return;
  if (!DONOTS.length) {
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }
  if (emptyEl) emptyEl.style.display = "none";
  box.innerHTML = DONOTS.map((item, i) => `
    <div class="row-watchout">
      <span class="row-watchout-num">${i + 1}</span>
      <h3 class="row-watchout-name">${cleanText(item.name)}</h3>
      <span class="row-watchout-region${REGION_BY_NAME[item.name] ? '' : ' is-empty'}">${REGION_BY_NAME[item.name] ? cleanText(REGION_BY_NAME[item.name]) : ''}</span>
      <span class="row-watchout-tag">观望</span>
      <p class="row-watchout-why">${cleanText(item.why)}</p>
      <a class="row-watchout-action" href="${item.link || "#"}" target="_blank" rel="noopener">查看详情 <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" /></svg></a>
    </div>
  `).join("");
})();

/* 轻量动效：失败时页面保持完全可读，减少动态效果偏好下不执行。 */
if (window.gsap) {
  const motion = window.gsap.matchMedia();
  motion.add("(prefers-reduced-motion: no-preference)", () => {
    motionReady = true;
    window.gsap.from("[data-reveal='hero-copy'], [data-reveal='watchlist']", {
      autoAlpha: 0,
      y: 18,
      duration: 0.54,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "transform,visibility,opacity"
    });
    window.gsap.from("[data-reveal='hero-stats'] > div", {
      autoAlpha: 0,
      y: 10,
      duration: 0.35,
      stagger: 0.055,
      delay: 0.18,
      ease: "power2.out",
      clearProps: "transform,visibility,opacity"
    });
    playCardMotion();
    return () => { motionReady = false; };
  });
}

/* 关于区：点击按钮复制微信号 / 复制备注（兼容旧浏览器降级） */
(function initWechatCopy() {
  const buttons = Array.prototype.slice.call(document.querySelectorAll(".about-wechat-btn"));
  if (!buttons.length) return;

  async function doCopy(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) { /* 走降级 */ }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  buttons.forEach((btn) => {
    const labelEl = btn.querySelector(".about-wechat-label");
    const defaultLabel = labelEl ? labelEl.innerHTML : btn.innerHTML;
    let resetTimer = null;
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy || "";
      const ok = await doCopy(text);
      btn.classList.toggle("is-copied", ok);
      if (labelEl) {
        labelEl.innerHTML = ok ? "已复制 " + text + " ✓" : "复制失败，请手动复制";
      } else {
        btn.innerHTML = ok ? "已复制 ✓" : "复制失败";
      }
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        btn.classList.remove("is-copied");
        if (labelEl) labelEl.innerHTML = defaultLabel;
        else btn.innerHTML = defaultLabel;
      }, 1800);
    });
  });
})();

/* 顶部分享条：点击直接复制文案 */
(function initShareBar() {
  const btn = document.getElementById("shareBtn");
  if (!btn) return;
  const defaultLabel = btn.textContent;
  let resetTimer = null;

  async function doCopy(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) { /* 走降级 */ }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  btn.addEventListener("click", async () => {
    const text = btn.dataset.copy || "";
    const ok = await doCopy(text);
    btn.classList.toggle("is-copied", ok);
    btn.textContent = ok ? "已复制，去分享吧 ✓" : "复制失败，请手动复制";
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      btn.classList.remove("is-copied");
      btn.textContent = defaultLabel;
    }, 2000);
  });
})();

/* 顶部「保存官网 · 防止失联」：能收藏就收藏，不能则退化为复制网址 + 快捷键提示 */
(function initSaveSite() {
  const btn = document.getElementById("saveSiteBtn");
  if (!btn) return;
  const url = btn.dataset.url || "https://token-fbi.com/";
  const title = "Token FBI · 免费 AI token 情报站";
  const defaultLabel = btn.textContent;
  let resetTimer = null;

  function flash(text, ok) {
    btn.classList.toggle("is-saved", !!ok);
    btn.textContent = text;
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      btn.classList.remove("is-saved");
      btn.textContent = defaultLabel;
    }, 2800);
  }

  btn.addEventListener("click", async () => {
    const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
    const shortcut = isMac ? "⌘ + D" : "Ctrl + D";
    try {
      if (window.external && typeof window.external.AddFavorite === "function") {
        window.external.AddFavorite(url, title);
        flash("已加入收藏夹 ✓", true);
        return;
      }
      if (window.sidebar && typeof window.sidebar.addPanel === "function") {
        window.sidebar.addPanel(title, url, "");
        flash("已加入收藏夹 ✓", true);
        return;
      }
    } catch (_) { /* 现代浏览器禁止脚本写收藏夹，走降级 */ }

    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        ok = true;
      }
    } catch (_) { ok = false; }

    flash(ok ? "网址已复制，按 " + shortcut + " 收藏" : "请按 " + shortcut + " 收藏官网", ok);
  });
})();
