// Auto-Login Configuration for Buildex
// Since this is a single admin system, we can auto-login

export const AUTO_LOGIN_CONFIG = {
    enabled: true,
    credentials: {
        email: 'admin@buildex.io',
        password: 'Admin@123'
    },
};

// How long to keep user logged in (in days)
export const SESSION_DURATION_DAYS = 365; // 1 year

/**
 * NOTE: This is secure for single-user admin systems.
 * For multi-user systems, disable AUTO_LOGIN_CONFIG.enabled
 */
