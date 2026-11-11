#!/usr/bin/env node
// Pull the public Buildout inventory at build time into data/listings.json.
// ARCHITECTURE.md section 7. Detail copy, images and demographics come from
// the harvested detail views (harvest/data.json), merged by Buildout ID, because
// kept only as a fallback when a live detail page fails (see buildout-detail.mjs).
//
// Fallbacks, in order:
//   1. live inventory.json (paged)                 -> source "buildout-live"
//   2. last good data/listings.json snapshot    -> source kept, flagged stale
//   3. harvest/data.json listings_live_buildout     -> source "harvest-seed"
// Guard: if the live count drops more than 30% versus the last snapshot, keep
// the snapshot (protects the site from a feed outage).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchDetail } from './buildout-detail.mjs';
import { tenantOf, slugify, money, pct, intOf, cleanCopy, leaseTypeFromTitle, sectorOf, STATES } from './normalize.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.join(ROOT, 'data', 'listings.json');
const SNAP_DIR = path.join(ROOT, 'data', 'snapshots');
const TOKEN = '8c286e4a49fdc706359ab9c041e0db1465de1fcf';
const TYPES = [1, 2, 3, 7, 104];
const OFFLINE = process.argv.includes('--offline') || process.env.FNL_OFFLINE === '1';

function feedUrl(page) {
  const q = new URLSearchParams();
  q.set('page', String(page));
  q.set('q[sale_or_lease_eq]', 'sale');
  q.append('q[s][]', 'sale_price desc');
  for (const t of TYPES) q.append('q[type_eq_any][]', String(t));
  q.set('viewType', 'list');
  return `https://buildout.com/plugins/${TOKEN}/inventory.json?${q}`;
}

async function fetchJson(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const res = await fetch(url, { signal: ctl.signal, headers: { 'user-agent': 'FortisNetLease-site-build/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally { clearTimeout(timer); }
}

async function fetchInventory() {
  const all = [];
  for (let page = 0; page < 40; page++) {
    const j = await fetchJson(feedUrl(page));
    const items = j.inventory || [];
    if (!items.length) break;
    all.push(...items);
    if (j.meta && all.length >= j.meta.total) break;
  }
  return all;
}

const harvest = JSON.parse(fs.readFileSync(path.join(ROOT, 'harvest', 'data.json'), 'utf8'));
const seedById = new Map(harvest.listings_live_buildout.map((l) => [String(l.buildout_id), l]));

function demographics(details = {}) {
  const rows = ['Total population', 'Total households', 'Average household income', 'Median value', 'Average age'];
  const out = [];
  for (const r of rows) {
    const v = details[r];
    if (!v) continue;
    const parts = String(v).trim().split(/\s+/);
    if (parts.length === 3) out.push({ label: r, values: parts });
  }
  return out;
}

// NOI sanity: some harvested NOI values are clearly truncated ("$665" on an
// $8.4M asset). Never show a figure that cannot be an annual NOI.
function plausibleNoi(noi, price) {
  if (!noi) return null;
  if (price && noi < price * 0.01) return null;
  return noi;
}

function normalise(feed, seed) {
  const id = String(feed?.id ?? seed?.buildout_id);
  const name = (feed?.display_name || feed?.name || seed?.name || '').trim();
  const stated = (seed?.tenant_as_stated || name).trim();
  const tenant = tenantOf(stated);
  const city = feed?.city || seed?.city || '';
  const state = (feed?.state || seed?.state || '').toUpperCase();
  const priceStated = seed?.price || (feed?.index_attributes || []).find((a) => a[0] === 'Price')?.[1] || null;
  const price = money(priceStated);
  const capRate = pct(seed?.cap_rate || seed?.all_details?.['Cap Rate']);
  const leaseTerm = seed?.lease_term || null;
  const noi = plausibleNoi(money(seed?.noi || seed?.all_details?.NOI), price);
  const propertyId = feed?.show_link ? new URL(feed.show_link).searchParams.get('propertyId') : seed?.property_id;
  const subType = feed?.property_sub_type_name || seed?.sub_type || null;
  const propertyType = seed?.property_type || null;
  const status = feed ? (feed.closed ? 'Closed' : feed.under_contract ? 'Under contract' : 'Available') : (seed?.status || 'Available');
  const brokers = (feed?.broker_contacts || seed?.brokers || []).map((b) => ({ name: b.name, email: (b.email || '').toLowerCase(), phone: b.phone || null }));
  const images = (seed?.images || []).filter(Boolean);
  const hero = seed?.hero_image || feed?.photo_url || feed?.large_thumbnail_url || null;
  const slug = `${slugify(tenant.name === stated ? name : tenant.name)}-${slugify(city)}-${state.toLowerCase()}-${id}`.replace(/-+/g, '-');
  const l = {
    id,
    propertyId,
    slug,
    name: name || stated,
    tenantStated: stated,
    tenantKey: tenant.key,
    tenantName: tenant.name,
    address: (feed?.address || (seed?.address || '').split(',')[0] || '').trim(),
    city,
    state,
    stateName: STATES[state] || state,
    zip: feed?.zip || seed?.zip || null,
    lat: feed?.latitude ?? seed?.lat ?? null,
    lng: feed?.longitude ?? seed?.lng ?? null,
    price,
    priceDisplay: price ? null : (priceStated || 'Call for offer'),
    capRate,
    noi,
    leaseTermRemaining: leaseTerm,
    leaseType: leaseTypeFromTitle(name),
    guarantee: null,
    sizeSf: intOf(feed?.size_summary || seed?.size),
    sizeDisplay: feed?.size_summary || seed?.size || null,
    yearBuilt: intOf(seed?.year_built || seed?.all_details?.['Year Built']),
    propertyType,
    subType,
    status,
    brokers,
    description: cleanCopy(seed?.description),
    locationDescription: cleanCopy(seed?.location_description),
    highlights: (seed?.investment_highlights || []).map(cleanCopy).filter(Boolean),
    heroImage: hero,
    photoUrl: feed?.photo_url || feed?.large_thumbnail_url || null,
    images,
    hasOm: Boolean(feed?.pdf_url || seed?.om_pdf),
    demographics: demographics(seed?.all_details),
    legacyUrls: propertyId ? [`/net-lease-properties/?propertyId=${propertyId}`] : [],
    detailSource: seed?.detail_live ? 'Buildout plugin detail page (live)' : seed ? 'harvest/data.json listings_live_buildout (detail view, 2026-11-01)' : 'Buildout inventory.json summary only'
  };
  l.sector = sectorOf({ tenantKey: l.tenantKey, name: `${l.name} ${l.tenantStated}`, propertyType, subType });
  return l;
}

// Detail pages, four at a time. A failed detail falls back to the harvest seed.
async function fetchDetails(feed) {
  const out = new Map(); const queue = feed.filter((f) => f.show_link);
  async function worker() {
    for (let f; (f = queue.shift());) {
      const pid = new URL(f.show_link).searchParams.get('propertyId');
      if (!pid) continue;
      try { const d = await fetchDetail(TOKEN, pid); if (d) out.set(String(f.id), d); }
      catch (e) { console.warn(`[fetch-listings] detail ${pid} failed (${e.message}); using harvest copy.`); }
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);
  return out;
}

function readSnapshot() {
  try { return JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { return null; }
}

function withdrawnFrom(listings) {
  const live = new Set(listings.map((l) => l.id));
  return harvest.listings_live_buildout
    .filter((s) => !live.has(String(s.buildout_id)))
    .map((s) => { const n = normalise(null, s); return { id: n.id, propertyId: n.propertyId, slug: n.slug, tenantKey: n.tenantKey, state: n.state }; });
}

async function main() {
  const now = new Date().toISOString();
  const prev = readSnapshot();
  let result;
  if (!OFFLINE) {
    try {
      const feed = await fetchInventory();
      const details = await fetchDetails(feed);
      const listings = feed.map((f) => { const d = details.get(String(f.id)); const seed = seedById.get(String(f.id)); return normalise(f, d ? { ...seed, ...d, brokers: seed?.brokers, detail_live: true } : seed); });
      console.log(`[fetch-listings] live detail for ${details.size}/${feed.length} listings.`);
      const prevCount = prev?.listings?.length || harvest.listings_live_buildout.length;
      if (listings.length < prevCount * 0.7) {
        console.warn(`[fetch-listings] guard tripped: live ${listings.length} < 70% of previous ${prevCount}. Keeping snapshot.`);
      } else {
        result = { fetchedAt: now, source: 'buildout-live', feed: 'https://buildout.com/plugins/<token>/inventory.json', count: listings.length, listings, withdrawn: withdrawnFrom(listings) };
      }
    } catch (e) {
      console.warn(`[fetch-listings] live fetch failed (${e.message}). Falling back.`);
    }
  }
  if (!result && prev?.listings?.length) {
    result = { ...prev, stale: true, fallbackAt: now };
    console.warn(`[fetch-listings] using last good snapshot from ${prev.fetchedAt} (${prev.listings.length} listings).`);
  }
  if (!result) {
    const listings = harvest.listings_live_buildout.map((s) => normalise(null, s));
    result = { fetchedAt: harvest._meta.harvested_on, source: 'harvest-seed', count: listings.length, listings, withdrawn: [] };
    console.warn(`[fetch-listings] using harvest seed (${listings.length} listings).`);
  }
  const missing = result.listings.filter((l) => !l.id || !l.slug || !l.city || !l.state);
  if (missing.length) throw new Error(`Required listing fields missing for: ${missing.map((m) => m.id).join(', ')}`);
  const dupes = result.listings.map((l) => l.slug).filter((s, i, a) => a.indexOf(s) !== i);
  if (dupes.length) throw new Error(`Duplicate listing slugs: ${dupes.join(', ')}`);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(result, null, 1));
  if (result.source === 'buildout-live') {
    fs.mkdirSync(SNAP_DIR, { recursive: true });
    fs.writeFileSync(path.join(SNAP_DIR, `listings-${now.slice(0, 10)}.json`), JSON.stringify({ fetchedAt: now, ids: result.listings.map((l) => l.id) }));
  }
  console.log(`[fetch-listings] ${result.listings.length} listings (${result.source}); ${result.withdrawn?.length || 0} withdrawn since harvest.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
