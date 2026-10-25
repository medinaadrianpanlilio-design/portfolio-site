import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { skySprout } from '../../../content/skysprout'
import { SkySproutCaseStudy } from '../../sections/SkySproutCaseStudy'

describe('SkySprout details', () => {
  it('shows the three retention mechanisms as distinct panels', () => {
    render(<SkySproutCaseStudy />)

    expect(
      screen.getByRole('heading', { name: /why players come back/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('+100')).toBeInTheDocument()
    expect(screen.getByText('12h')).toBeInTheDocument()
    expect(screen.getByText('44 min')).toBeInTheDocument()
    expect(screen.getByText('2:00 2×')).toBeInTheDocument()

    for (const word of ['Wind', 'Thunder', 'Cosmic', 'Golden']) {
      expect(screen.getAllByText(new RegExp(word)).length).toBeGreaterThan(0)
    }

    const panels = screen.getAllByTestId('retention-panel')
    expect(panels).toHaveLength(3)
    expect(new Set(panels.map((panel) => panel.getAttribute('data-variant')))).toEqual(
      new Set(['tutorial', 'offline', 'weather']),
    )
  })

  it('shows the engineering decisions and the measurement plan', () => {
    render(<SkySproutCaseStudy />)

    expect(
      screen.getByRole('heading', { name: /under the hood/i }),
    ).toBeInTheDocument()
    for (const note of skySprout.engineering) {
      expect(screen.getAllByText(note.title).length).toBeGreaterThan(0)
    }

    expect(
      screen.getByRole('heading', { name: /what i’d measure next/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/no retention data yet/i)).toBeInTheDocument()

    for (const metric of skySprout.measurements) {
      expect(screen.getByText(metric.label)).toBeInTheDocument()
    }
  })

  it('does not invent performance numbers', () => {
    render(<SkySproutCaseStudy />)

    expect(screen.queryByText(/\d+%|DAU|revenue/i)).not.toBeInTheDocument()
  })
})
