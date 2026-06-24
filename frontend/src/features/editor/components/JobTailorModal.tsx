import { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { useEditorStore } from '../../../shared/hooks/useEditorStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function JobTailorModal({ isOpen, onClose }: Props) {
  const [jobDescription, setJobDescription] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { code, setCode } = useEditorStore();

  if (!isOpen) return null;

  const handleTailor = async () => {
    if (!jobDescription.trim()) return;
    setIsTailoring(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_AI_URL}/resume/tailor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tex_code: code, job_description: jobDescription }),
      });

      if (!response.ok) throw new Error('Failed to tailor resume');
      
      const data = await response.json();
      setCode(data.tailored_tex);
      onClose();
    } catch (err) {
      setError('An error occurred while tailoring your resume. Please try again.');
    } finally {
      setIsTailoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">One-Click Tailor</h2>
          </div>
          <p className="text-slate-400">
            Paste the job description below. Our AI will automatically rewrite your LaTeX bullet points 
            to match the required keywords and guarantee a high ATS score.
          </p>
        </div>

        {/* Input */}
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the LinkedIn or Indeed Job Description here..."
          className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-mono text-sm"
        />

        {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-slate-300 hover:text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTailor}
            disabled={isTailoring || !jobDescription.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all"
          >
            {isTailoring ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Tailoring Resume...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Tailor My Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
