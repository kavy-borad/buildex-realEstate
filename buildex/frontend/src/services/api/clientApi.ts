/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 👥 CLIENT API SERVICE
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { apiRequest, ApiResponse } from './core';

export interface Client {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    totalQuotations: number;
    totalInvoices: number;
    totalRevenue: number;
    status: 'active' | 'inactive';
    createdAt: string;
}

export const clientApi = {
    getAll: async (search?: string): Promise<ApiResponse<Client[]>> => {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        return apiRequest<Client[]>(`/clients${query}`, 'GET');
    },

    getById: async (id: string): Promise<ApiResponse<any>> => {
        return apiRequest<any>(`/clients/${id}`, 'GET');
    },

    create: async (client: Partial<Client>): Promise<ApiResponse<Client>> => {
        return apiRequest<Client>('/clients', 'POST', client);
    },

    update: async (id: string, updates: Partial<Client>): Promise<ApiResponse<Client>> => {
        return apiRequest<Client>(`/clients/${id}`, 'PUT', updates);
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
        return apiRequest<void>(`/clients/${id}`, 'DELETE');
    },

    getStats: async (): Promise<ApiResponse<any>> => {
        return apiRequest<any>('/clients/stats', 'GET');
    }
};
