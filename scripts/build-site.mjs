import { copyFile, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'dist');
const files = ['style.css', 'app.js', 'poster-doubao-laxin.jpg'];
const directories = ['assets'];

const html = await readFile(join(root, 'index.html'), 'utf8');
const javascript = await readFile(join(root, 'app.js'), 'utf8');
const indexNowKey = (await readFile(join(root, '.indexnow-key'), 'utf8')).trim();
if (!/^[a-zA-Z0-9-]{8,128}$/.test(indexNowKey)) throw new Error('Invalid IndexNow key');
const siteUrl = 'https://token-fbi.com/';

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

const staticIndex = `<noscript><section class="noscript-index"><h2>免费 AI 额度情报</h2><p>启用 JavaScript 可使用搜索与筛选。以下为当前收录平台：</p><ul>${data.visible
  .map(card => `<li><strong>${escapeHtml(card.name)}</strong> · ${escapeHtml(card.quota)}</li>`)
  .join('')}</ul></section></noscript>`;

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: '免费 AI Token 额度情报库｜Token FBI',
  description: '持续核验免费 AI Token、模型平台、开发工具和领取入口。',
  inLanguage: 'zh-CN',
  url: siteUrl,
  dateModified: data.visible.map(item => item.updated).sort().at(-1),
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: data.visible.length,
    itemListElement: data.visible.map((card, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: card.name,
      url: card.link?.startsWith('http') ? card.link : siteUrl
    }))
  }
};

const publishedHtml = html
  .replace('</head>', `  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>\n</head>`)
  .replace('</main>', `${staticIndex}\n  </main>`);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await writeFile(join(output, 'index.html'), publishedHtml);
for (const file of files) await copyFile(join(root, file), join(output, file));
for (const directory of directories) await cp(join(root, directory), join(output, directory), { recursive: true });

await writeFile(join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`);
await writeFile(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}</loc></url>\n</urlset>\n`);
await writeFile(join(output, 'llms.txt'), `# Token FBI\n\n> 免费 AI Token 与模型额度情报导航。\n\n- [首页](${siteUrl}): 平台名称、免费额度、支持模型、领取入口及最后更新日期。\n- 额度和活动会变动，请以各平台官方页面为准。\n- 推广内容会明确标注，不参与编辑评分和自然排序。\n`);
await writeFile(join(output, `${indexNowKey}.txt`), `${indexNowKey}\n`);
await writeFile(join(output, '_version.txt'), `${process.env.CF_PAGES_COMMIT_SHA || 'local-build'}\n`);

console.log(`Built ${data.visible.length} catalog items with local brand assets in dist/`);
