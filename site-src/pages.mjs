// Fortis Net Lease — listing detail pages, listings index, sitemap, robots and legacy ?propertyId= redirects.
// Everything here is rendered from data/listings.json at build time (the hourly Action rebuilds from the live feed).
// Empty feed fields are omitted, never filled in. OM document URLs are never written to HTML.
import fs from 'node:fs';

export const ORIGIN = 'https://fortisnetlease.com';
export const listingPath = (l) => `/net-lease-properties/${l.slug}/`;

export function buildListingPages(ctx) {
  const { listings, LJ, esc, un, fmt, tel, arrow, SEC, phone, addr, ust10 } = ctx;
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const closed = (l) => /sold|closed/i.test(l.status || '');
  const priceText = (l) => l.price ? money(l.price) : l.priceDisplay ? un(l.priceDisplay) : 'Price on request';
  const where = (l) => `${un(l.city)}, ${l.state}`;
  const title = (l) => `${un(l.tenantName || l.name)}, ${where(l)}`;
  const tenant = (l) => un(l.tenantName || l.name);
  const lastmod = (LJ.fetchedAt || new Date().toISOString()).slice(0, 10);
  const mailOM = (l) => `mailto:info@fortisnetlease.com?${l.brokers?.length ? `cc=${encodeURIComponent(l.brokers.map((b) => b.email).filter(Boolean).join(','))}&` : ''}subject=${encodeURIComponent(`Offering memorandum: ${tenant(l)}, ${where(l)}`)}&body=${encodeURIComponent(`Please send me the offering memorandum for ${tenant(l)}, ${un(l.address || '')} ${where(l)} (Buildout ${l.propertyId || l.id}).\n${ORIGIN}${listingPath(l)}\n\nName:\nCompany:\nPhone:`)}`;

  const head = (t, desc, canonical, extra = '', og = '') => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Fortis Net Lease"><meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">${og ? `<meta property="og:image" content="${og}"><meta name="twitter:card" content="summary_large_image">` : ''}
<link rel="icon" href="/logo.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..700&family=Figtree:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">${extra}
</head><body class="pg">
<a class="skip" href="#main">Skip to content</a>
<header class="hdr day"><div class="hdr__in">
 <a class="hdr__logo" href="/" aria-label="Fortis Net Lease, home"><img src="/logo.png" alt="Fortis Net Lease" width="160" height="25"></a>
 <nav class="cap" aria-label="Primary"><a href="/net-lease-properties/">Properties</a><a href="/#services">Services</a><a href="/#record">Track record</a><a href="/#people">Advisors</a><a href="/#insights">Insights</a></nav>
 <div class="hdr__end"><a class="hdr__tel" href="${tel(phone)}">${phone}</a><a class="btn btn--cu" href="/#value">Value my property</a><button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span></span></button></div>
</div></header>
<div class="menu" id="menu" role="dialog" aria-label="Menu" aria-hidden="true"><button class="menu__x" aria-label="Close menu">×</button><a href="/net-lease-properties/">Properties</a><a href="/#services">Services</a><a href="/#record">Track record</a><a href="/#people">Advisors</a><a href="/#value">Value my property</a><a href="${tel(phone)}">${phone}</a></div>
`;
  const foot = (scripts = '') => `<footer class="ftr"><div class="wrap"><div class="ftr__g">
 <div><img src="/logo.png" alt="Fortis Net Lease" width="170" height="27"><p class="ftr__claim">Your net lease company.</p><a class="ftr__tel" href="${tel(phone)}">${phone}</a></div>
 <div><h2>Investors</h2><ul><li><a href="/net-lease-properties/">Properties</a></li><li><a href="/#featured">Featured</a></li><li><a href="/#services">1031 replacement</a></li></ul></div>
 <div><h2>Owners</h2><ul><li><a href="/#value">Valuation</a></li><li><a href="/#services">Sale-leasebacks</a></li><li><a href="/#record">Track record</a></li></ul></div>
 <div><h2>Office</h2><ul><li>${esc(addr.street)}</li><li>${esc(addr.city)}, ${addr.state} ${addr.zip}</li><li><a href="mailto:info@fortisnetlease.com">info@fortisnetlease.com</a></li></ul></div>
</div><div class="ftr__bot"><span>© 2026 Fortis Net Lease</span><span>Listings via Buildout · Rates via U.S. Treasury (${ust10.asOf})</span></div></div></footer>${scripts}
<script src="/app.js" defer></script>
</body></html>`;

  const card = (l) => `<a class="card" href="${listingPath(l)}" data-sec="${l.sector}"><span class="card__img"><img src="${l.img}" alt="${esc(l.name)}, ${esc(l.city)}, ${l.state}" width="640" height="480" loading="lazy"></span><span class="card__b"><span><span class="card__name">${esc(l.name)}</span><span class="card__loc">${esc(l.city)}, ${l.state} · ${SEC[l.sector] || ''}</span></span><span class="card__px">${fmt(l.price)}${l.capRate ? `<small>${l.capRate.toFixed(2)}% cap</small>` : ''}</span></span></a>`;

  // stable order for prev/next: price desc, then unpriced
  const order = listings.filter((l) => l.price).sort((a, b) => b.price - a.price).concat(listings.filter((l) => !l.price));
  const similar = (l) => {
    const seen = new Set([l.slug]), out = [];
    for (const f of [(x) => x.tenantKey && x.tenantKey === l.tenantKey, (x) => x.state === l.state, (x) => x.sector === l.sector])
      for (const x of order) if (out.length < 3 && !seen.has(x.slug) && f(x)) { seen.add(x.slug); out.push(x); }
    return out;
  };

  const pages = [];
  order.forEach((l, i) => {
    const url = ORIGIN + listingPath(l), isClosed = closed(l), imgs = [...new Set([l.heroImage, ...(l.images || [])].filter(Boolean))];
    const facts = [
      ['Asking price', priceText(l)],
      l.capRate && ['Cap rate', l.capRate.toFixed(2) + '%'],
      l.noi && ['NOI', money(l.noi)],
      l.leaseType && ['Lease type', un(l.leaseType)],
      l.leaseTermRemaining && ['Lease term remaining', un(l.leaseTermRemaining)],
      l.guarantee && ['Guarantee', un(l.guarantee)],
      l.sizeDisplay && ['Building size', un(l.sizeDisplay)],
      l.yearBuilt && ['Year built', String(l.yearBuilt)],
      (l.subType || l.propertyType) && ['Property type', [l.propertyType, l.subType].filter(Boolean).map(un).join(' · ')],
    ].filter(Boolean);
    const desc = `${tenant(l)} net lease property for sale in ${where(l)}: ${[priceText(l), l.capRate && l.capRate.toFixed(2) + '% cap', l.sizeDisplay, l.leaseType].filter(Boolean).map(un).join(', ')}. Listed by Fortis Net Lease.`.slice(0, 300);
    const t = `${title(l)} | ${isClosed ? 'Closed' : 'Net lease for sale'} | Fortis Net Lease`;
    const paras = (s) => un(s).split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('');
    const sim = similar(l), prev = order[(i - 1 + order.length) % order.length], next = order[(i + 1) % order.length];
    const graph = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'RealEstateListing', '@id': url + '#listing', url, name: title(l), description: un(l.description || desc).slice(0, 500), image: imgs.slice(0, 6),
        about: { '@type': 'Place', name: tenant(l), address: { '@type': 'PostalAddress', streetAddress: un(l.address || ''), addressLocality: un(l.city), addressRegion: l.state, postalCode: l.zip || undefined, addressCountry: 'US' }, ...(l.lat && l.lng ? { geo: { '@type': 'GeoCoordinates', latitude: l.lat, longitude: l.lng } } : {}) },
        ...(!isClosed ? { offers: { '@type': 'Offer', ...(l.price ? { price: l.price, priceCurrency: 'USD' } : {}), availability: 'https://schema.org/InStock', url, offeredBy: [{ '@id': ORIGIN + '/#organization' }, ...(l.brokers || []).map((b) => ({ '@type': 'Person', name: b.name, email: b.email || undefined, telephone: b.phone || undefined }))] } } : {}),
        additionalProperty: [l.capRate && ['Cap rate', l.capRate, 'P1'], l.noi && ['Net operating income', l.noi, 'USD'], l.leaseTermRemaining && ['Lease term remaining', un(l.leaseTermRemaining)], l.leaseType && ['Lease type', un(l.leaseType)], l.sizeSf && ['Building size (sq ft)', l.sizeSf], l.yearBuilt && ['Year built', l.yearBuilt]].filter(Boolean).map(([name, value, unitText]) => ({ '@type': 'PropertyValue', name, value, ...(unitText ? { unitText } : {}) })) },
      { '@type': 'RealEstateAgent', '@id': ORIGIN + '/#organization', name: 'Fortis Net Lease', url: ORIGIN + '/', telephone: phone },
      { '@type': 'BreadcrumbList', itemListElement: [['Home', ORIGIN + '/'], ['Net lease properties', ORIGIN + '/net-lease-properties/'], [title(l), url]].map(([name, item], k) => ({ '@type': 'ListItem', position: k + 1, name, item })) },
    ] };
    const html = head(t, desc, url, `\n<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`, l.heroImage) + `
<main id="main" class="ld">
<div class="wrap">
 <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/net-lease-properties/">Net lease properties</a></li><li aria-current="page">${esc(title(l))}</li></ol></nav>
 <section class="ld__top" aria-labelledby="h1">
  <div class="ld__intro">
   <p class="label"><span class="badge${isClosed ? ' badge--closed' : ''}">${isClosed ? 'Closed' : esc(l.status || 'For sale')}</span>${SEC[l.sector] ? ` ${SEC[l.sector]}` : ''}</p>
   <h1 class="t2" id="h1">${esc(tenant(l))} <span class="foil">${esc(where(l))}</span></h1>
   ${l.address ? `<p class="ld__addr">${esc(l.address)}, ${esc(l.city)}, ${l.state}${l.zip ? ' ' + esc(l.zip) : ''}</p>` : ''}
   <p class="ld__px"><b>${esc(priceText(l))}</b>${l.capRate ? `<small>${l.capRate.toFixed(2)}% cap rate</small>` : ''}</p>
   <div class="ld__cta">${!isClosed ? `<a class="btn btn--cu" href="${mailOM(l)}">Request the offering memorandum ${arrow}</a>` : ''}${l.brokers?.[0]?.phone ? `<a class="btn btn--ln" href="${tel(l.brokers[0].phone)}">Call ${esc(l.brokers[0].name.split(' ')[0])} · ${esc(l.brokers[0].phone)}</a>` : `<a class="btn btn--ln" href="${tel(phone)}">Call ${phone}</a>`}</div>
  </div>
  <figure class="ld__hero"><img src="${l.heroImage}" alt="${esc(tenant(l))} property at ${esc(l.address || where(l))}" width="1200" height="800" fetchpriority="high"></figure>
 </section>

 <section class="ld__facts" aria-labelledby="facts-h"><h2 class="visually-hidden" id="facts-h">Property facts</h2><dl>${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></section>

 <div class="ld__body">
  <div class="ld__main">
   ${(l.highlights = (l.highlights || []).map((h) => un(h).replace(/^[s•·-–*]+/, "").trim()).filter((h) => /[a-z0-9]/i.test(h))).length ? `<section aria-labelledby="hl-h"><h2 class="t3" id="hl-h">Investment highlights</h2><ul class="ld__hl">${l.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul></section>` : ''}
   ${l.description ? `<section aria-labelledby="ds-h"><h2 class="t3" id="ds-h">The property</h2><div class="ld__txt">${paras(l.description)}</div></section>` : ''}
   ${l.locationDescription ? `<section aria-labelledby="lo-h"><h2 class="t3" id="lo-h">The location</h2><div class="ld__txt">${paras(l.locationDescription)}</div></section>` : ''}
   ${l.demographics?.length ? `<section aria-labelledby="dm-h"><h2 class="t3" id="dm-h">Demographics</h2><div class="ld__tbl"><table><caption>Three radii from the property, inner to outer, as published in the listing</caption><thead><tr><th scope="col">Measure</th><th scope="col">Inner</th><th scope="col">Middle</th><th scope="col">Outer</th></tr></thead><tbody>${l.demographics.map((d) => `<tr><th scope="row">${esc(d.label)}</th>${[0, 1, 2].map((k) => `<td>${esc(d.values?.[k] ?? '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>` : ''}
  </div>
  <aside class="ld__side" aria-label="Listing advisors">
   <div class="ld__card">
    <p class="label">Listing ${l.brokers?.length > 1 ? 'advisors' : 'advisor'}</p>
    ${(l.brokers || []).map((b) => `<div class="ld__brk"><b>${esc(b.name)}</b>${b.phone ? `<a href="${tel(b.phone)}">${esc(b.phone)}</a>` : ''}${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}</div>`).join('') || `<div class="ld__brk"><b>Fortis Net Lease</b><a href="${tel(phone)}">${phone}</a><a href="mailto:info@fortisnetlease.com">info@fortisnetlease.com</a></div>`}
    ${!isClosed && l.hasOm ? `<p class="ld__note">The offering memorandum is sent on request, so an advisor knows who is reviewing it.</p><a class="btn btn--cu" href="${mailOM(l)}">Request the OM ${arrow}</a>` : ''}
   </div>
  </aside>
 </div>

 ${imgs.length > 1 ? `<section class="ld__gal" aria-labelledby="gl-h"><h2 class="t3" id="gl-h">Photos <small class="mono">${imgs.length}</small></h2><ul>${imgs.map((src, k) => `<li><a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${esc(tenant(l))}, ${esc(where(l))}, photo ${k + 1} of ${imgs.length}" width="800" height="600" loading="lazy" decoding="async"></a></li>`).join('')}</ul></section>` : ''}

 <section class="ld__more" aria-labelledby="mo-h">
  <div class="sh"><p class="label">Keep looking</p><h2 class="t3" id="mo-h">${sim.some((x) => x.state === l.state) ? `More net lease properties like this one` : `Similar net lease properties`}</h2><span class="survey"></span></div>
  <div class="grid">${sim.map(card).join('')}</div>
  <nav class="ld__pn" aria-label="Other listings"><a href="${listingPath(prev)}" rel="prev"><small>Previous</small>${esc(title(prev))}</a><a href="/net-lease-properties/" class="ld__all">All ${listings.length} properties</a><a href="${listingPath(next)}" rel="next"><small>Next</small>${esc(title(next))}</a></nav>
 </section>
</div>
</main>
` + foot();
    const dir = 'site' + listingPath(l);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dir + 'index.html', html);
    pages.push(listingPath(l));
  });

  // ---- listings index: /net-lease-properties/ ----
  const secCount = {}; listings.forEach((l) => secCount[l.sector] = (secCount[l.sector] || 0) + 1);
  const idMap = {}; for (const l of listings) { idMap[l.propertyId] = l.slug; idMap[l.id] = l.slug; }
  for (const w of LJ.withdrawn || []) { if (w.propertyId && !idMap[w.propertyId]) idMap[w.propertyId] = null; }
  const idxUrl = ORIGIN + '/net-lease-properties/';
  const idxLd = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', '@id': idxUrl, url: idxUrl, name: 'Net lease properties for sale', mainEntity: { '@type': 'ItemList', numberOfItems: order.length, itemListElement: order.map((l, k) => ({ '@type': 'ListItem', position: k + 1, url: ORIGIN + listingPath(l), name: title(l) })) } },
    { '@type': 'BreadcrumbList', itemListElement: [['Home', ORIGIN + '/'], ['Net lease properties', idxUrl]].map(([name, item], k) => ({ '@type': 'ListItem', position: k + 1, name, item })) },
  ] };
  // Legacy Buildout deep links (?propertyId=<id>-sale). vercel.json redirects them with a 301 on the server;
  // this runs first on hosts without those rules (local preview, other CDNs).
  const legacy = `<script>(function(){var m=${JSON.stringify(idMap)},p=new URLSearchParams(location.search).get('propertyId');if(p&&m[p])location.replace('/net-lease-properties/'+m[p]+'/');})();</script>`;
  const idx = head(`Net lease properties for sale: ${listings.length} NNN listings | Fortis Net Lease`, `${listings.length} single-tenant net lease properties for sale nationwide, ${fmt(listings.reduce((a, l) => a + (l.price || 0), 0))} asking. Dollar stores, restaurants, auto, medical and more, listed by Fortis Net Lease.`, idxUrl, `\n${legacy}\n<script type="application/ld+json">${JSON.stringify(idxLd).replace(/</g, '\\u003c')}</script>`, order[0]?.heroImage) + `
<main id="main" class="ld">
<section class="lst lst--pg" aria-labelledby="h1"><div class="wrap">
 <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">Net lease properties</li></ol></nav>
 <div class="sh sh--split"><div><p class="label">For sale now</p><h1 class="t2" id="h1" style="margin-top:1rem">Net lease properties <span class="foil">for sale.</span></h1><span class="survey"></span></div><p class="lede">${listings.length} properties, live from our listings feed, largest first. Filter by the kind of tenant you want to own.</p></div>
 <div class="chips" role="group" aria-label="Filter by sector"><button class="chip" aria-pressed="true" data-v="all">All<sup>${listings.length}</sup></button>${Object.entries(secCount).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<button class="chip" aria-pressed="false" data-v="${k}">${SEC[k] || k}<sup>${n}</sup></button>`).join('')}</div>
 <div class="grid">${order.map(card).join('')}</div>
 <div class="lst__more"><span id="lcount" aria-live="polite">${listings.length} shown</span></div>
</div></section>
</main>
` + foot();
  fs.mkdirSync('site/net-lease-properties', { recursive: true });
  fs.writeFileSync('site/net-lease-properties/index.html', idx);

  // ---- sitemap + robots (OM documents are never listed) ----
  const urls = [['/', lastmod], ['/net-lease-properties/', lastmod], ...pages.map((p) => [p, lastmod])];
  fs.writeFileSync('site/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([p, m]) => `<url><loc>${ORIGIN}${p}</loc><lastmod>${m}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync('site/robots.txt', `User-agent: *\nDisallow: /api/\nDisallow: /thank-you/\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

  // ---- vercel.json: server-side 301s for legacy ?propertyId= links, regenerated from the feed each build ----
  const vj = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  const reEsc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const keep = (vj.redirects || []).filter((r) => !r.has?.some((h) => h.key === 'propertyId'));
  const legacyRedirects = listings.filter((l) => l.propertyId).map((l) => ({ source: '/net-lease-properties{/}?', has: [{ type: 'query', key: 'propertyId', value: `^${reEsc(l.propertyId)}$` }], destination: listingPath(l), permanent: true }));
  const next = { ...vj, redirects: [...keep, ...legacyRedirects] };
  if (JSON.stringify(next) !== JSON.stringify(vj)) fs.writeFileSync('vercel.json', JSON.stringify(next, null, 2) + '\n');

  return { count: pages.length, redirects: legacyRedirects.length };
}
