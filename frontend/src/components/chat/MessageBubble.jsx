import { Sparkles, BookMarked } from "lucide-react";
import styles from "./MessageBubble.module.css";

export default function MessageBubble({ role, text, ragUsed }) {
  const isUser = role === "user";
  return (
    <div className={[styles.row, isUser ? styles.userRow : ""].join(" ")}>
      <div className={[styles.avatar, isUser ? styles.userAvatar : styles.aiAvatar].join(" ")}>
        {isUser ? "You" : <Sparkles size={13} />}
      </div>
      <div className={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble].join(" ")}>
        <p>{text}</p>
        {ragUsed && (
          <span className={styles.ragTag}>
            <BookMarked size={11} /> Used your knowledge base
          </span>
        )}
      </div>
    </div>
  );
}
