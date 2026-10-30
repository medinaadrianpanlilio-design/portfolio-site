import { Fragment, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import { featuredProjects } from '../../content/projects'
import { site } from '../../content/site'
import styles from './WorkCards.module.css'

const BUILD_TOGETHER_HREF = `mailto:${site.email}?subject=${encodeURIComponent("Let's build a project together")}&body=${encodeURIComponent('Hi Adrian, I have a project idea: ')}`

export function WorkCards() {
  return (
    <ul className={styles.row}>
      {featuredProjects.map((project) => (
        <li className={styles.item} key={project.slug}>
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
            <img
              className={`${styles.shot} ${project.image.mode === 'phone' ? styles.phone : ''}`}
              src={project.image.src}
              srcSet={project.image.srcSet}
              sizes="(max-width: 900px) 80vw, 25vw"
              alt={project.image.alt}
              loading="lazy"
              decoding="async"
            />
            <span className={`${styles.name} display`}>{project.displayName}</span>
            <span className={styles.tagline}>{project.tagline}</span>
            <span className={styles.flow}>
              {project.flow.map((step, i) => (
                <Fragment key={step}>
                  {i > 0 && (
                    <span className={styles.arrow} aria-hidden="true">
                      →
                    </span>
                  )}
                  <span className={styles.pill}>{step}</span>
                </Fragment>
              ))}
            </span>
            <span className={styles.more}>
              View <span aria-hidden="true">→</span>
            </span>
          </Link>
        </li>
      ))}
      <li className={styles.item}>
        <div className={`${styles.card} ${styles.build}`}>
          <span className={styles.plus} aria-hidden="true">
            +
          </span>
          <span className={styles.eyebrow}>Your project?</span>
          <h3 className={styles.buildTitle}>Add another project.</h3>
          <a className={styles.buildBtn} href={BUILD_TOGETHER_HREF}>
            Let’s build together <span aria-hidden="true">→</span>
          </a>
        </div>
      </li>
    </ul>
  )
}
