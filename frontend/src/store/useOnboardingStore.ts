import { create } from 'zustand';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  portfolio: string;
}

interface CodingProfiles {
  leetcode: string;
  github: string;
  codeforces: string;
}

interface OnboardingState {
  currentStep: number;
  personalInfo: PersonalInfo;
  codingProfiles: CodingProfiles;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  updateCodingProfiles: (data: Partial<CodingProfiles>) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 1,
  personalInfo: { firstName: '', lastName: '', phone: '', location: '', portfolio: '' },
  codingProfiles: { leetcode: '', github: '', codeforces: '' },
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  updatePersonalInfo: (data) => set((state) => ({ personalInfo: { ...state.personalInfo, ...data } })),
  updateCodingProfiles: (data) => set((state) => ({ codingProfiles: { ...state.codingProfiles, ...data } })),
}));
