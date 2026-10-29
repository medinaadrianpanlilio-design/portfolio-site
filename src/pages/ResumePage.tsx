import { about } from '../content/about'
import { allProjects } from '../content/projects'
import { site } from '../content/site'
import { usePageTitle } from '../hooks/useDocumentTitle'
import styles from './ResumePage.module.css'

const bareUrl = (href: string) => href.replace(/^https:\/\/(www\.)?/, '')

export function ResumePage() {
  usePageTitle('Adrian Medina — Resume')

  return (
    <main className={styles.resume}>
      <header className={styles.header}>
        <h1 className={styles.name}>{site.fullName}</h1>
        <p className={styles.role}>{site.role}</p>
        <p className={styles.contact}>
          <span>{site.location}</span>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.linkedin}>{bareUrl(site.linkedin)}</a>
          <a href={site.github}>{bareUrl(site.github)}</a>
        </p>
      </header>

      <section className={styles.section} aria-labelledby="resume-summary">
        <h2 id="resume-summary">Summary</h2>
        <p>
          {about.intro} {about.availability}
        </p>
      </section>

      <section className={styles.section} aria-labelledby="resume-skills">
        <h2 id="resume-skills">Skills</h2>
        <ul className={styles.skills}>
          {about.skills.map((group) => (
            <li key={group.label}>
              <strong>{group.label}:</strong> {group.items.join(', ')}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="resume-projects">
        <h2 id="resume-projects">Projects</h2>
        {allProjects.map((project) => {
          const headingId = `resume-project-${project.slug}`
          return (
            <article
              className={styles.project}
              key={project.slug}
              aria-labelledby={headingId}
            >
              <div className={styles.projectHead}>
                <h3 id={headingId}>
                  {project.name} — {project.subtitle}
                </h3>
                {project.hobby && <span className={styles.tag}>Hobby</span>}
              </div>
              <p className={styles.meta}>
                {project.role} · {project.stack.join(', ')} · {project.year} ·{' '}
                <a href={project.links[0].href}>{bareUrl(project.links[0].href)}</a>
              </p>
              <ul>
                {project.caseStudy.built.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          )
        })}
      </section>

      <section className={styles.section} aria-labelledby="resume-education">
        <h2 id="resume-education">Education</h2>
        <p>{about.education}</p>
      </section>

      <section className={styles.section} aria-labelledby="resume-experience">
        <h2 id="resume-experience">Experience</h2>
        {about.experience.map((entry) => (
          <p key={entry.title}>
            <strong>
              {entry.title} — {entry.org}
            </strong>{' '}
            ({entry.period}). {entry.body}
          </p>
        ))}
      </section>
    </main>
  )
}
