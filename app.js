/* =========================================================
 * Token 情报局 · Token FBI
 * 卡片数据都在下面的 TOKENS 数组里。
 * 想加一条情报？复制一个 {...} 对象粘进去就行，字段说明见每个属性。
 *   - modality：模型类型（文本模型 / 多模态大模型 / 全模态模型 等），显示在名字右边
 * ========================================================= */

const TOKENS = [
  /* ========== 固定置顶 ========== */
  {
    name: "阶跃星辰 StepFun",
    type: "大模型",
    modality: "多模态大模型",
    rating: 5,
    quota: "400M Credits + 15天免费体验（用完再送15天，邀请好友最高累计90天）",
    effect: "可用全部旗舰自研模型：step-3.7-flash（最新旗舰，推理最强）、step-3.5-flash、step-image-edit-2（图像编辑）、stepaudio 系列（语音/ASR/TTS），覆盖文/图/音/视频/推理",
    how: "注册后到 Plan 列表点「免费领取」，再到 Step Plan 菜单拿 Base URL 与密钥接入（兼容 OpenAI/Claude API）。活动 7 月 31 日截止，仅限新用户",
    link: "https://platform.stepfun.com/?invite_code=HMVLLXUM",
    limited: "2026-07-31",
    updated: "2026-07-14"
  },
  /* ========== 前面：较新模型（截图里 GLM-5.x / Kimi K2.x / Hy3 / DeepSeek V4 等同期或更晚） ========== */
  {
    name: "AtomCode CodingPlan",
    type: "工具",
    modality: "GLM-5.2 / DeepSeek-V4-Flash / Qwen3-VL · 编程模型",
    rating: 4,
    quota: "免费体验版每日 10:00 开抢（每日 150 个名额，Pro 体验版 150 人/日），5 小时滚动窗口无限续杯，无需绑卡",
    effect: "开源终端 AI 编程助手（Claude Code 最佳平替），CodingPlan 免费版可调用 GLM-5.2、DeepSeek-V4-Flash、Qwen3-VL 等顶流模型，支持 Windows / macOS / Linux / 鸿蒙 PC；仅在 AtomCode 客户端内使用，不能当通用 API",
    how: "打开 atomcode.atomgit.com 下载 AtomCode（AtomGit 账号通用）→ 进入「CodingPlan」选「GLM-5.2 免费体验版」→ 每天 10:00 准点抢名额（名额 7 天/30 天有效，可续）",
    link: "https://atomcode.atomgit.com",
    updated: "2026-07-24"
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
    name: "HuggingFace Inference API",
    type: "大模型",
    modality: "DeepSeek V4 / Qwen3 / Mistral 等 · 开源模型",
    rating: 4,
    quota: "免费共享推理端点，无需信用卡（限流，适合原型验证；PRO $9/月或自部署解锁更高额度）",
    effect: "全球最大开源模型社区提供的免费推理 API，覆盖 DeepSeek-V4、Qwen3-235B、Mistral Large 3、Llama 等上千开源模型，无需绑卡即可用 OpenAI 兼容接口调用，适合个人开发与模型对比测试",
    how: "打开 huggingface.co 注册 → 在模型页点「Deploy → Inference API」或用共享端点 router.huggingface.co/hf-inference → 用 HF Token 调用（curl/OpenAI SDK 均可）",
    link: "https://huggingface.co",
    updated: "2026-07-24"
  },
  {
    name: "中国移动 MoMA",
    type: "大模型",
    modality: "九天 / DeepSeek / 豆包 / 通义 / GLM / MiniMax 等 300+ 模型",
    rating: 5,
    quota: "新用户领取 2500 万 Tokens 免费额度（30 天有效，限流 3000 tokens/min，据官方文档）",
    effect: "中国移动 2026 年推出的国内首个开放普惠大模型聚合平台，汇聚 300+ 主流模型，统一 API 网关 + 智能路由（成本/效果/均衡三策略），单位 Token 成本约降 30%，支持体验、API 调用、一键部署与微调",
    how: "打开移动云 MoMA 产品页 → 登录/注册移动云账号 → 进入【模型观测】点「立即领取」拿 2500 万免费额度 → 模型广场获取 API Key 调用（兼容 OpenAI 格式）",
    link: "https://ecloud.10086.cn/portal/product/MaaS",
    updated: "2026-07-23"
  },
  {
    name: "月之暗面 Kimi 开放平台",
    type: "大模型",
    modality: "Kimi K2.6 / K2.5 · 长上下文 MoE 模型",
    rating: 4,
    quota: "新用户注册赠送 15 元体验金（永久有效，按量抵扣，无需绑卡）",
    effect: "月之暗面官方平台，Kimi K2.6 最新最智能、长程代码编写更强更稳；K2.5 支持百万上下文、视觉+文本、思考/非思考模式，3 RPM 限速但超长文本处理一流",
    how: "打开 platform.moonshot.cn 注册（手机号）→ API Key 管理新建密钥（sk- 开头，生成后须立即复制保存）→ 调 kimi-k2.6 / kimi-k2.5（base_url: https://api.moonshot.cn/v1）",
    link: "https://platform.moonshot.cn",
    updated: "2026-07-23"
  },
  {
    name: "联通云 Coding Plan",
    type: "大模型",
    modality: "glm5（智谱）/ Qwen3.5（阿里）/ MiniMax 等 · 编程模型",
    rating: 4,
    quota: "0 元订阅：Lite 每月 1.8 万次调用、Pro 每月 9 万次调用（每日 1200 次额度），按调用次数计费，无需绑卡",
    effect: "中国联通官方免费 Coding 套餐，覆盖编程全场景主流模型，适合 OpenClaw / Claude Code / Cursor 等 Agent 开发，目前国内仍有约 12000 个免费名额，先到先得",
    how: "打开联通云 Coding Plan 活动页注册 → 实名认证 → 0 元开通 Lite/Pro 套餐 → 获取 API Key 配置到编程工具（base_url 见控制台）",
    link: "https://www.cucloud.cn/activity/kickoffseason.html",
    updated: "2026-07-23"
  },
  {
    name: "魔搭社区 ModelScope",
    type: "大模型",
    modality: "Qwen 系列 / LUX / Stable Diffusion 等 · 文本+多模态",
    rating: 4,
    quota: "每天 2000 次免费 API 调用（长期有效，注册即享，无需实名即可注册）",
    effect: "阿里达摩院开源社区，收录 17 万+ 开源模型，生态完整、国内访问稳定；API-Inference 支持文本/图像等多模态，适合原型验证与模型体验",
    how: "打开 modelscope.cn 注册 → 【访问控制】获取 Access Token（需绑阿里云并实名才能用 API-Inference）→ 配置到工具（注意 Anthropic 兼容时去掉 ms- 前缀）",
    link: "https://modelscope.cn",
    updated: "2026-07-23"
  },
  {
    name: "OpenStarry",
    type: "工具",
    modality: "GLM 5.2 / DeepSeek V4 / Kimi K2.6 / MiniMax M3 等 40+ 模型",
    rating: 3,
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
    rating: 4,
    quota: "多个精选模型限时免费（DeepSeek V4 Flash Free、MiMo-V2.5 Free、North Mini Code Free、Nemotron 3 Ultra Free、Big Pickle），无需付费；余额低于 $5 才自动充值",
    effect: "OpenCode（16 万+ Star 开源编程 Agent）自带的 Zen 模型网关，专为 coding agent 基准测试挑选并验证的模型，OpenAI 兼容接口，可配到任意编程客户端",
    how: "打开 opencode.ai 安装 OpenCode → 在配置里启用 Zen（base_url: https://opencode.ai/zen/v1/chat/completions）→ 选用带 Free 后缀的免费模型即可，无需绑卡",
    link: "https://opencode.ai/zen",
    updated: "2026-07-23"
  },
  {
    name: "Google Gemini（AI Studio）",
    type: "大模型",
    modality: "Gemini 2.5 Flash / Pro · 多模态",
    rating: 4,
    quota: "免费层：Gemini 2.5 Flash 每天 250 次请求、100 万 Token 上下文（长期有效，Google AI Studio 申请 Key）",
    effect: "谷歌官方免费 API，多模态、超长上下文，性能第一梯队；适合个人开发、小型项目与原型测试，海外前沿模型直连首选",
    how: "打开 Google AI Studio（aistudio.google.com）登录 Google 账号 → 创建 API Key → 调 gemini-2.5-flash（base_url: https://generativelanguage.googleapis.com/v1beta）",
    link: "https://aistudio.google.com",
    updated: "2026-07-23"
  },
  {
    name: "Groq",
    type: "大模型",
    modality: "Llama / Qwen / GPT-OSS / Gemma 等 · 开源模型",
    rating: 4,
    quota: "免费层：Llama、Qwen、GPT-OSS、Gemma 等开源模型免费调用（按模型看速率限制，无需信用卡）",
    effect: "以极致推理速度著称的 AI 基础设施厂商，免费开放多款开源前沿模型，低延迟，适合高并发轻量任务与海外模型对比测试",
    how: "打开 groq.com 注册 → 控制台创建 API Key → 调开放模型（base_url: https://api.groq.com/openai/v1，OpenAI 兼容）",
    link: "https://groq.com",
    updated: "2026-07-23"
  },
  {
    name: "Cloudflare Workers AI",
    type: "大模型",
    modality: "Llama / Qwen / Mistral 等 · 开源模型",
    rating: 3,
    quota: "免费层：每天 10,000 Neurons 额度（UTC0 点刷新，长期有效，全球边缘节点）",
    effect: "Cloudflare 全球边缘网络内置的推理服务，数十款开源模型免费调用，配置简单、全球访问快，适合轻量编程任务与接口测试",
    how: "打开 workers.cloudflare.com 注册 → 在 Workers 项目里调用 AI 绑定（或从 dashboard 获取 API Token）→ 调 @cf/ 系列模型",
    link: "https://workers.cloudflare.com",
    updated: "2026-07-23"
  },
  {
    name: "GitHub Models",
    type: "大模型",
    modality: "GPT-4o / Llama / Phi / Mistral 等",
    rating: 4,
    quota: "免费访问 GPT-4o、Llama、Phi、Mistral 等模型（低 RPM，专为 GitHub Actions 与快速原型设计，无需信用卡）",
    effect: "GitHub 官方模型服务，用 GitHub 账号直接调用多家前沿模型，适合 CI/CD 流水线内嵌 AI 与快速实验，无需额外注册 AI 平台",
    how: "打开 github.com/marketplace/models 用 GitHub 账号登录 → 在 Codespaces / Actions 或本地用 GitHub Token 调模型（OpenAI 兼容接口）",
    link: "https://github.com/marketplace/models",
    updated: "2026-07-23"
  },
  {
    name: "京东 JoyAgent",
    type: "工具",
    modality: "GLM5.2 · 多模型聚合",
    rating: 0,
    quota: "每日发放 10000 积分，无需实名认证",
    effect: "【实测非常难用，热度记作零】京东云旗下一站式大模型聚合平台，API 兼容 OpenAI/Anthropic 协议；但创建并调用 API Key 必须先下载 JoyAgent App，整体体验差、流程繁琐，不推荐优先使用",
    how: "用京东账号登录 joyagent.jd.com 开通免费体验 → 下载 JoyAgent App（创建/调用 API Key 必须在 App 内完成）→ 个人中心查看每日发放 10000 积分 → 获取 API Key 即可调用 GLM5.2 等模型",
    link: "https://joyagent.jd.com",
    special: "需 App",
    updated: "2026-07-19"
  },
  {
    name: "智谱 BigModel（GLM-4.7-Flash / GLM-4-Flash / GLM-4-Plus / 邀请有礼）",
    type: "大模型",
    modality: "GLM 系列 · 文本模型",
    rating: 5,
    quota: "GLM-4.7-Flash 完全免费永久有效（需实名）；GLM-4-Flash 完全免费无上限（无需实名）；GLM-4-Plus 100 万 tokens/月；邀请有礼：每邀请1人双方各得 2000 万 Tokens（每月上限 10 人）",
    effect: "智谱全系列模型统一入口：GLM-4.7-Flash 为混合思考最新替代模型（200K 上下文，128K 输出）；GLM-4-Flash 零门槛永久免费；GLM-4-Plus 旗舰级复杂任务；邀请有礼可叠加额度",
    how: "打开 bigmodel.cn → 注册账号 → GLM-4-Flash 直接使用（无需实名）；GLM-4.7-Flash / GLM-4-Plus 需实名认证后开通；邀请有礼在平台获取专属链接分享",
    link: "https://bigmodel.cn",
    updated: "2026-07-17"
  },
  {
    name: "CometAPI",
    type: "工具",
    modality: "Kimi K2 · 文本模型（1T 参数 MoE）",
    rating: 4,
    quota: "注册即送免费额度（每月 10 万输入 token + 100 万输出 token），Kimi K2 可直接调用",
    effect: "聚合 500+ AI 模型的新兴平台，Kimi K2（1T 参数 MoE）代码/MATH/Agent 能力均超 GPT-4.1，免费层适合原型验证和小项目",
    how: "打开 cometapi.com 注册（仅需邮箱）→ 验证后获取 API Key → 调 Kimi K2（model: kimi-k2-0711-preview）",
    link: "https://www.cometapi.com",
    updated: "2026-07-17"
  },
  {
    name: "WorkBuddy",
    type: "工具",
    modality: "HY3 · 混元3 · 文本模型",
    rating: 5,
    quota: "HY3（混元3）模型限时免费，到 2026-07-22",
    effect: "腾讯系 AI 工作台，HY3（混元3）能力可直接调用，速度很快；写代码、查资料、做自动化都好用",
    how: "打开 WorkBuddy 客户端或网页版，HY3 现已开放免费调用（限免至 7/22，手慢无）",
    link: "https://www.codebuddy.cn/events/invite?inviteCode=akek8mgwjqlt",
    limited: "2026-07-22",
    updated: "2026-07-15"
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
    modality: "GLM5.2 · 文本模型",
    rating: 5,
    quota: "300 万 token，新用户再送 1000 万 token（均可直接用于 GLM5.2）",
    effect: "直接用 GLM5.2，免工具调用，注册登录即可拿 API",
    how: "访问 https://s.qiniu.com/VV7Zfa 注册登录，到 https://portal.qiniu.com/ai-inference/api-key 创建 API Key（注意：不要在微信内打开）",
    link: "https://s.qiniu.com/VV7Zfa",
    updated: "2026-07-14"
  },
  {
    name: "阿里 qoderwork（App）",
    type: "工具",
    modality: "GLM5.2 · 文本模型",
    rating: 4,
    quota: "登录即送 2100 积分，邀请再送 200，每日签到 100 积分",
    effect: "阿里旗下 AI 编程 App，内置调用 GLM5.2，积分制日常够用",
    how: "打开 App 注册登录即可领取，签到/邀请持续攒分",
    link: "https://qoder.com.cn/referral?referral_code=YoIiLVYpMLQsCajUHM30noFvBlFuzqqz",
    updated: "2026-07-14"
  },
  {
    name: "美团 catpaw（App）",
    type: "工具",
    modality: "GLM 5.2 · DeepSeek V4 Pro · Kimi K3 等 · 多模型聚合",
    rating: 5,
    quota: "新用户登录即送 1200 积分（此前为 500 次兑换额度），日常调用够用",
    effect: "美团旗下 AI App，已接入 GLM 5.2、DeepSeek V4 Pro、Kimi K3 等热门模型；界面类 WorkBuddy / Codex，对话 + 编程场景全覆盖，Kimi K3 这类平时排队挤爆的模型这里能直接调",
    how: "打开 catpaw.meituan.com 注册登录即领 1200 积分 → 在模型列表选 GLM 5.2 / DeepSeek V4 Pro / Kimi K3 等直接使用（注意：装 App 后若曾装过 catpaw ai，可能出现图标重复，属已知现象）",
    link: "https://catpaw.meituan.com/",
    updated: "2026-07-22"
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
    name: "MiniMax",
    type: "大模型",
    modality: "abab 系列 · 文本模型",
    rating: 3,
    quota: "新用户注册即送调用额度 + 邀请双方各得代金券",
    effect: "MiniMax 自研 abab6.5 系列支持超长上下文，适合长文档分析与多轮对话",
    how: "打开 minimax.io 或国内入口注册 → 完成新手任务 → 自动到账额度",
    link: "https://www.minimax.io",
    updated: "2026-07-16"
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
    modality: "DeepSeek V4 Flash · 文本模型",
    rating: 3,
    quota: "限免期 5 小时 500 次调用（日常很难用完）",
    effect: "可用 DeepSeek V4 Flash，能力强、响应快，适合接 Workbuddy 等客户端的自定义模型",
    how: "手机号注册 sensenova.cn/token-plan → 创建 API Key → 文档查 Base URL（https://token.sensenova.cn/v1/chat/completions）与 Model ID（deepseek-v4-flash）→ 填进客户端",
    link: "https://www.sensenova.cn/token-plan",
    updated: "2026-07-14"
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
    updated: "2026-07-15"
  },
  {
    name: "阿里云百炼 × OceanBase",
    type: "大模型",
    modality: "百炼、通义、千问等 · 多模态大模型",
    rating: 5,
    quota: "1 亿 Token 免费额度（实测新、老用户均可领）",
    effect: "阿里云百炼与 OceanBase 联合福利，额度可抵扣百炼全量模型（通义千问 / DeepSeek / 万相 等）的调用与算力",
    how: "进入福利页 opc.aliyun.com/oceanbase → 登录阿里云账号 → 申请 OPC 专属 token 补贴即可领取（据投稿实测，新老用户都能拿到）",
    link: "https://opc.aliyun.com/oceanbase",
    updated: "2026-07-15"
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
  {
    name: "SCNet.AI",
    type: "大模型",
    modality: "科研智能体 · 多模态",
    rating: 4,
    quota: "新用户注册送 1000 万 Token + 100 卡时 AI 推理算力 + 100 卡时高性能计算算力",
    effect: "面向科研场景的 AI 平台，支持大模型推理、CFD、分子动力学等仿真实验，1000 万 Token 可支撑数十轮主流大模型推理或小型模型微调",
    how: "打开 scnet.ai 注册账号 → 领取免费资源包 → 资源 90 天内有效，限量领取",
    link: "https://www.scnet.ai",
    limited: "2026-07-23",
    updated: "2026-07-18"
  },
  {
    name: "无问AI SecurityPlan",
    type: "大模型",
    modality: "SecurityPlan · 网安垂直模型",
    rating: 3,
    quota: "新用户注册送 3000 万 Token（无用量限制，用完即止）",
    effect: "专为网络安全从业者打造的垂直模型，支持代码审计、漏洞挖掘、红蓝对抗、日志审计等场景，兼容 OpenAI/Anthropic 接口",
    how: "打开 wwlib.cn 注册账号 → 进入开发者控制台获取 API Key → 直接调用（注意：仅限授权测试，严禁用于非授权测试）",
    link: "https://www.wwlib.cn/index.php/develement",
    limited: "2026-07-31",
    updated: "2026-07-18"
  },
  {
    name: "ZenMux",
    type: "工具",
    modality: "DeepSeek V4 Pro/Flash · Kimi K2.7 · GLM 5.2 · Step 3.7 Flash 等",
    rating: 5,
    quota: "DeepSeek V4 Pro/Flash 永久免费无限调用（无上限、无需实名、无需充值）",
    effect: "全球首个支持保险赔付机制的企业级大模型聚合平台，一个 API Key 接入 100+ 模型。目前独家开放 DeepSeek V4 Pro/Flash、Kimi K2.7 Code、GLM 5.2、Step 3.7 Flash 等永久免费通道，国内低延迟，完美适配 Claude Code、OpenClaw、Cursor 等工具",
    how: "打开 zenmux.ai 注册（支持邮箱/GitHub/谷歌一键登录）→ 进入 PAYG API 创建密钥 → 勾选 free 模型权限（如 deepseek/deepseek-v4-pro-free）→ 复制 API Key 配置到客户端",
    link: "https://zenmux.ai",
    updated: "2026-07-19"
  },
  {
    name: "腾讯云 TokenHub",
    type: "大模型",
    modality: "Hy3 · DeepSeek V4 · GLM-5 · MiniMax-M2.7 · Kimi-K2.5 等",
    rating: 5,
    quota: "新人一次性最高 100 万 Tokens（90 天有效），活动持续至 2026-12-31",
    effect: "腾讯云大模型服务平台，覆盖 Hy3、DeepSeek-V4、GLM-5、MiniMax-M2.7、Kimi-K2.5 等主流模型，首次调用自动领取免费额度，支持 OpenAI 兼容 API，一个 Key 切多模型",
    how: "登录 TokenHub 控制台 → 实名认证 → 进入模型广场 → 点击右上角「新用户福利免费体验」→ 勾选模型后立即领取；也支持首次调用时自动领取",
    link: "https://cloud.tencent.com/product/tokenhub",
    limited: "2026-12-31",
    updated: "2026-07-19"
  },
  {
    name: "天翼云息壤（电信）",
    type: "大模型",
    modality: "GLM-5 · DeepSeek V4 · Qwen3.5 · Doubao 等约 18 个主流模型",
    rating: 4,
    quota: "文本类模型 2500 万 Tokens/模型（有效期 2 周，从首次使用算起）；DeepSeek V4 Pro/Flash 各 50 万 Tokens",
    effect: "中国电信旗下全栈国产化智算平台，\"国模+国芯+国云\"融合底座，支持 GLM-5、DeepSeek-V4、Qwen3.5、Doubao-Seed-2.0-pro 等约 18 个主流大模型，适合政企/科研/个人开发者",
    how: "登录天翼云官网 → 完成实名认证 → 进入「息壤智算」→「模型广场」→ 选模型领取免费额度；额度耗尽或到期后可直接切换其他模型继续使用",
    link: "https://www.ctyun.cn/product/maas",
    limited: "2026-08-02",
    updated: "2026-07-19"
  },
  {
    name: "快手 StreamLake（KAT-Coder）",
    type: "工具",
    modality: "KAT-Coder-Air V1 · 代码模型",
    rating: 4,
    quota: "KAT-Coder-Air V1 永久免费；KAT-Coder-Pro V1 新用户曾送 2000 万 Tokens（活动已结束）",
    effect: "快手旗下 AI 编程平台，KAT-Coder-Air V1 轻量版永久免费，支持代码生成、续写、诊断；Pro 版能力更强，适合复杂企业项目",
    how: "打开 streamlake.ai 注册登录 → 进入万擎平台控制台 → KAT-Coder-Air V1 直接免费使用 → 创建 API Key 接入 Claude Code、Cline 等工具",
    link: "https://streamlake.ai",
    updated: "2026-07-18"
  },
  /* ========== 后面：较老模型（发布在截图那些模型之前的） ========== */
  {
    name: "零一万物 01.AI（Yi 大模型）",
    type: "大模型",
    modality: "Yi-Lightning / Yi-Vision · 文本+视觉",
    rating: 4,
    quota: "新用户注册送 ¥10 免费额度（约数百万 tokens），速率 5 RPM，无需绑卡（需手机号）",
    effect: "李开复创立的国产大模型公司，Yi-Lightning 性价比极高、国内直连无需代理，OpenAI 兼容接口；支持智能路由（自动选 DeepSeek-V3/Qwen3/Yi）与 Yi-Vision 视觉理解，适合中英文双语原型",
    how: "打开 platform.lingyiwanwu.com 注册 → 新用户自动获得 ¥10 体验额度 → 创建 API Key（base_url: https://api.lingyiwanwu.com/v1）调 yi-lightning",
    link: "https://platform.lingyiwanwu.com",
    updated: "2026-07-24"
  },
  {
    name: "360智脑（360GPT）",
    type: "大模型",
    modality: "360gpt-pro / 360gpt-turbo · 文本模型",
    rating: 3,
    quota: "新用户免费试用额度（具体以官网为准），兼容 OpenAI 接口，无需绑卡（需手机号）",
    effect: "360 自研通用大模型，文本生成 / 向量 / 图像多模态，完全兼容 OpenAI API（仅改 base_url 与 model 名即可迁移）；国内直连稳定，曾在 OpenAI 停服时推出限时大额赠送，适合国产替代与 Embedding 检索场景",
    how: "打开 ai.360.com 注册 360 账号 → 进入开放平台创建 API Key（base_url: https://api.360.cn/v1）→ 调 360gpt2-pro / 360gpt-turbo",
    link: "https://ai.360.com",
    updated: "2026-07-24"
  },
  {
    name: "DeepSeek V3",
    type: "大模型",
    modality: "DeepSeek 系列 · 文本模型",
    rating: 5,
    quota: "1000 万 tokens（永久有效，不清零）",
    effect: "国产顶级开源大模型，推理能力强、响应快，代码/数学/中文都靠谱，适合长期高频使用",
    how: "打开 platform.deepseek.com 注册账号 → 实名认证 → 创建 API Key → 直接调用（兼容 OpenAI 格式）",
    link: "https://platform.deepseek.com",
    updated: "2026-07-16"
  },
  {
    name: "DeepSeek R1",
    type: "大模型",
    modality: "DeepSeek 系列 · 推理模型",
    rating: 5,
    quota: "500 万 tokens（永久有效，不清零）",
    effect: "DeepSeek 推理增强版，数理逻辑/代码/复杂推理比 V3 更强，适合硬核任务",
    how: "同 DeepSeek V3：platform.deepseek.com 注册 → 实名认证 → 创建 API Key",
    link: "https://platform.deepseek.com",
    updated: "2026-07-16"
  },
  {
    name: "阿里云百炼 Qwen-Turbo",
    type: "大模型",
    modality: "通义千问 Qwen 系列 · 文本模型",
    rating: 5,
    quota: "1000 万 tokens/月（每月自动刷新，长期可用）",
    effect: "阿里云百炼默认开通额度，Qwen-Turbo 速度快、成本低，日常问答/翻译/总结足够用",
    how: "打开阿里云百炼（dashscope.aliyun.com）→ 开通服务 → 实名认证 → 创建 API Key → 每月自动刷新额度",
    link: "https://dashscope.aliyun.com",
    updated: "2026-07-16"
  },
  {
    name: "阿里云百炼 Qwen-Plus",
    type: "大模型",
    modality: "通义千问 Qwen 系列 · 文本模型",
    rating: 4,
    quota: "1000 万 tokens（有效期 3 个月）",
    effect: "Qwen-Plus 比 Turbo 更强，复杂任务/长文本处理更稳，适合对质量要求高的场景",
    how: "同 Qwen-Turbo：dashscope.aliyun.com 开通 → 实名认证 → 创建 API Key",
    link: "https://dashscope.aliyun.com",
    updated: "2026-07-16"
  },
  {
    name: "百度 ERNIE-Speed / ERNIE-Lite",
    type: "大模型",
    modality: "ERNIE 系列 · 文本模型",
    rating: 4,
    quota: "各 1000 万 tokens/月（每月自动刷新，额度独立）",
    effect: "百度智能云两款轻量级大模型：ERNIE-Speed 响应快、中文理解好；ERNIE-Lite 与 Speed 互补，额度独立计算。均适合高频小任务",
    how: "打开 qianfan.baidu.com 注册 → 实名认证 → 分别开通 ERNIE-Speed / ERNIE-Lite → 各创建 API Key",
    link: "https://qianfan.baidu.com",
    updated: "2026-07-16"
  },
  {
    name: "火山方舟（字节）",
    type: "大模型",
    modality: "多模型（豆包/DeepSeek 等）· 文本模型",
    rating: 4,
    quota: "每个模型 50 万 tokens（长期有效）",
    effect: "字节跳动大模型平台，覆盖豆包、DeepSeek 等多家模型，R1 模型关联应用后支持联网查询",
    how: "打开 volcengine.com 注册火山引擎 → 开通方舟服务 → 按模型领取免费试用额度",
    link: "https://www.volcengine.com",
    updated: "2026-07-16"
  },
  {
    name: "讯飞星火 Spark Lite",
    type: "大模型",
    modality: "Spark 系列 · 文本模型",
    rating: 3,
    quota: "100 万 tokens/月（每月自动刷新）",
    effect: "科大讯飞轻量大模型，中文交互流畅，适合日常对话与简单创作",
    how: "打开 xfyun.cn 注册讯飞开放平台 → 实名认证 → 开通 Spark Lite → 创建 API Key",
    link: "https://xfyun.cn",
    updated: "2026-07-16"
  },
  {
    name: "腾讯云混元",
    type: "大模型",
    modality: "混元系列 · 文本模型",
    rating: 3,
    quota: "100 万 tokens（有效期 1 年）",
    effect: "腾讯云自研大模型，中文理解扎实，适合企业级应用与日常对话",
    how: "打开 cloud.tencent.com 注册 → 实名认证 → 开通混元服务 → 创建 API Key",
    link: "https://cloud.tencent.com/product/hunyuan",
    updated: "2026-07-16"
  },
  {
    name: "腾讯云知识引擎",
    type: "大模型",
    modality: "知识引擎 · 文本模型",
    rating: 3,
    quota: "50 万 tokens（有效期 2 个月）",
    effect: "腾讯云知识增强型大模型，适合文档问答、知识检索等场景",
    how: "打开 cloud.tencent.com 注册 → 实名认证 → 开通知识引擎 → 创建 API Key",
    link: "https://cloud.tencent.com/product/ke",
    updated: "2026-07-16"
  },
  {
    name: "Wisemodel / 赖耶 AI",
    type: "大模型",
    modality: "赖耶系列 · 文本模型",
    rating: 3,
    quota: "新用户完成授权即得 20 元 token 资源包",
    effect: "Wisemodel 平台聚合多家模型，赖耶 AI 为合作方，支持 API 调用与在线体验",
    how: "打开 wisemodel.cn 注册 → 完成赖耶 AI 授权 → 自动到账 20 元资源包",
    link: "https://wisemodel.cn",
    updated: "2026-07-16"
  },
  {
    name: "Wisemodel 邀请奖励",
    type: "大模型",
    modality: "赖耶系列 · 文本模型",
    rating: 3,
    quota: "每邀请 1 位新用户完成授权，你得 14 元 token 资源包（上限 280 元）",
    effect: "邀请好友一起薅，双方都得 token，平台早期推广力度大",
    how: "Wisemodel.cn 注册后获取邀请链接 → 好友通过你的链接注册并完成赖耶 AI 授权 → 你获 14 元/人",
    link: "https://wisemodel.cn",
    updated: "2026-07-16"
  },
  {
    name: "欧派算力云",
    type: "大模型",
    modality: "DeepSeek R1/V3 · 文本模型",
    rating: 3,
    quota: "新用户注册送 R1 与 V3 各 100 万 tokens（有效期 6 个月）",
    effect: "专注 DeepSeek 模型的第三方算力平台，R1/V3 推理速度稳定",
    how: "打开欧派算力云官网注册 → 实名认证 → 自动到账 R1+V3 各 100 万 tokens",
    link: "https://opc.aliyun.com",
    updated: "2026-07-16"
  },
  {
    name: "OpenRouter",
    type: "工具",
    modality: "35+ 聚合模型（Kimi K2 / Qwen3-Next-80B / Llama 等）",
    rating: 4,
    quota: "注册即享永久免费模型（BYOK 用户每月 100 万次请求）；免费模型每日 50 次（充值 $10 后升至 1000 次/日）",
    effect: "一站式聚合 500+ 模型（GPT/Claude/Gemini/Kimi/DeepSeek 等），OpenAI 兼容接口，一个 Key 切所有模型，免费层够日常原型测试",
    how: "打开 openrouter.ai 注册（无需信用卡）→ 进入 Keys 页创建 API Key → 选 :free 后缀模型直接调用（如 kimi/kimi-k2:free）",
    link: "https://openrouter.ai",
    updated: "2026-07-17"
  }
];

/* ---- 渲染逻辑（一般不用改） ---- */
const MAX = 5;
const cardBox = document.getElementById("cards");
const filters = document.getElementById("filters");

function fmtMd(d) {
  const p = d.split("-");
  return parseInt(p[1], 10) + "/" + parseInt(p[2], 10);
}

function fire(rating) {
  let s = "";
  for (let i = 1; i <= MAX; i++) {
    s += i <= rating ? "🔥" : '<span class="dim">🔥</span>';
  }
  return s;
}

/* 归类规则（首页只分三类，避免与卡片上的模型类型标签重复）：
 *   - 工具：App 类（type === "工具"）优先
 *   - GLM5.2：非工具且模型类型含 "GLM5.2"
 *   - 大模型：其余模型平台
 */
function catOf(t) {
  if (t.type === "工具") return "工具";
  return (t.modality || "").includes("GLM5.2") ? "GLM5.2" : "大模型";
}

function render(type) {
  const list = type === "all" ? TOKENS : TOKENS.filter(t => catOf(t) === type);
  const emptyEl = document.getElementById("empty-state");
  if (!list.length) {
    cardBox.innerHTML = "";
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }
  if (emptyEl) emptyEl.style.display = "none";
  cardBox.innerHTML = list.map(t => `
    <article class="card${t.limited ? ' is-limited' : ''}">
      ${t.limited ? `<span class="card-badge" title="限时活动，截止 ${t.limited}">限时 ${fmtMd(t.limited)}</span>` : ''}
      <div class="card-top">
        <h3 class="card-name">${t.name}</h3>
        <div class="card-tags">
          ${t.modality ? `<span class="card-modality">${t.modality}</span>` : ''}
          ${t.special ? `<span class="card-special" title="${t.special}">${t.special}</span>` : ''}
        </div>
      </div>
      <div class="card-rating" title="香度 ${t.rating}/5">${fire(t.rating)} <span class="card-type">${catOf(t)}</span></div>
      <div class="card-row"><span class="k">免费额度</span><span class="v">${t.quota}</span></div>
      <div class="card-row"><span class="k">效果怎么样</span><span class="v">${t.effect}</span></div>
      <div class="card-row how-row"><span class="k">怎么拿</span><span class="v">${t.how}</span></div>
      <a class="card-link" href="${t.link}" target="_blank" rel="noopener">去领取 →</a>
      <div class="card-date">更新于 ${t.updated}</div>
    </article>
  `).join("");
}

filters.addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  filters.querySelectorAll(".chip").forEach(c => c.classList.remove("is-active"));
  btn.classList.add("is-active");
  render(btn.dataset.type);
});

/* Hero 数据大字报 */
(function initStats() {
  const total = TOKENS.length;
  const limited = TOKENS.filter(t => t.limited).length;
  const latest = TOKENS.slice().sort((a, b) => b.updated.localeCompare(a.updated))[0]?.updated || "—";
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("stat-total", total);
  set("stat-limited", limited);
  set("stat-updated", latest);
})();

/* 回到顶部按钮 */
const backBtn = document.getElementById("backToTop");
if (backBtn) {
  const toggle = () => backBtn.classList.toggle("is-visible", window.scrollY > 400);
  window.addEventListener("scroll", toggle, { passive: true });
  backBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  toggle();
}

render("all");
