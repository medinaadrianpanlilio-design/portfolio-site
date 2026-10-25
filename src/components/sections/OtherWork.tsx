import { otherWork } from '../../content/otherWork'
import { ArrowLink } from '../ui/ArrowLink'
import styles from './OtherWork.module.css'

export function OtherWork() {
  const healthyaSat = otherWork.find((item) => item.name === 'HealthyaSat')
  const magilas = otherWork.find((item) => item.name === 'Magilas Gym')

  if (!healthyaSat || !magilas) return null

  return (
    <section
      id="other-work"
      className={styles.section}
      aria-labelledby="other-work-title"
    >
      <div className={`page ${styles.header}`}>
        <h2 id="other-work-title">Other work</h2>
        <p className={styles.lead}>
          Two live products, two different constraints.
        </p>
      </div>

      <div className={`page ${styles.grid}`}>
        <article className={styles.healthya}>
          <div className={styles.healthyaCopy}>
            <h3 className={styles.title}>HealthyaSat</h3>
            <p className={styles.tagline}>{healthyaSat.tagline}</p>
            <p className={styles.body}>{healthyaSat.body}</p>
            <p className={styles.role}>
              Role: {healthyaSat.role}. Stack: {healthyaSat.stack}.
            </p>
            <ArrowLink href={healthyaSat.link} external>
              Visit HealthyaSat
            </ArrowLink>
          </div>

          <figure className={styles.healthyaMedia}>
            <img
              src={healthyaSat.image}
              srcSet="/images/healthyaSat-extension-600.webp 600w, /images/healthyaSat-extension-843.webp 843w"
              sizes="(max-width: 900px) 88vw, 32vw"
              alt={healthyaSat.imageAlt}
              width={843}
              height={533}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              The extension over a Balita health article, with a selected claim.
            </figcaption>
          </figure>
        </article>

        <article className={styles.magilas}>
          <h3 className={styles.gymMark} aria-label="Magilas Gym">
            <span>Magilas</span>
            <span>Gym</span>
          </h3>
          <p className={styles.tagline}>{magilas.tagline}</p>
          <p className={styles.body}>{magilas.body}</p>
          <p className={styles.role}>
            Role: {magilas.role}. Stack: {magilas.stack}.
          </p>
          <p className={styles.note}>
            The public site is the gym. The management system sits behind the
            staff portal.
          </p>
          <div className={styles.actions}>
            <ArrowLink href={magilas.link} external>
              Visit the gym
            </ArrowLink>
            {magilas.staffLink ? (
              <a
                className={styles.secondary}
                href={magilas.staffLink}
                target="_blank"
                rel="noreferrer"
              >
                Staff portal
              </a>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  )
}
