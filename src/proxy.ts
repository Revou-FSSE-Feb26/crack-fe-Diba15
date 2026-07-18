// proxy.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Fungsi pembantu untuk decode payload JWT Base64Url secara aman di Edge
function safeDecodeJWT(token: string) {
	try {
		const payloadPart = token.split(".")[1];
		if (!payloadPart) return null;

		// Ubah format JWT Base64Url ke Base64 standar agar atob() tidak error
		const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
		const padded = base64.padEnd(
			base64.length + ((4 - (base64.length % 4)) % 4),
			"=",
		);

		return JSON.parse(atob(padded));
	} catch (e) {
		console.error("Gagal melakukan dekode token di Proxy:", e);
		return null;
	}
}

// Menggunakan nama fungsi `proxy` dan wajib `async` untuk Next.js 16
export async function proxy(request: NextRequest) {
	// Di Next.js 16, cookies.get() bersifat async (mengembalikan Promise)
	const tokenCookie = await request.cookies.get("refresh_token");
	const refreshToken = tokenCookie?.value;
	const pathname = request.nextUrl.pathname;

	let role: string | null = null;
	if (refreshToken) {
		const decoded = safeDecodeJWT(refreshToken);
		if (decoded) {
			role = decoded.role;
		}
	}

	// Otorisasi rute dashboard staff (/dashboard/:path*)
	if (pathname.startsWith("/dashboard")) {
		if (!refreshToken || (role !== "admin" && role !== "curator")) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	// Otorisasi rute posting karya khusus artist (/post-art)
	if (pathname.startsWith("/post-art")) {
		if (!refreshToken || role !== "artist") {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	// Otorisasi rute autentikasi khusus tamu / guest (/login, /register)
	if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
		if (refreshToken) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	return NextResponse.next();
}

// Konfigurasi matcher tetap sama seperti sebelumnya
export const config = {
	matcher: ["/dashboard/:path*", "/post-art", "/login", "/register"],
};
