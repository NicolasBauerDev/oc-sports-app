import { Outlet } from 'react-router';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Layout.module.scss';

/**
 * Structure commune à tous les écrans : navigation horizontale en haut (US#1),
 * navigation verticale à gauche (US#2) et zone de contenu à droite.
 */
function Layout() {
    return (
        <div className={styles.layout}>
            <Navbar />

            <div className={styles.body}>
                <Sidebar />

                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
