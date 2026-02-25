import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  FileText,
  FilePlus,
  FileCheck,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  XCircle,
  Briefcase,
  Bell,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboardApi } from '@/services/api/miscApi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const [projectStatsData, setProjectStatsData] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [chartsData, setChartsData] = useState<any>(null);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days'>('30days');
  const [selectedChart, setSelectedChart] = useState<'revenue' | 'projects'>('revenue');

  // Fetch charts data (reusable for filter changes)
  const fetchCharts = async (filter: string) => {
    try {
      const chartsRes = await dashboardApi.getCharts(filter);
      if (chartsRes.success && chartsRes.data) {
        setChartsData(chartsRes.data);
      }
    } catch (error) {
      console.error('Failed to load charts', error);
    }
  };

  // Initial load - all 3 endpoints in parallel, 1 call each
  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      try {
        const [overviewRes, projectStatsRes, activitiesRes, chartsRes] = await Promise.all([
          dashboardApi.getOverview(),
          dashboardApi.getProjectStats(),
          dashboardApi.getRecentActivities(),
          dashboardApi.getCharts(timeFilter)
        ]);

        if (!cancelled) {
          if (overviewRes.success && overviewRes.data) {
            setOverviewData(overviewRes.data);
          }
          if (projectStatsRes.success && projectStatsRes.data) {
            setProjectStatsData(projectStatsRes.data);
          }
          if (activitiesRes.success && activitiesRes.data) {
            setRecentActivities(activitiesRes.data);
          }
          if (chartsRes.success && chartsRes.data) {
            setChartsData(chartsRes.data);
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load dashboard data', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchDashboardData();

    return () => { cancelled = true; };
  }, []); // Only on mount

  // When filter changes, fetch ONLY charts (no duplicate calls to other endpoints)
  useEffect(() => {
    // Skip the initial render (already fetched above)
    if (loading) return;
    fetchCharts(timeFilter);
  }, [timeFilter]);

  // Dynamic chart data from API
  const chartData = chartsData
    ? (selectedChart === 'revenue' ? chartsData.revenueChart : chartsData.projectChart)
    : [];

  // Overview from /api/dashboard/overview
  const overview = overviewData || {
    totalRevenue: 0,
    totalQuotations: 0
  };

  // Project stats from /api/dashboard/project-stats
  const quotationStats = projectStatsData || {
    working: 0,
    draft: 0,
    sent: 0,
    accepted: 0,
    rejected: 0
  };

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${overview.totalRevenue.toLocaleString('en-IN')}`,
      change: 'Lifetime',
      isPositive: true,
      icon: TrendingUp,
      gradient: 'from-blue-500 to-cyan-500',
      onClick: () => setSelectedChart('revenue'),
      isActive: selectedChart === 'revenue'
    },
    {
      label: 'Total Projects',
      value: (overview.totalQuotations || 0).toString(),
      change: 'All Projects',
      isPositive: true,
      icon: FileCheck,
      gradient: 'from-purple-500 to-pink-500',
      onClick: () => setSelectedChart('projects'),
      isActive: selectedChart === 'projects'
    },
  ];

  const projectStats = [
    {
      label: 'Working Projects',
      value: (quotationStats.working || 0).toString(),
      change: 'In Progress',
      isPositive: true,
      icon: Briefcase,
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      label: 'Approved Projects',
      value: quotationStats.accepted.toString(),
      change: 'Confirmed',
      isPositive: true,
      icon: CheckCircle2,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Sent Projects',
      value: quotationStats.sent.toString(),
      change: 'Awaiting Response',
      isPositive: true,
      icon: Send,
      gradient: 'from-purple-500 to-violet-500',
    },
    {
      label: 'Rejected Projects',
      value: (quotationStats.rejected || 0).toString(),
      change: 'Not Accepted',
      isPositive: false,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <div ref={containerRef} className="min-h-screen px-4 md:px-6 py-4 max-w-[1600px] mx-auto space-y-6 w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Overview of your construction projects & financial status.
          </p>
        </div>
        {/* New Quotation Button Removed as per request
        <div className="flex items-center gap-3">
          <Button asChild className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 rounded-xl h-11 px-6">
            <Link to="/create-quotation">
              <FilePlus className="w-5 h-5 mr-2" />
              New Quotation
            </Link>
          </Button>
        </div>
        */}
      </motion.div>

      {/* Project Stats Grid - Top Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {projectStats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                </div>
                <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.isPositive ? 'text-blue-500' : 'text-rose-500'}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Stats Grid - Bottom Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            onClick={stat.onClick}
            className={`group relative overflow-hidden bg-card/50 backdrop-blur-sm border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${stat.isActive ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10' : 'border-border/50'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                </div>
                <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column - Chart */}
        <div className="lg:col-span-2 space-y-6">


          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex flex-col mb-4">
              <h3 className="text-base sm:text-lg font-semibold">{selectedChart === 'revenue' ? 'Revenue Overview' : 'Total Projects Growth'}</h3>
              <div className="flex flex-row items-center justify-between gap-2 mt-1 w-full">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate max-w-[140px] sm:max-w-none">
                    {selectedChart === 'revenue' ? '₹' : ''}
                    {chartData.reduce((acc: number, item: any) => acc + (item.value || 0), 0)
                      .toLocaleString('en-IN')
                    }
                  </h2>
                  <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-normal leading-tight w-12 sm:w-auto">
                    {timeFilter === 'today' ? "in today" :
                      timeFilter === '7days' ? "in last 7 days" :
                        "in last 30 days"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Desktop view */}
                  <div className="hidden sm:flex items-center bg-muted/30 rounded-lg p-1 gap-1">
                    <button
                      onClick={() => setTimeFilter('today')}
                      className={`text-xs px-3 py-1.5 rounded-md transition-all ${timeFilter === 'today' ? 'bg-primary text-primary-foreground shadow-sm font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setTimeFilter('7days')}
                      className={`text-xs px-3 py-1.5 rounded-md transition-all ${timeFilter === '7days' ? 'bg-primary text-primary-foreground shadow-sm font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                      7 Days
                    </button>
                    <button
                      onClick={() => setTimeFilter('30days')}
                      className={`text-xs px-3 py-1.5 rounded-md transition-all ${timeFilter === '30days' ? 'bg-primary text-primary-foreground shadow-sm font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                      30 Days
                    </button>
                  </div>

                  {/* Mobile/Tablet view */}
                  <div className="sm:hidden">
                    <Select value={timeFilter} onValueChange={(val: any) => setTimeFilter(val)}>
                      <SelectTrigger className="h-8 w-[90px] text-[10px] font-medium bg-muted/30 border-0 focus:ring-0 px-2">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today" className="text-[10px]">Today</SelectItem>
                        <SelectItem value="7days" className="text-[10px]">7 Days</SelectItem>
                        <SelectItem value="30days" className="text-[10px]">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedChart === 'revenue' ? '#8b5cf6' : '#ec4899'} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={selectedChart === 'revenue' ? '#8b5cf6' : '#ec4899'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={selectedChart === 'revenue' ? '#8b5cf6' : '#ec4899'}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="lg:col-span-1">

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px] scrollbar-thin scrollbar-thumb-border">
              {recentActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">No activity yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Create a quotation to get started.</p>
                </div>
              ) : (
                recentActivities.map((item: any) => (
                  <div key={item._id} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${item.type === 'invoice' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                      {item.type === 'invoice' ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {item.client?.name || 'Unknown Client'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.type === 'invoice' ? `Invoice #${item.invoiceNumber}` : `Quote #${item.quotationNumber}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        ₹{((item.summary?.grandTotal || 0) / 1000).toFixed(1)}k
                      </p>
                      <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-border/40">
              <Button variant="outline" className="w-full rounded-xl" asChild>
                <Link to="/quotations">View All Projects</Link>
              </Button>
            </div>
          </motion.div>

        </div>
      </div >
    </div >
  );
}
