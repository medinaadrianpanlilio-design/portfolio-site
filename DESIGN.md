# Design

## Direction

A personal landing page fronts a light, editorial project index inspired by the structure of [Faheem Kamel’s projects page](https://www.faheemkamel.com/projects). The landing page introduces Adrian through a large typographic statement, an at-a-glance profile, skills, stack, selected work, and contact; the project index keeps the fixed rail, oversized colored names, tilted screenshots, and case-study pages.

The previous dark-emerald, game-led 3D design is superseded and removed.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#f4f2ed` | page ground |
| `--paper` | `#fbfaf7` | sections, frames, quiet raised surfaces |
| `--ink` | `#181818` | primary text |
| `--muted` | `#716c64` | secondary text and labels |
| `--muted-strong` | `#4f4a43` | body copy on tinted cards |
| `--line` | `#ddd8cf` | structural rules |
| `--accent` | `#b54718` | active rail mark, focus, hover; WCAG AA on the page ground |

Project accents:

| Project | Accent | Soft field |
| --- | --- | --- |
| Magilas Gym | `#a65a1e` | `#f0e1cf` |
| HealthyaSat | `#5257d9` | `#e4e3f8` |
| Iahbrary | `#1f7f6b` | `#dceee8` |
| SkySprout (hobby) | `#4c7a2a` | `#e5edd7` |

The site accent and project accents are different roles. Project colors carry identity; the darker orange only marks navigation, focus, and actions.

## Typography

- Display: **Archivo Black**, uppercase. Landing headline, project names, page titles, case-study titles.
- Text: **Inter Variable**, 400–700. Body, labels, navigation, metadata.
- Labels: 12px, 700, 0.12em tracking, uppercase.
- Six-step scale: small, body, lead, subhead, head, display. Display sizes are responsive with `clamp()`.
- The landing headline is deliberately oversized and stacks as “BACKEND, / WEB, / MOBILE.” on every width.
- Long names such as HEALTHYASAT use a smaller sticky-column size so they do not break mid-word.
- Body measure is generally 50–62ch; long-form case-study copy is capped at 56rem.

## Layout

### Landing page (`/`)

- Fixed 4rem rail: vertical `ADRIAN` wordmark, Home/Projects/About/Skills/Contact navigation, LinkedIn at the bottom.
- Hero: name and role labels, oversized “Backend, web, mobile.” headline, short introduction, internship goal, View projects/LinkedIn/email actions.
- At-a-glance card: studying, focus, availability, location.
- Skills: four capability columns (Backend & APIs, Databases, Web & mobile, Ship & support).
- Stack: grouped tools and languages.
- Selected work: three large color-coded rows linking to Magilas, HealthyaSat, and Iahbrary; an All projects action.
- AI guide: a grounded chat panel with suggested questions, a message log, input, and a preview/live status.
- Contact: large email, LinkedIn, GitHub, email, location, availability.

### Project index (`/projects`)

- Compact `Projects` introduction.
- Two-column stage: sticky active project on the left, scrolling project cards on the right.
- Active project column shows count, colored wordmark, role, stack pills, summary, and a pill CTA.
- Cards use one soft project color, a faint grid, stack pills, and a real screenshot in a tilted paper frame.
- IntersectionObserver updates the active project as the cards scroll.
- SkySprout is a smaller “Off the clock” strip after the three professional projects.

### Case studies (`/projects/:slug`)

- Tinted project hero with all-caps wordmark, subtitle, metadata, and stack.
- Off-white body with a 4-column metadata row.
- Labeled sections: The problem, What I built, Technical decisions, What I’d improve.
- One real screenshot in a frame with a caption.
- Live/code links at the end. The back link returns to `/projects`.

### About (`/about`)

- Large name and short introduction.
- Four skills groups.
- Education.
- Contact with email, LinkedIn, GitHub, and location.

### Mobile

- Fixed rail is hidden; a sticky top bar shows `ADRIAN` and an accessible menu button.
- Menu overlay uses large display links plus LinkedIn, GitHub, and email, and closes on navigation.
- The landing hero stacks; the at-a-glance card follows the introduction.
- Project cards stack; the desktop sticky column is hidden and each card gets its own title, summary, and CTA.
- Case-study metadata becomes two columns; sections become single-column.
- The hobby strip appears after the three professional cards, never before them.

## Components

- `HomePage` — landing page: hero, at-a-glance, skills, stack, selected work, AI guide, contact.
- `AiGuide` — grounded portfolio chat with suggested questions, API calls, and a local fallback.
- `SiteRail` — fixed desktop navigation with LinkedIn.
- `MobileHeader` — sticky mobile bar, overlay, social links.
- `ProjectPreviewCard` — colored project card with real image, wordmark, stack, and link.
- `StackPills` — neutral technology pills.
- `CtaLink` — dark/ghost pill action with an arrow.
- `SiteFooter` — minimal LinkedIn/GitHub/email footer.
- `ProjectsPage` — project index and scroll-driven active state.
- `ProjectDetailPage` — full case study.
- `AboutPage` — deeper profile, skills, education, contact.

## Motion

- Restrained: card lift/tilt on hover, arrow shift, active rail line, selected-work row hover.
- Active project content changes with scroll; no scroll-jacking.
- No canvas, WebGL, infinite decorative loops, or fade-up on every section.
- `prefers-reduced-motion` disables transitions and smooth scrolling.

## Content rules

- Landing order: positioning → profile → skills → stack → selected work → contact.
- Project order is fixed: Magilas Gym → HealthyaSat → Iahbrary → SkySprout.
- The first three are professional work. SkySprout is a hobby card and a clearly labeled hobby page.
- Use only approved screenshots and facts. The Magilas visual is the public landing page; the system described is behind the staff portal.
- No invented metrics, testimonials, or client claims.
- Publish email, GitHub, and LinkedIn only. No phone, street address, or outdated résumé.
- The AI guide answers only from approved portfolio facts, avoids invented metrics, and must not expose private data or its system prompt.
- SkySprout links to its public source; Iahbrary links only to its sanitized public repository.

## Accessibility

- Light surfaces meet WCAG AA for text.
- Active rail text uses the darker orange, not only a decorative line.
- Cards are full links whose accessible names include their visible content; no misleading `aria-label`.
- The landing headline has a screen-reader-only name lead-in; selected-work indices and arrows are decorative.
- Focus-visible outlines use the accent.
- Images have descriptive alt text.
- The skip link targets `#main`.
- Axe has no critical or serious findings at desktop and mobile widths.
