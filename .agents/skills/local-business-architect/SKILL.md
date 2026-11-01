---
name: local-business-architect
description: Design a local-business website's service, location and entity architecture from verified business facts. Use for single-location, multi-location or service-area sites before building routes and structured data.
---

# Local business architect

Produce an implementable route and entity map that reflects the actual business. Read the [build handoff](../_website-system/references/build-handoff.md), the [SEO reference](../_website-system/references/seo-reference.md), and the [architecture schema](../_website-system/schemas/architecture.schema.json).

## Resolve the business model

Use supplied business documents and site content as evidence. Distinguish verified facts from unverified claims. Identify whether the business serves customers at one public location, multiple real locations, or across a service area. Do not infer a public storefront from a mailing address. Continue the architecture with unresolved facts marked; request only facts needed for a material decision.

Record name, public address policy, phone, services, actual locations, service areas, hours, booking/contact routes and supplied credentials, each with provenance. Never fabricate NAP details, coordinates, ratings, opening hours or offices. Source availability does not authorize changing a Business Profile or directory listing.

## Design routes and entities

- Single location: usually a home page, substantive service pages, a location/contact page and relevant proof/about content. Link service details to the actual location and contact path.
- Multiple locations: a location directory and one useful page for each real location, including its own verified details and available services. Use stable location entity IDs; connect a parent organization where appropriate.
- Service area: describe the genuine service area and business access model. Create area pages only when distinct local information and user value justify them. Do not create a city-by-service matrix of near-duplicate doorway pages or imply offices where none exist.

For every page, record path, intent, template, parent, index intent, unique value, required facts, proposed schema types and internal links. Separate a service's entity from the provider's entity. Use the most specific supported LocalBusiness subtype only when accurate. Missing information may limit rich-result eligibility; it is not a reason to invent it. Treat schema vocabulary validity and search-feature eligibility as different checks.

Map navigation and breadcrumbs to the hierarchy. Every intended indexable page should be reachable by crawlable links. Record redirects for replaced URLs and canonical rules for overlap. Preserve useful existing URLs unless there is a clear reason to migrate.

## Output and validation

Save `architecture.json` using the schema, plus a short entity/route rationale and unresolved-facts list. Validate it with the shared helper's `validate --file architecture.json --schema architecture`. Check internal-link targets against the page map and confirm that each proposed area/location page earns its existence.

Hand the map to [seo-ssr-builder](../seo-ssr-builder/SKILL.md) when implementation is requested. The architect can run independently with business facts alone; research and design extraction are optional inputs.
