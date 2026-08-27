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
    modality: "HY3 · 混元3 · 文本模型",
    rating: 5,
    quota: "HY3（混元3）模型限时免费，官方已宣布延长至 2026-08-31；注意 HY3 有每日用量限制，重置周期为 24 小时",
    effect: "腾讯系 AI 工作台，HY3（混元3）能力可直接调用，速度很快；写代码、查资料、做自动化都好用。Hy3 限免期间连续两周全球调用量第一（周调用 11.5 万亿 Token），因用户呼声限免从 7/22 延长到 8/31",
    how: "打开 WorkBuddy 客户端或网页版，HY3 现已开放免费调用（限免延至 8/31，抓紧用）",
    link: "https://www.codebuddy.cn/events/invite?inviteCode=akek8mgwjqlt",
    limited: "2026-08-31",
    updated: "2026-08-07"
  },

  /* ========== 较新 / 主力平台 ========== */

  {
    name: "TRAE Work",
    type: "工具",
    modality: "GLM-5.3 · GLM-5.2 / DeepSeek V4 Flash / 千问 3.8 Max · 不支持 Kimi K3",
    rating: 4,
    quota: "通过我的分享链接登录桌面端，新注册用户一次性获得 5000 积分",
    effect: "TraeWork AI 办公平台，可一站式搞定各类办公与创作任务。模型调用走折扣价通道，支持最新 GLM-5.3、GLM-5.2、DeepSeek V4 Flash、千问 3.8 Max，相比官方原价更低（注意：不支持 Kimi K3）",
    how: "打开我的分享链接 https://www.trae.cn/work-fission/3FJMREFR56D3?utm_source=copy_link&utm_medium=friends_invite → 下载并登录 TraeWork 桌面端 → 新账号自动到账 5000 积分，直接选用 GLM-5.3 / GLM-5.2 / DeepSeek V4 Flash / 千问 3.8 Max 模型开始使用",
    link: "https://www.trae.cn/work-fission/3FJMREFR56D3?utm_source=copy_link&utm_medium=friends_invite",
    /* traeLinks：TRAE 分享码列表（当前单码）。多个码时每次加载随机挑一个展示，分散调用压力。
       加第二条码只要在此数组里追加一段即可（如 "XXXX"）。 */
    traeLinks: ["3FJMREFR56D3"],
    updated: "2026-08-27"
  },

  {
    name: "腾讯 Marvis（马维斯）",
    type: "工具",
    modality: "混元 / DeepSeek V4 · 操作系统级 AI 助手",
    rating: 4,
    quota: "每人每天 1000 万免费 Token（当前完全免费，无需邀请码，长期免费不现实但现免费用）",
    effect: "腾讯操作系统级 AI 助手，一句话调度 6 个 Agent 并行干文件/系统/应用/网页/搜索任务；效率模式用混元 + DeepSeek V4 云端模型，隐私模式走本地 Qwen 端侧模型，数据不出域，支持 Win/Mac/安卓/iOS 跨端操控",
    how: "打开 marvis.qq.com 下载客户端（Win/Mac/安卓）→ 用 QQ/微信登录即用，每天 1000 万免费 Token 自动到账，无需额外配置",
    link: "https://marvis.qq.com",
    updated: "2026-07-24"
  },

  {
    name: "火山引擎 Ark 协作计划（字节）",
    type: "大模型",
    modality: "GLM5.2 · 文本模型",
    rating: 5,
    quota: "每天免费 300 万 token（解决小问题即切换，超额才扣费）",
    effect: "可调用 GLM5.2 等模型，适合日常高频小任务",
    how: "打开火山引擎 Ark 协作计划页面，按活动领取每日免费额度即可",
    link: "https://console.volcengine.com/ark/region:cn-beijing/openManagement/rewardPlan",
    updated: "2026-07-14"
  },

  {
    name: "七牛云 AI 推理",
    type: "大模型",
    modality: "千问 3.8 Max / DeepSeek V4 Flash / Kimi K3 · 文本模型",
    rating: 5,
    quota: "300 万 token，新用户再送 1000 万 token（可直接用于千问 3.8 Max / DeepSeek V4 Flash / Kimi K3）",
    effect: "直接调用千问 3.8 Max、DeepSeek V4 Flash、Kimi K3 等热门模型，免工具调用，注册登录即可拿 API",
    how: "访问 https://s.qiniu.com/VV7Zfa 注册登录，到 https://portal.qiniu.com/ai-inference/api-key 创建 API Key（注意：不要在微信内打开）",
    link: "https://s.qiniu.com/VV7Zfa",
    updated: "2026-07-14"
  },

  {
    name: "美团 catpaw（App）",
    type: "工具",
    modality: "LongCat 等 · 多模型聚合（LongCat 免费）",
    rating: 5,
    quota: "新用户登录即送 1200 积分（此前为 500 次兑换额度），日常调用够用；longcat（LongCat）模型当前免费",
    effect: "美团旗下 AI App，多模型聚合，当前 longcat（LongCat）模型免费不限量使用；界面类 WorkBuddy / Codex，对话 + 编程场景全覆盖",
    how: "打开 catpaw.meituan.com 注册登录即领 1200 积分 → 在模型列表选 LongCat 等直接使用，LongCat 当前免费（注意：装 App 后若曾装过 catpaw ai，可能出现图标重复，属已知现象）",
    link: "https://catpaw.meituan.com/",
    updated: "2026-07-22"
  },

  {
    name: "豆包拉新项目",
    type: "项目",
    modality: "网盘拉新 · 多平台带赚",
    rating: 4,
    quota: "豆包拉新一单 15 元，迅雷网盘一单 15 元，夸克网盘 13 元，各种拉新项目，免费带赚",
    effect: "多平台拉新变现项目：豆包 / 迅雷网盘 / 夸克网盘等，单笔佣金 13-15 元，零门槛免费参与，扫码加微信了解详情并获取推广素材",
    how: "点击下方「立取领取」查看海报 → 长按海报右下角二维码添加微信（备注 Token-FBI）→ 获取各平台推广链接与素材",
    link: "#",
    tone: "orange",
    poster: "poster-doubao-laxin.jpg",
    updated: "2026-08-22"
  },

  {
    name: "2026 微信小程序开发大赛",
    type: "大模型",
    modality: "DeepSeek V4 Flash / GLM-5.2 · 文本模型（Coding Plan 免费 Token）",
    rating: 4,
    quota: "报名大赛免费领独立 Token：有人发 DeepSeek V4 Flash，有人发 GLM-5.2（按抽取批次不定）；GLM-5.2 输入上下文 200K、最大输出 48K、每 5 小时约 1200 次、每周约 9000 次、每月约 18000 次请求；工具调用与思考模式已开启（暂不支持图片输入）",
    effect: "微信官方开发者大赛发放的免费编程 Token，无论是 DeepSeek V4 Flash 还是 GLM-5.2，实际用起来都非常丝滑、效果好；OpenAI 兼容格式、即领即用，可直接填进 Cursor / Claude Code / OpenCode 等支持自定义 base_url 的编程工具；GLM-5.2 为智谱旗舰 Coding 模型，长程任务与工程接管能力强，适合小程序开发、代码重构与长文本处理",
    how: "报名「2026 微信小程序开发大赛」→ 报名成功后约 7-10 天收到大赛组委会邮件（内含领取链接 chataPI.weixin.qq.com）→ 用报名大赛的微信扫码登录 → 点击「申请 Token」（按报名顺序分批发放，到手可能是 DeepSeek V4 Flash 或 GLM-5.2，首次没领到可等下一批邮件再试）",
    link: "https://contest.weixin.qq.com/eventDetails?id=4598379302114656257",
    updated: "2026-08-18"
  },

  {
    name: "硅基流动 SiliconFlow",
    type: "大模型",
    modality: "GLM5.2 等全模型 · 文本/多模态",
    rating: 4,
    quota: "邀请好友奖励：每邀请 1 位得 14 元额度",
    effect: "聚合多家开源大模型（含智谱 GLM5.2、DeepSeek 等），文本 / 图像多模态 API，兼容 OpenAI 格式",
    how: "打开 cloud.siliconflow.cn 注册（可走邀请链接）→ 在「邀请有礼」中邀请好友，每邀 1 位得 14 元额度",
    link: "https://cloud.siliconflow.cn/i/HgdEna2e",
    updated: "2026-07-15"
  },

  {
    name: "NVIDIA NIM 免费 API",
    type: "大模型",
    modality: "多模型聚合（文本 / 多模态）",
    rating: 5,
    quota: "标 Free Endpoint 的模型免费调用，提供 H100 算力（速率有限制，个人学习/测试够用）",
    effect: "可调 MiniMax M2.7、GLM-5.1、Kimi K2.5、DeepSeek V3.2、Gemma 4、Llama 4 等顶级模型，兼容 OpenAI SDK",
    how: "打开 build.nvidia.com 注册（+86 手机号可验证）→ 创建 API Key → 调 Free Endpoint 模型（base_url: integrate.api.nvidia.com/v1）",
    link: "https://build.nvidia.com",
    updated: "2026-07-15"
  },

  {
    name: "商汤 Token Plan（sensenova）",
    type: "大模型",
    modality: "SenseNova 6.7 Flash-Lite / U1 Fast / DeepSeek V4 Flash · 日日新系列 · 文本模型",
    rating: 3,
    quota: "限时免费公测：每个模型每 5 小时 1500 次调用（首月免费体验，按次数计非 Token）",
    effect: "限免额度已从 500 次/5h 加码到 1500 次/5h，且新增 SenseNova 6.7 Flash-Lite、SenseNova U1 Fast 等自研模型可选；DeepSeek V4 Flash 依旧在列，适合跑 Agent、图表分析、办公自动化和多模态任务。⚠️ 注意：日日新系列近期模型错误频发（报错率高），白天不建议使用，晚间相对稳定，介意的话避开白天高峰",
    how: "手机号注册 sensenova.cn/token-plan → 创建 API Key → 文档查 Base URL（https://token.sensenova.cn/v1/chat/completions）与 Model ID（deepseek-v4-flash 等）→ 填进客户端",
    link: "https://www.sensenova.cn/token-plan",
    updated: "2026-08-07"
  },

  {
    name: "Agnes AI",
    type: "大模型",
    modality: "全模态模型",
    rating: 5,
    quota: "不限期全模态免费，API 每分钟 20 次请求（RPM 20 以内）",
    effect: "Agnes2.0 全模态模型，文本 / 图像 / 视频全能适配，官方承诺持续升级并保持免费",
    how: "注册 platform.agnes-ai.com 生成 API Key 直接调用；多模态建议配合官方 skill（github.com/lj1270998580-crypto/Agnes-help-skill）使用",
    link: "https://platform.agnes-ai.com",
    updated: "2026-08-03"
  },

  {
    name: "美团 longcat 大模型",
    type: "大模型",
    modality: "文本模型",
    rating: 5,
    quota: "新用户免费 1000 万 token，很耐用；续购 9.9 元买 5000 万",
    effect: "美团旗下大模型，免费额度大方、性价比高，适合长期日常高频使用",
    how: "打开 longcat.chat 官网注册即送新用户免费额度，用完可在平台低价续购",
    link: "https://longcat.chat/platform/product",
    updated: "2026-07-14"
  },

  /* ========== 较老模型平台 ========== */

  {
    name: "OpenRouter",
    type: "大模型",
    modality: "35+ 聚合模型（Kimi K2 / Qwen3-Next-80B / Llama 等）",
    rating: 3,
    quota: "注册即享永久免费模型（BYOK 用户每月 100 万次请求）；免费模型每日 50 次（充值 $10 后升至 1000 次/日）",
    effect: "一站式聚合 500+ 模型（GPT/Claude/Gemini/Kimi/DeepSeek 等），OpenAI 兼容接口，一个 Key 切所有模型。⚠️ 实测反馈：GLM-5.2(free) 当前报 429 错误用不了（限流/上游不可用），免费模型可用性不稳定",
    how: "打开 openrouter.ai 注册（无需信用卡）→ 进入 Keys 页创建 API Key → 选 :free 后缀模型直接调用（如 kimi/kimi-k2:free）；⚠️ GLM-5.2(free) 实测报 429 无法调用，建议优先用其他 :free 模型",
    link: "https://openrouter.ai",
    updated: "2026-08-19"
  },

  /* ========== 降级区：2026-08-07 下调两星，暂列末位观察 ========== */

  {
    name: "BazaarLink",
    type: "大模型",
    modality: "DeepSeek V4 Flash · 1M 上下文 · OpenAI 兼容网关",
    rating: 2,
    quota: "DeepSeek V4 Flash 长期免费：10 RPM / 每天 150 次（不绑卡、不充值、无试用期；充值账户额度 ×3 至 450 次/天）",
    effect: "中国台湾集聯科技有限公司（統一編號 62232477，登記於苗栗縣頭份市）运营的 OpenAI 完全兼容多模型聚合网关，数据驻留 AWS Tokyo（非大陆、非美本土）。免费档开放 DeepSeek-V4-Flash（284B MoE、激活 13B、1M tokens 超长上下文、最大输出 38.4 万 tokens）。支持把 model 设为「auto:free」自动路由到零成本模型；可直接对接 Claude Code、Cursor、LangChain、Dify、LiteLLM 等；额度按请求 token 数动态加权扣减，短问答实际可用次数远超 150 次",
    how: "打开 bazaarlink.ai/free 用邮箱注册（无需信用卡）→ 进入 /keys 创建密钥（sk-bl- 开头，仅显示一次，请立即保存）→ base_url 填 https://bazaarlink.ai/api/v1，模型名填 deepseek/deepseek-v4-flash 或 auto:free；Agent 也可 POST /api/v1/agents/register 自助申请 Key",
    link: "https://bazaarlink.ai/free",
    updated: "2026-07-31"
  },

  {
    name: "HuggingFace Inference API",
    type: "大模型",
    modality: "DeepSeek V4 / Qwen3 / Mistral 等 · 开源模型",
    rating: 2,
    quota: "免费共享推理端点，无需信用卡（限流，适合原型验证；PRO $9/月或自部署解锁更高额度）",
    effect: "全球最大开源模型社区提供的免费推理 API，覆盖 DeepSeek-V4、Qwen3-235B、Mistral Large 3、Llama 等上千开源模型，无需绑卡即可用 OpenAI 兼容接口调用，适合个人开发与模型对比测试",
    how: "打开 huggingface.co 注册 → 在模型页点「Deploy → Inference API」或用共享端点 router.huggingface.co/hf-inference → 用 HF Token 调用（curl/OpenAI SDK 均可）",
    link: "https://huggingface.co",
    updated: "2026-07-24"
  },

  {
    name: "月之暗面 Kimi 开放平台",
    type: "大模型",
    modality: "Kimi K2.6 / K2.5 · 长上下文 MoE 模型",
    rating: 2,
    quota: "新用户注册赠送 15 元体验金（永久有效，按量抵扣，无需绑卡）",
    effect: "月之暗面官方平台，Kimi K2.6 最新最智能、长程代码编写更强更稳；K2.5 支持百万上下文、视觉+文本、思考/非思考模式，3 RPM 限速但超长文本处理一流",
    how: "打开 platform.moonshot.cn 注册（手机号）→ API Key 管理新建密钥（sk- 开头，生成后须立即复制保存）→ 调 kimi-k2.6 / kimi-k2.5（base_url: https://api.moonshot.cn/v1）",
    link: "https://platform.moonshot.cn",
    updated: "2026-07-23"
  },

  {
    name: "魔搭社区 ModelScope",
    type: "大模型",
    modality: "Qwen 系列 / LUX / Stable Diffusion 等 · 文本+多模态",
    rating: 1,
    quota: "已切换『魔豆』计费体系，每日免费调用次数较此前明显下调（原每天 2000 次 RPD 缩水）；注册即享、无需实名即可注册，但需留意额度变动",
    effect: "阿里达摩院开源社区，收录 17 万+ 开源模型，生态完整、国内访问稳定；API-Inference 支持文本/图像等多模态，适合原型验证与模型体验。⚠️ 2026-08 起改采『魔豆』计费，免费调用次数较此前明显减少",
    how: "打开 modelscope.cn 注册 → 【访问控制】获取 Access Token（需绑阿里云并实名才能用 API-Inference）→ 配置到工具（注意 Anthropic 兼容时去掉 ms- 前缀）",
    link: "https://modelscope.cn",
    updated: "2026-08-07"
  },

  {
    name: "OpenStarry",
    type: "工具",
    modality: "GLM 5.2 / DeepSeek V4 / Kimi K2.6 / MiniMax M3 等 40+ 模型",
    rating: 1,
    quota: "注册即赠 200 次免费调用（Coding Plan + Token Plan 按量计费，一个 Key 接入 40+ 国产及国际模型）",
    effect: "国产大模型 API 聚合中转平台，统一管理多家提供商，一行代码改动随时切换模型；覆盖最新 GLM 5.2 / Kimi K2.6 / DeepSeek V4 / MiniMax M3 / Qwen3.7-Max 等",
    how: "打开 openstarry.com 注册 → 创建 API Key → 勾选免费模型权限 → 复制 Key 配置到客户端（OpenAI 兼容格式）",
    link: "https://www.openstarry.com",
    updated: "2026-07-23"
  },

  {
    name: "OpenCode Zen",
    type: "工具",
    modality: "DeepSeek V4 Flash Free / MiMo-V2.5 Free / Nemotron 3 Ultra Free / Big Pickle 等",
    rating: 2,
    quota: "多个精选模型限时免费（DeepSeek V4 Flash Free、MiMo-V2.5 Free、North Mini Code Free、Nemotron 3 Ultra Free、Big Pickle），无需付费；余额低于 $5 才自动充值",
    effect: "OpenCode（16 万+ Star 开源编程 Agent）自带的 Zen 模型网关，专为 coding agent 基准测试挑选并验证的模型，OpenAI 兼容接口，可配到任意编程客户端",
    how: "打开 opencode.ai 安装 OpenCode → 在配置里启用 Zen（base_url: https://opencode.ai/zen/v1/chat/completions）→ 选用带 Free 后缀的免费模型即可，无需绑卡",
    link: "https://opencode.ai/zen",
    updated: "2026-07-23"
  },

  {
    name: "微信 AI 小程序成长计划（云开发 CloudBase）",
    type: "大模型",
    modality: "Hy3 + Hy Image 3.0 · 文本/生图",
    rating: 3,
    quota: "10 亿大模型 Token + 10 万张 AI 生图（本轮加码后额度，自申请起 6 个月有效），另送 6 个月个人版云开发环境",
    effect: "腾讯云开发 CloudBase 联合微信小程序的开发者扶持计划，模型已全面升级为混元 Hy3 与 Hy Image 3.0；全行业无类目限制，小游戏开发者同享。10 亿 Token 足够把 AI 能力『用厚』在产品里，老用户自动升级或领 120 元代金券",
    how: "登录微信公众平台 mp.weixin.qq.com → 行业能力 → AI 小程序成长计划报名 → 开通 CloudBase 个人版环境后额度自动到账 → 控制台 AI 模块勾选 Hy3 即可调用（也可配 CloudBase MCP 在 CodeBuddy/Cursor 里用自然语言生成小程序）",
    link: "https://cloud.tencent.com/developer/article/2705075",
    limited: "2026-12-31",
    updated: "2026-07-29"
  },


  {
    name: "腾讯云 TokenHub",
    type: "大模型",
    modality: "Hy3 · DeepSeek V4 · GLM-5 · MiniMax-M2.7 · Kimi-K2.5 等",
    rating: 3,
    quota: "语言/多模态理解模型各 100 万 Tokens（官方文档最新口径：有效期 1 年）+ HY-Image-V3.0 生图 50 次 + 视频生成 50 积分 + 混元 3D 100 积分，活动持续至 2026-12-31",
    effect: "腾讯云大模型服务平台，覆盖 Hy3、DeepSeek-V4-Pro/Flash、GLM-5.2/5.1、Kimi-K2.6/K2.5、MiniMax-M3/M2.7 等 16+ 主流模型，免费包已扩展到文本+生图+视频+3D 全线；首次调用自动领取，OpenAI 兼容 API，一个 Key 切多模型",
    how: "登录 TokenHub 控制台 → 实名认证 → 进入模型广场 → 点击右上角「新用户福利免费体验」→ 勾选模型后立即领取；也支持首次调用时自动领取",
    link: "https://cloud.tencent.com/product/tokenhub",
    limited: "2026-12-31",
    updated: "2026-07-30"
  },

  {
    name: "天翼云息壤（电信）",
    type: "大模型",
    modality: "GLM-5 · DeepSeek V4 · Qwen3.5 · Doubao 等约 18 个主流模型",
    rating: 2,
    quota: "文本类模型 2500 万 Tokens/模型（有效期 2 周，从首次使用算起）；DeepSeek V4 Pro/Flash 各 50 万 Tokens",
    effect: "中国电信旗下全栈国产化智算平台，\"国模+国芯+国云\"融合底座，支持 GLM-5、DeepSeek-V4、Qwen3.5、Doubao-Seed-2.0-pro 等约 18 个主流大模型，适合政企/科研/个人开发者",
    how: "登录天翼云官网 → 完成实名认证 → 进入「息壤智算」→「模型广场」→ 选模型领取免费额度；额度耗尽或到期后可直接切换其他模型继续使用",
    link: "https://www.ctyun.cn/product/maas",
    updated: "2026-07-19"
  },

  /* ========== 倒数第二：太行HUB（2026-08-12 新增） ========== */

  {
    name: "太行HUB（token.taiha.cn）",
    type: "大模型",
    modality: "DeepSeek-V4 / 通义千问-Max / GLM-4 / 豆包-Pro / 阶跃 / Kimi / 混元 / 百川3 等 · 文本+多模态",
    rating: 5,
    quota: "新用户注册送 2 元余额（按量抵扣）；模型价格比各大官方低 20%-37%，无充值手续费、无最低消费门槛",
    effect: "A股上市公司旗下合规聚合平台（增值电信 + EDI 双证），一个 Key 调用中国所有顶尖模型：DeepSeek-V4 / 通义千问-Max / 智谱 GLM-4 / 豆包-Pro / 阶跃星辰 / Kimi / 混元 / 百川3 等文本模型，通义千问-VL / GLM-4V / DeepSeek-VL / 豆包视觉 / Seedance 2.5 等多模态，以及 Embedding / 语音识别 / 实时翻译等功能模型；完全兼容 OpenAI 协议，base_url https://api.taiha.cn/v1，Claude Code / Cursor / Dify 等工具即插即用；价格比官网直降 20%-37%，支持开发票与企业对公采购",
    how: "打开注册链接注册 → 新用户到账 2 元余额 → 充值账户余额（全模型共享消耗）→ 创建 API Key → base_url 填 https://api.taiha.cn/v1 即可调用任意模型",
    link: "https://token.taiha.cn/sign-up?aff=Ox6S",
    updated: "2026-08-12"
  },

  /* ========== 国家超算互联网 SCNet（2026-08-21 新增，DeepSeek V4 低价平替渠道） ========== */

  {
    name: "国家超算互联网 SCNet",
    type: "大模型",
    modality: "DeepSeek V4 Pro / V4 Flash · GLM-5.2 · MiniMax-M3 · Kimi-K2.6 等",
    rating: 4,
    quota: "Token Plan 包月：基础版 ¥30/月 → 60,000 Credits（原价 ¥50）；标准版 ¥110 → 240,000；高级版 ¥265 → 600,000。兼容 OpenAI / Anthropic 接口，Credits 按实际消耗折算抵扣",
    effect: "科技部牵头、中科曙光支撑的国家级算力平台，把全国超算/智算中心资源统一对外；DeepSeek 涨价后最划算的官方背景平替。V4-Flash 缓存命中低至 0.012 元/百万 Token、未命中输入 0.6 元、输出 1.2 元，对比官方峰值便宜约 7-8.3 倍（V4 Pro 便宜约 1.75-7 倍）；不用对话数据训练。⚠️ 槽点：并发/稳定性一般、高峰需排队；新模型上架滞后；资源包与余额扣减逻辑绕（需关注算力券/补贴包多重叠加）。适合能接受排队、想压成本的重度调用",
    how: "打开 scnet.cn 用手机号注册 → 登录控制台 → 左侧「模型服务」→「Token Plan」选套餐并支付（基础版 ¥30/月 → 60,000 Credits）→ 自动生成专属 API Key（sk-tp- 开头）+ Base URL https://api.scnet.cn/api/llm/v1 → 填进 Claude Code / Cursor / OpenCode / Dify 等工具即可",
    link: "https://www.scnet.cn/",
    updated: "2026-08-21"
  },

  /* ========== 末尾：MonkeyCode（2026-08-12 新增） ========== */

  {
    name: "MonkeyCode（长亭）",
    type: "工具",
    modality: "GLM / Kimi / MiniMax / Qwen / DeepSeek 等 · 全主流模型",
    rating: 3,
    quota: "免费档 ¥0 永久：每天 30M Token（3000 万），云开发环境 1C/4G、1 个任务并发；每日签到 100 积分，每邀请 1 位新用户 +5000 积分",
    effect: "长亭科技（Chaitin）出品的在线 AI 编程开发平台，浏览器即用、自带云端开发环境与终端，可跑 Agent 做开发/调研/文档/数据分析，PC 与手机数据实时同步；内置 GLM/Kimi/MiniMax/Qwen/DeepSeek 等主流模型；GitHub 全量开源（AGPLv3）。⚠️ 免费档限基础模型范围 + 单任务并发",
    how: "打开链接注册即用 → 浏览器进入控制台创建开发任务 → 免费档每天 30M Token 自动到账；建议每日签到、邀请好友多攒积分",
    link: "https://monkeycode-ai.com/?ic=019fe974-4b9e-7186-b8a6-2901baec7c2e",
    updated: "2026-08-12"
  },

  /* ========== 末尾：点点 AI（小红书 dots3-note-prev，2026-08-18 新增） ========== */

  {
    name: "点点 AI（小红书 dots3-note-prev）",
    type: "大模型",
    modality: "dots3-note-prev · 文本 / 图像 / 视频 / 音频 多模态 MoE（512K 上下文）",
    rating: 5,
    quota: "限时免费公测中：20 RPM（每分钟请求）、50 万 TPM（每分钟 Token），官方暂未公布硬性上限",
    effect: "小红书 dots 模型实验室官方 AI 平台，自研 dots3-note-prev 多模态 MoE（280B 总参 / 16B 激活，512K 超长上下文），统一理解文本 / 图像 / 视频 / 音频，针对长程 Agent 任务优化，内置 Self-Critiquing 自主纠错；小红书官方评测称其综合表现优于 GLM-5.2。国内用户小红书扫码或手机号即可登录，门槛低。⚠️ 用户实测：输出速度很快，但不擅长写代码",
    how: "登录 dots.ai 用小红书扫码或手机号注册 → 进入 API Key 页面创建密钥 → 客户端 base_url 填 https://note3-prev-api.askdiandian.com/v1、模型名填 dots3-note-prev（OpenAI 兼容，即插即用）",
    link: "https://dots.ai/platform/apikeys",
    updated: "2026-08-18"
  },

  /* ========== 末尾：TeleAgent（星辰超级智能体，2026-08-19 新增） ========== */

  {
    name: "TeleAgent（星辰超级智能体）",
    type: "工具",
    modality: "中国电信星辰大模型 · 系统级 AI Agent（对话 / 编程 / 深度调研 / 文档办公）",
    rating: 3,
    quota: "每天 6000 万 token（官方活动口径）；桌面版本地驻留，数据存于本地硬盘，不强制上传",
    effect: "中国电信天翼 AI 出品的「星辰超级智能体」桌面版，系统级 AI 办公助手（Windows 10+/macOS 13+）：可整理文件、Word/Excel 提取与汇总、深度调研与资讯抓取、写文档做 PPT、写代码做应用；跨软件自由穿梭（搜索网页、算 Excel、填 Word），思路透明可随时介入修正，支持可扩展 Skill、自主任务调度、持久化记忆；本地驻留适合处理财务报表、商业机密等敏感信息",
    how: "打开天翼 AI 官网 → 选择 Windows 或 macOS 对应桌面版下载安装 → 登录中国电信账号 → 启动「星辰超级智能体」即可使用（每日 6000 万 token 额度自动到账）",
    link: "https://www.teleai.com.cn/product/teleagent",
    updated: "2026-08-19"
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
    link: "https://platform.stepfun.com/?invite_code=HMVLLXUM"
  },
  {
    name: "ZenMux",
    why: "免费额度大幅缩水，需充值解锁才能正常使用",
    link: "https://zenmux.ai/invite/CIYB5Z"
  }
];

/* 观望名单中的平台：其官网大卡不再展示（数据保留在 TOKENS，移出观望名单后自动恢复） */
const DONOT_NAMES = new Set(DONOTS.map(d => d.name));
const VISIBLE = TOKENS.filter(t => !DONOT_NAMES.has(t.name));

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
    let link = t.link, how = t.how;
    if (Array.isArray(t.traeLinks) && t.traeLinks.length) {
      const code = t.traeLinks[Math.floor(Math.random() * t.traeLinks.length)];
      link = "https://www.trae.cn/work-fission/" + code + "?utm_source=copy_link&utm_medium=friends_invite";
      if (t.how) how = t.how.replace(/work-fission\/[A-Z0-9]+\?/i, "work-fission/" + code + "?");
    }
    return `
    <article class="card${t.limited ? ' is-limited' : ''}${t.tone ? ' tone-' + t.tone : ''}">
      ${t.limited ? `<span class="card-badge" title="限时活动，截止 ${cleanText(t.limited)}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 4.25v4l2.5 1.5M13.5 8A5.5 5.5 0 1 1 2.5 8a5.5 5.5 0 0 1 11 0Z" /></svg>限时 ${fmtMd(t.limited)}</span>` : ''}
      <div class="card-top">
        <h3 class="card-name">${cleanText(t.name)}</h3>
        <div class="card-tags">
          ${t.modality ? `<span class="card-modality">${cleanText(t.modality)}</span>` : ''}
          ${t.special ? `<span class="card-special" title="${cleanText(t.special)}">${cleanText(t.special)}</span>` : ''}
        </div>
      </div>
      <div class="card-rating" title="香度 ${t.rating}/5">${fire(t.rating)} <span class="card-type">${catOf(t)}</span></div>
      <div class="card-row"><span class="k">免费额度</span><span class="v">${cleanText(t.quota)}</span></div>
      <div class="card-row"><span class="k">效果怎么样</span><span class="v">${cleanText(t.effect)}</span></div>
      <div class="card-row how-row"><span class="k">怎么拿</span><span class="v">${cleanText(how)}</span></div>
      <div class="card-footer">
        ${t.poster ? `<button class="card-link card-poster-trigger" type="button" data-poster="${t.poster}" aria-label="查看详情海报">立取领取 <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" /></svg></button>` : `<a class="card-link" href="${link}" target="_blank" rel="noopener">立即领取 <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" /></svg></a>`}
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
      <span class="row-watchout-tag">观望</span>
      <p class="row-watchout-why">${cleanText(item.why)}</p>
      <a class="row-watchout-action" href="${item.link || "#"}" target="_blank" rel="noopener">立即领取 <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" /></svg></a>
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
