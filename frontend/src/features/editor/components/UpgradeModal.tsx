import { useState } from 'react';
import { Sparkles, X, Check, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../../shared/hooks/useAuthStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { upgradeToPro } = useAuthStore();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    setIsProcessing(true);
    // Simulate Stripe Redirect
    setTimeout(() => {
      upgradeToPro();
      setIsProcessing(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side - Visuals */}
        <div className="md:w-5/12 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-8 h-8 text-purple-300" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-4">Unlock the Magic.</h2>
            <p className="text-purple-200 text-lg mb-8 leading-relaxed">
              Stop guessing what recruiters want. Let our elite AI perfectly tailor your resume and write your bullet points for you.
            </p>
            <div className="flex items-center gap-2 text-purple-300 text-sm font-medium">
              <span className="flex w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Join 10,000+ professionals hired this week
            </div>
          </div>
        </div>

        {/* Right Side - Pricing */}
        <div className="md:w-7/12 p-8 md:p-10 bg-slate-900 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">ApplyIQ Pro</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">$19</span>
              <span className="text-slate-400">/ month</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {[
              "Resume Copilot (Inline AI Autocomplete)",
              "One-Click Auto-Tailor (Beat the ATS)",
              "Unlimited PDF Exports",
              "Unlimited LaTeX Templates",
              "Priority Email Support"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-purple-400 font-bold" />
                </div>
                <span className="text-slate-300 font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/25 transition-all transform hover:scale-[1.02]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Redirecting to Stripe...
              </>
            ) : (
              <>
                Upgrade Now <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-center text-slate-500 text-xs mt-4">
            Secure checkout via Stripe. Cancel anytime.
          </p>
        </div>

      </div>
    </div>
  );
}
