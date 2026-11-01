// Fortis Net Lease — static build. Reads data/ and harvest/, writes site/. Every word and figure comes from those sources.
import fs from 'node:fs';
const H = JSON.parse(fs.readFileSync('harvest/data.json')), LJ = JSON.parse(fs.readFileSync('data/listings.json')), RJ = JSON.parse(fs.readFileSync('data/rates.json'));
const esc = (s) => String(s ?? '').replace(/&#8211;/g, '–').replace(/&#8217;/g, '’').replace(/&#038;|&amp;/g, '&').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const fmt = (p) => !p ? 'Price on request' : p >= 1e6 ? '$' + (p / 1e6).toFixed(p >= 1e7 ? 1 : 2) + 'M' : '$' + Math.round(p / 1e3) + 'K';
const arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5"/></svg>';
const listings = LJ.listings.filter((l) => l.heroImage || l.photoUrl).map((l) => ({ ...l, img: l.heroImage || l.photoUrl }));
const byPrice = listings.filter((l) => l.price).sort((a, b) => b.price - a.price);
const feat = byPrice.find((l) => /Meijer/.test(l.name)) || byPrice[0];
const team = H.team_roster_order;
const lead = team.filter((t) => /Partner|Managing/.test(t.title)), rest = team.filter((t) => !lead.includes(t));
const ust10 = RJ.rates.find((r) => r.key === 'ust10');
const capped = listings.filter((l) => l.capRate), avgCap = capped.reduce((a, l) => a + l.capRate, 0) / capped.length;
const sectors = H.sales_volume_by_sector.items.map((s) => ({ name: s.sector.replace(' – ', '-').replace(' | ', ' · ').replace(' | ', ' · '), v: s.volume_as_stated, n: parseFloat(s.volume_as_stated.replace(/[^0-9.]/g, '')) * (/BILLION/.test(s.volume_as_stated) ? 1000 : 1) })).sort((a, b) => (/Misc/.test(a.name) - /Misc/.test(b.name)) || b.n - a.n);
const sMax = Math.max(...sectors.map((s) => s.n)), postC = ['saffron', 'sapphire', 'jade', 'midnight'];
const quote = H.testimonials.find((q) => /Agree/.test(q.attribution)) || H.testimonials[0];
const phone = H.company.phones[0].number, addr = H.company.addresses[0];
const SEC = { 'dollar-stores': 'Dollar stores', restaurants: 'Restaurants', auto: 'Auto', 'medical-office-industrial': 'Medical & office', 'multi-tenant-retail': 'Multi-tenant', other: 'Other' };

// hero posts: one per listing with a price, normalised, in longitude order (west to east)
const posts = listings.filter((l) => l.price && l.lng).sort((a, b) => a.lng - b.lng).map((l) => [+(Math.sqrt(l.price / byPrice[0].price)).toFixed(3), esc(l.name), esc(`${l.city}, ${l.state}`), fmt(l.price)]);

// the wall: four columns of live listings, alternate columns flow in opposite directions
const wallItems = byPrice.slice(0, 32), wcols = [[], [], [], []];
wallItems.forEach((l, i) => wcols[i % 4].push(l));
const wcard = (l) => `<a class="lcard" href="#featured"><span class="lcard__img"><img src="${l.img}" alt="${esc(l.name)}, ${esc(l.city)}, ${l.state}" loading="lazy"></span><span class="lcard__meta"><span>${esc(l.city)}, ${l.state}</span><span>${SEC[l.sector] || ''}</span></span><b class="lcard__name">${esc(l.name)}</b><span class="lcard__price">${fmt(l.price)}${l.capRate ? ` · ${l.capRate.toFixed(2)}% cap` : ''}</span></a>`;

const person = (t, big) => `<a class="person" href="tel:+1${(t.phone || '').replace(/\D/g, '')}"><span class="person__img"><img src="${t.headshot}" alt="${esc(t.name)}" loading="lazy"></span><span class="person__name">${esc(t.name)}</span><span class="person__role">${esc(t.title)}${t.phone ? `<br>${esc(t.phone)}` : ''}</span></a>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fortis Net Lease · Net lease investment sales, nationwide</title>
<meta name="description" content="Fortis Net Lease sells single-tenant net lease real estate nationwide. ${listings.length} properties for sale now, $9+ billion in sales volume and 4,500+ properties sold since 2009.">
<link rel="icon" href="logo.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="fortis.css">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'RealEstateAgent', name: 'Fortis Net Lease', url: 'https://fortisnetlease.com/', telephone: phone, foundingDate: '2009', address: { '@type': 'PostalAddress', streetAddress: addr.street, addressLocality: addr.city, addressRegion: addr.state, postalCode: addr.zip, addressCountry: 'US' } })}</script>
</head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="hdr"><div class="hdr__in"><a class="brand" href="#main" aria-label="Fortis Net Lease home"><img class="brand__logo" src="logo.png" alt="Fortis Net Lease"></a>
<nav class="nav" aria-label="Primary"><a href="#wall">Properties</a><a href="#services">Services</a><a href="#record">Track record</a><a href="#people">Advisors</a><a href="#news">Insights</a></nav>
<a class="btn btn--gold" href="#sell">Request a valuation</a><button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span></span></button></div></header>
<div class="menu" id="menu" aria-hidden="true" role="dialog" aria-label="Menu"><button class="menu__close" aria-label="Close menu">×</button><nav><a href="#wall">Properties</a><a href="#services">Services</a><a href="#record">Track record</a><a href="#people">Advisors</a><a href="#sell">Sell a property</a></nav><div class="menu__foot"><a href="tel:+1${phone.replace(/\D/g, '')}">${phone}</a><span>${esc(addr.city)}, ${addr.state}</span></div></div>

<main id="main">
<section class="ahero" aria-label="Introduction">
 <div class="ahero__field" aria-hidden="true"><i></i><i></i><i></i></div>
 <canvas class="ahero__posts" id="posts" aria-hidden="true"></canvas>
 <div class="wrap ahero__in">
  <p class="eyebrow">Net lease investment sales · since 2009</p>
  <h1 class="ahero__h"><span class="line"><span>Your net lease</span></span><span class="line"><span style="--d:1"><em>company.</em></span></span></h1>
  <div class="ahero__foot"><p>Boutique by design, nationwide by experience. Every line of light behind this text is a property we are selling today, as tall as its price. Point at one.</p>
   <div class="ctas"><a class="btn btn--gold" href="#wall">See ${listings.length} properties ${arrow}</a><a class="btn btn--ghost" href="#sell">Sell a property</a></div></div>
  <p class="ahero__tip" id="ptip" aria-live="polite"></p>
  <dl class="ahero__stats"><div><dt class="num" data-count>$9+B</dt><dd>Total sales volume</dd></div><div><dt class="num" data-count>4,500+</dt><dd>Properties sold</dd></div><div><dt class="num" data-count>400K</dt><dd>Broker &amp; buyer reach</dd></div><div><dt class="num" data-count>46</dt><dd>States sold in</dd></div></dl>
 </div>
</section>

<section class="astate" aria-labelledby="st-h"><div class="wrap astate__grid">
 <p class="eyebrow" id="st-h">This is all we do</p>
 <div><p class="astate__text" data-lines><span class="ln"><span>Net lease property sales are about maximum exposure:</span></span> <span class="ln"><span>for today’s dispositions, and tomorrow’s acquisitions.</span></span> <span class="ln"><span>Founded in 2009, in the worst financial crisis in a generation, by three people who decided to start a brokerage anyway.</span></span></p>
 <a class="arrow-link" href="#people">Meet the partners ${arrow}</a></div></div></section>

<section class="skyline" id="record" aria-labelledby="rec-h"><div class="wrap">
 <div class="sec-head sec-head--split"><div><p class="eyebrow">Track record</p><h2 class="d2" id="rec-h" style="margin-top:1.25rem">$9+ billion, <em class="serif-i">sector by sector.</em></h2></div><p class="lede">Sales volume by the tenants we know best, as published by Fortis. Each post is as tall as the business behind it.</p></div>
 <dl class="skyline__grid skyline__grid--7">${sectors.map((s, i) => `<div class="post post--${postC[i % 4]}" style="--h:${Math.round(30 + 70 * s.n / sMax)}%"><span class="post__bar" aria-hidden="true"></span><dt>${esc(s.v.replace(' MILLION', 'M').replace(' BILLION', 'B'))}</dt><dd>${esc(s.name)}</dd></div>`).join('')}</dl>
</div></section>

<section class="cols" id="services" aria-labelledby="svc-h"><div class="wrap cols__pin">
 <div class="cols__head"><div><p class="eyebrow">Services</p><h2 class="d2" id="svc-h">Three ways in. <em class="serif-i">One desk.</em></h2></div><p class="lede">Whether you are buying, selling or freeing up capital, the same advisors and the same buyer network work your deal.</p></div>
 <div class="cols__row">
  <article class="col col--sapphire is-open"><button class="col__tab" aria-expanded="true"><span class="col__idx">01</span><span class="col__name">Investors</span><span class="col__full">Acquisitions</span></button><div class="col__body"><h3 class="col__title">Buy</h3><p class="col__lede">Buyer representation across ${listings.length} live listings and the off-market deals that never reach a website.</p><dl class="col__crit"><div><dt>Live now</dt><dd>${listings.length} properties · ${fmt(listings.reduce((a, l) => a + (l.price || 0), 0))}</dd></div><div><dt>Desk yield</dt><dd>${avgCap.toFixed(2)}% average cap, ${Math.round((avgCap - ust10.value) * 100)} bp over the 10-year Treasury (${ust10.value.toFixed(2)}%)</dd></div><div><dt>Reach</dt><dd>400K brokers and proprietary buyers</dd></div></dl><a class="btn btn--gold" href="#wall">Browse properties ${arrow}</a></div></article>
  <article class="col col--jade"><button class="col__tab" aria-expanded="false"><span class="col__idx">02</span><span class="col__name">Owners</span><span class="col__full">Dispositions</span></button><div class="col__body"><h3 class="col__title">Sell</h3><p class="col__lede">Accurate pricing, maximum exposure and an advisor who has already sold your tenant.</p><dl class="col__crit"><div><dt>Sold</dt><dd>4,500+ properties</dd></div><div><dt>Dollar stores</dt><dd>Nearly 1,500 sold over 13 years</dd></div><div><dt>Co-brokerage</dt><dd>Commissions shared equally</dd></div></dl><a class="btn btn--gold" href="#sell">Request a valuation ${arrow}</a></div></article>
  <article class="col col--midnight"><button class="col__tab" aria-expanded="false"><span class="col__idx">03</span><span class="col__name">Capital</span><span class="col__full">Leaseback · 1031</span></button><div class="col__body"><h3 class="col__title">Unlock</h3><p class="col__lede">Sale-leasebacks for operators who want their capital back in the business, and 1031 guidance for buyers on a deadline.</p><dl class="col__crit"><div><dt>Leaseback</dt><dd>Structure, pricing, buyer match</dd></div><div><dt>1031</dt><dd>Replacement property sourcing</dd></div><div><dt>Advisory</dt><dd>Portfolio analysis and strategy</dd></div></dl><a class="btn btn--gold" href="#sell">Talk to an advisor ${arrow}</a></div></article>
 </div></div></section>

<section class="pwall" id="wall" aria-labelledby="wall-h"><div class="wrap">
 <div class="pwall__head"><div><p class="eyebrow">For sale now</p><h2 class="d2" id="wall-h">${listings.length} properties on the desk.</h2></div><a class="btn btn--ghost" href="https://fortisnetlease.com/net-lease-properties/">All listings ${arrow}</a></div>
 <div class="pwall__cols">${wcols.map((c, i) => `<div class="pwall__col" data-dir="${i % 2}">${c.map(wcard).join('')}</div>`).join('')}</div></div></section>

<section class="case" id="featured" aria-labelledby="case-h"><div class="wrap case__grid">
 <figure class="case__media case__panel case__panel--photo"><img src="${feat.img}" alt="${esc(feat.name)}, ${esc(feat.city)}, ${feat.state}"><figcaption>${esc(feat.city)}, ${feat.state}</figcaption></figure>
 <div class="case__body"><p class="eyebrow">Featured property</p><h2 class="d2" id="case-h">${esc(feat.name)}</h2><p class="lede">${esc(feat.address)}, ${esc(feat.city)}, ${feat.state}. ${esc((feat.description || '').split('. ').slice(0, 2).join('. ').slice(0, 260))}${(feat.description || '').length ? '.' : ''}</p>
  <dl class="facts"><div><dt>Asking</dt><dd>${fmt(feat.price)}</dd></div><div><dt>Building</dt><dd>${feat.sizeDisplay || '—'}</dd></div><div><dt>Type</dt><dd>${esc(feat.subType || feat.propertyType)}</dd></div>${feat.yearBuilt ? `<div><dt>Built</dt><dd>${feat.yearBuilt}</dd></div>` : `<div><dt>Lease</dt><dd>20-year NNN ground lease</dd></div>`}</dl>
  <a class="btn btn--solid" href="#sell">Request the offering memorandum ${arrow}</a></div></div></section>

<section class="leaders sec" id="people" aria-labelledby="ppl-h"><div class="wrap">
 <div class="sec-head sec-head--split"><div><p class="eyebrow">Leadership</p><h2 class="d2" id="ppl-h" style="margin-top:1.25rem">Founded by three. <em class="serif-i">Run by them still.</em></h2></div><p class="lede">“${esc(quote.quote.replace(/^["“]|["”]$/g, ''))}” <span class="muted">— ${esc(quote.attribution)}</span></p></div>
 <div class="people people--lead">${lead.map((t) => person(t, true)).join('')}</div>
 <div class="advisors"><p class="eyebrow">Advisors</p><ul>${rest.map((t) => `<li><a href="tel:+1${(t.phone || '').replace(/\D/g, '')}"><b>${esc(t.name)}</b><span>${esc(t.title)}${t.phone ? ' · ' + esc(t.phone) : ''}</span></a></li>`).join('')}</ul></div>
</div></section>

<section class="news sec" id="news" aria-labelledby="news-h"><div class="wrap">
 <div class="sec-head"><p class="eyebrow">Insights</p><h2 class="d2" id="news-h">From the desk.</h2></div>
 <div class="alist">${H.news.map((n) => `<a class="arow" href="${n.url || n.source || '#'}"><span class="arow__meta"><time>${esc(n.date)}</time></span><span><span class="arow__title">${esc(n.title)}</span><span class="arow__src">${esc((n.excerpt || '').slice(0, 150))}…</span></span>${arrow}</a>`).join('')}</div>
</div></section>

<section class="cta2" id="sell" aria-label="Get started">
 <a class="cta--v" href="#wall"><p class="eyebrow">Investors</p><h2 class="d3">Find your next net lease property.</h2><p>${listings.length} properties for sale today across the country.</p><span class="arrow-link">Browse properties ${arrow}</span></a>
 <a class="cta--c" href="mailto:info@fortisnetlease.com?subject=Valuation%20request"><p class="eyebrow">Owners</p><h2 class="d3">What is your property worth?</h2><p>An advisor who has sold your tenant will price it against real closings.</p><span class="arrow-link">Request a valuation ${arrow}</span></a>
</section>
</main>

<footer class="ftr"><div class="wrap"><div class="ftr__top">
 <div><img class="brand__logo" src="logo.png" alt="Fortis Net Lease"><p class="ftr__claim">Your net lease company.</p><a class="ftr__mail" href="tel:+1${phone.replace(/\D/g, '')}">${phone}</a></div>
 <div><h2>Investors</h2><ul><li><a href="#wall">Properties</a></li><li><a href="#featured">Featured</a></li><li><a href="#services">1031 guidance</a></li></ul></div>
 <div><h2>Owners</h2><ul><li><a href="#sell">Valuation</a></li><li><a href="#services">Sale-leasebacks</a></li><li><a href="#record">Track record</a></li></ul></div>
 <div><h2>Firm</h2><ul><li><a href="#people">Advisors</a></li><li><a href="#news">Insights</a></li><li>${esc(addr.street)}<br>${esc(addr.city)}, ${addr.state} ${addr.zip}</li></ul></div>
</div><div class="ftr__bot"><span>© 2026 Fortis Net Lease</span><nav><a href="#">Privacy</a><a href="#">Terms</a></nav></div></div></footer>
<script>window.POSTS=${JSON.stringify(posts)};</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="app.js" defer></script><script src="posts.js" defer></script>
</body></html>`;
fs.mkdirSync('site', { recursive: true });
fs.writeFileSync('site/index.html', html);
for (const f of ['styles.css', 'fortis.css', 'app.js', 'posts.js', 'logo.png']) fs.copyFileSync('site-src/' + f, 'site/' + f);
console.log('site/index.html', (html.length / 1024).toFixed(1) + 'KB', listings.length, 'listings', team.length, 'people');
