export type ProjectLink = {
  label: string
  href: string
}

export type ProjectImage = {
  src: string
  srcSet?: string
  alt: string
  mode: 'landing' | 'browser' | 'phone' | 'game'
}

export type Decision = {
  title: string
  body: string
}

export type CaseStudy = {
  lead: string
  problem: string
  built: string[]
  decisions: Decision[]
  improve: string[]
  screens: {
    src: string
    srcSet?: string
    alt: string
    caption: string
  }[]
}

export type Project = {
  slug: string
  name: string
  displayName: string
  subtitle: string
  summary: string
  role: string
  focus: string
  stack: string[]
  year: string
  client: string
  color: string
  soft: string
  image: ProjectImage
  links: ProjectLink[]
  caseStudy: CaseStudy
  note?: string
  hobby?: boolean
}
