import { apiRequest } from './core';
import { Quotation } from '@/types/quotation';

export const publicQuotationApi = {
    getQuotation: async (token: string) => {
        // Use apiRequest directly
        const response = await apiRequest<Quotation>(`/public/quotation/${token}`, 'GET');

        if (!response.success || !response.data) {
            throw new Error(response.error || 'Failed to fetch quotation');
        }

        return response.data;
    },

    respond: async (token: string, data: {
        action: 'approve' | 'reject' | 'request-changes',
        comments?: string,
        reasons?: string,
        requestedChanges?: string[]
    }) => {
        const response = await apiRequest<any>(`/public/quotation/${token}/respond`, 'POST', data);

        if (!response.success) {
            throw new Error(response.error || 'Failed to submit response');
        }

        return response.data || { message: 'Success' };
    }
};
