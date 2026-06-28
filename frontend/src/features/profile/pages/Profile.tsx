import { useState, useRef } from "react";
import { useAuthStore } from "@/shared/hooks/useAuthStore";
import { Camera, User, LogOut, Loader2, Save, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UpgradeModal } from "../../editor/components/UpgradeModal";

export function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Avatar State
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Name State
  const [name, setName] = useState(user?.name || "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameMessage, setNameMessage] = useState("");

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload avatar");

      // Store the refreshed JWT so the token stays in sync
      if (data.token) localStorage.setItem("token", data.token);
      updateUser({ avatarUrl: data.avatarUrl });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingName(true);
    setNameMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update name");

      // Store the refreshed JWT so the token stays in sync
      if (data.token) localStorage.setItem("token", data.token);
      updateUser({ name });
      setNameMessage("Profile name updated successfully");
      setTimeout(() => setNameMessage(""), 3000);
    } catch (err: any) {
      setNameMessage(`Error: ${err.message}`);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (_) { /* proceed with local logout even if API fails */ }
    localStorage.removeItem("token");
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground p-8 lg:p-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="space-y-8">
          {/* Pro Upgrade Banner */}
          {user?.subscriptionTier !== 'pro' && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-8 shadow-xl border border-purple-400/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                    Upgrade to ApplyIQ Pro
                  </h2>
                  <p className="text-indigo-100 max-w-lg">
                    Unlock unlimited PDF exports, our elite AI Copilot, priority support, and secure a premium golden avatar badge!
                  </p>
                </div>
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}

          {/* Avatar Section */}
          <div className="bg-gradient-to-br from-card to-secondary/50 dark:to-muted/30 text-card-foreground border border-border/60 shadow-sm rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div 
                onClick={handleAvatarClick}
                className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-muted cursor-pointer group hover:border-primary/50 transition-colors"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>

                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a new profile picture. Recommended size: 256x256px.
                </p>
                <button 
                  onClick={handleAvatarClick}
                  className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium rounded-lg transition-colors"
                  disabled={isUploadingAvatar}
                >
                  Choose Image
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>
          </div>

          {/* Personal Info Section */}
          <div className="bg-gradient-to-br from-card to-secondary/50 dark:to-muted/30 text-card-foreground border border-border/60 shadow-sm rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            <form onSubmit={handleSaveName} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address (Read-only)</label>
                <input 
                  type="email" 
                  value={user?.email || ""} 
                  disabled 
                  className="w-full px-4 py-2.5 bg-muted/50 border border-border/60 rounded-xl text-muted-foreground cursor-not-allowed focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. John Doe"
                  className="w-full px-4 py-2.5 bg-background/80 backdrop-blur-sm border border-input/60 shadow-sm rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                />
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button 
                  type="submit" 
                  disabled={isSavingName || name === (user?.name || "")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-sm font-medium rounded-xl transition-colors"
                >
                  {isSavingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
                {nameMessage && (
                  <span className={`text-sm ${nameMessage.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                    {nameMessage}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Account Actions Section */}
          <div className="bg-gradient-to-br from-card to-secondary/50 dark:to-muted/30 text-card-foreground border border-border/60 shadow-sm rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Account Actions</h2>
            <div className="flex items-center justify-between p-4 bg-muted/40 border border-border/50 rounded-xl">
              <div>
                <h3 className="text-foreground font-medium mb-1">Sign Out</h3>
                <p className="text-sm text-muted-foreground">Log out of your account on this device.</p>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border text-foreground text-sm font-medium rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </div>
  );
}
