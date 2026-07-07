import { motion } from "framer-motion";
import styles from "./StatCard.module.css";

export default function StatCard({ label, value, icon, accent = "brass", index = 0 }) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <div className={[styles.icon, styles[accent]].join(" ")}>{icon}</div>
      <div>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </motion.div>
  );
}
