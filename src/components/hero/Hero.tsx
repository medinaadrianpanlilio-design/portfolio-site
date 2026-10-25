import { useRef } from 'react'
import { useScroll } from 'framer-motion'

import { site } from '../../content/site'
import { ArrowLink } from '../ui/ArrowLink'
import { IslandStage } from './IslandStage'
import styles from './Hero.module.css'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={`page ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.kicker}>{site.fullName}</p>
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
        </div>

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
