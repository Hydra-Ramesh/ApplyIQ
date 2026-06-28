import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import React from 'react';

interface GenericPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function GenericPageLayout({ title, subtitle, children }: GenericPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Floating Glass Navbar (Simplified for subpages) */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-7xl bg-black/10 backdrop-blur-lg border border-white/10 shadow-2xl shadow-black/50 rounded-full transition-all duration-300">
          <div className="px-6 h-14 flex items-center justify-between">
            <Link to="/" className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              ApplyIQ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Pro</span>
            </Link>
            
            <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </nav>
      </div>

      {/* Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff11 1px, transparent 1px), linear-gradient(to bottom, #ffffff11 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      {/* Page Header */}
      <div className="relative pt-40 pb-16 z-10 border-b border-white/10">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{title}</h1>
          {subtitle && <p className="text-lg text-slate-400">{subtitle}</p>}
        </div>
      </div>

      {/* Page Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 py-16 max-w-4xl text-slate-300 leading-relaxed">
        <div className="prose prose-invert prose-blue max-w-none prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 relative z-10 bg-black/20">
        <div className="container mx-auto px-6 lg:px-12 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} ApplyIQ. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
