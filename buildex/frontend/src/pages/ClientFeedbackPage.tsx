import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Search,
    Filter,
    Calendar,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { quotationApi } from '@/services/api/quotationApi';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function ClientFeedbackPage() {
    const navigate = useNavigate();
    const [quotations, setQuotations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            // Fetch all quotations that have a client status other than pending/viewed
            // Ideally backend should filter this, but for now we fetch and filter or update backend.
            // We updated backend to support clientStatus filtering.

            // We want everything that IS NOT pending or viewed. 
            // Since our backend simple filter might not support "ne" (not equal), 
            // we can fetch all and filter client-side, OR make multiple requests.
            // Let's fetch all for now as the volume might not be huge yet.
            const response = await quotationApi.getAll();
            if (response.success && response.data) {
                // Filter for relevant statuses
                const feedbacks = response.data.filter((q: any) =>
                    ['approved', 'rejected', 'changes-requested'].includes(q.clientStatus)
                );
                setQuotations(feedbacks);
            }
        } catch (error) {
            console.error('Failed to fetch feedback', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'changes-requested': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            case 'changes-requested': return <MessageSquare className="w-4 h-4" />;
            default: return <AlertTriangle className="w-4 h-4" />;
        }
    };

    const filteredQuotations = quotations.filter(q => {
        const matchesFilter = filter === 'all' || q.clientStatus === filter;
        const matchesSearch =
            q.clientDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.quotationNumber?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-background">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Client Feedback
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Review and manage client responses to your quotations.
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by client or quotation #"
                        className="pl-9 bg-card"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
                    <TabsList className="grid w-full grid-cols-4 md:w-auto">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="changes-requested">Changes</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : filteredQuotations.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-xl border border-dashed">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium">No feedback found</h3>
                    <p className="text-muted-foreground">
                        {searchQuery ? "Try adjusting your search terms" : "When clients respond to quotations, they'll appear here."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    <AnimatePresence>
                        {filteredQuotations.map((quotation) => (
                            <motion.div
                                key={quotation.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <Card className="hover:shadow-md transition-shadow duration-200 border-l-4" style={{
                                    borderLeftColor:
                                        quotation.clientStatus === 'approved' ? '#10b981' :
                                            quotation.clientStatus === 'rejected' ? '#ef4444' :
                                                '#3b82f6'
                                }}>
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row gap-6 justify-between">

                                            {/* Left: Info */}
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="font-mono text-sm text-muted-foreground">
                                                                #{quotation.quotationNumber}
                                                            </span>
                                                            <Badge variant="outline" className={`gap-1.5 ${getStatusColor(quotation.clientStatus)}`}>
                                                                {getStatusIcon(quotation.clientStatus)}
                                                                {quotation.clientStatus === 'changes-requested' ? 'Changes Requested' :
                                                                    quotation.clientStatus.charAt(0).toUpperCase() + quotation.clientStatus.slice(1)}
                                                            </Badge>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-foreground">
                                                            {quotation.clientDetails?.name || 'Unknown Client'}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            Responded on {quotation.clientFeedback?.respondedAt ? format(new Date(quotation.clientFeedback.respondedAt), 'PPP p') : 'Unknown date'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Feedback Content */}
                                                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                                                    {quotation.clientStatus === 'approved' && (
                                                        <div className="flex gap-3">
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-emerald-900 mb-1">Quotation Approved</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {quotation.clientFeedback?.comments || "No additional comments provided."}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {quotation.clientStatus === 'rejected' && (
                                                        <div className="flex gap-3">
                                                            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-red-900 mb-1">Quotation Rejected</p>
                                                                <p className="text-sm font-medium text-foreground mb-1">Reason: {quotation.clientFeedback?.rejectionReason}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {quotation.clientFeedback?.comments}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {quotation.clientStatus === 'changes-requested' && (
                                                        <div className="flex gap-3">
                                                            <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                                                            <div className="flex-1">
                                                                <p className="font-medium text-blue-900 mb-2">Requested Changes</p>
                                                                {quotation.clientFeedback?.requestedChanges && quotation.clientFeedback.requestedChanges.length > 0 ? (
                                                                    <ul className="list-disc pl-4 space-y-1 mb-2">
                                                                        {quotation.clientFeedback.requestedChanges.map((change: string, i: number) => (
                                                                            <li key={i} className="text-sm text-foreground">{change}</li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="text-sm text-muted-foreground italic mb-2">No specific changes listed.</p>
                                                                )}
                                                                {quotation.clientFeedback?.comments && (
                                                                    <p className="text-sm text-muted-foreground border-t border-blue-200/50 pt-2 mt-2">
                                                                        <span className="font-medium text-blue-800">Note:</span> {quotation.clientFeedback.comments}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:border-l lg:pl-6 min-w-[200px]">
                                                <div className="text-right hidden lg:block">
                                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total Value</p>
                                                    <p className="text-2xl font-bold text-foreground">₹{quotation.summary?.grandTotal?.toLocaleString()}</p>
                                                </div>

                                                <div className="flex gap-3 w-full lg:w-auto">
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 lg:flex-none gap-2"
                                                        onClick={() => navigate(`/quotation/${quotation.id}`)}
                                                    >
                                                        View Quotation
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
