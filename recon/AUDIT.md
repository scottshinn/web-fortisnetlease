# Fortis Net Lease: Live Site Audit (for redesign)

- **Artifact reviewed:** the live production site https://www.fortisnetlease.com (WordPress on Flywheel; listings come from an embedded Buildout plugin)
- **Date:** 2026-11-01
- **Reviewer:** an independent audit agent. It did not build the site, and it used only the live site and public sources.
- **Report state:** `changes required` (this is a baseline audit for a rebuild)
- **Capture conditions:** shared helper `rolodex.mjs capture --channel chrome --check-links 20`. Widths were 1440×1000, 768×1024 and 390×844, with UTC/en-US locale, reduced motion and an anonymous session. Mobile here means narrow viewport only, with no mobile user agent or touch.
- **Evidence root:** `capture/audit/rolodex/evidence/fortisnetlease-com-b1d5f61886/<capture-id>/`. Each capture holds `audit.md`, `audit.json`, `raw.html`, `*.rendered.html`, `*.extract.json`, `http.json`, `link-checks.json`, robots and sitemaps.

| Page sampled | Capture ID | Screenshots (copied into `capture/audit/`) |
|---|---|---|
| Home `/` | 2026-11-01T06-49-39-361Z-824c3732 | home-{desktop,tablet,mobile}.png |
| Listings `/net-lease-properties/` | 2026-11-01T06-47-09-462Z-9f612585 | properties-*.png |
| Contact `/contact/` | 2026-11-01T06-47-35-587Z-46a2489f | contact-*.png |
| Team `/our-agents/` → `/net-lease-advisors/` | 2026-11-01T06-48-07-431Z-4979c9ed | advisors-*.png |
| Guide `/what-is-a-net-lease/` | 2026-11-01T06-48-55-402Z-c1e47d71 | netlease-*.png |

The first home capture timed out at domcontentloaded (`2026-11-01T06-46-38-571Z-4d60dca1/failure.json`). A retry succeeded. Five sampled templates cannot establish the health of the whole site.

---

## 1. Technical SEO

### 1.1 HTTP, hosts and redirects
| Check | Result | Evidence |
|---|---|---|
| `www` to apex | **Fail (minor).** `https://www.fortisnetlease.com` returns 301 to `https://fortisnetlease.com/`. The brand's www URL is not canonical. Apex is the canonical everywhere, so this is consistent but costs one hop. | `curl -I` |
| http to https | Pass. 301 to `https://fortisnetlease.com/` | curl |
| Redirect chains | **Fail.** `/our-agents/` → `/net-lease-advisors` → `/net-lease-advisors/` is 2 hops, and the main nav links to the first URL. `/recently-closed/` → `/real-estate-investment-sales` drops the trailing slash, which adds another hop. `/testimonials/` → `/real-estate-testimonials/`. `/properties/` → `/net-lease-properties/`. | advisors `http.json`; curl |
| Soft 404 | Pass. `/does-not-exist-xyz/` returns 404 | curl |
| Cache headers | **Risk.** Pages are sent `cache-control: no-store, no-cache, must-revalidate`, so there is no HTML caching. `curl` time-to-first-byte from the audit machine was 1.2–2.0 s, but Lighthouse measured the root document at only 70–80 ms. TTFB is variable rather than consistently slow. | advisors `http.json`; curl `time_starttransfer` |
| Broken internal links | Pass for the sample. 20 links checked per page and no non-200 results apart from the redirects above. | `link-checks.json` |

### 1.2 Indexability and metadata
| URL | Title (length) | Issue |
|---|---|---|
| `/` | "Commercial Investment Real Estate" (33) | **No brand name.** It is generic, and `/page/2/` uses the **same title**. |
| `/home/` | "Home \| Fortis Net Lease \| Michigan's #1 Investment Real Estate Services - Fortis Net Lease" | **Duplicate home page.** It returns 200, canonicals to itself, is linked from the site and is listed in `page-sitemap.xml`. |
| `/page/2/` | same as home | A paginated copy of the home page, self-canonical |
| `/net-lease-properties/` | "Net Lease Properties - Fortis Net Lease Available Listings - Fortis Net Lease" (77) | Brand appears twice. There are **two H1s**: the logo "Fortis Net Lease" and the page heading. |
| `/contact/` | "Contact Us \| Fortis Net Lease \| Michigan's Top Real Estate Brokerage Firm - Fortis Net Lease" (92) | Too long, brand repeated, and it frames a national firm as "Michigan". The body fax (248) 254 3410 is the same as the phone number, while the footer fax is (248) 254-3405, so the NAP data conflict. |
| `/net-lease-advisors/` | "Net Lease Advisors … – Fortis Net Lease - Fortis Net Lease" | **`<meta name="robots" content="noindex, follow">` and no canonical.** The team page cannot be indexed and is missing from the sitemap. |
| `/what-is-a-net-lease/` | 78 chars | Two H1s (logo plus title). Otherwise this is the best content page. |

- **H1 pattern:** the logo is marked up as `<h1>Fortis Net Lease</h1>` on every template, so every page has either two H1s or an H1 that only says the brand. Contact's real heading is an H2. The helper flags `h1-count` and `heading-skip` on all 5 templates.
- **meta keywords:** a stuffed keyword list with personal names sits on every page. Search engines ignore it, and it looks dated.
- **Description:** "…the very best net lease investment property sales company in Michigan and nationwide." The positioning is regional and dated.
- **Open Graph:** `og:image` is missing on all 5 templates (`og-missing`).
- **Viewport:** `user-scalable=no` blocks pinch zoom, which fails WCAG 1.4.4.

### 1.3 Sitemaps and robots
- `robots.txt` is the "Default Flywheel robots file". It contains leftover calendar and events plugin rules, and it **disallows `/wp-content/uploads/`, which blocks Google from crawling every image on the site** (property photos, team headshots). It declares no `Sitemap:` line.
- The Yoast `sitemap_index.xml` lists **about 4,000+ attachment URLs**: `attachment-sitemap` 1–4 hold 1,000 each, and attachment5 is empty. These are thin media-attachment pages such as `/7-11/7-11-greensburg-pa/`, while the indexable `page-sitemap` holds only **17 pages**. The crawl budget goes to attachment pages instead of real content.
- `page-sitemap.xml` includes URLs that should not be there: `/intranet/intranet-files/` (also disallowed in robots, so the two contradict each other), `/closing-form/`, `/home/`, and stale press pages like `/april-2023-for-immediate-release/`. It is **missing `/net-lease-advisors/` and `/about-us/`**.
- There are **no listing URLs at all.** Properties live on buildout.com, inside an iframe.
- `llms.txt` returns 404. That is optional and only informational.

### 1.4 Rendering (is primary content in initial HTML?)
- **Listings: fail, and this is the largest SEO problem.** The raw HTML of `/net-lease-properties/` has 1,010 characters of text and 0 images. The inventory is an iframe from `buildout.com/plugins/…/inventory/?iframe=true`. Fortis's domain therefore has no crawlable listing pages, no per-property URLs, titles or schema, and no internal links to listings. Buildout and syndication sites get that equity instead. In the capture, the iframe area was still blank white at all 3 widths (`properties-*.png`), so the main page of the site looks empty while it loads.
- Home: raw text is 2,362 characters, and the rendered DOM at desktop is 3,326 characters. Some home copy (the counters and slider text) is injected by JavaScript. The other templates match between raw and rendered.
- No template has a `<main>` landmark, and the header and footer are not landmarks either (`landmarks: main 0, header 0, footer 0`).

### 1.5 Structured data
- Yoast emits a JSON-LD `@graph` with WebPage, Organization, BreadcrumbList, Person and ImageObject. Home declares Blog and BlogPosting, and the service pages are typed `Article`.
- **Missing:** `RealEstateAgent` or a `LocalBusiness` subtype with address and phone, which the site could support from its visible facts; `Person` entries for each advisor on the team page; listing entities such as `Offer`, `Place` or `RealEstateListing`; and `sameAs` links to social profiles (to verify). There is also no `FAQPage`-eligible content, which the guidance says not to chase anyway.
- The Schema.org validator and Rich Results Test were **not run**. Only JSON parsing and shape hints from the helper were done (`schema-shape` info items). **Status: unknown.**

### 1.6 Internal linking and images
- On desktop at 1440 the main navigation is hidden behind a hamburger, so there are no visible top-level nav links (`home-desktop.png`, `contact-desktop.png`).
- The helper flags links without a detected name (icon-only social links) on all templates.
- Images without an `alt` attribute: **8 of 9 on home and 20 of 27 on the team page** (`raw.extract.json`). Many images also lack width and height (`image-dimensions`).
- Form inputs have no programmatic label on every template, because the newsletter and contact forms use placeholders only (`input-label`).

---

## 2. Performance

Mobile Lighthouse (simulated throttling) was run for three pages. The JSON reports are in `recon/lighthouse/` as home.json, properties.json and contact.json. Results are in section 2.1.

Observations from the helper (unthrottled local lab run, so these are not field Core Web Vitals):
- TTFB is about 1.2–2.0 s on every HTML page, because there is no page cache (`no-store`).
- The helper flags `lab-lcp-risk` on listings, contact and advisors; `long-task-risk` and `large-script` on all templates.
- Each page loads about 19–21 scripts and 14 stylesheets, including jQuery from code.jquery.com and nouislider CSS on every page.
- Third parties on every page: Google Tag Manager, Google reCAPTCHA (`google.com` and `gstatic.com`), and it loads site-wide even on pages without a form because the footer has a newsletter form. Home also loads video.js from `vjs.zencdn.net`. Contact loads Google Maps JS (`maps.googleapis.com`). Listings loads the Buildout iframe app.
- Raw HTML for the advisors page is 84 KB decoded (14.9 KB gzip).

### 2.1 Lighthouse results (mobile, Lighthouse 12.8.2, simulated throttling, 2026-11-01)
| Page | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | Weight |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` (`home.json`) | **32** | 79 | 96 | 85 | 4.5 s | **6.7 s** | **1,630 ms** | 0.015 | 12.7 s | **6.2 MB** |
| `/net-lease-properties/` (`properties.json`) | **26** | 78 | 75 | 100 | 4.2 s | 5.6 s | 620 ms | **0.556** | 8.6 s | 3.1 MB |
| `/contact/` (`contact.json`) | **40** | 86 | 96 | 100 | 5.6 s | **8.4 s** | 840 ms | 0 | 7.0 s | 2.4 MB |

- Render-blocking resources: 14 to 17 per page, flagged by the legacy audit.
- Largest third-party payloads:
  - Home: Google CDN 386 KB, Brightcove video 340 KB, GTM 295 KB, jQuery 75 KB.
  - Listings: GTM 757 KB, Buildout 498 KB, CloudFront (Buildout assets) 469 KB, Google CDN 383 KB, Google Maps 260 KB.
  - Contact: Google CDN 737 KB, Google Maps 554 KB, GTM 295 KB.
- Listings CLS is 0.556. The Buildout iframe resizes after load, which is a poor result.
- Lighthouse accessibility failures on all three pages: `color-contrast`, `link-name`, `meta-viewport` (zoom disabled) and `target-size`. Home also fails `image-alt`.
- Home SEO scores 85, below the other two pages.
- The first home run failed in a batch and succeeded on a solo rerun. These are lab numbers, not field Core Web Vitals.

---

## 3. Visual / UX (1440, 768, 390)

| ID | Viewport | Evidence | Finding | Severity |
|---|---|---|---|---|
| V1 | all | properties-*.png | The listings page is a gradient title bar over a **blank white area**, because the iframe had not rendered by the capture's settle time. There are no filters, map or cards in the page's own HTML. The most important user journey therefore depends on a third-party widget. | Critical |
| V2 | 1440 vs 390 | home-desktop.png vs home-mobile.png | **The trust statistics differ between breakpoints.** Desktop shows $5+B / 2,131 closed / 190K reach / 22 states. Mobile shows $3+B / 1,324 / … / 12. These are either separate stale copies or counter-animation states, and both can't be true. It is a credibility risk. | High |
| V3 | 1440 | home-desktop.png (about y 1600–2350 in the original) | The "Grit & Gumption" section shows only a handshake icon on a large empty navy block. Its copy and CTA render at 390 but are missing in the desktop capture, possibly because they wait on a scroll animation. Needs checking with motion enabled. | High |
| V4 | 1440 | contact-desktop.png | Desktop navigation is hidden behind a hamburger. Listings, team and contact are not visible in the header, and there is no phone number or CTA in the header. | High |
| V5 | all | contact-*.png | Contact form uses placeholders only with no labels. The SMS consent checkbox text is tiny uppercase. The right half of the desktop page is empty, with no map, team contacts or response-time promise. The fax number conflicts with the footer. | Medium |
| V6 | all | footer in every screenshot | Footer text is mid-blue on navy, and the copyright line reads "2024 All Rights Reserved" in a near-invisible dark-on-dark color. This likely fails 4.5:1 contrast; it needs measuring. The copyright year is stale. | Medium |
| V7 | all | home-*.png | The hierarchy is a series of slogan blocks: "EXPOSURE", "#1", "Grit & Gumption", "Real Experience Real Results", "with REAL RELATIONSHIPS". There are no featured listings, no recent closings with cap rates or tenants, no advisor faces and no testimonials on the home page. "#1" is an unsupported claim. | High |
| V8 | 390 | home-mobile.png | Long single-column stack about 4,400 px tall. The stats are stacked one per row. There is no sticky contact or call CTA, and the CTA buttons change style between sections (outline, filled light blue, filled black). | Medium |
| V9 | all | meta viewport | Pinch zoom is disabled (`user-scalable=no`). | High (a11y) |
| V10 | all | `controls.json` | Focus states were not exercised interactively and the menu disclosure was not opened. **Unknown, needs a manual keyboard pass.** | — |

**Trust signals present:** volume stats (though inconsistent), a scrolling wall of client names, testimonials on a separate page, and a team page that is noindexed.
**Trust signals missing:** recent closings shown as a tombstone gallery, broker licensing and disclosures, press mentions, advisor bios with deal counts, and named tenants.

**Conversion paths:**
- Contact: the form works.
- Submit a property / request a BOV: **no dedicated route** (`/submit-property/` returns 404).
- Listing alerts: only a generic "Join our mailing list" with no criteria such as tenant, cap rate, state or price.
- Buyer and 1031 exchange intake: none.
- Click-to-call: only in the footer.

---

## 4. Content gaps vs a top NNN brokerage site
1. Crawlable on-domain listing pages for each property (tenant, cap rate, price, NOI, lease term, location, OM request form) plus a filterable index and a map.
2. A closed-deals tombstone archive with filters for tenant, state and year. `/real-estate-investment-sales/` exists but is thin.
3. Individual advisor pages with bio, specialties, closed deals, license number, direct phone and vCard.
4. Tenant pages such as Dollar General, 7-Eleven, Aspen Dental, Starbucks and AutoZone, with credit rating, typical lease structure and current Fortis inventory. The attachment slugs show these tenants are core business.
5. Seller services covering dispositions, BOV request and sale-leaseback, with a process timeline and proof. There is one sale-leaseback page.
6. Buyer and 1031 tools: an exchange timeline calculator, a cap-rate primer and a "match me to inventory" intake.
7. Market research and reports by quarter (cap-rate trends by tenant and sector). The news section is mostly press releases.
8. State and market landing pages, since the firm claims 22 states.
9. Testimonials attributed to named clients, integrated across the site instead of only on a separate page.
10. Compliance: brokerage license disclosures per state, and a fair-housing or equal-opportunity statement where relevant.

---

## 5. Top 15 problems (ranked)
1. **Listings live in a Buildout iframe.** There is no crawlable inventory, there are no property URLs, and the page renders blank at capture.
2. **The team page `/net-lease-advisors/` is `noindex`**, has no canonical, is missing from the sitemap and is reached through a 2-hop redirect from the nav.
3. **robots.txt disallows `/wp-content/uploads/`**, which blocks image crawling for all property and team photos.
4. **About 4,000 thin attachment pages are in the sitemap**, against 17 real pages, and the sitemap includes intranet and closing-form URLs.
5. **The home page is duplicated**: `/home/` is self-canonical and in the sitemap, and `/page/2/` reuses the home title.
6. **The home title has no brand** ("Commercial Investment Real Estate"), and the other titles double the brand or run to 92 characters.
7. **The trust statistics contradict each other** between desktop and mobile ($5B vs $3B, 22 vs 12 states).
8. **There is no submit-a-property or BOV route and no listing-alert criteria.** Conversion relies on one generic contact form.
9. **The home page is all slogans with no proof.** It shows no featured listings, closings or advisors.
10. **Poor performance.** Mobile Lighthouse scores are 26–40, LCP is 5.6–8.4 s, home TBT is 1.6 s and the home page weighs 6.2 MB. Listings CLS is 0.556. HTML is sent `no-store`, and about 20 scripts load on every page, including reCAPTCHA and GTM.
11. **The logo is an `<h1>` on every template**, which causes double H1s and broken heading outlines, and no template has `<main>`, header or footer landmarks.
12. **Accessibility**: zoom is disabled, inputs are placeholder-only, many images lack alt text (8 of 9 on home, 20 of 27 on the team page), and the footer contrast is low.
13. **Navigation is hamburger-only on desktop**, with no header phone or CTA.
14. **The structured data is generic Yoast.** There is no RealEstateAgent entity, no per-advisor Person and no listing entities.
15. **The data and branding are inconsistent**: the fax number conflicts, the copyright says 2024, the positioning says "Michigan's #1" for a national firm, stale 2022–2023 press pages are indexed, and a meta-keywords block is stuffed with names.

## 6. Where the rebuild wins
- **Own the inventory.** Server-render each listing at its own URL (for example `/properties/{tenant}-{city}-{state}/`) from the Buildout API or feed, with listing schema, OG images and internal links to tenant, state and advisor pages. This is the largest organic opportunity.
- **Tenant, state and advisor hub pages** built from the same data cover long-tail "Dollar General for sale" searches the site does not currently target.
- **Clean crawl surface.** Keep about 50–200 meaningful URLs in the sitemap, no attachment pages, allow uploads in robots, have one home URL, use single-hop redirects with 301 maps for the legacy slugs, and index the team page.
- **A proof-led home page.** Use one consistent set of stats from a single source, live featured listings, a recent-closings tombstone strip, advisor faces and named testimonials.
- **Dedicated conversion routes**: Submit a Property or BOV, 1031 buyer intake, criteria-based listing alerts, OM request on each listing, and a sticky call and contact CTA on mobile.
- **Speed.** Use static or edge-cached HTML, no jQuery, and reCAPTCHA loaded only on forms (or Turnstile). An LCP target of 2.5 s or less is realistic.
- **Accessibility built in**: real labels, `<main>` and landmarks, the logo not marked up as an H1, zoom enabled, and a contrast-checked palette.
- **Entity clarity**: a RealEstateAgent organization with consistent NAP, Person entities for advisors, and `sameAs` links to LinkedIn and other profiles.

---

## Pass / fail / unknown summary
- **Pass:** https enforced, real 404s, no broken links in the 20-link samples, self-canonicals on most pages, `lang` attribute set.
- **Fail:** listing rendering, team page noindex, robots blocking uploads, sitemap hygiene, duplicate home page, titles and H1s, landmarks, labels and alt text, zoom, caching, conflicting statistics.
- **Unknown:** Schema.org and Rich Results validation (not run), keyboard focus and the menu disclosure (not exercised), measured contrast ratios, field Core Web Vitals (no CrUX data pulled), and Search Console index coverage (no access).
- **Not applicable:** hreflang (single-locale site).

## Skill compliance
| Skill step | Followed | Output |
|---|---|---|
| technical-seo-qa: read the capture guide and SEO reference | Yes | — |
| Choose scope: production site, representative templates (home, listing index, contact, team, content), a redirect and a missing URL | Yes | table at top; curl checks for `/does-not-exist-xyz/`, `/our-agents/` |
| Run the helper `capture` with bounded `--check-links` on each sampled URL | Yes (`--check-links 20`, `--channel chrome` because the bundled Chromium was not installed) | `capture/audit/rolodex/evidence/.../{audit.md,audit.json,link-checks.json,...}` |
| Check 1, HTTP and rendering (raw vs rendered) | Yes | `raw.extract.json` vs `desktop.extract.json` text lengths; `http.json` |
| Check 2, indexing and metadata | Yes | section 1.2 |
| Check 3, structured data | Partial. The graph was inventoried, but the official validators were **not run** | section 1.5 (marked unknown) |
| Check 4, semantics and links | Yes | sections 1.4 and 1.6 |
| Check 5, crawler files (robots, sitemap index and children, llms) | Yes. The helper captured 8 sitemap files; ad-hoc `curl` was used to count all children because the helper caps at 8 files | section 1.3 |
| Check 6, accessibility and performance risks | Yes (lab only) | sections 1.6 and 2; Lighthouse is ad-hoc because the skills have no Lighthouse runner |
| Findings with severity, URL, artifact and fix | Yes | sections 3 and 5 |
| visual-qa: read the design review guide and capture at 1440, 768 and 390 | Yes | `capture/audit/*-{desktop,tablet,mobile}.png` |
| Read the PNGs | Yes (home, listings, contact) | findings V1–V8 |
| Exercise states (menu, focus, form errors) | **Not done.** No interactive state script was run, and no forms were submitted (by design) | V10 marked unknown |
| Independence: reviewer is not the implementer | Yes (audit of a live third-party build) | — |
