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

// 1. Request Interceptor: Otomatis menyisipkan Bearer token ke setiap request jika ada
axiosClient.interceptors.request.use(
	(config) => {
		if (accessTokenInMemory) {
			config.headers.Authorization = `Bearer ${accessTokenInMemory}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// 2. Response Interceptor: Menangani error 401 secara transparan dengan refresh token
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
