import { Outlet, NavLink, Link } from "react-router-dom";
import styles from "./MainLayout.module.css";
import { Film, LogOut, Settings } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../bll/store.ts";
import { fetchCurrentUser } from "../../bll/account/thunks.ts";
import { logout } from "../../bll/auth/authSlice.ts";
import Avatar from "../common/Avatar.tsx";

function MainLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const { user, status } = useSelector((state: RootState) => state.account);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user && status === 'idle') {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, user, status]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        dispatch(logout());
    };

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

                <div
                    className={styles.userArea}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    ref={dropdownRef}
                >
                    {status === 'loading' ? (
                        <div className={styles.skeletonName}></div>
                    ) : (
                        <span className={styles.userName}>
                            {user?.username || "Guest"}
                        </span>
                    )}

                    <div className={styles.avatar}>
                        <Avatar avatarUrl={user?.avatarUrl || null} />
                    </div>

                    {isDropdownOpen && (
                        <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                            <Link to={"account"} className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                                <Settings size={18} />
                                <span>Account</span>
                            </Link>
                            <div className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
                                <LogOut size={18} />
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;