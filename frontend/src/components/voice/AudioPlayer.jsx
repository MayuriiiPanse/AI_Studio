import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import styles from "./AudioPlayer.module.css";

const BAR_COUNT = 24;
const BAR_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) => 6 + ((i * 37) % 20));

export default function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <div className={styles.wrap}>
      <button className={styles.playBtn} onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div className={[styles.bars, playing ? styles.animated : ""].join(" ")}>
        {BAR_HEIGHTS.map((h, i) => (
          <span key={i} style={{ height: h, animationDelay: `${i * 0.045}s` }} />
        ))}
      </div>
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
