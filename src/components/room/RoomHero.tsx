import { lazy, Suspense, useState } from 'react'

import { site } from '../../content/site'
import { hasWebGL } from './hasWebGL'
import { RoomErrorBoundary } from './RoomErrorBoundary'
import { RoomFallback } from './RoomFallback'
import { getRoomMode, type RoomMode } from './roomMode'
import styles from './RoomHero.module.css'
import { RoomTour } from './RoomTour'

const RoomCanvas = lazy(() => import('./RoomCanvas'))

/** Past the whole tour to the landing headline. */
function skipToWork() {
  const headline = document.getElementById('home-title')
  if (!headline) return
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  // Jump through the tour; smooth-scrolling it would replay every camera move.
  const touring = document.querySelector('[data-room-tour="scroll"]')
  ;(headline.closest('section') ?? headline).scrollIntoView({
    behavior: reduced || touring ? 'instant' : 'smooth',
    block: 'start',
  })
  headline.focus({ preventScroll: true })
}

function NameCard() {
  return (
    <div className={styles.overlay} data-room-overlay>
      <p className={styles.name}>{site.fullName}</p>
      <p className={styles.role}>{site.role}</p>
      <button className={styles.skip} type="button" onClick={skipToWork}>
        Skip to my work
      </button>
    </div>
  )
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

  // No WebGL: the still and the dock links, no tour track of empty screens.
  if (!canRender) {
    return (
      <section aria-label="Adrian's room">
        <div className={styles.room}>
          <RoomFallback />
          <NameCard />
        </div>
      </section>
    )
  }

  return (
    <RoomTour nameCard={<NameCard />}>
      <RoomErrorBoundary fallback={<RoomFallback />}>
        <Suspense fallback={<RoomFallback loading />}>
          <RoomCanvas mode={mode} />
        </Suspense>
      </RoomErrorBoundary>
    </RoomTour>
  )
}
