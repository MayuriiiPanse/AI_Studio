import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import styles from "./PublicHeader.module.css";

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={[styles.bar, scrolled ? styles.scrolled : ""].join(" ")}>
      <div className={[styles.inner, "container"].join(" ")}>
        <Link to="/" onClick={() => setOpen(false)} className={styles.logoLink}>
          <Logo />
        </Link>

        <nav className={styles.nav}>
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <Button size="sm" onClick={() => navigate("/dashboard")}>
              Go to studio
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Start free
              </Button>
            </>
          )}
        </div>

        <button className={styles.burger} onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <Menu size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="#features" onClick={() => setOpen(false)}>Features</a>
            <a href="#workflow" onClick={() => setOpen(false)}>Workflow</a>
            <a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
            <div className={styles.mobileActions}>
              {isAuthenticated ? (
                <Button onClick={() => navigate("/dashboard")}>Go to studio</Button>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => navigate("/login")}>Log in</Button>
                  <Button onClick={() => navigate("/register")}>Start free</Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
