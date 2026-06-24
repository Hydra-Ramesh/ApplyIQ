import { useState } from "react";
import { useEditorStore, DEFAULT_GREETING } from "../../../shared/hooks/useEditorStore";
import { Send, Bot, Sparkles, Loader2, Trash } from "lucide-react";
import { updateResume } from "../../dashboard/api/resume.api";

export function CopilotSidebar() {
  const { code, setCode, currentResumeId, chatHistory, setChatHistory } = useEditorStore();
  const [instruction, setInstruction] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearChat = () => {
    setChatHistory([DEFAULT_GREETING]);
    if (currentResumeId) {
      updateResume(currentResumeId, { chatHistory: [DEFAULT_GREETING] }).catch(e => console.error("Failed to clear chat", e));
    }
    setShowClearConfirm(false);
  };

  const handleDeleteMessage = (indexToDelete: number) => {
    const updatedHistory = chatHistory.filter((_, idx) => idx !== indexToDelete);
    setChatHistory(updatedHistory);
    if (currentResumeId) {
      updateResume(currentResumeId, { chatHistory: updatedHistory }).catch(e => console.error("Failed to save chat history after delete", e));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isProcessing) return;

    const userMsg = instruction;
    setInstruction("");
    
    const newHistory = [...chatHistory, { role: 'user' as const, content: userMsg }];
    setChatHistory(newHistory);
    setIsProcessing(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/resume/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tex_code: code, instruction: userMsg })
      });

      if (!res.ok) throw new Error('Failed to reach Copilot');
      const data = await res.json();
      
      setCode(data.tex_code);
      
      const finalHistory = [...newHistory, { role: 'assistant' as const, content: "I've updated the LaTeX code based on your instructions! The preview will recompile automatically." }];
      setChatHistory(finalHistory);
      
      if (currentResumeId) {
        updateResume(currentResumeId, { chatHistory: finalHistory }).catch(e => console.error("Failed to save chat history", e));
      }
    } catch (error) {
      console.error(error);
      const errHistory = [...newHistory, { role: 'assistant' as const, content: "Sorry, I ran into an error while processing that request." }];
      setChatHistory(errHistory);
      if (currentResumeId) {
        updateResume(currentResumeId, { chatHistory: errHistory }).catch(e => console.error("Failed to save chat history", e));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#0A0A0B] border-r border-white/10 relative z-20 shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold text-white tracking-wide">AI Copilot</h2>
        </div>
        <button 
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
          title="Clear all chat history"
        >
          <Trash className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`group relative flex gap-3 \${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
            )}
            <div className={`relative p-3.5 rounded-2xl max-w-[85%] text-sm leading-relaxed \${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg border border-blue-500/30' 
                : 'bg-[#16181D] text-slate-200 border border-white/10 shadow-md'
            }`}>
              {msg.content}
              {/* Delete Button (visible on hover) */}
              <button
                onClick={() => handleDeleteMessage(idx)}
                className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-full shadow-md \${
                  msg.role === 'user' ? '-left-8' : '-right-8'
                }`}
                title="Delete Message"
              >
                <Trash className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#16181D] border border-white/10 shadow-md flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              Updating your LaTeX code...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-black/40 border-t border-white/10 backdrop-blur-md relative z-30">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            disabled={isProcessing}
            placeholder="E.g. Change title font to bold..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-white/30 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isProcessing || !instruction.trim()}
            className="absolute right-2 p-2 text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Custom Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#16181D] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3 text-red-400">
                <Trash className="w-5 h-5" />
                <h3 className="font-semibold text-lg text-white">Clear Chat History</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Are you sure you want to delete this entire conversation? This action cannot be undone and will be permanently saved.
              </p>
            </div>
            <div className="p-4 bg-white/5 border-t border-white/10 flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-transparent hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearChat}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 rounded-lg shadow-lg shadow-red-500/20 transition-all"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
