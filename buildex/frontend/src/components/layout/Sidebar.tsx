
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Settings,
  Building2,
  Users,
  LogOut,
  Pin,
  PinOff,
  Bell,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';


interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isHovered: boolean;
  setIsHovered: (hover: boolean) => void;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/create-quotation', label: 'New Quotation', icon: FilePlus },
  { path: '/quotations', label: 'Quotation History', icon: FileText },
  { path: '/feedback', label: 'Client Feedback', icon: MessageSquare },
  // { path: '/clients', label: 'Clients', icon: Users }, // Commented out
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ isOpen, onToggle, isHovered, setIsHovered }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const unreadCount = 0; // Disabled - will re-enable when notification API is ready

  // Sidebar is visible if it's pinned (isOpen) OR hovered
  const showSidebar = isOpen || isHovered;

  return (
    <>
      <motion.aside
        initial={false}
        animate={{
          width: showSidebar ? 240 : 88,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50",
          "bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-xl overflow-x-hidden"
        )}
      >
        {/* Header Section: Logo + Pin Button */}
        <div className="h-24 flex items-center justify-between px-6 mb-2 relative group/header">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 flex flex-shrink-0 items-center justify-center shadow-lg shadow-blue-600/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>

            <AnimatePresence>
              {showSidebar && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col whitespace-nowrap"
                >
                  <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                    BuildEx
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Construction SaaS</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pin Button - Visible when expanded */}
          <AnimatePresence>
            {showSidebar && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onToggle}
                className={cn(
                  "p-2 rounded-lg transition-colors absolute right-4 top-1/2 -translate-y-1/2",
                  "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                  isOpen ? "text-slate-900 dark:text-white" : "opacity-0 group-hover/header:opacity-100" // Hide when unpinned until hover header
                )}
                title={isOpen ? "Unpin Sidebar" : "Pin Sidebar"}
              >
                {isOpen ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 py-2 space-y-2 overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="group relative flex items-center w-full"
              >
                <div
                  className={cn(
                    "flex items-center w-full rounded-xl transition-all duration-300 relative z-10 h-12 font-medium",
                    isActive
                      ? "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100/50 dark:border-blue-500/20 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent"
                  )}
                >
                  {/* Icon Container with Dot Badge */}
                  <div className="w-12 h-12 flex items-center justify-center relative flex-shrink-0">
                    <item.icon
                      className={cn(
                        "w-5 h-5 z-20 transition-transform duration-300 group-hover:scale-110",
                        isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      )}
                    />
                    {!showSidebar && item.label === 'Notifications' && unreadCount > 0 && (
                      <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950" />
                    )}
                  </div>

                  {/* Expanded Label & Pill Badge */}
                  <div
                    className={cn(
                      "flex-1 flex items-center justify-between overflow-hidden relative z-20 whitespace-nowrap transition-all duration-300",
                      showSidebar ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
                    )}
                  >
                    <span>{item.label}</span>
                    {item.label === 'Notifications' && unreadCount > 0 && (
                      <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Logout Only */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 mt-auto shrink-0 overflow-x-hidden">
          <button
            onClick={logout}
            className={cn(
              "flex items-center w-full rounded-xl h-12 transition-all duration-200 border border-transparent",
              "text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            )}
          >
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 flex-shrink-0" />
            </div>
            <div
              className={cn(
                "overflow-hidden whitespace-nowrap transition-all duration-300",
                showSidebar ? "opacity-100 max-w-full font-medium" : "opacity-0 max-w-0"
              )}
            >
              <span>Logout</span>
            </div>
          </button>
        </div>
      </motion.aside >
    </>
  );
}
