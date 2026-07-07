import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Hash, Mic, MessageSquareText, Image as ImageIcon, Clapperboard } from "lucide-react";
import styles from "./FanDeck.module.css";

const OUTPUTS = [
  { icon: Hash, label: "#morningritual", tag: "Hashtags", rot: -14, x: -128, y: 22, delay: 0.1, accent: "var(--teal)", tint: "var(--teal-tint)" },
  { icon: MessageSquareText, label: "“The light hits different.”", tag: "Caption", rot: -6, x: -46, y: -8, delay: 0.18, accent: "var(--brass)", tint: "var(--brass-tint)" },
  { icon: Clapperboard, label: "Scene 1 — slow pan…", tag: "Reel script", rot: 5, x: 44, y: -10, delay: 0.26, accent: "var(--sky)", tint: "var(--sky-tint)" },
  { icon: Mic, label: "0:14 — warm narration", tag: "Voice-over", rot: 14, x: 128, y: 18, delay: 0.34, accent: "var(--pink)", tint: "var(--pink-tint)" },
];

export default function FanDeck() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rX = useSpring(useTransform(my, [-40, 40], [8, -8]), { stiffness: 120, damping: 16 });
  const rY = useSpring(useTransform(mx, [-40, 40], [-8, 8]), { stiffness: 120, damping: 16 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      className={styles.stage}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <motion.div className={styles.deck} style={{ rotateX: rX, rotateY: rY }}>
        <motion.div
          className={styles.source}
          initial={{ opacity: 0, scale: 0.9, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ImageIcon size={22} strokeWidth={1.6} />
          <span>One upload</span>
          <span className={styles.sourceSub}>coffee-counter.jpg</span>
        </motion.div>

        {OUTPUTS.map((item, i) => (
          <motion.div
            key={item.tag}
            className={styles.card}
            style={{ "--rot": `${item.rot}deg`, "--x": `${item.x}px`, "--y": `${item.y}px`, "--accent": item.accent, "--tint": item.tint }}
            initial={{ opacity: 0, scale: 0.85, rotate: 0, x: 0, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: [item.rot, item.rot + 1.5, item.rot],
              x: item.x,
              y: [item.y, item.y - 6, item.y],
            }}
            whileHover={{ scale: 1.08, rotate: 0, zIndex: 20, transition: { duration: 0.25 } }}
            transition={{
              opacity: { duration: 0.6, delay: item.delay, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 0.6, delay: item.delay, ease: [0.16, 1, 0.3, 1] },
              x: { duration: 0.6, delay: item.delay, ease: [0.16, 1, 0.3, 1] },
              rotate: { duration: 4.5 + i * 0.4, delay: item.delay + 0.6, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 4.5 + i * 0.4, delay: item.delay + 0.6, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <span className={styles.cardTag}>{item.tag}</span>
            <item.icon size={16} strokeWidth={1.8} />
            <p>{item.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
