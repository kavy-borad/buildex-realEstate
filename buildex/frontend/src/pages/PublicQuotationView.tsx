import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicQuotationApi } from '@/services/api/publicQuotationApi';
import { ApproveModal } from '@/components/public-quotation/ApproveModal';
import { RejectModal } from '@/components/public-quotation/RejectModal';
import { RequestChangesModal } from '@/components/public-quotation/RequestChangesModal';
import { FeedbackOptionsModal } from '@/components/public-quotation/FeedbackOptionsModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
    CheckCircle2,
    XCircle,
    MessageSquare,
    AlertTriangle,
    Building2,
    MapPin,
    Calendar,
    FileText,
    ThumbsUp,
    ThumbsDown,
    Edit3
} from 'lucide-react';

export const PublicQuotationView = () => {
    const { token } = useParams<{ token: string }>();
    const queryClient = useQueryClient();

    const [modalOpen, setModalOpen] = useState<'approve' | 'reject' | 'changes' | null>(null);
    const [feedbackOptionsOpen, setFeedbackOptionsOpen] = useState(false);

    const { data: quotation, isLoading, error } = useQuery({
        queryKey: ['publicQuotation', token],
        queryFn: () => publicQuotationApi.getQuotation(token!),
        enabled: !!token,
        retry: false
    });

    const mutation = useMutation({
        mutationFn: (data: { action: 'approve' | 'reject' | 'request-changes', comments?: string, reasons?: string, requestedChanges?: string[] }) =>
            publicQuotationApi.respond(token!, data),
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['publicQuotation', token] });
        },
        onError: (error) => {
            toast.error("Failed to submit response. Please try again.");
            console.error(error);
        }
    });

    const handleApprove = async (comments?: string) => {
        await mutation.mutateAsync({ action: 'approve', comments });
    };

    const handleReject = async (reason: string, comments?: string) => {
        await mutation.mutateAsync({ action: 'reject', reasons: reason, comments });
    };

    const handleRequestChanges = async (changes: string[], comments: string) => {
        await mutation.mutateAsync({ action: 'request-changes', requestedChanges: changes, comments });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="w-full max-w-4xl space-y-4 p-8">
                    <Skeleton className="h-8 w-1/3 mb-8" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !quotation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <Card className="max-w-md w-full text-center p-8 shadow-lg border-0">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                        <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Expired or Invalid</h2>
                    <p className="text-gray-500 mb-8">
                        This quotation link is no longer active. Please contact the contractor for a new link.
                    </p>
                    <Button size="lg" onClick={() => window.location.reload()}>Refresh Page</Button>
                </Card>
            </div>
        );
    }

    const isActionable = !quotation.clientStatus || ['pending', 'viewed'].includes(quotation.clientStatus);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-32 print:bg-white print:pb-0 font-sans">
            {/* Top Brand Bar */}
            <header className="bg-slate-900 text-white h-16 flex items-center shadow-lg sticky top-0 z-40 print:hidden transition-all duration-200">
                <div className="w-full px-6 md:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-3 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity cursor-pointer">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">BUILDEX</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        Secure Client Portal
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">

                {/* Status Banner (if responded) */}
                {!isActionable && (
                    <div className={cn(
                        "mb-8 p-5 rounded-xl flex items-center gap-4 shadow-sm border animate-in fade-in slide-in-from-top-4 duration-500",
                        quotation.clientStatus === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
                            quotation.clientStatus === 'rejected' ? 'bg-red-50 border-red-100 text-red-900' :
                                'bg-blue-50 border-blue-100 text-blue-900'
                    )}>
                        <div className={cn(
                            "p-2 rounded-full shrink-0",
                            quotation.clientStatus === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                                quotation.clientStatus === 'rejected' ? 'bg-red-100 text-red-600' :
                                    'bg-blue-100 text-blue-600'
                        )}>
                            {quotation.clientStatus === 'approved' && <CheckCircle2 className="h-6 w-6" />}
                            {quotation.clientStatus === 'rejected' && <XCircle className="h-6 w-6" />}
                            {quotation.clientStatus === 'changes-requested' && <MessageSquare className="h-6 w-6" />}
                        </div>
                        <div>
                            <p className="font-bold text-lg leading-tight">
                                {quotation.clientStatus === 'approved' ? 'Quotation Approved' :
                                    quotation.clientStatus === 'rejected' ? 'Quotation Rejected' :
                                        'Changes Requested'}
                            </p>
                            <p className="text-sm opacity-80 mt-1">
                                You responded on {quotation.clientFeedback?.respondedAt ? format(new Date(quotation.clientFeedback.respondedAt), 'PPP p') : 'recently'}.
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Document Paper */}
                <div className="bg-white shadow-xl shadow-slate-200/60 rounded-xl overflow-hidden border border-slate-100 min-h-[800px] print:shadow-none print:border-none print:m-0 print:p-0 transition-all duration-300">

                    {/* Document Header */}
                    <div className="p-8 md:p-12 border-b border-gray-100 bg-white">
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-8">
                            <div>
                                <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Quotation</h1>
                                <p className="text-slate-500 font-medium text-lg">#{quotation.quotationNumber}</p>
                                <div className="mt-8 space-y-1 text-sm text-slate-600">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">From</p>
                                    <p className="text-xl font-bold text-slate-900">BuildEx Construction</p>
                                    <p className="text-slate-600">123 Builder Street, Tech City</p>
                                    <p className="text-slate-600">contact@buildex.com | +91 98765 43210</p>
                                </div>
                            </div>
                            <div className="text-left md:text-right space-y-1">
                                <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm mb-6 border border-slate-200">
                                    {quotation.clientStatus === 'pending' ? 'Pending Review' : quotation.clientStatus?.replace('-', ' ')}
                                </div>
                                <div className="space-y-1 text-sm text-slate-600">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</p>
                                    <p className="text-xl font-bold text-slate-900">{quotation.clientDetails?.name || 'Valued Client'}</p>
                                    <p className="text-slate-600">{quotation.clientDetails?.siteAddress || quotation.clientDetails?.address}</p>
                                    <p className="text-slate-600">{quotation.clientDetails?.email}</p>
                                    <p className="text-slate-600">{quotation.clientDetails?.phone}</p>
                                </div>
                                <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
                                    <div className="flex justify-between md:justify-end gap-10 text-sm">
                                        <div className="text-left md:text-right">
                                            <p className="text-xs text-slate-400 uppercase font-semibold">Date</p>
                                            <p className="font-semibold text-slate-900 mt-1">{quotation.createdAt ? format(new Date(quotation.createdAt), 'dd MMM yyyy') : 'N/A'}</p>
                                        </div>
                                        <div className="text-left md:text-right">
                                            <p className="text-xs text-slate-400 uppercase font-semibold">Valid Until</p>
                                            <p className="font-semibold text-slate-900 mt-1">{quotation.validTill ? format(new Date(quotation.validTill), 'dd MMM yyyy') : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Details Grid */}
                    <div className="bg-slate-50/80 p-6 md:p-8 border-b border-gray-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Project Overview</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-xs text-slate-500 mb-1.5">Project Type</p>
                                <p className="font-bold text-slate-800">{quotation.projectDetails.projectType}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1.5">Total Area</p>
                                <p className="font-bold text-slate-800">{quotation.projectDetails.builtUpArea} {quotation.projectDetails.areaUnit}</p>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <p className="text-xs text-slate-500 mb-1.5">Site Location</p>
                                <p className="font-bold text-slate-800 truncate" title={`${quotation.projectDetails.city}, ${quotation.projectDetails.area}`}>
                                    {quotation.projectDetails.city}, {quotation.projectDetails.area}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1.5">Est. Duration</p>
                                <p className="font-bold text-slate-800">{quotation.projectDetails.projectDuration || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="p-8">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Scope of Work</h3>
                        <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4 text-right w-32">Quantity</th>
                                        <th className="px-6 py-4 text-right w-36">Rate</th>
                                        <th className="px-6 py-4 text-right w-44">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {quotation.costItems.map((item, index) => (
                                        <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 text-slate-800 font-medium">{item.itemName}</td>
                                            <td className="px-6 py-4 text-right text-slate-600 font-mono">{item.quantity} {item.unit}</td>
                                            <td className="px-6 py-4 text-right text-slate-600 font-mono">₹{item.rate.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right text-slate-900 font-bold font-mono">₹{item.total.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Section */}
                        <div className="mt-10 flex flex-col md:flex-row justify-end">
                            <div className="w-full md:w-[400px] bg-slate-50 rounded-xl p-6 space-y-4 border border-slate-100">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-mono font-medium">₹{quotation.summary.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>GST ({quotation.summary.gstPercentage}%)</span>
                                    <span className="font-mono font-medium">₹{quotation.summary.gstAmount.toLocaleString()}</span>
                                </div>
                                {(quotation.summary.discount > 0) && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Discount</span>
                                        <span className="font-mono font-medium">-₹{quotation.summary.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="border-t border-slate-200 my-2"></div>
                                <div className="flex justify-between text-slate-900 items-baseline">
                                    <span className="font-bold text-lg">Total Amount</span>
                                    <span className="font-mono font-bold text-2xl">₹{quotation.summary.grandTotal.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-slate-400 text-right mt-1">Inclusive of all taxes</p>
                            </div>
                        </div>

                        {/* Terms */}
                        {quotation.termsAndConditions && (
                            <div className="mt-16 pt-8 border-t border-slate-100 relative">
                                <FileText className="absolute top-8 left-0 text-slate-200 w-12 h-12 -z-10 opacity-50" />
                                <h4 className="font-bold text-slate-800 mb-3">Terms & Conditions</h4>
                                <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap max-w-3xl">
                                    {quotation.termsAndConditions}
                                </p>
                            </div>
                        )}

                        <div className="mt-16 text-center text-xs text-slate-400">
                            <p>This is a computer generated document. Signatures are not required.</p>
                            <p className="mt-1">© {new Date().getFullYear()} BuildEx Construction. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Bar */}
            {isActionable && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-50 print:hidden transition-all duration-300">
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="hidden sm:flex flex-col">
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Payable</span>
                            <span className="font-extrabold text-slate-900 text-2xl tracking-tight">₹{quotation.summary.grandTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex w-full sm:w-auto gap-3">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white min-w-[200px] h-12 px-8 gap-2 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 rounded-xl transition-all transform hover:-translate-y-0.5"
                                onClick={() => setFeedbackOptionsOpen(true)}
                            >
                                <MessageSquare className="w-4 h-4" />
                                Respond / Give Feedback
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <FeedbackOptionsModal
                isOpen={feedbackOptionsOpen}
                onClose={() => setFeedbackOptionsOpen(false)}
                onSelectOption={(option) => {
                    setFeedbackOptionsOpen(false);
                    setModalOpen(option);
                }}
            />
            <ApproveModal
                isOpen={modalOpen === 'approve'}
                onClose={() => setModalOpen(null)}
                onConfirm={handleApprove}
                amount={quotation?.summary?.grandTotal || 0}
            />
            <RejectModal
                isOpen={modalOpen === 'reject'}
                onClose={() => setModalOpen(null)}
                onConfirm={handleReject}
            />
            <RequestChangesModal
                isOpen={modalOpen === 'changes'}
                onClose={() => setModalOpen(null)}
                onConfirm={handleRequestChanges}
            />
        </div>
    );
};
