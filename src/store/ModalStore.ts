import { create } from "zustand";
import type { ModalState } from "@/types";

export const useModalStore = create<ModalState>((set) => ({
	isOpen: false,
	config: null,
	openModal: (config) => set({ isOpen: true, config }),
	closeModal: () => set({ isOpen: false, config: null }),
}));
