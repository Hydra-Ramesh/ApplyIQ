import { useState } from 'react';
import { Flame, X, Loader2, Share2 } from 'lucide-react';
import { useEditorStore } from '../../../shared/hooks/useEditorStore';
import ReactMarkdown from 'react-markdown';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function RoastModal({ isOpen, onClose }: Props) {
  const [roast, setRoast] = useState<string | null>(null);
  const [isRoasting, setIsRoasting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { code } = useEditorStore();

  if (!isOpen) return null;

  const handleRoast = async () => {
    setIsRoasting(true);
    setError(null);
    setRoast(null);

    try {
      const response = await fetch('http://localhost:8000/resume/roast-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tex_code: code }),
      });

      if (!response.ok) throw new Error('Failed to roast resume');
      if (!response.body) throw new Error('No readable stream');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        text += chunkValue;
        setRoast(text);
      }
    } catch (err) {
      setError('An error occurred. Even the AI refused to read this.');
    } finally {
      setIsRoasting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-orange-500/30 rounded-2xl shadow-2xl shadow-orange-900/20 p-6 max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!roast && !isRoasting && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/20 mb-6">
              <Flame className="w-10 h-10 text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Are you sure about this?</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              Our AI will adopt the persona of a savagely honest FAANG recruiter and brutally tear apart your resume. 
              It will hurt your feelings, but it might just save your career.
            </p>
            <button
              onClick={handleRoast}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all transform hover:scale-105"
            >
              Roast Me Alive 🔥
            </button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>
        )}

        {isRoasting && !roast && (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Analyzing your buzzwords...</h3>
            <p className="text-slate-400 animate-pulse">Oh boy, this is going to be brutal.</p>
          </div>
        )}

        {roast && (
          <div className="text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">The Verdict</h2>
                <p className="text-slate-400 text-sm">Viewer discretion advised.</p>
              </div>
            </div>
            
            <div className="prose prose-invert prose-orange max-w-none prose-p:leading-relaxed">
              <ReactMarkdown>{roast}</ReactMarkdown>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Ouch. Want to share your pain?
              </p>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 rounded-lg transition-colors font-medium">
                  <Share2 className="w-4 h-4" /> Share on Twitter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 rounded-lg transition-colors font-medium">
                  <Share2 className="w-4 h-4" /> Share on LinkedIn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
