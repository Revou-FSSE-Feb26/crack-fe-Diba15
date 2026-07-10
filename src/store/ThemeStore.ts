import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme, ThemeState } from "@/types";

export const useThemeStore = create<ThemeState>()(
	persist(
		(set, get) => ({
			theme: "light",

			toggleTheme: () => {
				const currentTheme = get().theme;
				const newTheme = currentTheme === "light" ? "dark" : "light";
				set({ theme: newTheme });
			},

			setTheme: (theme: Theme) => set({ theme }),
		}),
		{
			name: "trubrush-theme",
		},
	),
);
