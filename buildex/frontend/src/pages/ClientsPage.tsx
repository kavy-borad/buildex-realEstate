import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Search,
    Phone,
    Plus,
    Trash2,
    Mail,
    TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { clientApi, Client } from '@/services/api/clientApi';
import { useQuotations } from '@/contexts/QuotationContext';

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);
    const { quotations } = useQuotations();
    const navigate = useNavigate();

    const handleDeleteClient = async () => {
        if (!clientToDelete) return;
        try {
            const response = await clientApi.delete(clientToDelete);
            if (response.success) {
                setClients(prev => prev.filter(c => c._id !== clientToDelete));
                toast({ title: "Client deleted", description: "Client has been removed successfully." });
            } else {
                toast({ variant: "destructive", title: "Error", description: response.error || "Failed to delete client" });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Something went wrong" });
        } finally {
            setClientToDelete(null);
        }
    };

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await clientApi.getAll();
                if (response.success && response.data) {
                    setClients(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch clients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper function to get client quotations and stats
    const getClientStats = (clientPhone: string, clientEmail?: string) => {
        const clientQuotations = quotations.filter(q =>
            q.clientDetails.phone === clientPhone ||
            (clientEmail && q.clientDetails.email === clientEmail)
        );

        const workingCount = clientQuotations.filter(q => q.status === 'work-in-progress').length;
        const acceptedCount = clientQuotations.filter(q => q.status === 'accepted').length;
        const rejectedCount = clientQuotations.filter(q => q.status === 'rejected').length;
        const sentCount = clientQuotations.filter(q => q.status === 'sent').length;

        // Calculate real revenue from accepted quotations
        const totalRevenue = clientQuotations
            .filter(q => q.status === 'accepted')
            .reduce((sum, q) => sum + q.summary.grandTotal, 0);

        // Get last activity date
        const lastActivity = clientQuotations.length > 0
            ? new Date(Math.max(...clientQuotations.map(q => new Date(q.createdAt).getTime())))
            : null;

        return {
            totalQuotations: clientQuotations.length,
            workingCount,
            acceptedCount,
            rejectedCount,
            sentCount,
            totalRevenue,
            lastActivity
        };
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
            className="page-enter min-h-screen px-6 py-4 bg-background/50 space-y-6 max-w-[1600px] mx-auto w-full"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 w-fit">
                        Clients
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your customer database and relationships.</p>
                </div>

                <Button className="rounded-xl bg-primary hover:bg-primary/90 shadow-sm text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" /> Add New Client
                </Button>
            </motion.div>

            {/* Filters & Search */}
            <motion.div variants={itemVariants} className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-card/50 border-border/50 rounded-xl focus:ring-blue-500/20"
                    />
                </div>
            </motion.div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-10 text-muted-foreground">Loading clients...</div>
                ) : filteredClients.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-muted-foreground">No clients found.</div>
                ) : (
                    filteredClients.map((client) => {
                        const stats = getClientStats(client.phone, client.email);

                        return (
                            <motion.div
                                key={client._id}
                                variants={itemVariants}
                                onClick={() => {
                                    // Navigate to quotations page with client filter
                                    navigate('/quotations', { state: { clientFilter: client.phone } });
                                }}
                                className="group relative bg-card/50 backdrop-blur-sm border border-border/50 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 cursor-pointer"
                            >
                                <div className="absolute top-4 right-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setClientToDelete(client._id);
                                        }}
                                        title="Delete Client"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <span className="text-lg font-bold">{client.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg leading-tight">{client.name}</h3>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <Phone className="w-3 h-3" /> {client.phone}
                                        </p>
                                        {client.email && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <Mail className="w-3 h-3" /> {client.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Status Breakdown */}
                                {stats.totalQuotations > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {stats.workingCount > 0 && (
                                            <span className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 border border-blue-500/20">
                                                {stats.workingCount} Working
                                            </span>
                                        )}
                                        {stats.acceptedCount > 0 && (
                                            <span className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-600 border border-green-500/20">
                                                {stats.acceptedCount} Accepted
                                            </span>
                                        )}
                                        {stats.sentCount > 0 && (
                                            <span className="text-xs px-2 py-1 rounded-md bg-purple-500/10 text-purple-600 border border-purple-500/20">
                                                {stats.sentCount} Sent
                                            </span>
                                        )}
                                        {stats.rejectedCount > 0 && (
                                            <span className="text-xs px-2 py-1 rounded-md bg-red-500/10 text-red-600 border border-red-500/20">
                                                {stats.rejectedCount} Rejected
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                                        <p className="text-xs text-muted-foreground mb-1">Total Projects</p>
                                        <p className="font-semibold text-lg">{stats.totalQuotations}</p>
                                    </div>
                                    <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> Revenue
                                        </p>
                                        <p className="font-semibold text-lg text-green-600">
                                            ₹{stats.totalRevenue.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border/50 text-sm">
                                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${client.status === 'active' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                        'bg-gray-500/10 text-gray-600 border-gray-500/20'
                                        }`}>
                                        {client.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : 'Active'}
                                    </div>
                                    <span className="text-muted-foreground text-xs">
                                        {stats.lastActivity
                                            ? `Active ${stats.lastActivity.toLocaleDateString()}`
                                            : `Joined ${new Date(client.createdAt || Date.now()).toLocaleDateString()}`
                                        }
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the client and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteClient} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}
