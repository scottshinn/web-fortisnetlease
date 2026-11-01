export const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const e = escapeHTML;
const arrow = '<span aria-hidden="true">↗</span>';
const areaText = site => `${site.serviceAreas.join(' and ')}, ${site.state}`;
const phone = (site, placement, label = `Call ${site.phoneDisplay}`, className = 'button') => `<a class="${e(className)}" href="${e(site.phoneHref)}" data-event="lead_call" data-placement="${e(placement)}">${e(label)} ${arrow}</a>`;

function roofDrawing() {
  return `<div class="roof-visual" aria-hidden="true"><span class="drawing-label">NORTHLINE / RESIDENTIAL</span><svg viewBox="0 0 500 420" focusable="false"><path class="drawing-grid" d="M40 88H460M40 166H460M40 244H460M40 322H460M100 40V376M200 40V376M300 40V376M400 40V376"/><path class="drawing-wall" d="M120 219L251 120L382 219V340H120Z"/><path class="drawing-face" d="M251 120L397 225L365 247L251 165L137 247L105 225Z"/><path class="drawing-edge" d="M91 228L251 106L411 228M151 239V340M351 239V340M222 340V267H280V340M188 181L317 271M212 161L342 251M236 142L365 230"/><path class="drawing-base" d="M78 341H424"/><rect class="drawing-window" x="168" y="261" width="30" height="40"/><rect class="drawing-window" x="305" y="261" width="30" height="40"/><path class="drawing-dimension" d="M105 372H397M105 363V381M397 363V381"/></svg><div class="drawing-caption"><span>Care begins overhead.</span><span class="drawing-mark">N / R</span></div></div>`;
}

function header(data, page) {
  return `<a class="skip-link" href="#main">Skip to content</a><div class="demo-bar"><div class="container">${e(data.site.demoLabel)}</div></div><header class="site-header"><div class="container header-inner"><a class="brand" href="/" aria-label="Northline Roofing home"><svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true" focusable="false"><path d="M3 20L20 6L37 20M9 19V34H31V19M16 34V24H24V34" fill="none" stroke="currentColor" stroke-width="3"/></svg><span>NORTHLINE<small>ROOFING</small></span></a><nav aria-label="Primary"><ul>${data.navigation.map(item => `<li><a href="${e(item.path)}"${page.path === item.path ? ' aria-current="page"' : ''}>${e(item.label)}</a></li>`).join('')}</ul></nav></div></header>`;
}

function breadcrumbs(page) {
  return page.path === '/' ? '' : `<nav class="container breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><span aria-hidden="true">/</span> <span aria-current="page">${e(page.label)}</span></li></ol></nav>`;
}

function callout(data) {
  return `<section class="contact-strip"><div class="container contact-strip-inner"><div><p class="eyebrow">${e(data.callout.eyebrow)}</p><h2>${e(data.callout.heading)}</h2><p>${e(data.callout.text)}</p></div><a class="button button-light" href="/contact/">Contact Northline ${arrow}</a></div></section>`;
}

function footer(data) {
  return `<footer class="site-footer"><div class="container"><div class="footer-top"><div><p class="footer-brand">${e(data.site.name)}</p><p>Residential roof repair &amp; roof inspection<br>${e(areaText(data.site))}</p></div><div>${phone(data.site,'footer',data.site.phoneDisplay,'footer-phone')}<p>Reserved fictional number</p></div></div><div class="footer-bottom"><p>Fictional demonstration. No public office address.</p><a href="/contact/">About this demonstration</a></div></div></footer>`;
}

function home(data, page) {
  return `<section class="container hero"><div class="hero-copy"><p class="eyebrow">${e(page.eyebrow)}</p><h1>${e(page.heading)}</h1><p class="hero-lead">${e(data.site.services.join(' and '))} in ${e(areaText(data.site))}.</p><p class="intro">${e(page.intro)}</p><div class="hero-actions">${phone(data.site,'home-hero')}<a class="text-link" href="/services/roof-repair/">Explore roof repair ${arrow}</a></div><p class="demo-hint">Demonstration phone link · reserved fictional number</p></div>${roofDrawing()}</section><section class="section section-white"><div class="container"><div class="section-heading"><p class="eyebrow">The services</p><h2>${e(page.servicesHeading)}</h2></div><div class="service-grid">${page.serviceCards.map(card => `<article class="service-card"><span class="section-number" aria-hidden="true">${e(card.number)}</span><h3>${e(card.title)}</h3><p>${e(card.text)}</p><a class="text-link" href="${e(card.path)}">${e(card.linkLabel)} ${arrow}</a></article>`).join('')}</div></div></section><section class="section"><div class="container area-layout"><div><p class="eyebrow">The service area</p><h2>${e(page.areaHeading)}</h2><p>${e(page.areaText)}</p></div><ul class="area-list">${data.site.serviceAreas.map(area=>`<li><span>${e(area)}</span><span>${e(data.site.state)}</span></li>`).join('')}</ul></div></section>${callout(data)}`;
}

function service(data, page) {
  return `<section class="container page-hero"><p class="eyebrow">${e(page.eyebrow)} / ${e(areaText(data.site))}</p><h1>${e(page.heading)}</h1><p class="intro">${e(page.intro)}</p>${phone(data.site,page.callPlacement)}<p class="demo-hint">Demonstration phone link · reserved fictional number</p></section><section class="section section-white"><div class="container detail-layout"><div><p class="eyebrow">Before the conversation</p><h2>${e(page.detailsHeading)}</h2><p>${e(page.detailsIntro)}</p></div><ol class="detail-list">${page.details.map((detail,i)=>`<li><span class="step-number" aria-hidden="true">0${i+1}</span><div><h3>${e(detail.title)}</h3><p>${e(detail.text)}</p></div></li>`).join('')}</ol></div></section><section class="section"><div class="container inspection-panel"><div><p class="eyebrow">Roof inspection</p><h2>${e(page.inspectionHeading)}</h2><p>${e(page.inspectionText)}</p><a class="text-link" href="/contact/">View contact details ${arrow}</a></div><aside class="scope-note"><span class="section-number" aria-hidden="true">A note on scope</span><p>${e(page.scopeNote)}</p></aside></div></section>${callout(data)}`;
}

function contact(data, page) {
  return `<section class="container page-hero contact-hero"><p class="eyebrow">${e(page.eyebrow)}</p><h1>${e(page.heading)}</h1><p class="intro">${e(page.intro)}</p></section><section class="container contact-layout" aria-label="Contact details"><div class="phone-panel"><p class="eyebrow">Telephone</p><h2>${e(page.phoneHeading)}</h2><p>${e(page.phoneText)}</p>${phone(data.site,'contact-primary',data.site.phoneDisplay,'phone-number')}<div class="phone-disclaimer"><strong>Reserved fictional number</strong><p>${e(data.site.demoDescription)}</p></div></div><div class="contact-facts"><div><h2>${e(page.areaHeading)}</h2><p class="area-names">${e(data.site.serviceAreas.join(' & '))}</p><p>${e(data.site.state)}</p><p class="small">${e(data.site.addressPolicy)}</p></div><div><h2>${e(page.servicesHeading)}</h2><ul>${data.site.services.map(item=>`<li>${e(item)}</li>`).join('')}</ul><a class="text-link" href="/services/roof-repair/">Explore roof repair ${arrow}</a></div></div></section><section class="container demo-explainer"><h2>${e(page.noteHeading)}</h2><p>${e(page.noteText)}</p></section>`;
}

function structuredData(data, page) {
  const origin = data.site.origin;
  const canonical = new URL(page.path,origin).href;
  const graph = [
    {'@type':'WebSite','@id':`${origin}/#website`,url:`${origin}/`,name:`${data.site.name} — fictional demonstration`,description:data.site.demoDescription,inLanguage:data.site.language},
    {'@type':page.template === 'contact' ? 'ContactPage' : 'WebPage','@id':`${canonical}#webpage`,url:canonical,name:page.title,description:page.description,isPartOf:{'@id':`${origin}/#website`},inLanguage:data.site.language}
  ];
  if (page.path !== '/') graph.push({'@type':'BreadcrumbList','@id':`${canonical}#breadcrumb`,itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:`${origin}/`},{'@type':'ListItem',position:2,name:page.label,item:canonical}]});
  return JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');
}

export function renderPage(data, page) {
  const body = {home,service,contact}[page.template];
  if (!body) throw new Error(`Unknown page template: ${page.template}`);
  return shell(data,page,body(data,page));
}

function shell(data,page,body,{missing=false}={}) {
  const canonical = new URL(page.path,data.site.origin).href;
  return `<!doctype html>
<html lang="${e(data.site.language)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(page.title)}</title><meta name="description" content="${e(page.description)}"><meta name="robots" content="${data.site.index && !missing ? 'index, follow':'noindex, follow'}">${missing?'':`<link rel="canonical" href="${e(canonical)}">`}<meta name="theme-color" content="#142d4e"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/styles.css"><script src="/assets/main.js" defer></script>${missing?'':`<script type="application/ld+json">${structuredData(data,page)}</script>`}</head><body>${header(data,page)}${missing?'':breadcrumbs(page)}<main id="main" tabindex="-1">${body}</main>${footer(data)}</body></html>\n`;
}

export function render404(data) {
  const page = {path:'/404/',label:'Page not found',title:'Page not found | Northline Roofing demo',description:'The requested page does not exist on the Northline Roofing fictional demonstration.'};
  return shell(data,page,`<section class="container page-hero"><p class="eyebrow">404 / Page not found</p><h1>This page isn’t under our roof.</h1><p class="intro">The link may be incorrect. Visit the homepage or find the contact details below.</p><a class="button" href="/">Back to home ${arrow}</a></section>`,{missing:true});
}
