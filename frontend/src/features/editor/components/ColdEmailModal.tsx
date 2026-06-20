import { useState } from 'react';
import { Mail, X, Loader2, Copy, Check } from 'lucide-react';
import { useEditorStore } from '../../../shared/hooks/useEditorStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ColdEmailModal({ isOpen, onClose }: Props) {
  const [targetInfo, setTargetInfo] = useState('');
  const [emailText, setEmailText] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { code } = useEditorStore();

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!targetInfo.trim()) return;
    setIsGenerating(true);
    setError(null);
    setEmailText(null);
    setIsCopied(false);

    try {
      const response = await fetch('http://localhost:8000/resume/cold-email-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tex_code: code, target_info: targetInfo }),
      });

      if (!response.ok) throw new Error('Failed to generate email');
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
        setEmailText(text);
      }
    } catch (err) {
      setError('An error occurred. The AI career coach is currently busy.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (emailText) {
      navigator.clipboard.writeText(emailText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-900/20 p-6">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Mail className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Cold Email Generator</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Applying in portals has a 2% success rate. Sending a targeted cold email to the Hiring Manager has a 20% success rate.
          </p>
        </div>

        {!emailText && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Hiring Manager's LinkedIn Bio / Job Info
            </label>
            <textarea
              value={targetInfo}
              onChange={(e) => setTargetInfo(e.target.value)}
              placeholder="Paste the Hiring Manager's LinkedIn 'About' section, or the details of the job posting..."
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-mono text-sm"
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button 
                onClick={onClose}
                className="px-5 py-2.5 text-slate-300 hover:text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !targetInfo.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Drafting Email...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Generate Draft
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {emailText && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 relative">
              <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed text-sm">
                {emailText}
              </pre>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button 
                onClick={() => setEmailText(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ← Draft another one
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all"
              >
                {isCopied ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" /> Copy to Clipboard
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
