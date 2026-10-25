import { describe, expect, it } from 'vitest'

import { about } from '../about'
import { iahbrary } from '../iahbrary'
import { otherWork } from '../otherWork'
import { projects } from '../projects'
import { site } from '../site'
import { skySprout } from '../skysprout'

describe('content contract', () => {
  it('lists the approved project lineup', () => {
    expect(projects.map((project) => project.name)).toEqual([
      'SkySprout',
      'Iahbrary',
      'HealthyaSat',
      'Magilas Gym',
    ])
  })

  it('does not include removed projects', () => {
    expect(JSON.stringify([projects, skySprout, iahbrary, otherWork])).not.toMatch(
      /Meal Maps|TaskPal/i,
    )
  })

  it('uses the approved contact and live links', () => {
    expect(site.email).toBe('medinaadrianpanlilio@gmail.com')
    expect(site.github).toBe('https://github.com/medinaadrianpanlilio-design')
    expect(site.sourceUrl).toBe(
      'https://github.com/medinaadrianpanlilio-design/portfolio',
    )
    expect(skySprout.liveUrl).toBe(
      'https://www.roblox.com/games/117628058304479',
    )
    expect(skySprout.handle).toBe('BretRackstar')
  })

  it('keeps the SkySprout loop and retention facts intact', () => {
    expect(skySprout.loop.map((step) => step.label)).toEqual([
      'Buy seeds',
      'Plant',
      'Grow',
      'Harvest',
      'Sell or exhibit',
      'Earn and expand',
    ])
    expect(skySprout.retention.map((panel) => panel.stat)).toEqual([
      '+100',
      '12h',
      '44 min',
    ])
    expect(skySprout.measurements).toHaveLength(6)
  })

  it('does not publish private contact or resume data', () => {
    expect(JSON.stringify([projects, about])).not.toMatch(
      /\+63|phone number|street address|resume/i,
    )
  })
})
