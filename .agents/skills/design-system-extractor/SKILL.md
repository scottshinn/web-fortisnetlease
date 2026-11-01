---
name: design-system-extractor
description: Turn website captures or visual references into an evidence-backed design system with tokens, responsive section patterns and implementation decisions. Use before adapting a reference into a new website or documenting an existing design language.
---

# Design system extractor

Produce a system that can guide implementation without carrying over unrelated content or rigid taste rules. Read the [shared contract](../_website-system/references/contract.md) and [design review guide](../_website-system/references/design-review.md).

## Start from evidence

Accept a rolodex record, existing HTML/screenshots, or a reference URL. A completed upstream skill is not a prerequisite. For a URL, use the shared Playwright capture command or [site-researcher](../site-researcher/SKILL.md); for supplied artifacts, record their provenance directly. Keep reference-site observations separate from choices for the destination brand.

Search by industry, style and component before recapturing. Select references for specific reasons: one may supply useful typography while another supplies service-page hierarchy. Do not average conflicting references into arbitrary tokens. Use the user's supplied audience, content, brand and emotional direction; ask only for missing facts that materially change the design.

## Extract, review, adapt

1. For a captured record, run the shared helper's `extract --rolodex DIR --site ID --output design-system.json`. This produces `draft-measured` candidates, not a finished design system. Read the source screenshots and selectors.
2. Name semantic color roles and verify foreground/background pairs. Distinguish heading and body type roles, sizes, weights, line heights and measures. Consolidate spacing, grid/container widths, radii, borders, elevation and motion. Record viewport evidence and confidence for each choice. Computed CSS values do not prove the source's original tokens or breakpoints.
3. Convert section candidates into reusable patterns: purpose, content inputs, anatomy, alignment/grid, spacing, responsive behavior, interaction states, accessibility expectations, when to use, and when to avoid. Trace each pattern to a screenshot or DOM location. Capture information hierarchy and conversion purpose separately from decoration.
4. Resolve destination decisions: retain, adapt or reject each relevant source idea, with a reason tied to the actual brief. Preserve verified brand assets and font licensing constraints. No universal bans on white backgrounds, common fonts, grids or particular radii. Original content and honest imagery matter more than arbitrary novelty.
5. Read the [design-system schema](../_website-system/schemas/design-system.schema.json), complete decisions and responsive pattern guidance, then mark the artifact `reviewed` only after reviewing the evidence. Export named CSS tokens with `css --file design-system.json --output tokens.css`. The exporter intentionally rejects unreviewed candidates.
6. Validate and `attach-design` to the rolodex record. The attachment creates a content-versioned artifact and keeps earlier versions. Add selected pattern tags and design notes with `curate` so subsequent projects can find them.

## Deliver

Provide reviewed JSON, tokens CSS, section specifications and a concise account of what was adapted and why. Link evidence and identify unresolved assumptions. Hand these artifacts to [seo-ssr-builder](../seo-ssr-builder/SKILL.md) if implementation is part of the request.
