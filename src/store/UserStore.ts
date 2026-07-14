import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosClient, setAccessToken } from "@/lib/axiosClient";
import { useUserManagementStore } from "@/store/UserManagementStore";
import type { UserState } from "@/types";

export const useUserStore = create<UserState>()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,

			login: async (email, password) => {
				try {
					// 1. Coba login ke API Route Handler Next.js
					const res = await axiosClient.post("/auth/login", {
						email,
						password,
					});
					const { accessToken } = res.data;

					// Simpan access token ke memori
					setAccessToken(accessToken);

					// Ambil data profil dari Route Handler Next.js
					const meRes = await axiosClient.get("/auth/me");
					const dbUser = meRes.data;

					// Petakan properti dari backend (camelCase) ke tipe frontend (snake_case)
					const safeUser = {
						id: dbUser.id,
						name: dbUser.name,
						email: dbUser.email,
						role: dbUser.role,
						balance: dbUser.balance,
						created_at: dbUser.createdAt,
						updated_at: dbUser.updatedAt,
					};

					set({ user: safeUser, isAuthenticated: true });
					return { success: true, message: "Login berhasil via API." };
				} catch (error) {
					const err = error as {
						response?: { status?: number; data?: { message?: string } };
					};
					// Jika gagal karena masalah koneksi (backend offline), lakukan fallback ke data dummy lokal
					if (!err.response) {
						console.warn(
							"NestJS API offline. Falling back to local mock login...",
						);
						const found = useUserManagementStore
							.getState()
							.users.find((u) => u.email === email && u.password === password);

						if (!found) {
							return { success: false, message: "Email atau password salah." };
						}

						const { password: _, ...safeUser } = found;
						set({ user: safeUser, isAuthenticated: true });
						return {
							success: true,
							message: "Login berhasil via Mock (Offline).",
						};
					}

					const errMsg =
						err.response?.data?.message || "Email atau password salah.";
					return { success: false, message: errMsg };
				}
			},

			logout: async () => {
				try {
					await axiosClient.post("/auth/logout");
				} catch (e) {
					console.warn("Logout API failed or server offline:", e);
				} finally {
					setAccessToken(null);
					set({ user: null, isAuthenticated: false });
				}
			},

			updateCurrentUser: (payload) =>
				set((state) =>
					state.user ? { user: { ...state.user, ...payload } } : state,
				),

			hasRole: (role) => get().user?.role === role,
			isArtist: () => get().user?.role === "artist",
			isClient: () => get().user?.role === "client",
			isCurator: () => get().user?.role === "curator",
			isAdmin: () => get().user?.role === "admin",
		}),
		{
			name: "trubrush-user", // key di localStorage
		},
	),
);
