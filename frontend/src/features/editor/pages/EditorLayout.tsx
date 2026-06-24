import { useState, useEffect, useRef } from "react";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { LatexEditor } from "../../../components/editor/LatexEditor";
import { PdfPreview } from "../../../components/editor/PdfPreview";
import { EditorToolbar } from "../components/EditorToolbar";
import { CopilotSidebar } from "../components/CopilotSidebar";
import { useEditorStore } from "../../../shared/hooks/useEditorStore";
import { useAuthStore } from "../../../shared/hooks/useAuthStore";
import { saveResume, updateResume, getResume } from "../../dashboard/api/resume.api";
import { toast } from "sonner";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

export function EditorLayout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const resumeIdParam = searchParams.get('id');
  const versionParam = searchParams.get('v') || '0';

  const { code, setCode, title, setTitle, currentResumeId, setCurrentResumeId, isAutoCompile } = useEditorStore();
  const { user } = useAuthStore();
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showCopilot, setShowCopilot] = useState(true);
  const workerRef = useRef<Worker | null>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../../../workers/latexWorker.ts', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onmessage = (e) => {
      if (e.data.success) {
        console.log("Compilation Successful!");
        if (e.data.pdfData) {
          setPdfUrl(e.data.pdfData);
        }
      } else {
        console.error("Compilation Error:", e.data.error);
      }
      setIsCompiling(false);
    };

    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    if (resumeIdParam && resumeIdParam !== currentResumeId) {
      getResume(resumeIdParam).then(data => {
        setCode(data.texCode);
        setTitle(data.title);
        setCurrentResumeId(data._id);
        
        // Initialize the history stack with version 0 if no state exists
        if (!location.state?.savedCode) {
           navigate(`?id=${data._id}&v=0`, { replace: true, state: { savedCode: data.texCode } });
        }

        if (data.chatHistory && data.chatHistory.length > 0) {
          useEditorStore.getState().setChatHistory(data.chatHistory);
        } else {
          useEditorStore.getState().setChatHistory([ { role: 'assistant', content: "Hi! I'm your AI Copilot. How would you like to customize this template? (e.g. 'Make the font smaller', 'Add a Skills section')" } ]);
        }
      }).catch(_e => {
        toast.error("Failed to load resume");
      });
    } else if (!resumeIdParam && currentResumeId) {
      // Unset if navigating to raw /editor
      setCurrentResumeId(null);
      setTitle("");
    }
  }, [resumeIdParam]);

  // Listen for browser Back/Forward (popstate) driven by location.state
  useEffect(() => {
    if (location.state && location.state.savedCode && location.state.savedCode !== code) {
       setCode(location.state.savedCode);
    }
  }, [location.state]);

  const handleCompile = () => {
    setIsCompiling(true);
    
    // Create an icon map: filename -> URL
    const iconMap: Record<string, string> = {};
    if (user?.icons) {
      user.icons.forEach(icon => {
        iconMap[icon.name] = icon.url;
      });
    }

    workerRef.current?.postMessage({ texCode: code, images: iconMap });
  };

  // Auto-Compile Debounce
  useEffect(() => {
    if (!isAutoCompile || !code) return;
    const timeoutId = setTimeout(() => {
      handleCompile();
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [code, isAutoCompile, user?.icons]);

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleUndo = () => editorRef.current?.trigger('keyboard', 'undo', null);
  const handleRedo = () => editorRef.current?.trigger('keyboard', 'redo', null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (currentResumeId) {
        await updateResume(currentResumeId, {
          title: title || "My Resume",
          targetRole: "Software Engineer",
          texCode: code,
        });
        const nextVersion = parseInt(versionParam) + 1;
        navigate(`?id=${currentResumeId}&v=${nextVersion}`, { state: { savedCode: code } });
        toast.success('Resume updated successfully!');
      } else {
        const newRes = await saveResume({
          title: title,
          targetRole: "Software Engineer",
          texCode: code,
          userId: user?.id
        });
        setCurrentResumeId(newRes._id);
        setTitle(newRes.title);
        navigate(`/editor?id=${newRes._id}&v=1`, { replace: true, state: { savedCode: code } });
        toast.success('Resume saved successfully!');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to save resume.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950">
      <EditorToolbar 
        isCompiling={isCompiling} 
        onCompile={handleCompile} 
        onDownload={handleDownload} 
        isSaving={isSaving}
        onSave={handleSave}
        showCopilot={showCopilot}
        onToggleCopilot={() => setShowCopilot(!showCopilot)}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal">
          {showCopilot && (
            <ResizablePanel 
              id="copilot"
              
              defaultSize={15} 
              minSize={10} 
              className="z-20 border-white/10"
            >
              <div className="w-full h-full border-r border-white/10 overflow-hidden">
                <CopilotSidebar />
              </div>
            </ResizablePanel>
          )}
          
          {showCopilot && <ResizableHandle withHandle />}

          <ResizablePanel id="editor" defaultSize={40} minSize={10}>
            <LatexEditor value={code} onChange={(v) => setCode(v || '')} onEditorMount={(editor) => editorRef.current = editor} />
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel id="preview" defaultSize={40} minSize={10}>
            <PdfPreview isCompiling={isCompiling} pdfUrl={pdfUrl} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
