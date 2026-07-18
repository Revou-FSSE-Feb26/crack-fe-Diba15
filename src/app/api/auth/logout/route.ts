import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function POST() {
	try {
		// Panggil logout di backend NestJS (interceptor akan meneruskan cookie refresh_token otomatis)
		try {
			await axiosServer.post("/auth/logout");
		} catch (e) {
			console.warn("Backend logout failed or offline:", e);
		}

		// Hapus cookie refresh_token di Next.js
		const cookieStore = await cookies();
		cookieStore.set("refresh_token", "", {
			httpOnly: true,
			path: "/",
			maxAge: 0,
		});

		return NextResponse.json({
			success: true,
			message: "Logged out successfully",
		});
	} catch (error) {
		return handleApiError(error, "POST /api/auth/logout");
	}
}
