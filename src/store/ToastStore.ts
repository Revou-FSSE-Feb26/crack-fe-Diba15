import { create } from "zustand";
import type { ToastState } from "@/types";

/**
 * Store Zustand untuk mengelola sistem notifikasi toast global.
 *
 * Mengontrol daftar antrean toast, penambahan toast baru dengan batas maksimal 3 item (FIFO),
 * dan penghapusan toast saat durasinya berakhir atau ditutup secara manual oleh pengguna.
 */
export const useToastStore = create<ToastState>((set) => ({
	/** Daftar notifikasi toast yang sedang aktif di layar */
	toasts: [],

	/**
	 * Menambahkan notifikasi toast baru ke antrean.
	 *
	 * Membuat ID acak unik untuk setiap toast dan membatasi jumlah toast maksimal 3.
	 * Jika sudah mencapai 3, toast paling lama (index 0) akan dihapus secara otomatis.
	 *
	 * @param options - Objek konfigurasi toast
	 * @param options.message - Pesan teks yang ingin disampaikan
	 * @param options.type - Tipe visual toast ("success" | "error" | "warning" | "info", default: "info")
	 * @param options.duration - Durasi tampil dalam milidetik sebelum hilang (default: 3500ms)
	 */
	addToast: ({ message, type = "info", duration = 3500 }) => {
		const id = Math.random().toString(36).slice(2, 9);
		const newToast = { id, message, type, duration };
		set((state) => ({
			// Jika sudah ada 3 toast, buang yang paling lama (index 0) lalu tambah yang baru (FIFO)
			toasts:
				state.toasts.length >= 3
					? [...state.toasts.slice(1), newToast]
					: [...state.toasts, newToast],
		}));
	},

	/**
	 * Menghapus notifikasi toast tertentu berdasarkan ID-nya.
	 *
	 * @param id - ID unik toast yang akan dihapus
	 */
	removeToast: (id) =>
		set((state) => ({
			toasts: state.toasts.filter((t) => t.id !== id),
		})),
}));
