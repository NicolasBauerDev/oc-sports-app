import {
    fetchMockUser,
    fetchMockUserActivity,
    fetchMockUserAverageSessions,
    fetchMockUserPerformance,
} from '../mocks/mockApi.js';
import {
    ActivityModel,
    AverageSessionsModel,
    PerformanceModel,
    UserModel,
} from '../models/index.js';
import { getResource } from './api.js';

/**
 * Seul point d'entrée aux données pour l'application.
 *
 * Chaque fonction récupère une ressource puis la fait passer par son modèle :
 * les composants React ne voient jamais ni `fetch`, ni le format brut de l'API.
 */

/**
 * Informations générales de l'utilisateur (US#5).
 *
 * @param {number} userId
 * @returns {Promise<UserModel>}
 */
export async function getUser(userId) {
    const raw = await getResource(`/user/${userId}`, () => fetchMockUser(userId));
    return new UserModel(raw);
}

/**
 * Activité quotidienne : poids et calories brûlées (US#6).
 *
 * @param {number} userId
 * @returns {Promise<ActivityModel>}
 */
export async function getUserActivity(userId) {
    const raw = await getResource(`/user/${userId}/activity`, () =>
        fetchMockUserActivity(userId),
    );
    return new ActivityModel(raw);
}

/**
 * Durée moyenne des sessions (US#7).
 *
 * @param {number} userId
 * @returns {Promise<AverageSessionsModel>}
 */
export async function getUserAverageSessions(userId) {
    const raw = await getResource(`/user/${userId}/average-sessions`, () =>
        fetchMockUserAverageSessions(userId),
    );
    return new AverageSessionsModel(raw);
}

/**
 * Types d'activité, pour le radar (US#9).
 *
 * @param {number} userId
 * @returns {Promise<PerformanceModel>}
 */
export async function getUserPerformance(userId) {
    const raw = await getResource(`/user/${userId}/performance`, () =>
        fetchMockUserPerformance(userId),
    );
    return new PerformanceModel(raw);
}
