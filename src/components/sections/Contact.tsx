import { site } from '../../content/site'
import styles from './Contact.module.css'

export function Contact() {
  return (
    <section
      id="contact"
      className={styles.section}
      aria-labelledby="contact-title"
    >
      <div className={`page ${styles.inner}`}>
        <div>
          <h2 id="contact-title">Contact</h2>
          <p className={styles.lead}>
            The fastest way to reach me is email. I read everything.
          </p>
        </div>

        <div className={styles.links}>
          <a className={styles.email} href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a
            className={styles.github}
            href={site.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <p className={styles.location}>{site.location}</p>
        </div>
      </div>
    </section>
  )
}
