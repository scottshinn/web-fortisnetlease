---
name: seo-ssr-builder
description: Implement SEO and rendering standards for static or server-rendered websites, including initial HTML, metadata, structured data and accessible semantics. Use as the technical implementation specialist or for a directly requested SEO/SSR build.
---

# SEO and SSR builder

Build the requested site in its existing stack when practical. Prefer static generation for stable pages, server rendering for request-dependent content and small interactive islands for behavior. Do not replace the framework merely because a reference used another technology. Read the [SEO reference](../_website-system/references/seo-reference.md) and [build handoff](../_website-system/references/build-handoff.md).

This skill owns implementation standards. [website-builder](../website-builder/SKILL.md) coordinates complete new-site delivery; [website-iterator](../website-iterator/SKILL.md) coordinates scoped existing-site changes. Follow their supplied brief/change contract without duplicating orchestration. Under either production workflow, developer checks do not replace the independent QA required by the [production contract](../_website-system/references/production-workflows.md).

## Establish the build inputs

Use the user's brief, repository, verified content and any reviewed design system. Search the rolodex for relevant patterns when it would improve the result. A rolodex record is optional; a build may start from the supplied design or an existing system. If a measured draft is used, resolve the design decisions before treating its token candidates as authoritative.

For a local business, invoke [local-business-architect](../local-business-architect/SKILL.md) when entity, service or location structure needs design. Otherwise define a page/intent map directly. Record intended indexing policy and canonical production origin independently from the local preview origin.

## Implement

1. Map every requested page to an intent, content source, template, title/description, canonical, index intent, relevant schema types and internal links. Keep non-public/staging pages appropriately controlled; never turn on indexing just to silence an audit.
2. Render primary content, navigation and headings into the initial response. Keep essential facts and JSON-LD consistent through hydration. Use real anchors for navigation and buttons for actions, a clear main landmark, logical headings, form labels and keyboard-operable controls. Visible content must remain meaningful when JavaScript fails.
3. Implement the reviewed type, color, spacing and section rules with semantic tokens and composable components. Let content determine section order. Include responsive navigation and required states; retain every relevant destination at small widths. Avoid hiding overflow to conceal a layout defect.
4. Emit accurate metadata and an absolute canonical appropriate to each route. Generate truthful JSON-LD from the same data as visible content, with stable entity IDs and type-specific properties. Serialize safely: escape `<` in JSON embedded into an HTML script. No invented reviews, offices, credentials, awards or quantities.
5. Generate robots and sitemap files from the intended publication state and canonical route map. Serve actual 404/redirect statuses. Review any existing crawler-specific rules rather than silently replacing them. Add `llms.txt` only when useful or requested; keep it concise, factual and linked to canonical content. It is not an access control or a ranking requirement.
6. Bound JS and media costs: reserve media space, size responsive images, avoid lazy-loading the main visible image, verify font loading, reduce animation under user preferences, and avoid unnecessary hydration. Record performance budgets appropriate to this project, with units and measurement conditions.

## Verify and hand off

Run the project's build and relevant checks, then inspect the production preview with the shared Playwright capture tool. Use [technical-seo-qa](../technical-seo-qa/SKILL.md) for requested discovery/release coverage and [visual-qa](../visual-qa/SKILL.md) for rendered quality. Verify representative route templates, deep links, redirects and missing pages, not just the homepage.

Deliver the implemented site, route map, design artifacts, verification evidence and unresolved facts. Publishing, contacting people or submitting to indexing services requires the user's existing authorization; creating a local build does not imply those actions.
