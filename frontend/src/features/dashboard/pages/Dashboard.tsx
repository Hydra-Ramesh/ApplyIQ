import { useState } from 'react';
import { useResumes } from '../api/resume.api';
import { FileText, Plus, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useResumes(page, 9); // Load 9 per page for a 3x3 grid

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12">
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Resumes</h1>
            <p className="text-slate-400">Manage and optimize your tailored resumes.</p>
          </div>
          <div className="flex gap-4">
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
                <div key={resume._id} className="group relative bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all cursor-pointer overflow-hidden backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    {/* ATS Score Badge */}
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      resume.atsScore >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      <Activity className="w-3 h-3" /> {resume.atsScore} ATS
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-1 truncate relative z-10">{resume.title}</h3>
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
    </div>
  );
}
