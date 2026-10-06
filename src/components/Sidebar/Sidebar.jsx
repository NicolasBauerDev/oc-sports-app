import cyclingIcon from '../../assets/cycling.svg';
import meditationIcon from '../../assets/meditation.svg';
import strengthIcon from '../../assets/strenght.svg';
import swimIcon from '../../assets/swim.svg';
import styles from './Sidebar.module.scss';

// Les futurs blocs de navigation ne sont pas encore définis (US#2) : les icônes
// sont donc rendues sous forme de boutons, sans destination pour l'instant.
const activities = [
    { id: 'meditation', icon: meditationIcon, label: 'Méditation' },
    { id: 'swim', icon: swimIcon, label: 'Natation' },
    { id: 'cycling', icon: cyclingIcon, label: 'Vélo' },
    { id: 'strength', icon: strengthIcon, label: 'Musculation' },
];

/**
 * Navigation verticale composée d'icônes (US#2).
 */
function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <nav aria-label="Navigation des activités">
                <ul className={styles.activities}>
                    {activities.map((activity) => (
                        <li key={activity.id}>
                            <button
                                type="button"
                                className={styles.activity}
                                title={activity.label}
                            >
                                <img src={activity.icon} alt={activity.label} />
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <p className={styles.copyright}>Copyright, SportSee 2020</p>
        </div>
    );
}

export default Sidebar;
