import useScrollReveal from "../../hooks/useScrollReveal";
import styles from "./Workflow.module.css";

const TAKES = [
  {
    take: "01",
    title: "Feed it a source",
    desc: "An image for the studio, a line for the poster lab, a script for the voice lab — whatever you have already made.",
    accent: "var(--sky)",
    tint: "var(--sky-tint)",
  },
  {
    take: "02",
    title: "The studio develops it",
    desc: "AI reads the source against your brand memory and produces every connected format in the same pass.",
    accent: "var(--pink)",
    tint: "var(--pink-tint)",
  },
  {
    take: "03",
    title: "Review, then release",
    desc: "Edit any field inline, save it to a project, and everything lands in your history — searchable, forever.",
    accent: "var(--teal)",
    tint: "var(--teal-tint)",
  },
];

export default function Workflow() {
  const scope = useScrollReveal();

  return (
    <section id="workflow" ref={scope} className={["container", styles.section].join(" ")}>
      <div className={styles.heading} data-reveal>
        <span className="eyebrow">How a release moves</span>
        <h2 className={styles.title}>Three takes, no re-shoots.</h2>
      </div>
      <div className={styles.rail}>
        <span className={styles.railLine} data-reveal-line aria-hidden="true" />
        {TAKES.map((t, i) => (
          <div
            key={t.take}
            data-reveal
            data-reveal-delay={i * 0.12}
            className={styles.step}
            style={{ "--accent": t.accent, "--tint": t.tint }}
          >
            <span className={styles.take}>{t.take}</span>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
