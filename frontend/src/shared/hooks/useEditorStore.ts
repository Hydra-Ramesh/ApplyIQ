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
  title: string;
  setTitle: (title: string) => void;
  currentResumeId: string | null;
  setCurrentResumeId: (id: string | null) => void;
  chatHistory: {role: 'user' | 'assistant', content: string}[];
  setChatHistory: (history: {role: 'user' | 'assistant', content: string}[]) => void;
  isAutoCompile: boolean;
  toggleAutoCompile: () => void;
}

export const DEFAULT_GREETING = { role: 'assistant' as const, content: "Hi there! 👋 I'm your resume assistant. Let me know how you'd like to tweak this template (e.g., 'Make the title bigger' or 'Add a certification section')." };

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      code: INITIAL_CODE,
      setCode: (code) => set({ code }),
      resetCode: () => set({ code: INITIAL_CODE, title: '', currentResumeId: null, chatHistory: [DEFAULT_GREETING] }),
      isHeatmapActive: false,
      toggleHeatmap: () => set((state) => ({ isHeatmapActive: !state.isHeatmapActive })),
      title: '',
      setTitle: (title) => set({ title }),
      currentResumeId: null,
      setCurrentResumeId: (currentResumeId) => set({ currentResumeId }),
      chatHistory: [DEFAULT_GREETING],
      setChatHistory: (chatHistory) => set({ chatHistory }),
      isAutoCompile: true,
      toggleAutoCompile: () => set((state) => ({ isAutoCompile: !state.isAutoCompile })),
    }),
    {
      name: 'applyiq-editor-storage', // unique name in localStorage
    }
  )
);
