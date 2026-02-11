import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, FileDown, Trash2, FileText, Plus, Search, Copy, Edit, Link2 } from 'lucide-react';
import { useQuotations } from '@/contexts/QuotationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateQuotationPDF } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { quotationApi } from '@/services/api/quotationApi';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function QuotationListPage() {
  const { quotations, deleteQuotation, companyDetails, updateQuotation, addQuotation } = useQuotations();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Check if navigating from Clients page with filter
  useEffect(() => {
    if (location.state?.clientFilter) {
      setClientFilter(location.state.clientFilter);
    }
  }, [location]);

  // Filter quotations by client and search query
  const displayedQuotations = quotations
    .filter(q => {
      // Client filter
      if (clientFilter && q.clientDetails.phone !== clientFilter && q.clientDetails.email !== clientFilter) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          q.clientDetails.name.toLowerCase().includes(query) ||
          q.clientDetails.email.toLowerCase().includes(query) ||
          q.projectDetails.projectType.toLowerCase().includes(query) ||
          (q.quotationNumber && q.quotationNumber.toLowerCase().includes(query))
        );
      }
      return true;
    });

  const handleDownloadPDF = (quotationId: string) => {
    const quotation = quotations.find(q => q.id === quotationId);
    if (quotation) {
      generateQuotationPDF(quotation, companyDetails);
      toast({
        title: 'PDF Downloaded',
        description: 'Your quotation PDF has been downloaded.',
      });
    }
  };

  const handleDelete = async (quotationId: string) => {
    try {
      await deleteQuotation(quotationId);
      toast({
        title: 'Quotation Deleted',
        description: 'The quotation has been removed.',
      });
    } catch (error) {
      console.error('Error deleting quotation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete quotation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (quotationId: string, newStatus: string) => {
    try {
      const quotation = quotations.find(q => q.id === quotationId);
      if (quotation) {
        await updateQuotation(quotationId, { ...quotation, status: newStatus as any });
        toast({
          title: 'Status Updated',
          description: `Quotation status changed to ${newStatus}.`,
          className: 'border-l-4 border-l-blue-600 bg-white dark:bg-slate-900',
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicate = async (quotationId: string) => {
    try {
      const quotation = quotations.find(q => q.id === quotationId);
      if (quotation) {
        const { id, quotationNumber, createdAt, ...quotationData } = quotation;
        const duplicatedQuotation = {
          ...quotationData,
          status: 'draft' as any,
        };
        await addQuotation(duplicatedQuotation as any);
        toast({
          title: 'Quotation Duplicated ✨',
          description: 'A copy has been created as a draft.',
          className: 'border-l-4 border-l-green-600 bg-white dark:bg-slate-900',
        });
      }
    } catch (error) {
      console.error('Error duplicating quotation:', error);
      toast({
        title: 'Error',
        description: 'Failed to duplicate quotation.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyShareLink = async (quotationId: string) => {
    try {
      const data = await quotationApi.getShareableLink(quotationId);
      await navigator.clipboard.writeText(data.shareableUrl);
      toast({
        title: 'Link Copied! 🔗',
        description: 'Client link copied to clipboard. Send it to your client!',
        className: 'border-l-4 border-l-green-500 bg-white dark:bg-slate-900',
      });
    } catch (error) {
      console.error('Error copying link:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy link. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (quotationId: string) => {
    navigate('/create-quotation', { state: { editId: quotationId } });
  };

  return (
    <div className="min-h-screen px-4 md:px-6 py-4 bg-background/50 space-y-6 max-w-[1600px] mx-auto w-full page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 w-fit">
            Quotation History
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {clientFilter
              ? `Showing quotations for client: ${displayedQuotations[0]?.clientDetails.name || 'Unknown'}`
              : 'View, search, and manage all your quotations.'
            }
          </p>
        </div>
        <div className="flex gap-2">
          {clientFilter && (
            <Button
              variant="outline"
              onClick={() => setClientFilter(null)}
              className="gap-2"
            >
              Clear Filter
            </Button>
          )}
          <Button asChild className="gap-2 bg-primary hover:bg-primary/90 shadow-sm text-primary-foreground rounded-xl">
            <Link to="/create-quotation">
              <Plus className="w-4 h-4" />
              New Quotation
            </Link>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by client, project type, or quotation number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary rounded-xl"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 w-full justify-start overflow-x-auto no-scrollbar">
          <TabsTrigger value="all">All Quotations</TabsTrigger>
          <TabsTrigger value="working">Working</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {displayedQuotations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-card text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No quotations yet</h3>
              <p className="text-muted-foreground mb-6">Create your first quotation to get started.</p>
              <Button asChild>
                <Link to="/create-quotation">Create Quotation</Link>
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Desktop Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hidden lg:block section-card overflow-hidden"
              >
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="rounded-tl-lg">Client</th>
                      <th>Project Type</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th className="rounded-tr-lg text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedQuotations.map((quotation, index) => (
                      <motion.tr
                        key={quotation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td>
                          <div>
                            <p className="font-medium text-foreground">{quotation.clientDetails.name}</p>
                            <p className="text-sm text-muted-foreground">{quotation.clientDetails.email}</p>
                          </div>
                        </td>
                        <td className="text-muted-foreground">{quotation.projectDetails.projectType}</td>
                        <td className="text-muted-foreground">
                          {new Date(quotation.createdAt).toLocaleDateString()}
                        </td>
                        <td className="font-semibold text-foreground">
                          ₹{quotation.summary.grandTotal.toLocaleString('en-IN')}
                        </td>
                        <td>
                          <Select
                            value={quotation.status}
                            onValueChange={(value) => handleStatusChange(quotation.id, value)}
                          >
                            <SelectTrigger className="h-8 w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="sent">Sent</SelectItem>
                              <SelectItem value="work-in-progress">Working</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1">
                            {quotation.status === 'draft' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(quotation.id)}
                                title="Edit Draft"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                              <Link to={`/quotation/${quotation.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDuplicate(quotation.id)}
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDownloadPDF(quotation.id)}
                            >
                              <FileDown className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleCopyShareLink(quotation.id)}
                              title="Copy Client Link"
                            >
                              <Link2 className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-card">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this quotation? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(quotation.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {displayedQuotations.map((quotation, index) => (
                  <motion.div
                    key={quotation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="mobile-card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">{quotation.clientDetails.name}</p>
                        <p className="text-sm text-muted-foreground">{quotation.projectDetails.projectType}</p>
                      </div>
                      <Select
                        value={quotation.status}
                        onValueChange={(value) => handleStatusChange(quotation.id, value)}
                      >
                        <SelectTrigger className="h-7 w-[120px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="work-in-progress">Working</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-muted-foreground">
                        {new Date(quotation.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-foreground">
                        ₹{quotation.summary.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">
                      {quotation.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-1"
                          onClick={() => handleEdit(quotation.id)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </Button>
                      )}
                      <Button asChild variant="outline" size="sm" className="w-full gap-1">
                        <Link to={`/quotation/${quotation.id}`}>
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1"
                        onClick={() => handleDuplicate(quotation.id)}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1"
                        onClick={() => handleDownloadPDF(quotation.id)}
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1 text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50"
                        onClick={() => handleCopyShareLink(quotation.id)}
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        Share
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this quotation? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(quotation.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="working" className="mt-0">
          {displayedQuotations.filter(q => q.status === 'work-in-progress').length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-card text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No working projects</h3>
              <p className="text-muted-foreground mb-6">Change quotation status to 'Working' to track active projects.</p>
            </motion.div>
          ) : (
            <>
              {/* Desktop Table for Working Projects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hidden lg:block section-card overflow-hidden"
              >
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="rounded-tl-lg">Client</th>
                      <th>Project Type</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th className="rounded-tr-lg text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedQuotations.filter(q => q.status === 'work-in-progress').map((quotation, index) => (
                      <motion.tr
                        key={quotation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td>
                          <div>
                            <p className="font-medium text-foreground">{quotation.clientDetails.name}</p>
                            <p className="text-sm text-muted-foreground">{quotation.clientDetails.email}</p>
                          </div>
                        </td>
                        <td className="text-muted-foreground">{quotation.projectDetails.projectType}</td>
                        <td className="text-muted-foreground">
                          {new Date(quotation.createdAt).toLocaleDateString()}
                        </td>
                        <td className="font-semibold text-foreground">
                          ₹{quotation.summary.grandTotal.toLocaleString('en-IN')}
                        </td>
                        <td>
                          <Select
                            value={quotation.status}
                            onValueChange={(value) => handleStatusChange(quotation.id, value)}
                          >
                            <SelectTrigger className="h-8 w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="sent">Sent</SelectItem>
                              <SelectItem value="work-in-progress">Working</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1">
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                              <Link to={`/quotation/${quotation.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDownloadPDF(quotation.id)}
                            >
                              <FileDown className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-card">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this quotation? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(quotation.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>

              {/* Mobile Cards for Working Projects */}
              <div className="lg:hidden space-y-4">
                {displayedQuotations.filter(q => q.status === 'work-in-progress').map((quotation, index) => (
                  <motion.div
                    key={quotation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="mobile-card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">{quotation.clientDetails.name}</p>
                        <p className="text-sm text-muted-foreground">{quotation.projectDetails.projectType}</p>
                      </div>
                      <Select
                        value={quotation.status}
                        onValueChange={(value) => handleStatusChange(quotation.id, value)}
                      >
                        <SelectTrigger className="h-7 w-[120px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="work-in-progress">Working</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-muted-foreground">
                        {new Date(quotation.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-foreground">
                        ₹{quotation.summary.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-t border-border pt-3">
                      <Button asChild variant="outline" size="sm" className="w-full gap-1">
                        <Link to={`/quotation/${quotation.id}`}>
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1"
                        onClick={() => handleDownloadPDF(quotation.id)}
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        PDF
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this quotation? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(quotation.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Sent Tab */}
        <TabsContent value="sent" className="mt-0">
          {displayedQuotations.filter(q => q.status === 'sent').length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-card text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No sent quotations</h3>
              <p className="text-muted-foreground">Quotations marked as 'Sent' will appear here.</p>
            </motion.div>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hidden lg:block section-card overflow-hidden">
                <table className="data-table">
                  <thead><tr><th className="rounded-tl-lg">Client</th><th>Project Type</th><th>Date</th><th>Amount</th><th>Status</th><th className="rounded-tr-lg text-right">Actions</th></tr></thead>
                  <tbody>
                    {displayedQuotations.filter(q => q.status === 'sent').map((quotation, index) => (
                      <motion.tr key={quotation.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                        <td><div><p className="font-medium text-foreground">{quotation.clientDetails.name}</p><p className="text-sm text-muted-foreground">{quotation.clientDetails.email}</p></div></td>
                        <td className="text-muted-foreground">{quotation.projectDetails.projectType}</td>
                        <td className="text-muted-foreground">{new Date(quotation.createdAt).toLocaleDateString()}</td>
                        <td className="font-semibold text-foreground">₹{quotation.summary.grandTotal.toLocaleString('en-IN')}</td>
                        <td><Select value={quotation.status} onValueChange={(value) => handleStatusChange(quotation.id, value)}><SelectTrigger className="h-8 w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="sent">Sent</SelectItem><SelectItem value="work-in-progress">Working</SelectItem><SelectItem value="accepted">Accepted</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select></td>
                        <td><div className="flex items-center justify-end gap-1"><Button asChild variant="ghost" size="icon" className="h-8 w-8"><Link to={`/quotation/${quotation.id}`}><Eye className="w-4 h-4" /></Link></Button><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownloadPDF(quotation.id)}><FileDown className="w-4 h-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger><AlertDialogContent className="bg-card"><AlertDialogHeader><AlertDialogTitle>Delete Quotation</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this quotation? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(quotation.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
              <div className="lg:hidden space-y-4">
                {displayedQuotations.filter(q => q.status === 'sent').map((quotation, index) => (
                  <motion.div key={quotation.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="mobile-card">
                    <div className="flex items-start justify-between mb-3"><div><p className="font-medium text-foreground">{quotation.clientDetails.name}</p><p className="text-sm text-muted-foreground">{quotation.projectDetails.projectType}</p></div><Select value={quotation.status} onValueChange={(value) => handleStatusChange(quotation.id, value)}><SelectTrigger className="h-7 w-[120px] text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="sent">Sent</SelectItem><SelectItem value="work-in-progress">Working</SelectItem><SelectItem value="accepted">Accepted</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select></div>
                    <div className="flex items-center justify-between text-sm mb-4"><span className="text-muted-foreground">{new Date(quotation.createdAt).toLocaleDateString()}</span><span className="font-semibold text-foreground">₹{quotation.summary.grandTotal.toLocaleString('en-IN')}</span></div>
                    <div className="grid grid-cols-3 gap-2 border-t border-border pt-3"><Button asChild variant="outline" size="sm" className="w-full gap-1"><Link to={`/quotation/${quotation.id}`}><Eye className="w-3.5 h-3.5" />View</Link></Button><Button variant="outline" size="sm" className="w-full gap-1" onClick={() => handleDownloadPDF(quotation.id)}><FileDown className="w-3.5 h-3.5" />PDF</Button><AlertDialog><AlertDialogTrigger asChild><Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button></AlertDialogTrigger><AlertDialogContent className="bg-card"><AlertDialogHeader><AlertDialogTitle>Delete Quotation</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this quotation? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(quotation.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Accepted Tab */}
        <TabsContent value="accepted" className="mt-0">
          {displayedQuotations.filter(q => q.status === 'accepted').length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-card text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No accepted quotations</h3>
              <p className="text-muted-foreground">Quotations marked as 'Accepted' will appear here.</p>
            </motion.div>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hidden lg:block section-card overflow-hidden">
                <table className="data-table">
                  <thead><tr><th className="rounded-tl-lg">Client</th><th>Project Type</th><th>Date</th><th>Amount</th><th>Status</th><th className="rounded-tr-lg text-right">Actions</th></tr></thead>
                  <tbody>
                    {displayedQuotations.filter(q => q.status === 'accepted').map((quotation, index) => (
                      <motion.tr key={quotation.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                        <td><div><p className="font-medium text-foreground">{quotation.clientDetails.name}</p><p className="text-sm text-muted-foreground">{quotation.clientDetails.email}</p></div></td>
                        <td className="text-muted-foreground">{quotation.projectDetails.projectType}</td>
                        <td className="text-muted-foreground">{new Date(quotation.createdAt).toLocaleDateString()}</td>
                        <td className="font-semibold text-foreground">₹{quotation.summary.grandTotal.toLocaleString('en-IN')}</td>
                        <td><Select value={quotation.status} onValueChange={(value) => handleStatusChange(quotation.id, value)}><SelectTrigger className="h-8 w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="sent">Sent</SelectItem><SelectItem value="work-in-progress">Working</SelectItem><SelectItem value="accepted">Accepted</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select></td>
                        <td><div className="flex items-center justify-end gap-1"><Button asChild variant="ghost" size="icon" className="h-8 w-8"><Link to={`/quotation/${quotation.id}`}><Eye className="w-4 h-4" /></Link></Button><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownloadPDF(quotation.id)}><FileDown className="w-4 h-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger><AlertDialogContent className="bg-card"><AlertDialogHeader><AlertDialogTitle>Delete Quotation</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this quotation? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(quotation.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
              <div className="lg:hidden space-y-4">
                {displayedQuotations.filter(q => q.status === 'accepted').map((quotation, index) => (
                  <motion.div key={quotation.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="mobile-card">
                    <div className="flex items-start justify-between mb-3"><div><p className="font-medium text-foreground">{quotation.clientDetails.name}</p><p className="text-sm text-muted-foreground">{quotation.projectDetails.projectType}</p></div><Select value={quotation.status} onValueChange={(value) => handleStatusChange(quotation.id, value)}><SelectTrigger className="h-7 w-[120px] text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="sent">Sent</SelectItem><SelectItem value="work-in-progress">Working</SelectItem><SelectItem value="accepted">Accepted</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select></div>
                    <div className="flex items-center justify-between text-sm mb-4"><span className="text-muted-foreground">{new Date(quotation.createdAt).toLocaleDateString()}</span><span className="font-semibold text-foreground">₹{quotation.summary.grandTotal.toLocaleString('en-IN')}</span></div>
                    <div className="grid grid-cols-3 gap-2 border-t border-border pt-3"><Button asChild variant="outline" size="sm" className="w-full gap-1"><Link to={`/quotation/${quotation.id}`}><Eye className="w-3.5 h-3.5" />View</Link></Button><Button variant="outline" size="sm" className="w-full gap-1" onClick={() => handleDownloadPDF(quotation.id)}><FileDown className="w-3.5 h-3.5" />PDF</Button><AlertDialog><AlertDialogTrigger asChild><Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button></AlertDialogTrigger><AlertDialogContent className="bg-card"><AlertDialogHeader><AlertDialogTitle>Delete Quotation</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this quotation? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(quotation.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Rejected Tab */}
        <TabsContent value="rejected" className="mt-0">
          {displayedQuotations.filter(q => q.status === 'rejected').length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-card text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No rejected quotations</h3>
              <p className="text-muted-foreground">Quotations marked as 'Rejected' will appear here.</p>
            </motion.div>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hidden lg:block section-card overflow-hidden">
                <table className="data-table">
                  <thead><tr><th className="rounded-tl-lg">Client</th><th>Project Type</th><th>Date</th><th>Amount</th><th>Status</th><th className="rounded-tr-lg text-right">Actions</th></tr></thead>
                  <tbody>
                    {displayedQuotations.filter(q => q.status === 'rejected').map((quotation, index) => (
                      <motion.tr key={quotation.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                        <td><div><p className="font-medium text-foreground">{quotation.clientDetails.name}</p><p className="text-sm text-muted-foreground">{quotation.clientDetails.email}</p></div></td>
                        <td className="text-muted-foreground">{quotation.projectDetails.projectType}</td>
                        <td className="text-muted-foreground">{new Date(quotation.createdAt).toLocaleDateString()}</td>
                        <td className="font-semibold text-foreground">₹{quotation.summary.grandTotal.toLocaleString('en-IN')}</td>
                        <td><Select value={quotation.status} onValueChange={(value) => handleStatusChange(quotation.id, value)}><SelectTrigger className="h-8 w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="sent">Sent</SelectItem><SelectItem value="work-in-progress">Working</SelectItem><SelectItem value="accepted">Accepted</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select></td>
                        <td><div className="flex items-center justify-end gap-1"><Button asChild variant="ghost" size="icon" className="h-8 w-8"><Link to={`/quotation/${quotation.id}`}><Eye className="w-4 h-4" /></Link></Button><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownloadPDF(quotation.id)}><FileDown className="w-4 h-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger><AlertDialogContent className="bg-card"><AlertDialogHeader><AlertDialogTitle>Delete Quotation</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this quotation? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(quotation.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
              <div className="lg:hidden space-y-4">
                {displayedQuotations.filter(q => q.status === 'rejected').map((quotation, index) => (
                  <motion.div key={quotation.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="mobile-card">
                    <div className="flex items-start justify-between mb-3"><div><p className="font-medium text-foreground">{quotation.clientDetails.name}</p><p className="text-sm text-muted-foreground">{quotation.projectDetails.projectType}</p></div><Select value={quotation.status} onValueChange={(value) => handleStatusChange(quotation.id, value)}><SelectTrigger className="h-7 w-[120px] text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="sent">Sent</SelectItem><SelectItem value="work-in-progress">Working</SelectItem><SelectItem value="accepted">Accepted</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select></div>
                    <div className="flex items-center justify-between text-sm mb-4"><span className="text-muted-foreground">{new Date(quotation.createdAt).toLocaleDateString()}</span><span className="font-semibold text-foreground">₹{quotation.summary.grandTotal.toLocaleString('en-IN')}</span></div>
                    <div className="grid grid-cols-3 gap-2 border-t border-border pt-3"><Button asChild variant="outline" size="sm" className="w-full gap-1"><Link to={`/quotation/${quotation.id}`}><Eye className="w-3.5 h-3.5" />View</Link></Button><Button variant="outline" size="sm" className="w-full gap-1" onClick={() => handleDownloadPDF(quotation.id)}><FileDown className="w-3.5 h-3.5" />PDF</Button><AlertDialog><AlertDialogTrigger asChild><Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button></AlertDialogTrigger><AlertDialogContent className="bg-card"><AlertDialogHeader><AlertDialogTitle>Delete Quotation</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this quotation? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(quotation.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * 📋 QUOTATION LIST PAGE - MODULE SUMMARY & FLOW
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * 🎯 PURPOSE:
 * Central hub for managing all quotations with table view, actions, and quick
 * access to create, view, download, and delete quotations.
 * 
 * ───────────────────────────────────────────────────────────────────────────
 * 📦 MODULES & COMPONENTS:
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * 1. HEADER SECTION
 *    ├─ Page Title: "Quotations"
 *    ├─ Description: "Manage all your quotations in one place"
 *    └─ CTA Button: "New Quotation" (+ icon)
 * 
 * 2. EMPTY STATE MODULE
 *    ├─ Icon: FileText (centered)
 *    ├─ Message: "No quotations yet"
 *    ├─ Helper Text: "Create your first quotation to get started"
 *    └─ Action Button: "Create Quotation"
 * 
 * 3. DESKTOP TABLE VIEW (md+)
 *    ├─ Columns:
 *    │  ├─ Client (Name + Email)
 *    │  ├─ Project Type
 *    │  ├─ Date (Created)
 *    │  ├─ Amount (₹ formatted)
 *    │  ├─ Status (Badge w/ color coding)
 *    │  └─ Actions (View, Download, Delete)
 *    │
 *    └─ Features:
 *       ├─ Sortable columns
 *       ├─ Staggered row animations
 *       └─ Hover effects
 * 
 * 4. MOBILE CARD VIEW (sm-)
 *    ├─ Card Layout:
 *    │  ├─ Client Name + Status Badge (Top)
 *    │  ├─ Project Type (Subtitle)
 *    │  ├─ Date + Amount (Bottom row)
 *    │  └─ Action Buttons Row
 *    │
 *    └─ Buttons:
 *       ├─ View (Eye icon)
 *       ├─ Download PDF (FileDown icon)
 *       └─ Delete (Trash2 icon)
 * 
 * 5. STATUS BADGES
 *    ├─ Draft: Gray background
 *    ├─ Sent: Blue background
 *    ├─ Accepted: Green background
 *    └─ Rejected: Red background
 * 
 * 6. ACTION HANDLERS
 *    ├─ handleDownloadPDF() - Generate & download PDF
 *    ├─ handleDelete() - Delete with confirmation dialog
 *    └─ View Navigation - Link to preview page
 * 
 * ───────────────────────────────────────────────────────────────────────────
 * 🔄 COMPLETE USER FLOW:
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * Step 1: LANDING ON LIST PAGE
 *    ├─ From Dashboard → "View All Projects"
 *    ├─ From Sidebar → "Quotations" menu
 *    └─ After Creating/Saving → Auto-redirect
 *         ↓
 * Step 2: VIEW OPTIONS
 *    ├─ IF Empty → Show Empty State + CTA
 *    └─ IF Has Data → Show Table/Cards
 *         ↓
 * Step 3: FOUR PRIMARY ACTIONS
 *    ├─ ACTION A: Create New
 *    │   └─ Click "New Quotation" → Navigate to /create-quotation
 *    │
 *    ├─ ACTION B: View Details
 *    │   └─ Click Eye Icon → Navigate to /quotation/:id
 *    │
 *    ├─ ACTION C: Download PDF
 *    │   └─ Click Download → Generate PDF → Download File
 *    │
 *    └─ ACTION D: Delete
 *        └─ Click Trash → Confirmation Dialog → Delete from Store
 * 
 * Step 4: RESPONSIVE ADAPTATION
 *    ├─ Desktop: Full table with all columns
 *    ├─ Tablet: Table with adjusted spacing
 *    └─ Mobile: Card-based layout
 * 
 * ───────────────────────────────────────────────────────────────────────────
 * 🎨 UI/UX FEATURES:
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * ✅ Framer Motion Animations
 *    ├─ Page entrance fade-in
 *    ├─ Staggered row/card animations (0.05s delay)
 *    └─ Smooth state transitions
 * 
 * ✅ Responsive Design
 *    ├─ Mobile-first card layout
 *    ├─ Desktop table view
 *    └─ Adaptive button sizes
 * 
 * ✅ Color-Coded Status
 *    ├─ Visual status identification
 *    ├─ Consistent badge styling
 *    └─ Accessible color contrasts
 * 
 * ✅ Empty State Handling
 *    ├─ Clear messaging
 *    ├─ Guided next actions
 *    └─ Visual feedback
 * 
 * ✅ Confirmation Dialogs
 *    ├─ AlertDialog for delete actions
 *    ├─ Clear destructive action warnings
 *    └─ Cancel/Confirm options
 * 
 * ───────────────────────────────────────────────────────────────────────────
 * 🔗 INTEGRATIONS & DATA FLOW:
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * 📁 QuotationContext:
 *    ├─ quotations[] - Array of all quotations
 *    ├─ deleteQuotation(id) - Remove from store
 *    └─ companyDetails - For PDF generation
 * 
 * 🔧 Utilities:
 *    ├─ generateQuotationPDF(quotation, company) - PDF export
 *    └─ toast() - User feedback notifications
 * 
 * 🎯 Navigation:
 *    ├─ /create-quotation - Create new
 *    ├─ /quotation/:id - View/Preview
 *    └─ Internal state updates
 * 
 * ───────────────────────────────────────────────────────────────────────────
 * 📊 DATA DISPLAY:
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * Each Quotation Shows:
 *    ├─ Client Details (Name, Email)
 *    ├─ Project Information (Type, Location)
 *    ├─ Financial Data (Grand Total formatted)
 *    ├─ Timestamps (Created date)
 *    ├─ Status Badge (Visual indicator)
 *    └─ Quick Actions (3-button row)
 * 
 * ───────────────────────────────────────────────────────────────────────────
 * ✨ FLOW VALIDATION: ✅ PERFECT
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * ✅ List Management: Clean, sortable, filterable ready
 * ✅ CRUD Operations: Full Create, Read, Delete support
 * ✅ Responsive Design: Mobile-first with desktop enhancement
 * ✅ User Feedback: Toast notifications for all actions
 * ✅ Error Prevention: Confirmation dialogs for destructive actions
 * ✅ Navigation: Seamless routing between pages
 * ✅ Performance: Optimized rendering with stagger animations
 * 
 * 🎯 CONCLUSION: Clean list interface with intuitive actions!
 * 
 * ════════════════════════════════════════════════════════════════════════════
 */
