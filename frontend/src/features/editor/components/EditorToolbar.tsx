import { Play, Download, Save, Sparkles, Flame, Mail, Activity, Image as ImageIcon, Undo, Redo } from "lucide-react";
import { useState } from "react";
import { JobTailorModal } from "./JobTailorModal";
import { RoastModal } from "./RoastModal";
import { ColdEmailModal } from "./ColdEmailModal";
import { UpgradeModal } from "./UpgradeModal";
import { IconManagerModal } from "./IconManagerModal";
import { useAuthStore } from "../../../shared/hooks/useAuthStore";
import { useEditorStore } from "../../../shared/hooks/useEditorStore";
import { Bot } from "lucide-react";

interface EditorToolbarProps {
  isCompiling: boolean;
  onCompile: () => void;
  onDownload: () => void;
  isSaving?: boolean;
  onSave?: () => void;
  showCopilot?: boolean;
  onToggleCopilot?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function EditorToolbar({ isCompiling, onCompile, onDownload, isSaving, onSave, showCopilot, onToggleCopilot, onUndo, onRedo }: EditorToolbarProps) {
  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);
  const [isRoastModalOpen, setIsRoastModalOpen] = useState(false);
  const [isColdEmailModalOpen, setIsColdEmailModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isIconManagerOpen, setIsIconManagerOpen] = useState(false);
  
  const { user } = useAuthStore();
  const { isHeatmapActive, toggleHeatmap, title, setTitle, isAutoCompile, toggleAutoCompile } = useEditorStore();
  const isPro = user?.subscriptionTier === 'pro';

  const handleProFeatureClick = (setter: (val: boolean) => void) => {
    if (isPro) {
      setter(true);
    } else {
      setIsUpgradeModalOpen(true);
    }
  };

  return (
    <>
      <header className="h-14 border-b border-white/10 bg-slate-900/40 backdrop-blur-xl flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="font-semibold text-lg text-white pr-4 border-r border-slate-700">ApplyIQ <span className="text-slate-400">Editor</span></div>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="My Resume"
            className="bg-transparent text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-2 py-1 w-64 hover:bg-white/5 transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onUndo}
            className="flex items-center justify-center p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button 
            onClick={onRedo}
            className="flex items-center justify-center p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors mr-2"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
          
          <button 
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={toggleHeatmap}
            className={`flex items-center gap-2 px-2.5 py-1 text-xs font-bold rounded-md transition-all border ${
              isHeatmapActive 
                ? 'text-teal-400 bg-teal-500/20 border-teal-500/30' 
                : 'text-slate-400 hover:text-slate-300 bg-slate-800 border-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> {isHeatmapActive ? 'Heatmap: ON' : 'Heatmap: OFF'}
          </button>
          
          <button 
            onClick={() => setIsRoastModalOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-orange-500 hover:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 rounded-md transition-all border border-orange-500/20"
          >
            <Flame className="w-3.5 h-3.5" /> Roast Me
          </button>

          <button 
            onClick={onToggleCopilot}
            className={`flex items-center gap-2 px-2.5 py-1 text-xs font-bold rounded-md transition-all border ${
              showCopilot 
                ? 'text-blue-400 bg-blue-500/20 border-blue-500/30' 
                : 'text-slate-400 hover:text-slate-300 bg-slate-800 border-slate-700'
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> Copilot
          </button>

          <button 
            onClick={() => handleProFeatureClick(setIsColdEmailModalOpen)}
            className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-md transition-all border border-indigo-500/20"
          >
            <Mail className="w-3.5 h-3.5" /> Networking {isPro ? '' : ' 🔒'}
          </button>

          <button 
            onClick={() => handleProFeatureClick(setIsTailorModalOpen)}
            className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 hover:bg-white/5 rounded-md transition-all border border-purple-500/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Auto-Tailor {isPro ? '' : ' 🔒'}
          </button>
          <button 
            onClick={() => setIsIconManagerOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-all"
          >
            <ImageIcon className="w-3.5 h-3.5" /> Icons
          </button>
          
          <div className="h-6 w-px bg-slate-700 mx-1"></div>

          <button 
            onClick={toggleAutoCompile}
            className={`flex items-center gap-2 px-2.5 py-1 text-xs font-bold rounded-md transition-all border ${
              isAutoCompile 
                ? 'text-green-400 bg-green-500/20 border-green-500/30' 
                : 'text-slate-400 hover:text-slate-300 bg-slate-800 border-slate-700'
            }`}
          >
            {isAutoCompile ? 'Auto-Compile: ON' : 'Auto-Compile: OFF'}
          </button>

          <button 
            onClick={onCompile}
            disabled={isCompiling || isAutoCompile}
            className="flex items-center gap-2 px-2.5 py-1 bg-slate-800 text-white text-xs font-medium rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-3.5 w-3.5" /> Compile
          </button>
          <button 
            onClick={onDownload}
            className="flex items-center gap-2 px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </button>
        </div>
      </header>

      <JobTailorModal isOpen={isTailorModalOpen} onClose={() => setIsTailorModalOpen(false)} />
      <ColdEmailModal isOpen={isColdEmailModalOpen} onClose={() => setIsColdEmailModalOpen(false)} />
      <RoastModal isOpen={isRoastModalOpen} onClose={() => setIsRoastModalOpen(false)} />
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
      <IconManagerModal isOpen={isIconManagerOpen} onClose={() => setIsIconManagerOpen(false)} />
    </>
  );
}
