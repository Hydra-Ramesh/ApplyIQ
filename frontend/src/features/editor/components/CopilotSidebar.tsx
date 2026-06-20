import { useState } from "react";
import { useEditorStore } from "../../../shared/hooks/useEditorStore";
import { Send, Bot, Sparkles, Loader2 } from "lucide-react";

export function CopilotSidebar() {
  const { code, setCode } = useEditorStore();
  const [instruction, setInstruction] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Hi! I'm your AI Copilot. How would you like to customize this template? (e.g. 'Make the font smaller', 'Add a Skills section')" }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isProcessing) return;

    const userMsg = instruction;
    setInstruction("");
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
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
      setHistory(prev => [...prev, { role: 'assistant', content: "I've updated the LaTeX code based on your instructions! The preview will recompile automatically." }]);
    } catch (error) {
      console.error(error);
      setHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I ran into an error while processing that request." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#0A0A0B] border-r border-white/10 relative z-20 shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <Sparkles className="w-5 h-5 text-blue-400" />
        <h2 className="font-bold text-white tracking-wide">AI Copilot</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 \${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
            )}
            <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed \${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none shadow-lg' 
                : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none shadow-md'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-none flex items-center gap-2 text-white/50 text-sm">
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
    </div>
  );
}
