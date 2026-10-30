import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { PageTransitionProvider } from './PageTransition'
import { SiteFooter } from './SiteFooter'
import { SiteDock } from './SiteDock'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const node = document.getElementById(id)
      if (node) {
        window.requestAnimationFrame(() => {
          node.scrollIntoView({ behavior: 'auto', block: 'start' })
        })
        return
      }
    }
    // Instant: a new page starts at the top, not after a smooth scroll up the old one.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

export function SiteShell() {
  const location = useLocation()

  return (
    <PageTransitionProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollManager />
      <div className="site-content">
        <div className="site-main" id="main" key={location.pathname}>
          <Outlet />
        </div>
        <SiteFooter />
      </div>
      <SiteDock />
    </PageTransitionProvider>
  )
}
