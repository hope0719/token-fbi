import { copyFile, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'dist');
const files = ['style.css', 'app.js', 'poster-doubao-laxin.jpg'];
const directories = ['assets'];
const siteOrigin = 'https://token-fbi.com';
const siteUrl = `${siteOrigin}/`;
const ogImage = `${siteOrigin}/assets/brand/token-fbi-mark-v2.png`;

const html = await readFile(join(root, 'index.html'), 'utf8');
const javascript = await readFile(join(root, 'app.js'), 'utf8');
const indexNowKey = (await readFile(join(root, '.indexnow-key'), 'utf8')).trim();
if (!/^[a-zA-Z0-9-]{8,128}$/.test(indexNowKey)) throw new Error('Invalid IndexNow key');

const runtimeStart = javascript.indexOf('const LOGO_RULES =');
if (runtimeStart < 0) throw new Error('Catalog runtime marker not found in app.js');
const data = vm.runInNewContext(
  `${javascript.slice(0, runtimeStart)}\n({ visible: VISIBLE, watchout: DONOTS, category: catOf })`,
  {},
  { timeout: 1000 }
);

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const escapeXml = escapeHtml;
const clean = value => String(value ?? '').replace(/[—–]/g, '-').replace(/\s+/g, ' ').trim();
const absolute = route => `${siteOrigin}${route}`;

const slugRules = [
  [/workbuddy/i, 'workbuddy'], [/qoder|灵码/i, 'qoder'], [/glm-5\.3|ox-alpha/i, 'glm-5-3-flash'],
  [/蓝博|lanbuff/i, 'lanbuff'], [/阶跃|stepfun/i, 'stepfun'], [/^cline$/i, 'cline'],
  [/kilo/i, 'kilo-code'], [/verdent/i, 'verdent'], [/marvis|马维斯/i, 'marvis'],
  [/catpaw/i, 'catpaw'], [/小程序开发大赛/i, 'wechat-miniprogram-contest'],
  [/硅基|siliconflow/i, 'siliconflow'], [/longcat/i, 'longcat'], [/opencode/i, 'opencode-zen'],
  [/成长计划|cloudbase/i, 'cloudbase-growth-plan'], [/scnet|超算/i, 'scnet'],
  [/amd/i, 'amd-developer-program'], [/秒哒/i, 'miaoda'], [/小米|mimo/i, 'xiaomi-mimo'],
  [/有道|lobster/i, 'lobsterai'], [/云工开物/i, 'aliyun-student']
];
function slugFor(name) {
  const match = slugRules.find(([rule]) => rule.test(name));
  if (match) return match[1];
  let hash = 2166136261;
  for (const char of name) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return `item-${(hash >>> 0).toString(36)}`;
}
const detailRoute = item => `/intel/${slugFor(item.name)}/`;

const logoRules = [
  [/workbuddy/i, 'workbuddy-official.png'], [/qoder|灵码/i, 'qoder-ui.svg'], [/glm|智谱/i, 'zhipu-ui.svg'],
  [/阶跃|stepfun/i, 'stepfun-ui.svg'], [/cline/i, 'cline.png'], [/kilo/i, 'kilo.png'],
  [/verdent/i, 'verdent.png'], [/marvis|马维斯/i, 'marvis.png'], [/catpaw/i, 'catpaw.png'],
  [/微信|小程序/i, 'wechat.png'], [/硅基|siliconflow/i, 'siliconflow.png'], [/longcat|美团/i, 'meituan.png'],
  [/opencode/i, 'opencode.png'], [/cloudbase|腾讯|混元/i, 'tencent.png'], [/scnet|超算/i, 'scnet.png'],
  [/amd/i, 'amd.png'], [/秒哒|百度/i, 'baidu.png'], [/小米|mimo/i, 'xiaomi.png'],
  [/有道|lobster/i, 'youdao.png'], [/阿里|百炼|云工/i, 'aliyun.png']
];
function logoFor(item) {
  const details = `${item.name} ${item.modality ?? ''} ${item.effect ?? ''}`;
  const match = logoRules.find(([rule]) => rule.test(details));
  return `/assets/logos/${match ? match[1] : 'tencent.png'}`;
}

const editorial = data.visible.filter(item => data.category(item) !== '项目');
const partners = data.visible.filter(item => data.category(item) === '项目');
const latest = editorial.map(item => item.updated).sort().at(-1);
const siteModified = process.env.SITE_BUILD_DATE || new Date().toISOString().slice(0, 10);
const models = editorial.filter(item => data.category(item) === '大模型');
const tools = editorial.filter(item => data.category(item) === '工具');

function freeType(item) {
  const text = `${item.quota ?? ''} ${item.effect ?? ''}`;
  if (item.limited || /截止|限时|体验卡|邀测/.test(text)) return '限时活动或体验';
  if (/长期免费|完全免费|真免费|不限量/.test(text)) return '长期免费或免费层';
  if (/注册|新用户|赠|领取/.test(text)) return '注册赠送额度';
  return '免费额度';
}

function compact(value, max = 88) {
  const text = clean(value);
  return text.length > max ? `${text.slice(0, max).replace(/[，。；、\s]+$/g, '')}…` : text;
}

function isReferralLink(url = '') {
  return /invite|usercode|[?&]aff=|qcloud\.com|work-fission|s\.mi\.cn/i.test(url);
}

function homeCard(item) {
  const label = item.limited ? `限时 ${item.limited.slice(5).replace('-', '/')}` : freeType(item).replace('或免费层', '');
  return `<article class="intel-card" data-kind="${escapeHtml(data.category(item))}">
    <div class="card-visual"><span class="${item.limited ? 'limited-label' : 'free-label'}">${escapeHtml(label)}</span><img src="${logoFor(item)}" alt="${escapeHtml(item.name)} Logo"><span class="visual-brand">${escapeHtml(item.name)}</span></div>
    <div class="card-body"><div class="card-title-row"><h3><a href="${detailRoute(item)}">${escapeHtml(item.name.replace(/（.*?）/g, ''))}</a></h3></div><p class="model-line">${escapeHtml(compact(item.modality, 44))}</p><p class="quota-summary">${escapeHtml(compact(item.quota, 58))}</p><div class="card-meta-row"><span><b>${escapeHtml(item.limited ? '限时有效' : '持续核验')}</b></span><span>已验证 ${escapeHtml(item.updated)}</span></div><div class="card-footer"><a class="card-action" href="${detailRoute(item)}">核验详情</a></div></div>
  </article>`;
}

function featuredCard(item, index) {
  const title = index === 0 ? '更强的 AI 工作空间，<span>从免费开始</span>' : '为真实开发而生的<br><span>AI 编程伙伴</span>';
  const summary = index === 0 ? '集成多模型的生产力平台，注册即可体验免费额度。' : '支持多模型，免费额度助你更高效地完成项目。';
  const art = index === 0
    ? '<div class="featured-art" aria-hidden="true"><div class="art-card one"><span>混元 HY3</span><span>混元 HY4</span><span>DeepSeek-V4.1</span><span>更多模型</span></div><div class="art-card two"></div><div class="art-card three"></div></div>'
    : '<div class="featured-art" aria-hidden="true"><div class="qoder-window"><strong>Code<br>with Qoder.</strong><span>Qwen3.8-Flash</span><span>Qwen3.8-Max</span><span>GLM-5.3</span><span>DeepSeek-V4</span></div></div>';
  return `<article class="featured-card ${index === 0 ? 'is-workbuddy' : 'is-qoder'}"><div class="featured-content"><div class="product-line"><img src="${logoFor(item)}" alt="${escapeHtml(item.name)} Logo"><strong>${escapeHtml(item.name)}</strong></div><h3>${title}</h3><p class="summary">${summary}</p><div class="featured-action"><a href="${detailRoute(item)}">查看核验详情</a></div></div>${art}${index === 1 ? '<span class="editor-badge">编程工具精选</span>' : ''}<div class="featured-facts"><span>${escapeHtml(freeType(item))}</span><span>已验证 ${escapeHtml(item.updated)}</span></div></article>`;
}

function watchRow(item) {
  return `<article class="watch-row"><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.why)}</p><a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">查看平台</a></article>`;
}

const partnerStatic = partners.map(item => `<article class="partner-card"><img src="/assets/logos/wechat.png" alt=""><div><h3>${escapeHtml(item.name)}</h3><p><span class="promoted">推广</span> ${escapeHtml(compact(item.quota, 72))}</p></div></article>`).join('');
const noscript = '<noscript><p class="noscript-note">页面内容已经完整呈现；启用 JavaScript 后可使用搜索、筛选与展开功能。</p></noscript>';

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': `${siteUrl}#organization`, name: 'Token 情报局', url: siteUrl, logo: ogImage },
    { '@type': 'WebSite', '@id': `${siteUrl}#website`, name: 'Token 情报局', url: siteUrl, inLanguage: 'zh-CN', publisher: { '@id': `${siteUrl}#organization` } },
    {
      '@type': 'CollectionPage', '@id': `${siteUrl}#webpage`, name: '免费 AI Token 额度情报库｜Token FBI',
      description: '持续核验免费 AI Token、模型平台、开发工具和领取入口。', inLanguage: 'zh-CN',
      url: siteUrl, dateModified: siteModified, isPartOf: { '@id': `${siteUrl}#website` },
      mainEntity: { '@type': 'ItemList', numberOfItems: editorial.length, itemListElement: editorial.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: absolute(detailRoute(item)) })) }
    }
  ]
};

let publishedHtml = html
  .replace('<div class="featured-grid" id="featuredGrid"></div>', `<div class="featured-grid" id="featuredGrid">${editorial.slice(0, 2).map(featuredCard).join('')}</div>`)
  .replace('<div class="catalog-grid" id="modelCards"></div>', `<div class="catalog-grid" id="modelCards">${models.slice(0, 4).map(homeCard).join('')}</div>`)
  .replace('<div class="catalog-grid" id="toolCards"></div>', `<div class="catalog-grid" id="toolCards">${tools.slice(0, 4).map(homeCard).join('')}</div>`)
  .replace('<div class="partner-grid" id="partnerCards"></div>', `<div class="partner-grid" id="partnerCards">${partnerStatic}</div>`)
  .replace('<div class="watch-grid" id="watchoutCards"></div>', `<div class="watch-grid" id="watchoutCards">${data.watchout.slice(0, 5).map(watchRow).join('')}</div>`)
  .replace('</head>', `  <meta property="og:image" content="${ogImage}" />\n  <meta name="twitter:card" content="summary_large_image" />\n  <meta name="twitter:title" content="Token 情报局｜免费 AI 额度情报库" />\n  <meta name="twitter:description" content="持续核验可领取的免费 AI Token、模型平台和开发工具。" />\n  <meta name="twitter:image" content="${ogImage}" />\n  <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM content index" />\n  <script type="application/ld+json">${JSON.stringify(homeSchema).replace(/</g, '\\u003c')}</script>\n</head>`)
  .replace('</main>', `${noscript}\n  </main>`);

function pageHead({ title, description, route, schema, type = 'website' }) {
  const canonical = absolute(route);
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#090c0a"><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${canonical}"><meta property="og:type" content="${type}"><meta property="og:locale" content="zh_CN"><meta property="og:site_name" content="Token 情报局"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${ogImage}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${ogImage}"><link rel="icon" href="/assets/brand/token-fbi-mark-v2-192.png" type="image/png"><title>${escapeHtml(title)}</title><link rel="stylesheet" href="/style.css?v=2026092508"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script></head>`;
}

function contentLayout({ title, description, route, body, schema, breadcrumbs = [] }) {
  const crumbHtml = [['/', '首页'], ...breadcrumbs].map(([href, label], index, list) => index === list.length - 1 ? `<span>${escapeHtml(label)}</span>` : `<a href="${href}">${escapeHtml(label)}</a><i>/</i>`).join('');
  return `${pageHead({ title, description, route, schema, type: schema['@type'] === 'Article' ? 'article' : 'website' })}<body class="content-page"><header class="content-topbar"><a class="content-brand" href="/"><img src="/assets/brand/token-fbi-mark-v2-192.png" alt=""><strong>Token 情报局</strong></a><nav><a href="/models/">大模型</a><a href="/tools/">编程工具</a><a href="/compare/free-coding-models/">免费编程对比</a><a href="/changelog/">更新日志</a></nav></header><main class="content-main"><nav class="breadcrumbs" aria-label="面包屑">${crumbHtml}</nav>${body}</main><footer class="content-footer"><span>Token 情报局 · 免费 AI Token 额度情报站</span><nav><a href="/about/">关于</a><a href="/editorial-policy/">编辑规则</a><a href="/privacy/">隐私</a><a href="/contact/">联系</a></nav></footer></body></html>`;
}

const pageRecords = [{ route: '/', lastmod: siteModified }];
async function writeRoute(route, content, lastmod = siteModified) {
  const directory = route === '/' ? output : join(output, route.replace(/^\//, ''));
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'index.html'), content);
  if (route !== '/') pageRecords.push({ route, lastmod });
}

function webPageSchema(name, description, route, extra = {}) {
  return { '@context': 'https://schema.org', '@type': 'WebPage', name, description, url: absolute(route), inLanguage: 'zh-CN', dateModified: siteModified, publisher: { '@type': 'Organization', name: 'Token 情报局', url: siteUrl }, ...extra };
}

function collectionPage(title, description, route, items, intro) {
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: absolute(route), inLanguage: 'zh-CN', dateModified: siteModified, mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: absolute(detailRoute(item)) })) } };
  const body = `<article class="content-article"><span class="content-kicker">持续核验 · ${items.length} 条</span><h1>${escapeHtml(title)}</h1><p class="content-lead">${escapeHtml(intro)}</p><div class="content-list">${items.map(item => `<a class="content-list-item" href="${detailRoute(item)}"><img src="${logoFor(item)}" alt=""><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(compact(item.modality, 70))}</small><em>${escapeHtml(freeType(item))} · 核验于 ${escapeHtml(item.updated)}</em></span></a>`).join('')}</div></article>`;
  return contentLayout({ title: `${title}｜Token 情报局`, description, route, body, schema, breadcrumbs: [[route, title]] });
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of files) await copyFile(join(root, file), join(output, file));
for (const directory of directories) await cp(join(root, directory), join(output, directory), { recursive: true });
await writeRoute('/', publishedHtml);

await writeRoute('/models/', collectionPage('免费 AI 大模型额度', '持续核验可直接调用的免费 AI 大模型、API 与平台注册额度。', '/models/', models, '按免费口径、支持模型与最后核验时间整理。首页保持简洁，这里展示全部仍在持续核验的大模型情报。'));
await writeRoute('/tools/', collectionPage('免费 AI 编程工具', '收录提供免费模型或试用额度的 AI 编程助手、Agent 与开发工作台。', '/tools/', tools, '面向写代码、查资料、运行 Agent 和日常生产力场景，区分长期免费、注册送额度与限时体验。'));

const watchSchema = webPageSchema('AI 平台观望名单', '额度偏少、体验不稳定或领取门槛较高的平台记录。', '/watchlist/');
await writeRoute('/watchlist/', contentLayout({ title: 'AI 平台观望名单｜Token 情报局', description: watchSchema.description, route: '/watchlist/', schema: watchSchema, breadcrumbs: [['/watchlist/', '观望名单']], body: `<article class="content-article"><span class="content-kicker">谨慎领取 · ${data.watchout.length} 条</span><h1>AI 平台观望名单</h1><p class="content-lead">记录额度偏少、体验不稳定、规则不清晰或领取门槛较高的平台。观望不代表平台不安全，只表示目前不建议优先投入时间。</p><div class="content-watchlist">${data.watchout.map(watchRow).join('')}</div></article>` }));

for (const item of editorial) {
  const route = detailRoute(item);
  const title = `${item.name} 免费额度与核验记录｜Token 情报局`;
  const description = compact(`${item.name}：${item.quota}`, 110);
  const schema = { '@context': 'https://schema.org', '@type': 'Article', headline: title, description, mainEntityOfPage: absolute(route), dateModified: item.updated, datePublished: item.updated, inLanguage: 'zh-CN', author: { '@type': 'Organization', name: 'Token 情报局' }, publisher: { '@type': 'Organization', name: 'Token 情报局', url: siteUrl, logo: { '@type': 'ImageObject', url: ogImage } } };
  const referral = isReferralLink(item.link);
  const body = `<article class="content-article intel-detail"><div class="detail-brand"><img src="${logoFor(item)}" alt="${escapeHtml(item.name)} Logo"><span>${escapeHtml(data.category(item))}</span></div><h1>${escapeHtml(item.name)} 免费额度与核验记录</h1><p class="content-lead">${escapeHtml(compact(item.effect, 170))}</p><dl class="fact-grid"><div><dt>免费类型</dt><dd>${escapeHtml(freeType(item))}</dd></div><div><dt>最后核验</dt><dd><time datetime="${escapeHtml(item.updated)}">${escapeHtml(item.updated)}</time></dd></div><div><dt>支持模型或能力</dt><dd>${escapeHtml(item.modality)}</dd></div><div><dt>收录分类</dt><dd>${escapeHtml(data.category(item))}</dd></div></dl><section><h2>免费额度与活动口径</h2><p>${escapeHtml(item.quota)}</p></section><section><h2>使用判断与限制</h2><p>${escapeHtml(item.effect)}</p></section><section><h2>核验说明</h2><p>本页由 Token 情报局根据公开页面与实际入口进行人工整理，核验日期为 ${escapeHtml(item.updated)}。额度、模型和活动时间可能变化，请在领取前再次查看平台页面。</p></section><div class="detail-actions"><a class="content-cta" href="${escapeHtml(item.link)}" target="_blank" rel="${referral ? 'sponsored nofollow ' : ''}noopener noreferrer">${referral ? '前往平台入口（邀请链接）' : '前往平台或活动入口'}</a><a href="/editorial-policy/">查看编辑与更正规则</a></div><p class="link-disclosure">${referral ? '本页入口包含邀请参数，使用后本站或投稿者可能获得平台奖励；' : '部分平台可能调整入口地址；'}这不会改变本站对免费额度和使用限制的编辑判断。</p></article>`;
  await writeRoute(route, contentLayout({ title, description, route, body, schema, breadcrumbs: [[data.category(item) === '工具' ? '/tools/' : '/models/', data.category(item)], [route, item.name]] }), item.updated);
}

const compareRoute = '/compare/free-coding-models/';
const compareItems = editorial.filter(item => /workbuddy|qoder|kilo|cline/i.test(item.name));
const compareSchema = webPageSchema('免费 AI 编程工具对比', '对比 WorkBuddy、Qoder、Kilo Code 与 Cline 的免费口径、支持模型和适用场景。', compareRoute);
await writeRoute(compareRoute, contentLayout({ title: '免费 AI 编程工具对比｜Token 情报局', description: compareSchema.description, route: compareRoute, schema: compareSchema, breadcrumbs: [['/compare/free-coding-models/', '免费编程工具对比']], body: `<article class="content-article"><span class="content-kicker">场景对比 · 最后更新 ${siteModified}</span><h1>免费 AI 编程工具怎么选</h1><p class="content-lead">下面按当前免费口径、支持模型与使用定位对比四款工具。活动随时可能变化，点击名称可查看本站核验记录。</p><div class="comparison-wrap"><table class="comparison-table"><thead><tr><th>工具</th><th>免费口径</th><th>支持模型或能力</th><th>核验日期</th></tr></thead><tbody>${compareItems.map(item => `<tr><th><a href="${detailRoute(item)}">${escapeHtml(item.name)}</a></th><td>${escapeHtml(compact(item.quota, 80))}</td><td>${escapeHtml(compact(item.modality, 68))}</td><td>${escapeHtml(item.updated)}</td></tr>`).join('')}</tbody></table></div><section><h2>选择建议</h2><p>希望直接使用多模型工作台，可先查看 WorkBuddy；偏重 IDE 和自主编程流程，可比较 Qoder、Kilo Code 与 Cline。最终选择应以所在地区、账号资格、模型可用性和最新额度规则为准。</p></section></article>` }));

const aboutRoute = '/about/';
await writeRoute(aboutRoute, contentLayout({ title: '关于 Token 情报局', description: 'Token 情报局的站点定位、维护方式与信息边界。', route: aboutRoute, schema: webPageSchema('关于 Token 情报局', 'Token 情报局的站点定位、维护方式与信息边界。', aboutRoute), breadcrumbs: [[aboutRoute, '关于本站']], body: '<article class="content-article"><span class="content-kicker">关于本站</span><h1>把值得领取的 AI 额度查清楚</h1><p class="content-lead">Token 情报局是独立维护的免费 AI 额度目录，收录模型平台、开发工具和限时活动，并持续记录额度口径、支持模型、限制条件与最后核验日期。</p><section><h2>我们做什么</h2><p>整理公开信息，实际打开领取入口，区分长期免费、免费层、注册赠送和限时活动，并给出简短的使用判断。</p></section><section><h2>我们不做什么</h2><p>本站不代跑模型、不托管模型文件、不提供镜像，也不提供规避地区或网络限制的教程。所有模型和服务均由第三方平台提供。</p></section><section><h2>独立性说明</h2><p>商业合作会单独标注，不参与编辑评分和自然排序。部分链接可能包含邀请参数，是否使用不影响用户看到的内容。</p></section></article>' }));

const editorialRoute = '/editorial-policy/';
await writeRoute(editorialRoute, contentLayout({ title: '编辑、核验与更正规则｜Token 情报局', description: 'Token 情报局的收录门槛、核验方法、商业内容标注和错误更正规则。', route: editorialRoute, schema: webPageSchema('编辑、核验与更正规则', 'Token 情报局的收录门槛、核验方法、商业内容标注和错误更正规则。', editorialRoute), breadcrumbs: [[editorialRoute, '编辑规则']], body: '<article class="content-article"><span class="content-kicker">编辑透明度</span><h1>编辑、核验与更正规则</h1><section><h2>收录标准</h2><p>优先收录无需付费即可实际使用、提供明确免费层或有清晰活动期限的 AI 模型与工具。纯低价促销、规则不清或体验不稳定的平台会进入观望名单。</p></section><section><h2>核验方法</h2><p>编辑会检查平台页面、活动入口、支持模型、额度口径和限制条件。每条记录显示最后核验日期；无法确认的内容会使用“待核实”或“观望”表述。</p></section><section><h2>商业内容</h2><p>付费合作、邀请奖励或可能产生收益的内容会明确标注。商业关系不改变自然排序、收录门槛和负面信息披露。</p></section><section><h2>错误更正</h2><p>额度随时可能变化。收到可靠纠错后会重新核验并更新记录；重大变化会进入更新日志。可通过联系页面或 GitHub Issue 提交证据。</p></section></article>' }));

const privacyRoute = '/privacy/';
await writeRoute(privacyRoute, contentLayout({ title: '隐私政策｜Token 情报局', description: 'Token 情报局关于访问日志、分析服务、第三方链接、Cookie 与广告的隐私说明。', route: privacyRoute, schema: webPageSchema('隐私政策', 'Token 情报局关于访问日志、分析服务、第三方链接、Cookie 与广告的隐私说明。', privacyRoute), breadcrumbs: [[privacyRoute, '隐私政策']], body: `<article class="content-article"><span class="content-kicker">更新于 ${siteModified}</span><h1>隐私政策</h1><p class="content-lead">本站不提供账号注册，也不主动收集身份证件、支付信息或模型对话内容。</p><section><h2>访问与性能数据</h2><p>网站托管于 Cloudflare Pages，并使用 Cloudflare 提供的网络、安全、性能与基础访问分析能力。Cloudflare 可能按照其政策处理 IP 地址、设备、浏览器和请求信息。</p></section><section><h2>第三方链接</h2><p>点击领取入口后会离开本站。第三方平台如何收集和使用信息，由其自己的隐私政策决定。部分链接可能带有邀请参数。</p></section><section><h2>Cookie 与广告</h2><p>本站当前未展示 Google AdSense 广告。如果未来启用广告或需要同意管理平台，将在上线前更新本政策，并按适用地区提供相应选择。</p></section><section><h2>联系我们</h2><p>如需查询、更正或删除通过投稿渠道提交的信息，请通过<a href="/contact/">联系页面</a>提出。</p></section></article>` }));

const contactRoute = '/contact/';
await writeRoute(contactRoute, contentLayout({ title: '联系与投稿｜Token 情报局', description: '提交免费 AI 额度线索、纠错证据或商业合作信息。', route: contactRoute, schema: webPageSchema('联系与投稿', '提交免费 AI 额度线索、纠错证据或商业合作信息。', contactRoute), breadcrumbs: [[contactRoute, '联系与投稿']], body: '<article class="content-article"><span class="content-kicker">联系本站</span><h1>投稿、纠错与合作</h1><p class="content-lead">提交线索时请尽量附上平台名称、官方页面、额度口径、截止日期和截图或实测说明。</p><div class="contact-grid"><section><h2>GitHub 投稿</h2><p>适合提交公开线索、补充来源和追踪更正进度。</p><a class="content-cta" href="https://github.com/hope0719/token-fbi/issues" target="_blank" rel="noopener noreferrer">创建 GitHub Issue</a></section><section><h2>微信联系</h2><p>适合加入交流群、发送截图或洽谈明确标注的商业合作。</p><button class="content-cta" type="button" data-copy="lmfh2022">微信号：lmfh2022</button></section></div></article><script>document.querySelectorAll("[data-copy]").forEach(button=>button.addEventListener("click",async()=>{await navigator.clipboard.writeText(button.dataset.copy);button.textContent="已复制微信号";}));</script>' }));

const changelogRoute = '/changelog/';
const changes = [...editorial].sort((a, b) => b.updated.localeCompare(a.updated));
await writeRoute(changelogRoute, contentLayout({ title: '免费 AI 额度更新日志｜Token 情报局', description: '按最后核验日期记录免费 AI 模型、编程工具和活动额度的更新。', route: changelogRoute, schema: webPageSchema('免费 AI 额度更新日志', '按最后核验日期记录免费 AI 模型、编程工具和活动额度的更新。', changelogRoute), breadcrumbs: [[changelogRoute, '更新日志']], body: `<article class="content-article"><span class="content-kicker">持续维护</span><h1>免费 AI 额度更新日志</h1><p class="content-lead">这里按最后核验日期展示当前有效目录的更新记录。具体变更和限制请进入对应详情页查看。</p><ol class="change-list">${changes.map(item => `<li><time datetime="${escapeHtml(item.updated)}">${escapeHtml(item.updated)}</time><span><a href="${detailRoute(item)}">${escapeHtml(item.name)}</a><small>${escapeHtml(compact(item.quota, 94))}</small></span></li>`).join('')}</ol></article>` }));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pageRecords.map(page => `  <url><loc>${escapeXml(absolute(page.route))}</loc><lastmod>${escapeXml(page.lastmod)}</lastmod></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(output, 'sitemap.xml'), sitemap);
await writeFile(join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`);

const llmsCatalog = editorial.map(item => `- [${item.name}](${absolute(detailRoute(item))}): ${clean(item.quota)}；最后核验 ${item.updated}。`).join('\n');
await writeFile(join(output, 'llms.txt'), `# Token 情报局\n\n> 面向中文用户的免费 AI Token、模型额度与开发工具情报目录。本站只整理、核验并链接到平台入口，不代跑、不镜像。\n\n## 核心页面\n\n- [首页](${siteUrl}): 最新免费额度、工具与观望名单。\n- [免费大模型](${absolute('/models/')}): 可直接调用的大模型与 API。\n- [免费编程工具](${absolute('/tools/')}): AI 编程助手、Agent 与工作台。\n- [免费编程工具对比](${absolute(compareRoute)}): 按免费口径和支持模型比较常用工具。\n- [观望名单](${absolute('/watchlist/')}): 额度偏少、体验不稳或门槛较高的平台。\n- [更新日志](${absolute(changelogRoute)}): 按核验日期记录更新。\n- [编辑与更正规则](${absolute(editorialRoute)}): 收录、核验、商业标注与纠错方法。\n- [完整机器可读目录](${absolute('/llms-full.txt')}): 当前全部有效条目。\n\n## 使用边界\n\n- 额度、价格、模型和截止时间会变化，以平台最新页面为准。\n- 推广内容单独标注，不参与编辑评分和自然排序。\n- 每条详情页包含免费口径、使用判断、限制与最后核验日期。\n`);
await writeFile(join(output, 'llms-full.txt'), `# Token 情报局完整目录\n\n最后更新：${siteModified}\n\n## 当前有效情报\n\n${llmsCatalog}\n\n## 观望名单\n\n${data.watchout.map(item => `- ${item.name}: ${clean(item.why)}`).join('\n')}\n`);
await writeFile(join(output, `${indexNowKey}.txt`), `${indexNowKey}\n`);
await writeFile(join(output, '_version.txt'), `${process.env.CF_PAGES_COMMIT_SHA || 'local-build'}\n`);

console.log(`Built ${editorial.length} editorial items across ${pageRecords.length} indexable pages.`);
