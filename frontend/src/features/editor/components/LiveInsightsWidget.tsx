import { useState, useRef, useEffect } from 'react';
import { Target, Flame, ChevronRight, ChevronLeft, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useEditorStore } from '../../../shared/hooks/useEditorStore';

interface LiveInsightsWidgetProps {
  roastContent: string | null;
  atsScore: number | null;
  atsContent: string | null;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  isAnalyzing: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function LiveInsightsWidget({
  roastContent,
  atsScore,
  atsContent,
  jobDescription,
  setJobDescription,
  isAnalyzing,
  isOpen,
  onClose
}: LiveInsightsWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'roast' | 'ats'>('ats');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [roastContent, atsContent]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`absolute top-4 right-4 z-40 bg-[#1A1C23]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'w-[450px] h-[80vh]' : 'w-[320px] h-[500px]'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/5 bg-[#111216]/80 rounded-t-xl">
        <div className="flex gap-2 p-1 bg-black/40 rounded-lg">
          <button
            onClick={() => setActiveTab('ats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'ats' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            ATS
          </button>
          <button
            onClick={() => setActiveTab('roast')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'roast' 
                ? 'bg-orange-500/20 text-orange-400' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Roast
          </button>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" ref={scrollRef}>
        
        {activeTab === 'ats' && (
          <div className="flex flex-col h-full space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste Job Description here to get a live ATS score..."
                className="w-full h-24 bg-black/40 border border-white/5 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50 resize-none"
              />
            </div>
            
            {jobDescription.trim() ? (
              <div className="flex-1 bg-black/20 rounded-lg p-3 border border-white/5 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-white">Live Match Score</span>
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  ) : atsScore !== null ? (
                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${atsScore >= 80 ? 'bg-green-500/20 text-green-400' : atsScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {atsScore}%
                    </div>
                  ) : null}
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-slate-300 text-xs [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm">
                  {atsContent ? (
                    <ReactMarkdown>{atsContent}</ReactMarkdown>
                  ) : isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-500 space-y-2">
                      <Target className="w-8 h-8 opacity-20" />
                      <p>Analyzing resume against JD...</p>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-8">Make a change to trigger scan.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                <Target className="w-10 h-10 text-slate-500" />
                <p className="text-xs text-slate-400 px-4">Provide a Job Description above to activate live ATS scoring.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'roast' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
               <span className="text-xs font-bold text-white">Brutal Review</span>
               {isAnalyzing && <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />}
            </div>
            <div className="flex-1 bg-black/20 rounded-lg p-3 border border-white/5 prose prose-invert prose-sm max-w-none text-slate-300 text-xs [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm">
              {roastContent ? (
                <ReactMarkdown>{roastContent}</ReactMarkdown>
              ) : isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-500 space-y-2">
                  <Flame className="w-8 h-8 opacity-20" />
                  <p>Roasting in progress...</p>
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">Make a change to trigger roast.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
