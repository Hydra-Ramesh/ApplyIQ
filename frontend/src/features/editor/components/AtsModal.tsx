import { useState } from 'react';
import { Target, X, Loader2, Wand2 } from 'lucide-react';
import { useEditorStore } from '../../../shared/hooks/useEditorStore';
import ReactMarkdown from 'react-markdown';
import { updateResume } from '../../dashboard/api/resume.api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resumeId: string | null;
}

export function AtsModal({ isOpen, onClose, resumeId }: Props) {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { code, setCode } = useEditorStore();

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    setScore(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_AI_URL}/api/v1/resume/optimize-ats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: code, job_description: jobDescription }),
      });

      if (!response.ok) throw new Error('Failed to analyze resume');
      const data = await response.json();
      
      const rawAnalysis = data.analysis;
      let finalAnalysis = rawAnalysis;
      let extractedScore = 0;

      // Parse the <score> tag
      const scoreMatch = rawAnalysis.match(/<score>(\d{1,3})<\/score>/i);
      if (scoreMatch) {
        extractedScore = parseInt(scoreMatch[1], 10);
        setScore(extractedScore);
        finalAnalysis = rawAnalysis.replace(/<score>\d{1,3}<\/score>/i, '').trim();
      } else {
        // Fallback if AI fails to use the exact tag
        const fallbackMatch = rawAnalysis.match(/\b(\d{1,3})\s*(?:\/|out of)\s*100\b/);
        if (fallbackMatch) extractedScore = parseInt(fallbackMatch[1], 10);
        setScore(extractedScore);
      }

      setAnalysis(finalAnalysis);

      // Save to database
      if (resumeId && extractedScore > 0) {
        await updateResume(resumeId, { atsScore: extractedScore });
      }

    } catch (err) {
      setError('An error occurred while analyzing the resume.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAutoFix = async () => {
    setIsTailoring(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_AI_URL}/api/v1/resume/tailor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tex_code: code, job_description: jobDescription }),
      });

      if (!response.ok) throw new Error('Failed to tailor resume');
      const data = await response.json();
      
      if (data.tailored_tex) {
        setCode(data.tailored_tex);
        onClose(); // Close the modal on success
      }
    } catch (err) {
      setError('Failed to auto-fix resume. Please try again.');
    } finally {
      setIsTailoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-900/20 p-6 max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!analysis && !isAnalyzing && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 mb-6">
              <Target className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">ATS Optimizer</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              Paste the Job Description below. Our AI will analyze your resume against it, give you an ATS match score, and suggest keywords to add.
            </p>
            
            <textarea
              className="w-full h-40 bg-black/50 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors mb-6 resize-none"
              placeholder="Paste Job Description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <button
              onClick={handleAnalyze}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-105"
            >
              Analyze Resume
            </button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>
        )}

        {isAnalyzing && !analysis && (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Simulating ATS Scan...</h3>
            <p className="text-slate-400 animate-pulse">Matching keywords and calculating your score.</p>
          </div>
        )}

        {analysis && (
          <div className="text-left animate-in fade-in slide-in-from-bottom-4 duration-500 mt-2">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
              <div className={`flex items-center justify-center w-20 h-20 rounded-full border-4 shadow-lg ${score && score >= 80 ? 'border-green-500 shadow-green-500/20 bg-green-500/10' : score && score >= 50 ? 'border-yellow-500 shadow-yellow-500/20 bg-yellow-500/10' : 'border-red-500 shadow-red-500/20 bg-red-500/10'}`}>
                <span className={`text-2xl font-bold ${score && score >= 80 ? 'text-green-400' : score && score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {score || 0}%
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Match Score</h2>
                <p className="text-slate-400 text-sm">
                  {score && score >= 80 ? "Great job! You are a strong match." : score && score >= 50 ? "You're getting there, but some tweaks are needed." : "Needs significant improvement to pass the ATS."}
                </p>
              </div>
            </div>
            
            <div className="text-slate-200 text-sm leading-relaxed [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mb-2 [&_strong]:text-blue-400 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end gap-3">
               <button 
                  onClick={onClose}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
                >
                  Close
                </button>
                <button 
                  onClick={handleAutoFix}
                  disabled={isTailoring}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all font-medium disabled:opacity-50"
                >
                  {isTailoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  {isTailoring ? 'Fixing Resume...' : 'Auto-Fix Resume'}
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
