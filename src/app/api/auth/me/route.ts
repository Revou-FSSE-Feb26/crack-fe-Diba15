import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function GET() {
	try {
		// Panggil me di backend NestJS
		// Interceptor axiosServer otomatis menyisipkan Authorization header dari request masuk Next.js
		const res = await axiosServer.get("/auth/me");

		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "GET /api/auth/me");
	}
}
