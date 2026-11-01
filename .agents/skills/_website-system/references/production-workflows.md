# Production orchestration and independent review

`website-builder` owns complete new-site delivery. `website-iterator` owns scoped changes to an established site. The six existing specialists remain independently invocable. Use skills as capabilities, not a mandatory chain for every request.

## Inputs and design authority

Use a brief, existing source website, supplied content, keyword/SEO strategy, selected references, rolodex records and repository evidence as available. Preserve the client's defined design system and source-of-truth content. Consult the rolodex when it adds useful design knowledge; do not force research or recapture when the task already supplies sufficient direction.

Before substantial visual implementation, use `design.md` or an equivalent reviewed artifact. Before a narrow edit, referencing the current system and documenting the intended local change may be sufficient. Keep technical architecture, semantic access, accessible interactions and initial-HTML content requirements above reference aesthetics. Adapt a visual pattern that conflicts with those requirements.

## Minimal production handoff

Store client-specific work alongside the project, such as in `docs/website/`, using its existing documentation conventions. Do not place private client plans into a shared design rolodex by default.

| Artifact | Required information |
|---|---|
| Brief/change contract | Requested business outcome, scope, content sources, acceptance criteria, unresolved facts and integration dependencies. |
| Design artifact | Existing system reference or reviewed direction, responsive rules and any intentional exceptions. |
| Architecture | Page/intent map, content/entity model, links and canonical/index intent; use `architecture.json` for the existing local-business schema when relevant. |
| Baseline (iteration/migration) | Relevant old routes/statuses, raw/rendered HTML, screenshots, component/content conventions, tracking hooks and build assumptions. |
| Implementation handoff | Build/run instructions, preview URL(s), actual revision or file/directory digest, changed routes/components, relevant source artifacts and test boundaries. |
| Independent reports | Reviewer identities/roles, artifact reviewed, checks performed, expected/observed behavior, evidence, findings, remaining unknowns and retest outcome. |

Use only the detail needed to preserve the requested scope. Reuse existing artifacts rather than copying a complete standards manual into a project's notes.

When maintaining this skill collection, use the [production evaluation exercises](production-evaluation.md) for bounded new-site and iteration forward tests. They are test scenarios, not mandatory steps in normal client work.

## Independent technical and visual QA

The person/agent that implements a change cannot provide the independent acceptance verdict for that same change. Separate skills loaded by the same implementing agent, automated scripts, and a second self-review do not by themselves establish independence.

When subagents are available and authorized, use separate technical and visual QA agents that did not implement the reviewed change. Give each the relevant QA skill, the actual served output and source/evidence needed to evaluate it, the brief/change contract, preserved invariants and test scope. An orchestrating parent may dispatch these reviewers on behalf of an implementation worker. Do not supply an expected verdict or tell reviewers what they should find. Reviewers inspect the result; they do not modify implementation during the review. Their factual results remain separate from the implementation summary.

If independent agents are unavailable, complete all authorized implementation and developer verification, prepare the concrete handoff and route it to a separate human reviewer or later independent task. Label independent acceptance as pending. Do not claim independence or production readiness by renaming a self-review. A lack of independent review does not justify leaving unrelated implementation work unfinished.

Technical QA should compare, where practical, the original server response, hydrated DOM and browser outcome for representative affected routes. Report request URL/status, actual artifact identity and capture conditions. A visually correct shell can still lack meaningful initial HTML. Also check the intended metadata/schema/crawler policy and preservation of relevant links, content models, tracking and deployment behavior.

Visual QA must read the actual screenshots, compare with the current design/brief and exercise relevant states. Use mobile/tablet/desktop and additional device/state cases when needed. For iteration, compare against the original baseline and inspect unchanged consumers of modified shared components. A pixel diff is evidence, not the reviewer.

## Fixes, retests and completion

Implementers resolve confirmed findings and identify the revised artifact. The affected reviewer checks the fix and relevant regression cases. A sign-off for an earlier build does not cover a later revision; identify which checks remain valid and rerun affected checks rather than silently transferring approval. If only an isolated change invalidates one report, preserve the unaffected review and state the basis.

Use a report state such as `pass for stated scope`, `changes required`, or `pending independent review`. Keep `unknown` and `not applicable` separate from pass. Do not treat an automated warning about an intentional noindex or production canonical in a local preview as a defect without checking the contract.

Complete-site acceptance means an implemented, runnable site with real content and functioning in-scope behavior, plus independent reviews of the resulting artifact. Scoped-change acceptance additionally means preserved invariants and reviewed regressions. State missing integration credentials, real-world facts, field measurements or deployment authorization as specific remaining dependencies. Never substitute mockups, fake submissions or invented claims for working functionality.

## Invocation boundaries

| User request | Primary skill |
|---|---|
| Build this client's website from a brief/references/content | `website-builder` |
| Add/modify/improve part of the existing site | `website-iterator` |
| Add a URL to the design library | `site-researcher` |
| Find relevant hero/section patterns | `site-researcher` for search, then `design-system-extractor` if synthesis is needed |
| Turn these references into a design direction | `design-system-extractor` |
| Plan service/location architecture | `local-business-architect` |
| Implement or inspect rendering/SEO technical standards | `seo-ssr-builder` |
| Audit this URL's technical discovery behavior | `technical-seo-qa` |
| Check responsive/design behavior | `visual-qa` |
