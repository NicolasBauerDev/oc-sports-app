/** URL du backend NodeJS. Voir `.env.example`. */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/** Travailler sur les mocks plutôt que sur le backend. */
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

/** Source de données réellement utilisée. Pratique à afficher en développement. */
export const dataSource = USE_MOCKS ? 'mocks' : API_URL

/**
 * Erreur d'appel à l'API, enrichie du statut HTTP quand il est connu.
 *
 * Elle permet à l'interface de distinguer un utilisateur introuvable (404) d'un
 * serveur éteint (`status` à `null`).
 */
export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number|null} status Statut HTTP, ou `null` en cas de panne réseau.
   * @param {object} [options] Options d'`Error` (notamment `cause`).
   */
  constructor(message, status, options) {
    super(message, options)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Appelle le backend et renvoie le contenu de l'enveloppe `{ data: ... }`.
 *
 * @param {string} endpoint Chemin de la ressource, par exemple `/user/12`.
 * @returns {Promise<object>} Objet brut, tel que renvoyé par l'API.
 * @throws {ApiError}
 */
async function request(endpoint) {
  let response

  try {
    response = await fetch(`${API_URL}${endpoint}`)
  } catch (cause) {
    // `fetch` ne rejette que sur une panne réseau : backend éteint, DNS, CORS.
    throw new ApiError(
      `Serveur injoignable sur ${API_URL}. Le backend est-il démarré ?`,
      null,
      { cause },
    )
  }

  if (!response.ok) {
    throw new ApiError(
      response.status === 404
        ? `Utilisateur introuvable (${endpoint})`
        : `Le serveur a répondu ${response.status} (${endpoint})`,
      response.status,
    )
  }

  const body = await response.json()

  if (body?.data === undefined) {
    throw new ApiError(
      `Réponse inattendue sur ${endpoint} : la propriété \`data\` est absente`,
      response.status,
    )
  }

  return body.data
}

/**
 * Récupère une ressource, depuis les mocks ou depuis le backend selon
 * `VITE_USE_MOCKS`. Dans les deux cas l'objet renvoyé est déjà sorti de son
 * enveloppe : les deux sources sont interchangeables pour les appelants.
 *
 * @param {string} endpoint Chemin de la ressource côté backend.
 * @param {() => Promise<{data: object}>} mockFetcher Équivalent mocké, déjà lié à l'utilisateur.
 * @returns {Promise<object>}
 */
export async function getResource(endpoint, mockFetcher) {
  if (USE_MOCKS) {
    const { data } = await mockFetcher()
    return data
  }

  return request(endpoint)
}
