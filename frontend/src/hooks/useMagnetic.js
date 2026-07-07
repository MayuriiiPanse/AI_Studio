import { useRef } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

/**
 * Attaches a gentle "magnetic" pull toward the pointer on hover — the
 * element nudges a few pixels toward the cursor, then springs back on
 * leave. Returns a ref plus mouse handlers to spread onto the node.
 */
export default function useMagnetic(strength = 14) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  const onMouseMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  };

  return { ref, onMouseMove, onMouseLeave };
}
