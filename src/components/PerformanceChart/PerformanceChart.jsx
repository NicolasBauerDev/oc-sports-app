import PropTypes from 'prop-types'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import styles from './PerformanceChart.module.scss'

/** Rouge de la maquette pour la surface du radar. */
const RADAR_COLOR = '#ff0101'

/**
 * Marge au-delà de la plus grande valeur.
 *
 * Sans elle, le plus grand axe touche l'hexagone extérieur et la forme paraît
 * à l'étroit. La maquette laisse cette respiration.
 */
const HEADROOM = 1.25

/**
 * Place réservée aux libellés des axes, en pixels.
 *
 * Les libellés sont dessinés à l'extérieur de l'hexagone, et un SVG rogne ce
 * qui dépasse de sa propre boîte. Sans ces marges, « Cardio » et « Vitesse »
 * se retrouvaient tronqués sur les écrans étroits.
 */
const LABEL_MARGIN = { top: 10, right: 28, bottom: 10, left: 28 }

/**
 * Nombre de repères de l'axe radial.
 *
 * Le premier repère vaut 0 et produit un hexagone réduit à un point : il faut
 * donc en demander un de plus que le nombre d'anneaux voulus. 6 repères pour
 * les 5 hexagones de la maquette.
 */
const RING_COUNT = 6

/**
 * Types d'activité, sous forme de RadarChart (US#13).
 *
 * @param {object} props
 * @param {Array<{value: number, kind: string, label: string}>} props.performance
 *   Données déjà normalisées : `label` porte le libellé français de l'axe.
 */
function PerformanceChart({ performance }) {
  // La maquette place Intensité en haut puis, dans le sens horaire, Vitesse,
  // Force, Endurance, Energie, Cardio — soit l'ordre inverse de celui de
  // l'API, qui va de cardio (1) à intensity (6). Recharts plaçant le premier
  // élément en haut et tournant dans le sens horaire, inverser suffit.
  //
  // L'inversion est faite ici et non dans le modèle : l'ordre des axes est un
  // choix d'affichage, pas une propriété de la donnée.
  const axes = [...performance].reverse()

  const maxValue = Math.max(...axes.map((axis) => axis.value), 0)

  return (
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={axes} outerRadius="72%" margin={LABEL_MARGIN}>
          {/* La maquette ne montre que les hexagones, sans rayons. */}
          <PolarGrid radialLines={false} stroke="#ffffff" strokeOpacity={0.5} />

          <PolarAngleAxis
            dataKey="label"
            tickLine={false}
            tick={{ fill: '#ffffff', fontSize: 12 }}
          />

          {/* Axe radial masqué : il ne sert qu'à fixer l'échelle et le
              nombre d'hexagones. */}
          <PolarRadiusAxis
            tick={false}
            axisLine={false}
            tickCount={RING_COUNT}
            domain={[0, maxValue * HEADROOM || 1]}
          />

          {/* Animation désactivée : Recharts fait grandir la surface depuis
              le centre, et l'état final n'est atteint qu'à la fin de
              l'animation. Si celle-ci n'aboutit pas (onglet en arrière-plan,
              image perdue, animations réduites), la carte reste vide. La
              maquette est statique de toute façon. */}
          <Radar
            dataKey="value"
            fill={RADAR_COLOR}
            fillOpacity={0.7}
            stroke="none"
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

PerformanceChart.propTypes = {
  performance: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      kind: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default PerformanceChart
