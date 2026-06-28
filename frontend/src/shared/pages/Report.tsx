import { GenericPageLayout } from "../layouts/GenericPageLayout";
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { useAuthStore } from "../hooks/useAuthStore";

export function Report() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [issue, setIssue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/public/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, issue, userId: (user as any)?._id || (user as any)?.id })
      });
      if (res.ok) {
        toast.success("Bug report submitted successfully! Our team will look into it.");
        setName("");
        setEmail("");
        setIssue("");
      } else {
        toast.error("Failed to submit report. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GenericPageLayout title="Report an Issue" subtitle="Found a bug? Let us know so we can fix it.">
      <div className="max-w-xl mx-auto mt-8 p-8 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
        
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <AlertTriangle className="w-48 h-48 text-red-500" />
        </div>

        <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" 
              placeholder="John Doe" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" 
              placeholder="john@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Describe the Issue</label>
            <textarea 
              rows={5} 
              required
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" 
              placeholder="Please provide as much detail as possible, including steps to reproduce the bug." 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors mt-4"
          >
            {isLoading ? "Submitting..." : "Submit Bug Report"}
          </button>
        </form>
      </div>
    </GenericPageLayout>
  );
}
