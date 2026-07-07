import { ArrowUp } from "lucide-react";
import Logo from "./Logo";
import styles from "./Footer.module.css";

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className={styles.footer}>
      <span className={styles.hairline} aria-hidden="true" />
      <div className={[styles.inner, "container"].join(" ")}>
        <div className={styles.brandCol}>
          <Logo />
          <p className={styles.tagline}>One take in. Every format out.</p>
        </div>
        <div className={styles.cols}>
          <div className={styles.col}>
            <span className={styles.colTitle}>Product</span>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className={styles.col}>
            <span className={styles.colTitle}>Studio</span>
            <a href="/register">Create account</a>
            <a href="/login">Sign in</a>
          </div>
        </div>
      </div>
      <div className={[styles.bottom, "container"].join(" ")}>
        <span>© {new Date().getFullYear()} Reelcraft Studio.</span>
        <span className={styles.mono}>Built for creators who ship daily.</span>
        <button className={styles.toTop} onClick={scrollTop} aria-label="Back to top">
          <ArrowUp size={15} strokeWidth={2.2} />
        </button>
      </div>
    </footer>
  );
}
