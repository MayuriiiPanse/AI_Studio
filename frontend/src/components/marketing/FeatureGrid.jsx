import { ImagePlus, Palette, Mic, MessagesSquare, FolderKanban, BookMarked } from "lucide-react";
import useScrollReveal from "../../hooks/useScrollReveal";
import styles from "./FeatureGrid.module.css";

const FEATURES = [
  {
    icon: ImagePlus,
    title: "Image to content kit",
    desc: "Upload a photo and Reelcraft reads it back as a caption, a mood, a story, a reel script, and the exact hashtags to run with it.",
    accent: "var(--brass)",
    tint: "var(--brass-tint)",
  },
  {
    icon: Palette,
    title: "Poster lab",
    desc: "Describe the piece you need. Your prompt is refined into an art direction brief, then rendered into a poster-ready image.",
    accent: "var(--pink)",
    tint: "var(--pink-tint)",
  },
  {
    icon: Mic,
    title: "Voice lab",
    desc: "Turn any script into a clean voice-over track, ready to drop under a reel or a store announcement.",
    accent: "var(--marigold)",
    tint: "var(--marigold-tint)",
  },
  {
    icon: MessagesSquare,
    title: "An assistant that remembers",
    desc: "The studio assistant retrieves your past posts and documents before it answers, so tone and facts stay consistent.",
    accent: "var(--sky)",
    tint: "var(--sky-tint)",
  },
  {
    icon: FolderKanban,
    title: "Projects",
    desc: "Group captions, scripts, and analyses from different sessions into one campaign, without losing track of any of it.",
    accent: "var(--teal)",
    tint: "var(--teal-tint)",
  },
  {
    icon: BookMarked,
    title: "Knowledge base",
    desc: "Upload brand guidelines or past copy once — the assistant searches it before every response, not just this session.",
    accent: "var(--brass)",
    tint: "var(--brass-tint)",
  },
];

function handleTilt(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const px = ((e.clientX - rect.left) / rect.width) * 100;
  const py = ((e.clientY - rect.top) / rect.height) * 100;
  card.style.setProperty("--mx", `${px}%`);
  card.style.setProperty("--my", `${py}%`);
  const rx = ((py - 50) / 50) * -5;
  const ry = ((px - 50) / 50) * 5;
  card.style.setProperty("--rx", `${rx}deg`);
  card.style.setProperty("--ry", `${ry}deg`);
}

function resetTilt(e) {
  const card = e.currentTarget;
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
}

export default function FeatureGrid() {
  const scope = useScrollReveal();

  return (
    <section id="features" ref={scope} className={["container", styles.section].join(" ")}>
      <div className={styles.heading} data-reveal>
        <span className="eyebrow">Inside the studio</span>
        <h2 className={styles.title}>Six rooms, one take.</h2>
        <p className={styles.sub}>Every tool reads from the same brand memory, so nothing you make feels off-model.</p>
      </div>
      <div className={styles.grid}>
        {FEATURES.map((f) => (
          <div
            key={f.title}
            data-reveal
            className={[styles.card, "spotlightCard"].join(" ")}
            style={{ "--accent": f.accent, "--tint": f.tint }}
            onMouseMove={handleTilt}
            onMouseLeave={resetTilt}
          >
            <span className={styles.iconChip}>
              <f.icon size={20} strokeWidth={1.8} />
            </span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <span className={styles.cardGlint} aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
}
