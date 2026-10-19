import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import caloriesIcon from '../../assets/energie.svg';
import carbsIcon from '../../assets/glucide.svg';
import fatsIcon from '../../assets/lipides.svg';
import proteinsIcon from '../../assets/proteins.svg';
import ActivityChart from '../../components/ActivityChart/ActivityChart';
import ChartCard from '../../components/ChartCard/ChartCard';
import KeyDataCard from '../../components/KeyDataCard/KeyDataCard';
import PerformanceChart from '../../components/PerformanceChart/PerformanceChart';
import ScoreChart from '../../components/ScoreChart/ScoreChart';
import SessionsChart from '../../components/SessionsChart/SessionsChart';
import useUserData from '../../hooks/useUserData';
import styles from './Dashboard.module.scss';

/** Utilisateur affiché sur `/`, en attendant une authentification. */
const DEFAULT_USER_ID = 12;

/**
 * Construit les 4 cartes de chiffres clés à partir du modèle utilisateur (US#15).
 *
 * Le formatage est fait ici et non dans le modèle : le modèle porte la donnée
 * (`1930`), la vue porte sa présentation (`1,930kCal`). La locale est figée à
 * `en-US` pour reproduire le séparateur de milliers de la maquette — en
 * français, `toLocaleString` produirait une espace insécable.
 *
 * @param {{calorieCount: number, proteinCount: number, carbohydrateCount: number, lipidCount: number}} keyData
 */
function buildKeyData(keyData) {
    return [
        {
            id: 'calories',
            icon: caloriesIcon,
            value: `${keyData.calorieCount.toLocaleString('en-US')}kCal`,
            label: 'Calories',
            theme: 'calories',
        },
        {
            id: 'proteins',
            icon: proteinsIcon,
            value: `${keyData.proteinCount}g`,
            label: 'Proteines',
            theme: 'proteins',
        },
        {
            id: 'carbs',
            icon: carbsIcon,
            value: `${keyData.carbohydrateCount}g`,
            label: 'Glucides',
            theme: 'carbs',
        },
        {
            id: 'fats',
            icon: fatsIcon,
            value: `${keyData.lipidCount}g`,
            label: 'Lipides',
            theme: 'fats',
        },
    ];
}

/**
 * Message pleine page, affiché pendant le chargement ou en cas d'erreur.
 *
 * La navigation reste visible : seul le contenu du tableau de bord est remplacé.
 */
function DashboardState({ title, children }) {
    return (
        <div className={styles.dashboard}>
            <p className={styles.stateTitle}>{title}</p>
            {children && <p className={styles.state}>{children}</p>}
        </div>
    );
}

/**
 * Tableau de bord de l'utilisateur.
 *
 * Le prénom (US#4), les chiffres clés (US#10) et les quatre graphiques
 * (US#11 à US#14) proviennent tous des données normalisées.
 */
function Dashboard() {
    const { id } = useParams();
    const { status, data, error } = useUserData(id ?? DEFAULT_USER_ID);

    if (status === 'loading') {
        return <DashboardState title="Chargement de vos données…" />;
    }

    if (status === 'error') {
        return (
            <DashboardState title="Impossible de charger vos données">
                {error.message}
            </DashboardState>
        );
    }

    const { user } = data;
    const keyData = buildKeyData(user.keyData);

    return (
        <div className={styles.dashboard}>
            <h1 className={styles.greeting}>
                Bonjour <span className={styles.firstName}>{user.firstName}</span>
            </h1>
            <p className={styles.encouragement}>
                Félicitation ! Vous avez explosé vos objectifs hier 👏
            </p>

            <div className={styles.content}>
                <div className={styles.charts}>
                    <ChartCard
                        title="Activité quotidienne"
                        className={styles.dailyActivity}
                        /* Légende écrite à la main plutôt qu'avec le <Legend /> de
               Recharts : sur la maquette elle appartient à l'en-tête de la
               carte, alignée avec le titre, donc hors de la zone de tracé.
               Recharts la dessinerait dans le graphique et il faudrait de
               toute façon un rendu personnalisé pour retrouver ces pastilles. */
                        aside={
                            <ul className={styles.legend}>
                                <li>
                                    <span className={`${styles.dot} ${styles.dotWeight}`} />
                                    Poids (kg)
                                </li>
                                <li>
                                    <span className={`${styles.dot} ${styles.dotCalories}`} />
                                    Calories brûlées (kCal)
                                </li>
                            </ul>
                        }
                    >
                        <ActivityChart sessions={data.activity.sessions} />
                    </ChartCard>

                    <div className={styles.chartsRow}>
                        <ChartCard
                            title="Durée moyenne des sessions"
                            variant="red"
                            className={styles.smallChart}
                            floatingTitle
                            bleed
                        >
                            <SessionsChart sessions={data.averageSessions.sessions} />
                        </ChartCard>

                        <ChartCard variant="dark" className={styles.smallChart}>
                            <PerformanceChart performance={data.performance.data} />
                        </ChartCard>

                        <ChartCard title="Score" className={styles.smallChart} floatingTitle>
                            <ScoreChart score={user.score} />
                        </ChartCard>
                    </div>
                </div>

                <div className={styles.keyData}>
                    {keyData.map((item) => (
                        <KeyDataCard
                            key={item.id}
                            icon={item.icon}
                            value={item.value}
                            label={item.label}
                            theme={item.theme}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

DashboardState.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
};

export default Dashboard;
