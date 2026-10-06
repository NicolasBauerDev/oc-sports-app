/**
 * Informations générales de l'utilisateur, issues de `GET /user/:id`.
 *
 * C'est ici que se règle la principale incohérence de l'API : le score du jour
 * est exposé sous `todayScore` pour certains utilisateurs et sous `score` pour
 * d'autres. Le reste de l'application ne connaît que `score`.
 */
export default class UserModel {
  /**
   * @param {object} data Objet brut renvoyé par l'API (contenu de `data`).
   */
  constructor(data) {
    this.id = data.id;

    this.firstName = data.userInfos?.firstName ?? '';
    this.lastName = data.userInfos?.lastName ?? '';
    this.age = data.userInfos?.age ?? null;

    /** Score du jour, entre 0 et 1. */
    this.score = data.todayScore ?? data.score ?? 0;

    /** Chiffres clés de la journée, en valeurs brutes (non formatées). */
    this.keyData = {
      calorieCount: data.keyData?.calorieCount ?? 0,
      proteinCount: data.keyData?.proteinCount ?? 0,
      carbohydrateCount: data.keyData?.carbohydrateCount ?? 0,
      lipidCount: data.keyData?.lipidCount ?? 0,
    };
  }
}
