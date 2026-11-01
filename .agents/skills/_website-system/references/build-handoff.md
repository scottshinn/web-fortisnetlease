# Architecture and implementation handoff

Keep a small artifact set aligned with the repository:

- `architecture.json`: route/intent map and verified local-business facts when relevant.
- `design-system.json` and `tokens.css`: reviewed design rules, decisions and reusable sections.
- `build-notes.md`: framework/render strategy, canonical production origin, environment policy and content sources.
- `qa/`: sampled URLs, before/after captures, technical and visual findings, and retest evidence.

For whole-site or scoped production work, [website-builder](../../website-builder/SKILL.md) and [website-iterator](../../website-iterator/SKILL.md) own the handoff. Follow the [production workflow contract](production-workflows.md) for baseline invariants, artifact identity and independent technical/visual acceptance. A concise `design.md` may reference an established design system instead of duplicating it. General site IA can use the repository's route/content format; the local-business JSON schema is not mandatory for unrelated sites.

A local-business route map should allow a reviewer to answer: what real entity does this page describe; which intent does it serve; what unique information belongs here; how will a person or crawler reach it; and where do its facts come from? A city name substitution alone is not a useful location page. Separate a service-area business from a set of public storefronts.

For multi-location organizations, use one stable ID per real location, distinct public details and service availability, and connect locations to the parent where accurate. For a service-area business, preserve the owner's address-publication choice; do not publish a private address to satisfy a markup example. Page schema, business facts and visible copy must come from one maintained source of truth.

## Building and checking a production preview

Use the repository's actual build/start commands and current official framework documentation for its installed version. Render one representative route of each template before multiplying it. Check the actual production-mode initial response, because a development server can mask export/deployment behavior. Confirm direct navigation to deep links, 404 status on missing pages, redirect targets and static asset paths.

Generate canonical and sitemap URLs from the configured production origin. Local preview audits should record expected production canonicals rather than rewriting them to localhost. Keep authentication or explicit noindex on staging according to the publication plan. Confirm crawler intent before a production release.

For a minimal static project, plain HTML/CSS with progressive enhancement is a valid output. SSR is useful when the response genuinely depends on request-time data. Framework choice and animation libraries are implementation decisions; they do not come from a mandatory house style.

## Local-business handoff example

```json
{
  "schema_version": 1,
  "business": {
    "name": "Business name supplied by the user",
    "model": "service-area",
    "facts": [
      {"key":"service","value":"Garden planning","source":"User brief","status":"verified"}
    ]
  },
  "pages": [
    {"path":"/","intent":"Understand the business and service area","template":"home","parent":"","index":true,"unique_value":"Business overview and verified service area","required_facts":["service area","contact details"],"schema_types":["Organization"],"internal_links":["/services/"]},
    {"path":"/services/","intent":"Evaluate garden planning","template":"service","parent":"/","index":true,"unique_value":"Process, scope and actual service details","required_facts":["service scope"],"schema_types":["Service"],"internal_links":["/"]}
  ],
  "unresolved": ["Confirm actual service area and public contact details before publishing."]
}
```

This is a structure example, not evidence about any real business. Complete missing facts without guessing. A route map's JSON schema validates shape; review unique value and entity accuracy separately.
