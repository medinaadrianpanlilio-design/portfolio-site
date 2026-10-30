import { createContext, useContext } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router-dom'

import { navigateTo } from '../room/navigateTo'

/** Cover the screen, go to `to`, reveal it, then focus its heading. */
export type TransitionTo = (to: string) => Promise<void>

export const PageTransitionContext = createContext<TransitionTo | null>(null)

export function go(to: string, navigate: NavigateFunction) {
  navigateTo(
    to,
    navigate,
    (url) => window.location.assign(url),
    // Jump while covered; a smooth scroll past the whole room would show through.
    (id) => document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' }),
  )
}

/** Sections focus their heading (`#skills` → `#skills-heading`); pages focus their h1. */
export function focusDestination(to: string) {
  const heading = to.startsWith('/#')
    ? document.getElementById(`${to.slice(2)}-heading`) ?? document.getElementById(to.slice(2))
    : document.querySelector<HTMLElement>('#main h1')
  if (!heading) return
  if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
  heading.focus({ preventScroll: true })
}

/** Outside the provider (unit tests render pages alone), navigate without the overlay. */
export function usePageTransition(): TransitionTo {
  const transitionTo = useContext(PageTransitionContext)
  const navigate = useNavigate()
  return (
    transitionTo ??
    (async (to) => {
      go(to, navigate)
      focusDestination(to)
    })
  )
}
