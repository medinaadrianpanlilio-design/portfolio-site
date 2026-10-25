import { site } from '../../content/site'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`page ${styles.inner}`}>
        <a
          className={styles.wordmark}
          href="#top"
          aria-label={`${site.name} — back to top`}
        >
          {site.name}
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {site.nav.map((item) => (
              <li key={item.href}>
                <a className={styles.navLink} href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          className={styles.cta}
          href={site.skySproutUrl}
          target="_blank"
          rel="noreferrer"
        >
          Play SkySprout
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  )
}
