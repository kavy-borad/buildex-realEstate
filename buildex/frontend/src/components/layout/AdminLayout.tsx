import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { useAuth } from '@/contexts/AuthContext';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const { isAuthenticated } = useAuth();

  const isExpanded = sidebarOpen || sidebarHovered;

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isHovered={sidebarHovered}
        setIsHovered={setSidebarHovered}
      />
      <Navbar sidebarOpen={isExpanded} />
      <MobileNav />

      <main
        className="transition-all duration-300 pt-14 pb-6"
        style={{
          marginLeft: isDesktop ? (isExpanded ? 240 : 88) : 0,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
