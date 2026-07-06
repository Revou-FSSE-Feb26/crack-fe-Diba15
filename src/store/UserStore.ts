import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "@/types";
import mockUsers from "@/data/users";

// User yang disimpan di store tidak mengandung password
type SafeUser = Omit<User, "password">;

interface LoginResult {
  success: boolean;
  message: string;
}

interface UserState {
  user: SafeUser | null;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => LoginResult;
  logout: () => void;

  // Role helpers — berguna untuk guard di page/layout
  hasRole: (role: UserRole) => boolean;
  isArtist: () => boolean;
  isClient: () => boolean;
  isCurator: () => boolean;
  isAdmin: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        const found = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (!found) {
          return { success: false, message: "Email atau password salah." };
        }

        // Jangan simpan password ke store / localStorage
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...safeUser } = found;
        set({ user: safeUser, isAuthenticated: true });
        return { success: true, message: "Login berhasil." };
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      hasRole: (role) => get().user?.role === role,
      isArtist: () => get().user?.role === "artist",
      isClient: () => get().user?.role === "client",
      isCurator: () => get().user?.role === "curator",
      isAdmin: () => get().user?.role === "admin",
    }),
    {
      name: "trubrush-user", // key di localStorage
    }
  )
);
