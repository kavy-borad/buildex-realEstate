import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, WifiOff, Trash2, ArrowDown, Pause, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logApi } from '@/services/api/logApi';
import { ApiLog, LogStats } from '@/types/log';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'requests' | 'responses' | 'errors';

const METHOD_COLORS: Record<string, string> = {
    GET: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    POST: 'bg-blue-100 text-blue-700 border-blue-200',
    PUT: 'bg-amber-100 text-amber-700 border-amber-200',
    PATCH: 'bg-purple-100 text-purple-700 border-purple-200',
    DELETE: 'bg-red-100 text-red-700 border-red-200',
};

const getStatusColor = (status: number) => {
    if (status < 300) return 'bg-emerald-500 text-white';
    if (status < 400) return 'bg-blue-500 text-white';
    if (status < 500) return 'bg-amber-500 text-white';
    return 'bg-red-500 text-white';
};

const getTimeColor = (time: number) => {
    if (time < 100) return 'text-emerald-600';
    if (time < 500) return 'text-amber-600';
    return 'text-red-600';
};

export default function SystemLogsPage() {
    const [logs, setLogs] = useState<ApiLog[]>([]);
    const [stats, setStats] = useState<LogStats>({ totalRequests: 0, successRequests: 0, errorRequests: 0, avgResponseTime: 0 });
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [isConnected, setIsConnected] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const logListRef = useRef<HTMLDivElement>(null);
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const { toast } = useToast();

    // Fetch logs with pagination (default limit: 50)
    const fetchLogs = useCallback(async () => {
        try {
            const [logsRes, statsRes] = await Promise.all([
                logApi.getLogs({
                    limit: 50,
                    page: currentPage,
                    filter: activeFilter !== 'all' ? activeFilter : undefined
                }),
                logApi.getStats()
            ]);

            if (logsRes.success) {
                setLogs(logsRes.data);
                setTotalPages(logsRes.totalPages || 1);
            }
            if (statsRes.success) {
                setStats(statsRes.data);
            }
            setIsConnected(true);
            setIsLoading(false);
        } catch (error) {
            setIsConnected(false);
            setIsLoading(false);
        }
    }, [activeFilter, currentPage]);

    // Auto-refresh polling (5 seconds, only page 1)
    useEffect(() => {
        fetchLogs();

        if (autoRefresh) {
            pollIntervalRef.current = setInterval(() => {
                if (currentPage === 1) fetchLogs();
            }, 5000);
        }

        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, [fetchLogs, autoRefresh, currentPage]);

    // Page change handler
    const changePage = (dir: number) => {
        const newPage = currentPage + dir;
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Filter change resets to page 1
    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    // Clear all logs
    const handleClearLogs = async () => {
        try {
            await logApi.clearLogs();
            setLogs([]);
            setCurrentPage(1);
            setStats({ totalRequests: 0, successRequests: 0, errorRequests: 0, avgResponseTime: 0 });
            toast({ title: 'Logs Cleared', description: 'All system logs have been cleared.' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to clear logs.', variant: 'destructive' });
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });
    };

    const filters: { key: FilterType; label: string; icon: string }[] = [
        { key: 'all', label: 'All', icon: '📋' },
        { key: 'requests', label: 'Requests', icon: '📤' },
        { key: 'responses', label: 'Success', icon: '✓' },
        { key: 'errors', label: 'Errors', icon: '✕' },
    ];

    return (
        <div className="min-h-screen px-4 md:px-6 py-4 bg-background/50 space-y-4 max-w-[1600px] mx-auto w-full page-enter">

            {/* ═══ HEADER BAR ═══ */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                        <Activity className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            API Log Viewer
                        </h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            {isConnected ? (
                                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Connected
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                                    <WifiOff className="w-3 h-3" /> Disconnected
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant={autoRefresh ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={cn(
                            "rounded-lg gap-1.5 text-xs font-medium",
                            autoRefresh
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                : "border-border/50"
                        )}
                    >
                        {autoRefresh ? <ArrowDown className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                        Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearLogs}
                        className="rounded-lg gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear Logs
                    </Button>
                </div>
            </motion.div>

            {/* ═══ STATS ROW ═══ */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex flex-wrap items-center gap-x-8 gap-y-2 px-5 py-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</span>
                    <span className="text-lg font-bold text-foreground">{stats.totalRequests.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Success</span>
                    <span className="text-lg font-bold text-emerald-600">{stats.successRequests.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Errors</span>
                    <span className="text-lg font-bold text-red-600">{stats.errorRequests.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Response</span>
                    <span className="text-lg font-bold text-foreground">{stats.avgResponseTime}ms</span>
                </div>
            </motion.div>

            {/* ═══ FILTER ROW ═══ */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar"
            >
                {filters.map(f => (
                    <button
                        key={f.key}
                        onClick={() => handleFilterChange(f.key)}
                        className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap border",
                            activeFilter === f.key
                                ? "bg-indigi-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25"
                                : "bg-card/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <span>{f.icon}</span>
                        {f.label}
                    </button>
                ))}
            </motion.div>

            {/* ═══ LOG LIST ═══ */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm overflow-hidden"
            >
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-[80px_60px_1fr_80px_80px_100px] items-center px-5 py-3 bg-muted/30 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <span>Source</span>
                    <span>Method</span>
                    <span>URL</span>
                    <span className="text-right">Status</span>
                    <span className="text-right">Time</span>
                    <span className="text-right">Timestamp</span>
                </div>

                {/* Log Entries */}
                <div
                    ref={logListRef}
                    className="max-h-[calc(100vh-400px)] overflow-y-auto divide-y divide-border/30"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                            <span className="ml-3 text-muted-foreground">Loading logs...</span>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Activity className="w-10 h-10 text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground font-medium">No logs recorded yet</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                                API requests will appear here in real-time
                            </p>
                        </div>
                    ) : (
                        logs.map((log, index) => (
                            <motion.div
                                key={log._id}
                                initial={index < 5 ? { opacity: 0, x: -10 } : false}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index < 5 ? index * 0.03 : 0 }}
                                className={cn(
                                    "grid grid-cols-1 md:grid-cols-[80px_60px_1fr_80px_80px_100px] items-center px-5 py-3 hover:bg-muted/30 transition-colors duration-150 cursor-default group",
                                    log.status >= 400 && "bg-red-50/30 dark:bg-red-950/10"
                                )}
                            >
                                <div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                                        API
                                    </span>
                                </div>
                                <div>
                                    <span className={cn(
                                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border",
                                        METHOD_COLORS[log.method] || 'bg-gray-100 text-gray-700 border-gray-200'
                                    )}>
                                        {log.method}
                                    </span>
                                </div>
                                <div className="font-mono text-sm text-foreground/80 truncate pr-4 mt-1 md:mt-0">
                                    {log.url}
                                </div>
                                <div className="text-right mt-1 md:mt-0">
                                    <span className={cn(
                                        "inline-flex items-center justify-center min-w-[40px] px-2 py-0.5 rounded-md text-[11px] font-bold",
                                        getStatusColor(log.status)
                                    )}>
                                        {log.status}
                                    </span>
                                </div>
                                <div className={cn(
                                    "text-right text-xs font-semibold mt-1 md:mt-0",
                                    getTimeColor(log.responseTime)
                                )}>
                                    {log.responseTime}ms
                                </div>
                                <div className="text-right text-xs text-muted-foreground mt-1 md:mt-0">
                                    {formatTime(log.timestamp)}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 px-5 py-3 bg-muted/20 border-t border-border/50">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => changePage(-1)}
                            className="rounded-lg text-xs gap-1"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" /> Previous
                        </Button>
                        <span className="text-xs text-muted-foreground font-medium">
                            Page {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => changePage(1)}
                            className="rounded-lg text-xs gap-1"
                        >
                            Next <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
