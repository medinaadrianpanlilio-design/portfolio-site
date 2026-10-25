import type { RetentionPanel, WeatherEvent } from '../../content/types'
import styles from './RetentionPanels.module.css'

type RetentionPanelsProps = {
  panels: readonly RetentionPanel[]
  tutorialSteps: readonly string[]
  weatherEvents: readonly WeatherEvent[]
  goldenMutation: string
}

export function RetentionPanels({
  panels,
  tutorialSteps,
  weatherEvents,
  goldenMutation,
}: RetentionPanelsProps) {
  const tutorial = panels.find((panel) => panel.id === 'tutorial')
  const offline = panels.find((panel) => panel.id === 'offline')
  const weather = panels.find((panel) => panel.id === 'weather')

  if (!tutorial || !offline || !weather) return null

  return (
    <div className={styles.block}>
      <h3 className={styles.heading}>Why players come back</h3>
      <p className={styles.intro}>
        Three loops, each doing a different job: teach the game, reward the
        return, and make the next harvest feel different.
      </p>

      <div className={styles.grid}>
        <article
          className={`${styles.panel} ${styles.tutorial}`}
          data-testid="retention-panel"
          data-variant="tutorial"
        >
          <div className={styles.panelCopy}>
            <h4 className={styles.title}>{tutorial.title}</h4>
            <p className={styles.body}>{tutorial.body}</p>
          </div>

          <div className={styles.tutorialStat}>
            <span className={styles.stat}>{tutorial.stat}</span>
            <span className={styles.statLabel}>{tutorial.statLabel}</span>
            <span className={styles.boost}>2:00 2×</span>
          </div>

          <ol className={styles.steps} aria-label="Tutorial steps">
            {tutorialSteps.map((step, index) => (
              <li className={styles.step} key={step}>
                <span>{step}</span>
                {index < tutorialSteps.length - 1 ? (
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </article>

        <article
          className={`${styles.panel} ${styles.offline}`}
          data-testid="retention-panel"
          data-variant="offline"
        >
          <div className={styles.panelCopy}>
            <h4 className={styles.title}>{offline.title}</h4>
            <p className={styles.body}>{offline.body}</p>
          </div>
          <div className={styles.offlineTop}>
            <span className={styles.stat}>{offline.stat}</span>
            <span className={styles.statLabel}>{offline.statLabel}</span>
          </div>
          <div className={styles.offlineArt} aria-hidden="true">
            <img
              src="/images/skysprout-icon-256.webp"
              alt=""
              width={72}
              height={72}
              loading="lazy"
              decoding="async"
            />
            <span>Grows offline</span>
          </div>
        </article>

        <article
          className={`${styles.panel} ${styles.weather}`}
          data-testid="retention-panel"
          data-variant="weather"
        >
          <div className={styles.weatherCopy}>
            <div className={styles.weatherHead}>
              <div>
                <h4 className={styles.title}>{weather.title}</h4>
                <p className={styles.body}>{weather.body}</p>
              </div>
              <div className={styles.weatherStat}>
                <span className={styles.stat}>{weather.stat}</span>
                <span className={styles.statLabel}>{weather.statLabel}</span>
              </div>
            </div>

            <div className={styles.cycle} aria-label="Weather mutation events">
              {weatherEvents.map((event) => (
                <div className={styles.event} key={event.name}>
                  <span className={styles.eventBar} aria-hidden="true" />
                  <span className={styles.multiplier}>{event.multiplier}</span>
                  <p className={styles.eventCopy}>
                    {event.name}: the {event.mutation} mutation.
                  </p>
                </div>
              ))}
              <div className={styles.golden}>
                <span className={styles.eventBar} aria-hidden="true" />
                <span className={styles.multiplier}>2×</span>
                <p className={styles.eventCopy}>
                  {goldenMutation} mutation, baseline.
                </p>
              </div>
            </div>
            <p className={styles.cycleNote}>
              Mutations stack. The weather is a shared event, not a per-player
              buff.
            </p>
          </div>

          <figure className={styles.weatherMedia}>
            <img
              src="/images/skysprout-weather-800.webp"
              alt="SkySprout HUD showing a calm sky and the next Snow & Frost Wind event."
              width={1919}
              height={1079}
              loading="lazy"
              decoding="async"
            />
            <figcaption>The live HUD, counting down between events.</figcaption>
          </figure>
        </article>
      </div>
    </div>
  )
}
