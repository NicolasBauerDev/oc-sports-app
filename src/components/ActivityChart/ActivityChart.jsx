import PropTypes from 'prop-types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './ActivityChart.module.scss';

/**
 * Couleurs des deux séries. Elles doublent volontairement les variables Sass :
 * Recharts attend des couleurs en JavaScript, et la légende de la carte utilise
 * les mêmes valeurs côté SCSS (`$dark` et `$red-chart`).
 */
const WEIGHT_COLOR = '#282d30';
const CALORIES_COLOR = '#ff0000';

/** Épaisseur des barres et écart entre les deux barres d'une même journée. */
const BAR_SIZE = 7;
const BAR_GAP = 8;

/** Coins arrondis, en haut uniquement. */
const BAR_RADIUS = [3, 3, 0, 0];

/** Nombre de repères sur l'axe des poids, comme sur la maquette. */
const WEIGHT_TICKS = 3;

/**
 * Calcule l'échelle de l'axe des poids : bornes entières et repères
 * régulièrement espacés.
 *
 * Laisser Recharts choisir donnait des repères comme 75 / 79 / 82 — ni ronds ni
 * régulièrement espacés. On encadre donc les valeurs par des entiers, en
 * ajustant la borne haute pour que l'écart soit divisible par le nombre
 * d'intervalles : le repère du milieu tombe alors sur un entier.
 *
 * @param {number[]} weights
 * @returns {{domain: number[], ticks: number[]}}
 */
function getWeightScale(weights) {
  const lower = Math.floor(Math.min(...weights)) - 1;
  let upper = Math.ceil(Math.max(...weights)) + 1;

  const intervals = WEIGHT_TICKS - 1;
  const remainder = (upper - lower) % intervals;
  if (remainder !== 0) upper += intervals - remainder;

  const step = (upper - lower) / intervals;
  const ticks = Array.from({ length: WEIGHT_TICKS }, (_, i) => lower + i * step);

  return { domain: [lower, upper], ticks };
}

/**
 * Infobulle de la maquette : le poids et les calories empilés, sur fond rouge.
 */
function ActivityTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  // On lit la ligne de données d'origine (`payload[0].payload`) plutôt que de
  // chercher chaque série dans le tableau des séries. C'est plus court, et
  // surtout plus sûr : chercher par `dataKey` pouvait tomber sur une autre
  // entrée que celle attendue et afficher la valeur d'un jour voisin.
  const session = payload[0].payload;

  return (
    <div className={styles.tooltip}>
      <p>{session.kilogram}kg</p>
      <p>{session.calories}Kcal</p>
    </div>
  );
}

/* Les props de l'infobulle sont fournies par Recharts, pas par nous : elles
   sont donc toutes facultatives. `payload` porte, pour chaque série, la ligne
   de données d'origine sous `payload.payload`. */
ActivityTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      payload: PropTypes.shape({
        kilogram: PropTypes.number,
        calories: PropTypes.number,
      }),
    }),
  ),
};

/**
 * Activité quotidienne : poids et calories brûlées (US#11).
 *
 * Les deux séries ont des ordres de grandeur sans rapport (des kilos face à des
 * centaines de calories) : chacune a donc son propre axe vertical. Seul celui
 * des poids est visible, à droite, comme sur la maquette.
 *
 * L'axe des poids ne part pas de zéro, également d'après la maquette : sur une
 * plage de 76 à 81 kg, un axe partant de zéro rendrait toutes les barres
 * pratiquement identiques et masquerait la variation. La contrepartie, connue,
 * est que l'écart entre les barres paraît plus marqué qu'il ne l'est.
 *
 * @param {object} props
 * @param {Array<{day: number, kilogram: number, calories: number}>} props.sessions
 *   Sessions déjà normalisées : `day` porte le numéro du jour.
 */
function ActivityChart({ sessions }) {
  const weight = getWeightScale(sessions.map((session) => session.kilogram));

  return (
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sessions}
          barGap={BAR_GAP}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            yAxisId="weight"
            vertical={false}
            strokeDasharray="3 3"
            stroke="#dedede"
          />

          {/* Axe des jours. Indexé sur `day`, qui est unique. */}
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={16}
            axisLine={{ stroke: '#dedede' }}
            tick={{ fill: '#9b9eac', fontSize: 14 }}
          />

          {/* Axe des poids : visible à droite, sans ligne ni graduation. */}
          <YAxis
            yAxisId="weight"
            orientation="right"
            tickLine={false}
            tickMargin={30}
            axisLine={false}
            ticks={weight.ticks}
            domain={weight.domain}
            tick={{ fill: '#9b9eac', fontSize: 14 }}
          />

          {/* Axe des calories : masqué, il ne sert qu'à mettre les barres
              rouges à l'échelle indépendamment des poids. */}
          {/* Pas de `dataKey` sur les axes : leur domaine est déduit des barres
              qui leur sont rattachées. En mettre un les faisait entrer dans le
              contenu de l'infobulle et brouillait la lecture des séries. */}
          <YAxis
            yAxisId="calories"
            hide
            domain={[0, (dataMax) => dataMax * 1.1]}
          />

          {/* `cursor` dessine la bande grise sur toute la colonne survolée. */}
          <Tooltip
            content={<ActivityTooltip />}
            cursor={{ fill: '#c4c4c4', fillOpacity: 0.5 }}
            isAnimationActive={false}
          />

          {/* Animations coupées, comme sur les autres graphiques : l'état final
              ne doit pas dépendre d'une animation qui aboutit. */}
          <Bar
            yAxisId="weight"
            dataKey="kilogram"
            fill={WEIGHT_COLOR}
            barSize={BAR_SIZE}
            radius={BAR_RADIUS}
            isAnimationActive={false}
          />
          <Bar
            yAxisId="calories"
            dataKey="calories"
            fill={CALORIES_COLOR}
            barSize={BAR_SIZE}
            radius={BAR_RADIUS}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

ActivityChart.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      day: PropTypes.number.isRequired,
      kilogram: PropTypes.number.isRequired,
      calories: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default ActivityChart;
