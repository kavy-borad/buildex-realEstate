/**
 * ═══════════════════════════════════════════════════════════════
 * 📊 LOG API SERVICE - Fetches system logs for the Log Viewer
 * ═══════════════════════════════════════════════════════════════
 */

import { API_BASE_URL } from './core';

const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('auth_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const logApi = {
    /**
     * Fetch logs with filtering & pagination
     */
    getLogs: async (params?: { limit?: number; page?: number; filter?: string; method?: string; status?: string }) => {
        const query = new URLSearchParams();
        if (params?.limit) query.set('limit', String(params.limit));
        if (params?.page) query.set('page', String(params.page));
        if (params?.filter) query.set('filter', params.filter);
        if (params?.method) query.set('method', params.method);
        if (params?.status) query.set('status', params.status);
        query.set('_t', Date.now().toString()); // Prevent browser caching

        const res = await fetch(`${API_BASE_URL}/logs?${query.toString()}`, {
            headers: getHeaders(),
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to fetch logs');
        return res.json();
    },

    /**
     * Fetch summary stats (Total, Success, Errors, Avg Time)
     */
    getStats: async () => {
        const res = await fetch(`${API_BASE_URL}/logs/stats?_t=${Date.now()}`, {
            headers: getHeaders(),
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
    },

    /**
     * Fetch live logs since a given timestamp (for real-time polling)
     */
    getLiveLogs: async (since?: string) => {
        const query = since ? `?since=${encodeURIComponent(since)}&_t=${Date.now()}` : `?_t=${Date.now()}`;
        const res = await fetch(`${API_BASE_URL}/logs/live${query}`, {
            headers: getHeaders(),
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to fetch live logs');
        return res.json();
    },

    /**
     * Clear all logs
     */
    clearLogs: async () => {
        const res = await fetch(`${API_BASE_URL}/logs`, { method: 'DELETE', headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to clear logs');
        return res.json();
    },
};
