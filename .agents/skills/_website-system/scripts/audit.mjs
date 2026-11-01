import {parseRobots,robotsDecision} from './robots.mjs';
export function auditCapture(capture) {
  const findings=[];const {raw,views,http,controls}=capture;
  const add=(code,severity,category,message,evidence,action)=>findings.push({code,severity,category,message,evidence,action});
  if(http.status>=400)add('http-error','error','crawl',`Document returns ${http.status}`,'http.json','Serve the intended status and content.');
  const comparisons=[];
  for(const [label,d] of [['raw',raw],...views.slice(1).map(v=>[`${v.name}-raw`,v.raw]),...views.map(v=>[v.name,v.dom])].filter(([,d])=>d)) {
    const source=label==='raw'?'raw.extract.json':`${label.replace('-raw','.raw')}.extract.json`;
    if(!d.title)add('title-missing','warning','metadata',`${label}: title missing`,source,'Write a distinct title for this intent.');
    if(d.title_count>1)add('title-duplicate','warning','metadata',`${label}: multiple title elements`,source,'Emit one title.');
    if(!(d.meta.description??[]).some(Boolean))add('description-missing','warning','metadata',`${label}: description missing`,source,'Add an accurate page summary.');
    if((d.meta.description??[]).length>1)add('description-duplicate','warning','metadata',`${label}: duplicate descriptions`,source,'Emit one description.');
    if(d.canonicals.length!==1)add('canonical-count','warning','metadata',`${label}: ${d.canonicals.length} canonicals`,source,'Use one canonical for this indexable HTML page.');
    for(const c of d.canonicals)if(!c.href||!/^https?:\/\//i.test(c.href))add('canonical-relative','warning','metadata',`${label}: non-absolute canonical`,source,'Use an absolute HTTP(S) canonical.');
    const directives=Object.entries(d.meta).filter(([k])=>k==='robots'||/bot|google|bing/i.test(k));
    if(directives.some(([,values])=>values.some(v=>/\b(noindex|none)\b/i.test(v))))add('meta-noindex','warning','indexing',`${label}: indexing restriction present`,source,'Compare against intended indexing policy; retain intentional exclusions.');
    const h1=d.headings.filter(h=>h.level===1);
    if(h1.length!==1)add('h1-count','warning','semantics',`${label}: ${h1.length} H1 elements`,source,'Review the page outline; prefer a clear primary heading.');
    if(d.headings.some((h,i)=>i>0&&h.level>d.headings[i-1].level+1))add('heading-skip','warning','semantics',`${label}: skipped heading level`,source,'Correct the semantic outline without using headings for size alone.');
    if(d.landmarks.main!==1)add('main-count','warning','accessibility',`${label}: ${d.landmarks.main} main landmarks`,source,'Expose one active main content landmark.');
    if(!d.lang)add('lang-missing','warning','accessibility',`${label}: language missing`,source,'Set the document language.');
    if(d.images.some(x=>x.alt===null))add('image-alt','warning','accessibility',`${label}: images without alt attributes`,source,'Use meaningful alt or empty alt for decorative images.');
    if(d.inputs.some(x=>!x.label))add('input-label','warning','accessibility',`${label}: form controls without detected labels`,source,'Provide a programmatic name; verify the accessibility tree.');
    if(d.images.some(x=>!x.width||!x.height))add('image-dimensions','info','performance',`${label}: images lack HTML dimensions`,source,'Check whether CSS aspect-ratio already reserves space before changing markup.');
    if(d.links.some(x=>x.internal&&!x.text))add('link-name','warning','links',`${label}: internal links have no detected name`,source,'Check accessible link names and describe the destination.');
    for(const key of ['og:title','og:type','og:url','og:image'])if(!(d.meta[key]??[]).some(Boolean))add('og-missing','info','social',`${label}: ${key} missing`,source,'Complete social sharing metadata if the page is shareable.');
    for(const key of ['og:image','og:url','twitter:image'])for(const value of d.meta[key]??[])if(!/^https?:\/\//i.test(value))add('social-url-relative','warning','social',`${label}: ${key} is not absolute`,source,'Use an absolute public URL.');
    for(const [i,block] of d.jsonld.entries()) {
      if(!block.valid_json){add('jsonld-parse','error','structured-data',`${label}: invalid JSON-LD block ${i+1}`,source,'Fix JSON syntax and rerun capture.');continue;}
      const top=Array.isArray(block.value)?block.value:[block.value];
      for(const node of top)if(!node||typeof node!=='object'||!('@context' in node))add('jsonld-context','warning','structured-data',`${label}: JSON-LD context needs review`,source,'Check context, graph expansion and intended vocabulary.');
      const walk=x=>{if(!x||typeof x!=='object')return;if(!Array.isArray(x)&&x['@type']&&!x['@id']&&!x.name&&!x.itemListElement&&!x.mainEntity&&!x.breadcrumb&&!x['@value'])add('schema-shape','info','structured-data',`${label}: typed node needs property review`,source,'Validate type-specific properties with the appropriate validator.');for(const v of Object.values(x))if(typeof v==='object')walk(v);};walk(block.value);
    }
    if(!label.endsWith('raw')) {
      const viewRaw=views.find(v=>v.name===label)?.raw??raw;
      const delta={view:label,raw_text_length:viewRaw.text_length,rendered_text_length:d.text_length,title_changed:viewRaw.title!==d.title,canonical_changed:JSON.stringify(viewRaw.canonicals)!==JSON.stringify(d.canonicals),h1_changed:JSON.stringify(viewRaw.headings.filter(x=>x.level===1).map(x=>x.text))!==JSON.stringify(h1.map(x=>x.text)),jsonld_changed:JSON.stringify(viewRaw.jsonld.map(x=>x.source))!==JSON.stringify(d.jsonld.map(x=>x.source)),internal_links_added:d.links.filter(x=>x.internal&&!viewRaw.links.some(a=>a.url===x.url)).map(x=>x.url)};
      if(viewRaw&&JSON.stringify(viewRaw)!==JSON.stringify(raw))delta.viewport_raw_differs=true;
      comparisons.push(delta);
      if((viewRaw.text_length<80&&d.text_length>150)||(!viewRaw.headings.some(x=>x.level===1)&&h1.length))add('render-dependent-content','warning','rendering',`${label}: important content appears only after JavaScript`,source,'Deliver key headings, copy and navigation in the initial HTML where crawler access matters.');
      if(delta.canonical_changed)add('canonical-render-change','warning','rendering',`${label}: canonical changes after render`,source,'Align initial HTML and hydrated metadata.');
      if(d.visual.scroll_width>d.visual.viewport.width+1)add('horizontal-overflow','warning','visual',`${label}: horizontal overflow`,source,'Inspect the recorded overflowing selectors and fix unintended overflow.');
      if(d.images.some(x=>x.broken))add('broken-image','warning','visual',`${label}: broken images`,source,'Repair image URLs or loading behavior.');
      if(d.visual.controls.some(x=>x.tag==='button'&&!x.name))add('button-name','warning','accessibility',`${label}: buttons without detected names`,source,'Check the accessible name before adding labels.');
      const perf=d.performance;
      if(perf.observations.lcp_ms>2500)add('lab-lcp-risk','warning','performance',`${label}: observed LCP exceeds 2500 ms`,source,'Investigate the largest content element; measure under defined conditions and compare field data.');
      if(perf.observations.long_tasks?.length)add('long-task-risk','info','performance',`${label}: long tasks observed`,source,'Profile main-thread work and test real interactions.');
      if(perf.resources.some(x=>x.decoded_bytes>500000&&x.type==='script'))add('large-script','info','performance',`${label}: a script exceeds 500 KB decoded`,source,'Review JavaScript delivery and hydration costs.');
    }
  }
  if(/\b(noindex|none)\b/i.test(http.headers['x-robots-tag']||''))add('header-noindex','warning','indexing','X-Robots-Tag restricts indexing','http.json','Review the agent scope and intended indexing policy.');
  const robots=controls.find(x=>x.kind==='robots');
  let crawler_policy={status:'unknown',agents:[]};
  if(robots?.status===200&&!robots.looks_html){const parsed=parseRobots(robots.text);crawler_policy={status:'observed',parsed,agents:['Googlebot','Bingbot','OAI-SearchBot','GPTBot','ChatGPT-User','Google-Extended','PerplexityBot'].map(agent=>robotsDecision(parsed,capture.final_url,agent))};}
  else if(robots?.status===404||robots?.status===410)crawler_policy={status:'absent',agents:[]};
  else add('robots-unavailable','warning','crawl','robots.txt could not be reliably interpreted','controls.json','Check HTTP status, redirects, content type and crawler-specific failure handling.');
  for(const agent of crawler_policy.agents)if(agent.decision==='disallow')add('crawler-restriction','info','agents',`${agent.agent}: disallow rule matches this URL`,'controls.json','Compare this rule with the owner’s intended policy; do not automatically enable crawlers.');
  const httpCanonicals=[...(http.headers.link||'').matchAll(/<([^>]+)>\s*;\s*rel\s*=\s*["']?canonical["']?/gi)].map(x=>x[1]);
  if(httpCanonicals.length&&(!raw.canonicals.length||httpCanonicals.some(x=>x!==raw.canonicals[0]?.url)))add('canonical-http-conflict','warning','metadata','HTTP Link canonical and HTML canonical differ','http.json','Align canonical declarations; review the full Link header syntax.');
  for(const c of controls) {
    if(c.kind==='sitemap'&&c.status===200&&(!c.xml?.valid||!['urlset','sitemapindex'].includes(c.xml?.root)))add('sitemap-invalid','warning','crawl',`Invalid sitemap: ${c.url}`,'controls.json','Serve a valid sitemap XML document, not an HTML fallback.');
    if(c.kind==='llms')add('llms-inventory','info','agents',`llms.txt: ${c.status===200&&!c.looks_html?'present':'absent or unavailable'}`,'controls.json','Treat this as optional agent-facing documentation; review content and links, not as an indexing control.');
    if(c.kind==='sitemap'&&c.status!==200)add('sitemap-unavailable','info','crawl',`Sitemap unavailable: ${c.url}`,'controls.json','Check the intended sitemap location; a missing default path is not proof that no sitemap exists.');
    if(c.xml?.root==='urlset'&&c.xml.locations.includes(capture.final_url)&&findings.some(f=>['meta-noindex','header-noindex'].includes(f.code)))add('sitemap-noindex-conflict','warning','indexing','Captured URL is both sitemap-listed and noindex','controls.json','Align sitemap inclusion and intended indexing policy.');
  }
  for(const check of capture.link_checks??[])if(check.status>=400)add('internal-link-http','warning','links',`Internal link returns ${check.status}: ${check.url}`,'link-checks.json','Fix the link or destination; confirm expected authentication behavior.');
  const errors=findings.filter(x=>x.severity==='error').length,warnings=findings.filter(x=>x.severity==='warning').length;
  return {schema_version:1,kind:'technical-audit',url:capture.final_url,findings,comparisons,crawler_policy,summary:{errors,warnings,info:findings.length-errors-warnings,quality:errors?'high-risk':warnings?'needs-review':'no-major-automated-findings'},coverage:{scope:'Captured URLs and explicitly bounded internal link checks only.',schema:'JSON syntax and shallow shape checks; not full Schema.org validation or rich-result eligibility.',accessibility:'Heuristic DOM checks; not WCAG conformance.',performance:'Unthrottled local laboratory observations; not field Core Web Vitals. No INP measurement.',rendering:'Initial HTML vs rendered DOM comparison cannot distinguish SSR from SSG or prove indexability.',manual_remaining:['Schema.org vocabulary and type-specific requirements','Structured data matches visible, verified facts','Canonical target and HTTP Link header consistency','Soft 404 and index-intent decisions','Agent-specific directives and crawler access','Keyboard, screen reader, contrast, zoom and interaction states','Field CWV and representative interaction performance']}};
}
export function auditMarkdown(report) {
  return `# Technical audit\n\nURL: ${report.url}\n\nAutomated quality: **${report.summary.quality}**. ${report.summary.errors} errors, ${report.summary.warnings} warnings.\n\n`+
    report.findings.map(f=>`- **${f.severity.toUpperCase()} · ${f.code}** — ${f.message}\n  Evidence: ${f.evidence}. Action: ${f.action}`).join('\n')+
    '\n\n## Coverage and remaining review\n\n'+Object.entries(report.coverage).filter(([,v])=>typeof v==='string').map(([k,v])=>`- ${k}: ${v}`).join('\n')+'\n'+report.coverage.manual_remaining.map(x=>`- Manual: ${x}`).join('\n')+'\n';
}
