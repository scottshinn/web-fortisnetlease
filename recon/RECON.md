# Fortis Net Lease: live site recon

Captured 2026-11-01 from https://www.fortisnetlease.com, which 301-redirects to https://fortisnetlease.com. Sources are the live site and its public Buildout embed only.

## Site map (primary nav)

| Nav label | Live URL | Duplicate URL(s) serving the same page |
|---|---|---|
| Home | `/` | `/home/` |
| Our Listings | `/net-lease-properties/` (Buildout embed) | `/properties/` |
| About Fortis | `/real-estate-acquisition-disposition/` | `/about-us/` |
| Our Success | `/real-estate-investment-sales/` | `/recently-closed/` |
| Our Team | `/net-lease-advisors/` plus 18 `/team/<name>/` bios | `/our-agents/` |
| Testimonials | `/real-estate-testimonials/` | `/testimonials/` |
| List With FNL | `/net-lease-real-estate/` | `/list-with-us/` |
| Careers | `/commercial-real-estate-careers/` | `/careers/` |
| Contact | `/contact/` | |

Footer and other pages: `/net-lease-news/`, `/privacy/`, `/messaging-terms/`, `/1031-exchange-real-estate/`, `/what-is-a-net-lease/`, `/sales-leasebacks/` (empty body), `/2022-dollar-store-sales/`, `/april-2023-for-immediate-release/`, `/closing-form/` (Gravity Forms), and `/intranet/` (blocked in robots).

Archives: 64 category pages (`/category/for-sale|featured|single-tenant|multi-tenant|recently-closed/...`), 24 tag pages, the author archive `/author/jamil/` with 28 pages, and `/page/N/` paginations.

The full inventory is in `harvest/urls.csv`: 266 HTML URLs (118 pages, 64 category, 24 tag, 28 author, 31 paginated or other, plus home). One URL returns 404: `/team/julie-thomson/`, which the roster links to.

## Tech stack

- **CMS:** WordPress with the custom theme `fortis-net-lease`, credited to BMG Media (bmgmediaco.com) in the footer. Plugins: Yoast SEO (sitemap_index.xml), Gravity Forms (`/closing-form/` only), hashbar-wp-notification-bar, wp-pagenavi. Front end uses Materialize CSS, jQuery and jQuery UI, Swiper, slick, fancybox, video.js and animate.css.
- **Hosting:** Flywheel (`server: Flywheel/5.1.0`; robots.txt is the "Default Flywheel robots file").
- **Listing platform:** Buildout "inventory" plugin (`BuildOut.embed`, token `8c286e4a49fdc706359ab9c041e0db1465de1fcf`). It renders in an iframe from buildout.com and is fed by the public `/plugins/<token>/inventory.json`. Detail links use `?propertyId=<id>-sale`, and brochures are Buildout PDF links.
  - Separately, 78 old WordPress "property" pages are still published. They show prices, cap rates, brokers and a "Download Property Information" form, and many are stale (2018 listings still marked "Available").
- **Forms:** custom PHP handlers in the theme:
  - `send.php`, `send2.php`, `send3.php`, `send4.php` (contact and lead forms)
  - `subscribe.php` (mailing list, in the footer of every page)
  - `download.php` (property information gate)

  All of them use Google reCAPTCHA v2 (site key `6Lfb7vggAAAAADgSYXNfAiLRKrvv6l1FDxcEpmqy`) and an SMS consent checkbox that names "Fortis Net Lease and Fortis Capital Solutions".
- **Analytics:** Universal Analytics `UA-147791370-2` via gtag. The Buildout iframe fires GA4 `G-YPL38J0CY7` and `G-50RNXEYK98` (Buildout's own properties) and New Relic. No Meta or LinkedIn pixels were found.
- **SEO and accessibility:** titles carry a doubled suffix ("... - Fortis Net Lease - Fortis Net Lease"). The rolodex audit rates the site `needs-review`:
  - skipped heading levels and no `<main>` landmark
  - missing image alt text and unlabeled form inputs
  - lab LCP over 2.5 s
  - the header logo is a CSS background behind a text `<h1>` on every page

## Content summary (details in `harvest/data.json`)

- **Company:**
  - Fortis Net Lease, 30445 Northwestern Hwy, Suite #275, Farmington Hills, MI 48334.
  - Phone (248) 254-3410. Fax is (248) 254-3405 in the footer, but the contact page lists 254 3410.
  - Founded 2009 by Robert Bender, Doug Passon and Bryan Bender, per Robert Bender's bio.
  - No legal entity name or licence numbers are published.
- **Claims (they conflict across pages):** "$9+ B" total sales, also stated as $9.3B; 4,500 closed transactions, also stated as "4,000+"; 400K broker and buyer reach; 46 states; sales volume by sector, 7 sectors.
- **Team:** 19 people (18 bio pages plus Julie Thomson, who appears on the roster only). Each record has title, email, phone, headshot and bio paragraphs. Scott Shinn's email is on the fortiscsg.com domain.
- **Listings:**
  - 77 live Buildout for-sale listings, all available; 28 have a stated cap rate.
  - 78 legacy WordPress property pages.
  - 157 "Featured Closings" on Our Success.
- **Other content:** 12 testimonials (verbatim), 5 news items plus 2 on-site press releases, careers (3 openings with income claims), and 2 educational articles.
- **Social:** Facebook, Instagram and LinkedIn.

## Must migrate

1. Every URL in `migration-301.csv`, including the duplicate aliases and `/team/*`. Prioritize the 78 legacy property URLs and the Buildout `?propertyId=` deep links, because they get external and backlink traffic.
2. The Buildout inventory, either as a re-embed or as an API-fed listings page. The token and endpoint are listed above.
3. Lead capture: contact, list-with-us, property download and mailing list forms. Keep the exact SMS consent wording plus the `/privacy/` and `/messaging-terms/` pages, which are needed for A2P/TCPA compliance.
4. Team bios and headshots, testimonials, featured closings, news/press, and the 1031 and net-lease articles.
5. Brand assets in `harvest/images/brand/` and the colors and fonts in `harvest/brand.json`. Futura PT, Tungsten and DearJoe 4 are commercial fonts and need licences or substitutes.

## Open questions for the owner

- Which stats are current ($9B vs $9.3B; 4,000 vs 4,500)?
- Which fax number is correct?
- Should the 78 legacy WordPress listings be archived or redirected?
- What is the legal entity name and licence wording?
- Julie Thomson's status, since her profile returns 404.
- The relationship to Fortis Capital Solutions / fortiscsg.com.

## Evidence

- Rolodex record `www-fortisnetlease-com-ea105adb01`, with 14 captures under `rolodex/evidence/...`.
- Screenshots in `capture/` (desktop and mobile for each captured page).
- Raw HTML in `harvest/pages/`.
- Images in `harvest/images/` (`manifest.json` maps each file to its source URL).
