# Repeatable production skill evaluation

Use these bounded exercises when maintaining the production skills. Run in an isolated workspace with a local server and reserved fictional business details. They do not authorize publishing, contacting anyone or sending analytics to an external service.

## Exercise 1: new client

Give the implementation agent `website-builder`, the specialist/reference files it needs and this brief. Do not provide an expected implementation or QA verdict.

> Build a complete small website for Northline Roofing, a fictional test client. Supplied facts: residential roof repair and roof inspection; service area Birmingham and Troy, Michigan; reserved fictional phone +1-248-555-0100; no public office. Pages: `/`, `/services/roof-repair/`, `/contact/`. Canonical origin: `https://northline.example`. Clearly identify the demonstration. Do not invent reviews, credentials, warranties, offices or years of experience. Supplied design: light background #f5f7fa, navy #142d4e, orange #bc4b14, system sans, restrained square controls and mobile-first legibility. Primary conversion is a telephone link. Include a local-only `lead_call` event hook with a stable data attribute and no external analytics transmission. Use a maintainable static build with shared templates/content, Node-only build/start commands and no downloaded site dependencies. Produce a design artifact and route/content notes. Hand the runnable production preview to separate technical and visual reviewers.

This exercises production from a business brief and supplied design without mandatory rolodex research. The user-facing result should be a working small site, with missing real-business facts kept visible.

## Exercise 2: existing client

After the new-site artifact has been independently reviewed, preserve a baseline of its source/output and give an implementation agent `website-iterator` plus this request:

> Add `/services/roof-inspection/` using the existing design, shared template and content model. Link it from the homepage service section without changing the established navigation. Supplied fictional service content: a roof inspection reviews visible roof condition, helps the homeowner understand observed concerns and identifies questions to discuss before deciding on repair. Service is available in Birmingham and Troy. Do not invent certifications, report guarantees, prices, warranties or emergency availability. Preserve the current brand, all existing URLs, tracking names/attributes, schema conventions, build/deployment assumptions and dependencies. Keep the existing repair and contact pages unchanged unless a specific dependency requires otherwise. Update the sitemap and appropriate truthful service metadata/schema. Capture baseline evidence, implement the scoped change and hand the result to independent technical and visual regression reviewers.

This exercises reuse and preservation rather than replatforming. A meaningful test checks preserved behavior and files, the new route's initial HTML, page metadata/schema, internal-link/sitemap reachability and the existing conversion hook.

## Review method

Use reviewers who did not implement the artifact. Give them the brief/change contract, actual baseline/current previews, build identifiers and the QA skills, without the implementer's desired verdict. Technical review compares raw/rendered HTML, metadata/schema, route/status behavior and preserved invariants. Visual review reads screenshots and exercises relevant responsive/focus/navigation states. Reviewers report findings; implementers fix them; affected reviewers retest.

Preserve report scope and unknowns. A local fictional exercise cannot demonstrate real-world rankings, field performance, genuine business credentials, live conversion improvement or third-party integration readiness. Automated fixture checks complement the independent behavioral review; they do not prove that every future natural-language invocation will route correctly.
