import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    Check,
    Trash2,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notificationApi } from '@/services/api/miscApi';
import { useToast } from '@/components/ui/use-toast';

export default function NotificationsPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationApi.getAll();
            if (response.success && response.data) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Failed to load notifications', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load notifications",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await notificationApi.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast({
                title: "Success",
                description: "All notifications marked as read",
            });
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await notificationApi.delete(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
            toast({
                title: "Deleted",
                description: "Notification removed",
            });
        } catch (error) {
            console.error('Failed to delete notification', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
            default: return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-emerald-500/10 border-emerald-500/20';
            case 'error': return 'bg-red-500/10 border-red-500/20';
            case 'warning': return 'bg-amber-500/10 border-amber-500/20';
            default: return 'bg-blue-500/10 border-blue-500/20';
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen p-6 max-w-[1200px] mx-auto space-y-6 w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Notifications
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Updates on your quotations and client interactions.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleMarkAllAsRead}
                        className="gap-2"
                        disabled={loading || notifications.length === 0}
                    >
                        <Check className="w-4 h-4" />
                        Mark all read
                    </Button>
                </div>
            </motion.div>

            {/* Notifications List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <p>Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/50 border border-dashed border-border rounded-xl">
                        <Bell className="w-12 h-12 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-foreground">No notifications</h3>
                        <p>You're all caught up!</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {notifications.map((notif) => (
                            <motion.div
                                key={notif._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className={`relative group flex gap-4 p-4 rounded-xl border transition-all hover:shadow-md ${notif.isRead ? 'bg-card/50 border-border/50 opacity-70' : 'bg-card border-border shadow-sm'
                                    }`}
                            >
                                {!notif.isRead && (
                                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary animate-pulse" />
                                )}

                                <div className={`mt-1 p-2 rounded-lg h-fit ${getBgColor(notif.type)}`}>
                                    {getIcon(notif.type)}
                                </div>

                                <div className="flex-1 min-w-0 pr-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                                        <h4 className={`font-medium ${notif.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                                            {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                                        </h4>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm ${notif.isRead ? 'text-muted-foreground' : 'text-foreground/90'}`}>
                                        {notif.message}
                                    </p>
                                    {notif.clientName && (
                                        <p className="text-xs text-primary/80 mt-2 font-medium">
                                            Client: {notif.clientName}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!notif.isRead && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                            onClick={(e) => handleMarkAsRead(notif._id, e)}
                                            title="Mark as read"
                                        >
                                            <Check className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                        onClick={(e) => handleDelete(notif._id, e)}
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </motion.div>
        </div>
    );
}
