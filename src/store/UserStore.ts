import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosClient, setAccessToken } from "@/lib/axiosClient";
import { useUserManagementStore } from "@/store/UserManagementStore";
import type { DbUserResponse, Profile, User, UserState } from "@/types";

/**
 * Memetakan respons data pengguna mentah dari database/API backend
 * ke struktur objek model `User` lengkap dengan objek `profile` yang ternormalisasi.
 *
 * @param dbUser - Respons pengguna dari database/backend
 * @returns Objek `User` yang siap digunakan di state frontend
 */
const mapDbUser = (dbUser: DbUserResponse): User => {
	const mappedProfile: Profile | undefined = dbUser.profile
		? {
				id: dbUser.profile.id || `p-${dbUser.id}`,
				user_id: dbUser.id,
				avatar_url: dbUser.profile.avatarUrl ?? null,
				bio: dbUser.profile.bio ?? null,
				social_links: dbUser.profile
					? (dbUser.profile.socialLinks ?? {
							instagram: dbUser.profile.instagramUrl || undefined,
							twitter: dbUser.profile.twitterUrl || undefined,
							pixiv: dbUser.profile.pixivUrl || undefined,
							website: dbUser.profile.websiteUrl || undefined,
						})
					: null,
				is_verified: dbUser.profile.isVerified ?? false,
				approved_portfolio_count: dbUser.profile.approvedPortfolioCount ?? 0,
				is_open_for_commission: dbUser.profile.isOpenForCommission ?? false,
				base_price_idr: dbUser.profile.basePriceIdr ?? null,
				strike_count: dbUser.profile.strikeCount ?? 0,
				updated_at: dbUser.profile.updatedAt || dbUser.updatedAt,
			}
		: undefined;

	return {
		id: dbUser.id,
		name: dbUser.name,
		email: dbUser.email,
		password: "",
		role: dbUser.role,
		balance: dbUser.balance,
		created_at: dbUser.createdAt,
		updated_at: dbUser.updatedAt,
		profile: mappedProfile,
	};
};

/**
 * Store Zustand untuk mengelola sesi autentikasi dan data pengguna yang sedang login saat ini (Current User).
 *
 * Fitur utama:
 * - Autentikasi: login, register, logout, serta verifikasi sesi (`checkAuth`).
 * - Sinkronisasi saldo dompet: top up dan penarikan dana (withdraw).
 * - Pembaruan profil lokal pengguna aktif (`updateCurrentUser`).
 * - Pengecekan otorisasi role pengguna (`isAdmin`, `isArtist`, `isClient`, `isCurator`).
 * - Persistensi data ke localStorage (`trubrush-user`).
 */
export const useUserStore = create<UserState>()(
	persist(
		(set, get) => ({
			/** Data pengguna yang sedang login (null jika belum login / guest) */
			user: null,

			/** Menandakan apakah pengguna telah terautentikasi */
			isAuthenticated: false,

			/**
			 * Memeriksa validitas sesi pengguna ke backend (`GET /auth/me`).
			 * Jika valid, state pengguna diperbarui; jika tidak valid/kedaluwarsa, sesi di-reset.
			 */
			checkAuth: async () => {
				try {
					const meRes = await axiosClient.get("/auth/me");
					const safeUser = mapDbUser(meRes.data);
					set({ user: safeUser, isAuthenticated: true });
				} catch {
					setAccessToken(null);
					set({ user: null, isAuthenticated: false });
				}
			},

			/**
			 * Menangani login pengguna dengan email dan password.
			 * Jika backend aktif, mengirim request ke `/auth/login` dan menyimpan access token.
			 * Jika backend offline, menerapkan fallback autentikasi lokal via mock data di `useUserManagementStore`.
			 *
			 * @param email - Alamat email pengguna
			 * @param password - Kata sandi pengguna
			 * @returns Objek status `{ success, message }`
			 */
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
					const safeUser = mapDbUser(meRes.data);

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

			/**
			 * Mendaftarkan akun baru ke sistem (`POST /auth/register`).
			 * Jika registrasi berhasil, access token langsung disimpan dan sesi login diaktifkan.
			 *
			 * @param payload - Payload data pendaftaran (nama, email, password, role, dll.)
			 * @returns Objek status `{ success, message }`
			 */
			register: async (payload) => {
				try {
					// 1. Coba daftar ke API Route Handler Next.js
					const res = await axiosClient.post("/auth/register", payload);
					const { accessToken } = res.data;

					// Simpan access token ke memori
					setAccessToken(accessToken);

					// Ambil data profil dari Route Handler Next.js
					const meRes = await axiosClient.get("/auth/me");
					const safeUser = mapDbUser(meRes.data);

					set({ user: safeUser, isAuthenticated: true });
					return { success: true, message: "Pendaftaran berhasil via API." };
				} catch (error) {
					const err = error as {
						response?: { status?: number; data?: { message?: string } };
					};

					const errMsg =
						err.response?.data?.message ??
						"Gagal melakukan pendaftaran. Pastikan server berjalan.";
					return { success: false, message: errMsg };
				}
			},

			/**
			 * Melakukan logout pengguna dari aplikasi.
			 * Memanggil endpoint logout backend, membersihkan access token dari memori, dan mengosongkan state user.
			 */
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

			/**
			 * Menambahkan saldo dompet pengguna (`POST /user/topup`).
			 *
			 * @param amount - Nominal saldo yang ditambahkan
			 * @returns Objek status `{ success, message }`
			 */
			topUp: async (amount) => {
				try {
					const res = await axiosClient.post("/user/topup", { amount });
					const newBalance = res.data.user?.balance ?? res.data.balance;
					set((state) =>
						state.user
							? { user: { ...state.user, balance: newBalance } }
							: state,
					);
					return { success: true, message: "Top up berhasil." };
				} catch (error) {
					const err = error as {
						response?: { data?: { message?: string } };
					};
					const msg =
						err.response?.data?.message ?? "Gagal melakukan top up saldo.";
					return { success: false, message: msg };
				}
			},

			/**
			 * Mengajukan penarikan saldo pengguna ke rekening/bank (`POST /user/withdraw`).
			 *
			 * @param payload - Informasi nominal dan detail tujuan penarikan
			 * @returns Objek status `{ success, message }`
			 */
			withdraw: async (payload) => {
				try {
					const res = await axiosClient.post("/user/withdraw", payload);
					const newBalance = res.data.user?.balance ?? res.data.balance;
					set((state) =>
						state.user
							? { user: { ...state.user, balance: newBalance } }
							: state,
					);
					return {
						success: true,
						message: res.data.message || "Penarikan dana berhasil diproses.",
					};
				} catch (error) {
					const err = error as {
						response?: { data?: { message?: string } };
					};
					const msg =
						err.response?.data?.message ?? "Gagal melakukan penarikan dana.";
					return { success: false, message: msg };
				}
			},

			/**
			 * Memperbarui data pengguna yang sedang aktif di state lokal secara langsung
			 * (berguna setelah mutasi profil, pembaruan avatar, atau pengubahan nama).
			 *
			 * @param payload - Bagian data pengguna yang ingin diperbarui
			 */
			updateCurrentUser: (payload) =>
				set((state) =>
					state.user ? { user: { ...state.user, ...payload } } : state,
				),

			/** Memeriksa apakah role pengguna cocok dengan role tertentu */
			hasRole: (role) => get().user?.role === role,
			/** Memeriksa apakah pengguna ber-role 'artist' */
			isArtist: () => get().user?.role === "artist",
			/** Memeriksa apakah pengguna ber-role 'client' */
			isClient: () => get().user?.role === "client",
			/** Memeriksa apakah pengguna ber-role 'curator' */
			isCurator: () => get().user?.role === "curator",
			/** Memeriksa apakah pengguna ber-role 'admin' */
			isAdmin: () => get().user?.role === "admin",
		}),
		{
			name: "trubrush-user", // key di localStorage
		},
	),
);
