# Fortis Net Lease: information architecture and SEO route map

Planned 2026-11-01 from the live site and project files only: `harvest/data.json`, `harvest/urls.csv`, `recon/RECON.md`, `recon/AUDIT.md` and `recon/REFERENCES.md`. Older Fortis projects were not opened.

The machine-readable route map is `architecture.json`. It passed `rolodex.mjs validate --schema architecture`. The redirect map is `migration-301.csv`. Facts the owner must confirm are in `FACTS-TO-CONFIRM.md`.

## 1. Entity model

- **Business model:** `single-location`. There is one real office, the HQ at 30445 Northwestern Hwy, Suite #275, Farmington Hills, MI 48334, and the firm sells properties nationally. No other offices are published, so **no office or location pages** will be created and no office will be implied in any state.
- **The firm is not a storefront that serves a local area.** State pages describe **inventory and closed deals** (the property's location), not offices or service areas.
- **Entities, with stable `@id`:**
  - `https://fortisnetlease.com/#organization` is a `RealEstateAgent`, the most specific type that is accurate. It carries the HQ address and the main phone.
  - `/team/<slug>/#person` is one entity per advisor, linked to the organization through `worksFor`.
  - `/net-lease-properties/<slug>/#listing` is one entity per Buildout listing.
  - Services are separate `Service` entities whose `provider` is the organization.
- **Rules for facts and claims:**
  - Each fact has one source of truth: the Buildout feed, `content/*.json` or confirmed owner facts.
  - Visible copy and JSON-LD are both rendered from that same data.
  - Unconfirmed stats are not shown until the owner confirms them (see FACTS-TO-CONFIRM).

## 2. Page inventory (template → intent → primary keyword)

Keywords are intent targets taken from REFERENCES.md and site content. **Search volumes are unverified.** Check them in a keyword tool before writing copy.

| Path | Template | Intent | Primary keyword | Index |
|---|---|---|---|---|
| `/` | home | Brand and navigation; start a search or valuation | net lease brokerage | yes |
| `/net-lease-properties/` (URL preserved) | listings-index | Browse inventory | net lease properties for sale / NNN properties for sale | yes |
| `/net-lease-properties/<tenant>-<city>-<st>-<buildoutId>/` | listing-detail | Evaluate one asset and get the OM | "<tenant> <city> <ST> for sale" | yes |
| `/net-lease-properties/<state>/` | state-hub | Inventory in one state | NNN properties for sale in <State> | yes, above threshold |
| `/tenants/` | tenant-index | Browse by brand | net lease tenants | yes |
| `/tenants/<tenant>/` | tenant-hub | Inventory and Fortis experience for one brand | <Tenant> NNN for sale | yes, above threshold |
| `/property-types/<type>/` | property-type-hub | Sector inventory and track record | dollar store / QSR / auto / … net lease properties | yes |
| `/closed-deals/` | closed-deals | Proof of track record | net lease sales track record | yes |
| `/services/` | services-index | Overview of services | net lease brokerage services | yes |
| `/services/seller-representation/` | service | Sell a NNN asset | sell net lease property | yes |
| `/services/buyer-representation/` | service | Buy with representation | net lease buyer representation | yes |
| `/services/1031-exchange/` | service | Find replacement property (transactional) | 1031 exchange replacement property | yes |
| `/services/sale-leaseback/` | service | Monetise owner-occupied real estate | sale-leaseback broker | yes |
| `/services/valuations/` | service | Valuation and advisory method | net lease property valuation | yes |
| `/valuation/` | lead-form | Convert: request a valuation | what is my net lease property worth | yes |
| `/buyer-alerts/` | lead-form | Convert: listing alerts | net lease listing alerts | yes |
| `/team/` (replaces the noindexed `/net-lease-advisors/`) | advisors-index | Find an advisor | net lease advisors | yes |
| `/team/<slug>/` (URLs preserved) | advisor-profile | Vet and contact an advisor | "<name> net lease" | yes |
| `/insights/` | insights-index | Education and research hub | net lease investing insights | yes |
| `/what-is-a-net-lease/` (preserved) | article | Informational | what is a net lease | yes |
| `/1031-exchange-real-estate/` (preserved) | article | Informational 1031 guide | 1031 exchange real estate | yes |
| `/insights/<slug>/` | article | Future guides, e.g. NNN vs NN vs absolute net | per article | yes |
| `/insights/cap-rate-report/<yyyy-qN>/` | research-article | Quarterly cap rate report | net lease cap rates <quarter> | **only when owner-supplied data exists** |
| `/news/`, `/news/<slug>/` | news | Press releases | Fortis Net Lease news | yes |
| `/about/` | about | Firm credibility | Fortis Net Lease | yes |
| `/testimonials/` | testimonials | Social proof | Fortis Net Lease reviews | yes |
| `/careers/` | careers | Recruiting | commercial real estate careers Michigan | yes |
| `/contact/` | contact | Contact details and form | Fortis Net Lease contact | yes |
| `/privacy/`, `/messaging-terms/` | legal | Compliance | n/a | yes, not in nav |
| `/thank-you/`, `/404` | utility | Confirmations | n/a | noindex |
| Filtered/sorted listing views (`?tenant=&state=&cap=`) | listings-index | UX state | n/a | canonical to the unfiltered index; not in sitemap |

**Why the URLs look this way:** the skill says to preserve useful URLs. `/net-lease-properties/`, `/team/<slug>/`, `/what-is-a-net-lease/`, `/1031-exchange-real-estate/`, `/contact/`, `/privacy/`, `/messaging-terms/`, `/testimonials/` and `/careers/` all stay as they are, which avoids 30 redirects. Paths whose slugs carried no meaning (`/real-estate-acquisition-disposition/`, `/net-lease-real-estate/`, `/real-estate-investment-sales/`) get a 301.

**How listing and state URLs share one namespace:** every listing slug ends in the numeric Buildout ID, and state slugs come from a fixed list of the 50 state names, so the two can never collide.

**Each listing gets its own crawlable URL:**
- Each of the 77 Buildout listings is statically generated at build time.
- Old `?propertyId=<id>-sale` deep links get a 301 to the listing's slug.
- When a listing leaves the feed:
  - If Buildout marks it sold, the page stays at the same URL with a "Closed" badge, as proof of the closing.
  - If it is withdrawn, it gets a 301 to its tenant hub, then its state hub, then `/net-lease-properties/`.
  - A withdrawn listing never returns a soft 404.

### 2.1 Hub thresholds (no doorway pages)

Thresholds are computed at **build time** from the live feed and the closings data. A hub that falls below them is removed from the sitemap and set to `noindex,follow`. After 60 days below the threshold, it gets a 301 to its parent. The build fails if any redirect target is not a 200.

| Hub | Publish and index when | Qualifies on the 2026-11-01 data |
|---|---|---|
| State (`/net-lease-properties/<state>/`) | ≥3 live listings, **or** ≥1 live listing plus ≥5 Fortis closings in that state | 15 states: MI (18 live / 33 closed), FL (3/14), OH (5/11), AR (3/11), NC (3/8), MO (2/8), IL (7/3), KY (2/7), IN (5/4), TN (2/6), GA (1/6), AL (3/3), OK (4/2), LA (3/1), WV (3/0) |
| Tenant (`/tenants/<tenant>/`) | ≥3 live listings, **or** ≥1 live listing plus ≥5 closings | 6 tenants: Dollar General (11/55), Family Dollar (11/7), Taco Bell (5/4), Dollar Tree (3/2), 7-Eleven (3/1), Joe Hudson's Collision Center (3/0). Walgreens and CVS (0/4) do not qualify. Revisit after the owner adds closing data. |
| Tenant × state | ≥3 live listings for the pair **and** content that differs from the tenant hub | **None at launch.** Only Dollar General in WV (3) and 7-Eleven in MI (3) reach the count, and both would duplicate their tenant hub. Use filtered views (canonical to the hub) instead. |
| Property type | ≥3 live listings **or** a sector entry in "sales volume by sector" plus ≥4 sector closings | dollar-stores, restaurants (QSR / casual dining), auto, drug-stores, medical-office-industrial, multi-tenant-retail. The "Misc." sector gets no hub. |
| City | Never | Doorway risk. The old city `/tag/` pages get a 301 to their hub. |

**What each hub page must carry:** its live listings (from the feed), the Fortis closings that match, the advisors who hold listings there, an alert signup prefilled with the hub's filter, and an owner-approved lead paragraph. Swapping in a different state or tenant name is not enough to make a new page.

## 3. Navigation, footer and internal-link map

**Header (visible at desktop, no hamburger above 1024px):**
- Properties (mega menu): All listings, By tenant, By state, By property type, Closed deals
- Services: Sell, Buy, 1031 Exchange, Sale-Leaseback, Valuations
- Team
- Insights
- About: About, Testimonials, Careers, News
- Contact
- Phone (248) 254-3410
- Primary CTA: "Get a valuation"

**Footer:**
- NAP, rendered from the same data as the schema
- Columns for Properties (top 6 state hubs and the 6 tenant hubs), Services, Company and Resources
- Buyer-alerts signup with labelled inputs
- Privacy, Messaging Terms, social links (Facebook, Instagram, LinkedIn) and the current year
- The legal entity and licence line, **after the owner confirms them**

**Contextual links:**

| From | To |
|---|---|
| Home | Featured listings, top hubs, `/closed-deals/`, `/valuation/`, 3 advisors, testimonials |
| Listing detail | Its listing advisor's profile, its tenant hub (if any), its state hub (if any), its property-type hub, 3 similar listings (same tenant, then state, then type), OM/contact form, `/buyer-alerts/` |
| State hub / tenant hub / property-type hub | Each other ("Dollar General in Ohio" is a **filtered link to the OH hub**, not a page), listings, matching closings, `/services/seller-representation/` |
| Advisor profile | That advisor's active listings (matched on the Buildout `brokers[].email`), `/contact/` |
| Service pages | Relevant hubs, `/closed-deals/`, the matching guide (1031 service ↔ `/1031-exchange-real-estate/`), and the conversion page |
| Articles | The matching service and `/net-lease-properties/` |

Breadcrumbs follow the `parent` field in `architecture.json`.

## 4. Schema plan per template (JSON-LD, one `@graph`, from the same data as the visible page)

| Template | Types | Notes |
|---|---|---|
| All pages | `WebSite`, `Organization`/`RealEstateAgent` (by `@id` reference), `BreadcrumbList` | `RealEstateAgent` carries name, url, logo, the HQ `PostalAddress`, telephone, `sameAs` (3 socials), `foundingDate` 2009 and `founder`. Add `faxNumber` and `legalName` only once confirmed. Leave out `geo`, hours and `aggregateRating`: geo and hours are not published, and ratings would break the review policy. |
| Listing detail | `RealEstateListing` (with `datePosted` if the feed provides it) whose `mainEntity`/`about` is a `Place` (address, `geo` from the feed's lat/lng); `offers` is an `Offer` (price, priceCurrency USD, availability, `seller`/`offeredBy` set to the Person and the Org) | Cap rate, NOI and lease term go in `additionalProperty` `PropertyValue`. The rich result is **not guaranteed**, because Google has no RealEstateListing feature. The value is entity clarity, so do not chase eligibility. |
| Hubs, listings index, closed deals | `CollectionPage` plus an `ItemList` of listing URLs | No Offer markup on closed deals. |
| Services | `Service` (serviceType, provider set to the org `@id`, areaServed set to "United States", **only once the owner confirms national scope**) | |
| Team index / profile | `ProfilePage` with `mainEntity` set to a `Person` (name, jobTitle, image, email, telephone, worksFor, url) | Add `hasCredential` only when licence data is supplied. |
| Articles / news | `Article` / `NewsArticle` (headline, datePublished, author set to a Person or the Organization, publisher set to the org) | |
| Testimonials | `WebPage` only | Self-serving reviews are ineligible, and markup would be policy-risky. |
| Contact / About | `ContactPage` / `AboutPage` | |
| Not used | `FAQPage`, `HowTo`, `SearchAction`, ratings | These follow the seo-reference rule. |

Escape `<` in the serialised JSON. Validate with validator.schema.org and the Rich Results Test, and record the URL, date and result for each test.

## 5. Canonical, robots and sitemap rules

1. **Host.** One canonical origin, `https://fortisnetlease.com` (the current apex, pending owner confirmation). Other hosts and protocols get a single-hop 301 that keeps the path. URLs always end in a trailing slash, and the non-slash form gets a 301.
2. **Canonicals.** Every indexable page has a self-referencing absolute canonical. Query-string filter and sort views canonicalise to the unfiltered page. Pagination (`?page=2`) self-canonicalises but is not listed in the sitemap.
3. **Team page noindex.** The new `/team/` is indexable and listed in the sitemap. The old `/net-lease-advisors/` and `/our-agents/` get a 301 to it.
4. **Robots-blocked uploads.**
   - The new `robots.txt` has **no** `Disallow` for image or asset paths.
   - Images are re-hosted on the new site under `/images/…` (headshots, brand) or come from the Buildout CDN (listing photos).
   - The rules contain no leftover Flywheel or calendar entries. They add `Sitemap: https://fortisnetlease.com/sitemap.xml` and disallow only `/api/` and `/thank-you/`.
   - Crawler-specific AI rules: **the owner decides** (seo-reference agent table). The default is to allow search crawlers and leave the training crawlers (GPTBot, Google-Extended) to the owner.
5. **Attachment-page sitemap.**
   - The new build creates **no attachment pages**.
   - `sitemap.xml` is generated from the route map, and only `index:true` routes that return 200 go into it.
   - It is split into `sitemap-pages.xml`, `sitemap-listings.xml` (with `lastmod` taken from the feed's update time) and `sitemap-hubs.xml`.
   - The roughly 4,000 old attachment URLs return 410 (see the pattern row in the CSV). The old Yoast sitemap URLs get a 301 to `/sitemap.xml`.
6. **Staging.** Previews send `X-Robots-Tag: noindex`. Production has no noindex except on utility pages.
7. **Titles.** The pattern is `<Page> | Fortis Net Lease`, with the brand once and no "Michigan's #1". `og:image` is set on every template, using the listing hero for listing pages.
8. **Statuses.** Missing pages return a real 404. Retired WordPress archives return 301 or 410 as the CSV specifies.

## 6. Data model

**Listing** (sourced from Buildout and normalised at build time):
- `buildoutId`, `propertyId` (e.g. `1457297-sale`) and `slug`
- `name`, `tenant` (raw `tenant_as_stated`) and `tenantKey` (normalised, e.g. `dollar-general`; mapped through `content/tenants.json` aliases)
- `address`, `city`, `state` (USPS code), `zip`, `lat`, `lng`
- `price` (number, USD) and `priceDisplay` (for "Call for offer")
- `capRate` (number or null; 28 of 77 listings have one), `noi`, `leaseTermRemaining`, `leaseType` (NNN/NN/ground/null) and `guarantee` (only if the feed or the OM states it)
- `sizeSf`, `yearBuilt`, `propertyType`, `subType`, `status` and `statusLabel`
- `brokers[]`: name, email, phone and photo; matched to an advisor by email
- `description`, `locationDescription`, `highlights[]`, `heroImage`, `images[]`, `omPdfUrl` (gated behind a form) and `demographics` (from `all_details`)
- `legacyUrls[]` and `updatedAt`

**Closing** (from `featured_closings`, maintained in `content/closings.json`):
- `id`, `name`, `tenantKey`, `category`/`sector`, `city`, `state` and `salePrice`
- `capRate`, `closedDate` and `side` (buyer, seller or both). **None of these three were harvested**, so the owner must supply them; they are blank until then.
- `image`, `advisors[]`, `source`
- `listingSlug`, if the closing came from the feed

**Advisor** (from `content/team.json`):
- `slug` (equal to the old `/team/<slug>/`), `name`, `title`, `email`, `phone`, `headshot` and `bio[]`
- `buildoutEmails[]`, used to match listings
- `licences[]` (state and number, **when supplied**), `specialties[]` (when supplied), `linkedin`, `order`, `active` and `legacyUrl`

**Tenant** (from `content/tenants.json`):
- `key`, `name`, `aliases[]` (e.g. "Family Dollar / Dollar Tree", "7-Eleven (Speedway)"), `parentCompany`, `sector`, `logo`
- `intro`: owner-approved copy, **required before the hub can be indexed**
- `creditNotes`: only with a cited source, never invented
- `typicalLeaseStructure`: owner-approved
- `hubEligible`: computed at build time

## 7. Data integration: Buildout listings at build time

**What the harvest observed** (RECON.md and `recon/lighthouse/properties.json` network log):
- **Embed:**
  ```
  <script src="https://buildout.com/api.js?v8">
  BuildOut.embed({token: "8c286e4a49fdc706359ab9c041e0db1465de1fcf", plugin: "inventory", target: "buildout"})
  ```
- **Inventory feed (public, no authentication):**
  ```
  GET https://buildout.com/plugins/8c286e4a49fdc706359ab9c041e0db1465de1fcf/inventory.json?page=0&q[sale_or_lease_eq]=sale&q[s][]=sale_price+desc&q[type_eq_any][]=1&...=2&...=3&...=7&...=104&viewType=list
  ```
  It is paginated through `page=N`. Type IDs 1, 2, 3, 7 and 104 are the property types the embed requests.
- **Detail view:**
  ```
  https://buildout.com/plugins/<token>/fortisnetlease.com/inventory/?pluginId=0&iframe=true&embedded=true
  ```
  Each detail is opened with the `propertyId=<id>-sale` parameter. The harvest took description, highlights, `all_details`, images and the OM link from the detail view. **The exact detail URL pattern was not recorded in harvest/recon.** Confirm it from a browser network log before coding.
- **Fields found** (`harvest/data.json → listings_live_buildout[]`):
  - Identity and location: `buildout_id`, `property_id`, `name`, `tenant_as_stated`, `address`, `city`, `state`, `zip`, `lat`, `lng`
  - Financials and lease: `price`, `cap_rate`, `noi`, `lease_term`, `lease_type`
  - Building: `size`, `year_built`, `property_type`, `sub_type`, `status`, `status_override_label`
  - People: `brokers[]` (name, email, phone, photo_url, name_with_license_number)
  - Copy and media: `all_details{}`, `investment_highlights[]`, `description`, `location_description`, `hero_image`, `images[]`, `om_pdf`
  - The OM PDF links carry document tokens. Keep them behind the lead form; never list them in the sitemap.

**Build pipeline:**
1. Run `scripts/fetch-buildout.mjs` before `build`.
2. Page through `inventory.json` until a page comes back empty, then fetch each listing's detail.
3. Normalise to the Listing model and write `data/listings.json` plus a dated snapshot.
4. Run the build check:
   - The build fails if the count drops by more than 30% compared with the last snapshot, which guards against a feed outage wiping the site.
   - It also fails if any required field is missing.
5. Rebuild on a schedule (a cron-triggered prebuilt deploy, e.g. every 6 hours) and on demand.

**Fallbacks, in order:**
1. **Last good snapshot.** If the fetch fails or the guard trips, build from the last committed `data/listings.json` (the seed is `harvest/data.json`) and alert. Pages stay crawlable.
2. **Official Buildout API.** The plugin endpoint is undocumented and could change or close. Ask the owner for official Buildout API access (key held in an environment variable) as the supported long-term source.
3. **Iframe embed as a last resort.** If no structured data source is available, keep the current iframe embed on `/net-lease-properties/` for UX. This loses the per-listing SEO, so treat it only as a stopgap.
- **Terms:** the owner must confirm that Buildout's terms allow programmatic use of the plugin feed (listed in FACTS-TO-CONFIRM).

## 8. Skill-system compliance notes

- **Format:** the route map follows `local-business-architect`/`build-handoff` (path, intent, template, parent, index, unique value, required facts, schema types and links). The schema was validated with the shared helper.
- **Doorway rule:** there are no city pages, no tenant × state matrix and no office pages. Each hub is gated on real inventory or closings.
- **Truthful entities:**
  - Only verified facts go into the schema.
  - Conflicting stats are withheld.
  - Reviews get no ratings markup.
- **Ad hoc where the skills say nothing:**
  - The listings data model and the Buildout pipeline. The skills give no guidance on a listing feed, so these follow the observed feed fields.
  - The numeric hub thresholds. The skills require "earns its existence" but give no numbers. The ≥3 / ≥1+5 thresholds were chosen so that each hub has at least a short list of real items.
  - The 60-day retire window, which is operational judgment.
