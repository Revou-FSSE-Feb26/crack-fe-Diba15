/**
 * @file axiosClient.ts
 * @description
 * Instance Axios untuk sisi client (browser) yang dikonfigurasi khusus untuk berkomunikasi
 * dengan Next.js Route Handlers (`/api`).
 *
 * Tujuan & Fungsi Utama:
 * 1. Base URL Routing:
 *    - Mengarahkan semua request API client-side ke endpoint internal Next.js (`/api/*`),
 *      yang bertindak sebagai Backend-for-Frontend (BFF) / reverse proxy ke backend NestJS / external.
 *
 * 2. Manajemen Akses Token Aman (In-Memory Storage):
 *    - Menyimpan JWT `accessToken` di dalam memori variabel runtime (RAM) alih-alih `localStorage`/`sessionStorage`
 *      untuk memitigasi risiko pencurian token melalui serangan Cross-Site Scripting (XSS).
 *
 * 3. Request Interceptor:
 *    - Secara otomatis menyematkan header `Authorization: Bearer <accessToken>` pada setiap HTTP request keluar
 *      jika token tersedia di memori.
 *
 * 4. Response Interceptor (Silent Token Refresh):
 *    - Menangani respons error HTTP 401 Unauthorized secara otomatis dan transparan.
 *    - Memanggil endpoint refresh token (`/api/auth/refresh`) yang memanfaatkan HTTP-only cookie,
 *      memperbarui token di memori, dan mengulang request asli yang sempat gagal tanpa memutus alur pengguna (UX seamless).
 */

import axios from "axios";

// Access Token disimpan di dalam memori (RAM) untuk keamanan maksimal dari XSS
let accessTokenInMemory: string | null = null;

export const setAccessToken = (token: string | null) => {
	accessTokenInMemory = token;
};

export const getAccessToken = () => accessTokenInMemory;

// Instance Axios khusus client-side yang menembak Route Handlers Next.js (/api)
export const axiosClient = axios.create({
	baseURL: "/api",
});

// Request Interceptor: Otomatis menyisipkan Bearer token ke setiap request jika ada
axiosClient.interceptors.request.use(
	(config) => {
		if (accessTokenInMemory) {
			config.headers.Authorization = `Bearer ${accessTokenInMemory}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response Interceptor: Menangani error 401 secara transparan dengan refresh token
axiosClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Jangan lakukan refresh otomatis untuk request auth spesifik (login, register, logout, refresh)
		const isAuthBypassUrl =
			originalRequest?.url?.includes("/auth/login") ||
			originalRequest?.url?.includes("/auth/register") ||
			originalRequest?.url?.includes("/auth/logout") ||
			originalRequest?.url?.includes("/auth/refresh");

		if (isAuthBypassUrl) {
			return Promise.reject(error);
		}

		// Jika error 401 dan request belum pernah di-retry
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Panggil Route Handler refresh Next.js
				const response = await axios.post("/api/auth/refresh");
				const newAccessToken = response.data.accessToken;

				// Simpan access token baru ke memori
				setAccessToken(newAccessToken);

				// Perbarui header Authorization pada request asli yang gagal
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				// Ulangi request asli yang gagal
				return axiosClient(originalRequest);
			} catch (refreshError) {
				// Bersihkan access token jika refresh gagal (misal guest atau session kadaluarsa)
				setAccessToken(null);
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);
