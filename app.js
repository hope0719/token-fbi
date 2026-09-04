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
    modality: "HY3（混元3） · HY4（混元4） · 文本模型",
    rating: 5,
    quota: "HY3（混元3）限免延期至 2026-09-30；新出的 HY4（混元4）限免至 2026-09-10（更早截止，抓紧）",
    signup: "新用户注册送 2000 积分，折算下来新用户合计可得 3300 积分额度（含模型限免）",
    effect: "腾讯系 AI 工作台，HY3（混元3）与最新 HY4（混元4）均可直接调用，速度很快；写代码、查资料、做自动化都好用。HY3 限免期间连续两周全球调用量第一（周调用 11.5 万亿 Token），因用户呼声限免从 7/22 一路延长到 9/30；HY4 新上线同样限时免费，但仅到 9/10",
    link: "https://curl.qcloud.com/8dvDMEyi",
    limited: "2026-09-10",
    updated: "2026-09-04",
    v2: true
  },

  {
    name: "阿里云 Qoder（灵码）",
    type: "工具",
    modality: "Qwen3.8-Max · 代码模型",
    rating: 5,
    quota: "免费领 800 次 Qwen3.8-Max 调用（8/3-9/3 新注册/付费用户，每人限 1 次，仅个人）；中国站下单再领 2000 次（8/3-9/3，仅个人）",
    effect: "阿里云官方编程助手（原灵码），主打通义千问旗舰 Qwen3.8-Max；桌面端 / JetBrains 插件 / CLI 全端可用，写代码、重构、答疑都稳，与阿里云生态插件配合体验顺滑",
    link: "https://www.aliyun.com/product/lingma?userCode=ygtxup80",
    limited: "2026-09-03",
    updated: "2026-08-28",
    v2: true
  },

  /* ========== 较新 / 主力平台 ========== */

  {
    name: "TRAE Work",
    type: "工具",
    modality: "GLM-5.3 / DeepSeek V4 Flash / 千问 3.8 Max · 不支持 Kimi K3",
    rating: 4,
    quota: "新用户登录送 5000 积分",
    effect: "TraeWork AI 办公平台，一站式搞定各类办公与创作任务；模型调用走折扣价通道、比官方原价更低，写文档、做表格、跑自动化流程都顺手",
    link: "https://www.trae.cn/work-fission/ESKME76PNXAY?utm_source=copy_link&utm_medium=friends_invite",
    /* traeLinks：TRAE 分享码列表（当前双码）。多个码时每次加载随机挑一个展示，分散调用压力。
       加第二条码只要在此数组里追加一段即可（如 "XXXX"）。 */
    traeLinks: ["ESKME76PNXAY", "AQCL4ZQD6NNC"],
    updated: "2026-08-30",
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
    quota: "报名后约 7-10 天收到 tokenplan 计划卡片，内含 DeepSeek V4 Flash 大额额度，单卡可用量高达 1 个亿",
    effect: "网站站长亲测：纯度极高、速度很好、量大管够；无需提交小程序也能领，别担心",
    link: "https://contest.weixin.qq.com/eventDetails?id=4598379302114656257",
    tone: "bluepurple",
    badge: "时间紧迫",
    updated: "2026-08-27",
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
    modality: "文本模型",
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
    modality: "DeepSeek V4 Flash Free / MiMo-V2.5 Free / Nemotron 3 Ultra Free / Big Pickle 等",
    rating: 2,
    quota: "多个精选模型限时免费（DeepSeek V4 Flash Free、MiMo-V2.5 Free、North Mini Code Free、Nemotron 3 Ultra Free、Big Pickle），无需付费；余额低于 $5 才自动充值",
    effect: "OpenCode（16 万+ Star 开源编程 Agent）自带的 Zen 模型网关，专为 coding agent 基准测试挑选并验证的模型，OpenAI 兼容接口，可配到任意编程客户端",
    link: "https://opencode.ai/zen",
    updated: "2026-07-23",
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
    effect: "科技部牵头、中科曙光支撑的国家级算力平台，把全国超算/智算中心资源统一对外；DeepSeek 涨价后最划算的官方背景平替。V4-Flash 缓存命中低至 0.012 元/百万 Token、未命中输入 0.6 元、输出 1.2 元，对比官方峰值便宜约 7-8.3 倍（V4 Pro 便宜约 1.75-7 倍）；不用对话数据训练。⚠️ 槽点：并发/稳定性一般、高峰需排队；新模型上架滞后；资源包与余额扣减逻辑绕（需关注算力券/补贴包多重叠加）。适合能接受排队、想压成本的重度调用",
    link: "https://www.scnet.cn/",
    updated: "2026-08-21",
    v2: true
  },

  /* ========== B.AI（孙哥 Justin Sun 的 AI 聚合平台，2026-09-02 修正：非百度 + 换邀请链接 + 前移 4 位） ========== */

  {
    name: "B.AI（AI 模型聚合平台）",
    type: "大模型",
    modality: "DeepSeek-V4-Flash / GLM-5.3-Flash / Qwen3.8-Flash / Hy3 / MiMo-V2.5 · 多模型免费",
    rating: 5,
    quota: "当前多款模型 0 Credits 免费（Chat + API 双端）：DeepSeek-V4-Flash（8/17 起全免费）、Hy3（8/21 起全免费）、MiMo-V2.5（API 已免费、Chat 8/25 开放）、GLM-5.3-Flash（API 已免费、Chat 上架后免费）、Qwen3.8-Flash（API 已免费、Chat 上架后免费）；另有 GLM-5.2 限时 6 折、GLM-5.3 限时 9 折",
    effect: "孙哥（孙宇晨 Justin Sun）的 AI 模型聚合平台 b.ai（⚠️ 不是百度官方），聚合接入 OpenAI / Anthropic / Google / DeepSeek / 月之暗面 / 千问 / Z.ai / MiniMax 等第三方模型，走 LLM 聚合 + Web3 钱包支付路线；官方公告白纸黑字确认上述免费/折扣活动，DeepSeek-V4-Flash 与 Hy3 在 Chat 和 API 双端均按 0 Credits 结算，可以放心长期跑",
    link: "https://chat.b.ai/chat?invite_code=CQLBPC",
    updated: "2026-09-02",
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
    name: "秒哒（字节跳动）",
    type: "工具",
    modality: "AI 应用生成工具 · 一句话造应用 · 0 代码搓小程序",
    rating: 5,
    quota: "通过我的邀请链接注册即可领取「秒点礼包」；0 帧起手，一句话生成完整可用的应用/小程序，0 代码 0 成本，普通人都能快速上手",
    effect: "秒哒是字节跳动的免费全能 AI 神器：可以普通、快速地做一个能直接运行的小程序——0 帧起手，一句话描述需求即可生成应用/小程序并运行，全程 0 代码 0 成本，普通人零代码也能轻轻松松搓出来",
    link: "https://www.miaoda.cn/?invitecode=user-7a0wz6474m4k",
    tone: "orange",
    alwaysShow: true,
    updated: "2026-09-02",
    v2: true
  },

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
    why: "可用模型数量、分量都比较少，性价比一般；唯一亮点是每日可重置额度",
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
    name: "OpenCode Zen",
    why: "这是一个软件/工具，好像没有任何免费额度",
    link: "https://opencode.ai/zen"
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
    name: "阶跃星辰 StepFun",
    why: "限时活动已结束，新用户仅赠 10 额度（¥10 余额），不再有大规模免费额度",
    link: "https://platform.stepfun.com"
  },
  {
    name: "ZenMux",
    why: "免费额度大幅缩水，需充值解锁才能正常使用",
    link: "https://zenmux.ai"
  },
  {
    name: "美团 longcat 大模型",
    why: "目前不在精选范围（不提供 DeepSeek V4 / GLM 5.3 / Kimi K3 / 千问 3.8 / Hy4 等门槛模型）",
    link: "https://longcat.chat/platform/product"
  },
  {
    name: "天翼云息壤（电信）",
    why: "免费额度太低：DeepSeek V4 Pro/Flash 各仅 50 万 Tokens，且使用期限时 2 周",
    link: "https://www.ctyun.cn/product/maas"
  }
];

/* ========== 精选规则（2026-09-02 起） ==========
 * 只展示「提供 ≥ 门槛系列模型」的卡片：门槛= index.html「优先收录」列表里的 6 个最低档型号。
 * 同系列更高版本自动命中（DeepSeek V4 Flash/Pro、GLM-5.3-Flash、千问 3.8 Max/Flash 等）；
 * 低于门槛的型号（DeepSeek 3.2、GLM 5/5.2、Kimi K2.6、Qwen 3.5、Hy3 等）一律不展示。
 * 判定：卡片 name + modality 合并文本中包含任一门槛关键词（大小写、连字符、空格、· 不敏感）。
 * 广告卡（豆包拉新）设 alwaysShow: true 绕过本规则，单独放行；UI 看起来与普通卡片无异。 */
const FEATURED_KEYS = {
  "DeepSeek V4":  ["deepseekv4"],
  "GLM 5.3":      ["glm53"],
  "Kimi K3":      ["kimik3"],
  "千问 3.8":     ["千问38", "qwen38"],   // 同时覆盖 Max 与 Flash
  "Hy4":          ["hy4"]
};
function isFeatured(t) {
  const text = (t.name + " " + (t.modality || "")).toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "");
  for (const keys of Object.values(FEATURED_KEYS)) {
    for (const k of keys) {
      if (text.includes(k)) return true;
    }
  }
  return false;
}

/* 观望名单中的平台：其官网大卡不再展示（数据保留在 TOKENS，移出观望名单后自动恢复） */
const DONOT_NAMES = new Set(DONOTS.map(d => d.name));
/* VISIBLE：去掉观望名单 + 必须命中精选规则（alwaysShow 广告卡单独放行） */
const VISIBLE = TOKENS.filter(t => !DONOT_NAMES.has(t.name) && (t.alwaysShow || isFeatured(t)));

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
  "AMD 免费 API 与开发者计划": "美国"
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
