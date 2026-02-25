import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { invoiceApi } from '../services/api/invoiceApi';
import { Invoice } from '@/types/invoice';

const USE_API = false; // Disabled - will re-enable when APIs are ready

interface InvoiceContextType {
    invoices: Invoice[];
    addInvoice: (invoice: Invoice) => Promise<void>;
    updateInvoice: (id: string, invoice: Invoice) => Promise<void>;
    deleteInvoice: (id: string) => Promise<void>;
    getInvoice: (id: string) => Invoice | undefined;
    loading: boolean;
    refreshInvoices: () => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: ReactNode }) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);

    // Initialize from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('invoices');
        if (saved) setInvoices(JSON.parse(saved));
    }, []);

    const saveToStorage = (data: Invoice[]) => {
        localStorage.setItem('invoices', JSON.stringify(data));
    };

    const refreshInvoices = useCallback(async () => {
        if (!USE_API) return;

        setLoading(true);
        try {
            const result = await invoiceApi.getAll();
            if (result.success && result.data) {
                setInvoices(result.data);
                saveToStorage(result.data);
            }
        } catch (error) {
            console.error('Failed to refresh invoices:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch on mount
    useEffect(() => {
        if (USE_API) {
            refreshInvoices();
        }
    }, [refreshInvoices]);

    const addInvoice = useCallback(async (invoice: Invoice) => {
        if (USE_API) {
            setLoading(true);
            try {
                const result = await invoiceApi.create(invoice);
                if (result.success && result.data) {
                    setInvoices(prev => {
                        const updated = [result.data!, ...prev];
                        saveToStorage(updated);
                        return updated;
                    });
                } else {
                    throw new Error(result.error || 'Failed to create invoice');
                }
            } catch (error) {
                console.error('Failed to add invoice:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        } else {
            setInvoices(prev => {
                const updated = [invoice, ...prev];
                saveToStorage(updated);
                return updated;
            });
        }
    }, []);

    const updateInvoice = useCallback(async (id: string, invoice: Invoice) => {
        if (USE_API) {
            setLoading(true);
            try {
                const result = await invoiceApi.update(id, invoice);
                if (result.success && result.data) {
                    setInvoices(prev => {
                        const updated = prev.map(inv => inv.id === id ? result.data! : inv);
                        saveToStorage(updated);
                        return updated;
                    });
                } else {
                    throw new Error(result.error || 'Failed to update invoice');
                }
            } catch (error) {
                console.error('Failed to update invoice:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        } else {
            setInvoices(prev => {
                const updated = prev.map(inv => inv.id === id ? invoice : inv);
                saveToStorage(updated);
                return updated;
            });
        }
    }, []);

    const deleteInvoice = useCallback(async (id: string) => {
        if (USE_API) {
            setLoading(true);
            try {
                const result = await invoiceApi.delete(id);
                if (result.success) {
                    setInvoices(prev => {
                        const updated = prev.filter(inv => inv.id !== id);
                        saveToStorage(updated);
                        return updated;
                    });
                } else {
                    throw new Error(result.error || 'Failed to delete invoice');
                }
            } catch (error) {
                console.error('Failed to delete invoice:', error);
                throw error;
            } finally {
                setLoading(false);
            }
        } else {
            setInvoices(prev => {
                const updated = prev.filter(inv => inv.id !== id);
                saveToStorage(updated);
                return updated;
            });
        }
    }, []);

    const getInvoice = useCallback((id: string) => {
        return invoices.find(inv => inv.id === id);
    }, [invoices]);

    return (
        <InvoiceContext.Provider value={{
            invoices,
            addInvoice,
            updateInvoice,
            deleteInvoice,
            getInvoice,
            loading,
            refreshInvoices
        }}>
            {children}
        </InvoiceContext.Provider>
    );
}

export function useInvoices() {
    const context = useContext(InvoiceContext);
    if (context === undefined) {
        throw new Error('useInvoices must be used within a InvoiceProvider');
    }
    return context;
}
