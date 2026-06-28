import { GenericPageLayout } from "../layouts/GenericPageLayout";
import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";

export function Feedback() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/public/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, message, rating })
      });
      if (res.ok) {
        toast.success("Thank you for your feedback!");
        setName("");
        setRole("");
        setMessage("");
        setRating(5);
      } else {
        toast.error("Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GenericPageLayout title="Share Your Experience" subtitle="We'd love to hear how ApplyIQ has helped you.">
      <div className="max-w-xl mx-auto mt-8 p-8 bg-white/5 border border-white/10 rounded-2xl">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="e.g. John Doe" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Role & Company</label>
            <input 
              type="text" 
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="e.g. Software Engineer at Google" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
            <textarea 
              rows={4} 
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="How did ApplyIQ help you?" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors mt-4"
          >
            {isLoading ? "Submitting..." : "Submit Testimonial"}
          </button>
        </form>
      </div>
    </GenericPageLayout>
  );
}
