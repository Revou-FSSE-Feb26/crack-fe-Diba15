import { create } from "zustand";
import { axiosClient } from "@/lib/axiosClient";
import type { User, UserManagementState } from "@/types";

/**
 * Helper untuk mengubah format objek pengguna dari database/backend
 * menjadi format model `User` yang konsisten di sisi frontend.
 *
 * @param dbUser - Data mentah pengguna dari respons backend
 * @returns Objek `User` yang telah dinormalisasi
 */
const toLocalUser = (dbUser: {
	id: string;
	name: string;
	email: string;
	role: string;
	balance: number;
	createdAt: string;
	updatedAt: string;
}): User => ({
	id: dbUser.id,
	name: dbUser.name,
	email: dbUser.email,
	password: "", // Tidak pernah dikembalikan oleh backend demi keamanan
	role: dbUser.role as User["role"],
	balance: dbUser.balance,
	created_at: dbUser.createdAt,
	updated_at: dbUser.updatedAt,
});

/**
 * Store Zustand untuk manajemen data seluruh pengguna (CRUD Pengguna).
 *
 * Digunakan terutama pada panel Dashboard Admin untuk mengelola akun kurator
 * maupun pengguna lain (memuat, menambah, mengubah, dan menghapus akun).
 */
export const useUserManagementStore = create<UserManagementState>()(
	(set, get) => ({
		/** Daftar seluruh pengguna yang berhasil dimuat dari backend */
		users: [],

		/**
		 * Mengambil daftar seluruh pengguna dari backend (`GET /user`).
		 * Biasanya dipanggil ketika halaman dashboard admin pertama kali dimuat.
		 */
		fetchUsers: async () => {
			try {
				const res = await axiosClient.get("/user");
				const users: User[] = res.data.map(toLocalUser);
				set({ users });
			} catch (error) {
				console.error("Gagal memuat daftar user:", error);
			}
		},

		/**
		 * Helper praktis untuk membuat akun dengan role 'curator'.
		 * Membungkus pemanggilan `createUser` dengan menyetel `role: "curator"`.
		 *
		 * @param payload - Data kurator baru (nama, email, password)
		 */
		createCurator: (payload) =>
			get().createUser({ ...payload, role: "curator" }),

		/**
		 * Menambahkan pengguna baru ke sistem (`POST /user`).
		 * Jika berhasil, data user baru akan langsung disisipkan di posisi awal array `users`.
		 *
		 * @param payload - Payload data pengguna (name, email, password, role)
		 * @returns Hasil aksi berupa boolean `success` dan pesan status
		 */
		createUser: async (payload) => {
			try {
				const res = await axiosClient.post("/user", {
					name: payload.name.trim(),
					email: payload.email.trim().toLowerCase(),
					password: payload.password,
					role: payload.role ?? "curator",
				});

				const newUser = toLocalUser(res.data);
				set((state) => ({ users: [newUser, ...state.users] }));

				return { success: true, message: "User berhasil ditambahkan." };
			} catch (error) {
				const err = error as {
					response?: { data?: { message?: string } };
				};
				const msg = err.response?.data?.message ?? "Gagal menambahkan user.";
				return { success: false, message: msg };
			}
		},

		/**
		 * Memperbarui data pengguna tertentu berdasarkan ID (`PATCH /user/:id`).
		 *
		 * @param id - ID pengguna yang akan diperbarui
		 * @param payload - Data parsial yang diperbarui (name, email, role, password)
		 * @returns Hasil aksi berupa status sukses dan pesan konfirmasi
		 */
		updateUser: async (id, payload) => {
			try {
				const res = await axiosClient.patch(`/user/${id}`, payload);
				const updated = toLocalUser(res.data);

				set((state) => ({
					users: state.users.map((u) => (u.id === id ? updated : u)),
				}));

				return { success: true, message: "Perubahan user berhasil disimpan." };
			} catch (error) {
				const err = error as {
					response?: { data?: { message?: string } };
				};
				const msg = err.response?.data?.message ?? "Gagal memperbarui user.";
				return { success: false, message: msg };
			}
		},

		/**
		 * Menghapus akun pengguna dari sistem (`DELETE /user/:id`).
		 *
		 * @param id - ID pengguna yang akan dihapus
		 * @returns Status keberhasilan dan notifikasi nama user yang terhapus
		 */
		deleteUser: async (id) => {
			const target = get().users.find((u) => u.id === id);

			try {
				await axiosClient.delete(`/user/${id}`);
				set((state) => ({
					users: state.users.filter((u) => u.id !== id),
				}));
				return {
					success: true,
					message: `${target?.name ?? "User"} berhasil dihapus.`,
				};
			} catch (error) {
				const err = error as {
					response?: { data?: { message?: string } };
				};
				const msg = err.response?.data?.message ?? "Gagal menghapus user.";
				return { success: false, message: msg };
			}
		},
	}),
);
