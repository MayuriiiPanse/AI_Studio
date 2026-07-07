import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import GooeyBlobs from "./GooeyBlobs";
import useMagnetic from "../../hooks/useMagnetic";
import styles from "./PricingSection.module.css";

const INCLUDED = [
  "Unlimited image-to-content generations",
  "Poster lab + voice lab, no separate tools",
  "RAG-backed assistant with your own knowledge base",
  "Projects, history, and full edit access to every output",
];

export default function PricingSection() {
  const navigate = useNavigate();
  const cta = useMagnetic(8);

  return (
    <section id="pricing" className={["container", styles.section].join(" ")}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <GooeyBlobs variant="pricing" />
        <div className={styles.left}>
          <span className="eyebrow">One studio pass</span>
          <h2 className={styles.title}>Everything unlocked from the first upload.</h2>
          <p className={styles.sub}>
            No feature walls between rooms — the studio, the poster lab, the voice lab, and the
            assistant all come with one account.
          </p>
          <Button
            ref={cta.ref}
            onMouseMove={cta.onMouseMove}
            onMouseLeave={cta.onMouseLeave}
            size="lg"
            variant="gradient"
            onClick={() => navigate("/register")}
            iconRight={<ArrowRight size={16} />}
          >
            Create your account
          </Button>
        </div>
        <ul className={styles.list}>
          {INCLUDED.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <span className={styles.checkDot}>
                <Check size={14} strokeWidth={2.5} />
              </span>
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
