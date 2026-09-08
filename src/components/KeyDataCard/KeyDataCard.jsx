import PropTypes from 'prop-types'
import styles from './KeyDataCard.module.scss'

/**
 * Carte d'un chiffre clé de la journée : calories, protéines, glucides, lipides
 * (US#15).
 *
 * @param {object} props
 * @param {string} props.icon Chemin de l'icône (dossier `assets`).
 * @param {string} props.value Valeur déjà formatée (ex. « 1,930kCal »).
 * @param {string} props.label Libellé du chiffre clé.
 * @param {'calories'|'proteins'|'carbs'|'fats'} props.theme Couleur du fond de l'icône.
 */
function KeyDataCard({ icon, value, label, theme }) {
  return (
    <article className={styles.card}>
      <div className={`${styles.iconWrapper} ${styles[theme]}`}>
        <img src={icon} alt="" />
      </div>

      <div>
        <p className={styles.value}>{value}</p>
        <p className={styles.label}>{label}</p>
      </div>
    </article>
  )
}

KeyDataCard.propTypes = {
  icon: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(['calories', 'proteins', 'carbs', 'fats']).isRequired,
}

export default KeyDataCard
