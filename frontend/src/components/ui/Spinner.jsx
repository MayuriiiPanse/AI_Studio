import styles from "./Spinner.module.css";

export default function Spinner({ size = 20, label }) {
  return (
    <span className={styles.wrap} role="status" aria-live="polite">
      <span className={styles.ring} style={{ width: size, height: size }} />
      {label && <span className={styles.label}>{label}</span>}
    </span>
  );
}
