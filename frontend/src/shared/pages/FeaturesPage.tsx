import { GenericPageLayout } from "../layouts/GenericPageLayout";
import { Link } from "react-router-dom";
import { Bot, Zap, ShieldCheck, Mail, Target } from "lucide-react";

export function FeaturesPage() {
  return (
    <GenericPageLayout title="Features" subtitle="Everything you need to land your next role.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
          <Bot className="w-10 h-10 text-blue-400 mb-4" />
          <h3 className="text-2xl font-bold mb-3">AI Bullet Rewriter</h3>
          <p className="text-slate-400">Instantly transform weak tasks into powerful, metric-driven achievements using our proprietary LLM tuned on thousands of FAANG resumes.</p>
        </div>
        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mb-4" />
          <h3 className="text-2xl font-bold mb-3">ATS Optimizer</h3>
          <p className="text-slate-400">Ensure your resume passes the automated robot filters. We check your document for machine-readability, structure, and keyword density.</p>
        </div>
        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
          <Mail className="w-10 h-10 text-purple-400 mb-4" />
          <h3 className="text-2xl font-bold mb-3">1-Click Cold Emails</h3>
          <p className="text-slate-400">Stop staring at a blank screen. Our AI generates highly personalized cold emails to hiring managers based on your resume and the job description.</p>
        </div>
        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
          <Target className="w-10 h-10 text-red-400 mb-4" />
          <h3 className="text-2xl font-bold mb-3">AI Roast (Tough Love)</h3>
          <p className="text-slate-400">Get brutal, honest feedback on your resume. The AI will point out weak verbs, lack of metrics, and formatting errors before a recruiter does.</p>
        </div>
      </div>
      <div className="text-center mt-12">
        <Link to="/register" className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-xl hover:scale-105 transition-transform">
          Try All Features Free
        </Link>
      </div>
    </GenericPageLayout>
  );
}
