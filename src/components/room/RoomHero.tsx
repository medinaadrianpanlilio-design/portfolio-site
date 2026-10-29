import { lazy, Suspense, useState } from 'react'

import { site } from '../../content/site'
import { hasWebGL } from './hasWebGL'
import { RoomErrorBoundary } from './RoomErrorBoundary'
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
  // Once: each probe opens a WebGL context, and HomePage re-renders on pointer moves.
  const [canRender] = useState(webgl)
  if (mode === 'off') return null

  return (
    <section className={styles.room} aria-label="Adrian's room">
      {canRender ? (
        <RoomErrorBoundary fallback={<RoomFallback />}>
          <Suspense fallback={<RoomFallback loading />}>
            <RoomCanvas mode={mode} />
          </Suspense>
        </RoomErrorBoundary>
      ) : (
        <RoomFallback />
      )}

      <div className={styles.overlay} data-room-overlay>
        <p className={styles.name}>{site.fullName}</p>
        <p className={styles.role}>{site.role}</p>
        <button className={styles.skip} type="button" onClick={skipToWork}>
          Skip to my work
        </button>
      </div>
    </section>
  )
}
