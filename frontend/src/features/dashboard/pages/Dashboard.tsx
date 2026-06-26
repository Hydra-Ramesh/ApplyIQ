import { useState } from 'react';
import { useResumes } from '../api/resume.api';
import { FileText, Plus, ChevronLeft, ChevronRight, Activity, LogOut, Pencil, Check, X, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { updateResume, deleteResume } from '../api/resume.api';
import { toast } from 'sonner';
import { useAuthStore } from '@/shared/hooks/useAuthStore';

export function Dashboard() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useResumes(page, 9);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (_) { /* proceed with local logout even if API fails */ }
    localStorage.removeItem('token');
    logout();
    navigate('/');
  };

  const handleRenameClick = (e: React.MouseEvent, resume: any) => {
    e.stopPropagation();
    setEditingId(resume._id);
    setEditTitle(resume.title);
  };

  const handleRenameSubmit = async (e: React.FormEvent, resumeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateResume(resumeId, { title: editTitle });
      toast.success('Resume renamed!');
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    } catch (err) {
      toast.error('Failed to rename resume');
    }
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent, resumeId: string) => {
    e.stopPropagation();
    setDeletingId(resumeId);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteResume(deletingId);
      toast.success('Resume deleted');
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    } catch (err) {
      toast.error('Failed to delete resume');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12">
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Resumes</h1>
            <p className="text-slate-400">Manage and optimize your tailored resumes.</p>
          </div>
          <div className="flex gap-3 items-center">
            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl font-medium transition-colors text-sm"
              >
                Admin
              </Link>
            )}
            <Link 
              to="/dashboard/templates" 
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Browse Templates
            </Link>
            <Link 
              to="/dashboard/new" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <Plus className="w-5 h-5" /> AI Generator
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 px-4 py-3 rounded-xl font-medium transition-all text-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        {/* State Handling */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        )}

        {isError && (
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
            Failed to load resumes. Please try again.
          </div>
        )}

        {/* Grid */}
        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {data.data.map((resume) => (
                <div 
                  key={resume._id} 
                  onClick={() => navigate(`/editor?id=${resume._id}`)}
                  className="group relative bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all cursor-pointer overflow-hidden backdrop-blur-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    {/* ATS Score Badge */}
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      resume.atsScore >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                      resume.atsScore >= 50 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      resume.atsScore > 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}>
                      <Activity className="w-3 h-3" /> {resume.atsScore > 0 ? `${resume.atsScore} ATS` : 'Not Scanned'}
                    </div>
                  </div>

                  {editingId === resume._id ? (
                    <form 
                      onSubmit={(e) => handleRenameSubmit(e, resume._id)} 
                      onClick={(e) => e.stopPropagation()}
                      className="mb-1 flex items-center gap-2 relative z-10"
                    >
                      <input 
                        type="text" 
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                        className="bg-black/50 border border-white/20 rounded px-2 py-1 text-white text-sm w-full focus:outline-none focus:border-blue-500"
                      />
                      <button type="submit" className="p-1 hover:bg-white/10 rounded text-green-400">
                        <Check className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={handleCancelRename} className="p-1 hover:bg-white/10 rounded text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between mb-1 relative z-10">
                      <h3 className="text-xl font-semibold truncate flex-1">{resume.title}</h3>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => handleRenameClick(e, resume)}
                          className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white"
                          title="Rename"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteClick(e, resume._id)}
                          className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-lg transition-all text-slate-400 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-slate-400 text-sm relative z-10">{resume.targetRole}</p>
                  
                  <div className="mt-6 pt-6 border-t border-white/10 text-xs text-slate-500 flex justify-between items-center relative z-10">
                    <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                    <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Edit &rarr;</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {data.meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!data.meta.hasPrevPage}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-slate-400 font-medium">
                  Page <span className="text-white">{data.meta.page}</span> of {data.meta.totalPages}
                </span>

                <button 
                  onClick={() => setPage(p => Math.min(data.meta.totalPages, p + 1))}
                  disabled={!data.meta.hasNextPage}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1A1C23] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Resume</h3>
            </div>
            
            <p className="text-slate-400 mb-8 leading-relaxed">
              Are you sure you want to delete this resume? This action cannot be undone, and all associated data will be permanently removed.
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
