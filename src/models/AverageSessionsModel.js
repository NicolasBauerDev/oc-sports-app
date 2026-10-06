/** Initiales des jours de la semaine, indexées sur `day - 1` (1 = lundi). */
const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/**
 * Durée moyenne des sessions, issue de `GET /user/:id/average-sessions`.
 *
 * L'API numérote les jours de 1 à 7, le graphique affiche `L M M J V S D` en
 * abscisse : la correspondance est établie ici plutôt que dans le composant.
 */
export default class AverageSessionsModel {
    /**
   * @param {object} data Objet brut renvoyé par l'API (contenu de `data`).
   */
    constructor(data) {
        this.userId = data.userId;

        this.sessions = (data.sessions ?? []).map((session) => ({
            day: session.day,
            label: DAY_LABELS[session.day - 1] ?? '',
            sessionLength: session.sessionLength,
        }));
    }
}
