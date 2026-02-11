/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔌 CORE API CLIENT
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const API_BASE_URL = '/api';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

/**
 * Generic request handler
 */
export async function apiRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    body?: any
): Promise<ApiResponse<T>> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const token = localStorage.getItem('auth_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Handle non-JSON responses (like 404 HTML pages)
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Server error: ${text || response.statusText}`);
        }

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || responseData.error || `HTTP error! status: ${response.status}`);
        }

        // Backend returns {success: true, data: ...}
        // Extract the data field to avoid double wrapping
        return {
            success: responseData.success ?? true,
            data: responseData.data,
            message: responseData.message || 'Operation successful'
        };
    } catch (error) {
        console.error(`API Error [${method} ${endpoint}]:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}
