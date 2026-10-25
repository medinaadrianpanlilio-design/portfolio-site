import { site } from '../../content/site'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`page ${styles.inner}`}>
        <div className={styles.identity}>
          <p className={styles.name}>{site.name}</p>
          <div className={styles.links}>
            <a className={styles.link} href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <a
              className={styles.link}
              href={site.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className={styles.meta}>
          <p className={styles.note}>
            Built with React, Three.js, and a lot of small fixes.
          </p>
          <a
            className={styles.link}
            href={site.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Site source
          </a>
          <p className={styles.copyright}>© 2026 Adrian Medina</p>
        </div>
      </div>
    </footer>
  )
}
