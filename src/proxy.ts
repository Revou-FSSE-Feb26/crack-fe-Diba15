// proxy.ts
import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface DecodedToken {
  sub: string;
  role: string;
}

export function proxy(request: NextRequest) {
	const tokenCookie = request.cookies.get("refresh_token");
	const refreshToken = tokenCookie?.value;
	const pathname = request.nextUrl.pathname;

	let role: string | null = null;
	if (refreshToken) {
		const decoded = jwtDecode<DecodedToken>(refreshToken);
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
