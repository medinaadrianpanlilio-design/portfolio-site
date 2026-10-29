import { describe, expect, it, vi } from 'vitest'

import { navigateTo } from '../navigateTo'

describe('navigateTo', () => {
  it('routes pages and same-page sections through the router', () => {
    const navigate = vi.fn()
    const assign = vi.fn()

    navigateTo('/projects', navigate, assign)
    navigateTo('/#skills', navigate, assign)

    expect(navigate.mock.calls).toEqual([['/projects'], ['/#skills']])
    expect(assign).not.toHaveBeenCalled()
  })

  it('opens the resume PDF with a full navigation, not a popup', () => {
    const navigate = vi.fn()
    const assign = vi.fn()

    navigateTo('/Adrian-Medina-Resume.pdf', navigate, assign)

    expect(assign).toHaveBeenCalledWith('/Adrian-Medina-Resume.pdf')
    expect(navigate).not.toHaveBeenCalled()
  })
})
