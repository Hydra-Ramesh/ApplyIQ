import { GenericPageLayout } from "../layouts/GenericPageLayout";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export function PricingPage() {
  return (
    <GenericPageLayout title="Simple, Transparent Pricing" subtitle="Invest in your career today.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
        {/* Free Tier */}
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl relative flex flex-col">
          <h3 className="text-2xl font-bold text-white mb-2">Free Starter</h3>
          <p className="text-slate-400 mb-6">Perfect for testing the waters.</p>
          <div className="text-4xl font-extrabold text-white mb-6">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex gap-3 text-slate-300"><Check className="w-5 h-5 text-blue-400" /> Basic LaTeX Templates</li>
            <li className="flex gap-3 text-slate-300"><Check className="w-5 h-5 text-blue-400" /> PDF Exports</li>
            <li className="flex gap-3 text-slate-300"><Check className="w-5 h-5 text-blue-400" /> 5 AI Generations Total</li>
            <li className="flex gap-3 text-slate-300"><Check className="w-5 h-5 text-blue-400" /> 1,000 AI Chat Tokens</li>
          </ul>
          <Link to="/register" className="w-full block text-center py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors">Get Started Free</Link>
        </div>

        {/* Pro Tier */}
        <div className="p-8 bg-gradient-to-b from-blue-900/40 to-purple-900/20 border border-blue-500/30 rounded-3xl relative shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>
          <h3 className="text-2xl font-bold text-white mb-2">ApplyIQ Pro</h3>
          <p className="text-blue-200/60 mb-6">The unfair advantage for serious applicants.</p>
          <div className="text-4xl font-extrabold text-white mb-6">$15<span className="text-lg text-slate-400 font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex gap-3 text-slate-200"><Check className="w-5 h-5 text-blue-400" /> Unlimited AI Generations</li>
            <li className="flex gap-3 text-slate-200"><Check className="w-5 h-5 text-blue-400" /> Unlimited AI Chat Tokens</li>
            <li className="flex gap-3 text-slate-200"><Check className="w-5 h-5 text-blue-400" /> Advanced ATS Optimizer</li>
            <li className="flex gap-3 text-slate-200"><Check className="w-5 h-5 text-blue-400" /> 1-Click Cold Email Generator</li>
            <li className="flex gap-3 text-slate-200"><Check className="w-5 h-5 text-blue-400" /> Premium Templates</li>
          </ul>
          <Link to="/register" className="w-full block text-center py-4 bg-white text-black hover:bg-slate-200 font-bold rounded-xl transition-colors">Upgrade to Pro</Link>
        </div>
      </div>
    </GenericPageLayout>
  );
}
