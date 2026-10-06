import PropTypes from 'prop-types';
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';
import styles from './ScoreChart.module.scss';

/** Rouge de la maquette pour l'arc de progression. */
const ARC_COLOR = '#ff0000';

/**
 * Score du jour, sous forme de RadialBarChart (US#14).
 *
 * L'arc part du haut et tourne dans le sens anti-horaire, comme sur la maquette.
 * L'échelle est confiée à `PolarAngleAxis` (domaine 0 → 100) au lieu d'être
 * convertie en degrés à la main : la valeur reste une donnée, c'est Recharts qui
 * la traduit en angle.
 *
 * @param {object} props
 * @param {number} props.score Score du jour, entre 0 et 1.
 */
function ScoreChart({ score }) {
  const percentage = Math.round(score * 100);

  return (
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={[{ value: percentage }]}
          startAngle={90}
          endAngle={450}
          innerRadius="70%"
          outerRadius="85%"
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
            axisLine={false}
          />
          {/* Animation désactivée : sinon l'arc part de zéro et n'atteint
              sa longueur réelle qu'à la fin de l'animation. */}
          <RadialBar
            dataKey="value"
            cornerRadius={5}
            fill={ARC_COLOR}
            isAnimationActive={false}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className={styles.center}>
        <p className={styles.value}>{percentage}%</p>
        <p className={styles.label}>de votre objectif</p>
      </div>
    </div>
  );
}

ScoreChart.propTypes = {
  score: PropTypes.number.isRequired,
};

export default ScoreChart;
