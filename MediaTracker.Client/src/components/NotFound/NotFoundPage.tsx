import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>404 Page not found</div>
            <Link to="/" className={styles.homeLink}>Go Home</Link>
        </div>
    );
}

export default NotFoundPage;
