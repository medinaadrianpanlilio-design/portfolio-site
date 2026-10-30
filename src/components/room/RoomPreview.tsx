import type { MouseEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { about } from '../../content/about'
import { projects } from '../../content/projects'
import { ROOM_OBJECTS } from '../../content/room'
import { site } from '../../content/site'
import styles from './RoomPreview.module.css'
import type { TourStop } from './tour'

type Preview = { eyebrow: string; title: string; action: string; body: ReactNode }

/** Quick looks built from the site's own content, one per stop. */
const PREVIEWS: Record<TourStop, Preview> = {
  monitor: {
    eyebrow: 'Projects',
    title: 'A few things I’ve built.',
    action: 'Open projects',
    body: (
      <ul className={styles.list}>
        {projects.slice(0, 3).map((project) => (
          <li key={project.slug}>
            <span className={styles.item}>{project.displayName}</span>
            <span className={styles.meta}>{project.role}</span>
          </li>
        ))}
      </ul>
    ),
  },
  system_unit: {
    eyebrow: 'Skills',
    title: 'What I work with.',
    action: 'See skills',
    body: (
      <ul className={styles.list}>
        {about.capabilities.map((capability) => (
          <li key={capability.title}>
            <span className={styles.item}>{capability.title}</span>
          </li>
        ))}
      </ul>
    ),
  },
  window: {
    eyebrow: 'Contact',
    title: 'Let’s build something useful.',
    action: 'Get in touch',
    body: (
      <dl className={styles.facts}>
        <dt>Email</dt>
        <dd>{site.email}</dd>
        <dt>Elsewhere</dt>
        <dd>LinkedIn · GitHub</dd>
        <dt>Open to</dt>
        <dd>{about.availabilityShort}</dd>
      </dl>
    ),
  },
  bed: {
    eyebrow: 'About',
    title: 'Engineering with intent.',
    action: 'More about me',
    body: (
      <div className={styles.about}>
        <img
          className={styles.portrait}
          src="/images/adrian-medina.jpg"
          alt=""
          width="56"
          height="56"
          loading="lazy"
        />
        <p className={styles.meta}>{about.educationShort}</p>
        <p className={styles.text}>{about.intro}</p>
      </div>
    ),
  },
}

export function RoomPreview({
  stop,
  active,
  onOpen,
  onClose,
}: {
  stop: TourStop
  active: boolean
  onOpen: () => void
  /** Reduced motion only: there is no scroll to leave the stop by. */
  onClose?: () => void
}) {
  const preview = PREVIEWS[stop]
  const to = ROOM_OBJECTS.find((entry) => entry.name === stop)!.to
  const headingId = `room-preview-${stop}`

  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    // New-tab and other modified clicks keep the browser's own behaviour.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onOpen()
  }

  return (
    <article
      className={styles.card}
      aria-labelledby={headingId}
      data-room-avoid
      data-room-preview={stop}
      data-visible={active || undefined}
      // Hidden cards keep their layout for the fade, but never take focus or reach screen readers.
      inert={!active}
    >
      <p className={styles.eyebrow}>{preview.eyebrow}</p>
      <h2 className={styles.title} id={headingId}>
        {preview.title}
      </h2>
      {preview.body}
      <div className={styles.actions}>
        <Link className={styles.cta} to={to} onClick={open}>
          <span>{preview.action}</span>
          <span aria-hidden="true">→</span>
        </Link>
        {onClose && (
          <button className={styles.close} type="button" onClick={onClose}>
            Back to the room
          </button>
        )}
      </div>
    </article>
  )
}
