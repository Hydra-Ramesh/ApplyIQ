import { useState, useRef } from "react";
import { Upload, X, Copy, Check, Image as ImageIcon, Loader2 } from "lucide-react";
import { useAuthStore } from "../../../shared/hooks/useAuthStore";

interface IconManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IconManagerModal({ isOpen, onClose }: IconManagerModalProps) {
  const { user, updateUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append("icon", file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me/icon`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to upload icon");

      // Update local state
      updateUser({
        icons: [...(user?.icons || []), { name: data.name, url: data.iconUrl }]
      });

    } catch (err: any) {
      setError(err.message || "Failed to upload icon");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const copyLatex = (name: string) => {
    const latexSnippet = `\\includegraphics[height=0.3cm, width=0.3cm]{${name}}`;
    navigator.clipboard.writeText(latexSnippet);
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ImageIcon className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Icon Manager</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-slate-400 text-sm">
              Upload custom icons to use in your resume. Click copy to grab the LaTeX snippet!
            </p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleFileChange}
            />
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 shrink-0"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isUploading ? "Uploading..." : "Upload Icon"}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {(!user?.icons || user.icons.length === 0) ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
              <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No icons uploaded yet.</p>
              <p className="text-sm text-slate-500 mt-1">Upload a small PNG or JPG icon to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {user.icons.map((icon, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex flex-col items-center gap-3 hover:border-slate-600 transition-colors group relative">
                  <div className="h-16 w-16 bg-slate-800 rounded-lg flex items-center justify-center p-2">
                    <img src={icon.url} alt={icon.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <p className="text-xs text-slate-300 truncate w-full text-center" title={icon.name}>
                    {icon.name}
                  </p>
                  <button
                    onClick={() => copyLatex(icon.name)}
                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-lg"
                  >
                    {copiedIcon === icon.name ? (
                      <>
                        <Check className="w-6 h-6 text-green-400" />
                        <span className="text-xs text-green-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-6 h-6 text-white" />
                        <span className="text-xs text-white font-medium">Copy LaTeX</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
