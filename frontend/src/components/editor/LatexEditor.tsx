import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useEffect, useRef } from "react";
import { useAuthStore } from "../../shared/hooks/useAuthStore";
import { useEditorStore } from "../../shared/hooks/useEditorStore";

// Heatmap Word Lists
const STRONG_VERBS = ['developed', 'engineered', 'spearheaded', 'led', 'managed', 'architected', 'designed', 'launched', 'reduced', 'increased', 'optimized', 'accelerated', 'transformed'];
const WEAK_WORDS = ['helped', 'worked on', 'responsible for', 'duties included', 'assisted', 'handled', 'participated', 'various', 'things'];
const METRIC_REGEX = /\\b\\d+(?:\\.\\d+)?%?\\b|\\$[0-9]+(?:[a-zA-Z]+)?/g;

interface LatexEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onEditorMount?: (editor: any) => void;
}

export const LatexEditor = React.memo(({ value, onChange, onEditorMount }: LatexEditorProps) => {
  const monaco = useMonaco();
  const providerRef = useRef<any>(null);
  const editorInstanceRef = useRef<any>(null);
  const decorationIdsRef = useRef<string[]>([]);

  const { user } = useAuthStore();
  const isPro = user?.subscriptionTier === 'pro';
  const { isHeatmapActive } = useEditorStore();

  useEffect(() => {
    if (monaco && isPro) {
      // Unregister previous provider if exists
      if (providerRef.current) {
        providerRef.current.dispose();
      }

      // Register the Copilot Ghost Text Provider
      providerRef.current = monaco.languages.registerInlineCompletionsProvider("latex", {
        provideInlineCompletions: async (model: any, position: any, _context: any, _token: any) => {
          // Get the current line text up to the cursor
          const currentLine = model.getLineContent(position.lineNumber);
          const prefix = currentLine.substring(0, position.column - 1);

          // If the user hasn't typed enough, don't trigger AI
          if (prefix.trim().length < 10) {
            return { items: [] };
          }

          // Fetch the entire context for the AI
          const fullContext = model.getValue();

          try {
            const res = await fetch("http://localhost:8000/resume/autocomplete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prefix, context: fullContext }),
            });

            if (!res.ok) return { items: [] };

            const data = await res.json();
            const suggestion = data.suggestion;

            if (suggestion) {
              return {
                items: [
                  {
                    insertText: suggestion,
                    range: new monaco.Range(
                      position.lineNumber,
                      position.column,
                      position.lineNumber,
                      position.column
                    ),
                  },
                ],
              };
            }
          } catch (error) {
            console.error("Autocomplete failed", error);
          }
          
          return { items: [] };
        },
        freeInlineCompletions: () => {},
      } as any);
    }

    return () => {
      if (providerRef.current) {
        providerRef.current.dispose();
      }
    };
  }, [monaco, isPro]);

  // Heatmap Effect
  useEffect(() => {
    if (!monaco || !editorInstanceRef.current) return;

    if (!isHeatmapActive) {
      decorationIdsRef.current = editorInstanceRef.current.deltaDecorations(decorationIdsRef.current, []);
      return;
    }

    const model = editorInstanceRef.current.getModel();
    if (!model) return;

    const decorations: any[] = [];
    const text = model.getValue();
    const lines = text.split('\n');

    lines.forEach((line: string, i: number) => {
      const lineNumber = i + 1;
      const lowerLine = line.toLowerCase();

      // Strong Verbs (Green)
      STRONG_VERBS.forEach(word => {
        let index = lowerLine.indexOf(word);
        while (index !== -1) {
          // ensure word boundary (simplified)
          if ((index === 0 || !/[a-z]/.test(lowerLine[index - 1])) && 
              (index + word.length === lowerLine.length || !/[a-z]/.test(lowerLine[index + word.length]))) {
            decorations.push({
              range: new monaco.Range(lineNumber, index + 1, lineNumber, index + 1 + word.length),
              options: { inlineClassName: '!bg-green-500/40 !text-green-300 !font-bold !border-b-2 !border-green-500 rounded-sm' }
            });
          }
          index = lowerLine.indexOf(word, index + 1);
        }
      });

      // Weak Words (Red)
      WEAK_WORDS.forEach(word => {
        let index = lowerLine.indexOf(word);
        while (index !== -1) {
          decorations.push({
            range: new monaco.Range(lineNumber, index + 1, lineNumber, index + 1 + word.length),
            options: { inlineClassName: '!bg-red-500/40 !text-red-300 !font-bold !border-b-2 !border-red-500 rounded-sm' }
          });
          index = lowerLine.indexOf(word, index + 1);
        }
      });

      // Metrics (Blue)
      let match;
      while ((match = METRIC_REGEX.exec(line)) !== null) {
        decorations.push({
          range: new monaco.Range(lineNumber, match.index + 1, lineNumber, match.index + 1 + match[0].length),
          options: { inlineClassName: '!bg-blue-500/40 !text-blue-300 !font-bold !border-b-2 !border-blue-500 rounded-sm' }
        });
      }
      // reset regex state
      METRIC_REGEX.lastIndex = 0;
    });

    decorationIdsRef.current = editorInstanceRef.current.deltaDecorations(decorationIdsRef.current, decorations);

  }, [value, isHeatmapActive, monaco]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorInstanceRef.current = editor;
    
    // Define a custom transparent theme
    monaco.editor.defineTheme('glassmorphism', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000', // transparent
      }
    });
    monaco.editor.setTheme('glassmorphism');
    
    if (onEditorMount) {
      onEditorMount(editor);
    }
  };

  return (
    <div className="h-full w-full border-r border-white/10 relative bg-slate-950/20 backdrop-blur-xl">
      <Editor
        height="100%"
        defaultLanguage="latex"
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          wordWrap: "on",
          fontSize: 14,
          lineHeight: 24,
          padding: { top: 20 },
          inlineSuggest: { enabled: true },
          suggest: { preview: true },
        }}
      />
    </div>
  );
});
