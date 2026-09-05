import { create } from "zustand";
import type { ModalState } from "@/types";

/**
 * Store Zustand untuk mengelola state modal global (dialog/popup).
 *
 * Mengontrol visibilitas modal (alert, konfirmasi, form) dan menyimpan konfigurasi dinamis
 * seperti judul, deskripsi, tombol aksi, serta callback konfirmasi/pembatalan.
 */
export const useModalStore = create<ModalState>((set) => ({
	/** Menandakan apakah modal sedang terbuka atau tertutup */
	isOpen: false,

	/** Konfigurasi aktif modal (konten, tipe dialog, tombol aksi, handler callback) */
	config: null,

	/**
	 * Membuka modal dengan konfigurasi spesifik.
	 *
	 * @param config - Konfigurasi modal (judul, tipe dialog, aksi konfirmasi/batal, dll.)
	 */
	openModal: (config) => set({ isOpen: true, config }),

	/**
	 * Menutup modal dan membersihkan konfigurasi aktif.
	 */
	closeModal: () => set({ isOpen: false, config: null }),
}));
