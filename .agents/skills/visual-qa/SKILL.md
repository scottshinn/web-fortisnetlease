---
name: visual-qa
description: Inspect rendered website screenshots and interaction states across viewport sizes against a brief or design system. Use for visual regressions, responsive layout checks and design-fidelity QA after UI changes.
---

# Visual QA

Judge the rendered result against the actual brief and verified design system. Read the [design review guide](../_website-system/references/design-review.md) and [capture guide](../_website-system/references/capture-guide.md). Existing screenshots and a live page are sufficient; a completed upstream build skill is not required.

For production acceptance, follow the [production contract](../_website-system/references/production-workflows.md) as a reviewer who did not implement the reviewed change. Identify the artifact, read the screenshots yourself, and report findings without editing the implementation. For iterator work, compare the original baseline and unchanged consumers of shared components; preserve intentional local changes while detecting layout, interaction and responsive regressions. Return fixes to the implementer, then independently retest the affected cases.

## Capture and inspect

Use the shared Playwright tool to capture 1440, 768 and 390 pixel widths. Add 320 pixels, landscape or a particular target device when the page or user requires it. The default tool resizes viewports; it does not emulate a phone's user agent, touch behavior or real browser chrome.

Read the PNGs. Review the entire page and section details: hierarchy, grid alignment, typography, line wrapping, color roles/contrast, imagery, spacing, border/radius consistency, seams between sections, sticky UI and responsive reflow. Confirm horizontal overflow with DOM measurements and identify the responsible elements; do not mask defects with overflow clipping.

When comparing to a baseline, use the same browser, viewport, fonts, content and motion conditions. The helper's `visual-diff --before baseline.png --after current.png --output diff.png` produces a simple pixel-change image and ratio. Read both screenshots and the diff. Dimension mismatch or pixel change requests review; it does not establish a design defect. Never replace a baseline merely to make a check pass.

## Test meaningful states

On the live page, use available Playwright controls or a small project-specific script to exercise the relevant menu, focus, dialog, accordion, form-error, loading and empty states. Only exercise actions authorized for the environment. Capture each important state with a descriptive filename. The default capture tool does not click controls or submit forms.

Verify keyboard access and visible focus, menu destinations at small widths, Escape and focus return for dialogs, accessible names and state announcements, readable zoom/reflow, touch affordances and reduced motion. Do not require focus trapping for a simple non-modal navigation disclosure. Contrast, accessible names and tap-target exceptions need contextual review; the shared heuristics cannot certify them.

Record observed font fallbacks, failed resources, lazy-load gaps and readiness timeouts before criticizing the intended design. A reduced-motion capture does not verify the normal motion experience. Keep aesthetics separate from technical SEO findings; the two reviews may share evidence without sharing a verdict.

## Close the loop

For each issue, provide viewport/state, screenshot, selector or source location, expected versus actual behavior, severity and a specific fix. If fixes are in scope, apply them and recapture affected views/states. Finish with inspected images, changes made, open findings and anything not exercised. Update the rolodex's reviewed design notes only when a reusable lesson is supported by evidence.
