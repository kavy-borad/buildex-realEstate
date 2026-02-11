/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧾 INVOICE API SERVICE
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Invoice } from '@/types/invoice';
import { apiRequest, ApiResponse } from './core';

// Transform backend data format to frontend format
const transformInvoice = (data: any): Invoice => {
    return {
        ...data,
        id: data._id,
        // Ensure client details are flattened/mapped correctly
        clientDetails: {
            name: data.client?.name || '',
            phone: data.client?.phone || '',
            email: data.client?.email || '',
            siteAddress: data.client?.address || ''
        },
        quotationId: data.quotation?._id || data.quotation
    };
};

export const invoiceApi = {
    // Create Invoice
    create: async (invoice: Partial<Invoice>): Promise<ApiResponse<Invoice>> => {
        const response = await apiRequest<any>('/invoices', 'POST', invoice);
        if (response.success && response.data) {
            response.data = transformInvoice(response.data);
        }
        return response;
    },

    // Get All Invoices
    getAll: async (filters?: any): Promise<ApiResponse<Invoice[]>> => {
        let query = '';
        if (filters) {
            const params = new URLSearchParams(filters);
            query = `?${params.toString()}`;
        }

        const response = await apiRequest<any[]>(`/invoices${query}`, 'GET');

        if (response.success && response.data) {
            response.data = response.data.map(transformInvoice);
        }
        return response as ApiResponse<Invoice[]>;
    },

    // Get Single Invoice
    getById: async (id: string): Promise<ApiResponse<Invoice>> => {
        const response = await apiRequest<any>(`/invoices/${id}`, 'GET');
        if (response.success && response.data) {
            response.data = transformInvoice(response.data);
        }
        return response as ApiResponse<Invoice>;
    },

    // Update Invoice
    update: async (id: string, updates: Partial<Invoice>): Promise<ApiResponse<Invoice>> => {
        const response = await apiRequest<any>(`/invoices/${id}`, 'PUT', updates);
        if (response.success && response.data) {
            response.data = transformInvoice(response.data);
        }
        return response;
    },

    // Delete Invoice
    delete: async (id: string): Promise<ApiResponse<void>> => {
        return apiRequest<void>(`/invoices/${id}`, 'DELETE');
    },

    // Update Status
    updateStatus: async (id: string, status: string): Promise<ApiResponse<Invoice>> => {
        const response = await apiRequest<any>(`/invoices/${id}/status`, 'PATCH', { status });
        if (response.success && response.data) {
            response.data = transformInvoice(response.data);
        }
        return response;
    },

    // Get Stats
    getStats: async (): Promise<ApiResponse<any>> => {
        return apiRequest<any>('/invoices/stats', 'GET');
    }
};
