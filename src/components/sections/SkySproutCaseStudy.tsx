import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

import { skySprout } from '../../content/skysprout'
import { ArrowLink } from '../ui/ArrowLink'
import { EngineeringNotes } from '../skysprout/EngineeringNotes'
import { LoopDiagram } from '../skysprout/LoopDiagram'
import { MeasurementPlan } from '../skysprout/MeasurementPlan'
import { RetentionPanels } from '../skysprout/RetentionPanels'
import styles from './SkySproutCaseStudy.module.css'

export function SkySproutCaseStudy() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const mediaY = useTransform(scrollYProgress, [0, 1], [-12, 12])

  return (
    <section
      ref={sectionRef}
      id="work"
      className={styles.section}
      aria-labelledby="skysprout-title"
    >
      <div className={`page ${styles.intro}`}>
        <div className={styles.heading}>
          <div className={styles.identity}>
            <img
              className={styles.icon}
              src="/images/skysprout-icon-256.webp"
              alt="SkySprout game icon"
              width={72}
              height={72}
              loading="lazy"
              decoding="async"
            />
            <div>
              <h2 id="skysprout-title" className={styles.title}>
                SkySprout
              </h2>
              <p className={styles.tagline}>{skySprout.tagline}</p>
            </div>
          </div>

          <div className={styles.meta}>
            <p>{skySprout.meta}</p>
            <p>{skySprout.proof}</p>
            <p>
              Live on Roblox as <strong>BretRackstar</strong>.
            </p>
            <ArrowLink href={skySprout.liveUrl} external variant="solid">
              Play on Roblox
            </ArrowLink>
          </div>
        </div>
      </div>

      <motion.figure
        className={styles.media}
        style={reduceMotion ? undefined : { y: mediaY }}
      >
        <img
          src="/images/skysprout-garden-1600.webp"
          srcSet="/images/skysprout-garden-800.webp 800w, /images/skysprout-garden-1600.webp 1600w"
          sizes="100vw"
          alt="The SkySprout garden at late game, with ripe crops and a weather card counting down."
          width={1919}
          height={1078}
          loading="lazy"
          decoding="async"
        />
        <figcaption className={styles.caption}>
          <span className={styles.captionText}>
            Late-game playtest save. The HUD is counting down to a Snow &amp;
            Frost Wind event.
          </span>
        </figcaption>
      </motion.figure>

      <div className={`page ${styles.body}`}>
        <LoopDiagram steps={skySprout.loop} />
        <RetentionPanels
          panels={skySprout.retention}
          tutorialSteps={skySprout.tutorialSteps}
          weatherEvents={skySprout.weatherEvents}
          goldenMutation={skySprout.goldenMutation}
        />
        <EngineeringNotes notes={skySprout.engineering} />
        <MeasurementPlan metrics={skySprout.measurements} />
      </div>
    </section>
  )
}
