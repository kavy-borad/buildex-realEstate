import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { quotationApi } from '../services/api/quotationApi';
import { settingsApi } from '../services/api/miscApi';
import { Quotation, CompanyDetails } from '@/types/quotation';

const USE_API = true; // Enabled! Now using live API endpoints

interface QuotationContextType {
  quotations: Quotation[];
  companyDetails: CompanyDetails;
  addQuotation: (quotation: Quotation) => Promise<Quotation | void>;
  updateQuotation: (id: string, quotation: Quotation) => Promise<void>;
  deleteQuotation: (id: string) => Promise<void>;
  getQuotation: (id: string) => Quotation | undefined;
  updateCompanyDetails: (details: CompanyDetails) => Promise<void>;
  loading: boolean;
  refreshQuotations: () => Promise<void>;
}

const defaultCompanyDetails: CompanyDetails = {
  name: 'BuildEx Construction',
  address: 'Mumbai, India',
  phone: '+91 98765 43210',
  email: 'info@buildex.com',
  gstNumber: '27AABCU9603R1ZM',
};

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export function QuotationProvider({ children }: { children: ReactNode }) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>(defaultCompanyDetails);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedQuotes = localStorage.getItem('quotations');
    if (savedQuotes) setQuotations(JSON.parse(savedQuotes));

    const savedCompany = localStorage.getItem('companyDetails');
    if (savedCompany) setCompanyDetails(JSON.parse(savedCompany));
  }, []);

  const saveToStorage = (data: Quotation[]) => {
    localStorage.setItem('quotations', JSON.stringify(data));
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Refresh Quotations
  // ─────────────────────────────────────────────────────────────────────────
  const refreshQuotations = useCallback(async () => {
    if (!USE_API) return;

    setLoading(true);
    try {
      const result = await quotationApi.getAll();
      if (result.success && result.data) {
        setQuotations(result.data);
        saveToStorage(result.data);
      }
    } catch (error) {
      console.error('Failed to refresh quotations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Company details are loaded from localStorage on mount (line 40-41).
  // They are only updated when the user explicitly saves from the Settings page.

  // ─────────────────────────────────────────────────────────────────────────
  // Add Quotation
  // ─────────────────────────────────────────────────────────────────────────
  const addQuotation = useCallback(async (quotation: Quotation) => {
    if (USE_API) {
      setLoading(true);
      try {
        const result = await quotationApi.create(quotation);
        if (result.success && result.data) {
          setQuotations(prev => {
            const updated = [result.data!, ...prev];
            saveToStorage(updated);
            return updated;
          });
          return result.data; // Return the saved object
        } else {
          throw new Error(result.error || 'Failed to create quotation');
        }
      } catch (error) {
        console.error('Failed to add quotation:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      setQuotations(prev => {
        const updated = [quotation, ...prev];
        saveToStorage(updated);
        return updated;
      });
      return quotation;
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Update Quotation
  // ─────────────────────────────────────────────────────────────────────────
  const updateQuotation = useCallback(async (id: string, quotation: Quotation) => {
    if (USE_API) {
      setLoading(true);
      try {
        const result = await quotationApi.update(id, quotation);
        if (result.success && result.data) {
          setQuotations(prev => {
            const updated = prev.map(q => q.id === id ? result.data! : q);
            saveToStorage(updated);
            return updated;
          });
        } else {
          throw new Error(result.error || 'Failed to update quotation');
        }
      } catch (error) {
        console.error('Failed to update quotation:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      setQuotations(prev => {
        const updated = prev.map(q => q.id === id ? quotation : q);
        saveToStorage(updated);
        return updated;
      });
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Delete Quotation
  // ─────────────────────────────────────────────────────────────────────────
  const deleteQuotation = useCallback(async (id: string) => {
    if (USE_API) {
      setLoading(true);
      try {
        const result = await quotationApi.delete(id);
        if (result.success) {
          setQuotations(prev => {
            const updated = prev.filter(q => q.id !== id);
            saveToStorage(updated);
            return updated;
          });
        } else {
          throw new Error(result.error || 'Failed to delete quotation');
        }
      } catch (error) {
        console.error('Failed to delete quotation:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      setQuotations(prev => {
        const updated = prev.filter(q => q.id !== id);
        saveToStorage(updated);
        return updated;
      });
    }
  }, []);

  const updateCompanyDetails = useCallback(async (details: CompanyDetails) => {
    setCompanyDetails(details);
    localStorage.setItem('companyDetails', JSON.stringify(details));

    if (USE_API) {
      try {
        await settingsApi.update({ companyDetails: details });
      } catch (error) {
        console.error('Failed to update company details on server:', error);
      }
    }
  }, []);

  const getQuotation = useCallback((id: string) => {
    return quotations.find(q => q.id === id);
  }, [quotations]);

  return (
    <QuotationContext.Provider value={{
      quotations,
      companyDetails,
      updateCompanyDetails,
      addQuotation,
      updateQuotation,
      deleteQuotation,
      getQuotation,
      loading,
      refreshQuotations
    }}>
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotations() {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error('useQuotations must be used within a QuotationProvider');
  }
  return context;
}
