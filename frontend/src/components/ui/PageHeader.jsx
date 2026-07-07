import { motion } from "framer-motion";
import styles from "./PageHeader.module.css";

export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <motion.div
      className={styles.wrap}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.desc}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </motion.div>
  );
}
