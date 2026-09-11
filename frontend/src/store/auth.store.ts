import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  lastName: string;
  role: 'ADMIN' | 'OPERATOR' | 'READER';
  isActive: boolean;
  twoFactorEnabled: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isFirstLogin: boolean;
  hasHydrated: boolean;
  login: (user: User, accessToken: string, refreshToken: string, isFirstLogin?: boolean) => void;
  logout: () => void;
  updateFirstLogin: (isFirstLogin: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isFirstLogin: false,
      hasHydrated: false,
      login: (user, accessToken, refreshToken, isFirstLogin = false) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isFirstLogin,
        });
      },
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isFirstLogin: false,
        });
      },
      updateFirstLogin: (isFirstLogin) => {
        set({ isFirstLogin });
      },
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);