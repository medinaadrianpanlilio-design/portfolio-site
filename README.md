# Adrian Medina — Portfolio

A one-page portfolio for software-engineering internships, built around a live hobby game and the systems underneath it.

The centerpiece is **SkySprout**, a Roblox growing simulator made solo and released in October 2026. The case study covers the game loop, tutorial, offline earnings, weather mutations, server-authoritative engineering, and an honest plan for measuring retention now that the game is public. The rest of the page shows **Iahbrary**, **HealthyaSat**, and **Magilas Gym**.

## Live projects

- **SkySprout** — [Play on Roblox](https://www.roblox.com/games/117628058304479) (live as `BretRackstar`)
- **Iahbrary** — [Public source](https://github.com/medinaadrianpanlilio-design/iahbrary)
- **HealthyaSat** — [healthyasat.fit](https://healthyasat.fit/)
- **Magilas Gym** — [magilasgym.com](https://magilasgym.com/)

The SkySprout source stays private. This repository contains the portfolio, its copy, and the screenshots used with permission.

## Stack

- Vite, React 19, TypeScript (strict)
- React Three Fiber, Drei, Three.js for the procedural SkySprout island
- Framer Motion for the restrained scroll movement
- CSS Modules and CSS custom properties for the visual system
- `@fontsource` for Instrument Serif and Manrope
- Vitest and Testing Library for unit/component tests
- Playwright and axe-core for browser, responsive, reduced-motion, link, image, and accessibility checks
- Sharp for the responsive image pipeline
- Vercel for static deployment

No backend, CMS, auth, or contact form.

## Run locally

Requires Node 20.6+.

```bash
npm ci
npm run images
npm run dev
```

The optimized images are generated into `public/images/` from the source captures in `assets/source/`. Run `npm run images` whenever those sources change.

For the production build:

```bash
npm run build
npm run preview
```

## Tests

```bash
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
```

The Playwright suite covers:

- desktop rendering and the live WebGL island
- the 390px phone layout, no horizontal overflow, and the static fallback
- reduced-motion fallback
- exact project/contact links
- responsive images with alt text
- axe-core with no critical or serious findings

## Design notes

The visual direction is a cinematic, dark-emerald editorial stage: Instrument Serif for display, Manrope for reading, a harvest-gold accent, real project screenshots, and one procedural low-poly island. The 3D is decorative and lazy-loaded; the page is fully readable without it. It falls back to a real game image on phones, reduced motion, low-power devices, WebGL failure, or when the hero is offscreen.

The type scale is intentionally small: display, heading, subhead, lead, body, small, and one display numeral. No mono micro-labels, pill badges, hairline grids, gradients, or glass panels.

## Asset and privacy notes

- Project screenshots and game art belong to Adrian Medina and the respective projects.
- The SkySprout source is private; the case study uses the public game, screenshots, and the approved product facts.
- The Iahbrary screenshot is used with permission. It is a reading-account capture, not an analytics claim.
- No phone number, street address, or outdated résumé is published.
- The SkySprout listing is age-gated for some viewers; the screenshots carry the story.
- There are no fabricated retention numbers. The game went public in October 2026; the page names the metrics to watch next.

## Deployment

The project is configured for Vercel:

```bash
npx vercel --prod --yes
```

Deployment is intentionally left until the local review is approved. The site source link in the footer resolves once the public `portfolio` repository is created.

## Contact

- Email: [medinaadrianpanlilio@gmail.com](mailto:medinaadrianpanlilio@gmail.com)
- GitHub: [medinaadrianpanlilio-design](https://github.com/medinaadrianpanlilio-design)
