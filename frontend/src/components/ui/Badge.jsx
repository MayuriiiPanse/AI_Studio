import styles from "./Badge.module.css";

export default function Badge({ children, tone = "default", className = "" }) {
  return <span className={[styles.badge, styles[tone], className].join(" ").trim()}>{children}</span>;
}
