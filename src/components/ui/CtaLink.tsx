import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import styles from './CtaLink.module.css'

type CtaLinkProps = {
  to?: string
  href?: string
  children: ReactNode
  external?: boolean
  variant?: 'solid' | 'ghost'
}

export function CtaLink({
  to,
  href,
  children,
  external = false,
  variant = 'solid',
}: CtaLinkProps) {
  const className = `${styles.cta} ${variant === 'ghost' ? styles.ghost : styles.solid}`
  const content = (
    <>
      <span>{children}</span>
      <span className={styles.arrow} aria-hidden="true">
        {external ? '↗' : '→'}
      </span>
    </>
  )

  if (to) {
    return (
      <Link className={className} to={to}>
        {content}
      </Link>
    )
  }

  return (
    <a
      className={className}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      {content}
    </a>
  )
}
