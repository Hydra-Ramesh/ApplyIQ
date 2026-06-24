import { useState, useRef } from "react";
import { useAuthStore } from "@/shared/hooks/useAuthStore";
import { Camera, User, Lock, LogOut, Loader2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar State
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Name State
  const [name, setName] = useState(user?.name || "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameMessage, setNameMessage] = useState("");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

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
    <div className="min-h-[calc(100vh-5rem)] bg-black text-white p-8 lg:p-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <div className="space-y-8">
          {/* Avatar Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div 
                onClick={handleAvatarClick}
                className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-black/50 cursor-pointer group hover:border-blue-500/50 transition-colors"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white/30" />
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
                <p className="text-sm text-slate-400 mb-2">
                  Upload a new profile picture. Recommended size: 256x256px.
                </p>
                <button 
                  onClick={handleAvatarClick}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
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
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            <form onSubmit={handleSaveName} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address (Read-only)</label>
                <input 
                  type="email" 
                  value={user?.email || ""} 
                  disabled 
                  className="w-full px-4 py-2.5 bg-black/50 border border-white/5 rounded-xl text-slate-400 cursor-not-allowed focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. John Doe"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors" 
                />
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button 
                  type="submit" 
                  disabled={isSavingName || name === (user?.name || "")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
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

          {/* Password Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input 
                    type="password" 
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input 
                    type="password" 
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button 
                  type="submit" 
                  disabled={isChangingPassword || !currentPassword || !newPassword}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
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

          {/* Danger Zone */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Danger Zone</h2>
            <p className="text-sm text-slate-400 mb-6">
              Logging out will clear your session on this device.
            </p>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
