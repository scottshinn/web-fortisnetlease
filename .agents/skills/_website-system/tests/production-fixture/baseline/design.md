# Northline Roofing design direction

Status: supplied client direction, interpreted for this fictional demonstration before visual implementation. Independent visual review is pending. No external references are needed.

## Foundation

Use the supplied light background `#f5f7fa`, navy `#142d4e`, orange `#bc4b14`, a system sans-serif stack, and restrained square controls. White is a supporting card surface; `#d4dce6` provides nonessential separators. Main text is navy and secondary text uses `#4a5c72`. Orange is reserved for the primary telephone action and small graphic accents. Controls use white on orange, navy on white, or white on navy. Focus rings use navy on light surfaces and white on dark surfaces, with spacing that separates the ring from the control.

Typography: body 1rem–1.125rem with 1.6 line height; headings use 1.05–1.15 line height and modest negative tracking. H1 scales from 2.65rem on mobile to 4.8rem on wide screens. Paragraphs stay near 60 characters per line. No downloaded fonts.

Spacing: a 4px base with 8/12/16/24/32/48/64/80px steps. The centered content container is at most 1160px with 20px mobile and 32px larger gutters. Major sections use 56px mobile / 80px desktop vertical spacing. Controls are at least 46px tall. Corners are square, with no decorative drop shadows.

## Page hierarchy and reusable sections

Every page has a visible fictional-demo bar, shared brand/navigation, one main landmark, and a shared footer. The navigation remains expanded at all widths; the small route set does not need a menu button. A skip link and current-page indication support keyboard and assistive use.

The homepage uses a split hero: service message and telephone action beside a locally authored decorative roof drawing. The drawing is abstract, not a photograph or claim about completed work. Below it, two service summaries lead to a focused service page or the contact page, followed by the two supplied service areas and a shared contact banner.

The roof-repair page uses the same type and spacing with a compact hero, a list of useful details to mention on a call, and a second service connection to roof inspection. These are conversation prompts, not invented contractual service scope or promised outcomes.

The contact page makes the supplied phone and its fictional status explicit, pairs it with the service-area list, and offers no form or office/map. Breadcrumbs on the two deeper pages reinforce location in the site.

## Responsive behavior and states

At 800px, split layouts and service cards become one column. The hero graphic moves below its copy; it retains its aspect ratio. At narrow widths, header rows and contact actions wrap naturally. No fixed header/footer, body overflow hiding, or horizontal scrolling is used. At 320px and 200% zoom, headings may wrap; controls, content and all destinations remain visible.

Links are visibly underlined unless they are clearly styled as controls or navigation. Hover darkens the orange action; keyboard focus has a 3px visible outline. There is no animation, carousel, or JavaScript-dependent disclosure. Required content and navigation work without JavaScript.

## Budgets and intentional choices

Per-route initial HTML under 30KB, shared CSS under 15KB, shared JavaScript under 3KB, all measured as uncompressed UTF-8 bytes in the local static build. No third-party resources, external event destinations, remote fonts, or raster media. Field performance is outside this localhost exercise.

The fictional notice is permanent and every route is intentionally noindex. Production canonicals use the supplied `https://northline.example`; the local preview origin stays independent.
