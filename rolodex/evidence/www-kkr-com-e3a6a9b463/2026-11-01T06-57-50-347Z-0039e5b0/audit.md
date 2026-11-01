# Technical audit

URL: https://www.kkr.com/

Automated quality: **needs-review**. 0 errors, 25 warnings.

- **WARNING · h1-count** — raw: 4 H1 elements
  Evidence: raw.extract.json. Action: Review the page outline; prefer a clear primary heading.
- **WARNING · heading-skip** — raw: skipped heading level
  Evidence: raw.extract.json. Action: Correct the semantic outline without using headings for size alone.
- **WARNING · image-alt** — raw: images without alt attributes
  Evidence: raw.extract.json. Action: Use meaningful alt or empty alt for decorative images.
- **INFO · image-dimensions** — raw: images lack HTML dimensions
  Evidence: raw.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · schema-shape** — raw: typed node needs property review
  Evidence: raw.extract.json. Action: Validate type-specific properties with the appropriate validator.
- **WARNING · h1-count** — tablet-raw: 4 H1 elements
  Evidence: tablet.raw.extract.json. Action: Review the page outline; prefer a clear primary heading.
- **WARNING · heading-skip** — tablet-raw: skipped heading level
  Evidence: tablet.raw.extract.json. Action: Correct the semantic outline without using headings for size alone.
- **WARNING · image-alt** — tablet-raw: images without alt attributes
  Evidence: tablet.raw.extract.json. Action: Use meaningful alt or empty alt for decorative images.
- **INFO · image-dimensions** — tablet-raw: images lack HTML dimensions
  Evidence: tablet.raw.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · schema-shape** — tablet-raw: typed node needs property review
  Evidence: tablet.raw.extract.json. Action: Validate type-specific properties with the appropriate validator.
- **WARNING · h1-count** — mobile-raw: 4 H1 elements
  Evidence: mobile.raw.extract.json. Action: Review the page outline; prefer a clear primary heading.
- **WARNING · heading-skip** — mobile-raw: skipped heading level
  Evidence: mobile.raw.extract.json. Action: Correct the semantic outline without using headings for size alone.
- **WARNING · image-alt** — mobile-raw: images without alt attributes
  Evidence: mobile.raw.extract.json. Action: Use meaningful alt or empty alt for decorative images.
- **INFO · image-dimensions** — mobile-raw: images lack HTML dimensions
  Evidence: mobile.raw.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · schema-shape** — mobile-raw: typed node needs property review
  Evidence: mobile.raw.extract.json. Action: Validate type-specific properties with the appropriate validator.
- **WARNING · title-duplicate** — desktop: multiple title elements
  Evidence: desktop.extract.json. Action: Emit one title.
- **WARNING · h1-count** — desktop: 4 H1 elements
  Evidence: desktop.extract.json. Action: Review the page outline; prefer a clear primary heading.
- **WARNING · heading-skip** — desktop: skipped heading level
  Evidence: desktop.extract.json. Action: Correct the semantic outline without using headings for size alone.
- **WARNING · image-alt** — desktop: images without alt attributes
  Evidence: desktop.extract.json. Action: Use meaningful alt or empty alt for decorative images.
- **INFO · image-dimensions** — desktop: images lack HTML dimensions
  Evidence: desktop.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · schema-shape** — desktop: typed node needs property review
  Evidence: desktop.extract.json. Action: Validate type-specific properties with the appropriate validator.
- **WARNING · lab-lcp-risk** — desktop: observed LCP exceeds 2500 ms
  Evidence: desktop.extract.json. Action: Investigate the largest content element; measure under defined conditions and compare field data.
- **INFO · long-task-risk** — desktop: long tasks observed
  Evidence: desktop.extract.json. Action: Profile main-thread work and test real interactions.
- **INFO · large-script** — desktop: a script exceeds 500 KB decoded
  Evidence: desktop.extract.json. Action: Review JavaScript delivery and hydration costs.
- **WARNING · title-duplicate** — tablet: multiple title elements
  Evidence: tablet.extract.json. Action: Emit one title.
- **WARNING · h1-count** — tablet: 4 H1 elements
  Evidence: tablet.extract.json. Action: Review the page outline; prefer a clear primary heading.
- **WARNING · heading-skip** — tablet: skipped heading level
  Evidence: tablet.extract.json. Action: Correct the semantic outline without using headings for size alone.
- **WARNING · image-alt** — tablet: images without alt attributes
  Evidence: tablet.extract.json. Action: Use meaningful alt or empty alt for decorative images.
- **INFO · image-dimensions** — tablet: images lack HTML dimensions
  Evidence: tablet.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · schema-shape** — tablet: typed node needs property review
  Evidence: tablet.extract.json. Action: Validate type-specific properties with the appropriate validator.
- **WARNING · horizontal-overflow** — tablet: horizontal overflow
  Evidence: tablet.extract.json. Action: Inspect the recorded overflowing selectors and fix unintended overflow.
- **WARNING · lab-lcp-risk** — tablet: observed LCP exceeds 2500 ms
  Evidence: tablet.extract.json. Action: Investigate the largest content element; measure under defined conditions and compare field data.
- **INFO · long-task-risk** — tablet: long tasks observed
  Evidence: tablet.extract.json. Action: Profile main-thread work and test real interactions.
- **INFO · large-script** — tablet: a script exceeds 500 KB decoded
  Evidence: tablet.extract.json. Action: Review JavaScript delivery and hydration costs.
- **WARNING · title-duplicate** — mobile: multiple title elements
  Evidence: mobile.extract.json. Action: Emit one title.
- **WARNING · h1-count** — mobile: 4 H1 elements
  Evidence: mobile.extract.json. Action: Review the page outline; prefer a clear primary heading.
- **WARNING · heading-skip** — mobile: skipped heading level
  Evidence: mobile.extract.json. Action: Correct the semantic outline without using headings for size alone.
- **WARNING · image-alt** — mobile: images without alt attributes
  Evidence: mobile.extract.json. Action: Use meaningful alt or empty alt for decorative images.
- **INFO · image-dimensions** — mobile: images lack HTML dimensions
  Evidence: mobile.extract.json. Action: Check whether CSS aspect-ratio already reserves space before changing markup.
- **INFO · schema-shape** — mobile: typed node needs property review
  Evidence: mobile.extract.json. Action: Validate type-specific properties with the appropriate validator.
- **WARNING · lab-lcp-risk** — mobile: observed LCP exceeds 2500 ms
  Evidence: mobile.extract.json. Action: Investigate the largest content element; measure under defined conditions and compare field data.
- **INFO · long-task-risk** — mobile: long tasks observed
  Evidence: mobile.extract.json. Action: Profile main-thread work and test real interactions.
- **INFO · large-script** — mobile: a script exceeds 500 KB decoded
  Evidence: mobile.extract.json. Action: Review JavaScript delivery and hydration costs.
- **INFO · sitemap-unavailable** — Sitemap unavailable: https://www.kkr.com/sitemap.xml
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
