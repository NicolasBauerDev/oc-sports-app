/**
 * Extrait le jour du mois d'une date au format `YYYY-MM-DD`.
 *
 * On découpe la chaîne plutôt que de passer par `new Date()` : une date ISO
 * sans heure est interprétée en UTC, et `getDate()` renverrait le jour
 * précédent pour tout visiteur situé sur un fuseau négatif.
 *
 * @param {string} isoDay
 * @returns {number}
 */
function getDayOfMonth(isoDay) {
  return Number(String(isoDay).split('-')[2]);
}

/**
 * Activité quotidienne, issue de `GET /user/:id/activity`.
 *
 * L'API datte chaque session (`2020-07-01`) alors que le graphique attend le
 * numéro du jour en abscisse : la conversion est faite ici, une fois pour
 * toutes. La date d'origine reste disponible sous `date`.
 */
export default class ActivityModel {
  /**
   * @param {object} data Objet brut renvoyé par l'API (contenu de `data`).
   */
  constructor(data) {
    this.userId = data.userId;

    this.sessions = (data.sessions ?? []).map((session) => ({
      date: session.day,
      day: getDayOfMonth(session.day),
      kilogram: session.kilogram,
      calories: session.calories,
    }));
  }
}
