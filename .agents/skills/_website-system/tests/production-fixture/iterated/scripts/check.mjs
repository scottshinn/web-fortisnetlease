import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './server.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await fs.readFile(path.join(root,'src/content.json'),'utf8'));
const server = createServer();
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const results = [];
try {
  for (const page of data.pages) {
    const response = await fetch(origin+page.path);
    assert.equal(response.status,200);
    const html = await response.text();
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
    assert.ok(html.includes(`<title>${page.title}</title>`));
    assert.ok(html.includes(`rel="canonical" href="${data.site.origin}${page.path}"`));
    assert.ok(html.includes('content="noindex, follow"'));
    assert.ok(html.includes('Fictional demonstration'));
    assert.ok(html.includes('data-event="lead_call"'));
    assert.ok(!html.includes('<form'));
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(JSON.parse(json)['@graph'].length >= 2);
    for (const [,href] of html.matchAll(/href="([^"#]+)"/g)) if (href.startsWith('/')) {
      const linked = await fetch(origin+href);
      assert.equal(linked.status,200,`Broken link ${page.path} -> ${href}`);
    }
    assert.ok(Buffer.byteLength(html)<30000,'HTML budget exceeded');
    results.push({path:page.path,status:response.status,bytes:Buffer.byteLength(html),initialContent:true,canonical:true,schemaJSON:true,internalLinks:true});
  }
  for (const [from,to] of [['/contact','/contact/'],['/services/roof-repair','/services/roof-repair/'],['/index.html','/']]) {
    const response = await fetch(origin+from,{redirect:'manual'});
    assert.equal(response.status,308); assert.equal(response.headers.get('location'),to);
  }
  assert.equal((await fetch(origin+'/not-a-page/')).status,404);
  assert.equal((await fetch(origin+'/src/content.json')).status,404);
  assert.equal((await fetch(origin+'/contact/',{method:'HEAD'})).status,200);
  assert.equal((await fetch(origin+'/contact/',{method:'POST'})).status,405);
  const css = await fs.readFile(path.join(root,'dist/assets/styles.css'));
  const js = await fs.readFile(path.join(root,'dist/assets/main.js'));
  assert.ok(css.length<15000,'CSS budget exceeded'); assert.ok(js.length<3000,'JS budget exceeded');
  const result = {status:'developer checks passed; independent QA pending',routes:results,redirects:true,missingPage404:true,sourceNotServed:true,headAndMethodHandling:true,cssBytes:css.length,jsBytes:js.length};
  await fs.writeFile(path.join(root,'..','developer-checks.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
} finally { server.closeAllConnections(); await new Promise(resolve=>server.close(resolve)); }
