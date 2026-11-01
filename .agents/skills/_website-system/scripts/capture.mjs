import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {require,hash,stamp,normalizeURL,siteID,writeJSON,readJSON,inside,withLock,newRecord,saveRecord,validate} from './core.mjs';
import {inspectDOM,observePerformance} from './dom.mjs';
import {parseRobots} from './robots.mjs';
import {auditCapture,auditMarkdown} from './audit.mjs';
const viewports=[{name:'desktop',width:1440,height:1000},{name:'tablet',width:768,height:1024},{name:'mobile',width:390,height:844}];
function publicHeaders(h){const keys=['content-type','content-language','content-length','content-encoding','cache-control','vary','link','x-robots-tag','content-signal','server','x-powered-by','location'];return Object.fromEntries(Object.entries(h).filter(([k])=>keys.includes(k.toLowerCase())));}
async function redirects(response){const chain=[];let request=response.request();while(request){const r=await request.response();chain.unshift({url:request.url(),status:r?.status()??null});request=request.redirectedFrom();}return chain;}
function decode(bytes,type){const charset=type?.match(/charset\s*=\s*["']?([^;\s"']+)/i)?.[1]||'utf-8';try{return {html:new TextDecoder(charset).decode(bytes),charset};}catch{return {html:bytes.toString('utf8'),charset:'utf-8-fallback'};}}
async function controlFile(api,page,url,kind,relative,dir) {
  let response;
  try {
    response=await api.get(url,{timeout:10000,maxRedirects:5});
    const bytes=await response.body();
    const headers=publicHeaders(response.headers());
    if(bytes.length>2_000_000)throw Error('Control document exceeds 2 MB limit.');
    const text=decode(bytes,headers['content-type']).html;
    const looks_html=/^\s*(?:<!doctype\s+html|<html|<head|<body)/i.test(text);
    await fs.writeFile(path.join(dir,relative),bytes);
    const result={kind,url,final_url:response.url(),status:response.status(),headers,path:relative,text,looks_html};
    if(kind==='sitemap'&&response.ok()&&!looks_html)result.xml=await page.evaluate(xml=>{
      const d=new DOMParser().parseFromString(xml,'application/xml');const root=d.documentElement;
      return {valid:!d.querySelector('parsererror'),root:root.localName,namespace:root.namespaceURI,locations:Array.from(d.getElementsByTagNameNS('*','loc')).slice(0,1000).map(e=>e.textContent.trim()),location_count:d.getElementsByTagNameNS('*','loc').length};
    },text);
    if(kind==='llms')result.markdown_links=[...text.matchAll(/\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/g)].map(m=>m[1]);
    return result;
  } catch(e){return {kind,url,final_url:null,status:null,error:e.message,path:null,text:'',looks_html:false};}
  finally {if(response)await response.dispose();}
}
export async function captureSite(options) {
  const url=normalizeURL(options.url),root=path.resolve(options.rolodex);
  const id=siteID(url),captureID=stamp().replace(/[:.]/g,'-')+'-'+crypto.randomUUID().slice(0,8);
  const relative=`evidence/${id}/${captureID}`,dir=inside(root,relative);
  const {chromium}=require('playwright');
  const launch={headless:true};if(options.channel||process.env.PLAYWRIGHT_CHANNEL)launch.channel=options.channel||process.env.PLAYWRIGHT_CHANNEL;
  const browser=await chromium.launch(launch);
  await fs.mkdir(dir,{recursive:true});
  let context;
  try {
    context=await browser.newContext({viewport:viewports[0],reducedMotion:'reduce',serviceWorkers:'block',locale:'en-US',timezoneId:'UTC',acceptDownloads:false});
    await context.addInitScript(observePerformance);
    const views=[];let raw,http,finalURL;
    const errors=[];
    for(const viewport of viewports) {
      const page=await context.newPage();await page.setViewportSize({width:viewport.width,height:viewport.height});
      page.setDefaultTimeout(10000);
      page.on('pageerror',err=>{if(errors.length<50)errors.push({view:viewport.name,message:err.message});});
      page.on('dialog',dialog=>dialog.dismiss());
      const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
      if(!response)throw Error('No main-document response.');
      const headers=publicHeaders(await response.allHeaders());
      if(!/text\/html|application\/xhtml\+xml/i.test(headers['content-type']||''))throw Error('Main response is not HTML.');
      const bytes=await response.body();if(bytes.length>10_000_000)throw Error('HTML exceeds 10 MB capture limit.');
      const decoded=decode(bytes,headers['content-type']);
      const viewRaw=await page.evaluate(inspectDOM,{html:decoded.html,url:response.url()});
      await fs.writeFile(path.join(dir,`${viewport.name}.raw.body`),bytes);
      await fs.writeFile(path.join(dir,`${viewport.name}.raw.html`),decoded.html);
      await writeJSON(path.join(dir,`${viewport.name}.raw.extract.json`),viewRaw);
      const viewHTTP={status:response.status(),url:response.url(),headers,redirects:await redirects(response),charset:decoded.charset,body_sha256:hash(bytes),body_bytes:bytes.length};
      await writeJSON(path.join(dir,`${viewport.name}.http.json`),viewHTTP);
      if(!raw){raw=viewRaw;http=viewHTTP;finalURL=response.url();await fs.writeFile(path.join(dir,'raw.html'),decoded.html);await writeJSON(path.join(dir,'raw.extract.json'),raw);await writeJSON(path.join(dir,'http.json'),http);}
      const readiness={selector:options.waitFor??null,selector_matched:null,fonts_ready:false,scroll_steps:0,settle_ms:options.settleMs??500};
      if(options.waitFor){try{await page.locator(options.waitFor).first().waitFor({state:'visible',timeout:10000});readiness.selector_matched=true;}catch{readiness.selector_matched=false;}}
      readiness.fonts_ready=await page.evaluate(()=>Promise.race([document.fonts.ready.then(()=>true),new Promise(r=>setTimeout(()=>r(false),4000))]));
      for(let i=0;i<12;i++){const stop=await page.evaluate(()=>{const end=scrollY+innerHeight>=document.documentElement.scrollHeight-2;window.scrollBy(0,innerHeight*.85);return end;});readiness.scroll_steps++;if(stop)break;await page.waitForTimeout(100);}
      await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(readiness.settle_ms);
      const dom=await page.evaluate(inspectDOM,{url:page.url()});
      const height=await page.evaluate(()=>document.documentElement.scrollHeight);
      const fullPage=height<=20000;
      await page.screenshot({path:path.join(dir,`${viewport.name}.png`),fullPage,animations:'disabled'});
      await fs.writeFile(path.join(dir,`${viewport.name}.rendered.html`),await page.content());
      await writeJSON(path.join(dir,`${viewport.name}.extract.json`),dom);
      const sectionShots=[];
      if(viewport.name==='desktop')for(const [i,section] of dom.visual.sections.slice(0,8).entries()){
        const name=`section-${String(i+1).padStart(2,'0')}.png`;
        try{await page.locator(section.selector).first().screenshot({path:path.join(dir,name),animations:'disabled',timeout:5000});sectionShots.push({selector:section.selector,path:name});}catch(e){sectionShots.push({selector:section.selector,path:null,error:e.message.split('\n')[0]});}
      }
      views.push({name:viewport.name,viewport:{width:viewport.width,height:viewport.height},raw:viewRaw,http:viewHTTP,dom,readiness,screenshot:`${viewport.name}.png`,full_page:fullPage,section_screenshots:sectionShots});
      await page.close();
    }
    const parserPage=await context.newPage();
    const origin=new URL(finalURL).origin;
    const controls=[];
    const robots=await controlFile(context.request,parserPage,`${origin}/robots.txt`,'robots','robots.txt',dir);controls.push(robots);
    const sitemapQueue=[`${origin}/sitemap.xml`,...(robots.status===200&&!robots.looks_html?parseRobots(robots.text).sitemaps:[])];
    const visited=new Set();const skipped=[];
    while(sitemapQueue.length&&visited.size<8){
      const item=sitemapQueue.shift();let target;try{target=normalizeURL(item);}catch{skipped.push({url:item,reason:'invalid URL'});continue;}
      if(new URL(target).origin!==origin){skipped.push({url:target,reason:'off-origin sitemap requires explicit scope'});continue;}
      if(visited.has(target))continue;visited.add(target);
      const result=await controlFile(context.request,parserPage,target,'sitemap',`sitemap-${visited.size}.xml`,dir);controls.push(result);
      if(result.xml?.valid&&result.xml.root==='sitemapindex')sitemapQueue.push(...result.xml.locations);
    }
    if(sitemapQueue.length)skipped.push({reason:'sitemap file limit reached',remaining:sitemapQueue.length});
    controls.push(await controlFile(context.request,parserPage,`${origin}/llms.txt`,'llms','llms.txt',dir));
    const link_checks=[];
    const limit=options.checkLinks??0;
    const urls=[...new Set(views[0].dom.links.filter(l=>l.internal&&l.url&&/^https?:/.test(l.url)).map(l=>normalizeURL(l.url)))].filter(x=>new URL(x).origin===origin&&x!==finalURL);
    for(const target of urls.slice(0,limit)){
      let r;try{r=await context.request.get(target,{timeout:10000,maxRedirects:5});link_checks.push({url:target,final_url:r.url(),status:r.status()});}catch(e){link_checks.push({url:target,status:null,error:e.message});}finally{if(r)await r.dispose();}
    }
    await parserPage.close();
    const result={schema_version:1,capture_id:captureID,site_id:id,requested_url:url,final_url:finalURL,captured_at:stamp(),environment:{browser:browser.version(),playwright:require('playwright/package.json').version,user_agent:await context.newPage().then(async p=>{const ua=await p.evaluate(()=>navigator.userAgent);await p.close();return ua;}),locale:'en-US',timezone:'UTC',reduced_motion:'reduce',anonymous:true,device_emulation:'Viewport resizing only; no mobile user agent or touch emulation.',measurement:'Unthrottled local lab run.'},http,raw,views,controls,link_checks,errors,coverage:{sitemap_files:visited.size,sitemap_skipped:skipped,internal_links_discovered:urls.length,internal_links_checked:link_checks.length,page_limit:1,closed_shadow_dom:'not inspected',iframes:'inventoried, not traversed',readiness:'bounded font/selector/scroll wait; dynamic content may remain incomplete'}};
    const report=auditCapture(result);
    const signatures=[['nextjs',/\/_next\/|__NEXT_DATA__/],['astro',/\/_astro\//],['wordpress',/wp-content\/|wp-includes\//],['shopify',/cdn\.shopify\.com|Shopify\.theme/],['nuxt',/\/_nuxt\/|__NUXT__/]];
    const signatureText=raw.script_sources.concat(raw.stylesheets).join('\n')+JSON.stringify(raw.meta);
    result.technology_hints=signatures.filter(([,pattern])=>pattern.test(signatureText)).map(([name])=>({name,confidence:'medium',basis:'Public asset URL or metadata signature; confirm before tagging as verified technology.'}));
    await writeJSON(path.join(dir,'controls.json'),controls);
    await writeJSON(path.join(dir,'link-checks.json'),link_checks);
    await writeJSON(path.join(dir,'capture-data.json'),result);
    await writeJSON(path.join(dir,'audit.json'),report);
    await fs.writeFile(path.join(dir,'audit.md'),auditMarkdown(report));
    const artifacts=[];
    for(const name of (await fs.readdir(dir)).sort()){const bytes=await fs.readFile(path.join(dir,name));artifacts.push({path:name,sha256:hash(bytes),bytes:bytes.length});}
    const manifest={schema_version:1,id:captureID,site_id:id,requested_url:url,final_url:finalURL,captured_at:result.captured_at,artifacts};
    await validate(manifest,'capture');
    await writeJSON(path.join(dir,'manifest.json'),manifest);
    await withLock(root,async()=>{
      let record;try{record=await readJSON(inside(root,`records/${id}.json`));}catch(e){if(e.code!=='ENOENT')throw e;record=newRecord(url);}
      record.captures.push({id:captureID,url:finalURL,captured_at:result.captured_at,path:`${relative}/manifest.json`,quality:report.summary.quality});
      const latest=new Map();for(const c of record.captures)latest.set(c.url,c);
      record.seo_quality=[...latest.values()].some(c=>c.quality==='high-risk')?'high-risk':[...latest.values()].some(c=>c.quality==='needs-review')?'needs-review':'no-major-automated-findings';
      await saveRecord(root,record);
    });
    return {site_id:id,capture_id:captureID,manifest:`${relative}/manifest.json`,audit:`${relative}/audit.md`,summary:report.summary};
  } catch(e){await writeJSON(path.join(dir,'failure.json'),{failed_at:stamp(),requested_url:url,error:e.message});throw e;}
  finally {if(context)await context.close();await browser.close();}
}
