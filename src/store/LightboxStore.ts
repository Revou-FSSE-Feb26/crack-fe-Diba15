import { create } from "zustand";
import type { LightboxState } from "@/types";

/**
 * Store Zustand untuk mengelola state tampilan Lightbox (pratinjau gambar fullscreen).
 *
 * Mengatur visibilitas modal, daftar gambar yang ditampilkan, indeks gambar aktif,
 * judul/keterangan gambar, serta status proteksi gambar.
 */
export const useLightboxStore = create<LightboxState>((set) => ({
	/** Menentukan apakah modal lightbox sedang terbuka atau tertutup */
	isOpen: false,

	/** Daftar URL gambar yang akan ditampilkan di dalam lightbox */
	images: [],

	/** Indeks gambar awal yang aktif saat pertama kali lightbox dibuka */
	initialIndex: 0,

	/** Judul atau keterangan opsional yang ditampilkan pada lightbox */
	title: undefined,

	/** Menandakan apakah gambar diproteksi (misalnya pencegahan klik kanan/unduhan) */
	isProtected: false,

	/**
	 * Membuka modal lightbox dan menampilkan gambar yang ditentukan.
	 *
	 * @param images - Array URL gambar yang ingin ditampilkan (harus berisi minimal satu gambar)
	 * @param initialIndex - Indeks gambar awal yang langsung ditampilkan (default: 0)
	 * @param title - Judul atau keterangan opsional untuk pratinjau gambar
	 * @param isProtected - Menentukan apakah gambar diproteksi dari pengunduhan/klik kanan (default: false)
	 */
	openLightbox: (images, initialIndex = 0, title, isProtected = false) => {
		// Jangan buka lightbox jika daftar gambar kosong
		if (images.length === 0) return;
		set({ isOpen: true, images, initialIndex, title, isProtected });
	},

	/**
	 * Menutup modal lightbox dan menyembunyikannya dari tampilan.
	 */
	closeLightbox: () => set({ isOpen: false }),
}));
