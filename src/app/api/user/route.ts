import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function GET() {
	try {
		// Interceptor axiosServer otomatis meneruskan Authorization header jika ada
		const res = await axiosServer.get("/user");
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "GET /api/user");
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		// Interceptor axiosServer otomatis meneruskan Authorization header jika ada
		const res = await axiosServer.post("/user", body);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "POST /api/user");
	}
}
