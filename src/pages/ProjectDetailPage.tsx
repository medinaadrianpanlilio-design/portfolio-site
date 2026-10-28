import type { CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { CtaLink } from '../components/ui/CtaLink'
import { StackPills } from '../components/ui/StackPills'
import { getProject } from '../content/projects'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import styles from './ProjectDetailPage.module.css'

export function ProjectDetailPage() {
  const { slug } = useParams()
  const project = slug ? getProject(slug) : undefined
  useDocumentTitle(project?.name ?? 'Project not found')

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  const { caseStudy } = project
  const style = {
    '--project': project.color,
    '--soft': project.soft,
  } as CSSProperties

  return (
    <main style={style}>
      <header className={styles.hero}>
        <div className={`page ${styles.heroInner}`}>
          <Link className={styles.back} to="/projects">
            <span aria-hidden="true">←</span> All projects
          </Link>

          <div className={styles.heroTop}>
            <span className="label">{project.client}</span>
            <span className="label">{project.year}</span>
          </div>

          <h1 className={`${styles.heroTitle} display`}>
            {project.displayName}
          </h1>
          <p className={styles.heroSubtitle}>{project.subtitle}</p>
          <StackPills items={project.stack} className={styles.heroPills} />
        </div>
      </header>

      <article className={`page ${styles.case}`}>
        <div className={styles.caseInner}>
          <p className="label">
            {project.hobby ? 'Hobby project' : 'Featured project'}
          </p>
          <h2 className={`${styles.caseTitle} display`}>{project.name}</h2>
          <p className={styles.caseLead}>{caseStudy.lead}</p>

          <dl className={styles.metaGrid}>
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>{project.focus}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{project.stack.join(' · ')}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
          </dl>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>The problem</h3>
            <div className={styles.sectionBody}>
              <p>{caseStudy.problem}</p>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>What I built</h3>
            <div className={styles.sectionBody}>
              <ul className={styles.list}>
                {caseStudy.built.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Technical decisions</h3>
            <div className={styles.sectionBody}>
              <div className={styles.decisions}>
                {caseStudy.decisions.map((decision) => (
                  <div className={styles.decision} key={decision.title}>
                    <h4>{decision.title}</h4>
                    <p>{decision.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>What I’d improve</h3>
            <div className={styles.sectionBody}>
              <ul className={styles.list}>
                {caseStudy.improve.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {caseStudy.screens.map((screen) => (
            <figure
              className={`${styles.figure} ${styles[project.image.mode]}`}
              key={screen.src}
            >
              <div className={styles.figureFrame}>
                <img
                  src={screen.src}
                  srcSet={screen.srcSet}
                  sizes="(max-width: 900px) 90vw, 50rem"
                  alt={screen.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>{screen.caption}</figcaption>
            </figure>
          ))}

          <div className={styles.links}>
            {project.links.map((link, index) => (
              <CtaLink
                href={link.href}
                external
                key={link.href}
                variant={index === 0 ? 'solid' : 'ghost'}
              >
                {link.label}
              </CtaLink>
            ))}
          </div>

          {project.note ? <p className={styles.note}>{project.note}</p> : null}
        </div>
      </article>
    </main>
  )
}
