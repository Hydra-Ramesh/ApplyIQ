import { useState, useEffect, useRef } from "react";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { LatexEditor } from "../../../components/editor/LatexEditor";
import { PdfPreview } from "../../../components/editor/PdfPreview";
import { EditorToolbar } from "../components/EditorToolbar";
import { CopilotSidebar } from "../components/CopilotSidebar";
import { useEditorStore } from "../../../shared/hooks/useEditorStore";

export function EditorLayout() {
  const { code, setCode } = useEditorStore();
  const [isCompiling, setIsCompiling] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showCopilot, setShowCopilot] = useState(true);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../../../workers/latexWorker.ts', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onmessage = (e) => {
      if (e.data.success) {
        console.log("Compilation Successful!");
      } else {
        console.error("Compilation Error:", e.data.error);
      }
      setIsCompiling(false);
    };

    return () => workerRef.current?.terminate();
  }, []);

  const handleCompile = () => {
    setIsCompiling(true);
    workerRef.current?.postMessage({ texCode: code });
  };

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-white">
      <EditorToolbar 
        isCompiling={isCompiling} 
        onCompile={handleCompile} 
        onDownload={handleDownload} 
      />

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {showCopilot && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <CopilotSidebar />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          <ResizablePanel defaultSize={showCopilot ? 40 : 50} minSize={30}>
            <LatexEditor value={code} onChange={(v) => setCode(v || '')} />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={showCopilot ? 40 : 50} minSize={30}>
            <PdfPreview isCompiling={isCompiling} pdfUrl={pdfUrl} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
