/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 💬 CLIENT FEEDBACK API SERVICE
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { apiRequest, ApiResponse } from './core';

export const feedbackApi = {
    /**
     * Submit client feedback for a quotation
     */
    submitFeedback: async (quotationId: string, feedbackData: {
        action: 'approve' | 'reject' | 'request-changes';
        comments?: string;
        rejectionReason?: string;
        requestedChanges?: string[];
    }) => {
        return apiRequest(
            `/quotations/${quotationId}/feedback`,
            'POST',
            feedbackData
        );
    },

    /**
     * Get feedback for a specific quotation
     */
    getFeedback: async (quotationId: string) => {
        return apiRequest(`/quotations/${quotationId}/feedback`, 'GET');
    },

    /**
     * Get all quotations with feedback
     */
    getAllWithFeedback: async (filters?: {
        status?: string;
        clientStatus?: string;
    }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.clientStatus) params.append('clientStatus', filters.clientStatus);

        const queryString = params.toString() ? `?${params.toString()}` : '';
        return apiRequest(`/quotations/feedback/all${queryString}`, 'GET');
    },

    /**
     * Get feedback statistics
     */
    getStatistics: async () => {
        return apiRequest('/feedback/statistics', 'GET');
    }
};
