import { Link, useLocation } from 'react-router-dom'

import { isNavActive, navigation } from '../../content/navigation'
import { site } from '../../content/site'
import styles from './SiteRail.module.css'

export function SiteRail() {
  const { pathname, hash } = useLocation()

  return (
    <aside className={styles.rail} aria-label="Site">
      <Link className={styles.brand} to="/" aria-label={`${site.name} — home`}>
        <span>Adrian</span>
      </Link>

      <nav className={styles.nav} aria-label="Primary">
        {navigation.map((item) => {
          const active = isNavActive(item.to, pathname, hash)
          return (
            <Link
              className={`${styles.link} ${active ? styles.active : ''}`}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              key={item.label}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <a
        className={styles.bottom}
        href={site.linkedin}
        target="_blank"
        rel="noreferrer"
      >
        LinkedIn
      </a>
    </aside>
  )
}
