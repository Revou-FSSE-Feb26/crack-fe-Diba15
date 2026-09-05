import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme, ThemeState } from "@/types";

/**
 * Store Zustand untuk mengelola tema aplikasi (light/dark mode).
 *
 * Menggunakan middleware `persist` untuk menyimpan preferensi tema pengguna
 * ke local storage (`trubrush-theme`) agar tema tetap konsisten saat halaman dimuat ulang.
 */
export const useThemeStore = create<ThemeState>()(
	persist(
		(set, get) => ({
			/** Tema aktif saat ini ("light" atau "dark", default: "light") */
			theme: "light",

			/**
			 * Mengalihkan tema aktif antara "light" dan "dark".
			 */
			toggleTheme: () => {
				const currentTheme = get().theme;
				const newTheme = currentTheme === "light" ? "dark" : "light";
				set({ theme: newTheme });
			},

			/**
			 * Menetapkan tema tertentu secara eksplisit.
			 *
			 * @param theme - Pilihan tema yang akan diterapkan ("light" atau "dark")
			 */
			setTheme: (theme: Theme) => set({ theme }),
		}),
		{
			name: "trubrush-theme",
		},
	),
);
