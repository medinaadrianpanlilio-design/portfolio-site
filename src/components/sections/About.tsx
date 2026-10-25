import { about } from '../../content/about'
import { site } from '../../content/site'
import styles from './About.module.css'

export function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={`page ${styles.grid}`}>
        <div className={styles.main}>
          <h2 id="about-title">About</h2>
          <p className={styles.intro}>{about.intro}</p>
          <p className={styles.second}>{about.second}</p>
          <p className={styles.open}>Open to software engineering internships.</p>
        </div>

        <aside className={styles.details} aria-label="Education and skills">
          <div className={styles.detail}>
            <h3 className={styles.label}>Education</h3>
            <p>{about.education}</p>
          </div>

          <div className={styles.detail}>
            <h3 className={styles.label}>Skills</h3>
            <ul className={styles.skills}>
              {about.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>

          <p className={styles.location}>{site.location}</p>
        </aside>
      </div>
    </section>
  )
}
