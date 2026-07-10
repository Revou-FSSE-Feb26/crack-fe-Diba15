import { create } from "zustand";

interface LightboxState {
  isOpen: boolean;
  images: string[];
  initialIndex: number;
  title?: string;
  openLightbox: (images: string[], initialIndex?: number, title?: string) => void;
  closeLightbox: () => void;
}

export const useLightboxStore = create<LightboxState>((set) => ({
  isOpen: false,
  images: [],
  initialIndex: 0,
  title: undefined,

  openLightbox: (images, initialIndex = 0, title) => {
    if (images.length === 0) return;
    set({ isOpen: true, images, initialIndex, title });
  },

  closeLightbox: () => set({ isOpen: false }),
}));