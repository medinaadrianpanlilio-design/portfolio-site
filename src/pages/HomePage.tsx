import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import { AiGuide } from '../components/ai/AiGuide'
import { CtaLink } from '../components/ui/CtaLink'
import { StackTiles } from '../components/ui/StackTiles'
import { about } from '../content/about'
import { projects } from '../content/projects'
import { site } from '../content/site'
import { usePageTitle } from '../hooks/useDocumentTitle'
import styles from './HomePage.module.css'

export function HomePage() {
  usePageTitle('Adrian Medina — Software Engineer')

  return (
    <main className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={`page ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <div className={styles.heroMeta}>
              <p className="label">{site.name}</p>
              <p className="label">Software engineer in progress</p>
            </div>

            <h1 className={`${styles.heroTitle} display`} id="home-title">
              <span className="sr-only">{site.name} — </span>
              <span>Backend,</span>{' '}
              <span>web,</span>{' '}
              <span>mobile.</span>
            </h1>

            <p className={styles.heroLead}>{about.intro}</p>
            <p className={styles.heroSub}>{about.second}</p>

            <div className={styles.heroActions}>
              <CtaLink to="/projects">View projects</CtaLink>
              <a
                className={styles.heroLink}
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.heroLink} href={`mailto:${site.email}`}>
                Email
              </a>
            </div>
          </div>

          <aside className={styles.glance} aria-label="At a glance">
            <p className="label">At a glance</p>
            <dl>
              <div>
                <dt>Studying</dt>
                <dd>{about.educationShort}</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Backend, data, and mobile systems.</dd>
              </div>
              <div>
                <dt>Open to</dt>
                <dd>{about.availabilityShort}</dd>
              </div>
            </dl>
            <p className={styles.glanceLocation}>
              Based in {site.location}
            </p>
          </aside>
        </div>
      </section>

      <section
        className={styles.skills}
        id="skills"
        aria-labelledby="skills-heading"
      >
        <div className="page">
          <div className={styles.sectionHead}>
            <p className="label">Skills</p>
            <h2
              className={`${styles.sectionTitle} display`}
              id="skills-heading"
            >
              What I work with.
            </h2>
            <p className={styles.sectionLead}>
              The parts of the stack I reach for when an idea has to become a
              working system.
            </p>
          </div>

          <div className={styles.capabilities}>
            {about.capabilities.map((capability, index) => (
              <article className={styles.capability} key={capability.title}>
                <p className={`label ${styles.capabilityIndex}`}>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
              </article>
            ))}
          </div>

          <div className={styles.stack} id="stack">
            <div className={styles.stackHead}>
              <p className="label">Stack</p>
              <h3 className={`${styles.stackTitle} display`}>
                Tools in the kit.
              </h3>
            </div>

            <StackTiles />
          </div>
        </div>
      </section>

      <section
        className={styles.work}
        aria-labelledby="selected-work-heading"
      >
        <div className="page">
          <div className={styles.workHead}>
            <div>
              <p className="label">Selected work</p>
              <h2
                className={`${styles.sectionTitle} display`}
                id="selected-work-heading"
              >
                A few things I’ve built.
              </h2>
            </div>
            <CtaLink to="/projects" variant="ghost">
              All projects
            </CtaLink>
          </div>

          <div className={styles.workList}>
            {projects.map((project, index) => (
              <Link
                className={styles.workRow}
                key={project.slug}
                to={`/projects/${project.slug}`}
                style={
                  {
                    '--project': project.color,
                  } as CSSProperties
                }
              >
                <span className={`label ${styles.workIndex}`} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.workName}>{project.displayName}</span>{' '}
                <span className={styles.workRole}>{project.role}</span>
                <span className={styles.workArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AiGuide />

      <section
        className={styles.contact}
        id="contact"
        aria-labelledby="contact-heading"
      >
        <div className={`page ${styles.contactGrid}`}>
          <div>
            <p className="label">Contact</p>
            <h2
              className={`${styles.contactTitle} display`}
              id="contact-heading"
            >
              Let’s build something useful.
            </h2>
            <p className={styles.contactLead}>{about.availability}</p>
          </div>

          <div className={styles.contactBody}>
            <a className={styles.contactEmail} href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <div className={styles.socialLinks}>
              <a href={site.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href={site.github} target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a href={`mailto:${site.email}`}>Email</a>
            </div>
            <p className={styles.location}>{site.location}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
