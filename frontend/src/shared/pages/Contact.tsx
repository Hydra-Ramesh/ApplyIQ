import { GenericPageLayout } from "../layouts/GenericPageLayout";
import { useState } from "react";
import { toast } from "sonner";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/public/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });
      if (res.ok) {
        toast.success("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GenericPageLayout title="Contact Us" subtitle="We're here to help you land your dream job.">
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
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="john@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
            <textarea 
              rows={5} 
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="How can we help you?" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </GenericPageLayout>
  );
}
