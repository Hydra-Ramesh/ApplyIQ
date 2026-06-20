import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/shared/hooks/useAuthStore";
import { Shield, Users, FileText, Plus, Copy, Trash, ExternalLink } from "lucide-react";

interface UserData {
  _id: string;
  email: string;
  resumeCount: number;
  createdAt: string;
}

interface ResumeData {
  _id: string;
  texCode: string;
  createdAt: string;
}

export function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'users' | 'templates'>('users');
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUserResumes, setSelectedUserResumes] = useState<ResumeData[] | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");
  
  // Template form state
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  const [templateLatex, setTemplateLatex] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    // In a real app, we'd fetch this from the backend
    // Since we don't have the backend DB hooked up to the frontend UI yet completely, we'll mock some data
    setUsers([
      { _id: '1', email: 'test1@example.com', resumeCount: 3, createdAt: '2026-06-15T10:00:00Z' },
      { _id: '2', email: 'user2@example.com', resumeCount: 1, createdAt: '2026-06-18T14:30:00Z' }
    ]);
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isAdmin) return <Navigate to="/dashboard" replace />;

  const handleViewResumes = (userId: string, email: string) => {
    // Mock fetching resumes
    setSelectedUserEmail(email);
    setSelectedUserResumes([
      { _id: '101', texCode: '\\documentclass{article}\\begin{document}Hello World\\end{document}', createdAt: '2026-06-20T10:00:00Z' }
    ]);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("LaTeX code copied to clipboard! You can now paste it in the Template Manager.");
  };

  const handlePublishTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    
    try {
      // In a real app, POST to /api/admin/templates
      // We will just simulate a delay for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Template published successfully!");
      setTemplateName("");
      setTemplateDesc("");
      setTemplateLatex("");
    } catch (error) {
      console.error(error);
      alert("Failed to publish template");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
            <Shield className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
            <p className="text-white/60">Manage users, monitor usage, and publish templates.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 p-1 rounded-xl w-fit mb-8 border border-white/10">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 \${
              activeTab === 'users' ? 'bg-white/10 text-white shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            Users & Usage
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 \${
              activeTab === 'templates' ? 'bg-white/10 text-white shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            Template Manager
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/60 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-medium">User Email</th>
                    <th className="px-6 py-4 font-medium">Joined Date</th>
                    <th className="px-6 py-4 font-medium">Resumes Generated</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white">{u.email}</td>
                      <td className="px-6 py-4 text-white/60">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {u.resumeCount} resumes
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleViewResumes(u._id, u.email)}
                          className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                        >
                          View Resumes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedUserResumes && (
              <div className="bg-[#0A0A0B] border border-white/10 rounded-2xl p-6 relative">
                <button 
                  onClick={() => setSelectedUserResumes(null)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white"
                >
                  Close
                </button>
                <h2 className="text-xl font-bold mb-4">Resumes for {selectedUserEmail}</h2>
                <div className="space-y-4">
                  {selectedUserResumes.map(r => (
                    <div key={r._id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/60">Generated: {new Date(r.createdAt).toLocaleString()}</span>
                        <button 
                          onClick={() => handleCopyCode(r.texCode)}
                          className="flex items-center gap-2 text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors"
                        >
                          <Copy className="w-4 h-4" /> Copy LaTeX
                        </button>
                      </div>
                      <pre className="bg-black/50 p-4 rounded-lg text-xs text-green-400 overflow-x-auto border border-white/5">
                        {r.texCode.substring(0, 300)}...
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                Publish New Template
              </h2>
              <form onSubmit={handlePublishTemplate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Template Name</label>
                  <input
                    required
                    value={templateName}
                    onChange={e => setTemplateName(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
                    placeholder="E.g. Creative Director"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                  <input
                    required
                    value={templateDesc}
                    onChange={e => setTemplateDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
                    placeholder="E.g. A modern two-column layout"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Raw LaTeX Code</label>
                  <textarea
                    required
                    value={templateLatex}
                    onChange={e => setTemplateLatex(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-green-400 font-mono text-sm"
                    placeholder="Paste the copied LaTeX code here..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  {isPublishing ? "Publishing..." : "Publish Template to Gallery"}
                </button>
              </form>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Current Live Templates</h2>
              <div className="space-y-4">
                {/* Mock data for existing templates */}
                {[
                  { name: "Classic Professional", desc: "Standard single column ATS-friendly format" },
                  { name: "Minimalist", desc: "Clean, elegant design with ample whitespace" }
                ].map((t, idx) => (
                  <div key={idx} className="bg-black/40 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white">{t.name}</h3>
                      <p className="text-sm text-white/60">{t.desc}</p>
                    </div>
                    <button className="text-red-400 hover:text-red-300 p-2">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
