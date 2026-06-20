import { FileText, Loader2 } from "lucide-react";

interface PdfPreviewProps {
  isCompiling: boolean;
  pdfUrl?: string | null;
}

export function PdfPreview({ isCompiling, pdfUrl }: PdfPreviewProps) {
  return (
    <div className="h-full w-full bg-slate-100 flex flex-col items-center justify-center p-8 relative">
      {isCompiling && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-sm font-medium text-slate-600">Compiling LaTeX...</p>
        </div>
      )}

      {pdfUrl ? (
        <iframe 
          src={pdfUrl} 
          className="w-full max-w-3xl h-full shadow-2xl rounded-sm border bg-white" 
          title="Resume PDF Preview"
        />
      ) : (
        <div className="w-full max-w-3xl h-full bg-white shadow-2xl rounded-sm border border-slate-200 flex flex-col items-center justify-center text-slate-400">
          <FileText className="h-16 w-16 mb-4 opacity-50" />
          <p className="font-medium text-lg text-slate-500">No PDF Generated Yet</p>
          <p className="text-sm mt-2">Make changes in the editor to trigger compilation.</p>
        </div>
      )}
    </div>
  );
}
