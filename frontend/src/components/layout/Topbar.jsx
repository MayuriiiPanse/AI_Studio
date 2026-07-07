import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Topbar.module.css";

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.username?.[0]?.toUpperCase() || "?";

  return (
    <header className={styles.bar}>
      <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open navigation">
        <Menu size={20} />
      </button>

      <div className={styles.spacer} />

      <div className={styles.menu} ref={ref}>
        <button className={styles.userBtn} onClick={() => setOpen((v) => !v)}>
          <span className={styles.avatar}>{initial}</span>
          <span className={styles.username}>{user?.username}</span>
          <ChevronDown size={15} />
        </button>
        {open && (
          <div className={styles.dropdown}>
            <button className={styles.dropdownItem} onClick={() => { setOpen(false); navigate("/settings"); }}>
              <User size={15} /> Profile settings
            </button>
            <button className={[styles.dropdownItem, styles.danger].join(" ")} onClick={handleLogout}>
              <LogOut size={15} /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
