import { forwardRef } from "react";
import styles from "./Field.module.css";

const Textarea = forwardRef(function Textarea({ label, hint, error, id, className = "", ...rest }, ref) {
  const inputId = id || rest.name;
  return (
    <div className={[styles.field, className].join(" ").trim()}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea ref={ref} id={inputId} className={[styles.control, styles.textarea, error ? styles.errorState : ""].join(" ")} {...rest} />
      {error ? <span className={styles.error}>{error}</span> : hint ? <span className={styles.hint}>{hint}</span> : null}
    </div>
  );
});

export default Textarea;
