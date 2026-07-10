import { create } from "zustand";
import type { ToastState } from "@/types";

export const useToastStore = create<ToastState>((set) => ({
	toasts: [],

	addToast: ({ message, type = "info", duration = 3500 }) => {
		const id = Math.random().toString(36).slice(2, 9);
		const newToast = { id, message, type, duration };
		set((state) => ({
			// Jika sudah ada 3 toast, buang yang paling lama (index 0) lalu tambah yang baru
			toasts:
				state.toasts.length >= 3
					? [...state.toasts.slice(1), newToast]
					: [...state.toasts, newToast],
		}));
	},

	removeToast: (id) =>
		set((state) => ({
			toasts: state.toasts.filter((t) => t.id !== id),
		})),
}));
