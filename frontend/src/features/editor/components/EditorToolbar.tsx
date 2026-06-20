import { Play, Download, Save, LayoutTemplate, Sparkles, Flame, Mail, Activity } from "lucide-react";
import { useState } from "react";
import { JobTailorModal } from "./JobTailorModal";
import { RoastModal } from "./RoastModal";
import { ColdEmailModal } from "./ColdEmailModal";
import { UpgradeModal } from "./UpgradeModal";
import { useAuthStore } from "../../../shared/hooks/useAuthStore";
import { useEditorStore } from "../../../shared/hooks/useEditorStore";

interface EditorToolbarProps {
  isCompiling: boolean;
  onCompile: () => void;
  onDownload: () => void;
}

export function EditorToolbar({ isCompiling, onCompile, onDownload }: EditorToolbarProps) {
  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);
  const [isRoastModalOpen, setIsRoastModalOpen] = useState(false);
  const [isColdEmailModalOpen, setIsColdEmailModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  
  const { user } = useAuthStore();
  const { isHeatmapActive, toggleHeatmap } = useEditorStore();
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
      <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6">
        <div className="font-semibold text-lg text-white">ApplyIQ <span className="text-slate-400">Editor</span></div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
            <Save className="w-4 h-4" /> Save
          </button>
          <button 
            onClick={toggleHeatmap}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-md transition-all border ${
              isHeatmapActive 
                ? 'text-teal-400 bg-teal-500/20 border-teal-500/30' 
                : 'text-slate-400 hover:text-slate-300 bg-slate-800 border-slate-700'
            }`}
          >
            <Activity className="w-4 h-4" /> {isHeatmapActive ? 'Heatmap: ON' : 'Heatmap: OFF'}
          </button>
          
          <button 
            onClick={() => setIsRoastModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-orange-500 hover:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 rounded-md transition-all border border-orange-500/20"
          >
            <Flame className="w-4 h-4" /> Roast Me
          </button>

          <button 
            onClick={() => handleProFeatureClick(setIsColdEmailModalOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-md transition-all border border-indigo-500/20"
          >
            <Mail className="w-4 h-4" /> Networking {isPro ? '' : ' 🔒'}
          </button>

          <button 
            onClick={() => handleProFeatureClick(setIsTailorModalOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 hover:bg-white/5 rounded-md transition-all border border-purple-500/30"
          >
            <Sparkles className="w-4 h-4 text-purple-400" /> Auto-Tailor {isPro ? '' : ' 🔒'}
          </button>
          <button 
            onClick={onCompile}
            disabled={isCompiling}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <Play className="h-4 w-4" /> Compile
          </button>
          <button 
            onClick={onDownload}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </header>

      <JobTailorModal isOpen={isTailorModalOpen} onClose={() => setIsTailorModalOpen(false)} />
      <ColdEmailModal isOpen={isColdEmailModalOpen} onClose={() => setIsColdEmailModalOpen(false)} />
      <RoastModal isOpen={isRoastModalOpen} onClose={() => setIsRoastModalOpen(false)} />
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
    </>
  );
}
