# Facts to confirm with the owner

Each item comes from the live site (via `harvest/data.json` or the recon notes). Nothing marked unconfirmed will be published in copy or schema until the owner answers.

## Track-record stats (needed for home, about, schema-free stat band)

| # | Fact | What the site says | Where it says it | Needed |
|---|---|---|---|---|
| 1 | Total sales volume | "$9+ B" | home, `/net-lease-real-estate/`, `/real-estate-investment-sales/` | One figure and an "as of" date |
| | | "$9.3 Billion" | `/real-estate-acquisition-disposition/` | |
| | | "over $9 Billion" | the same About page | |
| | | "Five billion dollars" | Robert Bender bio | |
| | | "$5+B" on desktop, "$3+B" on mobile | home counters (AUDIT V2) | |
| | | **The 7 sector volumes add up to $10.39B**, more than every headline figure | `/real-estate-investment-sales/` | |
| 2 | Closed transactions | "4,500", "4,500+" | home, `/net-lease-real-estate/`, `/real-estate-investment-sales/` | One figure and a date |
| | | "4,000+" | About page | |
| | | 2,131 on desktop, 1,324 on mobile | home counters | |
| 3 | States sold in | 46 | home, Our Success | Confirm the number |
| | | 22 on desktop, 12 on mobile | home counters | |
| 4 | Buyer and broker reach | "400K" | home, Our Success | Confirm it, and say what it measures (the email list?) |
| | | "190K" | home desktop counter | |
| 5 | Dollar-store claims | 179 DG/FD/DT sold in 2022; "nearly 1,500 dollar store properties" in 13 years | `/2022-dollar-store-sales/` | Still accurate, and OK to reuse on the dollar-store hubs? |
| 6 | Sector volumes | Drug $940M, Multi-tenant $1B, Dollar $2.5B, QSR $1.1B, Auto $675M, Med/Office/Industrial $1.25B, Misc $2.925B | Our Success | Current figures and an as-of date |
| 7 | "#1" / "Michigan's #1" | Home and titles | | Remove unless there is a cited source. The default is to remove. |

## Company identity, NAP and compliance

| # | Item | Status |
|---|---|---|
| 8 | **Fax number:** footer (248) 254-3405 vs contact page (248) 254 3410 (the same as the main phone) | Which is correct, and is a fax still wanted? |
| 9 | **Legal entity name** (LLC/Inc) | Not published anywhere. Needed for the footer, privacy policy, messaging terms and `legalName`. |
| 10 | **Broker licences**: firm licence number(s), the states licensed in, and the principal/designated broker | None published. The Buildout field `name_with_license_number` shows names only. Many states require disclosure in listing ads. |
| 11 | **Fortis Capital Solutions**: the SMS consent text names "Fortis Net Lease and Fortis Capital Solutions"; `privacy@fortiscsg.com`; Scott Shinn ("Capital Investment Advisor") uses `scott@fortiscsg.com` | What is the relationship? Does it stay in the consent text, is it a separate entity, does it get a page or a `parentOrganization`/`subOrganization` link, or is it just a mention? |
| 12 | SMS consent wording | Keep it verbatim, or update it for the new forms? Needs legal sign-off for A2P/TCPA. |
| 13 | Canonical host | Apex `fortisnetlease.com` (current) or `www`? |
| 14 | Public hours | None published. They are left out of the schema unless supplied. |
| 15 | National scope | Is "nationwide" (`areaServed: US`) accurate for every service? |
| 16 | Taglines | "Your net lease company™": is the trademark registered? Keep "Boutique by Design, Nationwide by Experience" and "Grit & Gumption"? |
| 17 | Copyright | The footer says "2024". The new footer will show the current year. |

## People

| # | Item |
|---|---|
| 18 | **Julie Thomson** (Senior Advisor) is on the roster, but `/team/julie-thomson/` returns 404. Is she still with the firm? If so, a bio is needed. |
| 19 | Name spellings between Buildout and the site: "Andy Bender" vs "Andrew Bender", and "Marvin Delaura" vs "DeLaura". Which spelling is canonical? |
| 20 | Advisor licences (state and number) and specialties for each profile. Optional; added only if supplied. |
| 21 | Patrick Hammond, Bill O'Connor, Kyle Carson and others: are all 19 still current? |
| 22 | Current headshots. Some date from 2015. |

## Content and data

| # | Item |
|---|---|
| 23 | **Closings data:** the 157 featured closings have no close date, cap rate or rep side, and 100 are labelled only "Recently Closed". Can the owner supply these, e.g. from a CRM export? Without them the tombstones show only name, location and price. |
| 24 | Some closings have no state (location is "National", null, or a state written out in full). Correct these for the state rollups. |
| 25 | **Testimonials:** do we have permission to publish all 12 with attribution? Are any clients no longer clients? |
| 26 | **Careers income claims** ("Months 1-18: $50k-$150K" etc.): still accurate and approved? |
| 27 | Client relationships listed on About (14 names): approved for publication? |
| 28 | Tenant hub intro copy and lease-structure notes: owner-approved text is needed before each of the 6 hubs is indexed. |
| 29 | Cap rate report: is there an internal data source and a commitment to publish quarterly? If not, the route is not launched. |
| 30 | `/closing-form/` (Gravity Forms): is it still used internally? It is planned as a 410. If it is still in use, it moves to a private tool. |
| 31 | `/intranet/`: confirm nothing public lives there before it is retired. |
| 32 | **Buildout:** ~~does the account’s terms permit programmatic use of the public `inventory.json` plugin feed?~~ **Confirmed 2026-11-11: Fortis granted permission for programmatic use of the Buildout feed.** Is official API access available? Which property-type IDs (1, 2, 3, 7, 104) should be shown? |
| 33 | Lead routing: which inbox or CRM receives the valuation, buyer-alert, OM-download and contact submissions? |
| 34 | Analytics: the site still uses Universal Analytics `UA-147791370-2`, which no longer collects data. Is there a GA4 property ID? |
| 35 | Commercial fonts (Futura PT, Tungsten, DearJoe 4): are web licences held? |
