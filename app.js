/* =========================================================
 * Token 情报局 · Token FBI
 * 卡片数据都在下面的 TOKENS 数组里。
 * 想加一条情报？复制一个 {...} 对象粘进去就行，字段说明见每个属性。
 * ========================================================= */

const TOKENS = [
  {
    name: "示例 · 通义千问",
    type: "大模型",
    rating: 4,                                  // 香度 1~5（几颗火）
    quota: "新用户注册即送额度 + App 内每日签到",
    effect: "中文问答、写稿、总结都够用，日常白嫖神器",
    how: "官网/App 注册后自动到账，签到可累计",
    link: "#",                                 // 领取入口链接
    updated: "2026-07-14"
  },
  {
    name: "示例 · 即梦 AI",
    type: "绘图",
    rating: 5,
    quota: "每日免费生成额度，做图做视频都能用",
    effect: "出图快、中文提示词理解好，适合做封面/配图",
    how: "App 内每日登录领取免费点数",
    link: "#",
    updated: "2026-07-14"
  },
  {
    name: "示例 · 可灵 AI",
    type: "视频",
    rating: 4,
    quota: "每日赠送免费生成次数",
    effect: "文生视频质量在线，短片段够玩",
    how: "官网注册后每日 0 点刷新免费额度",
    link: "#",
    updated: "2026-07-13"
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
