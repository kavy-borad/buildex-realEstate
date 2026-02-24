/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📋 QUOTATION API SERVICE
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Quotation } from '@/types/quotation';
import { apiRequest, apiDownload, ApiResponse } from './core';

export interface ShareableLinkData {
    accessToken: string;
    shareableUrl: string;
    expiresAt: string;
}

export const quotationApi = {
    /**
     * Get all quotations
     */
    getAll: async (params?: any): Promise<ApiResponse<Quotation[]>> => {
        // Construct query string
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiRequest<Quotation[]>(`/quotations${queryString}`, 'GET');
    },

    /**
     * Get single quotation by ID
     */
    getById: async (id: string): Promise<ApiResponse<Quotation>> => {
        return apiRequest<Quotation>(`/quotations/${id}`, 'GET');
    },

    /**
     * Create new quotation
     */
    create: async (quotation: Quotation): Promise<ApiResponse<Quotation>> => {
        return apiRequest<Quotation>('/quotations', 'POST', quotation);
    },

    /**
     * Update existing quotation
     */
    update: async (id: string, quotation: Quotation): Promise<ApiResponse<Quotation>> => {
        return apiRequest<Quotation>(`/quotations/${id}`, 'PUT', quotation);
    },

    /**
     * Delete quotation
     */
    delete: async (id: string): Promise<ApiResponse<void>> => {
        return apiRequest<void>(`/quotations/${id}`, 'DELETE');
    },

    /**
     * Get shareable link for client
     */
    getShareableLink: async (quotationId: string): Promise<ShareableLinkData> => {
        const response = await apiRequest<ShareableLinkData>(`/quotations/${quotationId}/shareable-link`, 'GET');

        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to generate shareable link');
        }

        return response.data;
    },

    /**
     * Download PDF (Server Side Generation)
     */
    downloadPdf: async (id: string): Promise<boolean> => {
        return apiDownload(`/pdf/${id}/download`);
    },

    /**
     * Preview PDF from Data (Server Side Generation)
     * Useful for unsaved drafts
     */
    previewPdf: async (quotationData: Partial<Quotation>): Promise<boolean> => {
        return apiDownload('/pdf/preview/download', 'Preview.pdf', 'POST', { previewData: quotationData });
    }
};
