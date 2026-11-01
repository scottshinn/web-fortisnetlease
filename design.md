# Fortis Net Lease — Design System ("Ascent")

> **Adopted from HighPost Capital `design.md`.** The base is v3 "Ascent"; the matte layer on top adds the gradient surfaces and film grain. The client asked for this on 2026-11-01. The tokens, components and motion are the HighPost system (`site-src/styles.css` was carried over unchanged except for the typefaces). Only the content is mapped to Fortis.

## Colour (60-30-10)
The split is a bright porcelain/white base, an indigo/sapphire structure and a saffron-coral accent.

| Token | Value | Use |
|---|---|---|
| `--bone` / `--paper` | `#f4f5fb` / `#fbfbfe` | Base surfaces (with `--m-light` luminous wash + grain) |
| `--midnight` | `#0d1240` | Hero, wall, footer (`--m-abyss`) |
| `--sapphire` | `#3d5afe` | Structure, eyebrows, the investor column |
| `--jade` | `#00b386` | Growth; the owner column |
| `--saffron` | `#ffc233` | Accent only: primary buttons, emphasis words |
| `--petrol` | `#4b2fe0` | Active chips, solid buttons |
| `--ink` / `--mute` | `#0d1130` / `#4e5470` | Text |

Column colours: **Investors** are sapphire, **Owners** are jade, **Sale-leaseback / 1031** are midnight with saffron.

## Type
| Role | Typeface | Notes |
|---|---|---|
| Display | Libre Caslon Display | Headlines, numerals; `lining-nums` |
| Text serif | Libre Caslon Text | Names, quotes, accent words |
| Sans | Instrument Sans | UI and body, 17px / 1.65 |

These typefaces are named in the HighPost v3 notes. HighPost later moved to Px Grotesk, Bellefair and Albert Sans, which are reserved for HighPost and are not used here.

## Motion: "Ascent"
Everything rises.
- **Hero:** a canvas skyline of posts climbs from left to right and leans toward the pointer. Each post is one live listing, as tall as its asking price.
- **Sections:** they open through six-post shutters.
- **Text:** sentences rise out of masks.
- **Figures:**
  - The sector volumes sit on posts that grow from the ground.
  - The three services are columns that open in turn, pinned on desktop.
  - The listings wall is columns of property photos drifting in opposite directions.
  - The featured property's panel rises like a post.

The motion stack is GSAP 3.12.5 with ScrollTrigger. Nothing depends on JS: without it, or under `prefers-reduced-motion`, the page is complete and static.

Not used: a custom cursor, magnetic buttons, word scrub or drifting giant type.

## Content mapping (HighPost → Fortis)
| HighPost | Fortis |
|---|---|
| Proof stats | The figures the live site states: $9+B volume, 4,500+ properties sold, 400K buyer reach, 46 states. These are flagged in `FACTS-TO-CONFIRM.md`. |
| Figure skyline | Sales volume by sector, as stated on the live site |
| Platform columns | Services: Investors (acquisitions), Owners (dispositions), Sale-leaseback & 1031 |
| Portfolio wall | Live Buildout listings (photo, name, city, price) |
| Case study | The featured live listing |
| Leaders + advisors | The roster in the live site's order: partners first, then advisors |
| News | Articles from the live site |

## Accessibility
- Every pairing meets AA. Focus shows as a 2px outline, and there's a skip link.
- One `<h1>` per page, semantic landmarks, and alt text on every image.
- Filters are buttons with `aria-pressed`.
