import { lazy, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import Button from "../ui/Button";
import FanDeck from "./FanDeck";
import GooeyBlobs from "./GooeyBlobs";
import useMagnetic from "../../hooks/useMagnetic";
import styles from "./Hero.module.css";

const Reel3D = lazy(() => import("./Reel3D"));

export default function Hero() {
  const navigate = useNavigate();
  const primary = useMagnetic(10);
  const secondary = useMagnetic(10);

  const { scrollY } = useScroll();
  const reelY = useTransform(scrollY, [0, 600], [0, 90]);
  const reelRotate = useTransform(scrollY, [0, 600], [4, 12]);

  return (
    <section className={styles.hero}>
      <GooeyBlobs variant="hero" />
      <div className={styles.grain} />
      <motion.div
        className={styles.reelWrap}
        aria-hidden="true"
        style={{ y: reelY, rotate: reelRotate }}
      >
        <div className={styles.reelFrame}>
          <span className={styles.reelTape} />
          <Suspense fallback={null}>
            <Reel3D />
          </Suspense>
        </div>
      </motion.div>

      <div className={["container", styles.inner].join(" ")}>
        <motion.div
          className={styles.copy}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className={["eyebrow", styles.eyebrowPop].join(" ")}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            The content darkroom
          </motion.span>
          <h1 className={styles.title}>
            Drop in one take.
            <br />
            Walk out with a <span className={styles.italic}>full release.</span>
          </h1>
          <p className={styles.sub}>
            Reelcraft develops a single photo, prompt, or idea into captions, hashtags, a reel
            script, a print-ready poster, and a voiced narration — all tuned to your brand's voice,
            all in one pass.
          </p>
          <div className={styles.ctaRow}>
            <Button
              ref={primary.ref}
              onMouseMove={primary.onMouseMove}
              onMouseLeave={primary.onMouseLeave}
              size="lg"
              variant="gradient"
              onClick={() => navigate("/register")}
              iconRight={<ArrowRight size={16} />}
              className={styles.magnetic}
            >
              Start creating
            </Button>
            <Button
              ref={secondary.ref}
              onMouseMove={secondary.onMouseMove}
              onMouseLeave={secondary.onMouseLeave}
              size="lg"
              variant="secondary"
              onClick={() => navigate("/login")}
              icon={<PlayCircle size={16} />}
              className={styles.magnetic}
            >
              Sign in
            </Button>
          </div>
          <div className={styles.stats}>
            {[
              ["7", "formats per upload"],
              ["1", "brand memory, everywhere"],
              ["<60s", "from take to release"],
            ].map(([n, l], i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
              >
                <strong>{n}</strong>
                <span>{l}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <FanDeck />
        </motion.div>
      </div>
    </section>
  );
}
