import { LogOut, User, ChevronDown, Home, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  sidebarOpen: boolean;
}

export function Navbar({ sidebarOpen }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Map specific paths to friendly labels if needed, or just capitalize
    const getLabel = (path: string) => {
      const labels: Record<string, string> = {
        'dashboard': 'Dashboard',
        'create-quotation': 'New Quotation',
        'quotations': 'Quotations',
        'clients': 'Clients',
        'settings': 'Settings',
        'analytics': 'Analytics',
      };
      return labels[path] || path.charAt(0).toUpperCase() + path.slice(1);
    };

    return pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      return { label: getLabel(value), path: to };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header
      className="hidden lg:flex fixed top-0 right-0 h-14 bg-card/80 backdrop-blur-md z-20 items-center justify-between px-6 transition-all duration-200 shadow-sm"
      style={{ left: sidebarOpen ? 240 : 88 }}
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-[15px] font-medium text-muted-foreground">
        <Link to="/dashboard" className="flex items-center hover:text-primary transition-colors">
          <Home className="w-[18px] h-[18px]" />
        </Link>

        {breadcrumbs.map((crumb, index) => {
          // Skip showing "Dashboard" in the text since Home acts as the dashboard link
          // But if you are on /dashboard, we still want to show "Dashboard" text after Home
          // We'll just show it normally: `<Home> > Dashboard`
          return (
            <div key={crumb.path} className="flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              <Link
                to={crumb.path}
                className={cn(
                  "hover:text-primary transition-colors capitalize",
                  index === breadcrumbs.length - 1 ? "text-foreground font-medium" : ""
                )}
              >
                {crumb.label}
              </Link>
            </div>
          );
        })}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white shadow-md shadow-primary/20">
              <span className="font-semibold text-xs">{user?.name?.charAt(0) || 'A'}</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-card border-border/50">
          <DropdownMenuItem className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border/50" />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
