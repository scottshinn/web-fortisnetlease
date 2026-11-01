# Fortis Net Lease: reference set

Captured 2026-11-01 with `.agents/skills/_website-system/scripts/rolodex.mjs capture` into `./rolodex` (desktop 1440 / tablet 768 / mobile 390). Each capture is the **homepage only**, one page per site. Paths below are relative to `rolodex/`. Curated with `curate`, checked with `validate` (18 records, all artifacts verified), and listed with `search` and `index`. Only public web sources were used. No older Fortis project files were opened.

## Capture coverage (read first)

Bot protection blocked most of the big net lease brokerages. Bundled Chromium failed, and so did installed Chrome with a 5 s settle time:

| Site | Result |
|---|---|
| SRS, Northmarq, Stan Johnson Co. | Cloudflare "Just a moment" challenge, blank render |
| Marcus & Millichap | "The request is blocked" |
| Hanley Investment Group, Carlyle | Cloudflare block page |
| Blackstone, Crexi | Cloudflare verification |
| Lazard | 403 |
| Calkain, Capital Pacific, NLCA, General Atlantic, Apollo, Brookfield | navigation failure, no record |
| Horvath & Tremblay, TPG | screenshots saved but the run failed (timeout / "not HTML"), so **no rolodex record**; used as evidence only |

The blocked records are curated with a `bot-protection` note so nobody mistakes them for design evidence. Observations for those firms below are marked **(not captured; general knowledge)** and need a manual check in a real browser before design.md is written.

## Per-site notes

### Matthews REIS (net lease / CRE): best usable CRE reference
Screenshots: `evidence/www-matthews-com-c01eada2c8/2026-11-01T06-49-26-972Z-78e3b570/desktop.png`; also `.../2026-11-01T06-48-07-147Z-be5c28cc/section-02.png`, `section-04.png`, `section-05.png`
- **Borrow:** a live rates ticker under the hero (SOFR, 5Y/10Y Treasury), which is utility net lease investors come back for. One hero CTA, "Find Your Next Investment". A single-line proof stat ("30+ offices | $88.37B in transactions"). A Market Intel block with one large report and three dated rows. Market reports split by metro and asset type ("Inland Empire Retail Q3 2026"), which is a scalable SEO engine. A newsletter field in the footer.
- **Avoid:** empty dark voids, outlined "REVOLUTIONIZED" hero type, and a tech-startup tone. A podcast block is off-strategy for Fortis.

### The Boulder Group (STNL specialist)
Screenshot: `evidence/www-bouldergroup-com-13c1ffa35b/2026-11-01T06-50-15-252Z-939a2035/desktop.png`
- **Borrow:** persistent "Property Alerts" and "Research Reports" email captures in the header, which is the right lead-capture intent. Third-party ranking proof (top-10 STNL by CoStar / MSCI RCA, $11B+ since 1997). Boulder is known for its quarterly Net Lease Market Report (cap rates by sector), and Fortis should own a comparable research series.
- **Avoid:** a 3D-rendered McDonald's hero, all-caps grey type, no listings or stats above the fold, and dated 2010s styling.

### Horvath & Tremblay (net lease) *(evidence only, no record)*
Screenshot: `evidence/www-horvathtremblay-com-9b20cd2947/2026-11-01T08-00-39-771Z-8787b359/desktop.png`
- **Borrow:** an "At a Glance" stat band, a band of press and recognition logos (BBJ, CPE, Connect CRE, Crexi, GlobeSt), and a "Stay in touch: listings newsletter" CTA.
- **Avoid:** count-up stats that render **$0B+ / 0+ / 0** without JS or with reduced motion (a real failure mode, so stats must ship as real numbers in the HTML). A hero video that leaves a grey void.

### Atlantic Retail (retail brokerage)
Screenshot: `evidence/www-atlanticretail-com-b216d8c6f3/2026-11-01T08-01-50-775Z-bda76bbc/desktop.png`
- **Borrow:** large serif display headings with an eyebrow label and a thin rule, which feels editorial and trustworthy. Real aerial drone photography. A US map with callout lines to offices. **"Tenants" as a top-level nav item.**
- **Avoid:** a generic grid of blue circle icons.

### NNN Pro Group (net lease)
Screenshot: `evidence/www-nnnpro-com-6811112557/2026-11-01T08-00-03-293Z-16047141/desktop.png`
- **Borrow:** a tax-education page in the main nav ("Bonus Depreciation") and an account icon for gated buyer accounts.
- **Note:** only the nav and the cookie modal rendered in the capture.

### KKR (premium PE)
Screenshot: `evidence/www-kkr-com-e3a6a9b463/2026-11-01T06-57-50-347Z-0039e5b0/desktop.png`
- **Borrow:** outlined stat cards with category labels and an **"As of" date footnote**. A "Who We Serve" two-column audience split, which maps to Buyers / Sellers / 1031 / Developers. Light-weight headlines in a single brand colour. Alternating white, pale grey and dark sections. A newsletter band.
- **Avoid:** an oversized cookie banner and a heavy 50th-anniversary graphic.

### Evercore (premium advisory)
Screenshot: `evidence/www-evercore-com-176229fa21/2026-11-01T08-02-37-027Z-42c80417/desktop.png`
- **Borrow:** 50/50 split panels, with copy on white and oversized condensed stats on deep navy with a fine line texture. A **Featured Transactions** carousel (logo, deal, role, value), which becomes the Fortis "Recently Closed" tombstone: tenant logo, city/state, price, cap rate, rep side.
- **Avoid:** low-contrast mosaic tiles.

### TPG (premium PE) *(evidence only, no record)*
Screenshot: `evidence/www-tpg-com-85f4b8024e/2026-11-01T08-02-13-977Z-5031f8cc/desktop.png`
- **Borrow:** a huge light-weight sans hero with a one-line proof stat. An "At a Glance" 2x2 stat grid. Platform cards (thin icon, figure, one line, coloured bottom rule), which become property-type cards: QSR, Dollar, Pharmacy, Auto, Medical, Industrial.
- **Avoid:** carousels for news.

### Bessemer Trust (premium wealth)
Screenshot: `evidence/www-bessemertrust-com-b6526d895e/2026-11-01T06-52-03-861Z-8d2156ee/desktop.png`
- **Borrow:** heritage serif type with an italic accent line, deep brand colour, real architectural photography, and a "How can we help you?" search in the header. This is the strongest "trusted for generations" cue in the set.
- **Avoid:** a permanent left nav panel that takes about 23% of the width, and a cookie dialog that covers the H1.

### Not captured (general knowledge, verify manually)
- **SRS:** a dedicated net lease properties search with filters (tenant, state, cap rate, price) and a map/list toggle. Large research and cap rate reports.
- **Marcus & Millichap:** a very large set of listing pages and market-report pages by metro, plus agent profile pages. This is the benchmark for SEO scale.
- **Stan Johnson Co. / Calkain / Hanley:** a track-record and closed-deals focus. Hanley publishes retail research and tenant-specific content.
- **Northmarq:** strong team/people directory patterns.
- **Crexi:** marketplace listing-card conventions (tenant, cap rate, price, NOI, lease term), which buyers already expect.

## Synthesis: patterns for a premium NNN brokerage

1. **Tone:** a private-bank look (Bessemer/KKR/Evercore) over a working CRE marketplace. Use a serif display face for headings, a quiet sans for data, one deep brand colour (navy or green) with a warm neutral, and lots of white space. Use real photography of real assets and no 3D renders.
2. **Hero:** a short value line, a primary "Search Properties" action, a secondary "Request a Valuation" action, and a rates/market ticker (Matthews) as a reason to return.
3. **Track record band:** 3 or 4 audited numbers, each with an "as of" date (KKR/TPG), rendered as real HTML (not count-up from 0, which is the H&T failure). Add third-party rankings (Boulder) and press logos (H&T).
4. **Listing search UX** (SRS/Crexi conventions): filters for tenant, property type, state, price, cap rate, lease term remaining, and lease type (NNN / NN / ground). Map/list toggle. Shareable URL state.
5. **Property card:** photo, tenant logo or name, city/state, price, **cap rate** (large), NOI, lease term remaining, guarantee (corporate/franchisee), plus a status chip and a CTA to save or get the OM.
6. **Recently Closed tombstones** (Evercore): tenant, market, price, cap rate, rep side, broker link.
7. **Audience split** (KKR): Sellers / Buyers / 1031 Exchange / Developers & Owners, each with its own landing page.
8. **Lead capture:** "What's my property worth?" valuation form (address and tenant first, contact second). Buyer listing alerts filtered by tenant, state and cap rate (Boulder idea, done properly). Gated OM download. Research subscription.
9. **Team:** a filterable broker directory (state, specialty). Profiles carry closed-deal history and active listings.
10. **Research:** a quarterly cap rate report, tenant credit snapshots, and market reports by state.

## SEO opportunity notes

Page types competitors use or should rank with (verify volumes in a keyword tool):
- **Tenant pages:** "Dollar General for sale", "Walgreens NNN for sale", "Starbucks NNN for sale". Each needs live inventory, tenant credit profile, typical cap rate range, lease structure, recent Fortis closes, and an alert signup. This is the highest-intent long tail.
- **State/market pages:** "NNN properties for sale in Texas", "net lease properties Florida". Listings plus market cap rate stats, local brokers, and closed deals.
- **Tenant x state combos** (e.g. "Dollar General for sale in Ohio"), but only where real inventory or comps exist, to avoid thin pages.
- **Property-type hubs:** QSR, dollar stores, pharmacy, auto service, medical, industrial NNN, ground leases.
- **Research:** "net lease cap rates Q3 2026", "dollar store cap rates" (Boulder-style quarterly reports with charts and downloadable PDFs). These attract links and press citations.
- **Education/tools:** 1031 exchange guide and timeline, NNN vs NN vs absolute net, a cap rate calculator, bonus depreciation (NNN Pro). These capture top-of-funnel investors.
- **Listing detail pages:** `RealEstateListing`/`Offer` structured data, plus a unique description and data table per listing. Keep sold listings as "closed" proof pages instead of returning 404.
- **Broker profiles:** `Person` schema, a list of closed deals, and the state licence.
- **Tech note:** the blank render behind several competitors' bot walls, and H&T's $0 counters, show that SSR or static HTML for listings and stats is a real advantage.

## Rolodex commands used
```
node .agents/skills/_website-system/scripts/rolodex.mjs capture --url <url> --rolodex ./rolodex [--channel chrome --settle-ms 5000]
node .agents/skills/_website-system/scripts/rolodex.mjs curate --rolodex ./rolodex --site <id> --file <curation.json>
node .agents/skills/_website-system/scripts/rolodex.mjs validate --rolodex ./rolodex
node .agents/skills/_website-system/scripts/rolodex.mjs search --rolodex ./rolodex --industry net-lease
node .agents/skills/_website-system/scripts/rolodex.mjs index --rolodex ./rolodex
```
