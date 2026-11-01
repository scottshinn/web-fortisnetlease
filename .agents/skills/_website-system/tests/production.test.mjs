import test, {before,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {support,require,readJSON,hash} from '../scripts/core.mjs';
import {inspectDOM} from '../scripts/dom.mjs';

// These snapshots come from the two independently reviewed forward exercises.
// The tests verify observable preservation/build behavior, not skill wording.
const fixture=path.join(support,'tests','production-fixture');
let root,contract,browser;
const builds={};
before(async()=>{
  root=await fs.mkdtemp(path.join(os.tmpdir(),'website-production-'));
  contract=await readJSON(path.join(fixture,'contract.json'));
  const {chromium}=require('playwright');
  const launch={headless:true};if(process.env.PLAYWRIGHT_CHANNEL)launch.channel=process.env.PLAYWRIGHT_CHANNEL;
  browser=await chromium.launch(launch);
  for(const name of ['baseline','iterated']){
    const dir=path.join(root,name);await fs.cp(path.join(fixture,name),dir,{recursive:true});
    const built=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:dir,encoding:'utf8'});
    assert.equal(built.status,0,built.stderr);
    const manifest=await readJSON(path.join(dir,'build-manifest.json'));
    assert.equal(manifest.digest,contract.artifacts[name],`${name} must reproduce its reviewed artifact`);
    const {createServer}=await import(pathToFileURL(path.join(dir,'scripts/server.mjs')).href);
    const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    builds[name]={dir,server,origin:`http://127.0.0.1:${server.address().port}`,data:await readJSON(path.join(dir,'src/content.json'))};
  }
});
after(async()=>{
  if(browser)await browser.close();
  for(const b of Object.values(builds)){b.server.closeAllConnections();await new Promise(resolve=>b.server.close(resolve));}
});

test('iterator preserves the established stack, design, tracking, navigation and old page content',async()=>{
  for(const relative of contract.protected_files){
    const a=await fs.readFile(path.join(builds.baseline.dir,relative));const b=await fs.readFile(path.join(builds.iterated.dir,relative));
    assert.equal(hash(a),hash(b),`Unexpected preserved-file change: ${relative}`);
  }
  assert.deepEqual(builds.iterated.data.site,builds.baseline.data.site);
  assert.deepEqual(builds.iterated.data.navigation,builds.baseline.data.navigation);
  for(const route of contract.unchanged_routes){
    const original=builds.baseline.data.pages.find(p=>p.path===route);
    const current=builds.iterated.data.pages.find(p=>p.path===route);
    // The scoped template change moves the existing repair event placement
    // into content; every prior value and all resulting HTML stay identical.
    assert.deepEqual(current,{...original,...contract.allowed_content_additions[route]});
    const relative=route.slice(1)+'index.html';
    assert.equal(hash(await fs.readFile(path.join(builds.baseline.dir,'dist',relative))),hash(await fs.readFile(path.join(builds.iterated.dir,'dist',relative))),`Existing route changed: ${route}`);
  }
  assert.ok(builds.iterated.data.pages.some(p=>p.path===contract.added_route));
  assert.ok(builds.iterated.data.pages.find(p=>p.path==='/').serviceCards.some(c=>c.path===contract.added_route));
});

test('both production outputs deliver meaningful initial HTML and preserve status/canonical policy',async()=>{
  const page=await browser.newPage();
  try{for(const b of Object.values(builds)){
    for(const route of b.data.pages.map(p=>p.path)){
      const r=await fetch(b.origin+route);assert.equal(r.status,200);
      const html=await r.text();const raw=await page.evaluate(inspectDOM,{html,url:b.origin+route});
      assert.ok(raw.text_length>150);assert.equal(raw.headings.filter(h=>h.level===1).length,1);
      assert.equal(raw.canonicals[0]?.url,new URL(route,contract.canonical_origin).href);
      assert.ok(raw.meta.robots?.some(v=>v.includes('noindex')));
      assert.ok(raw.jsonld.length>0&&raw.jsonld.every(x=>x.valid_json));
      assert.ok(raw.links.some(l=>l.href===contract.phone_href));
    }
    const missing=await fetch(b.origin+'/missing-route/');assert.equal(missing.status,404);
    const redirect=await fetch(b.origin+'/services/roof-repair',{redirect:'manual'});assert.equal(redirect.status,308);assert.equal(redirect.headers.get('location'),'/services/roof-repair/');
    const sitemap=await (await fetch(b.origin+'/sitemap.xml')).text();assert.ok(sitemap.includes('<urlset'));assert.ok(!sitemap.includes('<loc>'),'Noindex demo must stay out of the indexable sitemap');
  }}finally{await page.close();}
});

test('iterator retains responsive navigation, focus behavior and the local conversion hook',async()=>{
  for(const b of Object.values(builds))for(const width of [390,1440]){
    const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    const page=await context.newPage();const external=[];page.on('request',r=>{if(new URL(r.url()).origin!==b.origin)external.push(r.url());});
    try{for(const route of b.data.pages.map(p=>p.path)){
      await page.goto(b.origin+route,{waitUntil:'load'});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${route} overflows at ${width}`);
      const nav=await page.locator('nav[aria-label="Primary"] a').evaluateAll(a=>a.map(x=>new URL(x.href).pathname));
      assert.deepEqual(nav,b.data.navigation.map(n=>n.path));
      await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Skip to content');
      await page.keyboard.press('Enter');await page.waitForFunction(()=>document.activeElement.id==='main');
      await page.evaluate(()=>{
        window.__productionCalls=[];window.addEventListener('lead_call',e=>window.__productionCalls.push(e.detail));
        document.addEventListener('click',e=>{if(e.target.closest?.('a[href^="tel:"]'))e.preventDefault();},{capture:true});
      });
      await page.locator('a[data-event="lead_call"]').first().click();
      const events=await page.evaluate(()=>window.__productionCalls);assert.equal(events.length,1);assert.equal(events[0].path,route);assert.ok(events[0].placement);
    }assert.deepEqual(external,[]);}finally{await context.close();}
  }
});

test('the new route enters the sitemap when publication indexing is intentionally enabled',async()=>{
  const dir=path.join(root,'publication-check');await fs.cp(path.join(fixture,'iterated'),dir,{recursive:true});
  const data=await readJSON(path.join(dir,'src/content.json'));data.site.index=true;await fs.writeFile(path.join(dir,'src/content.json'),JSON.stringify(data));
  const built=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:dir,encoding:'utf8'});assert.equal(built.status,0,built.stderr);
  const sitemap=await fs.readFile(path.join(dir,'dist/sitemap.xml'),'utf8');
  for(const route of data.pages.map(p=>p.path))assert.ok(sitemap.includes(new URL(route,contract.canonical_origin).href));
  const html=await fs.readFile(path.join(dir,'dist',contract.added_route.slice(1),'index.html'),'utf8');
  assert.ok(html.includes('content="index, follow"'));assert.ok(!html.includes('content="noindex, follow"'));
});
