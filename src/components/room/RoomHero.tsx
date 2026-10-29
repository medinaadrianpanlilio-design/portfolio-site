import { lazy, Suspense } from 'react'

import { site } from '../../content/site'
import { hasWebGL } from './hasWebGL'
import { RoomFallback } from './RoomFallback'
import { getRoomMode, type RoomMode } from './roomMode'
import styles from './RoomHero.module.css'

const RoomCanvas = lazy(() => import('./RoomCanvas'))

function skipToWork() {
  const headline = document.getElementById('home-title')
  if (!headline) return
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ;(headline.closest('section') ?? headline).scrollIntoView({
    behavior: reduced ? 'auto' : 'smooth',
    block: 'start',
  })
  headline.focus({ preventScroll: true })
}

export function RoomHero({
  mode = getRoomMode(import.meta.env),
  webgl = hasWebGL,
}: {
  mode?: RoomMode
  webgl?: () => boolean
}) {
  if (mode === 'off') return null

  return (
    <section className={styles.room} aria-label="Adrian's room">
      {webgl() ? (
        <Suspense fallback={<RoomFallback loading />}>
          <RoomCanvas mode={mode} />
        </Suspense>
      ) : (
        <RoomFallback />
      )}

      <div className={styles.overlay}>
        <p className={styles.name}>{site.fullName}</p>
        <p className={styles.role}>{site.role}</p>
        <button className={styles.skip} type="button" onClick={skipToWork}>
          Skip to my work
        </button>
      </div>
    </section>
  )
}
