---
name: website-iterator
description: Orchestrate scoped additions and improvements to an existing client website while preserving its stack, brand, URLs, content model, tracking and SEO value. Use for new pages, section edits, conversion work and technical SEO changes without an unnecessary rebuild.
---

# Website iterator

Deliver the smallest coherent change that accomplishes the requested business or SEO goal. Read the [production workflow contract](../_website-system/references/production-workflows.md) for baseline, regression and independent-review requirements. Use [website-builder](../website-builder/SKILL.md) for an explicitly requested complete new-site build.

## Inspect before changing

Inspect the repository, running site and relevant existing artifacts. Read repository instructions and distinguish the user's changes from your work. Identify the current framework/build system, shared components/templates, design tokens, typography/spacing, content/CMS model, route conventions, internal linking, canonical/schema generation, analytics and conversion events, dependencies, deployment assumptions and existing checks. Inspect relevant source and actual behavior; do not rely only on screenshots.

Record a compact change contract: requested outcome, affected routes/components, baseline evidence, acceptance criteria, preserved invariants and any necessary exceptions. Use existing design documentation or document observed rules in a focused `design.md` when a substantial visual change lacks a reliable design artifact. Capture the relevant baseline before editing, including an unchanged neighboring page or shared template when regressions are plausible.

Preserve established architecture, brand, URLs and SEO equity unless the task actually requires a change. A schema or SEO request does not authorize redesign, replatforming, dependency upgrades, tracking replacement or CMS migration. Use existing integrations and event identifiers. Do not drop analytics attributes while replacing a CTA; verify the conversion event still works without sending real production events during tests.

## Apply the scoped workflow

- **Service, location or city pages:** extend current templates/content models and navigation conventions. Consult [local-business-architect](../local-business-architect/SKILL.md) for entity and page-value decisions. Confirm real service coverage and unique useful content; do not imply offices or mass-generate doorway pages. Preserve existing paths and plan redirects only for intentional URL changes.
- **Hero, section, landing page or case-study work:** reuse the established design system and components. Consult [design-system-extractor](../design-system-extractor/SKILL.md) only to resolve missing design knowledge or when a new direction is requested. Search the rolodex only if relevant; a narrow edit does not need new inspiration. Use verified case-study content and existing CMS schema when available.
- **SEO, schema or performance work:** use [seo-ssr-builder](../seo-ssr-builder/SKILL.md) for technical standards within the existing implementation. Correct the relevant content/entity/rendering pipeline rather than layering conflicting metadata or a separate schema generator over it. Keep primary content crawlable and semantics intact.
- **Conversion improvements:** tie changes to an explicit hypothesis and existing funnel behavior. Preserve event names, destinations, accessibility and consent rules. Report measured evidence when available; a revised CTA is not proof of a conversion-rate increase.

Implement and run the affected build/checks. Inspect the diff for unrelated changes and test preserved interfaces. Include any dependent changes needed for the result to function: route data, links, sitemap entries, structured data or template consumers. “Smallest coherent” does not mean leaving a partially wired feature.

## Independent regression QA

Hand the actual before/after site, change contract and artifact identifiers to independent [technical-seo-qa](../technical-seo-qa/SKILL.md) and [visual-qa](../visual-qa/SKILL.md) reviewers following the shared contract. Technical review compares raw server HTML, rendered DOM and relevant URLs/schema/link/tracking behavior; visual review reads before/after screenshots and tests affected states at relevant widths. Include unchanged pages that share modified components.

Reviewers determine findings and retest outcomes independently. The iterator fixes issues and supplies new evidence but does not approve its own patch. Retain original baselines and distinguish requested changes from regressions; never reset a screenshot baseline just to silence differences.

## Deliver

Describe what changed, why, which established behaviors were preserved, the independent QA results and remaining limits. Link the implementation and review artifacts. Continue until the requested scoped change works, without converting the task into a general rebuild or claiming unmeasured SEO/conversion gains.
