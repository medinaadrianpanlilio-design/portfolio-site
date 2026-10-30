import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { ROOM_OBJECTS, type RoomObjectName } from '../../content/room'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePageTransition } from '../layout/transitionContext'
import styles from './RoomHero.module.css'
import { RoomPreview } from './RoomPreview'
import { RoomTourContext, type RoomTour as RoomTourState } from './tourContext'
import { progressToStop, scrollProgress, stopProgress, TOUR_STOPS } from './tour'

const label = (stop: RoomObjectName) => ROOM_OBJECTS.find((entry) => entry.name === stop)!.label
const clampUnit = (value: number) => Math.min(Math.max(value, -1), 1)

/** Start the "step into it" camera push (read each frame by the scene). */
function startDolly(dolly: { current: number | null }, render: { current: (() => void) | null }) {
  dolly.current = performance.now()
  render.current?.()
}

/**
 * The pinned scroll tour: a tall track with the room stuck to the viewport,
 * the four preview cards, the step rail and the scroll cue. With reduced
 * motion the room stays put and the labels and rail swap stops instead.
 */
export function RoomTour({ nameCard, children }: { nameCard: ReactNode; children: ReactNode }) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const mode = reduced ? 'static' : 'scroll'
  const transitionTo = usePageTransition()

  const track = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const dolly = useRef<number | null>(null)
  const render = useRef<(() => void) | null>(null)

  const [scrolled, setScrolled] = useState<number | null>(null)
  const [staticStop, setStaticStop] = useState<number | null>(null)
  const [started, setStarted] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const current = mode === 'scroll' ? scrolled : staticStop

  // Scroll → progress ref. React only hears about it when a card appears or goes.
  useEffect(() => {
    const section = track.current
    const pinned = stage.current
    if (mode !== 'scroll' || !section || !pinned) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const next = scrollProgress(rect.top, rect.height, pinned.offsetHeight)
      const state = progressToStop(next)
      section.dataset.roomPhase = state.view === 'travel' ? 'travel' : 'hold'
      setScrolled(state.shown)
      setStarted(next > 0.01)
      if (next !== progress.current) {
        progress.current = next
        render.current?.()
      }
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.cancelAnimationFrame(frame)
      delete section.dataset.roomPhase
    }
  }, [mode])

  // Pointer parallax: mouse and trackpad only, on the whole room so overlays don't block it.
  useEffect(() => {
    const section = track.current
    const pinned = stage.current
    if (reduced || !finePointer || !section || !pinned) return
    const neutral = () => {
      pointer.current = { x: 0, y: 0 }
      render.current?.()
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const box = pinned.getBoundingClientRect()
      pointer.current = {
        x: clampUnit(((event.clientX - box.left) / box.width) * 2 - 1),
        y: clampUnit(((event.clientY - box.top) / box.height) * 2 - 1),
      }
      render.current?.()
    }
    const hidden = () => {
      if (document.visibilityState !== 'visible') neutral()
    }
    section.addEventListener('pointermove', move, { passive: true })
    section.addEventListener('pointerleave', neutral)
    document.addEventListener('visibilitychange', hidden)
    return () => {
      section.removeEventListener('pointermove', move)
      section.removeEventListener('pointerleave', neutral)
      document.removeEventListener('visibilitychange', hidden)
      neutral()
    }
  }, [reduced, finePointer])

  // Screen readers hear the stop name once it settles, never every scroll tick.
  useEffect(() => {
    if (current === null) return
    const timer = window.setTimeout(() => setAnnouncement(label(TOUR_STOPS[current])), 700)
    return () => window.clearTimeout(timer)
  }, [current])

  const focusStop = useCallback(
    (name: RoomObjectName) => {
      const index = (TOUR_STOPS as readonly RoomObjectName[]).indexOf(name)
      if (index < 0) return
      if (mode === 'static') {
        setStaticStop(index)
        return
      }
      const section = track.current
      const pinned = stage.current
      if (!section || !pinned) return
      const distance = section.offsetHeight - pinned.offsetHeight
      const top = window.scrollY + section.getBoundingClientRect().top
      window.scrollTo({ top: top + stopProgress(index) * distance, behavior: 'smooth' })
    },
    [mode],
  )

  const open = (index: number) => {
    const entry = ROOM_OBJECTS.find((object) => object.name === TOUR_STOPS[index])!
    if (!reduced) startDolly(dolly, render)
    void transitionTo(entry.to).finally(() => {
      // Same-page sections keep the room mounted: leave it ready for the way back.
      dolly.current = null
      setStaticStop(null)
      render.current?.()
    })
  }

  const tour = useMemo<RoomTourState>(
    () => ({ mode, progress, staticStop, pointer, dolly, render, focusStop }),
    [mode, staticStop, focusStop],
  )

  return (
    <RoomTourContext.Provider value={tour}>
      <section
        ref={track}
        className={mode === 'scroll' ? styles.track : undefined}
        aria-label="Adrian's room"
        data-room-tour={mode}
      >
        <div ref={stage} className={`${styles.room} ${mode === 'scroll' ? styles.pinned : ''}`}>
          {/* Phones stack the name card and rail at the top; wide screens place each on its own. */}
          <div className={styles.chrome}>
            {nameCard}
            <nav className={styles.rail} aria-label="Room tour" data-room-avoid>
              <ol>
                {TOUR_STOPS.map((stop, index) => (
                  <li key={stop}>
                    <button
                      type="button"
                      className={styles.step}
                      aria-current={current === index ? 'step' : undefined}
                      onClick={() => focusStop(stop)}
                    >
                      <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>{' '}
                      <span className={styles.stepName}>{label(stop)}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {TOUR_STOPS.map((stop, index) => (
            <RoomPreview
              key={stop}
              stop={stop}
              active={current === index}
              onOpen={() => open(index)}
              onClose={mode === 'static' ? () => setStaticStop(null) : undefined}
            />
          ))}

          {mode === 'scroll' && (
            <p className={styles.cue} data-hidden={started || undefined} aria-hidden="true">
              Scroll to explore
            </p>
          )}

          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>

          <div className={styles.scene}>{children}</div>
        </div>
      </section>
    </RoomTourContext.Provider>
  )
}
