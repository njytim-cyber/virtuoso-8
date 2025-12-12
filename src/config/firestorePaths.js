/**
 * Firestore path utilities
 * 6-segment paths required for Firestore collections/documents
 */

export const FIRESTORE_PATHS = {
    /**
     * User profile document path
     * @param {string} appId - Application ID
     * @param {string} uid - User ID
     * @returns {string} Path to user profile document (6 segments)
     */
    userProfile: (appId, uid) => `artifacts/${appId}/users/${uid}/user_data/profile`,

    /**
     * History entries collection path
     * @param {string} appId - Application ID
     * @param {string} uid - User ID
     * @returns {string} Path to history entries collection (5 segments)
     */
    historyEntries: (appId, uid) => `artifacts/${appId}/users/${uid}/history_entries`
};
