import { Outlet, NavLink, Link } from "react-router-dom";
import styles from "./MainLayout.module.css";
import { Film, User } from "lucide-react";

function MainLayout() {
    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.logoArea}>
                    <Film color="#e50914" size={28} />
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <span className={styles.logoText}>MediaTracker</span>
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <NavLink
                        to="/media/search"
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                    >
                        Search
                    </NavLink>
                    <NavLink
                        to="/media/top"
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                    >
                        Top Rated
                    </NavLink>
                </nav>

                <div className={styles.userArea}>
                    <span className={styles.userName}>AndreB</span>
                    <div className={styles.avatar}>
                        <User size={20} />
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
