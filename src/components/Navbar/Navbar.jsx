import { NavLink } from 'react-router'
import styles from './Navbar.module.scss'

const links = [
  { name: 'Accueil', path: '/' },
  { name: 'Profil', path: '/profil' },
  { name: 'Réglage', path: '/reglage' },
  { name: 'Communauté', path: '/communaute' },
]

function Navbar() {
  const navClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link

  return (
    <header className={styles.navbar}>
      <NavLink to="/">
        <img className={styles.logo} src="/logo.svg" alt="SportSee" />
      </NavLink>

      <nav>
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} className={navClass}>
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
