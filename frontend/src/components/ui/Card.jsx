import styles from "./Card.module.css";

export default function Card({ as: Tag = "div", className = "", hoverable = false, padded = true, children, ...rest }) {
  const classes = [styles.card, padded ? styles.padded : "", hoverable ? styles.hoverable : "", className].join(" ").trim();
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
