import PropTypes from 'prop-types';
import {
  Line,
  LineChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './SessionsChart.module.scss';

/**
 * Débordement vertical de l'assombrissement, en pixels.
 *
 * Recharts ne connaît que la zone de tracé : pour couvrir aussi les marges
 * (le titre en haut, les jours en bas), le rectangle dépasse volontairement.
 * La carte le rogne grâce à son `overflow: hidden`.
 */
const OVERSHOOT = 120;

/** Marge du tracé : le haut laisse la place au titre, le bas aux jours. */
const CHART_MARGIN = { top: 76, right: 0, bottom: 20, left: 0 };

/**
 * Respiration verticale autour de la courbe, en minutes.
 *
 * Sans elle, la plus petite et la plus grande valeur se collent aux bords de la
 * zone de tracé et la courbe paraît coupée. Volontairement faible : plus la
 * marge est grande, plus la courbe s'aplatit.
 */
const Y_PADDING = 10;

/**
 * Retrait horizontal de la courbe, en pixels.
 *
 * Juste assez pour que les initiales des jours ne soient pas rognées aux
 * extrémités, mais suffisamment petit pour que la courbe atteigne presque les
 * bords de la carte comme sur la maquette.
 */
const X_PADDING = 12;

/**
 * Infobulle de la maquette : la valeur seule, sans libellé ni unité de l'axe.
 */
function SessionTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return <div className={styles.tooltip}>{payload[0].value} min</div>;
}

/* Props fournies par Recharts : toutes facultatives, le composant gère leur
   absence avant le premier survol. */
SessionTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.number })),
};

/**
 * Assombrit la partie du graphique située à droite du curseur, comme sur la
 * maquette.
 *
 * Recharts appelle ce composant avec la position du curseur (`points`) et les
 * dimensions de la zone de tracé. En partant du curseur avec la largeur totale
 * du graphique, le rectangle dépasse forcément à droite : c'est voulu, la carte
 * le rogne.
 */
function HoverCursor({ points, width, height }) {
  const x = points?.[0]?.x;

  if (x == null) return null;

  return (
    <Rectangle
      x={x}
      y={-OVERSHOOT}
      width={width}
      height={height + OVERSHOOT * 2}
      fill="#000000"
      opacity={0.1}
    />
  );
}

HoverCursor.propTypes = {
  points: PropTypes.arrayOf(PropTypes.shape({ x: PropTypes.number })),
  width: PropTypes.number,
  height: PropTypes.number,
};

/**
 * Durée moyenne des sessions, sous forme de LineChart (US#12).
 *
 * @param {object} props
 * @param {Array<{day: number, label: string, sessionLength: number}>} props.sessions
 *   Sessions déjà normalisées : `label` porte l'initiale du jour.
 */
function SessionsChart({ sessions }) {
  // L'axe est indexé sur `day` (1 à 7), pas sur `label`.
  //
  // Recharts identifie le point survolé par la valeur de l'axe. Or deux jours
  // partagent la même initiale : « M » pour mardi et pour mercredi. Avec
  // `label` comme clé, survoler mercredi renvoyait donc les données de mardi.
  // `day` est unique, et le libellé n'est utilisé que pour l'affichage.
  const labelByDay = new Map(
    sessions.map((session) => [session.day, session.label]),
  );

  return (
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sessions} margin={CHART_MARGIN}>
          <defs>
            {/* La maquette éclaircit la courbe vers la gauche. */}
            <linearGradient id="sessionsLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="day"
            tickFormatter={(day) => labelByDay.get(day) ?? ''}
            padding={{ left: X_PADDING, right: X_PADDING }}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
          />

          {/* Axe masqué : il ne sert qu'à donner de la hauteur à la courbe. */}
          <YAxis
            hide
            domain={[
              (dataMin) => dataMin - Y_PADDING,
              (dataMax) => dataMax + Y_PADDING,
            ]}
          />

          {/* `isAnimationActive={false}` : par défaut Recharts fait glisser
              l'infobulle sur 400 ms, ce qui la fait traîner derrière le
              curseur. La maquette la veut collée au point survolé. */}
          <Tooltip
            content={<SessionTooltip />}
            cursor={<HoverCursor />}
            isAnimationActive={false}
          />

          {/* Animation désactivée, pour la même raison que sur les autres
              graphiques : le tracé est révélé par un `stroke-dasharray` animé,
              et tant que l'animation n'a pas progressé la courbe est
              totalement invisible. */}
          <Line
            type="natural"
            dataKey="sessionLength"
            stroke="url(#sessionsLine)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            activeDot={{
              r: 4,
              fill: '#ffffff',
              stroke: 'rgba(255, 255, 255, 0.4)',
              strokeWidth: 8,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

SessionsChart.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      sessionLength: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default SessionsChart;
