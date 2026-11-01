# Northline Roofing fictional demonstration

Three complete pages built from shared templates and structured content using Node builtins. No packages need to be installed. Requires Node 20+ and npm.

```powershell
npm run build
npm run check
npm start -- --port 0
```

Run these commands from this `site` directory. The server prints its chosen ephemeral loopback URL, such as `http://127.0.0.1:PORT`; the actual origin and PID are also written to `../preview.json`. Use that origin with `/`, `/services/roof-repair/`, and `/contact/`. Stop with Ctrl+C. A fixed local port can be passed with `--port 4321` when necessary. The server always binds to loopback.

`dist/` is the generated static site. `src/content.json` holds business facts, route metadata and page copy. `src/templates.mjs` holds shared layout and page templates. `src/assets/` contains styles, the local-only event hook and favicon. Re-run the build after edits. `build-manifest.json` identifies the exact generated artifact by SHA-256.

`design.md`, `architecture.json`, and `docs/route-content-notes.md` document the supplied visual system, page intent, content provenance, schema and index policy. All pages deliberately identify the fictional demonstration and carry `noindex, follow`. Canonicals remain on `https://northline.example`. Noindex routes are excluded from the generated sitemap, so it is empty by design. No robots disallow blocks the HTML.

Every phone link uses `data-event="lead_call"` and a `data-placement` value. Activating one dispatches a local `lead_call` event on `window` containing the current path and placement. No event is sent externally; there is no persistent event storage. The event represents a click only. The supplied reserved number does not reach a real business.

The included static server returns real 404 responses and redirects slashless or index-file page variants. A future static host must preserve those route/status behaviors, serve the assets with the matching MIME types, and keep the intended indexing policy. No hosting or deployment is configured in this exercise.

Developer checks prepare the implementation handoff; independent technical and visual acceptance is pending the separate reviewers assigned by the orchestration workflow. A real launch would additionally need verified real business details, a working phone, a deployable domain and a publication decision.
