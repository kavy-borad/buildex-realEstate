import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { useAuth } from '@/contexts/AuthContext';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isExpanded = sidebarOpen || sidebarHovered;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
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

      {/* Desktop Content */}
      <main
        className="hidden lg:block transition-all duration-300 pt-14 pb-6"
        style={{
          marginLeft: isExpanded ? 240 : 88,
        }}
      >
        <Outlet />
      </main>

      {/* Mobile Content */}
      <main className="lg:hidden pt-14 pb-6 px-0">
        <Outlet />
      </main>
    </div>
  );
}
