import { describe, expect, it, vi } from 'vitest'

import { navigateTo } from '../navigateTo'

describe('navigateTo', () => {
  it('routes pages and same-page sections through the router', () => {
    const navigate = vi.fn()
    const assign = vi.fn()

    navigateTo('/projects', navigate, assign, vi.fn())
    navigateTo('/#skills', navigate, assign, vi.fn())

    expect(navigate.mock.calls).toEqual([['/projects'], ['/#skills']])
    expect(assign).not.toHaveBeenCalled()
  })

  it('scrolls to a same-page section even when the hash is unchanged', () => {
    const scroll = vi.fn()

    navigateTo('/#skills', vi.fn(), vi.fn(), scroll)
    navigateTo('/projects', vi.fn(), vi.fn(), scroll)

    expect(scroll.mock.calls).toEqual([['skills']])
  })

  it('opens the resume PDF with a full navigation, not a popup', () => {
    const navigate = vi.fn()
    const assign = vi.fn()

    navigateTo('/Adrian-Medina-Resume.pdf', navigate, assign, vi.fn())

    expect(assign).toHaveBeenCalledWith('/Adrian-Medina-Resume.pdf')
    expect(navigate).not.toHaveBeenCalled()
  })
})
