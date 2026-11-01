// Shared normalisation helpers for the Buildout listing feed and harvested data.
// Listing model: ARCHITECTURE.md section 6. Nothing here invents a value: a
// field that the feed or harvest does not state stays null.

export const STATES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
  CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho',
  IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas',
  UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia',
  WI: 'Wisconsin', WY: 'Wyoming', DC: 'District of Columbia'
};
const STATE_BY_NAME = Object.fromEntries(Object.entries(STATES).map(([k, v]) => [v.toLowerCase(), k]));

export function slugify(s) {
  return String(s || '')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/&/g, ' and ').replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function decodeEntities(s) {
  return String(s ?? '')
    .replace(/&#8211;|&ndash;/g, '–').replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#8217;|&rsquo;|&#039;|&#39;/g, '’').replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&#8220;|&ldquo;/g, '“').replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&nbsp;|&#160;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

export function money(s) {
  if (s == null) return null;
  const n = Number(String(s).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}
export function pct(s) {
  if (s == null) return null;
  const n = Number(String(s).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 && n < 30 ? n : null;
}
export function intOf(s) {
  if (s == null) return null;
  const n = parseInt(String(s).replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// Strip HTML fragments the harvest captured at the end of Buildout copy.
export function cleanCopy(s) {
  if (!s) return '';
  let t = decodeEntities(String(s));
  t = t.replace(/<h2[^>]*$/i, '').replace(/<[^>]*>?/g, ' ');
  t = t.replace(/^\s*>?\s*Location Description\s*/i, '').replace(/^\s*>\s*/, '');
  return t.replace(/\s+/g, ' ').trim();
}

// Tenant canonicalisation. Aliases come from the names exactly as stated in
// the Buildout feed (tenant_as_stated / display_name). Order matters.
export const TENANT_RULES = [
  // Family Dollar / Dollar Tree combo stores roll up to Family Dollar, as in
  // the ARCHITECTURE.md hub counts (Family Dollar 11 live).
  ['dollar-general', 'Dollar General', /dollar\s*general/i],
  ['family-dollar', 'Family Dollar', /family\s*dollar/i],
  ['dollar-tree', 'Dollar Tree', /dollar\s*tree/i],
  ['7-eleven', '7-Eleven', /7[-\s]?eleven|speedway/i],
  ['taco-bell', 'Taco Bell', /taco\s*bell/i],
  ['joe-hudsons-collision-center', "Joe Hudson's Collision Center", /joe\s*hudson/i],
  ['dutch-bros', 'Dutch Bros', /dutch\s*bros/i],
  ['burger-king', 'Burger King', /burger\s*king/i],
  ['kfc', 'KFC', /\bkfc\b/i],
  ['firestone', 'Firestone Complete Auto Care', /firestone/i],
  ['biggby-coffee', 'Biggby Coffee', /biggby/i],
  ['7-brew', '7 Brew', /7\s*brew/i],
  ['walgreens', 'Walgreens', /walgreen/i],
  ['cvs', 'CVS', /\bcvs\b/i],
  ['davita', 'DaVita', /davita/i]
];

export function tenantOf(name) {
  const s = String(name || '');
  for (const [key, label, re] of TENANT_RULES) if (re.test(s)) return { key, name: label };
  const label = decodeEntities(s).replace(/\s+/g, ' ').trim();
  return { key: slugify(label), name: label };
}

// Lease structure only when the listing title states it.
export function leaseTypeFromTitle(name) {
  const s = String(name || '');
  if (/ground\s*lease/i.test(s)) return 'Ground lease';
  if (/\(NNN\)|\bNNN\b|triple\s*net/i.test(s)) return 'NNN';
  if (/\(NN\)|\bNN\b|double\s*net/i.test(s)) return 'NN';
  return null;
}

// Sector buckets used by property-type hubs (ARCHITECTURE.md 2.1).
export const SECTORS = {
  'dollar-stores': { name: 'Dollar stores', closingCategory: 'DOLLAR STORES', sectorVolume: 'Dollar Stores' },
  'restaurants': { name: 'Restaurants (QSR and casual dining)', closingCategory: 'QSR | CASUAL DINING', sectorVolume: 'QSR / Casual Dining' },
  'auto': { name: 'Auto related', closingCategory: 'AUTO RELATED', sectorVolume: 'Auto Related' },
  'drug-stores': { name: 'Drug stores', closingCategory: 'DRUG STORE', sectorVolume: 'Drug Store' },
  'medical-office-industrial': { name: 'Medical, office and industrial', closingCategory: 'MEDICAL | OFFICE | INDUSTRIAL', sectorVolume: 'Medical | Office | Industrial' },
  'multi-tenant-retail': { name: 'Multi-tenant retail', closingCategory: 'MULTI-TENANT RETAIL', sectorVolume: 'Multi – Tenant Retail' }
};
const QSR = /taco bell|burger king|kfc|dutch bros|7 brew|biggby|red robin|pizza hut|coffee|restaurant|mcdonald|wendy|arby|chick|popeyes|starbucks|scooter/i;
const AUTO = /collision|auto|firestone|safelite|crash champions|tire|car wash|oil/i;
const DRUG = /walgreens|cvs|rite aid|pharmacy/i;

export function sectorOf({ tenantKey, name, propertyType, subType }) {
  const all = `${name} ${subType}`;
  if (/dollar/.test(tenantKey)) return 'dollar-stores';
  if (DRUG.test(all)) return 'drug-stores';
  if (QSR.test(all) || /restaurant/i.test(subType || '')) return 'restaurants';
  if (AUTO.test(all) || /auto repair|vehicle/i.test(subType || '')) return 'auto';
  if (/center|plaza|mall|neighborhood|street retail|shopping/i.test(`${name} ${subType}`) && !/freestanding/i.test(subType || '')) return 'multi-tenant-retail';
  if (/office|industrial|medical/i.test(`${propertyType} ${subType}`)) return 'medical-office-industrial';
  return null;
}

export function stateFromLocation(loc) {
  const s = String(loc || '');
  const m = s.match(/,\s*([A-Z]{2})\b/);
  if (m && STATES[m[1]]) return m[1];
  const lower = s.toLowerCase();
  for (const [name, code] of Object.entries(STATE_BY_NAME)) if (lower.includes(name)) return code;
  return null;
}
