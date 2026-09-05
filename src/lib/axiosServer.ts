/**
 * @file axiosServer.ts
 * @description
 * Instance Axios khusus untuk Server-Side (Next.js Route Handlers, Server Actions, atau Server Components)
 * yang bertindak sebagai jembatan komunikasi ke backend utama (NestJS API).
 *
 * Tujuan & Fungsi Utama:
 * 1. Gateway ke Backend Utama:
 *    - Mengirim request langsung dari server Next.js ke backend NestJS via `NESTJS_API_URL`
 *      (default: `http://localhost:3001/api`), menyembunyikan endpoint backend asli dari browser publik.
 *
 * 2. Request Interceptor (Header & Cookie Forwarding):
 *    - Otomatis membaca incoming `Authorization` header dari Next.js request dan meneruskannya ke NestJS.
 *    - Otomatis membaca HTTP-only cookie `refresh_token` dari request browser menggunakan `cookies()` Next.js
 *      lalu menyisipkannya ke header `Cookie` request ke NestJS.
 *
 * 3. Response Interceptor (Cookie Synchronization):
 *    - Menangkap header `Set-Cookie` dari respon NestJS (misalnya setelah login, register, atau refresh token).
 *    - Menyimpan kembali `refresh_token` ke dalam HTTP-only cookie Next.js secara aman (`httpOnly: true`,
 *      `secure: production`, `sameSite: "lax"`, masa berlaku 7 hari).
 *
 * 4. Resilient Context Handling:
 *    - Dilengkapi blok `try-catch` agar aman dipanggil di berbagai konteks eksekusi server Next.js
 *      (seperti saat static generation/build time atau request GET di mana modifikasi cookie dibatasi).
 */

import axios from "axios";
import { cookies, headers } from "next/headers";

// Instance Axios khusus untuk Server-Side (Route Handlers / Server Components)
// yang mengotomatisasi forwarding Authorization header dan Cookie refresh_token.
export const axiosServer = axios.create({
	baseURL: process.env.NESTJS_API_URL || "http://localhost:3001/api",
	withCredentials: true,
});

// Request Interceptor: Otomatis menyalin Authorization header dan Cookie dari Next.js ke request NestJS
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

// Response Interceptor: Otomatis menangkap Set-Cookie refresh_token dari NestJS dan menyimpannya kembali ke Next.js
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
