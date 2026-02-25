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
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Quotation Preview
            </h1>
            <p className="text-sm text-muted-foreground">Review details before sending</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSendToClient}
            disabled={isGeneratingLink}
            className="rounded-xl gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/20 transition-all text-white"
          >
            <Send className="w-4 h-4" />
            {isGeneratingLink ? 'Generating...' : 'Send to Client'}
          </Button>
          <Button variant="outline" onClick={handlePrint} className="rounded-xl gap-2 border-border/50 bg-background/50 hover:bg-background">
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button onClick={handleDownloadPDF} disabled={isDownloading} className="rounded-xl gap-2 bg-primary shadow-md">
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">{isDownloading ? 'Generating...' : 'PDF'}</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleEmail} className="rounded-xl border-border/50 bg-background/50 hover:bg-background" title="Email Quotation">
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Actual A4 Paper Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-[210mm] mx-auto bg-white shadow-2xl shadow-black/5 rounded-none md:rounded-sm min-h-[297mm] relative overflow-hidden print:shadow-none print:w-full print:max-w-none print:m-0"
        id="quotation-preview"
      >
        {/* Decorative Top Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-primary via-purple-500 to-indigo-600 print:print-color-adjust-exact" />

        <div className="p-8 md:p-12 space-y-8">

          {/* Company Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center print:border print:border-gray-200">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{companyDetails.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{companyDetails.tagline || "Building Dreams into Reality"}</p>
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

          {/* Quotation Info & Client Info */}
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Client Info */}
            <div className="flex-1 space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bill To</h3>
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">{quotation.clientDetails.name}</p>
                <p className="text-gray-600">{quotation.clientDetails.siteAddress}</p>
                <div className="pt-2 text-sm text-gray-500">
                  <p>Phone: {quotation.clientDetails.phone}</p>
                  <p>Email: {quotation.clientDetails.email}</p>
                </div>
              </div>
            </div>

            {/* Quote Details */}
            <div className="flex-1 md:text-right space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quotation Details</h3>
              <div className="space-y-2">
                <div className="flex md:justify-end gap-8">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-500">Quotation No.</p>
                    <p className="font-semibold text-gray-900">#{quotation.quotationNumber || quotation.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-500">Date Issued</p>
                    <p className="font-semibold text-gray-900">{new Date(quotation.clientDetails.quotationDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex md:justify-end gap-8">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-500">Valid Until</p>
                    <p className="font-semibold text-gray-900">{new Date(quotation.clientDetails.validTill).toLocaleDateString()}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-500">Project Type</p>
                    <p className="font-semibold text-gray-900">{quotation.projectDetails.projectType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mt-8 rounded-lg overflow-hidden border border-gray-100">
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
                {quotation.costItems.map((item, index) => (
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
                <span>₹{quotation.summary.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST ({quotation.summary.gstPercentage}%)</span>
                <span>+ ₹{quotation.summary.gstAmount.toLocaleString('en-IN')}</span>
              </div>
              {quotation.summary.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ₹{quotation.summary.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 flex justify-between items-end">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary">₹{quotation.summary.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer - Terms & Signature */}
          <div className="mt-auto pt-16">
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">Terms & Conditions</h4>
                <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                  <li>Valid for 30 days from issue date.</li>
                  <li>50% advance payment required.</li>
                  <li>Goods once sold cannot be returned.</li>
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
      </motion.div>

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
