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
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
    CheckCircle2,
    XCircle,
    MessageSquare,
    Building2,
    ThumbsUp,
    ThumbsDown,
    Edit3,
    Printer
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
        retry: false,
        refetchOnWindowFocus: false, // Prevents the API from re-running every time the user clicks on the browser tab
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
        <div className="min-h-screen bg-[#f1f5f9] pb-32 print:bg-white print:pb-0 font-sans">
            {/* Premium Header */}
            <header className="bg-[#0f172a] text-white sticky top-0 z-40 print:hidden shadow-[0_4px_30px_rgba(0,0,0,0.15)]">
                <div className="max-w-[1200px] mx-auto px-5 md:px-8">
                    <div className="h-[72px] flex items-center justify-between">
                        {/* Left: Logo + Company Name */}
                        <div className="flex items-center gap-3.5">
                            {quotation.companyDetails?.logo ? (
                                <img src={quotation.companyDetails.logo} alt="Logo" className="h-9 w-auto object-contain" />
                            ) : (
                                <div className="bg-blue-600 p-2 rounded-xl">
                                    <Building2 className="h-5 w-5" />
                                </div>
                            )}
                            <div>
                                <span className="text-[18px] font-bold tracking-tight text-white block leading-tight">
                                    {quotation.companyDetails?.name || 'BUILDEX'}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                                    {quotation.companyDetails?.tagline || 'Construction & Interiors'}
                                </span>
                            </div>
                        </div>

                        {/* Right: Quotation Info + Secure Badge */}
                        <div className="flex items-center gap-5">
                            <div className="hidden md:flex items-center gap-5">
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Quotation</p>
                                    <p className="text-[15px] font-bold text-white leading-tight">#{quotation.quotationNumber || quotation.id?.slice(0, 8).toUpperCase()}</p>
                                </div>
                                <div className="w-px h-8 bg-slate-700" />
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Date</p>
                                    <p className="text-[14px] font-semibold text-slate-300 leading-tight">{quotation.clientDetails?.quotationDate ? new Date(quotation.clientDetails.quotationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-[12px] text-slate-400 bg-slate-800/80 px-3.5 py-2 rounded-full border border-slate-700/60">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                <span className="font-semibold">Secure Portal</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-[900px] mx-auto px-4 py-8 md:py-10 space-y-6">

                {/* Action Card — Above PDF */}
                <div className="print:hidden">
                    {/* Status Banner (if responded) */}
                    {!isActionable && (
                        <div className={cn(
                            "mb-5 p-5 rounded-xl flex items-center gap-4 shadow-sm border animate-in fade-in slide-in-from-top-4 duration-500",
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

                    {/* Horizontal Action Bar */}
                    <Card className="w-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-0 overflow-hidden rounded-2xl">
                        <div className="flex flex-col sm:flex-row items-stretch">
                            {/* Total Amount */}
                            <div className="bg-[#0f172a] px-6 py-5 sm:px-8 sm:py-6 text-center sm:text-left text-white sm:min-w-[220px] flex flex-col justify-center">
                                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Total Payable</p>
                                <p className="text-[28px] sm:text-[32px] leading-none font-extrabold tracking-tight">
                                    ₹{quotation.summary.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex-1 p-4 sm:p-5 bg-white flex flex-col sm:flex-row items-center gap-3">
                                {isActionable ? (
                                    <>
                                        <Button
                                            className="w-full sm:flex-1 bg-[#10b981] hover:bg-[#059669] text-white h-12 rounded-xl gap-2 font-semibold text-[14px] shadow-sm hover:shadow transition-all"
                                            onClick={() => setModalOpen('approve')}
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            Approve
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full sm:flex-1 h-12 rounded-xl gap-2 font-semibold text-[14px] text-slate-700 border-slate-200 hover:bg-slate-50 transition-all"
                                            onClick={() => setModalOpen('changes')}
                                        >
                                            <Edit3 className="w-4 h-4 text-slate-500" />
                                            Request Changes
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full sm:flex-1 h-12 rounded-xl gap-2 font-semibold text-[14px] text-slate-700 border-slate-200 hover:bg-slate-50 transition-all"
                                            onClick={() => setModalOpen('reject')}
                                        >
                                            <ThumbsDown className="w-4 h-4 text-slate-500" />
                                            Reject
                                        </Button>
                                        <div className="hidden sm:block w-px h-8 bg-slate-200" />
                                        <Button
                                            variant="ghost"
                                            className="w-full sm:w-auto h-12 rounded-xl gap-2 font-semibold text-[14px] text-slate-500 hover:text-slate-900 transition-all"
                                            onClick={() => window.print()}
                                        >
                                            <Printer className="w-4 h-4" />
                                            Print
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto h-12 rounded-xl gap-2 font-semibold text-[14px] text-slate-700 border-slate-200 hover:bg-slate-50 transition-all"
                                        onClick={() => window.print()}
                                    >
                                        <Printer className="w-4 h-4 text-slate-500" />
                                        Print / Save as PDF
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* PDF Document */}
                <div className="w-full">

                    {/* Main Document Paper */}
                    <div className="w-full lg:max-w-[210mm] mx-auto bg-white shadow-xl shadow-slate-200/60 rounded-none md:rounded-sm overflow-hidden overflow-x-hidden border border-slate-100 lg:min-h-[297mm] print:min-h-[297mm] print:shadow-none print:border-none print:m-0 print:p-0 transition-all duration-300 font-['Inter',sans-serif] text-[11.5px] leading-[1.6] text-[#334155] tracking-[0.3px] relative">

                        {/* WATERMARK */}
                        {quotation.companyDetails?.logo && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 opacity-5 z-0 pointer-events-none">
                                <img src={quotation.companyDetails.logo} alt="Watermark" className="w-[300px] lg:w-[500px] h-auto" />
                            </div>
                        )}

                        <div className="p-4 sm:p-6 lg:p-[20mm] print:p-[20mm] relative z-10 w-full h-full pb-[50px] lg:pb-[40mm] print:pb-[40mm]">

                            {/* 4️⃣ HEADER */}
                            <div className="flex flex-col sm:flex-row lg:flex-row print:flex-row justify-between items-start mb-4 lg:mb-[25px] print:mb-[25px] gap-4 sm:gap-0">
                                <div className="w-full sm:w-[60%] lg:w-[60%] print:w-[60%] text-left">
                                    {quotation.companyDetails?.logo && (
                                        <img src={quotation.companyDetails.logo} className="h-[40px] sm:h-[50px] lg:h-[60px] print:h-[60px] w-auto object-contain mb-3" alt="Logo" />
                                    )}
                                    <div className="font-['Poppins',sans-serif] text-[18px] sm:text-[20px] lg:text-[22px] print:text-[22px] font-bold text-[#0F172A] uppercase leading-[1.2] mb-[5px]">
                                        {quotation.companyDetails?.name || 'Buildex Construction'}
                                    </div>
                                    <div className="text-[9.5px] sm:text-[10px] lg:text-[10.5px] print:text-[10.5px] text-[#64748B] leading-[1.5]">
                                        {quotation.companyDetails?.address || 'Ahmedabad, India'}<br />
                                        Phone: {quotation.companyDetails?.phone || '+91 98765 43210'}<br />
                                        Email: {quotation.companyDetails?.email || 'info@buildex.com'}<br />
                                        GSTIN: {quotation.companyDetails?.gstNumber || '-'}
                                    </div>
                                </div>

                                <div className="w-full sm:w-[40%] lg:w-[40%] print:w-[40%] sm:text-right lg:text-right print:text-right flex flex-col sm:items-end lg:items-end print:items-end">
                                    <div className="font-['Poppins',sans-serif] text-[22px] sm:text-[24px] lg:text-[28px] print:text-[28px] font-bold text-[#0F172A] uppercase tracking-[2px] mb-[5px] leading-none">
                                        QUOTATION
                                    </div>
                                    <table className="border-collapse mt-[5px]">
                                        <tbody>
                                            <tr>
                                                <td className="text-right py-[2px] pl-[15px] pr-2 text-[11px] text-[#64748B] font-medium">Quotation No:</td>
                                                <td className="text-right py-[2px] pl-0 pr-0 text-[11px] text-[#0F172A] font-semibold">#{quotation.quotationNumber || quotation.id?.slice(0, 8).toUpperCase()}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-right py-[2px] pl-[15px] pr-2 text-[11px] text-[#64748B] font-medium">Date:</td>
                                                <td className="text-right py-[2px] pl-0 pr-0 text-[11px] text-[#0F172A] font-semibold">{quotation.clientDetails?.quotationDate ? new Date(quotation.clientDetails.quotationDate).toLocaleDateString() : 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-right py-[2px] pl-[15px] pr-2 text-[11px] text-[#64748B] font-medium">Valid Until:</td>
                                                <td className="text-right py-[2px] pl-0 pr-0 text-[11px] text-[#0F172A] font-semibold">{quotation.clientDetails?.validTill ? new Date(quotation.clientDetails.validTill).toLocaleDateString() : 'N/A'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="w-full h-[2px] mb-[30px]" style={{ background: 'linear-gradient(to right, #0F172A 70%, #C6A75E 70%)' }}></div>

                            {/* 5️⃣ CLIENT & PROJECT CARDS */}
                            <div className="w-full mb-5 lg:mb-[35px] print:mb-[35px] flex flex-col sm:flex-row lg:flex-row print:flex-row gap-3 sm:gap-4 lg:gap-[20px] print:gap-[20px]">
                                {/* Left Card: Client */}
                                <div className="flex-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[6px] p-3 sm:p-4 lg:p-[20px] print:p-[20px] align-top">
                                    <div className="font-['Poppins',sans-serif] text-[13px] font-semibold text-[#1E293B] uppercase tracking-[0.5px] border-b border-[#E5E7EB] pb-[10px] mb-[15px]">
                                        Client Details
                                    </div>
                                    <table className="w-full border-collapse">
                                        <tbody>
                                            <tr>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Name:</td>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]"><b>{quotation.clientDetails?.name || '-'}</b></td>
                                            </tr>
                                            <tr>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Phone:</td>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.clientDetails?.phone || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Email:</td>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.clientDetails?.email || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Address:</td>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.clientDetails?.siteAddress || quotation.clientDetails?.address || '-'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Right Card: Project */}
                                <div className="flex-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[6px] p-3 sm:p-4 lg:p-[20px] print:p-[20px] align-top">
                                    <div className="font-['Poppins',sans-serif] text-[13px] font-semibold text-[#1E293B] uppercase tracking-[0.5px] border-b border-[#E5E7EB] pb-[10px] mb-[15px]">
                                        Project Details
                                    </div>
                                    <table className="w-full border-collapse">
                                        <tbody>
                                            <tr>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Type:</td>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.projectDetails?.projectType || '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Location:</td>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.projectDetails?.city ? `${quotation.projectDetails.city}, ${quotation.projectDetails.area}` : '-'}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Area:</td>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.projectDetails?.builtUpArea || '-'} {quotation.projectDetails?.areaUnit || ''}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Duration:</td>
                                                <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.projectDetails?.projectDuration || '-'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 6️⃣ COST TABLE — Desktop/Tablet: table, Mobile: card layout */}
                            {/* Desktop Table (hidden on mobile) */}
                            <table className="hidden sm:table w-full border-collapse mb-[30px] border border-[#E5E7EB]">
                                <thead className="bg-[#F1F5F9] table-header-group">
                                    <tr>
                                        <th className="font-['Inter',sans-serif] text-[12px] font-semibold text-[#0F172A] uppercase p-[14px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 whitespace-nowrap w-[50px] text-center">#</th>
                                        <th className="font-['Inter',sans-serif] text-[12px] font-semibold text-[#0F172A] uppercase p-[14px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 whitespace-nowrap text-left">Description / Item</th>
                                        <th className="font-['Inter',sans-serif] text-[12px] font-semibold text-[#0F172A] uppercase p-[14px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 whitespace-nowrap w-[80px] text-center">Qty</th>
                                        <th className="font-['Inter',sans-serif] text-[12px] font-semibold text-[#0F172A] uppercase p-[14px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 whitespace-nowrap w-[70px] text-center">Unit</th>
                                        <th className="font-['Inter',sans-serif] text-[12px] font-semibold text-[#0F172A] uppercase p-[14px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 whitespace-nowrap w-[120px] text-right">Rate</th>
                                        <th className="font-['Inter',sans-serif] text-[12px] font-semibold text-[#0F172A] uppercase p-[14px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 whitespace-nowrap w-[130px] text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotation.costItems?.map((item, index) => {
                                        let description = item.description || '';
                                        if (description.includes(',') && description.length > 50) {
                                            description = description.split(',').map(s => s.trim()).join('  •  ');
                                        }
                                        return (
                                            <tr key={index} className="even:bg-[#FAFAFA] break-inside-avoid">
                                                <td className="p-[12px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 align-top text-[11.5px] text-[#64748B] text-center">{index + 1}</td>
                                                <td className="p-[12px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 align-top text-[11.5px] font-medium text-left">
                                                    <div className="font-semibold text-[#0F172A] mb-[4px]">{item.itemName}</div>
                                                    {description && <div className="text-[11px] text-[#64748B] whitespace-pre-wrap leading-[1.5]">{description}</div>}
                                                </td>
                                                <td className="p-[12px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 align-top text-[11.5px] text-[#334155] text-center">{item.quantity}</td>
                                                <td className="p-[12px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 align-top text-[11.5px] text-[#64748B] text-center">{item.unit}</td>
                                                <td className="p-[12px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 align-top text-[11.5px] text-[#334155] text-right">₹{item.rate?.toLocaleString('en-IN')}</td>
                                                <td className="p-[12px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 align-top text-[11.5px] font-semibold text-[#0F172A] text-right">₹{item.total?.toLocaleString('en-IN')}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Mobile Card Layout (visible only on mobile) */}
                            <div className="sm:hidden mb-5 space-y-3">
                                <div className="font-['Poppins',sans-serif] text-[12px] font-semibold text-[#1E293B] uppercase tracking-[0.5px] border-b border-[#E5E7EB] pb-2 mb-3">
                                    Cost Items
                                </div>
                                {quotation.costItems?.map((item, index) => {
                                    let description = item.description || '';
                                    if (description.includes(',') && description.length > 50) {
                                        description = description.split(',').map(s => s.trim()).join('  •  ');
                                    }
                                    return (
                                        <div key={index} className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <span className="text-[10px] text-[#64748B] mr-2">#{index + 1}</span>
                                                    <span className="text-[12px] font-semibold text-[#0F172A]">{item.itemName}</span>
                                                </div>
                                            </div>
                                            {description && <div className="text-[10px] text-[#64748B] mb-2 leading-[1.4]">{description}</div>}
                                            <div className="flex justify-between items-center text-[11px] pt-2 border-t border-[#F1F5F9]">
                                                <div className="flex gap-3">
                                                    <span className="text-[#64748B]"><span className="font-medium text-[#334155]">Qty:</span> {item.quantity} {item.unit}</span>
                                                    <span className="text-[#64748B]"><span className="font-medium text-[#334155]">Rate:</span> ₹{item.rate?.toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="font-bold text-[12px] text-[#0F172A]">₹{item.total?.toLocaleString('en-IN')}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 7️⃣ FINANCIAL SUMMARY */}
                            <div className="w-full mb-[40px] flex justify-end break-inside-avoid">
                                <div className="w-full sm:w-[60%] lg:w-[45%] print:w-[45%] ml-auto">
                                    <table className="w-full border-collapse">
                                        <tbody>
                                            <tr>
                                                <td className="py-[8px] px-0 text-right text-[#64748B] pr-[25px] font-medium border-0">Subtotal</td>
                                                <td className="py-[8px] px-0 text-right text-[#0F172A] font-semibold text-[12px] border-0">₹{quotation.summary?.subtotal?.toLocaleString('en-IN')}</td>
                                            </tr>
                                            {(quotation.summary?.labourCost || 0) > 0 && (
                                                <tr>
                                                    <td className="py-[8px] px-0 text-right text-[#64748B] pr-[25px] font-medium border-0">Labour Cost</td>
                                                    <td className="py-[8px] px-0 text-right text-[#0F172A] font-semibold text-[12px] border-0">₹{quotation.summary?.labourCost?.toLocaleString('en-IN')}</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td className="py-[8px] px-0 text-right text-[#1E293B] pr-[25px] font-medium border-0">GST ({quotation.summary?.gstPercentage}%)</td>
                                                <td className="py-[8px] px-0 text-right text-[#1E293B] font-semibold text-[12px] border-0">₹{quotation.summary?.gstAmount?.toLocaleString('en-IN')}</td>
                                            </tr>
                                            {(quotation.summary?.discount || 0) > 0 && (
                                                <tr>
                                                    <td className="py-[8px] px-0 text-right text-[#64748B] pr-[25px] font-medium border-0">Discount</td>
                                                    <td className="py-[8px] px-0 text-right font-semibold text-[12px] border-0" style={{ color: '#EF4444' }}>-₹{quotation.summary?.discount?.toLocaleString('en-IN')}</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td className="border-t-[2px] border-[#0F172A] border-b-0 border-l-0 border-r-0 pt-[15px] pb-[15px] px-0 text-right text-[#64748B] pr-[25px] font-medium font-['Poppins',sans-serif] text-[16px] text-[#C6A75E] font-bold">GRAND TOTAL</td>
                                                <td className="border-t-[2px] border-[#0F172A] border-b-0 border-l-0 border-r-0 pt-[15px] pb-[15px] px-0 text-right font-['Poppins',sans-serif] text-[16px] text-[#C6A75E] font-bold">₹{quotation.summary?.grandTotal?.toLocaleString('en-IN')}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 8️⃣ TERMS & CONDITIONS */}
                            <div className="mt-[40px] border-t border-[#E5E7EB] pt-[25px] break-inside-avoid">
                                <div className="font-['Poppins',sans-serif] text-[12px] font-semibold text-[#0F172A] uppercase mb-[15px] tracking-[0.5px]">
                                    Terms & Conditions
                                </div>
                                <ol className="m-0 text-[#334155] text-[11px] list-decimal list-inside pl-[10px]">
                                    {(quotation.termsAndConditions
                                        ? quotation.termsAndConditions.split('\n').filter(t => t.trim().length > 0)
                                        : [
                                            "Valid for 30 days from issue date.",
                                            "50% advance payment required to commence work.",
                                            "Goods once sold cannot be returned.",
                                            "Subject to Ahmedabad jurisdiction."
                                        ]
                                    ).map((term, index) => (
                                        <li key={index} className="mb-[8px] text-[11px]">{term.replace(/^\d+\.\s*/, '')}</li>
                                    ))}
                                </ol>
                            </div>

                            {/* 9️⃣ SIGNATURE */}
                            <div className="mt-8 sm:mt-12 lg:mt-[60px] print:mt-[60px] w-full break-inside-avoid flex justify-end">
                                <div className="w-full sm:w-[250px] lg:w-[250px] print:w-[250px]">
                                    <div className="text-[11px] mb-[30px] sm:mb-[50px] lg:mb-[50px] print:mb-[50px] text-[#334155]">For {quotation.companyDetails?.name || 'Buildex Construction'}</div>
                                    <div className="border-t border-[#E5E7EB] pt-[8px] font-semibold text-[#0F172A]">Authorized Signatory</div>
                                    <div className="mt-[5px] text-[10px] text-[#64748B]">Date: __________________</div>
                                </div>
                            </div>
                        </div>

                        {/* 10. FOOTER */}
                        <div className="absolute bottom-0 left-0 right-0 h-[30px] text-center text-[9px] text-[#94A3B8] border-t border-[#F1F5F9] pt-[8px] pb-[20px] bg-white text-muted-foreground z-20">
                            {quotation.companyDetails?.name || 'Buildex Construction'} | Generated on {new Date().toLocaleDateString('en-IN')}
                        </div>
                    </div>
                </div>

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
        </div>
    );
};
