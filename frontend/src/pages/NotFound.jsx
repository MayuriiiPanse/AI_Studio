import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Logo from "../components/layout/Logo";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <Logo />
      <span className={styles.code}>404</span>
      <h1>This frame didn't make the cut.</h1>
      <p>The page you're looking for doesn't exist, or it's been moved.</p>
      <Link to="/">
        <Button>Back to the studio</Button>
      </Link>
    </div>
  );
}
