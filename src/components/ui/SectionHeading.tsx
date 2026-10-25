import type { ReactNode } from 'react'

import styles from './SectionHeading.module.css'

type SectionHeadingProps = {
  id?: string
  children: ReactNode
  lead?: string
}

export function SectionHeading({ id, children, lead }: SectionHeadingProps) {
  return (
    <div className={styles.heading}>
      <h2 id={id}>{children}</h2>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </div>
  )
}
