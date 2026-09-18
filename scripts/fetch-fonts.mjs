/**
 * 把封面用到的西文和请柬里的中文，下载成本地 woff2。
 * 运行：node scripts/fetch-fonts.mjs
 */
import { mkdir, writeFile, readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'assets', 'fonts');
const chromeUA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const latinFiles = [
  ['playfair-display-latin-400.woff2', 'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@5/latin-400-normal.woff2'],
  ['playfair-display-latin-400-italic.woff2', 'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@5/latin-400-italic.woff2'],
  ['playfair-display-latin-500.woff2', 'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@5/latin-500-normal.woff2'],
  ['cormorant-garamond-latin-400.woff2', 'https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@5/latin-400-normal.woff2'],
  ['cormorant-garamond-latin-400-italic.woff2', 'https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@5/latin-400-italic.woff2'],
  ['jost-latin-300.woff2', 'https://cdn.jsdelivr.net/fontsource/fonts/jost@5/latin-300-normal.woff2'],
  ['jost-latin-400.woff2', 'https://cdn.jsdelivr.net/fontsource/fonts/jost@5/latin-400-normal.woff2'],
  ['great-vibes-latin-400.woff2', 'https://cdn.jsdelivr.net/fontsource/fonts/great-vibes@5/latin-400-normal.woff2'],
];

async function download(url, headers = {}) {
  const res = await fetch(url, { headers, redirect: 'follow' });
  if (!res.ok) throw new Error(res.status + ' ' + url);
  return res;
}

async function uniqueHan() {
  const extra = '的了吗呢和是在有我你他她们把被这那就会与及或到从对为以可能要没有还都也更最很';
  const files = ['index.html', 'js/config.js', 'js/main.js'];
  let all = extra;
  for (const file of files) {
    all += await readFile(join(root, file), 'utf8');
  }
  return [...new Set(all.match(/\p{Script=Han}/gu) || [])].sort().join('');
}

async function subsetFromGoogle(family, weight, text, filename) {
  const cssUrl =
    'https://fonts.googleapis.com/css2?family=' +
    encodeURIComponent(family) +
    ':wght@' +
    weight +
    '&display=swap&text=' +
    encodeURIComponent(text);
  const css = await (await download(cssUrl, { 'User-Agent': chromeUA })).text();
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
  if (!match) throw new Error('No woff2 in CSS for ' + family + '\n' + css.slice(0, 400));
  const bin = Buffer.from(await (await download(match[1], { 'User-Agent': chromeUA })).arrayBuffer());
  await writeFile(join(outDir, filename), bin);
  return bin.length;
}

await mkdir(outDir, { recursive: true });

for (const [name, url] of latinFiles) {
  const bin = Buffer.from(await (await download(url)).arrayBuffer());
  if (bin.length < 1000) throw new Error('Tiny file: ' + name + ' ' + bin.length);
  await writeFile(join(outDir, name), bin);
  console.log(name, bin.length);
}

const han = await uniqueHan();
console.log('Han glyphs', [...han].length);

for (const [family, weight, file] of [
  ['Noto Serif SC', '400', 'noto-serif-sc-subset.woff2'],
  ['Noto Sans SC', '300', 'noto-sans-sc-subset.woff2'],
]) {
  const size = await subsetFromGoogle(family, weight, han, file);
  console.log(file, size);
}

const saved = await readdir(outDir);
console.log('fonts/', saved.join(', '));
