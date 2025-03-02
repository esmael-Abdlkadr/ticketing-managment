import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { Role } from "../services/api/types";
import { User } from "../services/auth/type";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      setIsAuthenticated: (isAuthenticated: boolean) =>
        set({ isAuthenticated }),
      setIsLoading: (isLoading: boolean) => set({ isLoading }),
      setUser: (user: User | null) => set({ user }),
      clearUser: () =>
        set({ isAuthenticated: false, user: null, isLoading: false }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    } as PersistOptions<AuthState>
  )
);
export type { User, Role };
