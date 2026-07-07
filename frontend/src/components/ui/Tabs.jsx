import { useState } from "react";
import styles from "./Tabs.module.css";

export default function Tabs({ tabs, defaultTab, onChange }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);

  const handleClick = (id) => {
    setActive(id);
    onChange?.(id);
  };

  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div>
      <div className={styles.list} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            className={[styles.tab, active === tab.id ? styles.active : ""].join(" ")}
            onClick={() => handleClick(tab.id)}
          >
            {tab.icon}
            {tab.label}
            {tab.badge ? <span className={styles.badge}>{tab.badge}</span> : null}
          </button>
        ))}
      </div>
      {activeTab?.content && <div className={styles.panel}>{activeTab.content}</div>}
    </div>
  );
}
