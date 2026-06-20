import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEditorStore } from "../../../shared/hooks/useEditorStore";
import { templates as hardcodedTemplates } from "../../../data/templates";
import { FileText, ArrowRight } from "lucide-react";

export function TemplateGallery() {
  const navigate = useNavigate();
  const setCode = useEditorStore(state => state.setCode);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/templates');
        if (res.ok) {
          const data = await res.json();
          // Map DB models to expected UI format
          const formatted = data.map((t: any) => ({
            id: t._id,
            name: t.name,
            description: t.description,
            thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
            latexCode: t.latexCode,
            tags: ["Database"]
          }));
          setTemplates(formatted.length > 0 ? formatted : hardcodedTemplates);
        } else {
          setTemplates(hardcodedTemplates);
        }
      } catch (err) {
        console.error("Failed to fetch templates from API, using fallback", err);
        setTemplates(hardcodedTemplates);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleSelectTemplate = (latexCode: string) => {
    setCode(latexCode);
    navigate("/editor");
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading Templates...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Template Gallery</h1>
          <p className="text-white/60">Choose a pre-built template to start customizing immediately. Free of AI generation costs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group flex flex-col h-full"
              onClick={() => handleSelectTemplate(template.latexCode || template.latex)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{template.name}</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  {template.description}
                </p>
              </div>
              <button className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                Use this template <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
