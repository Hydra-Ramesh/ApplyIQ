import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Mock API
    setTimeout(() => {
      setIsLoading(false);
      navigate("/reset-password", { state: { email } });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <span className="text-black font-bold text-xl">L</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
          <p className="text-sm text-white/60">
            Enter your email address and we'll send you a 6-digit OTP to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder-white/30 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>Send OTP <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/60">
          Remember your password?{" "}
          <Link to="/login" className="text-white font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
