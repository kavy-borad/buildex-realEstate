import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Building2, ArrowRight, ShieldCheck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AUTO_LOGIN_CONFIG } from '@/config/autoLogin';
import { API_BASE_URL } from '@/services/api/core';

type StepStatus = 'idle' | 'loading' | 'done' | 'error';

interface Step {
  label: string;
  status: StepStatus;
  detail?: string;
}

const INITIAL_STEPS: Step[] = [
  { label: 'Connecting to server', status: 'idle' },
  { label: 'Verifying credentials', status: 'idle' },
  { label: 'Loading your workspace', status: 'idle' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [errorMsg, setErrorMsg] = useState('');
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);

  const { isAuthenticated, setSession, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const attemptAutoLogin = async () => {
      const manualLogout = localStorage.getItem('manual_logout');
      if (!isAuthenticated && !autoLoginAttempted && AUTO_LOGIN_CONFIG.enabled && !manualLogout) {
        setAutoLoginAttempted(true);
        const success = await login(AUTO_LOGIN_CONFIG.credentials.email, AUTO_LOGIN_CONFIG.credentials.password);
        if (success) navigate('/dashboard');
      }
    };
    const timer = setTimeout(attemptAutoLogin, 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, autoLoginAttempted, login, navigate]);

  const updateStep = (index: number, status: StepStatus, detail?: string) => {
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, status, detail } : s));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSteps(INITIAL_STEPS);
    setIsLoading(true);

    // Step 1 — Connecting
    updateStep(0, 'loading');
    await new Promise(r => setTimeout(r, 400));

    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      updateStep(0, 'done', `${response.status} ${response.ok ? 'Connected' : 'Failed'}`);
    } catch {
      updateStep(0, 'error', 'Cannot reach server');
      setErrorMsg('Cannot connect to server. Make sure backend is running.');
      setIsLoading(false);
      return;
    }

    // Step 2 — Verifying
    updateStep(1, 'loading');
    await new Promise(r => setTimeout(r, 300));

    const data = await response.json();

    if (!response.ok || !data.success) {
      updateStep(1, 'error', data.error || 'Unauthorized');
      setErrorMsg(data.error || 'Invalid credentials. Please try again.');
      setIsLoading(false);
      return;
    }

    updateStep(1, 'done', `Hello, ${data.admin?.name}`);

    // Step 3 — Loading workspace
    updateStep(2, 'loading');
    await new Promise(r => setTimeout(r, 400));

    const user = {
      id: data.admin._id || data.admin.id,
      name: data.admin.name,
      email: data.admin.email,
      role: data.admin.role,
    };
    setSession(user, data.token);
    updateStep(2, 'done', 'Workspace ready');

    await new Promise(r => setTimeout(r, 300));
    setIsLoading(false);
    navigate('/dashboard');
  };

  const stepIcon = (status: StepStatus) => {
    if (status === 'loading') return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    if (status === 'done') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status === 'error') return <XCircle className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />;
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950">
      {/* Left Side */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Buildex</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-xl">
            <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              The modern standard for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">construction management.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Streamline your workflow, manage quotations, and track invoices with enterprise-grade security and precision.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center gap-4 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Enterprise Security</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <span>v2.0.0</span>
          </motion.div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Buildex</span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px] space-y-8"
        >
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400">Enter your credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    type="email"
                    placeholder="admin@buildex.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-11 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-xl text-base"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-11 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-xl text-base"
                  />
                </div>
              </div>
            </div>


            {/* Error from backend */}
            <AnimatePresence>
              {errorMsg && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3"
                >
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-400 font-medium">{errorMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-base transition-all shadow-lg shadow-blue-600/20 group disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

