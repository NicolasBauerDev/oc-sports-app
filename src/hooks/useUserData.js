import { useEffect, useState } from 'react'
import {
  getUser,
  getUserActivity,
  getUserAverageSessions,
  getUserPerformance,
} from '../services/userService.js'

/**
 * Charge l'ensemble des données d'un utilisateur et suit l'état du chargement.
 *
 * Les quatre ressources sont demandées en parallèle et livrées ensemble : le
 * tableau de bord n'a de sens qu'au complet, on évite donc de l'afficher par
 * morceaux. La contrepartie assumée est qu'une seule ressource en échec fait
 * échouer la page entière.
 *
 * L'état est regroupé dans un seul objet plutôt que dans trois `useState`
 * séparés : impossible de se retrouver avec un chargement terminé et des
 * données encore vides. L'objet mémorise aussi l'utilisateur auquel il
 * correspond, ce qui permet de déduire l'état « en chargement » au rendu au
 * lieu de le réinitialiser depuis l'effet.
 *
 * @param {string|number} rawUserId Identifiant de l'utilisateur, tel que reçu de
 *   l'URL. La conversion est faite ici pour pouvoir citer la valeur d'origine
 *   dans le message d'erreur.
 * @returns {{
 *   status: 'loading'|'success'|'error',
 *   data: {user: object, activity: object, averageSessions: object, performance: object}|null,
 *   error: Error|null
 * }}
 */
export default function useUserData(rawUserId) {
  const userId = Number(rawUserId)
  const isValidId = Number.isInteger(userId)

  const [state, setState] = useState({
    status: 'loading',
    data: null,
    error: null,
    userId: null,
  })

  useEffect(() => {
    if (!isValidId) return

    // Si `userId` change avant la fin des appels, le nettoyage passe `ignore` à
    // `true` et la réponse devenue obsolète n'est pas appliquée.
    let ignore = false

    Promise.all([
      getUser(userId),
      getUserActivity(userId),
      getUserAverageSessions(userId),
      getUserPerformance(userId),
    ])
      .then(([user, activity, averageSessions, performance]) => {
        if (ignore) return

        setState({
          status: 'success',
          data: { user, activity, averageSessions, performance },
          error: null,
          userId,
        })
      })
      .catch((error) => {
        if (ignore) return

        setState({ status: 'error', data: null, error, userId })
      })

    return () => {
      ignore = true
    }
  }, [userId, isValidId])

  if (!isValidId) {
    return {
      status: 'error',
      data: null,
      error: new Error(`Identifiant d'utilisateur invalide : « ${rawUserId} »`),
    }
  }

  // L'état en mémoire porte encore sur un autre utilisateur : les données du
  // nouveau sont en route.
  if (state.userId !== userId) {
    return { status: 'loading', data: null, error: null }
  }

  return state
}
