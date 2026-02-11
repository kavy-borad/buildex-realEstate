// Auto-Login Configuration for Buildex
// Since this is a single admin system, we can auto-login

export const AUTO_LOGIN_CONFIG = {
    enabled: true, // Set to false to disable auto-login
    credentials: {
        email: 'admin@buildex.com',
        password: 'admin123'
    },
    // Auto-login will only work if:
    // 1. User is not already logged in
    // 2. No saved session exists
    // 3. Backend is available
};

// How long to keep user logged in (in days)
export const SESSION_DURATION_DAYS = 365; // 1 year

/**
 * NOTE: This is secure for single-user admin systems.
 * For multi-user systems, disable AUTO_LOGIN_CONFIG.enabled
 */
