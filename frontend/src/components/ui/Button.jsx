import { forwardRef } from "react";
import styles from "./Button.module.css";

const Button = forwardRef(function Button(
  { as: Tag = "button", variant = "primary", size = "md", loading = false, icon, iconRight, className = "", children, disabled, ...rest },
  ref
) {
  const classes = [styles.btn, styles[variant], styles[size], loading ? styles.loading : "", className].join(" ").trim();
  return (
    <Tag ref={ref} className={classes} disabled={disabled || loading} aria-busy={loading} {...rest}>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && icon}
      <span className={styles.label}>{children}</span>
      {!loading && iconRight}
    </Tag>
  );
});

export default Button;
