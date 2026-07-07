import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  GalleryHorizontalEnd,
  Palette,
  Mic,
  MessagesSquare,
  FolderKanban,
  History,
  BookMarked,
  Settings,
  Aperture,
} from "lucide-react";
import Logo from "./Logo";
import styles from "./Sidebar.module.css";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/studio", label: "Studio", icon: Sparkles },
  { to: "/posts", label: "Posts", icon: GalleryHorizontalEnd },
  { to: "/poster", label: "Poster lab", icon: Palette },
  { to: "/voice", label: "Voice lab", icon: Mic },
  { to: "/chat", label: "Assistant", icon: MessagesSquare },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/history", label: "History", icon: History },
  { to: "/knowledge", label: "Knowledge", icon: BookMarked },
];

export default function Sidebar({ onNavigate }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Logo size={28} />
      </div>

      <nav className={styles.nav}>
        <span className={styles.sectionLabel}>Create</span>
        {NAV.slice(0, 6).map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => [styles.link, isActive ? styles.active : ""].join(" ")} onClick={onNavigate}>
            <item.icon size={17} strokeWidth={1.8} />
            {item.label}
          </NavLink>
        ))}
        <span className={styles.sectionLabel}>Manage</span>
        {NAV.slice(6).map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => [styles.link, isActive ? styles.active : ""].join(" ")} onClick={onNavigate}>
            <item.icon size={17} strokeWidth={1.8} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <NavLink to="/settings" className={({ isActive }) => [styles.link, styles.settings, isActive ? styles.active : ""].join(" ")} onClick={onNavigate}>
        <Settings size={17} strokeWidth={1.8} />
        Settings
      </NavLink>

      <div className={styles.footer}>
        <Aperture size={14} />
        <span>Auto theme · system-linked</span>
      </div>
    </aside>
  );
}
