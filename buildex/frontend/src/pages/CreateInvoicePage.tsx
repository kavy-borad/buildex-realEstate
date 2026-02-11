import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Receipt,
    Calendar,
    FileText,
    CheckCircle2
} from 'lucide-react';
import { useQuotations } from '@/contexts/QuotationContext';
import { useInvoices } from '@/contexts/InvoiceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Invoice } from '@/types/invoice';

export default function CreateInvoicePage() {
    const { quotationId } = useParams<{ quotationId: string }>();
    const navigate = useNavigate();
    const { getQuotation } = useQuotations();
    const { addInvoice } = useInvoices();
    const { toast } = useToast();

    const quotation = quotationId ? getQuotation(quotationId) : undefined;

    // ... (rest of code)

    // Handle create invoice
    const handleCreateInvoice = async () => {
        if (!quotation) return;

        try {
            // Create invoice object (backend will override id and invoiceNumber)
            const invoiceData: any = {
                quotationId: quotation.id,
                clientDetails: quotation.clientDetails,
                projectDetails: quotation.projectDetails,
                items: quotation.costItems,
                summary: quotation.summary,
                paymentStatus: 'Pending',
                paidAmount: 0,
                balanceAmount: quotation.summary.grandTotal,
                issueDate: new Date().toISOString(),
                dueDate: new Date(dueDate).toISOString(),
                paymentHistory: [],
                notes: note,
                status: 'draft',
            };

            await addInvoice(invoiceData); // Async call

            toast({
                title: 'Invoice Created!',
                description: `Invoice has been generated successfully.`,
            });

            navigate('/invoices'); // Navigate to list
        } catch (error) {
            console.error('Error creating invoice:', error);
            toast({
                title: 'Error',
                description: 'Failed to create invoice.',
                variant: 'destructive',
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen px-6 py-4 bg-background/50"
        >
            {/* Header */}
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-xl border-border/50 bg-background/50 hover:bg-background"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 w-fit">
                            Create Invoice
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Convert quotation to invoice
                        </p>
                    </div>
                </div>

                {/* Quotation Summary Card */}
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-blue-500/10">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Source Quotation</h2>
                            <p className="text-sm text-muted-foreground">#{quotation.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Client</p>
                            <p className="text-lg font-semibold text-foreground">{quotation.clientDetails.name}</p>
                            <p className="text-sm text-muted-foreground">{quotation.clientDetails.phone}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Project Type</p>
                            <p className="text-lg font-semibold text-foreground">{quotation.projectDetails.projectType}</p>
                            <p className="text-sm text-muted-foreground">{quotation.projectDetails.city}, {quotation.projectDetails.area}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Quotation Date</p>
                            <p className="text-base font-medium text-foreground">
                                {new Date(quotation.clientDetails.quotationDate).toLocaleDateString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                ₹{quotation.summary.grandTotal.toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Invoice Details Form */}
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-emerald-500/10">
                            <Receipt className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Invoice Details</h2>
                            <p className="text-sm text-muted-foreground">Set payment terms and due date</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="issueDate">Issue Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="issueDate"
                                        type="date"
                                        value={new Date().toISOString().split('T')[0]}
                                        disabled
                                        className="pl-10 bg-muted/50 border-border/50 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dueDate">Due Date <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="pl-10 bg-background/50 border-border/50 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <textarea
                                id="notes"
                                placeholder="Add payment terms, instructions, or special notes..."
                                value={note}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all resize-none text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="rounded-xl border-border/50 hover:bg-muted/50"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateInvoice}
                        className="rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm text-white transition-all"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Create Invoice
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
