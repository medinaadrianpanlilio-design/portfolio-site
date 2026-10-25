import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'

import { site } from '../../content/site'
import { ArrowLink } from '../ui/ArrowLink'
import { IslandStage } from './IslandStage'
import styles from './Hero.module.css'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -48])

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={`page ${styles.inner}`}>
        <motion.div
          className={styles.copy}
          style={reduceMotion ? undefined : { y: copyY }}
        >
          <h1 id="hero-title">Adrian Medina</h1>
          <p className={styles.lead}>I build systems that feel alive.</p>
          <p className={styles.support}>
            CS student, interface builder, and the maker of SkySprout.
            SkySprout is live on Roblox.
          </p>
          <div className={styles.actions}>
            <ArrowLink href={site.skySproutUrl} external variant="solid">
              Play SkySprout
            </ArrowLink>
            <ArrowLink href="#work">See the work</ArrowLink>
          </div>
        </motion.div>

        <div className={styles.stage}>
          <IslandStage scrollProgress={scrollYProgress} />
        </div>
      </div>

      <a className={styles.scrollCue} href="#work">
        Scroll to the work <span aria-hidden="true">↓</span>
      </a>
    </section>
  )
}
