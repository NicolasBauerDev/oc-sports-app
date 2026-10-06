import PropTypes from 'prop-types';
import styles from './Placeholder.module.scss';

/**
 * Écran d'attente pour les entrées de menu qui ne sont pas au périmètre du
 * sprint (Profil, Réglage, Communauté) et pour les URL inconnues.
 *
 * @param {object} props
 * @param {string} props.title Titre de l'écran.
 * @param {string} [props.message] Message affiché sous le titre.
 */
function Placeholder({ title, message = 'Cet écran arrive prochainement.' }) {
    return (
        <div className={styles.placeholder}>
            <h1 className={styles.title}>{title}</h1>
            <p>{message}</p>
        </div>
    );
}

Placeholder.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string,
};

export default Placeholder;
