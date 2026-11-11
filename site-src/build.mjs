// Fortis Net Lease — static build ("Ground", see ../design.md). Reads data/ and harvest/, writes site/.
// Every word and figure on the page comes from those sources.
import fs from 'node:fs';
import { buildListingPages, listingPath, ORIGIN } from './pages.mjs';
const H = JSON.parse(fs.readFileSync('harvest/data.json')), LJ = JSON.parse(fs.readFileSync('data/listings.json')), RJ = JSON.parse(fs.readFileSync('data/rates.json'));
const un = (s) => String(s ?? '').replace(/&#8211;/g, '–').replace(/&#8217;/g, '’').replace(/&#038;|&amp;/g, '&');
const esc = (s) => un(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const fmt = (p) => !p ? 'On request' : p >= 1e6 ? '$' + (p / 1e6).toFixed(p >= 1e7 ? 1 : 2) + 'M' : '$' + Math.round(p / 1e3) + 'K';
const tel = (p) => 'tel:+1' + String(p || '').replace(/\D/g, '');
const arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 8h12M9 3l5 5-5 5"/></svg>';
const SEC = { 'dollar-stores': 'Dollar stores', restaurants: 'Restaurants', auto: 'Auto', 'medical-office-industrial': 'Medical & office', 'multi-tenant-retail': 'Multi-tenant', other: 'Other' };

const listings = LJ.listings.filter((l) => l.heroImage || l.photoUrl).map((l) => ({ ...l, sector: l.sector || 'other', img: l.heroImage || l.photoUrl }));
const byPrice = listings.filter((l) => l.price).sort((a, b) => b.price - a.price);
const deck = byPrice.slice(0, 8);
const feat = byPrice.find((l) => /Meijer/.test(l.name)) || byPrice[0];
const asking = listings.reduce((a, l) => a + (l.price || 0), 0);
const capped = listings.filter((l) => l.capRate), avgCap = capped.reduce((a, l) => a + l.capRate, 0) / capped.length;
const ust10 = RJ.rates.find((r) => r.key === 'ust10');
const team = H.team_roster_order, partners = team.filter((t) => /Partner|Managing/.test(t.title)), advisors = team.filter((t) => !partners.includes(t));
const sectors = H.sales_volume_by_sector.items.map((s) => ({ name: un(s.sector).replace(' – ', '-').replace(/ \| /g, ' · '), v: s.volume_as_stated.replace(' MILLION', 'M').replace(' BILLION', 'B'), n: parseFloat(s.volume_as_stated.replace(/[^0-9.]/g, '')) * (/BILLION/.test(s.volume_as_stated) ? 1000 : 1) }))
  .sort((a, b) => (/Misc/.test(a.name) - /Misc/.test(b.name)) || b.n - a.n);
const sTotal = sectors.reduce((a, s) => a + s.n, 0);
const quote = H.testimonials.find((q) => /Agree/.test(q.attribution)) || H.testimonials[0];
const phone = H.company.phones[0].number, addr = H.company.addresses[0];
const record = H.featured_closings.map((c) => [un(c.name), un(c.location), c.sale_price || '', c.image || '']);
const secCount = {}; listings.forEach((l) => secCount[l.sector] = (secCount[l.sector] || 0) + 1);
// a photo strip per service row, from live listings of the matching kind
const strip = (f) => listings.filter(f).slice(0, 4).map((l) => `<img src="${l.img}" alt="${esc(l.name)}, ${esc(l.city)}, ${l.state}" loading="lazy">`).join('');

const card = (l) => `<a class="card" href="${listingPath(l)}" data-sec="${l.sector}"><span class="card__img"><img src="${l.img}" alt="${esc(l.name)}, ${esc(l.city)}, ${l.state}" loading="lazy"></span><span class="card__b"><span><span class="card__name">${esc(l.name)}</span><span class="card__loc">${esc(l.city)}, ${l.state} · ${SEC[l.sector] || ''}</span></span><span class="card__px">${fmt(l.price)}${l.capRate ? `<small>${l.capRate.toFixed(2)}% cap</small>` : ''}</span></span></a>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fortis Net Lease · Net lease investment sales, nationwide</title>
<meta name="description" content="Fortis Net Lease sells single-tenant net lease real estate nationwide: ${listings.length} properties for sale now, $9+ billion in sales and 4,500+ properties sold since 2009.">
<link rel="canonical" href="${ORIGIN}/"><meta property="og:image" content="${feat.img}">
<link rel="icon" href="logo.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..700&family=Figtree:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'RealEstateAgent', '@id': ORIGIN + '/#organization', name: 'Fortis Net Lease', url: ORIGIN + '/', telephone: phone, email: 'info@fortisnetlease.com', foundingDate: '2009', address: { '@type': 'PostalAddress', streetAddress: addr.street, addressLocality: addr.city, addressRegion: addr.state, postalCode: addr.zip, addressCountry: 'US' } })}</script>
</head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="hdr"><div class="hdr__in">
 <a class="hdr__logo" href="#main" aria-label="Fortis Net Lease, home"><img src="logo.png" alt="Fortis Net Lease" width="160" height="25"></a>
 <nav class="cap" aria-label="Primary"><a href="#properties">Properties</a><a href="#services">Services</a><a href="#record">Track record</a><a href="#people">Advisors</a><a href="#insights">Insights</a></nav>
 <div class="hdr__end"><a class="hdr__tel" href="${tel(phone)}">${phone}</a><a class="btn btn--cu" href="#value">Value my property</a><button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span></span></button></div>
</div></header>
<div class="menu" id="menu" role="dialog" aria-label="Menu" aria-hidden="true"><button class="menu__x" aria-label="Close menu">×</button><a href="#properties">Properties</a><a href="#services">Services</a><a href="#record">Track record</a><a href="#people">Advisors</a><a href="#value">Value my property</a><a href="${tel(phone)}">${phone}</a></div>

<main id="main">
<section class="hero dk" aria-labelledby="h1">
 <div class="hero__bg" aria-hidden="true">${deck.map((l, i) => `<img src="${l.img}" alt="" ${i ? 'loading="lazy"' : 'class="on"'}>`).join('')}</div>
 <canvas class="hero__topo" aria-hidden="true"></canvas>
 <div class="wrap hero__g">
  <div>
   <p class="label" data-r>Net lease investment sales · since 2009</p>
   <h1 class="t1" id="h1" data-r style="--d:1;margin-top:1.2rem">The ground under <span class="foil">every lease.</span></h1>
   <p class="lede" data-r style="--d:2">Fortis Net Lease sells single-tenant net lease real estate across the country. Boutique by design, nationwide by experience. This is all we do.</p>
   <div class="hero__cta" data-r style="--d:3"><a class="btn btn--cu" href="#properties">See ${listings.length} properties ${arrow}</a><a class="btn btn--ln" href="#value">What is mine worth?</a></div>
   <p class="coords" data-r style="--d:4"><span>On the desk <b>${listings.length} · ${fmt(asking)}</b></span><span>Avg cap <b>${avgCap.toFixed(2)}%</b></span><span>10Y UST <b>${ust10.value.toFixed(2)}%</b></span><span>Spread <b>${Math.round((avgCap - ust10.value) * 100)} bp</b></span></p>
  </div>
  <div class="deck" aria-roledescription="carousel" aria-label="Properties for sale"><div class="deck__tilt">
   ${deck.map((l, i) => `<figure class="dcard"><span class="dcard__tag">For sale · ${String(i + 1).padStart(2, '0')}</span><span class="dcard__img"><img src="${l.img}" alt="${esc(l.name)}, ${esc(l.city)}, ${l.state}" ${i > 2 ? 'loading="lazy"' : ''}></span><figcaption class="dcard__row"><span><span class="dcard__name">${esc(l.name)}</span><span class="dcard__loc">${esc(l.city)}, ${l.state} · ${esc(l.subType || l.propertyType || '')}</span></span><span class="dcard__px">${fmt(l.price)}${l.capRate ? `<small>${l.capRate.toFixed(2)}% cap</small>` : l.sizeDisplay ? `<small>${esc(l.sizeDisplay)}</small>` : ''}</span></figcaption></figure>`).join('')}</div>
   <div class="deck__ctl"><button id="dprev" aria-label="Previous property">←</button><span><span id="dn">01</span> / ${String(deck.length).padStart(2, '0')}</span><button id="dnext" aria-label="Next property">→</button></div>
  </div>
 </div>
</section>

<section class="proof dk" aria-label="Track record in figures"><div class="wrap"><dl>
 <div data-r><dt class="foil" data-count>$9+B</dt><dd>Total investment sales volume</dd><small>As stated on fortisnetlease.com</small></div>
 <div data-r style="--d:1"><dt class="foil" data-count>4,500+</dt><dd>Properties sold</dd><small>As stated on fortisnetlease.com</small></div>
 <div data-r style="--d:2"><dt class="foil" data-count>400K</dt><dd>Broker and proprietary buyer reach</dd><small>As stated on fortisnetlease.com</small></div>
 <div data-r style="--d:3"><dt class="foil" data-count>46</dt><dd>States sold in</dd><small>As stated on fortisnetlease.com</small></div>
</dl></div></section>

<section class="split" id="record" aria-labelledby="rec-h"><div class="wrap">
 <div class="sh sh--split"><div><p class="label">Track record</p><h2 class="t2" id="rec-h" style="margin-top:1rem">$9 billion, <span class="foil">split by tenant.</span></h2><span class="survey"></span></div><p class="lede">Sales volume by sector, as Fortis publishes it. Each band is as wide as the business behind it. Point at one to open it.</p></div>
 <div class="bar" data-r>${sectors.map((s) => `<div class="seg" tabindex="0" style="--w:${(s.n / sTotal * 100).toFixed(2)}"><b>$${s.v.replace('$', '')}</b><span>${esc(s.name)}</span></div>`).join('')}</div>
 <p class="bar__note"><span>Source: fortisnetlease.com, “Real estate acquisition &amp; disposition”</span><span>${sectors.length} sectors</span></p>
</div></section>

<section class="svc" id="services" aria-labelledby="svc-h"><div class="wrap">
 <div class="sh sh--split"><div><p class="label">Services</p><h2 class="t2" id="svc-h" style="margin-top:1rem">Buy. Sell. <span class="foil">Unlock.</span></h2><span class="survey"></span></div><p class="lede">The same advisors and the same buyer network work every side of the deal.</p></div>
 <div class="rows">
  <article class="row" data-r><span class="row__n">01 · Investors</span><h3>Buy</h3><div><p>Buyer representation across ${listings.length} live listings and the off-market deals that never reach a website.</p><dl><div><dt>Live</dt><dd>${listings.length} · ${fmt(asking)}</dd></div><div><dt>Avg cap</dt><dd>${avgCap.toFixed(2)}%</dd></div><div><dt>Reach</dt><dd>400K buyers</dd></div></dl><a class="go" href="#properties">Browse properties ${arrow}</a></div><div class="row__strip" aria-hidden="true">${strip((l) => l.sector === 'restaurants')}</div></article>
  <article class="row" data-r><span class="row__n">02 · Owners</span><h3>Sell</h3><div><p>Accurate pricing, maximum exposure, and an advisor who has already sold your tenant. Co-brokerage commissions shared equally.</p><dl><div><dt>Sold</dt><dd>4,500+</dd></div><div><dt>Dollar stores</dt><dd>~1,500 sold</dd></div><div><dt>States</dt><dd>46</dd></div></dl><a class="go" href="#value">Value my property ${arrow}</a></div><div class="row__strip" aria-hidden="true">${strip((l) => l.sector === 'dollar-stores')}</div></article>
  <article class="row" data-r><span class="row__n">03 · Capital</span><h3>Unlock</h3><div><p>Sale-leasebacks for operators who want their capital back in the business, and 1031 replacement property for buyers on a deadline.</p><dl><div><dt>Leaseback</dt><dd>Structure &amp; buyer</dd></div><div><dt>1031</dt><dd>Sourcing</dd></div><div><dt>Advisory</dt><dd>Portfolio strategy</dd></div></dl><a class="go" href="#people">Talk to an advisor ${arrow}</a></div><div class="row__strip" aria-hidden="true">${strip((l) => l.sector === 'medical-office-industrial')}</div></article>
 </div>
</div></section>

<section class="lst" id="properties" aria-labelledby="lst-h"><div class="wrap">
 <div class="sh sh--split"><div><p class="label">For sale now</p><h2 class="t2" id="lst-h" style="margin-top:1rem">${listings.length} properties. <span class="foil">${fmt(asking)} asking.</span></h2><span class="survey"></span></div><p class="lede">Live from our listings feed, largest first. Filter by the kind of tenant you want to own.</p></div>
 <div class="chips" role="group" aria-label="Filter by sector"><button class="chip" aria-pressed="true" data-v="all">All<sup>${listings.length}</sup></button>${Object.entries(secCount).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<button class="chip" aria-pressed="false" data-v="${k}">${SEC[k] || k}<sup>${n}</sup></button>`).join('')}</div>
 <div class="grid">${byPrice.concat(listings.filter((l) => !l.price)).slice(0, 24).map(card).join('')}</div>
 <div class="lst__more"><span id="lcount" aria-live="polite">Showing the 24 largest</span><a class="btn btn--ln" href="/net-lease-properties/">All ${listings.length} listings ${arrow}</a></div>
</div></section>

<section class="feat dk" id="featured" aria-labelledby="ft-h"><img src="${feat.img}" alt="${esc(feat.name)}, ${esc(feat.city)}, ${feat.state}" loading="lazy">
 <div class="wrap"><div class="sheet" data-r><p class="label">Featured property</p><h2 class="t2" id="ft-h">${esc(feat.name)}</h2><p>${esc(feat.address)}, ${esc(feat.city)}, ${feat.state}. A 20-year absolute NNN ground lease with one of the largest supercenter retailers in the United States.</p>
  <dl><div><dt>Asking</dt><dd>${fmt(feat.price)}</dd></div><div><dt>Building</dt><dd>${esc(feat.sizeDisplay || '—')}</dd></div><div><dt>Lease</dt><dd>20-yr absolute NNN</dd></div><div><dt>Type</dt><dd>${esc(feat.subType || feat.propertyType)}</dd></div></dl>
  <a class="btn btn--cu" href="mailto:info@fortisnetlease.com?subject=${encodeURIComponent('Offering memorandum: ' + un(feat.name) + ', ' + feat.city)}">Request the offering memorandum ${arrow}</a></div></div></section>

<section class="ppl" id="people" aria-labelledby="ppl-h"><div class="wrap">
 <div class="sh sh--split"><div><p class="label">Advisors</p><h2 class="t2" id="ppl-h" style="margin-top:1rem">Founded by three in 2009. <span class="foil">Still at the desk.</span></h2><span class="survey"></span></div><p class="lede">Started in the worst financial crisis in a generation by Robert Bender, Doug Passon and Bryan Bender. Every advisor below answers their own phone.</p></div>
 <div class="partners">${partners.map((t, i) => `<a class="pcard" href="${tel(t.phone)}" data-r style="--d:${i}"><img src="${t.headshot}" alt="${esc(t.name)}" loading="lazy"><span class="pcard__t"><b>${esc(t.name)}</b><span>${esc(t.title)}</span><i>${esc(t.phone || '')}</i></span></a>`).join('')}</div>
 <div class="dir">${advisors.map((t) => `<a href="${tel(t.phone)}"><b>${esc(t.name)}</b><span>${esc(t.title)}<br>${esc(t.phone || '')}</span></a>`).join('')}</div>
</div></section>

<section class="quote" aria-label="Client testimonial"><div class="wrap"><p class="label">In their words</p><blockquote>“${esc(quote.quote.replace(/^["“]|["”]$/g, '').trim())}”</blockquote><cite>${esc(quote.attribution)}</cite></div></section>

<section class="ins" id="insights" aria-labelledby="ins-h"><div class="wrap">
 <div class="sh"><p class="label">Insights</p><h2 class="t2" id="ins-h">From the desk.</h2><span class="survey"></span></div>
 <div class="ins__list">${H.news.map((n) => `<a href="${n.url || n.source || 'https://fortisnetlease.com/net-lease-news/'}"><time>${esc(n.date)}</time><span><b>${esc(n.title)}</b><small>${esc(un(n.excerpt || '').slice(0, 140))}…</small></span>${arrow}</a>`).join('')}</div>
</div></section>

<section class="val dk" id="value" aria-labelledby="val-h"><div class="wrap val__g">
 <div><p class="label">For owners</p><h2 class="t2" id="val-h" style="margin-top:1rem">Name your tenant. <span class="foil">See our record first.</span></h2><span class="survey"></span><p class="lede" style="margin-top:1.4rem">Before you send us anything, see what we have already sold with that tenant. Then an advisor prices yours against it.</p>
  <form class="vf" id="vform" novalidate><label>Tenant<input name="tenant" id="vt" placeholder="e.g. Dollar General, Walgreens, Taco Bell" autocomplete="off"></label><label>Email<input name="email" type="email" placeholder="you@company.com" autocomplete="email"></label><button class="btn btn--cu" type="submit">Request a valuation ${arrow}</button><p class="vf__msg" id="vmsg" role="status"></p></form></div>
 <div class="match" aria-live="polite"><p class="label">Our record with this tenant</p><p class="match__h dim" id="mh">Type a tenant to see it.</p><ul id="ml"></ul><p class="match__sum" id="ms"></p></div>
</div></section>
</main>

<footer class="ftr"><div class="wrap"><div class="ftr__g">
 <div><img src="logo.png" alt="Fortis Net Lease" width="170" height="27"><p class="ftr__claim">Your net lease company.</p><a class="ftr__tel" href="${tel(phone)}">${phone}</a></div>
 <div><h2>Investors</h2><ul><li><a href="#properties">Properties</a></li><li><a href="#featured">Featured</a></li><li><a href="#services">1031 replacement</a></li></ul></div>
 <div><h2>Owners</h2><ul><li><a href="#value">Valuation</a></li><li><a href="#services">Sale-leasebacks</a></li><li><a href="#record">Track record</a></li></ul></div>
 <div><h2>Office</h2><ul><li>${esc(addr.street)}</li><li>${esc(addr.city)}, ${addr.state} ${addr.zip}</li><li><a href="mailto:info@fortisnetlease.com">info@fortisnetlease.com</a></li></ul></div>
</div><div class="ftr__bot"><span>© 2026 Fortis Net Lease</span><span>Listings via Buildout · Rates via U.S. Treasury (${ust10.asOf})</span></div></div></footer>
<script>window.RECORD=${JSON.stringify(record)};</script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>
<script src="app.js" defer></script>
</body></html>`;
fs.mkdirSync('site', { recursive: true });
fs.writeFileSync('site/index.html', html);
for (const f of ['styles.css', 'app.js', 'logo.png']) fs.copyFileSync('site-src/' + f, 'site/' + f);
for (const f of ['fortis.css', 'posts.js']) fs.rmSync('site/' + f, { force: true });
console.log('site/index.html', (html.length / 1024).toFixed(1) + 'KB');
const lp = buildListingPages({ listings, LJ, esc, un, fmt, tel, arrow, SEC, phone, addr, ust10 });
console.log('listing pages', lp.count, '· legacy redirects', lp.redirects, '· sitemap.xml, robots.txt');
