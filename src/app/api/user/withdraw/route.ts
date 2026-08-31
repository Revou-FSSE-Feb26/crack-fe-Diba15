import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const res = await axiosServer.post("/users/withdraw", body);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "POST /api/user/withdraw");
	}
}
