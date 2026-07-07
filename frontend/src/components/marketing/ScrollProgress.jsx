import { motion, useScroll, useSpring } from "framer-motion";
import styles from "./ScrollProgress.module.css";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 32, mass: 0.3 });

  return <motion.div className={styles.bar} style={{ scaleX }} aria-hidden="true" />;
}
