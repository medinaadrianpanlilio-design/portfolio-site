import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { about } from '../about'
import {
  allProjects,
  featuredProjects,
  getProject,
  hobbyProject,
  projects,
} from '../projects'
import { site } from '../site'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const publicFile = (src: string) =>
  path.join(root, 'public', src.replace(/^\/+/, ''))

describe('project content', () => {
  it('leads with the professional projects in the requested order', () => {
    expect(projects.map((project) => project.name)).toEqual([
      'Magilas Gym',
      'HealthyaSat',
      'Iahbrary',
      'Realearn',
    ])
  })

  it('presents Realearn honestly as in development', () => {
    const realearn = getProject('realearn')
    expect(realearn?.links).toEqual([])
    expect(realearn?.summary).toMatch(/not built yet/)
    expect(realearn?.note).toMatch(/concept/i)
    expect(realearn?.caseStudy.screens[0].caption).toMatch(/concept/i)
  })

  it('featured projects have a tagline and a three-step flow', () => {
    expect(featuredProjects.map((p) => p.slug)).toEqual(['magilas', 'healthya-sat', 'iahbrary'])
    for (const p of featuredProjects) {
      expect(p.tagline.length).toBeGreaterThan(0)
      expect(p.tagline.length).toBeLessThanOrEqual(48)
      expect(p.flow).toHaveLength(3)
    }
  })

  it('keeps SkySprout as a separate hobby at the end', () => {
    expect(hobbyProject.name).toBe('SkySprout')
    expect(hobbyProject.hobby).toBe(true)
    expect(projects).not.toContain(hobbyProject)
    expect(allProjects.at(-1)).toBe(hobbyProject)
  })

  it('keeps the professional roles and stacks accurate', () => {
    const magilas = getProject('magilas')
    const healthya = getProject('healthya-sat')
    const iahbrary = getProject('iahbrary')

    expect(magilas?.role).toMatch(/POS/)
    expect(magilas?.stack).toContain('RBAC')
    expect(healthya?.role).toMatch(/Backend \/ API/)
    expect(healthya?.stack).toContain('Docker')
    expect(iahbrary?.role).toBe('Solo developer')
    expect(iahbrary?.stack).toContain('Supabase')
  })

  it('uses the real project links and exposes the SkySprout public source', () => {
    expect(getProject('magilas')?.links[0].href).toBe('https://magilasgym.com/')
    expect(getProject('healthya-sat')?.links[0].href).toBe(
      'https://healthyasat.fit/',
    )
    expect(getProject('iahbrary')?.links[0].href).toBe(
      'https://github.com/medinaadrianpanlilio-design/iahbrary',
    )
    expect(hobbyProject.links[0].href).toBe(
      'https://www.roblox.com/games/117628058304479',
    )
    expect(
      hobbyProject.links.find((link) => link.label === 'View the code')?.href,
    ).toBe(
      'https://github.com/medinaadrianpanlilio-design/skysprout-public',
    )
  })

  it('has a real local image for every project screen', () => {
    const sources = new Set(
      allProjects.flatMap((project) => [
        project.image.src,
        ...project.caseStudy.screens.map((screen) => screen.src),
      ]),
    )

    for (const source of sources) {
      expect(existsSync(publicFile(source)), source).toBe(true)
    }
  })

  it('only publishes approved contact details', () => {
    expect(site.email).toBe('medinaadrianpanlilio@gmail.com')
    expect(site.linkedin).toBe(
      'https://www.linkedin.com/in/adrian-alexander-medina-022b8a433/',
    )
    expect(site.github).toBe(
      'https://github.com/medinaadrianpanlilio-design',
    )
    expect(about.availability).toMatch(/software engineering internships/i)
    expect(about.capabilities).toHaveLength(4)
    expect(about.experience).toHaveLength(1)

    const publicCopy = JSON.stringify({ site, about, projects: allProjects })
    expect(publicCopy).not.toMatch(/\+63|09\d{2}[\s-]?\d{3}[\s-]?\d{4}/)
    expect(publicCopy).not.toMatch(/street address/i)
    // The only résumé the site publishes is the one generated from this content.
    expect(site.resumePdf).toBe('/Adrian-Medina-Resume.pdf')
    expect(publicCopy.match(/resume[^"]*/gi)).toEqual(['resumePdf', 'Resume.pdf'])
  })

  it('does not claim retention results for the hobby project', () => {
    const copy = JSON.stringify(hobbyProject)
    expect(copy).not.toMatch(/retention rate|D1 retention|DAU/i)
    expect(hobbyProject.caseStudy.improve.join(' ')).toMatch(
      /no retention numbers/i,
    )
  })
})
