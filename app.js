/* =========================================================
 * Token 情报局 · Token FBI
 * 卡片数据都在下面的 TOKENS 数组里。
 * 想加一条情报？复制一个 {...} 对象粘进去就行，字段说明见每个属性。
 *   - modality：模型类型（文本模型 / 多模态大模型 / 全模态模型 等），显示在名字右边
 * ========================================================= */

const TOKENS = [
  {
    name: "TRAE Work",
    type: "工具",
    modality: "GLM-5.2 / Kimi K3 · 折扣价",
    rating: 4,
    quota: "通过分享链接登录桌面端，新注册用户一次性获得 5000 积分",
    effect: "TRAE Work AI 办公平台，可一站式搞定各类办公与创作任务。模型调用走折扣价通道，明确使用 GLM-5.2 与 Kimi K3 两款新模型，相比官方原价更低",
    how: "打开分享链接 https://www.trae.cn/work-fission/Q4PUV29JRKCF → 下载并登录 TRAE Work 桌面端 → 新账号自动到账 5000 积分，直接选用 GLM-5.2 / K3 模型开始使用",
    link: "https://www.trae.cn/work-fission/Q4PUV29JRKCF",
    updated: "2026-08-01"
  },

  /* ========== 固定置顶 ========== */
  {
    name: "阶跃星辰 StepFun",
    type: "大模型",
    modality: "多模态大模型",
    rating: 5,
    quota: "Flash Plan（原价 ¥49/月、400M Credits）限时免费活动已结束，目前按官方标准计费；新用户注册可关注平台是否仍有基础免费额度，以实际页面为准",
    effect: "可用全部旗舰自研模型：step-3.7-flash（最新旗舰，198B MoE、激活 11B，原生图片/视频理解，深度兼容 Claude Code / OpenClaw / KiloCode / Hermes Agent）、step-3.5-flash、step-image-edit-2（图像编辑）、stepaudio 系列（语音/ASR/TTS），覆盖文/图/音/视频/推理，支持智能路由与 MCP 工具",
    how: "注册后在 Plan 列表选择所需套餐，再到 Step Plan 菜单拿 Base URL 与密钥接入（兼容 OpenAI/Claude API）",
    link: "https://platform.stepfun.com/?invite_code=HMVLLXUM",
    updated: "2026-08-05"
  },
  /* ========== 前面：较新模型（截图里 GLM-5.x / Kimi K2.x / Hy3 / DeepSeek V4 等同期或更晚） ========== */
  {
    name: "BazaarLink",
    type: "大模型",
    modality: "DeepSeek V4 Flash · 1M 上下文 · OpenAI 兼容网关",
    rating: 4,
    quota: "DeepSeek V4 Flash 长期免费：10 RPM / 每天 150 次（不绑卡、不充值、无试用期；充值账户额度 ×3 至 450 次/天）",
    effect: "中国台湾集聯科技有限公司（統一編號 62232477，登記於苗栗縣頭份市）运营的 OpenAI 完全兼容多模型聚合网关，数据驻留 AWS Tokyo（非大陆、非美本土）。免费档开放 DeepSeek-V4-Flash（284B MoE、激活 13B、1M tokens 超长上下文、最大输出 38.4 万 tokens）。支持把 model 设为「auto:free」自动路由到零成本模型；可直接对接 Claude Code、Cursor、LangChain、Dify、LiteLLM 等；额度按请求 token 数动态加权扣减，短问答实际可用次数远超 150 次",
    how: "打开 bazaarlink.ai/free 用邮箱注册（无需信用卡）→ 进入 /keys 创建密钥（sk-bl- 开头，仅显示一次，请立即保存）→ base_url 填 https://bazaarlink.ai/api/v1，模型名填 deepseek/deepseek-v4-flash 或 auto:free；Agent 也可 POST /api/v1/agents/register 自助申请 Key",
    link: "https://bazaarlink.ai/free",
    updated: "2026-07-31"
  },
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
    name: "微信 AI 小程序成长计划（云开发 CloudBase）",
    type: "大模型",
    modality: "Hy3 + Hy Image 3.0 · 文本/生图",
    rating: 5,
    quota: "10 亿大模型 Token + 10 万张 AI 生图（本轮加码后额度，自申请起 6 个月有效），另送 6 个月个人版云开发环境",
    effect: "腾讯云开发 CloudBase 联合微信小程序的开发者扶持计划，模型已全面升级为混元 Hy3 与 Hy Image 3.0；全行业无类目限制，小游戏开发者同享。10 亿 Token 足够把 AI 能力『用厚』在产品里，老用户自动升级或领 120 元代金券",
    how: "登录微信公众平台 mp.weixin.qq.com → 行业能力 → AI 小程序成长计划报名 → 开通 CloudBase 个人版环境后额度自动到账 → 控制台 AI 模块勾选 Hy3 即可调用（也可配 CloudBase MCP 在 CodeBuddy/Cursor 里用自然语言生成小程序）",
    link: "https://cloud.tencent.com/developer/article/2705075",
    limited: "2026-12-31",
    updated: "2026-07-29"
  },
{
    name: "WorkBuddy",
    type: "工具",
    modality: "HY3 · 混元3 · 文本模型",
    rating: 5,
    quota: "HY3（混元3）模型限时免费，官方已宣布延长至 2026-08-31",
    effect: "腾讯系 AI 工作台，HY3（混元3）能力可直接调用，速度很快；写代码、查资料、做自动化都好用。Hy3 限免期间连续两周全球调用量第一（周调用 11.5 万亿 Token），因用户呼声限免从 7/22 延长到 8/31",
    how: "打开 WorkBuddy 客户端或网页版，HY3 现已开放免费调用（限免延至 8/31，抓紧用）",
    link: "https://www.codebuddy.cn/events/invite?inviteCode=akek8mgwjqlt",
    limited: "2026-08-31",
    updated: "2026-08-05"
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
    modality: "SenseNova 6.7 Flash-Lite / U1 Fast / DeepSeek V4 Flash · 文本模型",
    rating: 4,
    quota: "限时免费公测：每个模型每 5 小时 1500 次调用（首月免费体验，按次数计非 Token）",
    effect: "限免额度已从 500 次/5h 加码到 1500 次/5h，且新增 SenseNova 6.7 Flash-Lite、SenseNova U1 Fast 等自研模型可选；DeepSeek V4 Flash 依旧在列，适合跑 Agent、图表分析、办公自动化和多模态任务",
    how: "手机号注册 sensenova.cn/token-plan → 创建 API Key → 文档查 Base URL（https://token.sensenova.cn/v1/chat/completions）与 Model ID（deepseek-v4-flash 等）→ 填进客户端",
    link: "https://www.sensenova.cn/token-plan",
    updated: "2026-07-30"
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
  {
    name: "ZenMux",
    type: "大模型",
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
    rating: 4,
    quota: "文本类模型 2500 万 Tokens/模型（有效期 2 周，从首次使用算起）；DeepSeek V4 Pro/Flash 各 50 万 Tokens",
    effect: "中国电信旗下全栈国产化智算平台，\"国模+国芯+国云\"融合底座，支持 GLM-5、DeepSeek-V4、Qwen3.5、Doubao-Seed-2.0-pro 等约 18 个主流大模型，适合政企/科研/个人开发者",
    how: "登录天翼云官网 → 完成实名认证 → 进入「息壤智算」→「模型广场」→ 选模型领取免费额度；额度耗尽或到期后可直接切换其他模型继续使用",
    link: "https://www.ctyun.cn/product/maas",
    updated: "2026-07-19"
  },
  /* ========== 后面：较老模型（发布在截图那些模型之前的） ========== */
  {
    name: "OpenRouter",
    type: "大模型",
    modality: "35+ 聚合模型（Kimi K2 / Qwen3-Next-80B / Llama 等）",
    rating: 4,
    quota: "注册即享永久免费模型（BYOK 用户每月 100 万次请求）；免费模型每日 50 次（充值 $10 后升至 1000 次/日）",
    effect: "一站式聚合 500+ 模型（GPT/Claude/Gemini/Kimi/DeepSeek 等），OpenAI 兼容接口，一个 Key 切所有模型，免费层够日常原型测试",
    how: "打开 openrouter.ai 注册（无需信用卡）→ 进入 Keys 页创建 API Key → 选 :free 后缀模型直接调用（如 kimi/kimi-k2:free）",
    link: "https://openrouter.ai",
    updated: "2026-07-17"
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

/* 归类规则（只分两类）：
 *   - 工具：App 类（type === "工具"）
 *   - 大模型：其余所有模型平台
 */
function catOf(t) {
  if (t.type === "工具") return "工具";
  return "大模型";
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
      <div class="card-row how-row"><span class="k">怎么拿</span><span class="v">${cleanText(t.how)}</span></div>
      <div class="card-footer">
        <a class="card-link" href="${t.link}" target="_blank" rel="noopener">立即领取 <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" /></svg></a>
        <div class="card-date">更新于 ${t.updated}</div>
      </div>
    </article>
  `).join("");
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
  const models = TOKENS.filter(t => catOf(t) === "大模型").length;
  const tools = TOKENS.filter(t => catOf(t) === "工具").length;
  const limited = TOKENS.filter(t => t.limited).length;
  const latest = TOKENS.slice().sort((a, b) => b.updated.localeCompare(a.updated))[0]?.updated || "—";
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("stat-models", models);
  set("stat-tools", tools);
  set("stat-limited", limited);
  set("stat-updated", latest);
  set("list-total", `已收录 ${TOKENS.length} 条有效线索`);
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
