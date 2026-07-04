import { create } from "zustand";
import type { ReactNode } from "react";

export type ModalType = "alert" | "confirm";
export type ModalVariant = "default" | "danger";

export interface ModalConfig {
  /** Title displayed at the top of the modal. */
  title: string;
  /** Simple text description. Ignored if `content` is provided. */
  description?: string;
  /** Custom React content rendered in the modal body — overrides `description`. */
  content?: ReactNode;
  /** "alert" = single OK button; "confirm" = Cancel + Confirm buttons. Defaults to "alert". */
  type?: ModalType;
  /** Styles the confirm button red. Defaults to "default". */
  variant?: ModalVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalState {
  isOpen: boolean;
  config: ModalConfig | null;
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  config: null,
  openModal: (config) => set({ isOpen: true, config }),
  closeModal: () => set({ isOpen: false, config: null }),
}));
