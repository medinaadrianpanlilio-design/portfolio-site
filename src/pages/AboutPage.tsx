import { Link } from 'react-router-dom'

import { CopyEmail } from '../components/ui/CopyEmail'
import { CtaLink } from '../components/ui/CtaLink'
import { about } from '../content/about'
import { site } from '../content/site'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import styles from './AboutPage.module.css'

export function AboutPage() {
  useDocumentTitle('About')

  return (
    <main>
      <header className={styles.intro}>
        <div className="page">
          <p className="label">About</p>
          <h1 className={`${styles.title} display`}>{site.name}</h1>
          <p className={styles.lead}>{about.intro}</p>
          <p className={styles.secondary}>{about.second}</p>
          <CtaLink to="/projects" variant="ghost">
            See selected work
          </CtaLink>
        </div>
      </header>

      <section
        className={styles.section}
        id="skills"
        aria-labelledby="skills-title"
      >
        <div className={`page ${styles.split}`}>
          <div className={styles.sectionHead}>
            <p className="label">Skills</p>
            <h2 className={styles.sectionTitle} id="skills-title">
              What I work with
            </h2>
          </div>

          <div className={styles.skillsGrid}>
            {about.skills.map((group) => (
              <div className={styles.skillGroup} key={group.label}>
                <h3>{group.label}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={styles.section}
        id="education"
        aria-labelledby="education-title"
      >
        <div className={`page ${styles.split}`}>
          <div className={styles.sectionHead}>
            <p className="label">Education</p>
            <h2 className={styles.sectionTitle} id="education-title">
              Computer Science
            </h2>
          </div>
          <div className={styles.education}>
            <p>{about.education}</p>
            <p className={styles.educationNote}>
              Coursework in data structures, databases, software engineering, and
              web systems.
            </p>
          </div>
        </div>
      </section>

      <section
        className={styles.section}
        id="contact"
        aria-labelledby="contact-title"
      >
        <div className={`page ${styles.split}`}>
          <div className={styles.sectionHead}>
            <p className="label">Contact</p>
            <h2 className={styles.sectionTitle} id="contact-title">
              Let’s build something useful.
            </h2>
          </div>
          <div className={styles.contact}>
            <p className={styles.availability}>{about.availability}</p>
            <CopyEmail email={site.email} />
            <div className={styles.contactLinks}>
              <Link to="/projects">Projects</Link>
              <a href={site.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href={site.github} target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
            <p className={styles.location}>{site.location}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
