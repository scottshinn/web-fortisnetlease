#!/usr/bin/env node
// Market rates for the home ticker (design.md 8.3): 10Y and 5Y UST from the
// U.S. Treasury daily par yield curve, SOFR from the NY Fed. Writes
// data/rates.json. On failure the file records ok:false and the build
// hides the band rather than show stale values.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.join(ROOT, 'data', 'rates.json');

async function get(url, as = 'text') {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(url, { signal: ctl.signal, headers: { 'user-agent': 'Mozilla/5.0 (FortisNetLease-site-build)' } });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
    return as === 'json' ? r.json() : r.text();
  } finally { clearTimeout(t); }
}

function mdyToIso(s) { const [m, d, y] = s.split('/'); return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`; }

async function main() {
  try {
    const year = new Date().getFullYear();
    const csv = await get(`https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/${year}/all?type=daily_treasury_yield_curve&field_tdr_date_value=${year}&page&_format=csv`);
    const lines = csv.trim().split(/\r?\n/);
    const head = lines[0].split(',').map((h) => h.replace(/"/g, ''));
    const i10 = head.indexOf('10 Yr'); const i5 = head.indexOf('5 Yr');
    const [r0, r1] = lines.slice(1, 3).map((l) => l.split(','));
    const sofr = await get('https://markets.newyorkfed.org/api/rates/secured/sofr/last/2.json', 'json');
    const [s0, s1] = sofr.refRates;
    const out = {
      ok: true,
      fetchedAt: new Date().toISOString(),
      rates: [
        { key: 'ust10', label: '10Y UST', value: +r0[i10], prev: +r1[i10], asOf: mdyToIso(r0[0]), source: 'U.S. Treasury' },
        { key: 'ust5', label: '5Y UST', value: +r0[i5], prev: +r1[i5], asOf: mdyToIso(r0[0]), source: 'U.S. Treasury' },
        { key: 'sofr', label: 'SOFR', value: s0.percentRate, prev: s1.percentRate, asOf: s0.effectiveDate, source: 'NY Fed' }
      ]
    };
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
    console.log(`[fetch-rates] ok: 10Y ${out.rates[0].value} (${out.rates[0].asOf}), SOFR ${out.rates[2].value} (${out.rates[2].asOf})`);
  } catch (e) {
    fs.writeFileSync(OUT, JSON.stringify({ ok: false, error: e.message, fetchedAt: new Date().toISOString() }, null, 1));
    console.warn(`[fetch-rates] failed (${e.message}); ticker will be hidden.`);
  }
}
main();
