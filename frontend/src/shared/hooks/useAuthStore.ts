import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  subscriptionTier: 'free' | 'pro';
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  upgradeToPro: () => void;
}

// Dummy initial state mimicking a logged in admin user for testing
export const useAuthStore = create<AuthState>((set) => ({
  user: { id: "123", email: "admin@example.com", subscriptionTier: "free", isAdmin: true },
  isAuthenticated: true,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  upgradeToPro: () => set((state) => ({ 
    user: state.user ? { ...state.user, subscriptionTier: 'pro' } : null 
  })),
}));
