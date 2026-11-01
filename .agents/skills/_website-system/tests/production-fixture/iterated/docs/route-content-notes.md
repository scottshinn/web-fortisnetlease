# Routes and content

`../src/content.json` is the maintained source of truth for business facts, page metadata, route paths and page copy. `../architecture.json` records route intent and provenance. Shared templates render all requested pages at build time; JavaScript is optional enhancement only.

| Route | Intent and unique content | Main destinations |
| --- | --- | --- |
| `/` | Overview of residential roof repair and inspection; Birmingham and Troy service area; introduction to the two services. | Roof repair, contact, telephone |
| `/services/roof-repair/` | Roof-repair intent with details a homeowner can mention on a call, plus a connection to roof inspection. No unsupported material, repair method or response promise. | Home, contact, telephone |
| `/services/roof-inspection/` | Supplied inspection scope: visible roof condition, observed concerns, and questions to discuss before deciding on repair; Birmingham and Troy availability. | Home, roof repair, contact, telephone |
| `/contact/` | Supplied phone, explicit reserved fictional-number explanation, services and service area in one place; no public office address or form. | Home, roof repair, telephone |

The single service-area business is not represented as two offices. Separate city pages would repeat the same limited facts and are not part of scope. Primary navigation remains Home / Roof repair / Contact; the homepage service section links to the added inspection page. Breadcrumbs on the deeper routes link to the homepage without inventing a `/services/` index. No prior website or migration was supplied; trailing-slash and index-file requests normalize to the canonical route.

Schema describes this site and its web pages, with breadcrumbs on deeper pages. A fictional business is not marked up as a real LocalBusiness, and no rich-result eligibility is claimed. Schema names/descriptions and visible facts come from the same structured content. All canonicals use the supplied origin. The demonstration is intentionally noindex; its sitemap therefore contains no indexable entries. Robots permits fetching so the noindex instruction remains observable. No crawler-specific access or training policy is inferred.

`data-event="lead_call"` is the stable click hook on every telephone CTA. `data-placement` identifies its position. Service-page hero placement is stored in structured content (`repair-hero` or `inspection-hero`); existing placements remain unchanged. The progressive enhancement dispatches a local `CustomEvent('lead_call')` on `window` with only page path and placement. It does not send a request, write storage, collect identifiers, or claim that a call was completed.

The inspection addition is governed by `inspection-change-contract.md`, with before/after comparison in `inspection-baseline-comparison.md`. Build-time `site.index` remains false. The existing sitemap generator reads all page records, so a later intentional change to true includes the new inspection canonical alongside the other three routes. A temporary-build check verifies that alternate policy without changing this delivered demo's policy; any real launch still needs the decisions below.

Unresolved for any real-world launch: real business identity and consent, a functioning public phone, an actual deployable domain, publication/indexing choice and hosting configuration. These are not blockers for the fictional local exercise. Independent review remains pending at the implementation handoff.
