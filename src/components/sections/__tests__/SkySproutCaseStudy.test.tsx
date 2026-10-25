import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { skySprout } from '../../../content/skysprout'
import { SkySproutCaseStudy } from '../SkySproutCaseStudy'

describe('SkySproutCaseStudy', () => {
  it('introduces the live game honestly', () => {
    const { container } = render(<SkySproutCaseStudy />)

    expect(container.querySelector('#work')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'SkySprout' }),
    ).toBeInTheDocument()
    expect(screen.getByText(skySprout.tagline)).toBeInTheDocument()
    expect(screen.getByText(skySprout.meta)).toBeInTheDocument()
    expect(screen.getByText(skySprout.proof)).toBeInTheDocument()
    expect(screen.getByText('BretRackstar')).toBeInTheDocument()

    const link = screen.getByRole('link', { name: 'Play on Roblox' })
    expect(link).toHaveAttribute('href', skySprout.liveUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')

    expect(
      screen.getByAltText(/SkySprout garden at late game/i),
    ).toBeInTheDocument()
    expect(screen.getByAltText('SkySprout game icon')).toBeInTheDocument()
  })

  it('keeps the loop in the approved order', () => {
    render(<SkySproutCaseStudy />)

    const steps = screen.getAllByTestId('loop-step')
    expect(steps).toHaveLength(6)

    skySprout.loop.forEach((step, index) => {
      expect(within(steps[index]).getByText(step.label)).toBeInTheDocument()
      expect(within(steps[index]).getByText(step.detail)).toBeInTheDocument()
    })
  })

  it('does not invent performance numbers', () => {
    render(<SkySproutCaseStudy />)

    expect(screen.queryByText(/\d+%|DAU|revenue/i)).not.toBeInTheDocument()
  })
})
