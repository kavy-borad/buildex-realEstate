/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚙️ SETTINGS & DASHBOARD API SERVICE
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { CompanyDetails } from '@/types/quotation';
import { apiRequest, ApiResponse } from './core';

export const settingsApi = {
    get: async (): Promise<ApiResponse<any>> => {
        return apiRequest<any>('/settings', 'GET');
    },

    update: async (settings: any): Promise<ApiResponse<any>> => {
        return apiRequest<any>('/settings', 'PUT', settings);
    },

    getCompanyDetails: async (): Promise<ApiResponse<CompanyDetails>> => {
        const response = await apiRequest<any>('/settings', 'GET');
        if (response.success && response.data) {
            return {
                success: true,
                data: response.data.companyDetails
            };
        }
        return { success: false, error: response.error };
    }
};

export const dashboardApi = {
    getStats: async (): Promise<ApiResponse<any>> => {
        return apiRequest<any>('/dashboard/stats', 'GET');
    }
};

export const notificationApi = {
    getAll: async (): Promise<ApiResponse<any>> => {
        return apiRequest<any>('/notifications', 'GET');
    },
    markAsRead: async (id: string): Promise<ApiResponse<any>> => {
        return apiRequest<any>(`/notifications/${id}/read`, 'PUT');
    },
    markAllAsRead: async (): Promise<ApiResponse<any>> => {
        return apiRequest<any>('/notifications/read-all', 'PUT');
    },
    delete: async (id: string): Promise<ApiResponse<any>> => {
        return apiRequest<any>(`/notifications/${id}`, 'DELETE');
    }
};
