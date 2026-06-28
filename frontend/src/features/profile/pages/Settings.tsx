import { useState } from "react";
import { useAuthStore } from "@/shared/hooks/useAuthStore";
import { Lock, Loader2, Moon, Sun, Monitor, Trash2, AlertTriangle, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/shared/providers/ThemeProvider";

export function Settings() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  // Theme State
  const { theme, setTheme } = useTheme();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Export State
  const [isExporting, setIsExporting] = useState(false);

  // Billing State
  const [isManagingBilling, setIsManagingBilling] = useState(false);
  const { user } = useAuthStore();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");

      setPasswordMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPasswordMessage(""), 3000);
    } catch (err: any) {
      setPasswordMessage(`Error: ${err.message}`);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete account");
      }

      localStorage.removeItem("token");
      logout();
      navigate("/");
    } catch (err: any) {
      alert(err.message);
      setIsDeletingAccount(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me/export`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error("Failed to export data");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `applyiq_export.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsManagingBilling(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/stripe/create-portal-session`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to access billing portal");
      
      window.location.href = data.url;
    } catch (err: any) {
      alert(err.message);
      setIsManagingBilling(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground p-8 lg:p-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold mb-8">App Settings</h1>

        <div className="space-y-8">
          
          {/* Password Section */}
          <div className="bg-gradient-to-br from-card to-secondary/50 dark:to-muted/30 text-card-foreground border border-border/60 shadow-sm rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="password" 
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-background/80 backdrop-blur-sm border border-input/60 shadow-sm rounded-xl text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="password" 
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-background/80 backdrop-blur-sm border border-input/60 shadow-sm rounded-xl text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button 
                  type="submit" 
                  disabled={isChangingPassword || !currentPassword || !newPassword}
                  className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed text-secondary-foreground text-sm font-medium rounded-xl transition-colors"
                >
                  {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Update Password
                </button>
                {passwordMessage && (
                  <span className={`text-sm ${passwordMessage.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                    {passwordMessage}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Theme Preferences */}
          <div className="bg-gradient-to-br from-card to-secondary/50 dark:to-muted/30 text-card-foreground border border-border/60 shadow-sm rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Appearance</h2>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  theme === 'dark' 
                    ? 'bg-primary/20 border-primary/50 text-primary' 
                    : 'bg-background/80 shadow-sm border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                <Moon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  theme === 'light' 
                    ? 'bg-primary/20 border-primary/50 text-primary' 
                    : 'bg-background/80 shadow-sm border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                <Sun className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Light</span>
              </button>

              <button
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  theme === 'system' 
                    ? 'bg-primary/20 border-primary/50 text-primary' 
                    : 'bg-background/80 shadow-sm border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
              >
                <Monitor className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </div>

          {/* Billing & Subscription */}
          <div className="bg-gradient-to-br from-card to-secondary/50 dark:to-muted/30 text-card-foreground border border-border/60 shadow-sm rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
               Billing & Subscription
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/40 border border-border/50 rounded-xl">
                <div>
                  <h3 className="text-foreground font-medium mb-1">
                    Current Plan: <span className="font-bold text-primary capitalize">{user?.subscriptionTier || 'Free'}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.subscriptionTier === 'pro' 
                      ? 'You have unlimited access to AI Copilot and exports.'
                      : 'Upgrade to Pro to unlock unlimited features.'}
                  </p>
                </div>
                {user?.subscriptionTier === 'pro' ? (
                  <button 
                    onClick={handleManageSubscription}
                    disabled={isManagingBilling}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border text-foreground text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isManagingBilling ? <Loader2 className="w-4 h-4 animate-spin" /> : null} 
                    Manage Subscription
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/profile')}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors"
                  >
                    Upgrade Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Data Portability */}
          <div className="bg-gradient-to-br from-card to-secondary/50 dark:to-muted/30 text-card-foreground border border-border/60 shadow-sm rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
               Data Portability
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/40 border border-border/50 rounded-xl">
                <div>
                  <h3 className="text-foreground font-medium mb-1">Export Account Data</h3>
                  <p className="text-sm text-muted-foreground">Download a copy of all your resumes, templates, and account information as a ZIP archive.</p>
                </div>
                <button 
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border text-foreground text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
                  {isExporting ? 'Exporting...' : 'Export Data'}
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-gradient-to-br from-destructive/5 to-destructive/10 border border-destructive/20 shadow-sm rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-destructive mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Danger Zone
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <div>
                  <h3 className="text-destructive font-medium mb-1">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                </div>
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-medium rounded-lg transition-colors shadow-lg shadow-destructive/20"
                >
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-b from-card to-destructive/5 dark:to-destructive/10 border border-destructive/30 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-destructive/20 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4 text-destructive">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Delete Account</h3>
            </div>
            
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Are you sure you want to permanently delete your account? This action <strong className="text-foreground">cannot be undone</strong>. 
            </p>
            <p className="text-sm text-destructive mb-8 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              All your tailored resumes, history, and active subscriptions will be permanently wiped from our servers.
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeletingAccount}
                className="px-5 py-2.5 rounded-xl font-medium text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 border border-border transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 transition-colors shadow-lg shadow-destructive/20 disabled:opacity-50"
              >
                {isDeletingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isDeletingAccount ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
