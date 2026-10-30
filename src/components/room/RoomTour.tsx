import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { ROOM_OBJECTS, type RoomObjectName } from '../../content/room'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePageTransition } from '../layout/transitionContext'
import { createGestureGate } from './gestures'
import styles from './RoomHero.module.css'
import { RoomPreview } from './RoomPreview'
import { RoomTourContext, type RoomTour as RoomTourState } from './tourContext'
import {
  GLIDE_MS,
  startGlide,
  step,
  TOUR_STOPS,
  tourFrame,
  type Spot,
  type TourMotion,
} from './tour'

const label = (stop: RoomObjectName) => ROOM_OBJECTS.find((entry) => entry.name === stop)!.label
const clampUnit = (value: number) => Math.min(Math.max(value, -1), 1)

/** Before the scene loads there is no camera to fly from; it appears at the stop once it does. */
const NO_POSE: Spot = { position: { x: 0, y: 0, z: 0 }, target: { x: 0, y: 0, z: -1 } }
const copySpot = ({ position, target }: Spot): Spot => ({
  position: { ...position },
  target: { ...target },
})

/** Fields that keep their keys: typing a space or an arrow there never moves the tour. */
const TYPING = 'input, textarea, select, [contenteditable]'
/** Space presses these instead of scrolling. */
const PRESSABLE = 'button, a[href], summary, [role="button"]'
const KEYS: Partial<Record<string, 1 | -1>> = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 }

/** Wheel delta in pixels, whatever unit the browser reported it in. */
function wheelPixels(event: WheelEvent): number {
  if (event.deltaMode === 1) return event.deltaY * 16
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight
  return event.deltaY
}

/** Start the "step into it" camera push (read each frame by the scene). */
function startDolly(dolly: { current: number | null }, render: { current: (() => void) | null }) {
  dolly.current = performance.now()
  render.current?.()
}

/**
 * The one-flick tour: the room fills the first screen, and while it does each
 * wheel flick, swipe or arrow key glides the camera one stop. Past the bed
 * (or back at the start) gestures are left alone and the page scrolls on.
 * Also the four preview cards, the step rail and the scroll cue. With reduced
 * motion the room stays put and the labels and rail swap stops instead.
 */
export function RoomTour({ nameCard, children }: { nameCard: ReactNode; children: ReactNode }) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const mode = reduced ? 'static' : 'scroll'
  const transitionTo = usePageTransition()

  const room = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const motion = useRef<TourMotion>({ stop: 0, glide: null })
  const pose = useRef<Spot | null>(null)
  const follow = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const dolly = useRef<number | null>(null)
  const render = useRef<(() => void) | null>(null)
  const [gate] = useState(createGestureGate)

  const [shown, setShown] = useState<number | null>(null)
  const [staticStop, setStaticStop] = useState<number | null>(null)
  const [started, setStarted] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const current = mode === 'scroll' ? shown : staticStop

  /**
   * Glide to a spot (0 = start, n = TOUR_STOPS[n - 1]). The scene reads the
   * motion ref each frame; React only hears about it when a card appears or goes.
   */
  const glideTo = useCallback(
    (to: number) => {
      const section = room.current
      if (!section) return
      const now = performance.now()
      motion.current = startGlide(to, now, copySpot(pose.current ?? NO_POSE))
      gate.busyUntil(now + GLIDE_MS)
      setShown(null)
      setStarted(to > 0)
      render.current?.()

      window.cancelAnimationFrame(follow.current)
      let last: number | null = null
      const tick = () => {
        const frame = tourFrame(motion.current, performance.now())
        const phase = frame.view === 'travel' ? 'travel' : 'hold'
        if (section.dataset.roomPhase !== phase) section.dataset.roomPhase = phase
        if (frame.shown !== last) {
          last = frame.shown
          setShown(frame.shown)
        }
        follow.current = frame.done ? 0 : window.requestAnimationFrame(tick)
      }
      follow.current = window.requestAnimationFrame(tick)
    },
    [gate],
  )

  // Gestures → glides, only while the room fills the screen and has a stop to go to.
  useEffect(() => {
    const section = room.current
    if (mode !== 'scroll' || !section) return
    section.dataset.roomPhase = 'hold'

    // Scrolled even slightly past the room: the page owns every gesture.
    const engaged = () => section.getBoundingClientRect().top > -2
    const typing = (target: EventTarget | null) =>
      target instanceof Element && target.closest(TYPING) !== null
    const gliding = () =>
      motion.current.glide !== null && !tourFrame(motion.current, performance.now()).done
    // Somewhere to go this way: not past the bed, not before the start.
    const capturing = (direction: number) =>
      direction !== 0 && typeof step(motion.current.stop, direction > 0 ? 1 : -1) === 'number'
    const go = (direction: 1 | -1) => {
      const next = step(motion.current.stop, direction)
      if (typeof next === 'number') glideTo(next)
    }

    const wheel = (event: WheelEvent) => {
      // ctrl + wheel is a trackpad pinch: the browser zooms.
      if (event.ctrlKey || !engaged() || typing(event.target)) return
      const delta = wheelPixels(event)
      const now = performance.now()
      // A closed gate swallows everything, even past the bed: the tail of the
      // flick that arrived there must not scroll the page away from its card.
      const closed = gate.closed(now)
      // Fed even mid-glide, so trackpad momentum keeps the gate closed.
      const direction = gate.wheel(delta, now)
      const busy = gliding()
      if (closed || busy || capturing(direction || delta)) event.preventDefault()
      if (direction !== 0 && !busy) go(direction)
    }
    // Scrolling the page back up: the stream that reaches the top must not
    // carry on into a glide, so the room waits for it to go quiet.
    const pageWheel = () => {
      if (!engaged()) gate.passed(performance.now())
    }

    let startY: number | null = null
    const touchStart = (event: TouchEvent) => {
      startY = event.touches.length === 1 && engaged() ? event.touches[0].clientY : null
    }
    const touchMove = (event: TouchEvent) => {
      // Two fingers are a pinch: leave it to the browser.
      if (startY === null || event.touches.length !== 1 || !engaged()) return
      const closed = gate.closed(performance.now())
      if (closed || gliding() || capturing(startY - event.touches[0].clientY)) event.preventDefault()
    }
    const touchEnd = (event: TouchEvent) => {
      const from = startY
      startY = null
      if (from === null || !engaged() || gliding()) return
      const direction = gate.swipe(from, event.changedTouches[0].clientY, performance.now())
      if (direction !== 0) go(direction)
    }
    const touchCancel = () => {
      startY = null
    }

    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
      if (!engaged() || typing(event.target)) return
      const space = event.key === ' '
      if (space && event.target instanceof Element && event.target.closest(PRESSABLE)) return
      const direction = space ? (event.shiftKey ? -1 : 1) : KEYS[event.key]
      if (!direction) return
      if (gliding()) {
        event.preventDefault()
        return
      }
      if (!capturing(direction)) return
      event.preventDefault()
      go(direction)
    }

    section.addEventListener('wheel', wheel, { passive: false })
    section.addEventListener('touchstart', touchStart, { passive: true })
    section.addEventListener('touchmove', touchMove, { passive: false })
    section.addEventListener('touchend', touchEnd)
    section.addEventListener('touchcancel', touchCancel)
    window.addEventListener('wheel', pageWheel, { passive: true })
    window.addEventListener('keydown', key)
    return () => {
      section.removeEventListener('wheel', wheel)
      section.removeEventListener('touchstart', touchStart)
      section.removeEventListener('touchmove', touchMove)
      section.removeEventListener('touchend', touchEnd)
      section.removeEventListener('touchcancel', touchCancel)
      window.removeEventListener('wheel', pageWheel)
      window.removeEventListener('keydown', key)
      window.cancelAnimationFrame(follow.current)
      gate.reset()
      delete section.dataset.roomPhase
    }
  }, [mode, gate, glideTo])

  // Pointer parallax: mouse and trackpad only, on the whole room so overlays don't block it.
  useEffect(() => {
    const section = room.current
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

  // Screen readers hear the stop name once it settles, never mid-glide.
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
      const section = room.current
      if (!section) return
      // From further down the page: back up to the room first, then one glide, even across stops.
      const top = section.getBoundingClientRect().top
      if (top <= -2) window.scrollTo({ top: window.scrollY + top, behavior: 'instant' })
      const { stop, glide } = motion.current
      if (stop === index + 1 && glide === null) return
      glideTo(index + 1)
    },
    [mode, glideTo],
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
    () => ({ mode, motion, pose, staticStop, pointer, dolly, render, focusStop }),
    [mode, staticStop, focusStop],
  )

  return (
    <RoomTourContext.Provider value={tour}>
      <section ref={room} aria-label="Adrian's room" data-room-tour={mode}>
        <div ref={stage} className={styles.room}>
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
