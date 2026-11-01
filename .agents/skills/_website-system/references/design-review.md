# Reference-to-system and visual review

Keep three layers explicit: observed source values, inferred design rules and chosen destination rules. A reference can be useful even when its technical SEO is weak; a technically clean page may have a design unsuitable for this audience. Score neither as the other.

## Extraction worksheet

For each reference, record why it was chosen, source date, relevant page type and usable patterns. Inspect desktop and small-width screenshots alongside computed samples.

| Area | Evidence and decision |
|---|---|
| Color | Observed values, foreground/background relationships, semantic roles, contrast checks. |
| Typography | Loaded versus fallback family, role, weight, size, line height, measure, wrapping, font rights. |
| Layout | Container widths, grid behavior, alignment, grouping, section order and rhythm. |
| Spacing | Repeated values, optical exceptions, fluid versus breakpoint changes. |
| Shape | Border/radius/elevation roles and consistency, not arbitrary aesthetic bans. |
| Imagery | Purpose, crop, aspect ratio, source/rights and text legibility over imagery. |
| Motion | Actual interaction and reduced-motion behavior; still screenshots do not establish it. |

Pattern names should describe a useful structure, such as `service-process`, not a site's trademark. Document content inputs, anatomy, mobile changes, accessible controls, use cases and failure cases. Retain enough provenance to revisit the source; adapt the structure rather than copying protected text, images or distinctive branding.

Before calling a design artifact reviewed, replace ambiguous measured candidate names with intentional roles, resolve conflicting sources, and add meaningful responsive and accessibility guidance for reused patterns. CSS export verifies only schema/state and safe serialization; it cannot establish design quality. Include a compact implementation note when a rule such as fluid spacing cannot be represented by a single measured token.

## Visual QA matrix

Record URL, build revision, viewport, browser, font readiness and state for each screenshot. Review primary content at desktop/tablet/mobile, then add cases driven by the actual interface: open menu, keyboard focus, active dialog, validation errors, loading, empty content, long text, zoom/reflow and reduced motion.

Give every finding an ID, viewport/state, screenshot/selector, expected result, observation, severity, fix and retest evidence. The default screenshots suppress animation and do not exercise controls. A small DOM heuristic that misses a name or target is a prompt to inspect the accessibility tree, not conclusive proof of failure.

A pixel diff detects change. It cannot determine whether a change is desirable, whether text is meaningful, or whether a menu works. Preserve baseline provenance, inspect dimensions, and allow intentional changes only after review. Do not crop or rescale away responsive failures. Use ordinary source edits to fix code and recapture affected cases.
