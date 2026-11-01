# Fortis Net Lease — Design System ("Ground")

> **2026-11-01, v1.** This system is Fortis's own. HighPost was an inspiration only, for its general principles: a bright base, film grain, proof before adjectives, and motion that means something. No HighPost tokens, typefaces, components or motion are reused.

## Idea
Net lease is about **ground and tenant**: a parcel of land, a building, and a lease that pays for twenty years. The system reads like a land survey drawn by a private bank:
- porcelain paper;
- navy ink;
- an azure survey line;
- fine contour lines in the background;
- every figure set like a measurement.

## Colour (60-30-10), anchored to the live brand
The live site's own colours (harvest/brand.json) are sky `#43AFEB`, azure `#249ACB`, cyan `#37CFEF`, navy `#0E1631`, slate `#525D8A` and periwinkle `#768BDF`. The system is built from them.

| Share | Role | Colours |
|---|---|---|
| 60% | Tinted grounds | Each section sits on a soft tint from the family (sky, lagoon, iris, sunrise), never plain white |
| 30% | Brand family | **Sky** (brand: azure → sky) · **Lagoon** (teal → mint, the analogous neighbour toward green) · **Iris** (indigo → violet, toward violet) · **Night** (navy) |
| 10% | Warm complement | **Sunrise** (tangerine → amber), blue's opposite, for actions and one feature · **Apricot** (coral → peach) as the warm bridge |

Rules:
- **Each gradient stays inside one neighbourhood.** A gradient never crosses the wheel; families sit next to each other instead.
- **Colour has meaning.** Buy is sky, Sell is sunrise, Unlock is iris. The proof tiles take four families. Headline accents take the colour of their section's ground.
- **The sector chart uses categorical colour** from the family, because sectors are categories, not a ranking.
- **Matte finish.** Film grain sits over every coloured surface.

## Type
| Role | Typeface |
|---|---|
| Display | **Bricolage Grotesque** 500–700, tight tracking. Confident, a little human, not a fashion serif. |
| Text / UI | **Figtree** 400–600 |
| Measurements | **IBM Plex Mono** 400–500, for prices, cap rates, coordinates and labels |

## Signature
- **The deal deck (hero).** A fanned stack of real listing cards: photo, tenant, price, cap and city. The deck turns over every few seconds, and you can click or swipe to deal the next one. The headline sits beside it, so the homepage opens on the product itself.
- **Contours.** Faint topographic lines drift very slowly behind the hero, drawn on a canvas. They are the ground under every lease.
- **The survey line.** A copper line draws under each section title as it enters, like a surveyor marking a boundary.
- **$9B, split.** Sales volume is one full-width bar divided by sector. Hovering a segment opens it.

## Components
- **Header:** logo on the left; the navigation in a glass capsule; phone number and copper CTA on the right.
- **Proof band:** forest, four measured figures, each with its source note.
- **Sector bar:** see the signature above.
- **Services:** three full-width rows (number, verb, sentence, facts). The open row reveals a photo strip.
- **Listings grid:** sector chips over a 3-column card grid.
- **Featured:** a full-bleed photo with a glass fact sheet.
- **People:** partners as tall portrait cards, advisors as a compact directory.
- **Quote:** large text with its attribution.
- **Insights:** a dated list.
- **Valuation band:** an inline two-field form that shows the tenant match from the record.
- **Footer:** forest.

## Motion
- Ease `cubic-bezier(.22,.8,.2,1)`.
- Reveals rise 18px over 0.8s.
- The survey line draws in 1.1s.
- The deck turns every 5s and pauses on hover.
- The contours drift at about 2px a second.

There's no pinning and no scroll-jacking. Under `prefers-reduced-motion` everything is static, and the page is complete without JS.

## Accessibility
AA contrast throughout. Visible 2px emerald focus rings, a skip link, a single `<h1>`, and filters as `aria-pressed` buttons.
