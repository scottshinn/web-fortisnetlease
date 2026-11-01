# Technical audit

URL: https://www.matthews.com/properties

Automated quality: **high-risk**. 1 errors, 38 warnings.

- **ERROR · http-error** — Document returns 404
  Evidence: http.json. Action: Serve the intended status and content.
- **WARNING · title-duplicate** — raw: multiple title elements
  Evidence: raw.extract.json. Action: Emit one title.
- **WARNING · description-duplicate** — raw: duplicate descriptions
  Evidence: raw.extract.json. Action: Emit one description.
- **WARNING · canonical-count** — raw: 0 canonicals
  Evidence: raw.extract.json. Action: Use one canonical for this indexable HTML page.
- **WARNING · meta-noindex** — raw: indexing restriction present
  Evidence: raw.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · h1-count** — raw: 0 H1 elements
  Evidence: raw.extract.json. Action: Review the page outline; prefer a clear primary heading.
- **WARNING · main-count** — raw: 0 main landmarks
  Evidence: raw.extract.json. Action: Expose one active main content landmark.
- **WARNING · lang-missing** — raw: language missing
  Evidence: raw.extract.json. Action: Set the document language.
- **INFO · og-missing** — raw: og:title missing
  Evidence: raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — raw: og:type missing
  Evidence: raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — raw: og:url missing
  Evidence: raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — raw: og:image missing
  Evidence: raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **WARNING · title-duplicate** — tablet-raw: multiple title elements
  Evidence: tablet.raw.extract.json. Action: Emit one title.
- **WARNING · description-duplicate** — tablet-raw: duplicate descriptions
  Evidence: tablet.raw.extract.json. Action: Emit one description.
- **WARNING · canonical-count** — tablet-raw: 0 canonicals
  Evidence: tablet.raw.extract.json. Action: Use one canonical for this indexable HTML page.
- **WARNING · meta-noindex** — tablet-raw: indexing restriction present
  Evidence: tablet.raw.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · h1-count** — tablet-raw: 0 H1 elements
  Evidence: tablet.raw.extract.json. Action: Review the page outline; prefer a clear primary heading.
- **WARNING · main-count** — tablet-raw: 0 main landmarks
  Evidence: tablet.raw.extract.json. Action: Expose one active main content landmark.
- **WARNING · lang-missing** — tablet-raw: language missing
  Evidence: tablet.raw.extract.json. Action: Set the document language.
- **INFO · og-missing** — tablet-raw: og:title missing
  Evidence: tablet.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — tablet-raw: og:type missing
  Evidence: tablet.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — tablet-raw: og:url missing
  Evidence: tablet.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — tablet-raw: og:image missing
  Evidence: tablet.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **WARNING · title-duplicate** — mobile-raw: multiple title elements
  Evidence: mobile.raw.extract.json. Action: Emit one title.
- **WARNING · description-duplicate** — mobile-raw: duplicate descriptions
  Evidence: mobile.raw.extract.json. Action: Emit one description.
- **WARNING · canonical-count** — mobile-raw: 0 canonicals
  Evidence: mobile.raw.extract.json. Action: Use one canonical for this indexable HTML page.
- **WARNING · meta-noindex** — mobile-raw: indexing restriction present
  Evidence: mobile.raw.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · h1-count** — mobile-raw: 0 H1 elements
  Evidence: mobile.raw.extract.json. Action: Review the page outline; prefer a clear primary heading.
- **WARNING · main-count** — mobile-raw: 0 main landmarks
  Evidence: mobile.raw.extract.json. Action: Expose one active main content landmark.
- **WARNING · lang-missing** — mobile-raw: language missing
  Evidence: mobile.raw.extract.json. Action: Set the document language.
- **INFO · og-missing** — mobile-raw: og:title missing
  Evidence: mobile.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — mobile-raw: og:type missing
  Evidence: mobile.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — mobile-raw: og:url missing
  Evidence: mobile.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **INFO · og-missing** — mobile-raw: og:image missing
  Evidence: mobile.raw.extract.json. Action: Complete social sharing metadata if the page is shareable.
- **WARNING · meta-noindex** — desktop: indexing restriction present
  Evidence: desktop.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · heading-skip** — desktop: skipped heading level
  Evidence: desktop.extract.json. Action: Correct the semantic outline without using headings for size alone.
- **WARNING · input-label** — desktop: form controls without detected labels
  Evidence: desktop.extract.json. Action: Provide a programmatic name; verify the accessibility tree.
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
- **WARNING · canonical-render-change** — desktop: canonical changes after render
  Evidence: desktop.extract.json. Action: Align initial HTML and hydrated metadata.
- **INFO · long-task-risk** — desktop: long tasks observed
  Evidence: desktop.extract.json. Action: Profile main-thread work and test real interactions.
- **WARNING · meta-noindex** — tablet: indexing restriction present
  Evidence: tablet.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · heading-skip** — tablet: skipped heading level
  Evidence: tablet.extract.json. Action: Correct the semantic outline without using headings for size alone.
- **WARNING · input-label** — tablet: form controls without detected labels
  Evidence: tablet.extract.json. Action: Provide a programmatic name; verify the accessibility tree.
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
- **WARNING · canonical-render-change** — tablet: canonical changes after render
  Evidence: tablet.extract.json. Action: Align initial HTML and hydrated metadata.
- **WARNING · button-name** — tablet: buttons without detected names
  Evidence: tablet.extract.json. Action: Check the accessible name before adding labels.
- **INFO · long-task-risk** — tablet: long tasks observed
  Evidence: tablet.extract.json. Action: Profile main-thread work and test real interactions.
- **WARNING · meta-noindex** — mobile: indexing restriction present
  Evidence: mobile.extract.json. Action: Compare against intended indexing policy; retain intentional exclusions.
- **WARNING · heading-skip** — mobile: skipped heading level
  Evidence: mobile.extract.json. Action: Correct the semantic outline without using headings for size alone.
- **WARNING · input-label** — mobile: form controls without detected labels
  Evidence: mobile.extract.json. Action: Provide a programmatic name; verify the accessibility tree.
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
- **WARNING · canonical-render-change** — mobile: canonical changes after render
  Evidence: mobile.extract.json. Action: Align initial HTML and hydrated metadata.
- **WARNING · button-name** — mobile: buttons without detected names
  Evidence: mobile.extract.json. Action: Check the accessible name before adding labels.
- **INFO · long-task-risk** — mobile: long tasks observed
  Evidence: mobile.extract.json. Action: Profile main-thread work and test real interactions.
- **INFO · llms-inventory** — llms.txt: present
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
