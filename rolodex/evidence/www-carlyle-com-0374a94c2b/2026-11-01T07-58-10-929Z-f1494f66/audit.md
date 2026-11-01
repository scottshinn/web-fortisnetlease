# Technical audit

URL: https://www.carlyle.com/

Automated quality: **high-risk**. 1 errors, 25 warnings.

- **ERROR · http-error** — Document returns 403
  Evidence: http.json. Action: Serve the intended status and content.
- **WARNING · description-missing** — raw: description missing
  Evidence: raw.extract.json. Action: Add an accurate page summary.
- **WARNING · canonical-count** — raw: 0 canonicals
  Evidence: raw.extract.json. Action: Use one canonical for this indexable HTML page.
- **WARNING · meta-noindex** — raw: indexing restriction present
  Evidence: raw.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · main-count** — raw: 0 main landmarks
  Evidence: raw.extract.json. Action: Expose one active main content landmark.
- **INFO · og-missing** — raw: og:title missing
  Evidence: raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — raw: og:type missing
  Evidence: raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — raw: og:url missing
  Evidence: raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — raw: og:image missing
  Evidence: raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **WARNING · description-missing** — tablet-raw: description missing
  Evidence: tablet.raw.extract.json. Action: Add an accurate page summary.
- **WARNING · canonical-count** — tablet-raw: 0 canonicals
  Evidence: tablet.raw.extract.json. Action: Use one canonical for this indexable HTML page.
- **WARNING · meta-noindex** — tablet-raw: indexing restriction present
  Evidence: tablet.raw.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · main-count** — tablet-raw: 0 main landmarks
  Evidence: tablet.raw.extract.json. Action: Expose one active main content landmark.
- **INFO · og-missing** — tablet-raw: og:title missing
  Evidence: tablet.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — tablet-raw: og:type missing
  Evidence: tablet.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — tablet-raw: og:url missing
  Evidence: tablet.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — tablet-raw: og:image missing
  Evidence: tablet.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **WARNING · description-missing** — mobile-raw: description missing
  Evidence: mobile.raw.extract.json. Action: Add an accurate page summary.
- **WARNING · canonical-count** — mobile-raw: 0 canonicals
  Evidence: mobile.raw.extract.json. Action: Use one canonical for this indexable HTML page.
- **WARNING · meta-noindex** — mobile-raw: indexing restriction present
  Evidence: mobile.raw.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · main-count** — mobile-raw: 0 main landmarks
  Evidence: mobile.raw.extract.json. Action: Expose one active main content landmark.
- **INFO · og-missing** — mobile-raw: og:title missing
  Evidence: mobile.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — mobile-raw: og:type missing
  Evidence: mobile.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — mobile-raw: og:url missing
  Evidence: mobile.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — mobile-raw: og:image missing
  Evidence: mobile.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **WARNING · description-missing** — desktop: description missing
  Evidence: desktop.extract.json. Action: Add an accurate page summary.
- **WARNING · canonical-count** — desktop: 0 canonicals
  Evidence: desktop.extract.json. Action: Use one canonical for this indexable HTML page.
- **WARNING · meta-noindex** — desktop: indexing restriction present
  Evidence: desktop.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · main-count** — desktop: 0 main landmarks
  Evidence: desktop.extract.json. Action: Expose one active main content landmark.
- **INFO · og-missing** — desktop: og:title missing
  Evidence: desktop.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — desktop: og:type missing
  Evidence: desktop.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — desktop: og:url missing
  Evidence: desktop.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — desktop: og:image missing
  Evidence: desktop.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **WARNING · description-missing** — tablet: description missing
  Evidence: tablet.extract.json. Action: Add an accurate page summary.
- **WARNING · canonical-count** — tablet: 0 canonicals
  Evidence: tablet.extract.json. Action: Use one canonical for this indexable HTML page.
- **WARNING · meta-noindex** — tablet: indexing restriction present
  Evidence: tablet.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · main-count** — tablet: 0 main landmarks
  Evidence: tablet.extract.json. Action: Expose one active main content landmark.
- **INFO · og-missing** — tablet: og:title missing
  Evidence: tablet.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — tablet: og:type missing
  Evidence: tablet.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — tablet: og:url missing
  Evidence: tablet.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — tablet: og:image missing
  Evidence: tablet.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **WARNING · description-missing** — mobile: description missing
  Evidence: mobile.extract.json. Action: Add an accurate page summary.
- **WARNING · canonical-count** — mobile: 0 canonicals
  Evidence: mobile.extract.json. Action: Use one canonical for this indexable HTML page.
- **WARNING · meta-noindex** — mobile: indexing restriction present
  Evidence: mobile.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · main-count** — mobile: 0 main landmarks
  Evidence: mobile.extract.json. Action: Expose one active main content landmark.
- **INFO · og-missing** — mobile: og:title missing
  Evidence: mobile.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — mobile: og:type missing
  Evidence: mobile.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — mobile: og:url missing
  Evidence: mobile.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — mobile: og:image missing
  Evidence: mobile.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **WARNING · robots-unavailable** — robots.txt could not be reliably interpreted
  Evidence: controls.json. Action: Check HTTP status, redirects, content type and crawler-specific failure handling.
- **INFO · sitemap-unavailable** — Sitemap unavailable: https://www.carlyle.com/sitemap.xml
  Evidence: controls.json. Action: Check the intended sitemap location; a missing default path is not proof that no sitemap exists.
- **INFO · llms-inventory** — llms.txt: absent or unavailable
  Evidence: controls.json. Action: Treat this as optional agent-facing documentation; review content and links, not as an indexing control.

## Coverage and remaining review

- scope: Captured URLs and explicitly bounded internal link checks only.
- schema: JSON syntax and shallow shape checks; not full Schema.org validation or rich-result eligibility.
- accessibility: Heuristic DOM checks; not WCAG conformance.
- performance: Unthrottled local laboratory observations; not field Core Web Vitals. No INP measurement.
- rendering: Initial HTML vs rendered DOM comparison cannot distinguish SSR from SSG or prove indexability.
- Manual: Schema.org vocabulary and type-specific requirements
- Manual: Structured data matches visible, verified facts
- Manual: Canonical target and HTTP Link header consistency
- Manual: Soft 404 and index-intent decisions
- Manual: Agent-specific directives and crawler access
- Manual: Keyboard, screen reader, contrast, zoom and interaction states
- Manual: Field CWV and representative interaction performance
