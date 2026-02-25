import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { QuotationProvider } from "@/contexts/QuotationContext";
import { InvoiceProvider } from "@/contexts/InvoiceContext";
import { AdminLayout } from "@/components/layout/AdminLayout";
import CreateInvoicePage from "@/pages/CreateInvoicePage";
import InvoiceListPage from "@/pages/InvoiceListPage";
import InvoicePreviewPage from "@/pages/InvoicePreviewPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import CreateQuotationPage from "@/pages/CreateQuotationPage";
import QuotationListPage from "@/pages/QuotationListPage";
import QuotationPreviewPage from "@/pages/QuotationPreviewPage";
import SettingsPage from "@/pages/SettingsPage";
import { PublicQuotationView } from "@/pages/PublicQuotationView";

import ClientsPage from "@/pages/ClientsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import ClientFeedbackPage from "@/pages/ClientFeedbackPage";
import NotFound from "./pages/NotFound";

import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes — NO providers needed, no extra API calls */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/quotation/view/:token" element={<PublicQuotationView />} />

              {/* Admin routes — wrapped in Quotation + Invoice providers */}
              <Route element={
                <QuotationProvider>
                  <InvoiceProvider>
                    <AdminLayout />
                  </InvoiceProvider>
                </QuotationProvider>
              }>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/create-quotation" element={<CreateQuotationPage />} />
                <Route path="/quotations" element={<QuotationListPage />} />
                <Route path="/quotation/:id" element={<QuotationPreviewPage />} />

                {/* Invoice Routes */}
                <Route path="/create-invoice" element={<CreateInvoicePage />} />
                <Route path="/invoices" element={<InvoiceListPage />} />
                <Route path="/invoice/:id" element={<InvoicePreviewPage />} />

                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/feedback" element={<ClientFeedbackPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
