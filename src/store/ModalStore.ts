import { create } from "zustand";
import type { FormEvent, ReactNode } from "react";

export type ModalType = "alert" | "confirm" | "form";
export type ModalVariant = "default" | "danger";

export interface ModalConfig {
  /** Optional identifier for ownership checks. */
  id?: string;
  /** Title displayed at the top of the modal. */
  title: string;
  /** Simple text description. Ignored if `content` is provided. */
  description?: string;
  /** Custom React content rendered in the modal body — overrides `description`. */
  content?: ReactNode;
  /**
   * "alert" = single OK button
   * "confirm" = Cancel + Confirm buttons
   * "form" = body dibungkus <form> dengan tombol submit + cancel
   */
  type?: ModalType;
  /** Styles the confirm button red. Defaults to "default". */
  variant?: ModalVariant;
  /** Optional width utility classes, e.g. "max-w-2xl". */
  maxWidthClassName?: string;
  /** Extra classes for form body when type is "form". */
  formClassName?: string;
  /**
   * Dipakai saat type === "form". Setelah callback jalan, modal otomatis ditutup.
   * Jika ingin menahan modal tetap terbuka (mis. validasi gagal), return false.
   */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void | boolean;
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
