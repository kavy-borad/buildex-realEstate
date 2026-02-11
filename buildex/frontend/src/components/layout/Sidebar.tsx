import { useState } from 'react';
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
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/feedback', label: 'Client Feedback', icon: MessageSquare },
  // { path: '/clients', label: 'Clients', icon: Users }, // Commented out
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ isOpen, onToggle, isHovered, setIsHovered }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  // Sidebar is visible if it's pinned (isOpen) OR hovered
  const showSidebar = isOpen || isHovered;

  return (
    <>
      <motion.aside
        initial={false}
        animate={{
          width: showSidebar ? 280 : 88,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50",
          "bg-background/80 backdrop-blur-xl border-r border-border/40 shadow-xl overflow-x-hidden"
        )}
      >
        {/* Header Section: Logo + Pin Button */}
        <div className="h-24 flex items-center justify-between px-6 mb-2 relative group/header">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex flex-shrink-0 items-center justify-center shadow-lg shadow-primary/20">
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
                  <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    BuildEx
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">Construction SaaS</span>
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
                  "text-muted-foreground hover:text-primary hover:bg-primary/10",
                  isOpen ? "text-primary" : "opacity-0 group-hover/header:opacity-100" // Hide when unpinned until hover header
                )}
                title={isOpen ? "Unpin Sidebar" : "Pin Sidebar"}
              >
                {isOpen ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="group relative flex items-center"
              >
                <div
                  className={cn(
                    "flex items-center w-full gap-4 px-3 rounded-xl transition-all duration-300 relative z-10 h-12",
                    isActive
                      ? "text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {/* Active Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 relative z-20 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />

                  <AnimatePresence>
                    {showSidebar && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "font-medium whitespace-nowrap overflow-hidden relative z-20",
                          isActive ? "text-primary-foreground" : ""
                        )}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Logout Only */}
        <div className="p-4 border-t border-border/40 bg-muted/10 mt-auto shrink-0 overflow-x-hidden">
          <button
            onClick={logout}
            className={cn(
              "flex items-center w-full gap-4 px-3 rounded-xl h-12",
              "text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {showSidebar && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium whitespace-nowrap overflow-hidden"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
