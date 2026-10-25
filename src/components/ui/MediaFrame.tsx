import styles from './MediaFrame.module.css'

type MediaFrameProps = {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  width: number
  height: number
  caption?: string
  className?: string
  priority?: boolean
}

export function MediaFrame({
  src,
  srcSet,
  sizes,
  alt,
  width,
  height,
  caption,
  className,
  priority = false,
}: MediaFrameProps) {
  return (
    <figure className={`${styles.frame} ${className ?? ''}`}>
      <img
        className={styles.image}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  )
}
