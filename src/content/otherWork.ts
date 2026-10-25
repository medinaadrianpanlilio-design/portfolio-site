import type { OtherWorkItem } from './types'

export const otherWork: OtherWorkItem[] = [
  {
    name: 'HealthyaSat',
    tagline: 'Fact-check health claims where people read them.',
    body: 'A browser extension that checks Taglish health claims on Philippine news sites. Highlight a claim; it returns a certified, unverified, or false verdict from a DOH/WHO-informed knowledge base, with severity flagging and a usage limit.',
    role: 'Backend/API developer',
    stack: 'Browser extension, API, Docker',
    link: 'https://healthyasat.fit/',
    linkLabel: 'Visit HealthyaSat',
    image: '/images/healthyaSat-extension.webp',
    imageAlt:
      'HealthyaSat extension open over a Balita article with a selected health claim and a Fact-check button.',
    accent: 'healthya',
  },
  {
    name: 'Magilas Gym',
    tagline: 'The management system behind a live gym.',
    body: 'POS and admin workflows for a real gym in San Luis, Pampanga: role-based access, QR entry logging, inventory, income and expense monitoring, subscriptions, and maintenance reporting.',
    role: 'POS/admin developer',
    stack: 'Web app, RBAC, QR entry, inventory',
    link: 'https://magilasgym.com/',
    linkLabel: 'Visit the gym',
    staffLink: 'https://magilasgym.com/login',
    accent: 'amber',
  },
]
