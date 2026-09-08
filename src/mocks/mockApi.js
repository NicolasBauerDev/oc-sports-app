import {
  USER_ACTIVITY,
  USER_AVERAGE_SESSIONS,
  USER_MAIN_DATA,
  USER_PERFORMANCE,
} from './data.js'

/**
 * Imite une réponse du backend : les fonctions sont asynchrones et renvoient la
 * même enveloppe `{ data: ... }` que l'API réelle, et lèvent une erreur quand
 * l'identifiant est inconnu (le backend répond alors 404).
 *
 * Le service pourra donc basculer entre le mock et l'API sans que la couche de
 * normalisation, ni les composants, voient la différence.
 *
 * @param {Array<object>} collection Jeu de données mocké.
 * @param {string} idKey Nom de la propriété portant l'identifiant (`id` ou `userId`).
 * @param {number} userId Identifiant recherché.
 * @returns {Promise<{data: object}>}
 */
async function respond(collection, idKey, userId) {
  const found = collection.find((entry) => entry[idKey] === userId)

  if (!found) {
    throw new Error(`Utilisateur ${userId} introuvable`)
  }

  return { data: found }
}

/** Imite `GET /user/:id`. */
export function fetchMockUser(userId) {
  return respond(USER_MAIN_DATA, 'id', userId)
}

/** Imite `GET /user/:id/activity`. */
export function fetchMockUserActivity(userId) {
  return respond(USER_ACTIVITY, 'userId', userId)
}

/** Imite `GET /user/:id/average-sessions`. */
export function fetchMockUserAverageSessions(userId) {
  return respond(USER_AVERAGE_SESSIONS, 'userId', userId)
}

/** Imite `GET /user/:id/performance`. */
export function fetchMockUserPerformance(userId) {
  return respond(USER_PERFORMANCE, 'userId', userId)
}
