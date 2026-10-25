import { site } from './site'
import type { Project } from './types'

export const projects: Project[] = [
  {
    slug: 'skysprout',
    name: 'SkySprout',
    tagline: 'A floating garden that grows while you’re away.',
    role: 'Solo developer',
    stack: 'Roblox, Luau, DataStore',
    links: [{ label: 'Play on Roblox', href: site.skySproutUrl }],
    accent: 'leaf',
  },
  {
    slug: 'iahbrary',
    name: 'Iahbrary',
    tagline: 'A reading tracker that treats reading like training.',
    role: 'Solo developer',
    stack: 'Expo, React Native, TypeScript, Supabase',
    links: [
      {
        label: 'View the code',
        href: 'https://github.com/medinaadrianpanlilio-design/iahbrary',
      },
    ],
    accent: 'mint',
  },
  {
    slug: 'healthyaSat',
    name: 'HealthyaSat',
    tagline: 'Fact-check health claims where people read them.',
    role: 'Backend/API developer',
    stack: 'Browser extension, API, Docker',
    links: [{ label: 'Visit HealthyaSat', href: 'https://healthyasat.fit/' }],
    accent: 'healthya',
  },
  {
    slug: 'magilas',
    name: 'Magilas Gym',
    tagline: 'The management system behind a live gym.',
    role: 'POS/admin developer',
    stack: 'Web app, RBAC, QR entry, inventory',
    links: [
      { label: 'Visit the gym', href: 'https://magilasgym.com/' },
      { label: 'Staff portal', href: 'https://magilasgym.com/login' },
    ],
    accent: 'amber',
  },
]
