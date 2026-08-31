import { create } from "zustand";
import type { LightboxState } from "@/types";

export const useLightboxStore = create<LightboxState>((set) => ({
	isOpen: false,
	images: [],
	initialIndex: 0,
	title: undefined,
	isProtected: false,

	openLightbox: (images, initialIndex = 0, title, isProtected = false) => {
		if (images.length === 0) return;
		set({ isOpen: true, images, initialIndex, title, isProtected });
	},

	closeLightbox: () => set({ isOpen: false }),
}));
