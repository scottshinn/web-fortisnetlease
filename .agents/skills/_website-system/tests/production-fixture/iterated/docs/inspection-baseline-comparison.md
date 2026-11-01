# Inspection addition — developer baseline comparison

Baseline artifact: `f5615b029ea58efcfbb38cc35ec775ede023f67691007134163c70d929e17dc8`.

Revised artifact: `674529911209c92d66a405fac8808032cc5a1b6f36c78425bb2fbc5073a8aec2`.

The source/output baseline at `../../baseline/` was read and left untouched. The repeatable developer comparison and detailed results are `../../iteration-checks.mjs` and `../../iteration-comparison.json`.

| Surface | Observed change |
| --- | --- |
| Homepage HTML | Exactly one requested card-link change: `/contact/` / “Ask about an inspection” becomes `/services/roof-inspection/` / “Explore roof inspection”. All other bytes match the initial output. |
| Repair and contact HTML | Byte-for-byte identical to the baseline, preserving initial content, metadata, schema, navigation, phone destinations and event attributes. |
| New inspection HTML | Added as the fourth route, rendered by the existing service template. Uses the new `inspection-hero` placement and the existing WebSite/WebPage/BreadcrumbList schema conventions. |
| Shared assets and 404 | All CSS, JavaScript, favicon and 404 output hashes unchanged. |
| Navigation and business configuration | Structured navigation array and existing site facts/indexing configuration unchanged. |
| Shared service template | One expression reads the phone placement from the page content. Repair content explicitly keeps `repair-hero`; the new page supplies `inspection-hero`. No structural or visual template changes. |
| Build/server/dependencies/design | Build script, server script, package manifest and design document unchanged. Route map automatically adds the inspection page. |
| Robots/sitemap | Byte-identical under the intentional noindex policy. A separate temporary build with `site.index=true` generated all four canonical sitemap entries and an indexable inspection page; the delivered source remained false. |

The initial reviewer verdicts apply to the initial digest. The revised digest has passed developer checks and awaits the separately assigned independent technical and visual regression review. This comparison does not transfer or supply an acceptance verdict.
