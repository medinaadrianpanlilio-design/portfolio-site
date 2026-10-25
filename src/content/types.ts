export type ProjectSlug = 'skysprout' | 'iahbrary' | 'healthyaSat' | 'magilas'

export type ProjectLink = {
  label: string
  href: string
}

export type Project = {
  slug: ProjectSlug
  name: string
  tagline: string
  role: string
  stack: string
  links: ProjectLink[]
  accent: 'leaf' | 'mint' | 'healthya' | 'amber'
}

export type LoopStep = {
  label: string
  detail: string
}

export type RetentionPanel = {
  id: 'tutorial' | 'offline' | 'weather'
  title: string
  body: string
  stat: string
  statLabel: string
}

export type EngineeringNote = {
  title: string
  body: string
}

export type Measurement = {
  label: string
  body: string
}

export type OtherWorkItem = {
  name: string
  tagline: string
  body: string
  role: string
  stack: string
  link: string
  linkLabel: string
  staffLink?: string
  image?: string
  imageAlt?: string
  accent: 'healthya' | 'amber'
}
