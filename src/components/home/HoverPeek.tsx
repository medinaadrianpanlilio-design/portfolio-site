import styles from './HoverPeek.module.css';

interface HoverPeekProps {
  activeImage: string;
  activeTitle: string;
  x: number;
  y: number;
  isVisible: boolean;
}

export function HoverPeek({ activeImage, activeTitle, x, y, isVisible }: HoverPeekProps) {
  // Offset the card slightly from the cursor so the cursor never obscures it
  const style: React.CSSProperties = {
    transform: `translate3d(${x + 24}px, ${y - 80}px, 0)`,
  };

  return (
    <div
      className={`${styles.peekWrap} ${isVisible ? styles.visible : styles.hidden}`}
      style={style}
      aria-hidden={!isVisible}
    >
      {activeImage && (
        <div className={styles.card}>
          <img
            src={activeImage}
            alt={`Preview of ${activeTitle}`}
            className={styles.img}
            loading="lazy"
          />
          <div className={styles.caption}>
            <span className={styles.captionTitle}>{activeTitle}</span>
            <span className={styles.captionHint}>Click to view →</span>
          </div>
        </div>
      )}
    </div>
  );
}
