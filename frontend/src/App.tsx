import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { BaseLayout } from "./shared/layouts/BaseLayout";
import { Home } from "./shared/pages/Home";
import { Feedback } from "./shared/pages/Feedback";
import { Report } from "./shared/pages/Report";
import { useAuthStore } from "./shared/hooks/useAuthStore";
import { useEffect } from "react";
import { toast } from 'sonner';

// Lazy load heavy and authenticated routes
const Onboarding = lazy(() => import("./features/onboarding/pages/Onboarding").then(m => ({ default: m.Onboarding })));
const EditorLayout = lazy(() => import("./features/editor/pages/EditorLayout").then(m => ({ default: m.EditorLayout })));
const Dashboard = lazy(() => import("./features/dashboard/pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Profile = lazy(() => import("./features/profile/pages/Profile").then(m => ({ default: m.Profile })));
const SettingsPage = lazy(() => import("./features/profile/pages/Settings").then(m => ({ default: m.Settings })));
const NewResumeWizard = lazy(() => import("./features/dashboard/pages/NewResumeWizard").then(m => ({ default: m.NewResumeWizard })));
const TemplateGallery = lazy(() => import("./features/dashboard/pages/TemplateGallery").then(m => ({ default: m.TemplateGallery })));
const AdminDashboard = lazy(() => import("./features/admin/pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const VerifyEmail = lazy(() => import("./features/auth/pages/VerifyEmail").then(m => ({ default: m.VerifyEmail })));
const ForgotPassword = lazy(() => import("./features/auth/pages/ForgotPassword").then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import("./features/auth/pages/ResetPassword").then(m => ({ default: m.ResetPassword })));
const Login = lazy(() => import("./features/auth/pages/Login").then(m => ({ default: m.Login })));
const Register = lazy(() => import("./features/auth/pages/Register").then(m => ({ default: m.Register })));
const FeaturesPage = lazy(() => import("./shared/pages/FeaturesPage").then(m => ({ default: m.FeaturesPage })));
const PricingPage = lazy(() => import("./shared/pages/PricingPage").then(m => ({ default: m.PricingPage })));
const ATSScannerPage = lazy(() => import("./shared/pages/ATSScannerPage").then(m => ({ default: m.ATSScannerPage })));
const About = lazy(() => import("./shared/pages/About").then(m => ({ default: m.About })));
const Careers = lazy(() => import("./shared/pages/Careers").then(m => ({ default: m.Careers })));
const Blog = lazy(() => import("./shared/pages/Blog").then(m => ({ default: m.Blog })));
const Contact = lazy(() => import("./shared/pages/Contact").then(m => ({ default: m.Contact })));
const PrivacyPolicy = lazy(() => import("./shared/pages/Privacy").then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./shared/pages/Terms").then(m => ({ default: m.TermsOfService })));
const LatexTemplatesPage = lazy(() => import("./shared/pages/LatexTemplatesPage").then(m => ({ default: m.LatexTemplatesPage })));

// Loading Fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-transparent p-8 lg:p-12 w-full max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-12 animate-pulse">
      <div>
        <div className="h-10 w-48 bg-muted rounded mb-3"></div>
        <div className="h-4 w-64 bg-muted rounded"></div>
      </div>
      <div className="flex gap-3">
         <div className="h-12 w-32 bg-muted rounded-xl hidden sm:block"></div>
         <div className="h-12 w-32 bg-muted rounded-xl hidden sm:block"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse border border-border" />
      ))}
    </div>
  </div>
);

function StripeSuccessHandler() {
  const location = useLocation();
  const { updateUser } = useAuthStore();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('checkout') === 'success') {
      // Remove checkout=success from URL
      searchParams.delete('checkout');
      const newUrl = window.location.pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      window.history.replaceState({}, '', newUrl);

      // Optimistic update so the user sees Pro features instantly
      updateUser({ subscriptionTier: 'pro' });
      toast.success("Payment Successful!", { 
        description: "Your account has been upgraded to Pro. Explore Pro features now!" 
      });

      // Poll the backend until the webhook has processed the payment
      const token = localStorage.getItem('token');
      if (token) {
        const checkProStatus = async (retries = 5) => {
          if (retries === 0) return;
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.user?.subscriptionTier === 'pro') {
              if (data.token) localStorage.setItem('token', data.token);
              updateUser(data.user);
            } else {
              // Webhook hasn't finished yet, try again in 2 seconds
              setTimeout(() => checkProStatus(retries - 1), 2000);
            }
          } catch (console) {}
        };
        checkProStatus();
      }
    }
  }, [location.search, updateUser]);

  return null;
}

function GlobalAuthSync() {
  const { updateUser } = useAuthStore();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          updateUser(data.user);
        }
      })
      .catch(() => {
         // Silently fail, user might just need to re-login if token expired
      });
    }
  }, [updateUser]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <StripeSuccessHandler />
      <GlobalAuthSync />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<BaseLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="new" element={<NewResumeWizard />} />
            <Route path="templates" element={<TemplateGallery />} />
          </Route>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/editor" element={<EditorLayout />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/ats-scanner" element={<ATSScannerPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/report" element={<Report />} />
          <Route path="/latex-templates" element={<LatexTemplatesPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
