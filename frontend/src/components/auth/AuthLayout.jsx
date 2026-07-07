import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "../layout/Logo";
import styles from "./AuthLayout.module.css";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <div className={styles.grain} />
        <Link to="/" className={styles.logoLink}>
          <Logo tone="inverted" />
        </Link>
        <div className={styles.panelCopy}>
          <span className={styles.eyebrow}>The content darkroom</span>
          <h2>One take in.<br />Every format out.</h2>
          <p>Captions, posters, voice-overs and reel scripts — developed from a single upload, in your brand's voice.</p>
        </div>
      </div>

      <div className={styles.formSide}>
        <Link to="/" className={styles.mobileLogo}>
          <Logo />
        </Link>
        <motion.div
          className={styles.formCard}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {children}
        </motion.div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
