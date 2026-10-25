import type { ReactNode } from 'react'

import styles from './ArrowLink.module.css'

type ArrowLinkProps = {
  href: string
  children: ReactNode
  external?: boolean
  variant?: 'text' | 'solid'
}

export function ArrowLink({
  href,
  children,
  external = false,
  variant = 'text',
}: ArrowLinkProps) {
  const externalProps = external
    ? { target: '_blank', rel: 'noreferrer' }
    : {}

  return (
    <a
      className={`${styles.link} ${variant === 'solid' ? styles.solid : styles.text}`}
      href={href}
      {...externalProps}
    >
      <span>{children}</span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </a>
  )
}
