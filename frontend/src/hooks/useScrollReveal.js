import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

let registered = false;
function ensureRegistered() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/**
 * Reveals every element carrying a `data-reveal` attribute inside the
 * returned ref as it scrolls into view — fade + rise, staggered by
 * document order, with an optional per-element delay via
 * `data-reveal-delay`. Falls back to a no-op (content stays visible)
 * when the user prefers reduced motion.
 */
export default function useScrollReveal(deps = []) {
  const scope = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !scope.current) return undefined;
    ensureRegistered();

    const ctx = gsap.context(() => {
      const targets = scope.current.querySelectorAll("[data-reveal]");
      targets.forEach((el, i) => {
        const delay = Number(el.dataset.revealDelay || 0) || (i % 4) * 0.06;
        const distance = el.dataset.revealDistance ? Number(el.dataset.revealDistance) : 28;
        gsap.fromTo(
          el,
          { opacity: 0, y: distance },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      const lines = scope.current.querySelectorAll("[data-reveal-line]");
      lines.forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 30%",
              scrub: 0.6,
            },
          }
        );
      });
    }, scope);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);

  return scope;
}
