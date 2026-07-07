import styles from "./Logo.module.css";

export default function Logo({ size = 30, tone = "default" }) {
  const inverted = tone === "inverted";
  const ring = inverted ? "#221a0a" : "var(--brass)";
  const dot = inverted ? "#221a0a" : "var(--teal)";

  return (
    <span className={[styles.wrap, inverted ? styles.inverted : ""].join(" ")}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" stroke={ring} strokeWidth="2" />
        <circle cx="20" cy="20" r="11" stroke={ring} strokeWidth="2" />
        <circle cx="20" cy="20" r="3.4" fill={ring} />
        <circle cx="20" cy="5.5" r="2.1" fill={dot} />
        <circle cx="32.6" cy="27" r="2.1" fill={dot} />
        <circle cx="7.4" cy="27" r="2.1" fill={dot} />
      </svg>
      <span className={styles.word}>
        Reel<span className={inverted ? undefined : styles.accent}>craft</span>
      </span>
    </span>
  );
}
