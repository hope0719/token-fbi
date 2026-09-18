import { copyFile, mkdir, readFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'dist');
const files = [
  'index.html',
  'style.css',
  'app.js',
  'qrcode-wechat.jpg',
  'poster-doubao-laxin.jpg'
];

const html = await readFile(join(root, 'index.html'), 'utf8');
const javascript = await readFile(join(root, 'app.js'), 'utf8');

for (const file of files.slice(1)) {
  if (file === 'poster-doubao-laxin.jpg' && !javascript.includes(`poster: "${file}"`)) {
    throw new Error(`Poster reference changed; review the build asset list: ${file}`);
  }
  if (file !== 'poster-doubao-laxin.jpg' && !html.includes(file)) {
    throw new Error(`Page reference changed; review the build asset list: ${file}`);
  }
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of files) {
  await copyFile(join(root, file), join(output, file));
}

console.log(`Built ${files.length} site files in dist/`);
