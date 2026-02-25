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
    ArrowUpRight,
    Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { feedbackApi } from '@/services/api/feedbackApi';
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
            // Use the dedicated feedback API endpoint
            const response = await feedbackApi.getAllWithFeedback();
            if (response.success && response.data) {
                setQuotations(response.data as any[]);
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
            q.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.quotationNumber?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="px-4 md:px-6 py-4 max-w-[1600px] mx-auto min-h-screen bg-background w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Client Feedback
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Review and manage client responses to your quotations.
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by client or quotation #"
                        className="pl-9 bg-card h-9 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
                    <TabsList className="grid w-full grid-cols-4 md:w-auto h-9">
                        <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                        <TabsTrigger value="approved" className="text-xs">Approved</TabsTrigger>
                        <TabsTrigger value="changes-requested" className="text-xs">Changes</TabsTrigger>
                        <TabsTrigger value="rejected" className="text-xs">Rejected</TabsTrigger>
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
                                    <div className="p-4">
                                        <div className="flex flex-col lg:flex-row gap-4 justify-between">

                                            {/* Left: Info */}
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-mono text-xs text-muted-foreground">
                                                                #{quotation.quotationNumber}
                                                            </span>
                                                            <Badge variant="outline" className={`gap-1 px-2 py-0 h-5 text-xs ${getStatusColor(quotation.clientStatus)}`}>
                                                                {getStatusIcon(quotation.clientStatus)}
                                                                {quotation.clientStatus === 'changes-requested' ? 'Changes Requested' :
                                                                    quotation.clientStatus.charAt(0).toUpperCase() + quotation.clientStatus.slice(1)}
                                                            </Badge>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-foreground">
                                                            {quotation.client?.name || 'Unknown Client'}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                            <Calendar className="w-3 h-3" />
                                                            Responded on {quotation.clientFeedback?.respondedAt ? format(new Date(quotation.clientFeedback.respondedAt), 'PPP p') : 'Unknown date'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Feedback Content */}
                                                <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                                                    {quotation.clientStatus === 'approved' && (
                                                        <div className="flex gap-3">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm font-medium text-emerald-900 mb-0.5">Quotation Approved</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {quotation.clientFeedback?.comments || "No additional comments provided."}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {quotation.clientStatus === 'rejected' && (
                                                        <div className="flex gap-3">
                                                            <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                                                            <div>
                                                                <p className="text-sm font-medium text-red-900 mb-0.5">Quotation Rejected</p>
                                                                <p className="text-xs font-medium text-foreground mb-1">Reason: {quotation.clientFeedback?.rejectionReason}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {quotation.clientFeedback?.comments}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {quotation.clientStatus === 'changes-requested' && (
                                                        <div className="flex gap-3">
                                                            <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-blue-900 mb-1">Requested Changes</p>
                                                                {quotation.clientFeedback?.requestedChanges && quotation.clientFeedback.requestedChanges.length > 0 ? (
                                                                    <ul className="list-disc pl-4 space-y-0.5 mb-1.5">
                                                                        {quotation.clientFeedback.requestedChanges.map((change: string, i: number) => (
                                                                            <li key={i} className="text-xs text-foreground">{change}</li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="text-xs text-muted-foreground italic mb-1.5">No specific changes listed.</p>
                                                                )}
                                                                {quotation.clientFeedback?.comments && (
                                                                    <p className="text-xs text-muted-foreground border-t border-blue-200/50 pt-1.5 mt-1.5">
                                                                        <span className="font-medium text-blue-800">Note:</span> {quotation.clientFeedback.comments}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 lg:border-l lg:pl-6 min-w-[150px]">
                                                <div className="text-right hidden lg:block">
                                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Value</p>
                                                    <p className="text-xl font-bold text-foreground">₹{quotation.summary?.grandTotal?.toLocaleString()}</p>
                                                </div>

                                                <div className="flex flex-col gap-2 w-full lg:w-auto">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 lg:flex-none gap-2 h-8 text-xs"
                                                        onClick={() => navigate(`/quotation/${quotation.id}`)}
                                                    >
                                                        View Quotation
                                                        <ArrowUpRight className="w-3 h-3" />
                                                    </Button>
                                                    {quotation.clientStatus === 'changes-requested' && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="flex-1 lg:flex-none gap-2 h-8 text-xs bg-blue-600 hover:bg-blue-700"
                                                            onClick={() => navigate(`/create-quotation?edit=${quotation.id}`)}
                                                        >
                                                            <Pencil className="w-3 h-3" />
                                                            Edit
                                                        </Button>
                                                    )}
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
