import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { renderPage, render404 } from '../src/templates.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(root, 'dist');
const data = JSON.parse(await fs.readFile(path.join(root, 'src/content.json'), 'utf8'));
if (new URL(data.site.origin).origin !== data.site.origin) throw new Error('Origin must have no trailing slash or path.');
const routes = new Set(data.pages.map(page => page.path));
if (routes.size !== data.pages.length) throw new Error('Duplicate page path.');
for (const page of data.pages) {
  if (!/^\/(?:[a-z0-9-]+\/)*$/.test(page.path)) throw new Error(`Unsafe page path: ${page.path}`);
}
// Only replace this project's generated dist directory; never remove a computed external path.
if (output !== path.join(root, 'dist') || path.dirname(output) !== root) throw new Error('Unsafe build output path.');
await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(path.join(output, 'assets'), { recursive: true });
const manifest = {};
for (const page of data.pages) {
  const relative = `${page.path.slice(1)}index.html`;
  const target = path.join(output, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, renderPage(data, page));
  manifest[page.path] = relative;
}
for (const filename of ['styles.css', 'main.js', 'favicon.svg']) {
  await fs.copyFile(path.join(root, 'src/assets', filename), path.join(output, 'assets', filename));
  manifest[`/assets/${filename}`] = `assets/${filename}`;
}
await fs.writeFile(path.join(output, '404.html'), render404(data));
await fs.writeFile(path.join(output, 'robots.txt'), 'User-agent: *\nAllow: /\n' + (data.site.index ? `Sitemap: ${data.site.origin}/sitemap.xml\n` : '# Fictional demonstration: all pages carry noindex.\n'));
const urls = data.site.index ? data.pages.map(page => `  <url><loc>${new URL(page.path, data.site.origin).href}</loc></url>`).join('\n') : '';
await fs.writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
manifest['/robots.txt'] = 'robots.txt';
manifest['/sitemap.xml'] = 'sitemap.xml';
await fs.writeFile(path.join(output, 'routes.json'), JSON.stringify(manifest, null, 2) + '\n');
const files = [...Object.values(manifest), '404.html', 'routes.json'].sort();
const hashes = {};
for (const file of files) hashes[file] = createHash('sha256').update(await fs.readFile(path.join(output,file))).digest('hex');
const digest = createHash('sha256').update(JSON.stringify(hashes)).digest('hex');
await fs.writeFile(path.join(root, 'build-manifest.json'), JSON.stringify({ algorithm: 'sha256', digest, files: hashes }, null, 2) + '\n');
console.log(`Built ${data.pages.length} pages in ${output}\nArtifact SHA-256: ${digest}`);
