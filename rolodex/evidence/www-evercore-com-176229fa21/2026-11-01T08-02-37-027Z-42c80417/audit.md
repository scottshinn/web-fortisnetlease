# Technical audit

URL: https://www.evercore.com/

Automated quality: **needs-review**. 0 errors, 8 warnings.

- **WARNING · title-duplicate** — raw: multiple title elements
  Evidence: raw.extract.json. Action: Emit one title.
- **INFO · image-dimensions** — raw: images lack HTML dimensions
  Evidence: raw.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · og-missing** — raw: og:image missing
  Evidence: raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · schema-shape** — raw: typed node needs property review
  Evidence: raw.extract.json. Action: Validate type-specific properties with the appropriate validator.
- **WARNING · title-duplicate** — tablet-raw: multiple title elements
  Evidence: tablet.raw.extract.json. Action: Emit one title.
- **INFO · image-dimensions** — tablet-raw: images lack HTML dimensions
  Evidence: tablet.raw.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · og-missing** — tablet-raw: og:image missing
  Evidence: tablet.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · schema-shape** — tablet-raw: typed node needs property review
  Evidence: tablet.raw.extract.json. Action: Validate type-specific properties with the appropriate validator.
- **WARNING · title-duplicate** — mobile-raw: multiple title elements
  Evidence: mobile.raw.extract.json. Action: Emit one title.
- **INFO · image-dimensions** — mobile-raw: images lack HTML dimensions
  Evidence: mobile.raw.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · og-missing** — mobile-raw: og:image missing
  Evidence: mobile.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · schema-shape** — mobile-raw: typed node needs property review
  Evidence: mobile.raw.extract.json. Action: Validate type-specific properties with the appropriate validator.
- **WARNING · title-duplicate** — desktop: multiple title elements
  Evidence: desktop.extract.json. Action: Emit one title.
- **INFO · image-dimensions** — desktop: images lack HTML dimensions
  Evidence: desktop.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · og-missing** — desktop: og:image missing
  Evidence: desktop.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · schema-shape** — desktop: typed node needs property review
  Evidence: desktop.extract.json. Action: Validate type-specific properties with the appropriate validator.
- **WARNING · lab-lcp-risk** — desktop: observed LCP exceeds 2500 ms
  Evidence: desktop.extract.json. Action: Investigate the largest content element; measure under defined conditions and compare field data.
- **WARNING · title-duplicate** — tablet: multiple title elements
  Evidence: tablet.extract.json. Action: Emit one title.
- **INFO · image-dimensions** — tablet: images lack HTML dimensions
  Evidence: tablet.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · og-missing** — tablet: og:image missing
  Evidence: tablet.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · schema-shape** — tablet: typed node needs property review
  Evidence: tablet.extract.json. Action: Validate type-specific properties with the appropriate validator.
- **WARNING · lab-lcp-risk** — tablet: observed LCP exceeds 2500 ms
  Evidence: tablet.extract.json. Action: Investigate the largest content element; measure under defined conditions and compare field data.
- **WARNING · title-duplicate** — mobile: multiple title elements
  Evidence: mobile.extract.json. Action: Emit one title.
- **INFO · image-dimensions** — mobile: images lack HTML dimensions
  Evidence: mobile.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · og-missing** — mobile: og:image missing
  Evidence: mobile.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · schema-shape** — mobile: typed node needs property review
  Evidence: mobile.extract.json. Action: Validate type-specific properties with the appropriate validator.
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
