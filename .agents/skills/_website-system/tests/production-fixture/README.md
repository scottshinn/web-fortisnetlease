# Production workflow fixtures

`baseline/` is the runnable three-page Northline fictional site produced with `website-builder`. `iterated/` adds a roof-inspection page and a homepage link using `website-iterator`. Both were implemented by the same forward-test agent; acceptance came from separate technical and visual reviewers.

The original implementation notes retain the developer's pending-review language. Final independent verdicts and evidence are linked from the full distribution's [production validation report](../../../../../reports/production-workflow-validation.md); the developer did not rewrite those verdicts into its own handoff. The installer copies runnable fixtures with the skills; review reports remain in the full distribution.

`contract.json` identifies the generated artifacts, preserved files, unchanged routes and requested addition. The production tests copy both sites into temporary directories, rebuild from source, match the reviewed output digests, then serve them on ephemeral loopback ports. They check raw HTML, URL/canonical/indexing behavior, responsive navigation, skip focus, the local conversion hook and the new route's sitemap inclusion in an isolated index-enabled build. No live calls, analytics or public deployment occur.

To explore either snapshot directly, open its directory and run:

```sh
npm run build
npm run check
npm start -- --port 0
```

No site dependencies are needed. Stop the preview with Ctrl+C. The demo intentionally uses `noindex`, a reserved domain/phone and clearly fictional content. It is a maintained regression fixture, not a ready-to-launch client template or a required stack for future builds.
