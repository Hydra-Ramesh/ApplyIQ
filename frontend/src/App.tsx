import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BaseLayout } from "./shared/layouts/BaseLayout";
import { Home } from "./shared/pages/Home";

// Lazy load heavy and authenticated routes
const Onboarding = lazy(() => import("./features/onboarding/pages/Onboarding").then(m => ({ default: m.Onboarding })));
const EditorLayout = lazy(() => import("./features/editor/pages/EditorLayout").then(m => ({ default: m.EditorLayout })));
const Dashboard = lazy(() => import("./features/dashboard/pages/Dashboard").then(m => ({ default: m.Dashboard })));
const NewResumeWizard = lazy(() => import("./features/dashboard/pages/NewResumeWizard").then(m => ({ default: m.NewResumeWizard })));
const TemplateGallery = lazy(() => import("./features/dashboard/pages/TemplateGallery").then(m => ({ default: m.TemplateGallery })));
const AdminDashboard = lazy(() => import("./features/admin/pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const VerifyEmail = lazy(() => import("./features/auth/pages/VerifyEmail").then(m => ({ default: m.VerifyEmail })));
const ForgotPassword = lazy(() => import("./features/auth/pages/ForgotPassword").then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import("./features/auth/pages/ResetPassword").then(m => ({ default: m.ResetPassword })));
const Login = lazy(() => import("./features/auth/pages/Login").then(m => ({ default: m.Login })));
const Register = lazy(() => import("./features/auth/pages/Register").then(m => ({ default: m.Register })));

// Loading Fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
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
            <Route path="new" element={<NewResumeWizard />} />
            <Route path="templates" element={<TemplateGallery />} />
          </Route>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/editor" element={<EditorLayout />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
