import axios from "axios";
import { cookies, headers } from "next/headers";

// Instance Axios khusus untuk Server-Side (Route Handlers / Server Components)
// yang mengotomatisasi forwarding Authorization header dan Cookie refresh_token.
export const axiosServer = axios.create({
	baseURL: process.env.NESTJS_API_URL || "http://localhost:3000/api",
	withCredentials: true,
});

// 1. Request Interceptor: Otomatis menyalin Authorization header dan Cookie dari Next.js ke request NestJS
axiosServer.interceptors.request.use(async (config) => {
	try {
		// Ambil headers dari request masuk Next.js, teruskan Authorization
		const reqHeaders = await headers();
		const authHeader = reqHeaders.get("authorization");
		if (authHeader && !config.headers.Authorization) {
			config.headers.Authorization = authHeader;
		}

		// Ambil cookies dari Next.js, teruskan refresh_token
		const cookieStore = await cookies();
		const refreshToken = cookieStore.get("refresh_token")?.value;
		if (refreshToken) {
			config.headers.Cookie = `refresh_token=${refreshToken}`;
		}
	} catch (_err) {
		// Diabaikan jika dipanggil di luar konteks request (misal saat build time static generation)
	}
	return config;
});

// 2. Response Interceptor: Otomatis menangkap Set-Cookie refresh_token dari NestJS dan menyimpannya kembali ke Next.js
axiosServer.interceptors.response.use(
	async (response) => {
		try {
			const setCookieHeader = response.headers["set-cookie"];
			if (setCookieHeader) {
				const cookieStr = Array.isArray(setCookieHeader)
					? setCookieHeader[0]
					: setCookieHeader;
				const match = cookieStr.match(/refresh_token=([^;]+)/);
				if (match) {
					const token = match[1];

					// Set cookie ke Next.js
					const cookieStore = await cookies();
					cookieStore.set("refresh_token", token, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "lax",
						maxAge: 7 * 24 * 60 * 60, // 7 hari
						path: "/",
					});
				}
			}
		} catch (_err) {
			// Diabaikan jika respon didapat pada request GET (di mana Next.js melarang memodifikasi cookies)
		}
		return response;
	},
	(error) => Promise.reject(error),
);
