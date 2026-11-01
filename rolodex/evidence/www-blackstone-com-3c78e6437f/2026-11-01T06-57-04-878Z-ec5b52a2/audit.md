# Technical audit

URL: https://www.blackstone.com/

Automated quality: **high-risk**. 1 errors, 35 warnings.

- **ERROR · http-error** — Document returns 403
  Evidence: http.json. Action: Serve the intended status and content.
- **WARNING · description-missing** — raw: description missing
  Evidence: raw.extract.json. Action: Add an accurate page summary.
- **WARNING · canonical-count** — raw: 0 canonicals
  Evidence: raw.extract.json. Action: Use one canonical for this indexable HTML page.
- **WARNING · meta-noindex** — raw: indexing restriction present
  Evidence: raw.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · h1-count** — raw: 0 H1 elements
  Evidence: raw.extract.json. Action: Review the page outline; prefer a clear primary heading.
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
- **WARNING · h1-count** — tablet-raw: 0 H1 elements
  Evidence: tablet.raw.extract.json. Action: Review the page outline; prefer a clear primary heading.
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
- **WARNING · h1-count** — mobile-raw: 0 H1 elements
  Evidence: mobile.raw.extract.json. Action: Review the page outline; prefer a clear primary heading.
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
- **INFO · image-dimensions** — desktop: images lack HTML dimensions
  Evidence: desktop.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · og-missing** — desktop: og:title missing
  Evidence: desktop.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — desktop: og:type missing
  Evidence: desktop.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — desktop: og:url missing
  Evidence: desktop.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — desktop: og:image missing
  Evidence: desktop.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **WARNING · render-dependent-content** — desktop: important content appears only after JavaScript
  Evidence: desktop.extract.json. Action: Deliver key headings, copy and navigation in the initial HTML where crawler access matters.
- **WARNING · broken-image** — desktop: broken images
  Evidence: desktop.extract.json. Action: Repair image URLs or loading behavior.
- **WARNING · lab-lcp-risk** — desktop: observed LCP exceeds 2500 ms
  Evidence: desktop.extract.json. Action: Investigate the largest content element; measure under defined conditions and compare field data.
- **INFO · long-task-risk** — desktop: long tasks observed
  Evidence: desktop.extract.json. Action: Profile main-thread work and test real interactions.
- **INFO · large-script** — desktop: a script exceeds 500 KB decoded
  Evidence: desktop.extract.json. Action: Review JavaScript delivery and hydration costs.
- **WARNING · description-missing** — tablet: description missing
  Evidence: tablet.extract.json. Action: Add an accurate page summary.
- **WARNING · canonical-count** — tablet: 0 canonicals
  Evidence: tablet.extract.json. Action: Use one canonical for this indexable HTML page.
- **WARNING · meta-noindex** — tablet: indexing restriction present
  Evidence: tablet.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · main-count** — tablet: 0 main landmarks
  Evidence: tablet.extract.json. Action: Expose one active main content landmark.
- **INFO · image-dimensions** — tablet: images lack HTML dimensions
  Evidence: tablet.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · og-missing** — tablet: og:title missing
  Evidence: tablet.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — tablet: og:type missing
  Evidence: tablet.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — tablet: og:url missing
  Evidence: tablet.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — tablet: og:image missing
  Evidence: tablet.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **WARNING · render-dependent-content** — tablet: important content appears only after JavaScript
  Evidence: tablet.extract.json. Action: Deliver key headings, copy and navigation in the initial HTML where crawler access matters.
- **WARNING · broken-image** — tablet: broken images
  Evidence: tablet.extract.json. Action: Repair image URLs or loading behavior.
- **INFO · long-task-risk** — tablet: long tasks observed
  Evidence: tablet.extract.json. Action: Profile main-thread work and test real interactions.
- **INFO · large-script** — tablet: a script exceeds 500 KB decoded
  Evidence: tablet.extract.json. Action: Review JavaScript delivery and hydration costs.
- **WARNING · description-missing** — mobile: description missing
  Evidence: mobile.extract.json. Action: Add an accurate page summary.
- **WARNING · canonical-count** — mobile: 0 canonicals
  Evidence: mobile.extract.json. Action: Use one canonical for this indexable HTML page.
- **WARNING · meta-noindex** — mobile: indexing restriction present
  Evidence: mobile.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · main-count** — mobile: 0 main landmarks
  Evidence: mobile.extract.json. Action: Expose one active main content landmark.
- **INFO · image-dimensions** — mobile: images lack HTML dimensions
  Evidence: mobile.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · og-missing** — mobile: og:title missing
  Evidence: mobile.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — mobile: og:type missing
  Evidence: mobile.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — mobile: og:url missing
  Evidence: mobile.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — mobile: og:image missing
  Evidence: mobile.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **WARNING · render-dependent-content** — mobile: important content appears only after JavaScript
  Evidence: mobile.extract.json. Action: Deliver key headings, copy and navigation in the initial HTML where crawler access matters.
- **WARNING · broken-image** — mobile: broken images
  Evidence: mobile.extract.json. Action: Repair image URLs or loading behavior.
- **INFO · long-task-risk** — mobile: long tasks observed
  Evidence: mobile.extract.json. Action: Profile main-thread work and test real interactions.
- **INFO · large-script** — mobile: a script exceeds 500 KB decoded
  Evidence: mobile.extract.json. Action: Review JavaScript delivery and hydration costs.
- **WARNING · robots-unavailable** — robots.txt could not be reliably interpreted
  Evidence: controls.json. Action: Check HTTP status, redirects, content type and crawler-specific failure handling.
- **INFO · sitemap-unavailable** — Sitemap unavailable: https://www.blackstone.com/sitemap.xml
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
