import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/shared/hooks/useAuthStore";

const RESEND_COOLDOWN = 60; // seconds

export function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const email = searchParams.get("email") || "";

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");

      // Auto-login: store token and set user in auth store
      localStorage.setItem("token", data.token);
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      login({
        id: payload.userId,
        email: payload.email,
        name: payload.name || "",
        avatarUrl: payload.avatarUrl || "",
        subscriptionTier: "free",
        isAdmin: payload.isAdmin || false,
      });

      setSuccess("Email verified successfully! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setOtp(""); // Clear OTP on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (cooldown > 0) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

      setOtp(""); // Clear old OTP
      setSuccess("A new OTP has been sent to your email.");
      setCooldown(RESEND_COOLDOWN); // Restart cooldown
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    }
  }, [cooldown, email]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <span className="text-black font-bold text-xl">L</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Verify your email</h1>
          <p className="text-sm text-white/60">
            We sent a 6-digit code to <span className="font-medium text-white">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col items-center gap-6">
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

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">{success}</p>}

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>Verify Email <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/60">
          Didn't receive the code?{" "}
          {cooldown > 0 ? (
            <span className="text-white/40 font-medium">
              Resend in {cooldown}s
            </span>
          ) : (
            <button onClick={handleResend} className="text-white font-medium hover:underline">
              Resend Code
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
