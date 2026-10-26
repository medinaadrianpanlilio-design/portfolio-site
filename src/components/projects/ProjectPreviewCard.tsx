import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import type { Project } from '../../content/types'
import { StackPills } from '../ui/StackPills'
import styles from './ProjectPreviewCard.module.css'

type ProjectPreviewCardProps = {
  project: Project
}

export function ProjectPreviewCard({ project }: ProjectPreviewCardProps) {
  return (
    <Link
      className={styles.card}
      to={`/projects/${project.slug}`}
      style={
        {
          '--project': project.color,
          '--soft': project.soft,
        } as CSSProperties
      }
    >
      <span className="sr-only">View {project.name} project. </span>
      <div className={styles.top}>
        <span className={styles.clientLabel}>
          <span className={styles.clientDot} aria-hidden="true" />
          {project.client}
        </span>
        <span className="label">{project.year}</span>
      </div>

      <span className={`${styles.wordmark} display`}>{project.displayName}</span>
      <span className={styles.subtitle}>{project.subtitle}</span>
      <StackPills items={project.stack} className={styles.pills} />

      <div className={`${styles.visual} ${styles[project.image.mode]}`}>
        <div className={styles.frame}>
          <img
            src={project.image.src}
            srcSet={project.image.srcSet}
            sizes="(max-width: 900px) 90vw, 44vw"
            alt={project.image.alt}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <span className={styles.more}>
        <span>View project</span>
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  )
}
