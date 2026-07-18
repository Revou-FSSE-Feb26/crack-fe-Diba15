import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json();

		// Kirim request login ke backend NestJS
		// Cookie refresh_token otomatis ditangkap dan disimpan ke Next.js oleh interceptor axiosServer
		const res = await axiosServer.post("/auth/login", { email, password });

		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "POST /api/auth/login");
	}
}
