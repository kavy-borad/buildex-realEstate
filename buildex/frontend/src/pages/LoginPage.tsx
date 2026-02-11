import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AUTO_LOGIN_CONFIG } from '@/config/autoLogin';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Auto-login on page load (only once)
  useEffect(() => {
    const attemptAutoLogin = async () => {
      // Only attempt if not authenticated and not already attempted
      if (!isAuthenticated && !autoLoginAttempted && AUTO_LOGIN_CONFIG.enabled) {
        setAutoLoginAttempted(true);
        setIsLoading(true);

        try {
          const success = await login(
            AUTO_LOGIN_CONFIG.credentials.email,
            AUTO_LOGIN_CONFIG.credentials.password
          );

          if (success) {
            // Silent login - no toast needed
            navigate('/dashboard');
          }
        } catch (error) {
          // Silent fail - user can manually login
          console.log('Auto-login failed, manual login required');
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Attempt auto-login after a short delay
    const timer = setTimeout(attemptAutoLogin, 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, autoLoginAttempted, login, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        toast({
          title: "Access Granted",
          description: "Welcome back to the command center.",
          className: "bg-green-500 text-white border-green-600",
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Invalid credentials. Please verify your access rights.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Connection failed. Please contact IT support.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black font-sans">

      {/* 
          FULL SCREEN VIDEO BACKGROUND 
          Covers the entire page
      */}
      <div className="absolute inset-0 z-0">
        <video
          key="ai-video-player-fullscreen-bright"
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-100"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        >
          {/* User's Custom AI Video */}
          <source src="/Angle_Animation_Video_Ready.mp4" type="video/mp4" />

          {/* Fallback Stock Video */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-a-construction-site-4158-large.mp4" type="video/mp4" />
        </video>

        {/* Subtle Gradient Overlay (Visible but minimal) */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      {/* Main Content Container (Overlay) */}
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row min-h-screen p-6 lg:p-12">

        {/* LOGO (Absolute Top Left) */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute top-8 left-8 flex items-center gap-2 text-white"
        >
          <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Buildex</span>
        </motion.div>


        {/* LEFT SIDE: Branding Text - Visible on Mobile now */}
        <div className="flex flex-1 flex-col justify-center lg:justify-center max-w-2xl mt-20 lg:mt-0 mb-10 lg:mb-0">
          <div className="space-y-4 lg:space-y-6 text-white text-center lg:text-left">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-4xl lg:text-7xl font-bold leading-tight lg:leading-none tracking-tight drop-shadow-2xl"
            >
              Building Visions <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">into Reality.</span>
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-lg lg:text-xl text-gray-300 max-w-md mx-auto lg:mx-0 border-l-0 lg:border-l-4 border-cyan-500 pl-0 lg:pl-6 drop-shadow-lg"
            >
              From foundation to finish. The ultimate command center for modern construction management.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="hidden lg:flex items-center gap-6 mt-12 text-sm font-mono text-cyan-200/80"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>LIVE_MONITORING</span>
            </div>
            <span>//</span>
            <span>PROJECT_TRACKING</span>
            <span>//</span>
            <span>FINANCIAL_CONTROL</span>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Transparent Login Form */}
        <div className="flex-1 flex items-center justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md"
          >
            {/* Glass Card */}
            <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">

              {/* Subtle sheen effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

              <div className="text-center mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-white mb-2">Admin Portal</h2>
                <p className="text-gray-400 text-sm">Enter your credentials to access the system</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Email Address</Label>
                  <div className="relative group/input">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within/input:text-cyan-400 transition-colors" />
                    <Input
                      type="email"
                      placeholder="admin@buildex.com"
                      className="pl-10 h-11 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-white/40 focus:ring-white/10 hover:border-white/20 transition-all rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Password</Label>
                  <div className="relative group/input">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within/input:text-white transition-colors" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-11 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-white/40 focus:ring-white/10 hover:border-white/20 transition-all rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-white text-black hover:bg-gray-200 font-bold text-base rounded-xl transition-all shadow-sm mt-4"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                    />
                  ) : (
                    "Authorize Access"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Protected by reCAPTCHA and Enterprise Security.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
