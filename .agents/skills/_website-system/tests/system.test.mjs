import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {startFixture} from './fixture.mjs';
import {captureSite} from '../scripts/capture.mjs';
import {support,readJSON,writeJSON,siteID,normalizeURL,inside,validate,search,verifyRoot,withLock,saveRecord,require} from '../scripts/core.mjs';
import {parseRobots,robotsDecision} from '../scripts/robots.mjs';
import {extractDesign,tokensCSS} from '../scripts/design.mjs';
import {comparePNGs} from '../scripts/visual.mjs';
import {auditCapture} from '../scripts/audit.mjs';

test('URL identity, traversal protection, and explicit HTTP URL requirements',()=>{
  assert.equal(normalizeURL('https://EXAMPLE.com:443/path#section'),'https://example.com/path');
  assert.equal(siteID('https://example.com/a'),siteID('https://example.com/b'));
  assert.notEqual(siteID('http://example.com'),siteID('https://example.com'));
  assert.throws(()=>normalizeURL('file:///etc/passwd'));
  assert.throws(()=>normalizeURL('https://name:password@example.com'));
  assert.throws(()=>inside(os.tmpdir(),'../outside'));
  assert.throws(()=>inside(os.tmpdir(),'C:\\outside'));
});
test('robots handles specific groups, longest match, allow tie, wildcard, and encoded unknowns',()=>{
  const p=parseRobots('User-agent: *\nDisallow: /private\nAllow: /private/open\nDisallow: /*.pdf$\nUser-agent: GPTBot\nDisallow: /\nUser-agent: OAI-SearchBot\nAllow: /\n');
  assert.equal(robotsDecision(p,'https://x.test/private','Googlebot').decision,'disallow');
  assert.equal(robotsDecision(p,'https://x.test/private/open','Googlebot').decision,'allow');
  assert.equal(robotsDecision(p,'https://x.test/a.pdf','Googlebot').decision,'disallow');
  assert.equal(robotsDecision(p,'https://x.test/','GPTBot').decision,'disallow');
  assert.equal(robotsDecision(p,'https://x.test/private','OAI-SearchBot').decision,'allow');
  assert.equal(robotsDecision(p,'https://x.test/%70rivate','Googlebot').decision,'unknown');
  const tie=parseRobots('User-agent: *\nDisallow: /x\nAllow: /x\n');assert.equal(robotsDecision(tie,'https://x.test/x','Bingbot').decision,'allow');
});
test('fixture keyboard skip link moves focus and mobile navigation remains reachable',async()=>{
  const fixture=await startFixture();const {chromium}=require('playwright');const launch={headless:true};if(process.env.PLAYWRIGHT_CHANNEL)launch.channel=process.env.PLAYWRIGHT_CHANNEL;
  const browser=await chromium.launch(launch);
  try{
    const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(fixture.origin);await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Skip to content');
    assert.notEqual(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle),'none');
    await page.keyboard.press('Enter');await page.waitForFunction(()=>document.activeElement.id==='main');
    assert.equal(await page.locator('nav a').count(),2);await page.locator('nav a').first().click();assert.equal(new URL(page.url()).pathname,'/services/');
  }finally{await browser.close();await fixture.close();}
});
test('real Playwright capture, persistence, curation, extraction, audit, and artifact integrity',async()=>{
  const fixture=await startFixture();
  const root=process.env.ROLODEX_TEST_OUTPUT?path.resolve(process.env.ROLODEX_TEST_OUTPUT):await fs.mkdtemp(path.join(os.tmpdir(),'rolodex-test-'));
  await fs.mkdir(root,{recursive:true});
  try {
    const channel=process.env.PLAYWRIGHT_CHANNEL||undefined;
    const first=await captureSite({url:fixture.origin+'/',rolodex:root,channel,checkLinks:2,settleMs:100});
    const dir=path.dirname(inside(root,first.manifest));
    const data=await readJSON(path.join(dir,'capture-data.json'));
    assert.equal(data.views.length,3);
    assert.match(data.raw.text,/Room to grow/);
    assert.equal(data.views[2].dom.visual.viewport.width,390);
    assert.equal(data.views[2].dom.visual.scroll_width,390);
    assert.ok(data.views.every(v=>v.dom.headings.some(h=>h.level===1)));
    assert.ok(data.controls.some(c=>c.xml?.root==='sitemapindex'));
    assert.ok(data.controls.some(c=>c.xml?.root==='urlset'));
    assert.ok(data.controls.some(c=>c.kind==='llms'&&c.markdown_links.length));
    assert.ok(data.link_checks.length>0);
    const report=await readJSON(path.join(dir,'audit.json'));
    assert.equal(report.summary.errors,0);
    assert.equal(report.summary.warnings,0);
    assert.equal(report.crawler_policy.agents.find(x=>x.agent==='GPTBot').decision,'disallow');
    assert.equal(report.crawler_policy.agents.find(x=>x.agent==='OAI-SearchBot').decision,'allow');
    const unavailable=structuredClone(data);unavailable.controls.find(c=>c.kind==='robots').status=503;assert.equal(auditCapture(unavailable).crawler_policy.status,'unknown');
    const brokenSitemap=structuredClone(data);const sitemap=brokenSitemap.controls.find(c=>c.kind==='sitemap');sitemap.looks_html=true;delete sitemap.xml;assert.ok(auditCapture(brokenSitemap).findings.some(f=>f.code==='sitemap-invalid'));
    const mobileOnly=structuredClone(data);mobileOnly.views[2].raw={...mobileOnly.views[2].raw,text_length:0,headings:[]};assert.ok(auditCapture(mobileOnly).findings.some(f=>f.code==='render-dependent-content'&&f.message.startsWith('mobile:')));
    const record=await readJSON(inside(root,`records/${first.site_id}.json`));
    record.classification={industry:['landscape-design'],style:['warm','editorial'],technology:['static-html'],components:['split-hero','service-process']};
    record.design_notes.push({text:'Fictional local fixture. Warm paper, forest ink, serif display, split hero and asymmetric process section.',basis:'observed',confidence:'high',evidence:[{source:path.posix.dirname(first.manifest)+'/desktop.png'}]});
    await withLock(root,()=>saveRecord(root,record));
    assert.equal((await search(root,{industry:'landscape-design',style:'warm',q:'serif'})).length,1);
    assert.equal((await search(root,{industry:'dentistry'})).length,0);
    const design=await extractDesign(root,first.site_id);
    await validate(design,'design-system');assert.ok(Object.keys(design.tokens.color).length);assert.ok(design.patterns.length);
    assert.throws(()=>tokensCSS(design));
    await writeJSON(path.join(root,'design-draft.json'),design);
    const patch={classification:record.classification,design_notes:record.design_notes};await writeJSON(path.join(root,'curation.json'),patch);
    for(let i=0;i<2;i++){const c=spawnSync(process.execPath,[path.join(support,'scripts/rolodex.mjs'),'curate','--rolodex',root,'--site',first.site_id,'--file',path.join(root,'curation.json')],{encoding:'utf8'});assert.equal(c.status,0,c.stderr);}
    const curated=await readJSON(inside(root,`records/${first.site_id}.json`));assert.equal(curated.design_notes.length,1);
    const second=await captureSite({url:fixture.origin+'/',rolodex:root,channel,settleMs:100});
    const after=await readJSON(inside(root,`records/${first.site_id}.json`));
    assert.equal(after.captures.length,2);assert.deepEqual(after.classification,curated.classification);assert.equal(after.design_notes.length,1);
    const duplicate=await comparePNGs(path.join(dir,'desktop.png'),path.join(dir,'desktop.png'),path.join(root,'identical-diff.png'));
    assert.equal(duplicate.ratio,0);
    const {PNG}=require('pngjs');const png=PNG.sync.read(await fs.readFile(path.join(dir,'desktop.png')));png.data.fill(255);await fs.writeFile(path.join(root,'white.png'),PNG.sync.write(png));
    assert.equal((await comparePNGs(path.join(dir,'desktop.png'),path.join(root,'white.png'),path.join(root,'changed-diff.png'))).status,'review');
    assert.equal((await comparePNGs(path.join(dir,'desktop.png'),path.join(dir,'mobile.png'),path.join(root,'size-diff.png'))).status,'dimension-mismatch');
    const bad=await captureSite({url:fixture.origin+'/bad',rolodex:root,channel,checkLinks:2,settleMs:100});
    const badDir=path.dirname(inside(root,bad.manifest));const badReport=await readJSON(path.join(badDir,'audit.json'));const codes=badReport.findings.map(x=>x.code);
    for(const code of ['jsonld-parse','meta-noindex','header-noindex','render-dependent-content','canonical-render-change','horizontal-overflow','input-label','broken-image','internal-link-http'])assert.ok(codes.includes(code),`missing expected finding ${code}`);
    const gate=spawnSync(process.execPath,[path.join(support,'scripts/rolodex.mjs'),'audit','--file',path.join(badDir,'capture-data.json'),'--fail-on','error'],{encoding:'utf8'});assert.equal(gate.status,2);
    const verify=await verifyRoot(root);assert.equal(verify.records,1);assert.ok(verify.verified_artifacts>50);
    const invalid=structuredClone(after);invalid.schema_version=999;await assert.rejects(()=>validate(invalid,'site'));
    invalid.schema_version=1;invalid.captures[0].path='../escape';await assert.rejects(()=>validate(invalid,'site'));
    await withLock(root,()=>assert.rejects(()=>withLock(root,async()=>{}),/locked/));
    const evidence=path.join(dir,'raw.html');const original=await fs.readFile(evidence);await fs.appendFile(evidence,'tampered');await assert.rejects(()=>verifyRoot(root),/hash mismatch/);await fs.writeFile(evidence,original);await verifyRoot(root);
    await writeJSON(path.join(root,'test-summary.json'),{fixture:fixture.origin,site_id:first.site_id,good:first,bad,repeat:second,checks:verify,status:'passed'});
    console.log(`Evidence saved: ${root}`);
  } finally {await fixture.close();}
});
