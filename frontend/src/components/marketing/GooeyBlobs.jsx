import styles from "./GooeyBlobs.module.css";

/**
 * Soft, morphing "lava lamp" blobs blended together with an SVG goo
 * filter. Purely decorative (aria-hidden) and disabled entirely under
 * prefers-reduced-motion via CSS. `variant` swaps the palette so the
 * same piece can sit behind the hero (jewel gradient) or the pricing
 * card (softer pastel wash) without extra markup.
 */
export default function GooeyBlobs({ variant = "hero", className = "" }) {
  return (
    <div className={[styles.wrap, styles[variant], className].join(" ")} aria-hidden="true">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="goo-filter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            result="goo"
          />
        </filter>
      </svg>
      <div className={styles.field}>
        <span className={[styles.blob, styles.b1].join(" ")} />
        <span className={[styles.blob, styles.b2].join(" ")} />
        <span className={[styles.blob, styles.b3].join(" ")} />
        <span className={[styles.blob, styles.b4].join(" ")} />
      </div>
    </div>
  );
}
