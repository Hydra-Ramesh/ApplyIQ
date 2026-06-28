import { GenericPageLayout } from "../layouts/GenericPageLayout";
import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";
import { resumeTemplates as hardcodedTemplates } from "../../data/templates";
import { useEffect, useState } from "react";

export function LatexTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/templates`);
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map((t: any) => ({
            id: t._id,
            name: t.name,
            description: t.description,
          }));
          setTemplates(formatted.length > 0 ? formatted : hardcodedTemplates);
        } else {
          setTemplates(hardcodedTemplates);
        }
      } catch (err) {
        setTemplates(hardcodedTemplates);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  if (isLoading) {
    return (
      <GenericPageLayout title="LaTeX Templates" subtitle="Pixel-perfect resumes.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-muted border border-border" />
          ))}
        </div>
      </GenericPageLayout>
    );
  }

  return (
    <GenericPageLayout title="LaTeX Templates" subtitle="Pixel-perfect typography that recruiters love and ATS systems can read flawlessly.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {templates.map((template) => (
          <div key={template.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/30 transition-all flex flex-col h-full group">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-0">{template.name}</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {template.description}
              </p>
            </div>
            <Link to="/register" className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform w-fit">
              Use this template free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
      <div className="text-center mt-16 pb-8">
        <Link to="/register" className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-xl hover:scale-105 transition-transform">
          Browse All Templates inside ApplyIQ
        </Link>
      </div>
    </GenericPageLayout>
  );
}
