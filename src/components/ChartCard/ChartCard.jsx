import PropTypes from 'prop-types';
import styles from './ChartCard.module.scss';

/**
 * Carte conteneur d'un graphique du tableau de bord.
 *
 * Elle ne s'occupe que de l'habillage (fond, titre, légende, espacements) :
 * le graphique lui-même est passé en `children`, ce qui permettra d'y insérer
 * les composants Recharts sans toucher à la mise en page.
 *
 * @param {object} props
 * @param {string} [props.title] Titre affiché en haut de la carte.
 * @param {'light'|'red'|'dark'} [props.variant] Habillage de la carte.
 * @param {React.ReactNode} [props.aside] Contenu aligné à droite du titre (légende…).
 * @param {string} [props.className] Classe additionnelle (dimensions notamment).
 * @param {boolean} [props.floatingTitle] Place le titre par-dessus le graphique
 *   au lieu de le pousser vers le bas. Nécessaire pour la carte du score, dont
 *   la maquette centre le cercle dans toute la hauteur de la carte.
 * @param {boolean} [props.bleed] Laisse le graphique s'étendre jusqu'aux bords
 *   de la carte, en annulant le rembourrage. Nécessaire pour la carte des
 *   sessions, dont l'assombrissement au survol va jusqu'au bord.
 * @param {React.ReactNode} props.children Contenu de la carte (le graphique).
 */
function ChartCard({
  title,
  variant = 'light',
  aside,
  className,
  floatingTitle = false,
  bleed = false,
  children,
}) {
  const classes = [styles.card, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  const headerClasses = [styles.header, floatingTitle && styles.floating]
    .filter(Boolean)
    .join(' ');

  const bodyClasses = [styles.body, bleed && styles.bleed]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={classes}>
      {(title || aside) && (
        <header className={headerClasses}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {aside}
        </header>
      )}

      <div className={bodyClasses}>{children}</div>
    </article>
  );
}

ChartCard.propTypes = {
  title: PropTypes.string,
  variant: PropTypes.oneOf(['light', 'red', 'dark']),
  aside: PropTypes.node,
  className: PropTypes.string,
  floatingTitle: PropTypes.bool,
  bleed: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default ChartCard;
