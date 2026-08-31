import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function POST() {
	try {
		// Kirim request refresh ke backend NestJS
		// Interceptor axiosServer otomatis menyisipkan refresh_token dari cookie Next.js
		// dan meng-update cookie Next.js jika ada Set-Cookie baru dari backend
		const res = await axiosServer.post("/auth/refresh");

		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "POST /api/auth/refresh");
	}
}
