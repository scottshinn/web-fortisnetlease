// Buildout listing detail, read from the same public plugin page the
// fortisnetlease.com iframe opens when a visitor clicks a listing:
//   https://buildout.com/plugins/<token>/fortisnetlease.com/inventory/<propertyId>?pluginId=0&iframe=true&embedded=true&propertyId=<propertyId>
// Captured from a browser network log on 2026-11-11. Whether Buildout's terms
// allow this programmatic use is still open (FACTS-TO-CONFIRM #32).
// The page is server-rendered HTML; without a browser user agent Buildout
// returns a 7 KB script shell instead, so the request sends one.
// Returns the same shape as harvest/data.json listings_live_buildout[] so
// normalise() can use either source.

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

export function detailUrl(token, propertyId) {
  const id = encodeURIComponent(propertyId);
  return `https://buildout.com/plugins/${token}/fortisnetlease.com/inventory/${id}?pluginId=0&iframe=true&embedded=true&propertyId=${id}`;
}

const text = (s) => String(s || '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ').trim();

export function parseDetail(html) {
  if (!html || !html.includes('pdt-subheader')) return null;
  const all = {};
  // Property details table: <td><strong>Key</strong></td><td>Value</td>
  for (const m of html.matchAll(/<tr><td><strong>([^<]+)<\/strong><\/td><td>([\s\S]*?)<\/td><\/tr>/g)) all[text(m[1])] = text(m[2]);
  // Demographics rows: <td><b>Key</b></td><td>a</td><td>b</td><td>c</td>
  for (const m of html.matchAll(/<tr>\s*<td><b>([^<]+)<\/b><\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>/g)) {
    all[text(m[1])] = [m[2], m[3], m[4]].map(text).join(' ');
  }
  const para = (slug) => { const m = html.match(new RegExp(`<p slug="${slug}"[^>]*>([\\s\\S]*?)</p>`)); return m ? text(m[1]) : ''; };
  const hl = html.match(/slug="highlights_custom_text"[^>]*>([\s\S]*?)<\/ul>/);
  const highlights = hl ? [...hl[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => text(m[1])).filter(Boolean) : [];
  const images = [...new Set([...html.matchAll(/data-img-url="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&')))];
  const docs = html.match(/id="js-public-docs"[\s\S]*?<a[^>]*href="([^"]+)"/);
  return {
    all_details: all,
    price: all.Price || null,
    cap_rate: all['Cap Rate'] || null,
    noi: all.NOI || null,
    lease_term: all['Lease Term'] || all['Lease Term Remaining'] || null,
    lease_type: all['Lease Type'] || null,
    size: all.Size || all['Building Size'] || null,
    year_built: all['Year Built'] || null,
    property_type: all['Property Type'] || null,
    description: para('description_description_value'),
    location_description: para('location_description_location_description_value'),
    investment_highlights: highlights,
    hero_image: images[0] || null,
    images,
    om_pdf: docs ? docs[1].replace(/&amp;/g, '&') : null
  };
}

export async function fetchDetail(token, propertyId, timeoutMs = 20000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(detailUrl(token, propertyId), { signal: ctl.signal, headers: { 'user-agent': UA, accept: 'text/html' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parseDetail(await res.text());
  } finally { clearTimeout(t); }
}
