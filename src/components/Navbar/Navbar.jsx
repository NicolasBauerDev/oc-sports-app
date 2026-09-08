import { NavLink } from 'react-router'
import logo from '../../assets/logo.svg'
import styles from './Navbar.module.scss'

const links = [
  { name: 'Accueil', path: '/' },
  { name: 'Profil', path: '/profil' },
  { name: 'Réglage', path: '/reglage' },
  { name: 'Communauté', path: '/communaute' },
]

/**
 * Navigation horizontale principale (US#1).
 */
function Navbar() {
  const navClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link

  return (
    <header className={styles.navbar}>
      <NavLink to="/" className={styles.brand}>
        <img className={styles.logo} src={logo} alt="SportSee, accueil" />
      </NavLink>

      <nav aria-label="Navigation principale">
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} className={navClass} end>
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
