import { iahbrary } from '../../content/iahbrary'
import { ArrowLink } from '../ui/ArrowLink'
import styles from './IahbraryCaseStudy.module.css'

export function IahbraryCaseStudy() {
  return (
    <section
      id="iahbrary"
      className={styles.section}
      aria-labelledby="iahbrary-title"
    >
      <div className={`page ${styles.grid}`}>
        <div className={styles.text}>
          <p className={styles.kicker}>The public code sample</p>
          <h2 id="iahbrary-title" className={styles.title}>
            Iahbrary
          </h2>
          <p className={styles.tagline}>{iahbrary.tagline}</p>
          <p className={styles.description}>{iahbrary.description}</p>

          <ul className={styles.notes} aria-label="Iahbrary engineering notes">
            {iahbrary.notes.map((note) => (
              <li className={styles.note} key={note}>
                {note}
              </li>
            ))}
          </ul>

          <div className={styles.action}>
            <ArrowLink href={iahbrary.repoUrl} external>
              View the code
            </ArrowLink>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.phonePanel}>
            <figure className={styles.phone}>
              <img
                src={iahbrary.image}
                srcSet="/images/iahbrary-home-360.webp 360w, /images/iahbrary-home-720.webp 720w"
                sizes="(max-width: 900px) 70vw, 320px"
                alt={iahbrary.imageAlt}
                width={924}
                height={2000}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
          <p className={styles.visualCaption}>
            The reading screen after a session. The public repository is a
            sanitized copy.
          </p>
        </div>
      </div>
    </section>
  )
}
