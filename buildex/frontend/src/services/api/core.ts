
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔌 CORE API CLIENT
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

/**
 * Helper to get headers
 */
const getHeaders = (isJson = true): HeadersInit => {
    const headers: HeadersInit = {};
    if (isJson) {
        headers['Content-Type'] = 'application/json';
    }
    const token = localStorage.getItem('auth_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`; // Remove double quotes if stored incorrectly
    }
    return headers;
};


/**
 * Generic request handler
 */
export async function apiRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    body?: any
): Promise<ApiResponse<T>> {
    try {
        const headers = getHeaders();
        const config: RequestInit = {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Handle specific status codes
        if (response.status === 401) {
            // Handle unauthorized globally if needed
            // window.location.href = '/login';
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message || responseData.error || `HTTP error! status: ${response.status}`);
            }
            return {
                success: responseData.success ?? true,
                data: responseData.data,
                message: responseData.message || 'Operation successful'
            };
        } else {
            // Handle non-JSON (text/html) errors
            const text = await response.text();
            if (!response.ok) {
                throw new Error(text || `HTTP error! status: ${response.status}`);
            }
            // Fallback for success non-json
            return { success: true, message: 'Request successful' } as any;
        }

    } catch (error) {
        console.error(`API Error [${method} ${endpoint}]:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * File Download Handler
 */
export async function apiDownload(
    endpoint: string,
    filename?: string,
    method: 'GET' | 'POST' = 'GET',
    body?: any
): Promise<boolean> {
    try {
        const headers = getHeaders(true); // Content-Type json for sending body if POST

        const config: RequestInit = {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const jsonError = JSON.parse(errorText);
                throw new Error(jsonError.message || 'Download failed');
            } catch (e) {
                throw new Error(`Download failed: ${response.statusText}`);
            }
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Try to get filename from header
        let downloadName = filename || 'download.pdf';
        const disposition = response.headers.get('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                downloadName = matches[1].replace(/['"]/g, '');
            }
        }

        a.download = downloadName;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return true;

    } catch (error) {
        console.error('Download Error:', error);
        throw error;
    }
}
