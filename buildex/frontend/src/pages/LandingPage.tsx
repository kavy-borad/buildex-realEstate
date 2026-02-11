import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BungalowGrowth } from '@/components/landing/BungalowGrowth';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden flex flex-col">

            {/* Navbar */}
            <nav className="w-full p-6 flex items-center justify-between z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">BuildEx</span>
                </div>
                <Button
                    onClick={() => navigate('/login')}
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-white/10"
                >
                    Login
                </Button>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col lg:flex-row items-center justify-center container mx-auto px-6 py-12 gap-12 lg:gap-24 relative">

                {/* Background Gradients */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

                {/* Left Side: Text */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:w-1/2 space-y-8 z-10"
                >
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-4">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        The Future of Construction Management
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                        Build Fast. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Scale Smart.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                        From foundation to finish, manage your construction projects with BuildEx.
                        Automated quotations, client tracking, and financial analytics in one powerful dashboard.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            onClick={() => navigate('/login')}
                            size="lg"
                            className="h-14 px-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-600/25 hover:scale-105 transition-transform"
                        >
                            Get Started <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 rounded-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                            View Demo
                        </Button>
                    </div>

                    <div className="pt-12 grid grid-cols-2 gap-8 text-slate-400">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            <span className="text-sm">Enterprise Security</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Zap className="w-6 h-6 text-yellow-500" />
                            <span className="text-sm">Instant Estimates</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Building Animation */}
                <div className="lg:w-1/2 h-[500px] md:h-[600px] w-full relative flex items-center justify-center">
                    <BungalowGrowth />
                </div>

            </main>

        </div>
    );
}
