/**
 * Utility functions for generating user-specific localStorage keys
 */

/**
 * Generate a storage key with user ID
 * @param {string} key - Base key name (e.g., 'routines', 'events', 'stats_history')
 * @param {string} userId - User ID
 * @returns {string|null} - User-specific storage key or null if no userId
 */
export const getStorageKey = (key, userId) => {
    if (!userId) return null;
    return `myday_${key}_${userId}`;
};

/**
 * Get all storage keys for a specific user
 * @param {string} userId - User ID
 * @returns {object} - Object with all storage keys for the user
 */
export const getUserStorageKeys = (userId) => {
    return {
        routines: getStorageKey('routines', userId),
        lastReset: getStorageKey('last_reset', userId),
        events: getStorageKey('events', userId),
        statsHistory: getStorageKey('stats_history', userId),
    };
};

/**
 * Clear all data for a specific user
 * @param {string} userId - User ID
 */
export const clearUserData = (userId) => {
    const keys = getUserStorageKeys(userId);
    Object.values(keys).forEach(key => {
        if (key) {
            localStorage.removeItem(key);
        }
    });
};
