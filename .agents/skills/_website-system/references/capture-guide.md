# Playwright capture and commands

Use Node.js 20 or later. From the package root:

```sh
npm --prefix .agents/skills/_website-system install
npm --prefix .agents/skills/_website-system exec playwright install chromium
node .agents/skills/_website-system/scripts/rolodex.mjs --help
node .agents/skills/_website-system/scripts/rolodex.mjs capture --url https://example.com --rolodex ./rolodex
node .agents/skills/_website-system/scripts/rolodex.mjs search --rolodex ./rolodex --industry dentistry --style editorial
node .agents/skills/_website-system/scripts/rolodex.mjs search --rolodex ./rolodex --q "warm serif"
node .agents/skills/_website-system/scripts/rolodex.mjs validate --rolodex ./rolodex
```

Use `--channel chrome` or `--channel msedge` to use an already installed compatible browser. No signed-in profile is loaded. The library can also resolve dependencies through a host-provided `NODE_PATH`; normal users should install the pinned dependencies. If a environment restricts shell browser automation, use its authorized Playwright integration and preserve the same artifacts; do not work around a tool restriction.

The capture visits exactly the given page at 1440×1000, 768×1024 and 390×844. Each view saves its own initial response and rendered DOM. It also gets origin-root robots.txt, sitemap.xml, declared same-origin sitemap files and sitemap-index children, up to eight sitemap files total, then llms.txt. Sitemap parsing records up to 1,000 locations per file and reports the full location count. External sitemaps are listed as out of scope. This is not a recursive website crawler.

By default internal links are inventoried but not fetched. `--check-links 10` checks at most ten distinct same-origin destinations with GET, without clicking controls. Use only when fetching those destinations is within scope; GET endpoints on poorly designed sites can have side effects. No login, submission, crawler-identity spoofing or access-control bypass is implemented.

`--wait-for "[data-ready='true']"` adds a bounded visible-selector wait. `--settle-ms 1000` adjusts final settling from 0–5,000 ms. Font waits, scrolling for lazy content and screenshot coverage are bounded and recorded. The tool does not wait indefinitely for network idle. Readiness timeouts remain evidence and must not be treated as successful hydration. Pages above 20,000 pixels get a viewport capture and an explicit full-page flag. Up to eight desktop section screenshots supplement the three views.

Response `.raw.body` preserves the browser's response entity buffer, not packet-level compressed wire bytes. Decoded HTML records the response-header charset, defaulting to UTF-8; unusual encodings or conflicting in-document charset declarations need manual review. `raw.html` is the first viewport's decoded response, while `page.content()` supplies the rendered serialization. This distinction follows the [Playwright response API](https://playwright.dev/docs/api/class-response) and [page API](https://playwright.dev/docs/api/class-page).

The context starts anonymous, uses UTC/en-US and reduced motion, and blocks service workers for repeatability. It can receive normal site cookies during capture. Changing locale, consent, authenticated content or device behavior requires an explicit separate test. Mobile here means viewport width, not mobile UA, touch emulation or real hardware. Closed shadow roots and iframe interiors are not traversed. CSS samples are capped at 200 elements, controls at 300 and section candidates at 40; these are samples, not exhaustive inventories.

Selected response headers preserve SEO/cache/server signals while omitting cookie and authorization headers. Full rendered HTML, DOM text and resource URLs can still contain sensitive material, so review before sharing.

## Other commands

```sh
node .agents/skills/_website-system/scripts/rolodex.mjs curate --rolodex ./rolodex --site SITE-ID --file curation.json
node .agents/skills/_website-system/scripts/rolodex.mjs extract --rolodex ./rolodex --site SITE-ID --output design-system.json
node .agents/skills/_website-system/scripts/rolodex.mjs attach-design --rolodex ./rolodex --site SITE-ID --file design-system.json
node .agents/skills/_website-system/scripts/rolodex.mjs css --file design-system.json --output tokens.css
node .agents/skills/_website-system/scripts/rolodex.mjs audit --file capture-data.json --output report.json --fail-on error
node .agents/skills/_website-system/scripts/rolodex.mjs visual-diff --before baseline.png --after current.png --output diff.png --threshold 0.02
node .agents/skills/_website-system/scripts/rolodex.mjs index --rolodex ./rolodex
```

The capitalized IDs stand for actual returned identifiers; get them from capture output or search. Audit exit 2 signals an explicitly selected failure gate. Visual-diff exit 2 signals review/dimension mismatch. Exit 1 signals a runtime, argument or validation problem. Capture itself saves findings and returns 0 even if the page has SEO errors; use `audit --fail-on` when a gate is needed.
