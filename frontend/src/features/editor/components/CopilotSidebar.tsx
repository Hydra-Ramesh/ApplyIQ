import { useState } from "react";
import { useEditorStore, DEFAULT_GREETING } from "../../../shared/hooks/useEditorStore";
import { Send, Sparkles, Trash, User } from "lucide-react";
import { updateResume } from "../../dashboard/api/resume.api";

interface CopilotSidebarProps {
  compilationError?: string | null;
}

export function CopilotSidebar({ compilationError }: CopilotSidebarProps = {}) {
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

    let finalInstruction = userMsg;
    if (compilationError) {
      finalInstruction += `\n\nNote: The current LaTeX code has this compilation error that needs fixing: ${compilationError}`;
      if (compilationError.includes("Missing $ inserted")) {
        finalInstruction += `\nHint for AI: 'Missing $ inserted' in LaTeX is almost always caused by an unescaped underscore ('_') or ampersand ('&') in plain text (like an email address, URL, or name). Please carefully scan the code for any unescaped '_' and replace them with '\\_'.`;
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_AI_URL}/api/v1/resume/copilot`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          tex_code: code, 
          instruction: finalInstruction,
          chat_history: chatHistory
        })
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("You have reached your free tier limit for Copilot. Please upgrade to Pro to continue using AI features!");
        }
        throw new Error('Failed to reach Copilot');
      }
      const data = await res.json();
      
      setCode(data.tex_code);
      
      const aiResponseText = data.message || "I've updated the LaTeX code based on your instructions! The preview will recompile automatically.";
      const finalHistory = [...newHistory, { role: 'assistant' as const, content: aiResponseText }];
      setChatHistory(finalHistory);
      
      if (currentResumeId) {
        updateResume(currentResumeId, { chatHistory: finalHistory }).catch(e => console.error("Failed to save chat history", e));
      }
    } catch (error) {
      console.error(error);
      const errHistory = [...newHistory, { role: 'assistant' as const, content: error instanceof Error ? error.message : "Sorry, I ran into an error while processing that request." }];
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
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#111216]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-400 p-[2px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#16181D] rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-300" />
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-white/90 text-sm">Resume Assistant</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <span className="text-[10px] text-emerald-400/90 uppercase tracking-wider font-medium">Online</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-2 py-1.5 rounded-md transition-colors"
          title="Clear all chat history"
        >
          <Trash className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`group relative flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-500/20 mt-1 shadow-sm">
                <Sparkles className="w-4 h-4 text-indigo-300" />
              </div>
            )}
            <div className={`relative px-4 py-3 rounded-2xl max-w-[85%] text-[13.5px] leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-sm border border-indigo-500/30' 
                : 'bg-[#1A1C23] text-slate-200 rounded-tl-sm border border-white/5'
            }`}>
              {msg.content}
              {/* Delete Button (visible on hover) */}
              <button
                onClick={() => handleDeleteMessage(idx)}
                className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-red-400 bg-[#242730] hover:bg-slate-700 rounded-full shadow-md ${
                  msg.role === 'user' ? '-left-8' : '-right-8'
                }`}
                title="Delete Message"
              >
                <Trash className="w-3 h-3" />
              </button>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0 border border-white/10 mt-1">
                <User className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
        ))}
        {isProcessing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-500/20 mt-1 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-300" />
            </div>
            <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-[#1A1C23] border border-white/5 shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#0A0A0B] border-t border-white/5 relative z-30">
        <form onSubmit={handleSubmit} className="relative flex items-center group">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            disabled={isProcessing}
            placeholder="Ask me to tweak your resume..."
            className="w-full bg-[#16181D] border border-white/10 focus:border-indigo-500/50 focus:bg-[#1A1C23] rounded-full py-3.5 pl-5 pr-14 text-[13px] text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50 shadow-inner"
          />
          <button 
            type="submit" 
            disabled={isProcessing || !instruction.trim()}
            className="absolute right-1.5 w-9 h-9 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-full disabled:opacity-50 disabled:bg-white/5 disabled:text-slate-500 transition-all shadow-md group-focus-within:shadow-indigo-500/20"
          >
            <Send className="w-4 h-4 -ml-0.5" />
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
