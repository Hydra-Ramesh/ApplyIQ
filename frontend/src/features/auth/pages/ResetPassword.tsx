import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Lock, ArrowRight } from "lucide-react";

export function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || !newPassword) return;

    setIsLoading(true);
    setError("");

    // Mock API
    setTimeout(() => {
      setSuccess("Password reset successfully! Redirecting to login...");
      setIsLoading(false);
      setTimeout(() => navigate("/login"), 2000);
    }, 1500);
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
          <p className="text-white/60 mb-4">Invalid request. No email found.</p>
          <Link to="/forgot-password" className="text-white hover:underline">Go back to Forgot Password</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <span className="text-black font-bold text-xl">L</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-sm text-white/60">
            Enter the 6-digit OTP sent to <span className="font-medium text-white">{email}</span> and your new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col items-center">
            <label className="block text-sm font-medium text-white/80 mb-4">One-Time Password (OTP)</label>
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="border-white/20 text-white" />
                  <InputOTPSlot index={1} className="border-white/20 text-white" />
                  <InputOTPSlot index={2} className="border-white/20 text-white" />
                  <InputOTPSlot index={3} className="border-white/20 text-white" />
                  <InputOTPSlot index={4} className="border-white/20 text-white" />
                  <InputOTPSlot index={5} className="border-white/20 text-white" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 text-white placeholder-white/30 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">{success}</p>}

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6 || !newPassword}
            className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>Reset Password <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
