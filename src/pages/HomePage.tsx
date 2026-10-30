import { AiGuide } from '../components/ai/AiGuide'
import { RightNow } from '../components/home/RightNow'
import { WorkCards } from '../components/home/WorkCards'
import { RoomHero } from '../components/room/RoomHero'
import { CopyEmail } from '../components/ui/CopyEmail'
import { CtaLink } from '../components/ui/CtaLink'
import { StackTiles } from '../components/ui/StackTiles'
import { about } from '../content/about'
import { site } from '../content/site'
import { usePageTitle } from '../hooks/useDocumentTitle'
import styles from './HomePage.module.css'

export function HomePage() {
  usePageTitle('Adrian Medina — Software Engineer')

  return (
    <main className={styles.home}>
      <RoomHero />

      <section className={styles.hero} aria-labelledby="home-title">
        <div className={`page ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <div className={styles.heroMeta}>
              <p className="label">{site.name}</p>
              <p className="label">Software engineer in progress</p>
            </div>

            <h1
              className={`${styles.heroTitle} display`}
              id="home-title"
              tabIndex={-1}
            >
              <span className="sr-only">{site.name} — </span>
              <span>Software.</span>{' '}
              <span>Systems.</span>{' '}
              <span>AI.</span>
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

          <RightNow />
        </div>
      </section>

      <section
        className={styles.aboutSection}
        id="about"
        aria-labelledby="about-heading"
      >
        <div className="page">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutPhotoCard}>
              <div className={styles.photoFrame}>
                <img
                  src="/images/adrian-medina.jpg"
                  alt="Adrian Alexander Medina — Fourth-year Computer Science student and Software Engineer"
                  className={styles.portrait}
                  width="480"
                  height="480"
                  loading="lazy"
                />
                <div className={styles.photoBadge}>
                  <span className={styles.badgeDot} aria-hidden="true" />
                  <span>Dean’s Lister · 1st–3rd Year</span>
                </div>
              </div>
              <div className={styles.photoCaption}>
                <span className={styles.captionName}>Adrian Alexander Medina</span>
                <span className={styles.captionSchool}>Pampanga State University · Class of 2027</span>
              </div>
            </div>

            <div className={styles.aboutContent}>
              <p className="label">About Me</p>
              <h2 className={`${styles.aboutTitle} display`} id="about-heading">
                Engineering with intent.
              </h2>
              <p className={styles.aboutLead}>
                {about.intro}
              </p>
              <p className={styles.aboutBody}>
                {about.second}
              </p>

              <div className={styles.factsGrid}>
                <div className={styles.fact}>
                  <span className="label">Status</span>
                  <p className={styles.factVal}>4th Year CS Student</p>
                </div>
                <div className={styles.fact}>
                  <span className="label">University</span>
                  <p className={styles.factVal}>Pampanga State University</p>
                </div>
                <div className={styles.fact}>
                  <span className="label">Academic Rank</span>
                  <p className={styles.factVal}>Dean’s Lister (1st–3rd Year)</p>
                </div>
                <div className={styles.fact}>
                  <span className="label">Looking For</span>
                  <p className={styles.factVal}>2026–2027 Software Internship</p>
                </div>
              </div>

              <div className={styles.aboutActions}>
                <CtaLink to="/about">More about background & skills</CtaLink>
                <a className={styles.heroLink} href="#contact">
                  Get in touch
                </a>
              </div>
            </div>
          </div>
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

          <WorkCards />
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
            <CopyEmail email={site.email} />
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
