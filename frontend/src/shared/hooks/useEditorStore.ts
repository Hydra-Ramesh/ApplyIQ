import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_CODE = `\\documentclass[a4paper,10pt]{article}
\\begin{document}
\\title{My Awesome Resume}
\\author{John Doe}
\\maketitle

\\section{Experience}
Software Engineer at TechCorp.
\\end{document}`;

interface EditorState {
  code: string;
  setCode: (code: string) => void;
  resetCode: () => void;
  isHeatmapActive: boolean;
  toggleHeatmap: () => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      code: INITIAL_CODE,
      setCode: (code) => set({ code }),
      resetCode: () => set({ code: INITIAL_CODE }),
      isHeatmapActive: false,
      toggleHeatmap: () => set((state) => ({ isHeatmapActive: !state.isHeatmapActive })),
    }),
    {
      name: 'applyiq-editor-storage', // unique name in localStorage
    }
  )
);
