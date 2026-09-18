import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'dist');
const files = [
  'style.css',
  'app.js',
  'qrcode-wechat.jpg',
  'poster-doubao-laxin.jpg'
];

const html = await readFile(join(root, 'index.html'), 'utf8');
const javascript = await readFile(join(root, 'app.js'), 'utf8');
const indexNowKey = (await readFile(join(root, '.indexnow-key'), 'utf8')).trim();
if (!/^[a-zA-Z0-9-]{8,128}$/.test(indexNowKey)) throw new Error('Invalid IndexNow key');
const siteUrl = 'https://token-fbi.com/';

// Read the site's existing card selection logic at build time. app.js remains
// the only source of card data and order; the published HTML starts with cards.
const renderStart = javascript.indexOf('function render(type) {');
if (renderStart < 0) throw new Error('Card render function not found in app.js');
const data = vm.runInNewContext(
  `${javascript.slice(0, renderStart)}\n({ visible: VISIBLE, watchout: DONOTS, category: catOf })`,
  { document: { getElementById: () => null } },
  { timeout: 1000 }
);

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const safeUrl = value => {
  const url = new URL(value, siteUrl);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`Unsafe card URL: ${value}`);
  return escapeHtml(url.href);
};
const staticCards = data.visible.map(card => {
  const details = [card.quota, card.signup, card.charge].filter(Boolean).join('。');
  const destination = card.poster || card.link || (card.traeLinks?.length
    ? `https://www.trae.cn/work-fission/${card.traeLinks[0]}?utm_source=copy_link&utm_medium=friends_invite`
    : null);
  if (!destination) throw new Error(`Missing card destination: ${card.name}`);
  return `
        <article class="card">
          <div class="card-rating"><span class="card-meta"><span class="card-type">${escapeHtml(data.category(card))}</span></span></div>
          <div class="card-title-row"><h3 class="card-name">${escapeHtml(card.name)}</h3></div>
          <p class="card-modality">${escapeHtml(card.modality)}</p>
          <hr class="card-divider" />
          <div class="card-field"><span class="ico">♪</span><span class="v">${escapeHtml(details)}</span></div>
          <div class="card-field"><span class="ico">✦</span><span class="v">${escapeHtml(card.effect)}</span></div>
          <div class="card-action"><a class="card-link" href="${safeUrl(destination)}" target="_blank" rel="noopener noreferrer">查看详情</a></div>
          <div class="card-footer"><div class="card-date">更新于 ${escapeHtml(card.updated)}</div></div>
        </article>`;
}).join('');
const staticWatchout = data.watchout.map((card, index) => `
        <div class="row-watchout">
          <span class="row-watchout-num">${index + 1}</span>
          <h3 class="row-watchout-name">${escapeHtml(card.name)}</h3>
          <span class="row-watchout-tag">观望</span>
          <p class="row-watchout-why">${escapeHtml(card.why)}</p>
          <a class="row-watchout-action" href="${safeUrl(card.link)}" target="_blank" rel="noopener noreferrer">查看详情</a>
        </div>`).join('');

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: '免费 AI Token 额度与模型平台导航｜Token FBI',
  description: '汇总免费 AI Token 平台、额度说明、支持模型、领取入口和更新日期。',
  inLanguage: 'zh-CN',
  url: siteUrl,
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: data.visible.length,
    itemListElement: data.visible.map((card, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: card.name,
      url: card.link || siteUrl
    }))
  }
};
const publishedHtml = html
  .replace('<!-- STATIC_CARDS -->', staticCards)
  .replace('<!-- STATIC_WATCHOUT -->', staticWatchout)
  .replace('</head>', `  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>\n</head>`);
if (publishedHtml === html || publishedHtml.includes('<!-- STATIC_')) {
  throw new Error('Static card placeholders were not rendered');
}

for (const file of files) {
  if (file === 'poster-doubao-laxin.jpg' && !javascript.includes(`poster: "${file}"`)) {
    throw new Error(`Poster reference changed; review the build asset list: ${file}`);
  }
  if (file !== 'poster-doubao-laxin.jpg' && !html.includes(file)) {
    throw new Error(`Page reference changed; review the build asset list: ${file}`);
  }
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await writeFile(join(output, 'index.html'), publishedHtml);
for (const file of files) {
  await copyFile(join(root, file), join(output, file));
}

await writeFile(join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`);
await writeFile(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}</loc></url>\n</urlset>\n`);
await writeFile(join(output, 'llms.txt'), `# Token FBI\n\n> 免费 AI Token 与模型额度情报导航。\n\n- [首页](${siteUrl}): 平台名称、免费额度、支持模型、领取入口及最后更新日期。\n- 额度和活动会变动，请以各平台官方页面为准。\n- 本站是非官方爱好者项目。\n`);
await writeFile(join(output, `${indexNowKey}.txt`), `${indexNowKey}\n`);
await writeFile(join(output, '_version.txt'), `${process.env.CF_PAGES_COMMIT_SHA || 'local-build'}\n`);

console.log(`Built ${data.visible.length} static cards and ${files.length + 6} site files in dist/`);
