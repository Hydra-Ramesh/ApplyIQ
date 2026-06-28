import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, User } from "lucide-react";
import { useAuthStore } from "@/shared/hooks/useAuthStore";
import { NotificationBell } from "../components/NotificationBell";

export function BaseLayout() {
  const location = useLocation();
  const { user } = useAuthStore();

  const getLinkClasses = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium ${
      isActive 
        ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]' 
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent'
    }`;
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-background/80 backdrop-blur-xl border-r border-border p-6 flex flex-col gap-6 z-20">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <span className="text-background font-bold text-lg">L</span>
          </div>
          <div className="font-bold text-xl tracking-tight text-foreground flex items-center gap-2">
            ApplyIQ
            {user?.subscriptionTier === 'pro' && (
              <span className="text-[10px] uppercase tracking-wider bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30">Pro</span>
            )}
          </div>
        </Link>

        <nav className="flex flex-col gap-2 mt-6 flex-1">
          <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
        </nav>

        <div className="border-t border-border pt-6 mt-4 flex flex-col gap-2">
          <Link to="/dashboard/profile" className={getLinkClasses("/dashboard/profile")}>
            <User className="h-5 w-5" />
            Profile
          </Link>
          <Link to="/dashboard/settings" className={getLinkClasses("/dashboard/settings")}>
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Subtle Background Glows inside Main Area */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        
        <header className="h-20 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="font-semibold text-xl tracking-tight text-foreground/90">
            {location.pathname === '/dashboard' ? 'Overview' : 
             location.pathname === '/dashboard/profile' ? 'Profile' : 
             location.pathname === '/dashboard/settings' ? 'Settings' : 'Dashboard'}
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Link 
              to="/dashboard/profile" 
              className={`flex items-center gap-2 px-4 py-2 bg-secondary border rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors text-foreground ${
                user?.subscriptionTier === 'pro' 
                  ? 'border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]' 
                  : 'border-border'
              }`}
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <User className={`h-4 w-4 ${user?.subscriptionTier === 'pro' ? 'text-yellow-500' : ''}`} />
              )}
              {user?.name || user?.email?.split('@')[0] || "User"}
            </Link>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
