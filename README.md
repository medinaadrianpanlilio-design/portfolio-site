# Adrian Medina — Projects

A personal landing page and project-first portfolio for software-engineering internships. The landing page introduces Adrian, his skills, and his stack; the work follows immediately. **Magilas Gym**, **HealthyaSat**, and **Iahbrary** get full case studies. **SkySprout** sits at the end of the project index as an honest “off the clock” hobby.

The landing page also includes a grounded AI portfolio guide. It answers questions about the approved work, stack, and availability; the live model is optional and runs through a small server-side endpoint.

This replaces the previous game-led 3D portfolio. The only 3D left is an optional cozy room welcome at the top of `/` (Adrian's room, modeled in Blender), lazy-loaded and switched by `VITE_ROOM`.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page: positioning, at-a-glance, skills, stack, selected work, AI guide, contact, LinkedIn |
| `/projects` | Selected work index: fixed rail, active project column, project cards, SkySprout hobby strip |
| `/projects/magilas` | Magilas Gym: POS/admin work, RBAC, QR entry, inventory, financial records |
| `/projects/healthya-sat` | HealthyaSat: backend/API, claim extraction, DOH/WHO-informed classification, Docker |
| `/projects/iahbrary` | Iahbrary: Expo/TypeScript/Supabase, owner-only RLS, offline queue, public code |
| `/projects/skysprout` | Roblox hobby case study: live game and public source |
| `/about` | Deeper introduction, skills, education, approved contact details |
| `/resume` | One-page résumé rendered from `src/content/*`; printed to `public/Adrian-Medina-Resume.pdf` by `npm run resume` |

The fixed desktop rail is **Home / Projects / About / Skills / Contact**, with a direct LinkedIn link at the bottom. The mobile menu carries the same navigation plus LinkedIn, GitHub, and email.

## Project links

- Magilas Gym: https://magilasgym.com/
- HealthyaSat: https://healthyasat.fit/
- Iahbrary code: https://github.com/medinaadrianpanlilio-design/iahbrary
- SkySprout: https://www.roblox.com/games/117628058304479
- SkySprout code: https://github.com/medinaadrianpanlilio-design/skysprout-public

## Stack

- Vite, React 19, TypeScript strict
- React Router for landing, project index, and case-study routes
- CSS Modules and CSS custom properties for the visual system
- `@fontsource` for Archivo Black and Inter Variable
- A small serverless AI guide endpoint (`api/chat.ts`) using an OpenAI-compatible chat API, with a local grounded fallback
- Vitest and Testing Library for unit/component tests
- Playwright and axe-core for browser, responsive, link, image, AI-flow, and accessibility checks
- Sharp for the responsive image pipeline
- Vercel for static deployment, API functions, and an SPA rewrite

No CMS, auth, or contact form. three / React Three Fiber v9 / drei load only in the lazy room chunk on `/`. The AI guide endpoint is the only server-side piece.

## Run locally

Requires Node 22.12+.

```bash
npm ci
npm run images
npm run dev
```

The optimized images are generated into `public/images/` from the source captures in `assets/source/`. Run `npm run images` whenever those sources change.

### Résumé

The résumé is generated from the same content as the site, so the two never drift. With `npm run dev` running:

```bash
npm run resume
```

It writes `public/Adrian-Medina-Resume.pdf` and fails if the résumé no longer fits on one page.

### The 3D room

`VITE_ROOM` controls the room welcome on `/`:

| Value | Behavior |
| --- | --- |
| `off` | No room; the landing page starts as before. Default for production builds. |
| `standin` | A code-built box room with the same object names. Default in dev. |
| `model` | Loads `public/models/room.glb`, Adrian's Blender room. Used by the E2E build (`.env.e2e`). |

Production stays `off` until the Blender room is finished. To prepare an export, follow `docs/blender-guide.md`, then:

```bash
npm run room -- path/to/room.glb
```

For the production build:

```bash
npm run build
npm run preview
```

### AI guide

The AI guide works immediately in **preview mode** with grounded answers from the portfolio content. To enable live model answers locally, copy `.env.example` to `.env.local` and set `AI_API_KEY`:

```bash
Copy-Item .env.example .env.local
# edit .env.local
```

`AI_BASE_URL` defaults to `https://api.openai.com/v1`; `AI_MODEL` defaults to `gpt-4o-mini`. Any OpenAI-compatible provider can be used by changing the base URL and model. The key is read only by the server-side endpoint and is never sent to the browser.

For Vercel, add the same variables in **Project Settings → Environment Variables**, then redeploy. Without a key, the endpoint returns the local fallback with `mode: "preview"`; the UI shows a “Preview answer” note.

The endpoint accepts only POST requests, caps history and message size, limits output tokens, and has a lightweight in-memory rate limit. Add a durable rate limiter if the guide gets meaningful traffic.

The social image is generated with:

```bash
npm run og
```

Set `BASE_URL` when using a different local URL:

```bash
$env:BASE_URL="http://127.0.0.1:4173"; npm run og
```

## Tests

```bash
npm run typecheck
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
```

The E2E command rebuilds the production bundle before starting the preview, so it never validates a stale `dist`.

The current suite covers:

- landing-page positioning, skills, stack, selected work, LinkedIn, and AI-guide interaction
- the public SkySprout source link
- project order Magilas → HealthyaSat → Iahbrary, with SkySprout as the final hobby
- scroll-driven active project state on `/projects`
- direct project routes and real live/code links
- desktop and mobile navigation; mobile menu behavior
- no horizontal overflow at tested widths
- responsive screenshots with descriptive alt text
- approved contact details and no private contact data
- axe-core with no critical or serious findings at desktop and mobile widths

## Content and privacy rules

- Use only real project captures and approved product facts.
- The Magilas landing page is the public client site; the management system the portfolio describes lives behind the staff portal.
- The HealthyaSat screenshot is the real extension over a Balita article.
- Iahbrary links to its sanitized public repository; private data and credentials are not published.
- SkySprout links to its public source at [skysprout-public](https://github.com/medinaadrianpanlilio-design/skysprout-public). There are no fabricated retention metrics or player counts.
- Publish the approved email, GitHub, LinkedIn, and project links only. No phone number, street address, or any résumé except the one generated from `/resume`.
- Do not link to the Magilas staff portal as a public case-study demo; it requires credentials.
- The AI guide is instructed to answer only from approved portfolio facts, avoid invented metrics, and never expose private data or the system prompt.

## Deployment

The project is configured for Vercel with an API function and a catch-all SPA rewrite. Deployment is intentionally left until the local review is approved. No public portfolio repository or production URL is created by this build.

## Contact

- Email: [medinaadrianpanlilio@gmail.com](mailto:medinaadrianpanlilio@gmail.com)
- LinkedIn: [adrian-alexander-medina-022b8a433](https://www.linkedin.com/in/adrian-alexander-medina-022b8a433/)
- GitHub: [medinaadrianpanlilio-design](https://github.com/medinaadrianpanlilio-design)
