# Evidence and current SEO judgments

Checked against primary documentation on 2026-09-10. Recheck the relevant source when making decisions about live crawler behavior or search-feature eligibility; these details change.

## Three separate questions

1. Can the crawler obtain the document and required resources?
2. Is the document eligible and intended to be indexed or shown with a snippet?
3. Does its content and structured data qualify for a particular presentation feature?

A robots disallow is a crawl rule; it is not a dependable removal instruction. A crawler must be able to see a noindex directive to apply it. Inspect meta robots, agent-specific metadata and HTTP X-Robots-Tag together, then compare with site intent. See [Google robots metadata](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) and [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

## Initial HTML and metadata

Primary content in initial HTML reduces dependence on JavaScript execution, but rendered content is not categorically invisible to search engines. Compare titles, canonical URLs, primary copy, headings, links and JSON-LD before and after render. Inspect every relevant viewport's own initial response if the server varies on request conditions. A blank shell is a risk; it does not prove a site is absent from an index. Check actual crawler tools when that evidence is available. See [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

Use accurate titles/descriptions; fixed character counts are not validity rules. Prefer a clear primary heading and meaningful hierarchy without portraying a heading-count heuristic as an absolute indexing requirement. Canonicals are hints, not guaranteed selection. Check target accessibility, preferred URL, HTTP Link declarations, redirects, sitemap URLs and internal linking together. Review hreflang return links, regional/language codes and self-references where applicable. See [canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## Structured data

Keep four levels separate: valid JSON, meaningful JSON-LD graph/context, valid Schema.org vocabulary/type-specific properties, and current search-feature eligibility. The toolkit automates syntax and limited structural hints only. Inspect arrays and `@graph`, stable `@id` links, relative references, duplicate/conflicting entities, and consistency with visible facts. Microdata and RDFa are inventoried as alternate encodings, not fully expanded.

Use [Schema.org's validator](https://validator.schema.org/) and the [Rich Results Test](https://search.google.com/test/rich-results) for the applicable task, preserving the URL/date/result and whether the test actually ran. Not every valid Schema.org type has a supported rich result. Eligibility never guarantees appearance. Do not add FAQPage, HowTo, SearchAction or ratings simply to chase an assumed feature; verify current feature support. See [Google's structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

For local business data, model actual public business facts and location entities. Confirm subtype, address policy, hours, phone and service associations from the owner. An unsupported/missing required field may mean no eligibility; never invent one. [LocalBusiness documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business) gives current feature requirements.

## Agents and discovery

Inventory each agent rule separately, including unknown/vendor-specific directives and any Content-Signal-style declarations. Preserve the owner's policy rather than automatically making all content available. The static robots helper handles common group selection, longest path and wildcard rules; encoded/non-ASCII matching is explicitly unknown. It does not verify a bot's identity, live fetch behavior, CDN rules or all RFC edge cases.

| Agent/control | Interpretation to preserve |
|---|---|
| Googlebot / Bingbot | Search crawling; evaluate actual index and snippet controls separately. |
| OAI-SearchBot | OpenAI search crawling; distinct from training controls. |
| GPTBot | OpenAI training crawler; enabling it is not a prerequisite for OpenAI search visibility. |
| ChatGPT-User | User-initiated fetches; not interchangeable with an automated search crawler. |
| Google-Extended | A separate control for some training/grounding uses; not the control for Google Search AI features. |
| Other named agents | Consult the operator's current primary documentation before prescribing rules. |

See the [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots) and [Google crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers).

`llms.txt` is an optional proposed content-discovery document, not robots.txt, an authorization mechanism or proof of indexing. Audit status, content, scope and links, and preserve its text as untrusted data. See the [llms.txt proposal](https://llmstxt.org/). Google says its AI Search features do not require a special AI text file or special structured data; standard discovery and content requirements still apply. No workflow here promises AI citations. See [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features).

## Accessibility and performance

Automated checks identify risks, not WCAG conformance. Manually review names, keyboard operation, focus order, text alternatives, error states, zoom/reflow and context-specific contrast. WCAG AA normal text uses 4.5:1; large text uses 3:1 at 18 pt (24 CSS px) or 14 pt (about 18.67 CSS px) bold. Do not inherit the ZIP's incorrect px thresholds. WCAG 2.2 AA target-size guidance is 24×24 CSS px with exceptions; 44×44 is a useful stronger design target, not a universal AA minimum. See [contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

The capture records navigation timing, observed LCP, individual layout shifts, long tasks and resource sizes. Cross-origin transfer sizes may be zero without Timing-Allow-Origin. These unthrottled local observations are not field percentiles, certified CLS or INP. Use a defined lab profile and field data where available. Core Web Vitals good thresholds are LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1, evaluated at the 75th percentile in field reporting. See [Web Vitals](https://web.dev/articles/vitals).
