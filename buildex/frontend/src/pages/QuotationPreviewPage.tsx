import { useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileDown, Building2, Phone, Mail, MapPin, Printer, Share2, Send } from 'lucide-react';
import { useQuotations } from '@/contexts/QuotationContext';
import { Button } from '@/components/ui/button';

import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ShareLinkModal } from '@/components/quotation/ShareLinkModal';
import { quotationApi } from '@/services/api/quotationApi';

export default function QuotationPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getQuotation, companyDetails } = useQuotations();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareableUrl, setShareableUrl] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const quotation = id ? getQuotation(id) : undefined;

  if (!quotation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <FileDown className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Quotation Not Found</h2>
        <p className="text-muted-foreground mb-6 max-w-sm">
          The quotation ID you are looking for does not exist or has been removed.
        </p>
        <Button asChild className="rounded-xl">
          <Link to="/quotations">Back to Quotations</Link>
        </Button>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    if (!quotation?.id) return;

    setIsDownloading(true);
    toast({
      title: 'Generating PDF',
      description: 'Please wait, generating your high-quality cinematic PDF...',
    });

    try {
      await quotationApi.downloadPdf(quotation.id);
      toast({
        title: 'Success!',
        description: 'PDF downloaded successfully.',
        className: 'border-l-4 border-l-green-500 bg-white dark:bg-slate-900',
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: 'Download Failed',
        description: 'Failed to generate PDF. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendToClient = async () => {
    if (!quotation?.id) return;

    setIsGeneratingLink(true);
    try {
      const data = await quotationApi.getShareableLink(quotation.id);
      setShareableUrl(data.shareableUrl);
      setShareModalOpen(true);
      toast({
        title: 'Link Generated! 🎉',
        description: 'Shareable link is ready to send to your client.',
        className: 'border-l-4 border-l-green-500 bg-white dark:bg-slate-900',
      });
    } catch (error) {
      console.error('Error generating shareable link:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate shareable link. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleEmail = () => {
    if (!quotation) return;

    const subject = `Quotation for ${quotation.projectDetails.projectType} - #${quotation.quotationNumber || quotation.id.slice(0, 8).toUpperCase()}`;
    const body = `Dear ${quotation.clientDetails.name},\n\nPlease find the quotation for your ${quotation.projectDetails.projectType} project attached.\n\nProject Details:\n- Type: ${quotation.projectDetails.projectType}\n- Area: ${quotation.projectDetails.builtUpArea} ${quotation.projectDetails.areaUnit}\n- Location: ${quotation.projectDetails.city}, ${quotation.projectDetails.area}\n\nTotal Amount: ₹${quotation.summary.grandTotal.toLocaleString('en-IN')}\n\nView Online: ${window.location.href}\n\nRegards,\n${companyDetails.name}`;

    window.location.href = `mailto:${quotation.clientDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white flex flex-col">
      {/* SaaS App Header */}
      <header className="w-full bg-white border-b border-gray-200 shrink-0 print:hidden z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[56px] sm:h-[68px] flex items-center justify-between">

          {/* Left Block: Back + Title */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none shrink-0"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col justify-center translate-y-[1px] min-w-0">
              <h1 className="text-[16px] sm:text-[20px] font-semibold text-gray-900 leading-tight truncate">
                <span className="sm:hidden">Quotation</span>
                <span className="hidden sm:inline">Quotation Preview</span>
              </h1>
              <p className="hidden sm:block text-[13px] text-gray-500 mt-[2px] leading-tight font-medium">
                Review details before sending
              </p>
            </div>
          </div>

          {/* Right Block: Actions Group */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">

            {/* Mobile: Icon-only action buttons */}
            <div className="flex sm:hidden items-center gap-0.5">
              <button
                onClick={handleEmail}
                className="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none"
                title="Share"
              >
                <Share2 className="w-4 h-4 stroke-[2px]" />
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none"
                title="Print"
              >
                <Printer className="w-4 h-4 stroke-[1.5px]" />
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none disabled:opacity-50"
                title="Download PDF"
              >
                <FileDown className="w-4 h-4 stroke-[1.5px]" />
              </button>
            </div>

            {/* Desktop: Labeled action buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={handleEmail}
                className="flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none"
                title="Email Quotation"
              >
                <Share2 className="w-[18px] h-[18px] stroke-[2px]" />
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 h-[40px] px-4 text-[14px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
              >
                <Printer className="w-[18px] h-[18px] stroke-[1.5px]" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 h-[40px] px-4 text-[14px] font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors focus:outline-none"
              >
                <FileDown className="w-[18px] h-[18px] stroke-[1.5px]" />
                <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
              </button>
            </div>

            {/* Primary: Send */}
            <button
              onClick={handleSendToClient}
              disabled={isGeneratingLink}
              className="flex items-center justify-center gap-1.5 sm:gap-2 h-[34px] sm:h-[40px] px-3 sm:px-4 text-[13px] sm:text-[14px] font-medium bg-primary hover:bg-primary/90 text-white rounded-md transition-colors focus:outline-none shadow-sm"
            >
              <Send className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.5px]" />
              <span className="hidden sm:inline">{isGeneratingLink ? 'Sending...' : 'Send to Client'}</span>
              <span className="sm:hidden">{isGeneratingLink ? '...' : 'Send'}</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 print:p-0 flex justify-center">

        {/* Actual A4 Paper Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full lg:max-w-[210mm] mx-auto bg-white shadow-2xl shadow-black/5 rounded-none md:rounded-sm lg:min-h-[297mm] relative overflow-hidden print:shadow-none print:w-full print:max-w-none print:m-0 print:min-h-[297mm] font-['Inter',sans-serif] text-[11.5px] leading-[1.6] text-[#334155] tracking-[0.3px] overflow-x-hidden"
          id="quotation-preview"
        >
          {/* WATERMARK */}
          {companyDetails.logo && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 opacity-5 z-0 pointer-events-none">
              <img src={companyDetails.logo} alt="Watermark" className="w-[300px] lg:w-[500px] h-auto" />
            </div>
          )}

          <div className="p-4 sm:p-6 lg:p-[20mm] print:p-[20mm] relative z-10 w-full h-full pb-[50px] lg:pb-[40mm] print:pb-[40mm]">

            {/* 4️⃣ HEADER */}
            <div className="flex flex-col sm:flex-row lg:flex-row print:flex-row justify-between items-start mb-4 lg:mb-[25px] print:mb-[25px] gap-4 sm:gap-0">
              <div className="w-full sm:w-[60%] lg:w-[60%] print:w-[60%] text-left">
                {companyDetails.logo && (
                  <img src={companyDetails.logo} className="h-[40px] sm:h-[50px] lg:h-[60px] print:h-[60px] w-auto object-contain mb-3" alt="Logo" />
                )}
                <div className="font-['Poppins',sans-serif] text-[18px] sm:text-[20px] lg:text-[22px] print:text-[22px] font-bold text-[#0F172A] uppercase leading-[1.2] mb-[5px]">
                  {companyDetails.name || 'Buildex Construction'}
                </div>
                <div className="text-[9.5px] sm:text-[10px] lg:text-[10.5px] print:text-[10.5px] text-[#64748B] leading-[1.5]">
                  {companyDetails.address || 'Ahmedabad, India'}<br />
                  Phone: {companyDetails.phone || '+91 98765 43210'}<br />
                  Email: {companyDetails.email || 'info@buildex.com'}<br />
                  GSTIN: {(companyDetails as any).gstNumber || (companyDetails as any).gstNo || '-'}
                </div>
              </div>

              <div className="w-full sm:w-[40%] lg:w-[40%] print:w-[40%] sm:text-right lg:text-right print:text-right flex flex-col sm:items-end lg:items-end print:items-end">
                <div className="font-['Poppins',sans-serif] text-[22px] sm:text-[24px] lg:text-[28px] print:text-[28px] font-bold text-[#0F172A] uppercase tracking-[2px] mb-[5px] leading-none">
                  QUOTATION
                </div>
                <table className="border-collapse mt-[5px]">
                  <tbody>
                    <tr>
                      <td className="sm:text-right lg:text-right print:text-right py-[2px] sm:pl-[15px] lg:pl-[15px] print:pl-[15px] pr-2 text-[11px] text-[#64748B] font-medium">Quotation No:</td>
                      <td className="sm:text-right lg:text-right print:text-right py-[2px] pl-0 pr-0 text-[11px] text-[#0F172A] font-semibold">#{quotation.quotationNumber || quotation.id.slice(0, 8).toUpperCase()}</td>
                    </tr>
                    <tr>
                      <td className="sm:text-right lg:text-right print:text-right py-[2px] sm:pl-[15px] lg:pl-[15px] print:pl-[15px] pr-2 text-[11px] text-[#64748B] font-medium">Date:</td>
                      <td className="sm:text-right lg:text-right print:text-right py-[2px] pl-0 pr-0 text-[11px] text-[#0F172A] font-semibold">{new Date(quotation.clientDetails.quotationDate).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td className="sm:text-right lg:text-right print:text-right py-[2px] sm:pl-[15px] lg:pl-[15px] print:pl-[15px] pr-2 text-[11px] text-[#64748B] font-medium">Valid Until:</td>
                      <td className="sm:text-right lg:text-right print:text-right py-[2px] pl-0 pr-0 text-[11px] text-[#0F172A] font-semibold">{new Date(quotation.clientDetails.validTill).toLocaleDateString()}</td>
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
                      <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]"><b>{quotation.clientDetails.name}</b></td>
                    </tr>
                    <tr>
                      <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Phone:</td>
                      <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.clientDetails.phone}</td>
                    </tr>
                    <tr>
                      <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Email:</td>
                      <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.clientDetails.email || '-'}</td>
                    </tr>
                    <tr>
                      <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Address:</td>
                      <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.clientDetails.siteAddress || '-'}</td>
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
                      <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.projectDetails.projectType}</td>
                    </tr>
                    <tr>
                      <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Location:</td>
                      <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.projectDetails.city}, {quotation.projectDetails.area}</td>
                    </tr>
                    <tr>
                      <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Area:</td>
                      <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.projectDetails.builtUpArea} {quotation.projectDetails.areaUnit}</td>
                    </tr>
                    <tr>
                      <td className="py-[4px] px-0 align-top text-[11.5px] font-semibold text-[#1E293B] w-[90px]">Duration:</td>
                      <td className="py-[4px] px-0 align-top text-[11.5px] text-[#334155]">{quotation.projectDetails.projectDuration || '-'}</td>
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
                {quotation.costItems.map((item, index) => {
                  let description = item.description || '';
                  if (description.includes(',') && description.length > 50) {
                    description = description.split(',').map(s => s.trim()).join('  •  ');
                  }
                  return (
                    <tr key={item.id} className="even:bg-[#FAFAFA] break-inside-avoid">
                      <td className="p-[12px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 align-top text-[11.5px] text-[#64748B] text-center">{index + 1}</td>
                      <td className="p-[12px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 align-top text-[11.5px] font-medium text-left">
                        <div className="font-semibold text-[#0F172A] mb-[4px]">{item.itemName}</div>
                        {description && <div className="text-[11px] text-[#64748B] whitespace-pre-wrap leading-[1.5]">{description}</div>}
                      </td>
                      <td className="p-[12px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 align-top text-[11.5px] text-[#334155] text-center">{item.quantity}</td>
                      <td className="p-[12px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 align-top text-[11.5px] text-[#64748B] text-center">{item.unit}</td>
                      <td className="p-[12px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 align-top text-[11.5px] text-[#334155] text-right">₹{item.rate.toLocaleString('en-IN')}</td>
                      <td className="p-[12px_10px] border-b border-[#E5E7EB] border-t-0 border-l-0 border-r-0 align-top text-[11.5px] font-semibold text-[#0F172A] text-right">₹{item.total.toLocaleString('en-IN')}</td>
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
              {quotation.costItems.map((item, index) => {
                let description = item.description || '';
                if (description.includes(',') && description.length > 50) {
                  description = description.split(',').map(s => s.trim()).join('  •  ');
                }
                return (
                  <div key={item.id} className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
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
                        <span className="text-[#64748B]"><span className="font-medium text-[#334155]">Rate:</span> ₹{item.rate.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="font-bold text-[12px] text-[#0F172A]">₹{item.total.toLocaleString('en-IN')}</div>
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
                      <td className="py-[8px] px-0 text-right text-[#64748B] pr-[15px] sm:pr-[25px] lg:pr-[25px] font-medium border-0">Subtotal</td>
                      <td className="py-[8px] px-0 text-right text-[#0F172A] font-semibold text-[12px] border-0">₹{quotation.summary.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    {(quotation.summary.labourCost || 0) > 0 && (
                      <tr>
                        <td className="py-[8px] px-0 text-right text-[#64748B] pr-[15px] sm:pr-[25px] lg:pr-[25px] font-medium border-0">Labour Cost</td>
                        <td className="py-[8px] px-0 text-right text-[#0F172A] font-semibold text-[12px] border-0">₹{quotation.summary.labourCost.toLocaleString('en-IN')}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-[8px] px-0 text-right text-[#1E293B] pr-[15px] sm:pr-[25px] lg:pr-[25px] font-medium border-0">GST ({quotation.summary.gstPercentage}%)</td>
                      <td className="py-[8px] px-0 text-right text-[#1E293B] font-semibold text-[12px] border-0">₹{quotation.summary.gstAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    {quotation.summary.discount > 0 && (
                      <tr>
                        <td className="py-[8px] px-0 text-right text-[#64748B] pr-[15px] sm:pr-[25px] lg:pr-[25px] font-medium border-0">Discount</td>
                        <td className="py-[8px] px-0 text-right font-semibold text-[12px] border-0" style={{ color: '#EF4444' }}>-₹{quotation.summary.discount.toLocaleString('en-IN')}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="border-t-[2px] border-[#0F172A] border-b-0 border-l-0 border-r-0 pt-[15px] pb-[15px] px-0 text-right text-[#64748B] pr-[15px] sm:pr-[25px] lg:pr-[25px] font-medium font-['Poppins',sans-serif] text-[14px] sm:text-[16px] lg:text-[16px] text-[#C6A75E] font-bold">GRAND TOTAL</td>
                      <td className="border-t-[2px] border-[#0F172A] border-b-0 border-l-0 border-r-0 pt-[15px] pb-[15px] px-0 text-right font-['Poppins',sans-serif] text-[14px] sm:text-[16px] lg:text-[16px] text-[#C6A75E] font-bold">₹{quotation.summary.grandTotal.toLocaleString('en-IN')}</td>
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
                <div className="text-[11px] mb-[30px] sm:mb-[50px] lg:mb-[50px] print:mb-[50px] text-[#334155]">For {companyDetails.name || 'Buildex Construction'}</div>
                <div className="border-t border-[#E5E7EB] pt-[8px] font-semibold text-[#0F172A]">Authorized Signatory</div>
                <div className="mt-[5px] text-[10px] text-[#64748B]">Date: __________________</div>
              </div>
            </div>

          </div>

          {/* 10. FOOTER */}
          <div className="absolute bottom-0 left-0 right-0 h-[30px] text-center text-[9px] text-[#94A3B8] border-t border-[#F1F5F9] pt-[8px] pb-[20px] bg-white text-muted-foreground z-20">
            {companyDetails.name || 'Buildex Construction'} | Generated on {new Date().toLocaleDateString('en-IN')}
          </div>
        </motion.div>
      </main>

      {/* Share Link Modal */}
      <ShareLinkModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareableUrl={shareableUrl}
        clientEmail={quotation?.clientDetails.email}
        quotationNumber={quotation?.quotationNumber}
      />
    </div>
  );
}
