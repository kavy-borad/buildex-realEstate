import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Building2, ArrowRight, ShieldCheck, User,
  CheckCircle2, XCircle, Loader2, Eye, EyeOff
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/services/api/core';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  const navigate = useNavigate();

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  // Real-time password match status
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError(null);

    // Client-side guards
    if (password.length < 6) {
      setBackendError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setBackendError('Passwords do not match. Please check and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register-public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (!data.success) {
        setBackendError(data.error || 'Registration failed. Please try again.');
        return;
      }

      // ✅ Success
      setRegistered(true);
      await delay(1800);
      navigate('/login');

    } catch {
      setBackendError('Connection failed. Make sure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950">

      {/* ── Left Branding ───────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
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
              Join the future of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                construction management.
              </span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Create your contractor account to start managing quotations, invoices, and clients in one unified platform.
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

      {/* ── Right Form ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative">

        {/* Mobile logo */}
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
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create an account</h2>
            <p className="text-slate-500 dark:text-slate-400">Enter your details to get started with Buildex.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-4">

              {/* ── Full Name ─────────────────────────────────────────── */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    disabled={isLoading || registered}
                    className="pl-11 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-xl text-base"
                  />
                </div>
              </div>

              {/* ── Email ─────────────────────────────────────────────── */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    type="email"
                    placeholder="contractor@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={isLoading || registered}
                    className="pl-11 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-xl text-base"
                  />
                </div>
              </div>

              {/* ── Password ──────────────────────────────────────────── */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isLoading || registered}
                    className="pl-11 pr-11 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-xl text-base"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password.length > 0 && password.length < 6 && (
                  <p className="text-xs text-amber-500 flex items-center gap-1.5 mt-1">
                    <XCircle className="w-3.5 h-3.5 shrink-0" /> At least 6 characters required
                  </p>
                )}
              </div>

              {/* ── Confirm Password ───────────────────────────────────── */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                <div className="relative group">
                  <Lock
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors
                      ${passwordsMatch
                        ? 'text-emerald-500'
                        : passwordsMismatch
                          ? 'text-red-400'
                          : 'text-slate-400 group-focus-within:text-blue-500'
                      }`}
                  />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading || registered}
                    className={`pl-11 pr-11 h-12 bg-white dark:bg-slate-900 transition-all rounded-xl text-base
                      ${passwordsMatch
                        ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                        : passwordsMismatch
                          ? 'border-red-400 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Real-time match feedback */}
                <AnimatePresence mode="wait">
                  {passwordsMatch && (
                    <motion.p
                      key="match"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Passwords match
                    </motion.p>
                  )}
                  {passwordsMismatch && (
                    <motion.p
                      key="mismatch"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5 mt-1"
                    >
                      <XCircle className="w-3.5 h-3.5 shrink-0" /> Passwords do not match
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Error Message ───────────────────────────────────────── */}
            <AnimatePresence>
              {backendError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 px-4 py-3"
                >
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-400">{backendError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Success Message ─────────────────────────────────────── */}
            <AnimatePresence>
              {registered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-4 py-3.5"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      Registration successful!
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
                      Redirecting you to login…
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Submit Button ───────────────────────────────────────── */}
            <Button
              type="submit"
              disabled={isLoading || registered || passwordsMismatch}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-medium text-base transition-all shadow-lg shadow-blue-600/20 group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account…</span>
                </div>
              ) : registered ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Done!</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}