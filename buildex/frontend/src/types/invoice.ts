export interface InvoiceItem {
    id: string;
    itemName: string;
    quantity: number;
    unit: string;
    rate: number;
    total: number;
}

export interface InvoiceSummary {
    subtotal: number;
    gstPercentage: number;
    gstAmount: number;
    discount: number;
    grandTotal: number;
}

export interface PaymentRecord {
    id: string;
    amount: number;
    paymentDate: string;
    paymentMethod: 'Cash' | 'Cheque' | 'Online' | 'Bank Transfer' | 'UPI' | 'Other';
    notes?: string;
    recordedAt: string;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    quotationId: string;
    clientDetails: {
        name: string;
        phone: string;
        email: string;
        siteAddress: string;
    };
    projectDetails: {
        projectType: string;
        builtUpArea: number;
        areaUnit: string;
        city: string;
        area: string;
        constructionQuality: 'basic' | 'standard' | 'premium';
    };
    items: InvoiceItem[];
    summary: InvoiceSummary;
    paymentStatus: 'Pending' | 'Partial' | 'Paid' | 'Overdue';
    paidAmount: number;
    balanceAmount: number;
    issueDate: string;
    dueDate: string;
    paymentHistory: PaymentRecord[];
    notes?: string;
    status: 'draft' | 'sent' | 'viewed' | 'paid' | 'cancelled';
    createdAt: string;
}
