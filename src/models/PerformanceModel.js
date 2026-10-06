/** Libellés affichés sur le radar, par type d'activité renvoyé par l'API. */
const KIND_LABELS = {
  cardio: 'Cardio',
  energy: 'Energie',
  endurance: 'Endurance',
  strength: 'Force',
  speed: 'Vitesse',
  intensity: 'Intensité',
};

/**
 * Types d'activité, issus de `GET /user/:id/performance`.
 *
 * L'API renvoie les valeurs avec un `kind` numérique et, à côté, le
 * dictionnaire qui traduit ces nombres (`{ 1: 'cardio', ... }`). On résout la
 * référence ici : chaque entrée porte directement son type et son libellé
 * français, le composant n'a plus de table de correspondance à gérer.
 */
export default class PerformanceModel {
  /**
   * @param {object} data Objet brut renvoyé par l'API (contenu de `data`).
   */
  constructor(data) {
    this.userId = data.userId;

    this.data = (data.data ?? []).map((item) => {
      const kind = data.kind?.[item.kind] ?? '';

      return {
        value: item.value,
        kind,
        label: KIND_LABELS[kind] ?? kind,
      };
    });
  }
}
