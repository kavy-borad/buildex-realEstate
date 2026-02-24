import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileDown, Building2, Phone, Mail, MapPin, Printer, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Invoice } from '@/types/invoice';

export default function InvoicePreviewPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Get invoice from localStorage (temporary - replace with context/API later)
    const invoices: Invoice[] = JSON.parse(localStorage.getItem('invoices') || '[]');
    const invoice = invoices.find(inv => inv.id === id);

    // Company details (temporary - replace with context later)
    const companyDetails = {
        name: 'BuildEx Construction',
        tagline: 'Building Dreams into Reality',
        phone: '+91 98765 43210',
        email: 'info@buildex.com',
        address: '123 Construction Lane, Mumbai, India',
        gstNumber: '27AABCU9603R1ZM'
    };

    if (!invoice) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                    <Receipt className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Invoice Not Found</h2>
                <p className="text-muted-foreground mb-6 max-w-sm">
                    The invoice you are looking for does not exist or has been removed.
                </p>
                <Button asChild className="rounded-xl">
                    <Link to="/invoices">Back to Invoices</Link>
                </Button>
            </div>
        );
    }

    const handleDownloadPDF = () => {
        toast({
            title: 'PDF Download Started',
            description: 'Your invoice is being generated and downloaded.',
        });
        // TODO: Implement actual PDF generation
    };

    const handlePrint = () => {
        window.print();
    };

    const statusColors = {
        'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
        'Partial': 'bg-blue-50 text-blue-700 border-blue-200',
        'Paid': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Overdue': 'bg-red-50 text-red-700 border-red-200',
    };

    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8 print:p-0 print:bg-white">
            {/* Header Actions - Hidden in Print */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden"
            >
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-xl border-border/50 bg-background/50 hover:bg-background">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600">
                            Invoice Preview
                        </h1>
                        <p className="text-sm text-muted-foreground">#{invoice.invoiceNumber}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handlePrint} className="rounded-xl gap-2 border-border/50 bg-background/50 hover:bg-background">
                        <Printer className="w-4 h-4" />
                        <span className="hidden sm:inline">Print</span>
                    </Button>
                    <Button onClick={handleDownloadPDF} className="rounded-xl gap-2 bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/20 transition-all">
                        <FileDown className="w-4 h-4" />
                        Download PDF
                    </Button>
                </div>
            </motion.div>

            {/* Actual A4 Paper Preview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-[210mm] mx-auto bg-white shadow-2xl shadow-black/5 rounded-none md:rounded-sm min-h-[297mm] relative overflow-hidden print:shadow-none print:w-full print:max-w-none print:m-0"
            >
                {/* Decorative Top Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 print:print-color-adjust-exact" />

                <div className="p-8 md:p-12 space-y-8">

                    {/* Company Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-emerald-500/10 flex items-center justify-center print:border print:border-gray-200">
                                <Building2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{companyDetails.name}</h2>
                                <p className="text-gray-500 text-sm mt-1">{companyDetails.tagline}</p>
                            </div>
                        </div>
                        <div className="text-right text-sm text-gray-500 space-y-1">
                            <p className="font-medium text-gray-900">Contact Info</p>
                            <div className="flex items-center justify-end gap-2">
                                <span>{companyDetails.phone}</span>
                                <Phone className="w-3 h-3" />
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <span>{companyDetails.email}</span>
                                <Mail className="w-3 h-3" />
                            </div>
                            <div className="flex items-center justify-end gap-2 max-w-[200px] ml-auto">
                                <span className="truncate">{companyDetails.address}</span>
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Invoice Title & Status */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h3>
                            <p className="text-gray-500">Make payment to the following account</p>
                        </div>
                        <div className={cn("px-4 py-2 rounded-full text-sm font-semibold border", statusColors[invoice.paymentStatus])}>
                            {invoice.paymentStatus}
                        </div>
                    </div>

                    {/* Client Info & Invoice Details */}
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        {/* Client Info */}
                        <div className="flex-1 space-y-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bill To</h3>
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-gray-900">{invoice.clientDetails.name}</p>
                                <p className="text-gray-600">{invoice.clientDetails.siteAddress}</p>
                                <div className="pt-2 text-sm text-gray-500">
                                    <p>Phone: {invoice.clientDetails.phone}</p>
                                    <p>Email: {invoice.clientDetails.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="flex-1 md:text-right space-y-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Invoice Details</h3>
                            <div className="space-y-2">
                                <div className="flex md:justify-end gap-8">
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-gray-500">Invoice No.</p>
                                        <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-gray-500">Issue Date</p>
                                        <p className="font-semibold text-gray-900">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex md:justify-end gap-8">
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-gray-500">Due Date</p>
                                        <p className="font-semibold text-red-600">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-gray-500">Project Type</p>
                                        <p className="font-semibold text-gray-900">{invoice.projectDetails.projectType}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="mt-8 rounded-lg overflow-x-auto border border-gray-100">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-6 py-4 text-left">Item Description</th>
                                    <th className="px-6 py-4 text-center">Unit</th>
                                    <th className="px-6 py-4 text-center">Qty</th>
                                    <th className="px-6 py-4 text-right">Rate</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {invoice.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 text-gray-900 font-medium">{item.itemName}</td>
                                        <td className="px-6 py-4 text-center text-gray-500">{item.unit}</td>
                                        <td className="px-6 py-4 text-center text-gray-500">{item.quantity}</td>
                                        <td className="px-6 py-4 text-right text-gray-600">₹{item.rate.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 text-right text-gray-900 font-semibold">₹{item.total.toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col items-end pt-4">
                        <div className="w-full max-w-xs space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{invoice.summary.subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>GST ({invoice.summary.gstPercentage}%)</span>
                                <span>+ ₹{invoice.summary.gstAmount.toLocaleString('en-IN')}</span>
                            </div>
                            {invoice.summary.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>- ₹{invoice.summary.discount.toLocaleString('en-IN')}</span>
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-3 flex justify-between items-end">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-emerald-600">₹{invoice.summary.grandTotal.toLocaleString('en-IN')}</span>
                            </div>

                            {invoice.paidAmount > 0 && (
                                <>
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Paid Amount</span>
                                        <span>- ₹{invoice.paidAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="border-t border-emerald-200 pt-3 flex justify-between items-end">
                                        <span className="font-bold text-gray-900">Balance Due</span>
                                        <span className="text-2xl font-bold text-red-600">₹{invoice.balanceAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
                        </div>
                    )}

                    {/* Footer - Payment Terms & Signature */}
                    <div className="mt-auto pt-16">
                        <div className="grid grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-900">Payment Terms</h4>
                                <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                                    <li>Payment due within {Math.ceil((new Date(invoice.dueDate).getTime() - new Date(invoice.issueDate).getTime()) / (1000 * 60 * 60 * 24))} days.</li>
                                    <li>Late payments may incur additional charges.</li>
                                    <li>GST No: {companyDetails.gstNumber}</li>
                                </ul>
                            </div>
                            <div className="flex flex-col items-end justify-end space-y-2">
                                <div className="h-16 w-32 border-b-2 border-gray-300 mb-2"></div>
                                <p className="text-sm font-semibold text-gray-900">Authorized Signature</p>
                            </div>
                        </div>

                        <div className="mt-12 text-center border-t border-gray-100 pt-6">
                            <p className="text-xs text-gray-400">
                                Generated by {companyDetails.name} • Thank you for your business!
                            </p>
                        </div>
                    </div>

                </div>
            </motion.div >
        </div >
    );
}
