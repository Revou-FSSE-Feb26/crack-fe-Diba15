import { create } from "zustand";
import { axiosClient } from "@/lib/axiosClient";
import type { User, UserManagementState } from "@/types";

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
	password: "", // Tidak pernah dikembalikan backend
	role: dbUser.role as User["role"],
	balance: dbUser.balance,
	created_at: dbUser.createdAt,
	updated_at: dbUser.updatedAt,
});

export const useUserManagementStore = create<UserManagementState>()(
	(set, get) => ({
		users: [],

		// ─── Fetch All Users (dipanggil saat dashboard dimuat) ─────────────────────
		fetchUsers: async () => {
			try {
				const res = await axiosClient.get("/user");
				const users: User[] = res.data.map(toLocalUser);
				set({ users });
			} catch (error) {
				console.error("Gagal memuat daftar user:", error);
			}
		},

		// ─── Create Curator (admin only) ───────────────────────────────────────────
		createCurator: (payload) =>
			get().createUser({ ...payload, role: "curator" }),

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

		// ─── Update User (name, email, role, password) ─────────────────────────────
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

		// ─── Delete User ───────────────────────────────────────────────────────────
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
