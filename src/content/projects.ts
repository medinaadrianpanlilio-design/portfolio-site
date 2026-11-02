import type { Project } from './types'

const magilas: Project = {
  slug: 'magilas',
  name: 'Magilas Gym',
  displayName: 'MAGILAS',
  subtitle: 'gym management system',
  tagline: 'Gym management system for a real gym.',
  flow: ['QR entry', 'POS', 'Reports'],
  summary:
    'A live gym management system: POS and admin workflows for memberships, inventory, QR entry, financial records, and maintenance. I built the POS/admin side for a real gym in San Luis, Pampanga.',
  role: 'POS / admin developer',
  focus: 'RBAC, QR entry, inventory, financial records',
  stack: ['Web app', 'RBAC', 'QR entry', 'Inventory'],
  year: '2025',
  client: 'Magilas Gym',
  color: '#a65a1e',
  soft: '#f0e1cf',
  image: {
    src: '/images/magilas-landing-1440.webp',
    srcSet: '/images/magilas-landing-800.webp 800w, /images/magilas-landing-1440.webp 1440w',
    alt: 'The Magilas Gym landing page, with a dark gym floor, gold accents, and the gym logo.',
    mode: 'landing',
  },
  links: [{ label: 'Visit Magilas Gym', href: 'https://magilasgym.com/' }],
  caseStudy: {
    lead: 'A management system for a neighborhood gym, built around the work that happens behind the front desk.',
    problem:
      'The gym needed one place for staff to handle memberships, day passes, inventory, payments, and the equipment log without relying on paper or separate spreadsheets.',
    built: [
      'POS and admin workflows for the front desk and the owner.',
      'Role-based access control so staff and admin capabilities stay separate.',
      'QR-based member entry logging tied to the member record.',
      'Inventory, subscription, income/expense, and machine-maintenance reporting.',
    ],
    decisions: [
      {
        title: 'Role-based access',
        body: 'The system separates what the front desk can do from what the owner can change, so daily operations do not expose financial or configuration screens.',
      },
      {
        title: 'QR entry logging',
        body: 'Check-ins are attached to the member record, which turns the entry log into a useful operational history instead of a separate list.',
      },
      {
        title: 'One operational view',
        body: 'Inventory, subscriptions, expenses, and maintenance live together so the admin side can answer real questions about the gym.',
      },
    ],
    improve: [
      'Add a seeded demo and dashboard screenshots so reviewers can see the admin UI without a staff account.',
      'Add automated tests around membership, inventory, and payment edge cases.',
      'Instrument the daily front-desk workflow before adding more modules.',
    ],
    screens: [
      {
        src: '/images/magilas-landing-1440.webp',
        srcSet: '/images/magilas-landing-800.webp 800w, /images/magilas-landing-1440.webp 1440w',
        alt: 'The Magilas Gym landing page.',
        caption:
          'The public Magilas Gym site. The management system I worked on lives behind the staff portal.',
      },
    ],
  },
}

const healthyaSat: Project = {
  slug: 'healthya-sat',
  name: 'HealthyaSat',
  displayName: 'HEALTHYASAT',
  subtitle: 'health-claim fact checker',
  tagline: 'Fact-checks Taglish health claims.',
  flow: ['Extract', 'Classify', 'Flag'],
  summary:
    'A browser extension that checks Taglish health claims on Philippine news sites. I worked on the backend/API: claim extraction, DOH/WHO-informed classification, severity flagging, and database insertion.',
  role: 'Backend / API developer',
  focus: 'Claim extraction, classification, Docker',
  stack: ['Browser extension', 'API', 'Docker'],
  year: '2025',
  client: 'HealthyaSat',
  color: '#5257d9',
  soft: '#e4e3f8',
  image: {
    src: '/images/healthyaSat-extension-843.webp',
    srcSet: '/images/healthyaSat-extension-600.webp 600w, /images/healthyaSat-extension-843.webp 843w',
    alt: 'HealthyaSat extension open over a Balita article with a selected health claim and a Fact-check button.',
    mode: 'browser',
  },
  links: [{ label: 'Visit HealthyaSat', href: 'https://healthyasat.fit/' }],
  caseStudy: {
    lead: 'A fact-checking layer for the place where health misinformation actually spreads: the article people are already reading.',
    problem:
      'Health claims move quickly through Taglish news and social posts. Readers need a fast, understandable check without leaving the article or opening another research tab.',
    built: [
      'Claim extraction and the API path between the extension and the knowledge base.',
      'Classification into certified, unverified, or false using a DOH/WHO-informed knowledge base.',
      'Severity-based flagging and database insertion for highlighted claims.',
      'Docker-based development infrastructure and backend/API integration.',
    ],
    decisions: [
      {
        title: 'Explainable verdicts',
        body: 'A health claim is not just true or false. The response includes the classification and the reason so a reader can decide what to trust.',
      },
      {
        title: 'Severity is part of the signal',
        body: 'Flagging potential harm helps separate a small inaccuracy from a claim that could affect treatment.',
      },
      {
        title: 'Local infrastructure',
        body: 'Docker gave the team a repeatable development environment while the extension, API, and database grew together.',
      },
    ],
    improve: [
      'Measure classification accuracy against a labeled evaluation set.',
      'Add a feedback path for false positives and missed claims.',
      'Rate-limit and monitor the public API before wider distribution.',
    ],
    screens: [
      {
        src: '/images/healthyaSat-extension-843.webp',
        srcSet: '/images/healthyaSat-extension-600.webp 600w, /images/healthyaSat-extension-843.webp 843w',
        alt: 'The HealthyaSat extension open over a news article.',
        caption: 'The extension over a Balita health article, after selecting a claim.',
      },
    ],
  },
}

const iahbrary: Project = {
  slug: 'iahbrary',
  name: 'Iahbrary',
  displayName: 'IAHBRARY',
  subtitle: 'reading tracker',
  tagline: 'Reading tracker with stats.',
  flow: ['Timer', 'Sync', 'Stats'],
  summary:
    'A reading tracker for timed sessions, pace, a personal library, reviews, highlights, and weekly stats. Built solo with Expo, TypeScript, and Supabase; the public repo is a sanitized copy.',
  role: 'Solo developer',
  focus: 'Expo, Supabase, RLS, offline queue',
  stack: ['Expo', 'TypeScript', 'Supabase'],
  year: '2026',
  client: 'Personal project',
  color: '#1f7f6b',
  soft: '#dceee8',
  image: {
    src: '/images/iahbrary-home-720.webp',
    srcSet: '/images/iahbrary-home-360.webp 360w, /images/iahbrary-home-720.webp 720w',
    alt: 'Iahbrary reading screen showing The Way of Kings and a session timer.',
    mode: 'phone',
  },
  links: [
    {
      label: 'View the code',
      href: 'https://github.com/medinaadrianpanlilio-design/iahbrary',
    },
  ],
  caseStudy: {
    lead: 'A reading tracker that treats reading like training: start a session, log the pages, and watch the habit build.',
    problem:
      'Most reading apps are digital shelves. I wanted the habit to feel closer to a training log: a timed session, a pace, a personal library, and a reason to come back.',
    built: [
      'Timed reading sessions with start/end pages, notes, and pace calculations.',
      'A personal library with want-to-read, reading, and finished states.',
      'Reviews, highlights, weekly stats, and reading streaks.',
      'Email-only authentication and owner-only Supabase RLS.',
      'An offline session queue that keeps a session safe when the network drops.',
    ],
    decisions: [
      {
        title: 'RLS as the boundary',
        body: 'The client can be curious; the database is the authorization boundary. Personal rows are scoped to the signed-in user, and the public copy shows the policies.',
      },
      {
        title: 'Email-only login',
        body: 'The prototype resolved usernames to emails through a public profile table. The public version removed that directory and keeps the username as a display name only.',
      },
      {
        title: 'Offline-first sessions',
        body: 'A dropped connection should not lose a reading session. Failed inserts queue locally and replay through the same ownership checks.',
      },
    ],
    improve: [
      'Bring the sanitized backend online for a live demo.',
      'Add a short demo video and a fresh screenshot pass.',
      'Run end-to-end tests against a local Supabase instance.',
    ],
    screens: [
      {
        src: '/images/iahbrary-home-720.webp',
        srcSet: '/images/iahbrary-home-360.webp 360w, /images/iahbrary-home-720.webp 720w',
        alt: 'The Iahbrary reading screen.',
        caption: 'The reading screen after a session. The public repository is a sanitized copy.',
      },
    ],
  },
}

const skySprout: Project = {
  slug: 'skysprout',
  name: 'SkySprout',
  displayName: 'SKYSPROUT',
  subtitle: 'a live Roblox garden',
  tagline: 'A live Roblox garden with weather events.',
  flow: ['Plant', 'Harvest', 'Sell'],
  summary:
    'A low-poly Roblox growing simulator built for fun: server-authoritative growth, offline earnings, and a 44-minute weather cycle with stacking mutations. A solo hobby project, not the main focus.',
  role: 'Solo hobby project',
  focus: 'Luau, server authority, persistence',
  stack: ['Roblox', 'Luau', 'DataStore'],
  year: '2026',
  client: 'Hobby',
  color: '#4c7a2a',
  soft: '#e5edd7',
  hobby: true,
  image: {
    src: '/images/skysprout-garden-1600.webp',
    srcSet: '/images/skysprout-garden-800.webp 800w, /images/skysprout-garden-1600.webp 1600w',
    alt: 'A late-game SkySprout garden with ripe crops and floating islands.',
    mode: 'game',
  },
  links: [
    { label: 'Play on Roblox', href: 'https://www.roblox.com/games/117628058304479' },
    {
      label: 'View the code',
      href: 'https://github.com/medinaadrianpanlilio-design/skysprout-public',
    },
  ],
  note:
    'A Roblox account may be required. The public listing is Sky Sprout, rated Minimal, Ages 16+.',
  caseStudy: {
    lead: 'A game I built because I wanted to see a floating garden come alive.',
    problem:
      'A farming loop can become a chore. I wanted short sessions, a reason to return, and a shared world event that made the garden feel different each time.',
    built: [
      'A five-step tutorial that teaches buy, plant, harvest, sell, and exhibit.',
      'Offline earnings and crops that mature while the player is away.',
      'A global 44-minute weather cycle with stacking Wind, Thunder, Cosmic, and Golden mutations.',
      'Server-authoritative growth, coin grants, persistence, and visitor safety.',
    ],
    decisions: [
      {
        title: 'The server owns the garden',
        body: 'Growth, rewards, and mutation rolls are decided by the server, never by a client timer.',
      },
      {
        title: 'A shared clock',
        body: 'Weather timing comes from server time modulo the cycle, so every server sees the same event.',
      },
      {
        title: 'Persistence that fails safe',
        body: 'Versioned DataStore records go read-only if a load fails instead of overwriting progress.',
      },
    ],
    improve: [
      'Measure retention now that the game is public; there are no retention numbers to claim yet.',
      'Add a short gameplay trailer so the game is legible without a Roblox account.',
      'Keep expanding the collection without making the first session overwhelming.',
    ],
    screens: [
      {
        src: '/images/skysprout-garden-1600.webp',
        srcSet: '/images/skysprout-garden-800.webp 800w, /images/skysprout-garden-1600.webp 1600w',
        alt: 'The SkySprout garden at late game.',
        caption: 'A late-game playtest save. The game is live on Roblox.',
      },
    ],
  },
}

const realearn: Project = {
  slug: 'realearn',
  name: 'Realearn',
  displayName: 'REALEARN',
  subtitle: 'learn how real software works',
  tagline: 'Follows one action’s data through a real system.',
  flow: ['Input', 'Process', 'Output'],
  summary:
    'A Windows desktop app in development: pick a real system, choose a feature, and follow its data from input, through processing, to output, with every step explained. The spec and architecture are written and fine-tuning of the local explanation model has started; the app is not built yet.',
  role: 'Solo developer',
  focus: 'Static analysis, local LLMs, fine-tuning',
  stack: ['Electron', 'TypeScript', 'tree-sitter', 'llama.cpp'],
  year: '2026',
  client: 'In development',
  color: '#2f5f98',
  soft: '#dde7f3',
  image: {
    src: '/images/realearn-trace-1600.webp',
    srcSet: '/images/realearn-trace-800.webp 800w, /images/realearn-trace-1600.webp 1600w',
    alt: 'Design concept of the Realearn trace viewer: highlighted server code, a plain-language explanation of the step, and a flow strip from phone to server to database to a friend’s phone.',
    mode: 'browser',
  },
  links: [],
  note: 'Realearn is in the design stage. The image is a concept of the trace viewer, not a screenshot.',
  caseStudy: {
    lead: 'A tool for learning how real software works by following one action’s data from where it enters to where it ends up.',
    problem:
      'Tutorials explain toy apps, and real codebases are too big to read from the top. I wanted to pick a feature of a real system, like sending a message, and watch its data move and change shape step by step, with each step explained and honest about how it is known.',
    built: [
      'Spec, nine ADRs, and a 17-issue plan; parsing decides each trace step and the AI only explains it.',
      'Python tooling for a JSONL dataset and GGUF model comparison; fine-tuning Qwen3.5 4B on Kaggle.',
    ],
    decisions: [
      {
        title: 'The analysis decides, the AI explains',
        body: 'tree-sitter parsing, language servers, and fixed rules choose the steps of a trace. The model writes explanations and can only point at steps and lines that already exist, so it cannot invent architecture.',
      },
      {
        title: 'Every step shows its evidence',
        body: 'Each step is labeled Observed, Sourced, or Inferred, and code that is not the system’s real code is badged Reconstructed, so a learner can tell real architecture from a plausible guess.',
      },
      {
        title: 'Local and free by default',
        body: 'Everything runs on the user’s machine with a small local model through node-llama-cpp. Cloud keys are optional, and the app shows exactly what would be sent before anything leaves the machine.',
      },
    ],
    improve: [
      'Build the code engine first and check it against a hand-verified golden set of about 10 open-source repos.',
      'Compare the fine-tuned model with the base model on the eval set before shipping it as the default.',
      'Add the website and installed-program engines after the code engine is solid.',
    ],
    screens: [
      {
        src: '/images/realearn-trace-1600.webp',
        srcSet: '/images/realearn-trace-800.webp 800w, /images/realearn-trace-1600.webp 1600w',
        alt: 'Design concept of the Realearn trace viewer.',
        caption:
          'A design concept of the trace viewer, drawn from the spec. The app is not built yet.',
      },
    ],
  },
}

export const projects: Project[] = [magilas, healthyaSat, iahbrary, realearn]
export const featuredProjects: Project[] = [magilas, healthyaSat, iahbrary]
export const hobbyProject: Project = skySprout
export const allProjects: Project[] = [...projects, hobbyProject]

export function getProject(slug: string): Project | undefined {
  return allProjects.find((project) => project.slug === slug)
}
