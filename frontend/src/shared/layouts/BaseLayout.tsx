import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, User } from "lucide-react";

export function BaseLayout() {
  const location = useLocation();

  const getLinkClasses = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium ${
      isActive 
        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
    }`;
  };

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col gap-6 z-20">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <span className="text-black font-bold text-lg">L</span>
          </div>
          <div className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
            ApplyIQ
            <span className="text-[10px] uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">Pro</span>
          </div>
        </Link>

        <nav className="flex flex-col gap-2 mt-6 flex-1">
          <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/resumes" className={getLinkClasses("/resumes")}>
            <FileText className="h-5 w-5" />
            My Resumes
          </Link>
        </nav>

        <div className="border-t border-white/10 pt-6 mt-4">
          <Link to="/settings" className={getLinkClasses("/settings")}>
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Subtle Background Glows inside Main Area */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
        
        <header className="h-20 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="font-semibold text-xl tracking-tight text-white/90">
            {location.pathname === '/dashboard' ? 'Overview' : 
             location.pathname === '/resumes' ? 'My Resumes' : 
             location.pathname === '/settings' ? 'Settings' : 'Dashboard'}
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 transition-colors text-white/90">
              <User className="h-4 w-4" />
              Ramesh
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
