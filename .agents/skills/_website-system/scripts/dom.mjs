// Passed directly to Playwright evaluate; keep it free of module closures.
export function inspectDOM({html=null,url}) {
  const live=html===null;
  const doc=live?document:new DOMParser().parseFromString(html,'text/html');
  const all=s=>Array.from(doc.querySelectorAll(s));
  const txt=n=>(n?.textContent??'').replace(/\s+/g,' ').trim();
  const base=doc.querySelector('base[href]')?.getAttribute('href');
  let baseURL=url;try{if(base)baseURL=new URL(base,url).href;}catch{}
  const absolute=value=>{try{return new URL(value,baseURL).href;}catch{return null;}};
  const selector=e=>{
    if(e.id)return '#'+CSS.escape(e.id);
    const parts=[];let n=e;
    while(n&&n!==doc.documentElement&&parts.length<6){const siblings=n.parentElement?Array.from(n.parentElement.children).filter(x=>x.tagName===n.tagName):[];parts.unshift(n.tagName.toLowerCase()+`:nth-of-type(${siblings.indexOf(n)+1})`);n=n.parentElement;}
    return parts.join(' > ');
  };
  const visible=e=>!live||!!(e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden');
  const meta={};for(const e of all('meta[name],meta[property]')){const key=(e.getAttribute('name')||e.getAttribute('property')).toLowerCase();(meta[key]??=[]).push(e.getAttribute('content')??'');}
  const cleaned=(doc.querySelector('main')||doc.body||doc.documentElement).cloneNode(true);
  cleaned.querySelectorAll('script,style,template,noscript').forEach(x=>x.remove());
  const text=txt(cleaned);
  const jsonld=all('script[type="application/ld+json"]').map(e=>{const source=e.textContent;try{return {source,valid_json:true,value:JSON.parse(source)};}catch(err){return {source,valid_json:false,error:err.message};}});
  const headings=all('h1,h2,h3,h4,h5,h6').map(e=>({level:Number(e.tagName[1]),text:txt(e),selector:selector(e),visible:visible(e)}));
  const links=all('a[href]').map(e=>{const href=e.getAttribute('href');const resolved=absolute(href);return {href,url:resolved,text:txt(e)||e.getAttribute('aria-label')||e.querySelector('img')?.getAttribute('alt')||'',rel:e.getAttribute('rel')||'',internal:resolved?new URL(resolved).origin===new URL(url).origin:false,selector:selector(e),visible:visible(e)};});
  const images=all('img').map(e=>({src:absolute(e.getAttribute('src')||''),alt:e.getAttribute('alt'),width:e.getAttribute('width'),height:e.getAttribute('height'),loading:e.getAttribute('loading'),selector:selector(e),broken:live&&e.complete&&e.naturalWidth===0}));
  const inputs=all('input:not([type="hidden"]),textarea,select').map(e=>({selector:selector(e),name:e.getAttribute('name'),type:e.getAttribute('type'),label:txt(e.labels?.[0])||e.getAttribute('aria-label')||((e.getAttribute('aria-labelledby')||'').split(/\s+/).map(id=>txt(doc.getElementById(id))).join(' ').trim())}));
  const result={url,base_url:baseURL,title:txt(doc.querySelector('title')),title_count:all('title').length,lang:doc.documentElement.lang,meta,canonicals:all('link[rel~="canonical"]').map(e=>({href:e.getAttribute('href'),url:absolute(e.getAttribute('href')||'')})),headings,links,images,inputs,jsonld,microdata:all('[itemscope]').map(e=>({type:e.getAttribute('itemtype'),id:e.getAttribute('itemid'),selector:selector(e)})),rdfa:all('[typeof]').map(e=>({type:e.getAttribute('typeof'),selector:selector(e)})),landmarks:Object.fromEntries(['header','nav','main','article','section','aside','footer'].map(tag=>[tag,all(tag).length])),text,text_length:text.length,iframes:all('iframe').map(e=>({src:absolute(e.getAttribute('src')||''),title:e.title})),script_sources:all('script[src]').map(e=>absolute(e.getAttribute('src'))),stylesheets:all('link[rel~="stylesheet"]').map(e=>absolute(e.getAttribute('href'))),hreflang:all('link[hreflang]').map(e=>({lang:e.hreflang,url:absolute(e.getAttribute('href')||'')}))};
  if(!live)return result;
  const props=['color','background-color','font-family','font-size','font-weight','line-height','letter-spacing','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-bottom','gap','border-radius','box-shadow','max-width','display','grid-template-columns','transition-duration'];
  const samples=all('body,h1,h2,h3,p,a,button,main,section,article,header,footer').filter(visible).slice(0,200).map(e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return {selector:selector(e),tag:e.tagName.toLowerCase(),text:txt(e).slice(0,180),rect:{x:r.x,y:r.y+scrollY,width:r.width,height:r.height},styles:Object.fromEntries(props.map(p=>[p,c.getPropertyValue(p)]))};});
  const css_variables={};const root=getComputedStyle(doc.documentElement);for(const p of root)if(p.startsWith('--'))css_variables[p]=root.getPropertyValue(p).trim();
  const sections=all('main > *,body > section,header,footer').filter(visible).slice(0,40).map(e=>({selector:selector(e),tag:e.tagName.toLowerCase(),heading:txt(e.querySelector('h1,h2,h3')),text_excerpt:txt(e).slice(0,220),children:e.children.length,rect:{y:e.getBoundingClientRect().y+scrollY,height:e.getBoundingClientRect().height},layout:getComputedStyle(e).display}));
  const controls=all('a[href],button,input:not([type="hidden"]),select,textarea,[tabindex]').filter(visible).slice(0,300).map(e=>{const r=e.getBoundingClientRect();return {selector:selector(e),tag:e.tagName.toLowerCase(),role:e.getAttribute('role'),name:e.getAttribute('aria-label')||txt(e)||e.querySelector('img')?.alt||'',width:r.width,height:r.height,tabindex:e.getAttribute('tabindex'),expanded:e.getAttribute('aria-expanded')};});
  const overflowing=all('body *').filter(e=>visible(e)&&e.getBoundingClientRect().right>innerWidth+1).slice(0,30).map(selector);
  const nav=performance.getEntriesByType('navigation')[0];
  return {...result,visual:{viewport:{width:innerWidth,height:innerHeight},scroll_width:Math.max(doc.documentElement.scrollWidth,doc.body?.scrollWidth||0),overflowing,css_variables,samples,sections,controls},performance:{navigation:nav?{ttfb_ms:nav.responseStart-nav.requestStart,dom_content_loaded_ms:nav.domContentLoadedEventEnd,load_ms:nav.loadEventEnd}:null,resources:performance.getEntriesByType('resource').map(x=>({url:x.name,type:x.initiatorType,duration_ms:x.duration,transfer_bytes:x.transferSize,decoded_bytes:x.decodedBodySize})),observations:window.__rolodexVitals??{}}};
}
export function observePerformance() {
  window.__rolodexVitals={lcp_ms:null,layout_shifts:[],long_tasks:[]};
  for(const type of ['largest-contentful-paint','layout-shift','longtask'])try{new PerformanceObserver(list=>{for(const e of list.getEntries()){
    if(type==='largest-contentful-paint')window.__rolodexVitals.lcp_ms=e.startTime;
    if(type==='layout-shift'&&!e.hadRecentInput)window.__rolodexVitals.layout_shifts.push({time:e.startTime,value:e.value});
    if(type==='longtask')window.__rolodexVitals.long_tasks.push({time:e.startTime,duration_ms:e.duration});
  }}).observe({type,buffered:true});}catch{}
}
