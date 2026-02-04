import { create } from "zustand";
import { persist } from "zustand/middleware";
export type AuthUser = {
  id: string;
  name: string;
  email?: string;
//   avatar?: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  accessToken: string | null;

  login: (payload: { user: AuthUser; accessToken: string }) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,

      login: ({ user, accessToken }) => {
        set({
          user,
          accessToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
