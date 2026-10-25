import styles from './IslandStage.module.css'

export function IslandFallback() {
  return (
    <figure className={styles.fallback} data-testid="island-fallback">
      <img
        className={styles.image}
        src="/images/skysprout-thumbnail-768.webp"
        srcSet="/images/skysprout-thumbnail-400.webp 400w, /images/skysprout-thumbnail-768.webp 768w"
        sizes="(max-width: 900px) 88vw, 44vw"
        alt="SkySprout’s floating garden island"
        width={768}
        height={432}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <figcaption className={styles.caption}>
        A late-game SkySprout island, captured in-game.
      </figcaption>
    </figure>
  )
}
