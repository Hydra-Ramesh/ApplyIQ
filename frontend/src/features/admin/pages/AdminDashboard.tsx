import { useState, useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/shared/hooks/useAuthStore";
import { Shield, Users, FileText, Trash, Briefcase, BookOpen, MessageSquare, Send, X, Star, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { io } from "socket.io-client";

export function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'users' | 'resumes' | 'templates' | 'careers' | 'blogs' | 'contacts' | 'testimonials' | 'reports'>('users');
  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({ 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }), [token]);
  
  // Note: For a production app, the backend socket URL should be fetched from env config properly.
  // Here we hardcode to port 5001 as specified in the implementation.
  const socketUrl = import.meta.env.VITE_API_URL.replace(/:[0-9]+.*$/, ':5001');

  // Data States
  const [users, setUsers] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [, setTemplates] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  // Notification Badges
  const [unreadContacts, setUnreadContacts] = useState(0);
  const [unreadReports, setUnreadReports] = useState(0);

  // Modal State
  const [publishingResumeId, setPublishingResumeId] = useState<string | null>(null);
  const [publishTemplateName, setPublishTemplateName] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [replyingToReportId, setReplyingToReportId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const fetchUsers = () => fetch(`${import.meta.env.VITE_API_URL}/admin/users`, { headers }).then(r => r.json()).then(setUsers).catch(console.error);
  const fetchResumes = () => fetch(`${import.meta.env.VITE_API_URL}/admin/resumes`, { headers }).then(r => r.json()).then(setResumes).catch(console.error);
  const fetchTemplates = () => fetch(`${import.meta.env.VITE_API_URL}/templates`).then(r => r.json()).then(setTemplates).catch(console.error);
  const fetchCareers = () => fetch(`${import.meta.env.VITE_API_URL}/admin/careers`, { headers }).then(r => r.json()).then(setCareers).catch(console.error);
  const fetchBlogs = () => fetch(`${import.meta.env.VITE_API_URL}/admin/blogs`, { headers }).then(r => r.json()).then(setBlogs).catch(console.error);
  const fetchContacts = () => fetch(`${import.meta.env.VITE_API_URL}/admin/contacts`, { headers }).then(r => r.json()).then(setContacts).catch(console.error);
  const fetchTestimonials = () => fetch(`${import.meta.env.VITE_API_URL}/admin/testimonials`, { headers }).then(r => r.json()).then(setTestimonials).catch(console.error);
  const fetchReports = () => fetch(`${import.meta.env.VITE_API_URL}/admin/reports`, { headers }).then(r => r.json()).then(setReports).catch(console.error);

  // Clear unread counts when viewing tab
  useEffect(() => {
    if (activeTab === 'contacts') setUnreadContacts(0);
    if (activeTab === 'reports') setUnreadReports(0);
  }, [activeTab]);

  useEffect(() => {
    if (!user?.isAdmin) return;

    // Connect Socket.IO
    const socket = io(socketUrl);
    socket.on('connect', () => console.log('Connected to Admin Socket on port 5001'));
    
    socket.on('new_contact_message', (data) => {
      toast.info(`New Contact Message from ${data.name}`);
      if (activeTab !== 'contacts') setUnreadContacts(prev => prev + 1);
      else fetchContacts(); // Refresh list if already on tab
    });

    socket.on('new_report', (data) => {
      toast.error(`New Bug Report from ${data.name}`);
      if (activeTab !== 'reports') setUnreadReports(prev => prev + 1);
      else fetchReports(); // Refresh list if already on tab
    });

    return () => { socket.disconnect(); };
  }, [user, activeTab, socketUrl]);

  useEffect(() => {
    if (user?.isAdmin) {
      if (activeTab === 'users') fetchUsers();
      if (activeTab === 'resumes') fetchResumes();
      if (activeTab === 'templates') fetchTemplates();
      if (activeTab === 'careers') fetchCareers();
      if (activeTab === 'blogs') fetchBlogs();
      if (activeTab === 'contacts') fetchContacts();
      if (activeTab === 'testimonials') fetchTestimonials();
      if (activeTab === 'reports') fetchReports();
    }
  }, [activeTab, user, headers]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isAdmin) return <Navigate to="/dashboard" replace />;

  const submitPublishResume = async () => {
    if (!publishTemplateName || !publishingResumeId) return;
    setIsPublishing(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/templates/publish/${publishingResumeId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: publishTemplateName })
      });
      if (res.ok) {
        toast.success("Successfully published as Template!");
        setPublishingResumeId(null);
        setPublishTemplateName("");
      } else {
        toast.error("Failed to publish.");
      }
    } catch (e) {
      toast.error("Error publishing template.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteCareer = async (id: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/careers/${id}`, { method: 'DELETE', headers });
    if (res.ok) {
      toast.success("Role deleted successfully!");
      fetchCareers();
    } else {
      toast.error("Failed to delete role.");
    }
  };

  const handleDeleteBlog = async (id: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/blogs/${id}`, { method: 'DELETE', headers });
    if (res.ok) {
      toast.success("Blog post deleted successfully!");
      fetchBlogs();
    } else {
      toast.error("Failed to delete blog post.");
    }
  };

  const handleCreateCareer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/careers`, { method: 'POST', headers, body: JSON.stringify(payload) });
    if (res.ok) {
      toast.success("Role added successfully!");
      e.currentTarget.reset();
      fetchCareers();
    } else {
      toast.error("Failed to add role.");
    }
  };

  const handleCreateBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/blogs`, { method: 'POST', headers, body: JSON.stringify(payload) });
    if (res.ok) {
      toast.success("Blog post published successfully!");
      e.currentTarget.reset();
      fetchBlogs();
    } else {
      toast.error("Failed to publish blog post.");
    }
  };

  const handleToggleTestimonial = async (id: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/admin/testimonials/${id}/publish`, { method: 'PUT', headers });
    fetchTestimonials();
  };

  const handleDeleteTestimonial = async (id: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/admin/testimonials/${id}`, { method: 'DELETE', headers });
    fetchTestimonials();
  };

  const handleToggleReport = async (id: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/admin/reports/${id}/resolve`, { method: 'PUT', headers });
    fetchReports();
  };

  const handleDeleteReport = async (id: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/admin/reports/${id}`, { method: 'DELETE', headers });
    fetchReports();
  };

  const submitReplyReport = async () => {
    if (!replyingToReportId || !replyText) return;
    setIsReplying(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/reports/${replyingToReportId}/reply`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ replyMessage: replyText })
      });
      if (res.ok) {
        toast.success("Reply sent to user!");
        setReplyingToReportId(null);
        setReplyText("");
        fetchReports();
      } else {
        toast.error("Failed to send reply.");
      }
    } catch (e) {
      toast.error("Error sending reply.");
    } finally {
      setIsReplying(false);
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
            <p className="text-white/60">Manage users, monitor usage, publish templates, and manage CMS.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-xl w-fit mb-8 border border-white/10">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'resumes', label: 'All Resumes', icon: FileText },
            { id: 'testimonials', label: 'Testimonials', icon: Star },
            { id: 'careers', label: 'Careers', icon: Briefcase },
            { id: 'blogs', label: 'Blogs', icon: BookOpen },
            { id: 'contacts', label: 'Contacts', icon: MessageSquare, badge: unreadContacts },
            { id: 'reports', label: 'Bug Reports', icon: AlertTriangle, badge: unreadReports },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-white/10 text-white shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge ? (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-white/60 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Copilot Chats</th>
                  <th className="px-6 py-4 font-medium">Resumes</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{u.email}</td>
                    <td className="px-6 py-4">
                      {u.isAdmin ? <span className="text-red-400 font-bold">ADMIN</span> : 
                       u.subscriptionTier === 'pro' ? <span className="text-yellow-500 font-bold">PRO</span> : 
                       <span className="text-slate-400">FREE</span>}
                    </td>
                    <td className="px-6 py-4 text-blue-400">{u.copilotChats || 0}</td>
                    <td className="px-6 py-4 text-emerald-400">{u.resumesGenerated || u.resumeCount || 0}</td>
                    <td className="px-6 py-4 text-white/60">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Resumes Tab */}
        {activeTab === 'resumes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map(r => (
              <div key={r._id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">{r.title || 'Untitled Resume'}</h3>
                  <p className="text-xs text-white/40 mb-4">User ID: {r.userId}</p>
                  <pre className="text-xs bg-black/50 p-2 rounded text-green-400 overflow-hidden h-24 mb-4">
                    {r.texCode?.substring(0, 150)}...
                  </pre>
                </div>
                <button 
                  onClick={() => setPublishingResumeId(r._id)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-colors font-medium text-sm"
                >
                  <Send className="w-4 h-4" /> Publish as Template
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-4">
            {testimonials.length === 0 && <p className="text-white/60">No testimonials yet.</p>}
            {testimonials.map(t => (
              <div key={t._id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <span className="text-white/40 text-sm">({t.role})</span>
                    <div className="flex gap-1 ml-2">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                  </div>
                  <p className="text-white/80 bg-black/30 p-4 rounded-lg border border-white/5 whitespace-pre-wrap">{t.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleToggleTestimonial(t._id)} 
                    className={`px-4 py-2 rounded-lg font-medium text-sm ${t.isPublished ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-white/10 text-white'} border`}
                  >
                    {t.isPublished ? 'Live on Home' : 'Publish'}
                  </button>
                  <button onClick={() => handleDeleteTestimonial(t._id)} className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg"><Trash className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Careers Tab */}
        {activeTab === 'careers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
              <h2 className="text-xl font-bold mb-6">Add New Role</h2>
              <form onSubmit={handleCreateCareer} className="space-y-4">
                <input name="title" required placeholder="Job Title" className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white" />
                <input name="location" required placeholder="Location" className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white" />
                <input name="googleFormLink" required type="url" placeholder="Google Form Link" className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white" />
                <button type="submit" className="w-full bg-white text-black font-bold py-2 rounded-lg">Create Role</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {careers.map(c => (
                <div key={c._id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{c.title}</h3>
                    <p className="text-sm text-white/60">{c.location} • {c.googleFormLink}</p>
                  </div>
                  <button onClick={() => handleDeleteCareer(c._id)} className="text-red-400 p-2"><Trash className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
              <h2 className="text-xl font-bold mb-6">Draft Blog Post</h2>
              <form onSubmit={handleCreateBlog} className="space-y-4">
                <input name="title" required placeholder="Title" className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white" />
                <input name="snippet" required placeholder="Short Snippet" className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white" />
                <textarea name="content" required rows={6} placeholder="Full Markdown Content" className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white" />
                <button type="submit" className="w-full bg-white text-black font-bold py-2 rounded-lg">Publish Post</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {blogs.map(b => (
                <div key={b._id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{b.title}</h3>
                    <p className="text-sm text-white/60">{b.snippet}</p>
                  </div>
                  <button onClick={() => handleDeleteBlog(b._id)} className="text-red-400 p-2"><Trash className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {contacts.length === 0 && <p className="text-white/60">No messages yet.</p>}
            {contacts.map(c => (
              <div key={c._id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{c.name}</h3>
                    <a href={`mailto:${c.email}`} className="text-blue-400 text-sm hover:underline">{c.email}</a>
                  </div>
                  <span className="text-xs text-white/40">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-white/80 bg-black/30 p-4 rounded-lg border border-white/5 whitespace-pre-wrap">{c.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.length === 0 && <p className="text-white/60">No bug reports! Great job.</p>}
            {reports.map(r => (
              <div key={r._id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{r.name}</h3>
                    <a href={`mailto:${r.email}`} className="text-blue-400 text-sm hover:underline">{r.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setReplyingToReportId(r._id)} 
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-xs bg-blue-500/20 text-blue-400 border border-blue-500/50`}
                    >
                      <MessageSquare className="w-3 h-3"/> Reply
                    </button>
                    <button 
                      onClick={() => handleToggleReport(r._id)} 
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-xs ${r.isResolved ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'} border`}
                    >
                      {r.isResolved ? <><CheckCircle className="w-3 h-3"/> Resolved</> : <><AlertTriangle className="w-3 h-3"/> Unresolved</>}
                    </button>
                    <button onClick={() => handleDeleteReport(r._id)} className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg"><Trash className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-red-200/80 bg-red-950/30 p-4 rounded-lg border border-red-500/20 whitespace-pre-wrap">{r.issue}</p>
                {r.adminReply && (
                  <div className="mt-4 p-4 rounded-lg bg-blue-900/20 border border-blue-500/20">
                    <p className="text-blue-300 text-sm font-bold mb-1">Admin Reply:</p>
                    <p className="text-blue-200/80 text-sm whitespace-pre-wrap">{r.adminReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Publish Template Modal */}
      {publishingResumeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0A0A0B] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setPublishingResumeId(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2">Publish Template</h2>
            <p className="text-white/60 text-sm mb-6">Give this template a descriptive name before publishing it to the global gallery.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Template Name</label>
                <input
                  type="text"
                  autoFocus
                  value={publishTemplateName}
                  onChange={e => setPublishTemplateName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
                  placeholder="e.g. Modern Tech Lead"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setPublishingResumeId(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitPublishResume}
                  disabled={!publishTemplateName || isPublishing}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
                >
                  {isPublishing ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Report Modal */}
      {replyingToReportId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0A0A0B] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setReplyingToReportId(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2">Reply to Bug Report</h2>
            <p className="text-white/60 text-sm mb-6">Send a response directly to the user who reported this issue. If they are online, they will receive a real-time notification.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Your Reply</label>
                <textarea
                  autoFocus
                  rows={4}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
                  placeholder="e.g. Thanks for reporting! This has been fixed."
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setReplyingToReportId(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitReplyReport}
                  disabled={!replyText || isReplying}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
                >
                  {isReplying ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
