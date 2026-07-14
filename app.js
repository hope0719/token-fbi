/* =========================================================
 * Token 情报局 · Token FBI
 * 卡片数据都在下面的 TOKENS 数组里。
 * 想加一条情报？复制一个 {...} 对象粘进去就行，字段说明见每个属性。
 * ========================================================= */

const TOKENS = [
  {
    name: "阶跃星辰 StepFun",
    type: "大模型",
    rating: 5,                                  // 香度 1~5（几颗火）
    quota: "400M Credits + 15天免费体验（用完再送15天，邀请好友最高累计90天）",
    effect: "可用全部旗舰自研模型：step-3.7-flash（最新旗舰，推理最强）、step-3.5-flash、step-image-edit-2（图像编辑）、stepaudio 系列（语音/ASR/TTS），覆盖文/图/音/视频/推理",
    how: "注册后到 Plan 列表点「免费领取」，再到 Step Plan 菜单拿 Base URL 与密钥接入（兼容 OpenAI/Claude API）。活动 7 月 31 日截止，仅限新用户",
    link: "https://platform.stepfun.com/?invite_code=HWNNAXYV",
    updated: "2026-07-14"
  },
  {
    name: "商汤 Token Plan（sensenova）",
    type: "大模型",
    rating: 3,
    quota: "限免期 5 小时 500 次调用（日常很难用完）",
    effect: "可用 DeepSeek V4 Flash，能力强、响应快，适合接 Workbuddy 等客户端的自定义模型",
    how: "手机号注册 sensenova.cn/token-plan → 创建 API Key → 文档查 Base URL（https://token.sensenova.cn/v1/chat/completions）与 Model ID（deepseek-v4-flash）→ 填进客户端",
    link: "https://www.sensenova.cn/token-plan",
    updated: "2026-07-14"
  },
  {
    name: "火山引擎 Ark 协作计划（字节）",
    type: "大模型",
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
    rating: 4,
    quota: "登录即送 2100 积分，邀请再送 200，每日签到 100 积分",
    effect: "阿里旗下 AI 编程 App，内置调用 GLM5.2，积分制日常够用",
    how: "打开 App 注册登录即可领取，签到/邀请持续攒分（走下方邀请链接有邀请奖励）",
    link: "https://qoder.com.cn/referral?referral_code=YoIiLVYpMLQsCajUHM30noFvBlFuzqqz",
    updated: "2026-07-14"
  },
  {
    name: "美团 longcat 大模型",
    type: "大模型",
    rating: 5,
    quota: "新用户免费 1000 万 token，很耐用；续购 9.9 元买 5000 万",
    effect: "美团旗下大模型，免费额度大方、性价比高，适合长期日常高频使用",
    how: "打开 longcat.chat 官网注册即送新用户免费额度，用完可在平台低价续购",
    link: "https://longcat.chat/platform/product",
    updated: "2026-07-14"
  },
  {
    name: "美团 catpaw（App）",
    type: "工具",
    rating: 4,
    quota: "500 次兑换额度，用完可再申请",
    effect: "美团旗下 AI App，可用 GLM5.2 相关能力",
    how: "打开 catpaw.meituan.com 按页面兑换额度",
    link: "https://catpaw.meituan.com/",
    updated: "2026-07-14"
  },
  {
    name: "WorkBuddy",
    type: "工具",
    rating: 5,
    quota: "HY3 模型限时免费，到 2026-07-22",
    effect: "腾讯系 AI 工作台，HY3 能力可直接调用，写代码、查资料、做自动化都好用",
    how: "打开 WorkBuddy 客户端或网页版，HY3 现已开放免费调用（限免至 7/22，手慢无）",
    link: "https://workbuddy.ai",
    updated: "2026-07-14"
  },
  {
    name: "Agnes AI",
    type: "大模型",
    rating: 4,
    quota: "（情报待补充）",
    effect: "（情报待补充，欢迎投稿或补充）",
    how: "（情报待补充）",
    link: "#",
    updated: "2026-07-14"
  }
];

/* ---- 渲染逻辑（一般不用改） ---- */
const MAX = 5;
const cardBox = document.getElementById("cards");
const filters = document.getElementById("filters");

function fire(rating) {
  let s = "";
  for (let i = 1; i <= MAX; i++) {
    s += i <= rating ? "🔥" : '<span class="dim">🔥</span>';
  }
  return s;
}

function render(type) {
  const list = type === "all" ? TOKENS : TOKENS.filter(t => t.type === type);
  if (!list.length) {
    cardBox.innerHTML = '<p style="color:#64748b">这类暂时还没有情报，欢迎投稿～</p>';
    return;
  }
  cardBox.innerHTML = list.map(t => `
    <article class="card">
      <div class="card-top">
        <h3 class="card-name">${t.name}</h3>
        <span class="card-type">${t.type}</span>
      </div>
      <div class="card-rating" title="香度 ${t.rating}/5">${fire(t.rating)}</div>
      <div class="card-row"><span class="k">免费额度</span><span class="v">${t.quota}</span></div>
      <div class="card-row"><span class="k">效果怎么样</span><span class="v">${t.effect}</span></div>
      <div class="card-row"><span class="k">怎么拿</span><span class="v">${t.how}</span></div>
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

render("all");
