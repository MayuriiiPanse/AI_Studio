import { LogOut, Moon, SunMedium, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { API_ORIGIN } from "../api/client";
import styles from "./Settings.module.css";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: SunMedium },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function Settings() {
  const { user, logout } = useAuth();
  const { mode, theme, setMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <PageHeader eyebrow="Account" title="Settings" description="Manage your studio account and see how Reelcraft is connected." />

      <div className={styles.grid}>
        <Card>
          <h3 className={styles.cardTitle}>Profile</h3>
          <div className={styles.row}>
            <span className={styles.label}>Username</span>
            <span className={styles.value}>{user?.username}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Account ID</span>
            <span className={[styles.value, styles.mono].join(" ")}>{user?.id}</span>
          </div>
        </Card>

        <Card>
          <h3 className={styles.cardTitle}>Appearance</h3>
          <div className={styles.themeRow}>
            <div className={styles.themeIcon}>{theme === "dark" ? <Moon size={18} /> : <SunMedium size={18} />}</div>
            <div>
              <div className={styles.themeLabel}>{theme === "dark" ? "Dusk (dark)" : "Cotton (light)"}</div>
              <p className={styles.themeHint}>Choose light or dark, or match your system's appearance automatically.</p>
            </div>
          </div>

          <div className={styles.themeSwitch} role="radiogroup" aria-label="Theme">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
              const active = mode === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={styles.themeOption}
                  onClick={() => setMode(value)}
                >
                  {active && (
                    <motion.span
                      layoutId="theme-pill"
                      className={styles.themePill}
                      transition={{ type: "spring", stiffness: 500, damping: 36 }}
                    />
                  )}
                  <span className={styles.themeOptionContent}>
                    <Icon size={14} />
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className={styles.cardTitle}>Connection</h3>
          <div className={styles.row}>
            <span className={styles.label}>API endpoint</span>
            <span className={[styles.value, styles.mono].join(" ")}>{API_ORIGIN}</span>
          </div>
          <p className={styles.envHint}>Set with <code>VITE_API_URL</code> at build time.</p>
        </Card>

        <Card>
          <h3 className={styles.cardTitle}>Session</h3>
          <p className={styles.envHint} style={{ marginBottom: 16 }}>
            Signs you out of this device.
          </p>
          <Button variant="danger" icon={<LogOut size={15} />} onClick={handleLogout}>
            Log out
          </Button>
        </Card>
      </div>
    </div>
  );
}
