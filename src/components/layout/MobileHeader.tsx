import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { isNavActive, navigation } from '../../content/navigation'
import { site } from '../../content/site'
import styles from './MobileHeader.module.css'

export function MobileHeader() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={styles.header}>
      <Link className={styles.wordmark} to="/" aria-label="Adrian Medina — home">
        Adrian
      </Link>
      <button
        className={styles.menuButton}
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className={open ? styles.lineOpen : ''} />
        <span className={open ? styles.lineOpen : ''} />
      </button>

      {open ? (
        <div className={styles.menu} id="mobile-menu">
          <nav aria-label="Mobile">
            {navigation.map((item) => {
              const active = isNavActive(item.to, pathname, hash)
              return (
                <Link
                  className={`${styles.menuLink} ${
                    active ? styles.menuLinkActive : ''
                  }`}
                  to={item.to}
                  key={item.label}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className={styles.menuFooter}>
            <p className={styles.menuNote}>Software, systems, and AI integrations.</p>
            <div className={styles.menuSocials}>
              <a href={site.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href={site.github} target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a href={`mailto:${site.email}`}>Email</a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
