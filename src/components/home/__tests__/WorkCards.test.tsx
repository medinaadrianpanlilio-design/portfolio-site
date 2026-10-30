import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { WorkCards } from '../WorkCards'

describe('WorkCards', () => {
  it('shows the three featured projects as links with their how-it-works flow', () => {
    render(
      <MemoryRouter>
        <WorkCards />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /MAGILAS/ })).toHaveAttribute('href', '/projects/magilas')
    expect(screen.getByRole('link', { name: /HEALTHYASAT/ })).toHaveAttribute('href', '/projects/healthya-sat')
    expect(screen.getByRole('link', { name: /IAHBRARY/ })).toHaveAttribute('href', '/projects/iahbrary')
    expect(screen.getByText('QR entry')).toBeInTheDocument()
    expect(screen.queryByText(/SKYSPROUT/)).toBeNull()
  })

  it('the build-together card opens an email to Adrian', () => {
    render(
      <MemoryRouter>
        <WorkCards />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: /let’s build together|let's build together/i })
    expect(link.getAttribute('href')).toMatch(
      /^mailto:medinaadrianpanlilio@gmail\.com\?subject=Let's%20build%20a%20project%20together/,
    )
  })
})
