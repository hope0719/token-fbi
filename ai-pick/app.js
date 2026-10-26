const NOW = Date.now();
const HIDE_AFTER_MS = 86400000; // 过期宽限：截止时刻已过超过 1 天即隐藏（原为 7 天）

const state = { search:'', type:'all', region:'all', sort:'deadline' };
let ALL = [];

const TYPE_OPTIONS = ['黑客松','开发挑战','AI竞赛','权益福利','开发激励','内容创作','内测资格','社区活动','其他'];
const REGION_OPTIONS = ['全球','中国','北美','亚太','欧洲','日本','其他'];
const SORT_OPTIONS = [
  {v:'deadline', t:'截止日期'},
  {v:'score', t:'推荐指数'},
  {v:'reward', t:'奖金池'},
  {v:'newest', t:'最新发现'}
];

// 中文枚举 → 样式类
const OFF_CLASS = {'官方确认':'confirmed','待确认':'suspected','非官方':'unofficial'};
const SUG_CLASS = {'立即行动':'act-now','值得参加':'worth-doing','先关注':'watch','跳过':'skip'};

function esc(s){ return (s==null?'':String(s)).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function asset(img){ return 'assets/' + (img || 'path-prize-envelope.png'); }

function endOf(a){ return a.endAt || a.deadline_date; }

// —— 时间口径（2026-09-02 校准）——
// 数据中截止时间多为带时区的精确时刻（如 2026-08-31T15:59:59.000Z = 北京 23:59:59）。
// 旧实现用 Math.ceil(剩余毫秒/天)：当日 23:59 截止的活动会被多算 1 天 ——
// 截止日当天显示"1 天截止"而非"今天截止"，几乎看不到"今天截止"就直接跳"已结束"。
// 新口径（统一为本地日历日，与卡片"X月X日截止"文案一致）：
//  1) deadlineTs()：截止精确时刻（尊重数据原文时区，毫秒级）；
//  2) daysUntil() ：浏览者本地时区下「截止时刻所在日历日 − 今天」的自然日差；
//     截止日整天 → 今天截止；一跨过截止时刻 → 已结束；
//  3) 过期展示宽限 1 天：截止时刻已过超过 1 天 → 隐藏。
function deadlineTs(a){
  const s = endOf(a); if(!s) return null;
  const t = new Date(s).getTime();
  return Number.isNaN(t) ? null : t;
}
function localDay(ts){
  const d = new Date(ts);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
function daysUntil(a){
  const t = deadlineTs(a); if(t == null) return null;
  return Math.round((localDay(t) - localDay(NOW)) / 86400000);
}
function deadlineBadge(a){
  const t = deadlineTs(a);
  if(t == null) return '<span class="deadline-badge longterm">长期开放</span>';
  const n = daysUntil(a);
  if(n === null) return '<span class="deadline-badge longterm">长期开放</span>';
  if(NOW >= t) return '<span class="deadline-badge ended">已结束</span>'; // 已到截止精确时刻
  let cls, txt;
  if(n <= 7){ cls = 'urgent'; txt = n === 0 ? '今天截止' : n + ' 天截止'; }
  else if(n <= 30){ cls = 'soon'; txt = n + ' 天截止'; }
  else { cls = 'distant'; txt = n + ' 天截止'; }
  return `<span class="deadline-badge ${cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${txt}</span>`;
}
function stars(n){
  n = Math.max(0, Math.min(5, n|0));
  let h = '';
  for(let i=0;i<5;i++) h += `<span class="${i<n?'filled':'empty'}">★</span>`;
  return `<span class="stars">${h}</span>`;
}
// 新活动标识：firstSeen 为 Asia/Shanghai 本地日历日，加入当天起 3 个自然日内显示右上角五角星
function isNew(a){
  if(!a.firstSeen) return false;
  const d1 = new Date(a.firstSeen + 'T00:00:00+08:00').getTime();
  if(isNaN(d1)) return false;
  const t = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()) + 'T00:00:00+08:00';
  const diffDays = Math.floor((new Date(t).getTime() - d1) / 86400000);
  return diffDays >= 0 && diffDays <= 2; // 加入当天 + 之后 2 天 = 共 3 天
}
function newStar(a){
  if(!isNew(a)) return '';
  return `<span class="new-star" aria-label="新活动" title="新活动 · 加入 3 天内"><svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="starGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="0.5" stop-color="#f5a623"/><stop offset="1" stop-color="#e07b00"/></linearGradient></defs><path d="M12 2l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.98 6.1 20.18l1.13-6.58L2.45 8.94l6.6-.96L12 2z" fill="url(#starGold)" stroke="#fff" stroke-width="0.6" stroke-linejoin="round"/></svg></span>`;
}
function rewardVal(a){
  const t = a.reward || '';
  const m = t.match(/[¥$]?\s*([\d,\.]+)\s*(万|亿|k|K|M|万|元|美元|RMB|CNY)?/);
  if(!m) return 0;
  let v = parseFloat(m[1].replace(/,/g,'')) || 0;
  const u = (m[2]||'').toLowerCase();
  if(u.includes('万')) v *= 10000;
  else if(u.includes('亿')) v *= 1e8;
  else if(u==='k') v *= 1000;
  else if(u==='m') v *= 1e6;
  return v;
}

function matches(a){
  if(state.search){
    const q = state.search.toLowerCase();
    if(!(`${a.title} ${a.vendor} ${a.reward} ${a.rewardDetail||''} ${a.type} ${a.region} ${a.officialStatus||''} ${a.suggestion||''}`).toLowerCase().includes(q)) return false;
  }
  if(state.type !== 'all' && a.type !== state.type) return false;
  if(state.region !== 'all' && a.region !== state.region) return false;
  // 过期展示宽限 1 天：只保留 未截止 或 已结束≤1天 的活动（按截止精确时刻动态生效）
  const t = deadlineTs(a);
  if(t != null && NOW - t > HIDE_AFTER_MS) return false;
  return true;
}
function sortList(list){
  const s = state.sort;
  if(s === 'score') return list.sort((x,y)=> (y.score||0)-(x.score||0));
  if(s === 'reward') return list.sort((x,y)=> rewardVal(y)-rewardVal(x));
  if(s === 'newest') return list.sort((x,y)=> (y.discoveredAt||'').localeCompare(x.discoveredAt||''));
  return list.sort((x,y)=> (deadlineTs(x) ?? Infinity) - (deadlineTs(y) ?? Infinity));
}

function fmtDate(a){
  const s = endOf(a); if(!s) return '长期开放';
  const d = new Date(s); if(isNaN(d.getTime())) return '';
  return `${d.getMonth()+1}月${d.getDate()}日`;
}

// 标题去金额：剥离 ¥/$/€/₹ 金额与奖池/prize 等奖励摘要，避免与奖励盒重复
// 规则保守：只剥离"货币金额 + 紧贴奖励词"与明确的"名次词+金额"，不误伤比赛名中的数字（如 Pinch Me! I Want 50K）
function stripTitleMoney(t){
  if(!t) return t;
  const hasMoney = /[¥$€₹]/.test(t);
  let s = t;
  s = s.replace(/[¥$€₹]\s*\d[\d,.]*\s*[-+]\s*\d[\d,.]*\s*[kKmM万W]?/g, ''); // 区间/连加 ¥5-20万
  s = s.replace(/[¥$€₹]\s*\d[\d,.]*\s*[kKmM万W]?\s*\+?\s*(?:总奖池|奖池|奖金池|现金奖池|大奖|奖金|现金|总奖|prize pool|prizes|prize|Prizes|Prize|bonus|Bonus|bounties|Bounties|cash|Cash|credits|Credits)?/g, '');
  s = s.replace(/(?:冠军|金奖|至尊奖|一等奖|二等奖|三等奖|全场大奖|总冠军|优胜奖)\s*[¥$€₹]?\s*\d[\d,.]*\s*万?/g, '');
  s = s.replace(/(?:总奖金|奖金池|奖池|现金池|总奖池|奖金)\s*\d[\d,.]*\s*万/g, '');
  s = s.replace(/\d[\d,.]*\s*万\s*(?:元|积分|额度|Token|API额度|奖金)?/g, '');
  s = s.replace(/(?:百万|千万|亿万)\s*(?:奖金池|奖金|奖池|现金池|总奖池|现金)?/g, '');
  s = s.replace(/\+?\s*(?:百|千|万|百万|千万|亿万)级\s*(?:投资|订单|扶持|资源|合作|股权)?/g, '');
  s = s.replace(/\+?级\s*(?:投资|订单|扶持|资源|合作)/g, '');
  s = s.replace(/(?:总)?(?:奖池|奖金池|现金奖池|现金池|总奖池|奖金)/g, '');
  s = s.replace(/(?:大奖|现金|总奖|至尊奖)/g, '');
  s = s.replace(/(?<=—\s*)池(?=\s|$)/g, '');
  s = s.replace(/\s*元(?=API额度|额度|积分|Token|$)/g, '');
  s = s.replace(/与\s*(?=\d)/g, '');
  s = s.replace(/\b(?:prize pool|prizes|prize|bonus|cash|bounties|bounty|credits|Credits|Prizes|Prize|Cash|Bonuses?)\b/g, '');
  s = s.replace(/\bNon-cash\b|\bnon-cash\b/g, '');
  s = s.replace(/([—–-])\s*\+\s*/g, '$1 ');
  s = s.replace(/\s*\/\s*(?:场景订单|股权投资|投资|订单)\s*$/g, '');
  s = s.replace(/([—–-])\s*&\s+/g, '$1 ');
  s = s.replace(/^\s*\+/, '');
  s = s.replace(/\s*\+\s*$/, '');
  s = s.replace(/\s*\+\s*(?=\s*$)/, '');
  if(hasMoney) s = s.replace(/\s*\+\s+/g, ' ');
  s = s.replace(/\s*Non-\s*$/i, '');
  s = s.replace(/\s*与\s*(?=\d)/g, ' ');
  s = s.replace(/\s*(?:与|和|及)\s*$/, '');
  s = s.replace(/\s*[，,、;；]\s*$/, '');
  s = s.replace(/\s+[—–]\s*$/, '');
  s = s.replace(/\s+-\s*$/, '');
  s = s.replace(/\s*[，,、;；]\s+/g, ' ');
  s = s.replace(/\s*万\s*/, ' ');
  s = s.replace(/\s{2,}/g, ' ');
  s = s.replace(/\s*\(\s*\)\s*/g, '').replace(/\s*（\s*）\s*/g, '');
  s = s.trim();
  if(!s || s.length < 4) return t;
  return s;
}

function oppCard(a){
  const diffLine = a.difficulty ? `<div class="diff-line"><span class="score-label">难度</span>${stars(a.difficulty)}${a.difficultyNote?`<span class="diff-note">${esc(a.difficultyNote)}</span>`:''}</div>` : '';
  const chips = (a.rewardTypes && a.rewardTypes.length) ? `<div class="reward-chips">${a.rewardTypes.map(r=>`<span class="reward-chip">${esc(r)}</span>`).join('')}</div>` : '';
  const off = a.officialStatus ? `<span class="official-badge ${OFF_CLASS[a.officialStatus]||''}">${esc(a.officialStatus)}</span>` : '';
  const sug = a.suggestion ? `<span class="suggest-tag ${SUG_CLASS[a.suggestion]||''}">${esc(a.suggestion)}</span>` : '';
  const badges = (off || sug) ? `<div class="badge-row">${off}${sug}</div>` : '';
  const rewardShown = a.rewardDetail || a.reward || '';
  const detail = null;
  const sum = a.participation || '';
  const vendor = (a.vendor && a.vendor !== '其他' && a.vendor !== 'Unknown') ? esc(a.vendor) : '';
  const region = a.region ? esc(a.region) : '';
  const meta = [vendor, region].filter(Boolean).join(' · ');
  return `<div class="opportunity-card${isNew(a) ? ' is-new' : ''}">
    <div class="card-body">
      <div class="card-main">
        <h3>${esc(stripTitleMoney(a.title))}</h3>
        ${meta ? `<p class="vendor-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6"/></svg>${meta}</p>` : ''}
        <div class="meta-row">${endOf(a) ? `<span class="deadline-line"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>${esc(fmtDate(a))} 截止</span>` : `<span class="deadline-line long-term">长期开放</span>`}${off}${sug}${chips}</div>
        <div class="score-diff-row"><span class="score-line"><span class="score-label">推荐</span>${stars(a.score)}</span><span class="diff-line"><span class="score-label">难度</span>${stars(a.difficulty)}</span>${a.difficultyNote?`<span class="diff-note">${esc(a.difficultyNote)}</span>`:''}</div>
        ${a.reward || a.rewardDetail ? `<div class="reward-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-4-6 4 1.5-7L2 9.5 9 9z"/></svg><div class="reward-content"><b>${esc(rewardShown)}</b>${detail ? `<small>${esc(detail)}</small>` : ''}</div></div>` : ''}
        ${sum ? `<p class="summary">${esc(sum)}</p>` : ''}
      </div>
      <div class="card-footer">
        <span class="type-tag">${esc(a.type || '其他')}</span>
        <a class="action-btn" href="${esc(a.url)}" target="_blank" rel="noopener">立即行动</a>
      </div>
    </div>
    ${newStar(a)}
    ${deadlineBadge(a)}
  </div>`;
}

function renderDeadline(){
  const list = ALL.filter(a=>{
    const s = endOf(a); if(!s) return false;
    const d = new Date(s); if(isNaN(d.getTime())) return false;
    if(d.getTime() < NOW) return false;
    return true;
  }).sort((x,y)=>{
    const dx = endOf(x)?new Date(endOf(x)).getTime():Infinity;
    const dy = endOf(y)?new Date(endOf(y)).getTime():Infinity;
    return dx - dy;
  }).slice(0,4);
  document.getElementById('deadlineGrid').innerHTML = list.length ? list.map(a=>`
    <a class="deadline-card${isNew(a) ? ' is-new' : ''}" href="${esc(a.url)}" target="_blank" rel="noopener">
      <img class="dl-icon" src="${asset(a.image)}" alt="" loading="lazy"/>
      <div class="dl-body">
        <h3>${esc(stripTitleMoney(a.title))}</h3>
      </div>
      ${newStar(a)}
      ${deadlineBadge(a)}
    </a>`).join('') : '<div class="empty-state">暂无即将截止的活动</div>';
}

function renderLongterm(){
  const list = ALL.filter(a=> !endOf(a));
  document.getElementById('longtermGrid').innerHTML = list.length ? list.map(oppCard).join('') : '<div class="empty-state">暂无长期有效的活动</div>';
}

function renderList(){
  const list = sortList(ALL.filter(a=> matches(a) && endOf(a)));
  document.getElementById('listCount').textContent = list.length;
  const grid = document.getElementById('grid');
  grid.innerHTML = list.length ? list.map(oppCard).join('') : '<div class="empty-state">没有符合条件的活动，试试调整筛选条件。</div>';
}

function buildMenus(){
  const tm = document.getElementById('typeMenu');
  tm.innerHTML = ['全部',...TYPE_OPTIONS].map(t=>`<li><button data-v="${t}" class="${state.type===t?'sel':''}">${t}</button></li>`).join('');
  const rm = document.getElementById('regionMenu');
  rm.innerHTML = ['全部',...REGION_OPTIONS].map(r=>`<li><button data-v="${r}" class="${state.region===r?'sel':''}">${r}</button></li>`).join('');
  const sm = document.getElementById('sortMenu');
  sm.innerHTML = SORT_OPTIONS.map(o=>`<li><button data-v="${o.v}" class="${state.sort===o.v?'sel':''}">${o.t}</button></li>`).join('');
}

function closeMenus(){
  ['typeMenu','regionMenu','sortMenu'].forEach(id=>document.getElementById(id).hidden = true);
}

function bindUI(){
  document.getElementById('searchInput').addEventListener('input', e=>{ state.search = e.target.value.trim(); renderList(); });
  document.getElementById('searchBtn').addEventListener('click', ()=>renderList());

  // filter triggers (dropdowns)
  document.querySelectorAll('.filter-trigger').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.stopPropagation();
      const key = btn.dataset.filter;
      const menu = document.getElementById(key+'Menu');
      const willOpen = menu.hidden;
      closeMenus();
      menu.hidden = !willOpen;
    });
  });
  document.querySelectorAll('.filter-menu').forEach(menu=>{
    menu.addEventListener('click', e=>{
      const b = e.target.closest('button'); if(!b) return;
      e.stopPropagation();
      const key = menu.id.replace('Menu','');
      const v = b.dataset.v;
      if(key==='type'){ state.type=v; document.getElementById('typeVal').textContent=v; }
      if(key==='region'){ state.region=v; document.getElementById('regionVal').textContent=v; }
      if(key==='sort'){ state.sort=v; document.getElementById('sortVal').textContent=SORT_OPTIONS.find(o=>o.v===v).t; }
      menu.hidden = true;
      buildMenus();
      renderList();
    });
  });
  document.addEventListener('click', closeMenus);

  document.getElementById('resetBtn').addEventListener('click', ()=>{
    state.type='all'; state.region='all'; state.sort='deadline';
    document.getElementById('typeVal').textContent='全部';
    document.getElementById('regionVal').textContent='全部';
    document.getElementById('sortVal').textContent='截止日期';
    buildMenus(); renderList();
  });
}

async function init(){
  try{
    const res = await fetch('data.json', {cache:'no-store'});
    const data = await res.json();
    ALL = data.activities || [];
    document.getElementById('updatedAt').textContent = (data.updated_at||'').slice(0,10);
  }catch(e){
    document.getElementById('grid').innerHTML = '<div class="empty-state">数据加载失败，请检查 data.json</div>';
    return;
  }
  buildMenus();
  bindUI();
  renderDeadline();
  renderLongterm();
  renderList();
}
init();
