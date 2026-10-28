import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { site } from '../../../content/site'
import { MobileHeader } from '../MobileHeader'

describe('MobileHeader', () => {
  it('opens and closes the mobile navigation', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MobileHeader />
      </MemoryRouter>,
    )

    expect(
      screen.queryByRole('navigation', { name: 'Mobile' }),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(
      screen.getByRole('button', { name: 'Close menu' }),
    ).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('navigation', { name: 'Mobile' }),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute(
      'href',
      '/#skills',
    )
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      site.linkedin,
    )

    await user.click(screen.getByRole('link', { name: 'About' }))
    expect(
      screen.getByRole('button', { name: 'Open menu' }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('navigation', { name: 'Mobile' }),
    ).not.toBeInTheDocument()
  })
})
