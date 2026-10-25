# Design

## World

A deep forest stage for bright, real work. The cinematic reference is a portfolio deck with large serif type and layered project media; the site translates that into a scroll, not a slide deck.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#071a14` | page ground |
| `--bg-deep` | `#04110d` | footer/nav depth |
| `--surface` | `#0e2a20` | panels, fields |
| `--surface-raised` | `#13382b` | quiet raised surfaces |
| `--ink` | `#f4ebdd` | primary text |
| `--muted` | `#a9b8ad` | secondary text |
| `--accent` | `#e8b45a` | actions and key marks, under 5% of a screen |
| `--accent-ink` | `#1a130a` | text on gold |
| `--leaf`, `--sky`, `--berry` | content accents | SkySprout imagery, weather, crops |
| `--mint` | `#b9e6d0` | Iahbrary backing field |
| `--healthya` | `#b69cff` | HealthyaSat only; brand accent inside its feature |

No cream-and-terracotta, no violet site accent, no gradient fills on text, no glows. Depth comes from tone steps and space.

## Type

- Display: Instrument Serif, regular. Headlines only.
- Text: Manrope Variable, 400–700. Body, captions, navigation, labels.
- No monospace micro-labels, tracked uppercase captions, or index numbers.
- Five sizes maximum: small, body, lead, head, display. Use the tokens in `src/styles/tokens.css`.
- Big display: leading 0.95–1.0, tracking -0.03 to -0.05em, max two lines on a phone.
- Body measure 45–75 characters, target 62ch.

## Layout

- One page, left-anchored, generous space.
- Hero: asymmetric two-column desktop; text first, island second. No centered hero.
- Case studies: each has a different composition. No repeated three-card row.
- Images are real screenshots in filled frames; no fake browser chrome, no stock.
- Square editorial surfaces. The phone frame is the only rounded exception.
- No hairlines, 1px outline boxes, nested cards, floating blurred nav, or decorative status dots.
- Sections: Hero → SkySprout → Iahbrary → HealthyaSat/Magilas → About → Contact.

## Motion

- One signature move: the island drifts and responds gently to scroll and pointer.
- Content is readable before WebGL arrives.
- No fade-up on every section; no infinite decorative loops; no scroll-jacking.
- Respect `prefers-reduced-motion`; mobile and low-power devices get the static fallback.

## 3D

- One lazy-loaded canvas in the hero.
- Procedural low-poly island: grass, rock, giant tree, pines, seven plots, bridge, clouds.
- No external models, textures, postprocessing, or shadows.
- Canvas is decorative (`aria-hidden`); all meaning lives in HTML.
- Fallback image for reduced motion, viewports under 768px, low hardware concurrency, WebGL failure, and offscreen hero.

## Voice

First person, specific, calm. Short sentences. No “unlock, supercharge, seamless, elevate, effortless, cutting-edge.” No invented social proof. The SkySprout section ends with an honest measurement plan.

## Asset rules

- Only Adrian’s screenshots and game/app art.
- Keep the real game HUD; caption the save as a late-game playtest.
- Crop the `1 active` count from the Roblox listing.
- No SkySprout source, private repository data, phone number, street address, or outdated résumé.
- Optimize screenshots to responsive WebP; provide alt text and dimensions.
