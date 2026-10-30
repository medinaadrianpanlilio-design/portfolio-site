import { useCallback, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './PageTransition.module.css'
import { focusDestination, go, PageTransitionContext, type TransitionTo } from './transitionContext'

const COVER_MS = 300
const REVEAL_MS = 360

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

// Two frames: the new route commits, then SiteShell's scroll reset runs.
const settle = () =>
  new Promise<void>((resolve) =>
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve())),
  )

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'idle' | 'cover' | 'reveal'>('idle')
  const busy = useRef(false)

  const transitionTo = useCallback<TransitionTo>(
    async (to) => {
      // A second press mid-transition must not add a second history entry.
      if (busy.current) return
      busy.current = true
      const animate = !prefersReducedMotion()
      try {
        if (animate) {
          setPhase('cover')
          await wait(COVER_MS)
        }
        go(to, navigate)
        await settle()
        if (animate) {
          setPhase('reveal')
          await wait(REVEAL_MS)
        }
        focusDestination(to)
      } finally {
        setPhase('idle')
        busy.current = false
      }
    },
    [navigate],
  )

  return (
    <PageTransitionContext.Provider value={transitionTo}>
      {children}
      {phase !== 'idle' && (
        <div className={styles.overlay} data-phase={phase} aria-hidden="true" />
      )}
    </PageTransitionContext.Provider>
  )
}
