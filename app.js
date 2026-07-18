/* =========================================================
 * Token 情报局 · Token FBI
 * 卡片数据都在下面的 TOKENS 数组里。
 * 想加一条情报？复制一个 {...} 对象粘进去就行，字段说明见每个属性。
 *   - modality：模型类型（文本模型 / 多模态大模型 / 全模态模型 等），显示在名字右边
 * ========================================================= */

const TOKENS = [
  /* ========== 前面：较新模型（截图里 GLM-5.x / Kimi K2.x / Hy3 / DeepSeek V4 等同期或更晚） ========== */
  {
    name: "阶跃星辰 StepFun",
    type: "大模型",
    modality: "多模态大模型",
    rating: 5,
    quota: "400M Credits + 15天免费体验（用完再送15天，邀请好友最高累计90天）",
    effect: "可用全部旗舰自研模型：step-3.7-flash（最新旗舰，推理最强）、step-3.5-flash、step-image-edit-2（图像编辑）、stepaudio 系列（语音/ASR/TTS），覆盖文/图/音/视频/推理",
    how: "注册后到 Plan 列表点「免费领取」，再到 Step Plan 菜单拿 Base URL 与密钥接入（兼容 OpenAI/Claude API）。活动 7 月 31 日截止，仅限新用户",
    link: "https://platform.stepfun.com/?invite_code=HWNNAXYV",
    limited: "2026-07-31",
    updated: "2026-07-14"
  },
  {
    name: "京东 JoyAgent",
    type: "工具",
    modality: "DeepSeek-V4-pro / GLM-5.1 · 多模型聚合",
    rating: 4,
    quota: "注册即送 5 万积分（约 50 万次常规问答），无需实名认证",
    effect: "京东云旗下一站式大模型聚合平台，支持 DeepSeek-V4-pro、GLM-5.1 等新模型，API 兼容 OpenAI/Anthropic 协议，适合快速原型和 Agent 开发",
    how: "打开 joyagent.jd.com 用京东账号登录 → 打开 joycode.jd.com/pricing 点「团队版 免费体验」→ 返回 JoyAgent 个人中心查看到账积分 → 创建 API Key 直接调用",
    link: "https://joyagent.jd.com",
    updated: "2026-07-18"
  },
  {
    name: "智谱 GLM-4.7-Flash",
    type: "大模型",
    modality: "GLM-4.7-Flash · 混合思考模型（30B总参/3B激活）",
    rating: 5,
    quota: "完全免费，永久有效（需实名认证，无需绑卡）",
    effect: "替代已下线的 GLM-4.5-Flash，开源 SOTA 级混合思考模型，编程/中文写作/翻译/推理全能，200K 上下文，128K 输出，1 QPS 个人够用",
    how: "打开 bigmodel.cn 注册并完成实名认证 → 在体验中心选 GLM-4.7-Flash → 直接调用 API（文档：docs.bigmodel.cn/cn/guide/models/free/glm-4.7-flash）",
    link: "https://bigmodel.cn/trialcenter/modeltrial/text?modelCode=glm-4.7-flash",
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
    modality: "GLM5.2 · 文本模型",
    rating: 4,
    quota: "500 次兑换额度，用完可再申请",
    effect: "美团旗下 AI App，可用 GLM5.2 相关能力",
    how: "打开 catpaw.meituan.com 按页面兑换额度",
    link: "https://catpaw.meituan.com/",
    updated: "2026-07-14"
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
    name: "智谱 GLM-4-Flash",
    type: "大模型",
    modality: "GLM 系列 · 文本模型",
    rating: 5,
    quota: "完全免费，无额度上限，永久有效",
    effect: "零门槛永久免费，中文理解与生成能力在线，日常问答/写稿/总结全能胜任",
    how: "打开 bigmodel.cn 注册登录后直接使用（无需实名认证），API 与 Web 端共用额度",
    link: "https://bigmodel.cn",
    updated: "2026-07-16"
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
    name: "智谱推荐有礼",
    type: "大模型",
    modality: "GLM-4.5-Air · 文本模型",
    rating: 5,
    quota: "每成功邀请 1 人注册+实名认证，双方各得 2000 万 Tokens（每月上限 10 人，累计最高 2 亿/月）",
    effect: "用你的专属邀请链接拉新，被邀请人得 2500 万新用户礼包 + 2000 万 GLM-4.5-Air Tokens，你同样得 2000 万",
    how: "登录 bigmodel.cn → 获取专属邀请链接 → 分享给好友 → 好友完成注册及实名认证后额度自动到账",
    link: "https://bigmodel.cn",
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
    name: "百度 ERNIE-Speed",
    type: "大模型",
    modality: "ERNIE 系列 · 文本模型",
    rating: 4,
    quota: "1000 万 tokens/月（每月自动刷新）",
    effect: "百度智能云轻量级大模型，响应快、中文理解好，适合高频小任务",
    how: "打开 qianfan.baidu.com 注册 → 实名认证 → 开通 ERNIE-Speed → 创建 API Key",
    link: "https://qianfan.baidu.com",
    updated: "2026-07-16"
  },
  {
    name: "百度 ERNIE-Lite",
    type: "大模型",
    modality: "ERNIE 系列 · 文本模型",
    rating: 4,
    quota: "1000 万 tokens/月（每月自动刷新）",
    effect: "百度智能云另一款轻量模型，与 Speed 互补，额度独立计算",
    how: "同 ERNIE-Speed：qianfan.baidu.com 开通 → 实名认证 → 创建 API Key",
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
    name: "智谱 GLM-4-Plus",
    type: "大模型",
    modality: "GLM 系列 · 文本模型",
    rating: 4,
    quota: "100 万 tokens（有效期 1 个月）",
    effect: "智谱旗舰级模型，比 Flash 更强，适合复杂问答、长文档处理",
    how: "打开 bigmodel.cn 注册 → 实名认证 → 开通 GLM-4-Plus → 创建 API Key",
    link: "https://bigmodel.cn",
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
          <span class="card-type">${catOf(t)}</span>
        </div>
      </div>
      <div class="card-rating" title="香度 ${t.rating}/5">${fire(t.rating)}</div>
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
