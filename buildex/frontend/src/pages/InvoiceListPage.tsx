import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Receipt,
    Search,
    Filter,
    Eye,
    Download,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    IndianRupee
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Invoice } from '@/types/invoice';



const statusConfig = {
    'Pending': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    'Partial': { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    'Paid': { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    'Overdue': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

import { useInvoices } from '@/contexts/InvoiceContext';

// ...

export default function InvoiceListPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const { invoices } = useInvoices();

    // Stats calculated from invoices available in context

    // Calculate stats
    const stats = {
        totalInvoiced: invoices.reduce((sum, inv) => sum + inv.summary.grandTotal, 0),
        paid: invoices.filter(inv => inv.paymentStatus === 'Paid').reduce((sum, inv) => sum + inv.summary.grandTotal, 0),
        pending: invoices.filter(inv => inv.paymentStatus === 'Pending').reduce((sum, inv) => sum + inv.balanceAmount, 0),
        overdue: invoices.filter(inv => inv.paymentStatus === 'Overdue').reduce((sum, inv) => sum + inv.balanceAmount, 0),
    };

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch =
            invoice.clientDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || invoice.paymentStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen px-6 py-4 bg-background/50 space-y-6 max-w-[1600px] mx-auto w-full"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 w-fit">
                            Invoices
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Track payments and manage billing
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Invoiced</p>
                            <p className="text-2xl font-bold text-foreground mt-1">₹{stats.totalInvoiced.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500/10">
                            <Receipt className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Paid</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">₹{stats.paid.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Pending</p>
                            <p className="text-2xl font-bold text-amber-600 mt-1">₹{stats.pending.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500/10">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Overdue</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">₹{stats.overdue.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-red-500/10">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by client name or invoice number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-background/50 border-border/50 rounded-xl"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px] bg-background/50 border-border/50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    <SelectValue placeholder="Filter by status" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Partial">Partial</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </motion.div>

            {/* Invoice List */}
            {filteredInvoices.length === 0 ? (
                <motion.div variants={itemVariants} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-16 shadow-sm text-center">
                    <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
                        <Receipt className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Invoices Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Start by converting approved quotations into invoices to track payments
                    </p>
                    <Button asChild className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600">
                        <Link to="/quotations">Go to Quotations</Link>
                    </Button>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {filteredInvoices.map((invoice) => {
                        const StatusIcon = statusConfig[invoice.paymentStatus].icon;

                        return (
                            <motion.div
                                key={invoice.id}
                                variants={itemVariants}
                                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                                    {/* Left: Invoice Info */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-emerald-500/10 flex-shrink-0">
                                                <Receipt className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-semibold text-foreground">
                                                        {invoice.invoiceNumber}
                                                    </h3>
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-xs font-medium border",
                                                        statusConfig[invoice.paymentStatus].bg,
                                                        statusConfig[invoice.paymentStatus].color,
                                                        statusConfig[invoice.paymentStatus].border
                                                    )}>
                                                        <StatusIcon className="w-3 h-3 inline mr-1" />
                                                        {invoice.paymentStatus}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Client: <span className="font-medium text-foreground">{invoice.clientDetails.name}</span>
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Project: {invoice.projectDetails.projectType}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle: Amount Details */}
                                    <div className="flex-shrink-0 text-left lg:text-right space-y-1">
                                        <p className="text-sm text-muted-foreground">Total Amount</p>
                                        <p className="text-2xl font-bold text-foreground">
                                            ₹{invoice.summary.grandTotal.toLocaleString('en-IN')}
                                        </p>
                                        {invoice.paymentStatus !== 'Paid' && (
                                            <p className="text-xs text-muted-foreground">
                                                Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl border-border/50 hover:bg-muted/50"
                                        >
                                            <Link to={`/invoice/${invoice.id}`}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                View
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl border-border/50 hover:bg-muted/50"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}
