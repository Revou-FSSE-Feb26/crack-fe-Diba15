import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserState } from "@/types";
import { useUserManagementStore } from "@/store/UserManagementStore";

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        const found = useUserManagementStore
          .getState()
          .users.find((u) => u.email === email && u.password === password);

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

      updateCurrentUser: (payload) => set((state) => (state.user ? { user: { ...state.user, ...payload } } : state)),

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
