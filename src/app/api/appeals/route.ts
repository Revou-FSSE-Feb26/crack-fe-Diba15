import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");

		const res = await axiosServer.get("/appeals", {
			params: {
				status: status || undefined,
			},
		});
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "GET /api/appeals");
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const res = await axiosServer.post("/appeals", body);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "POST /api/appeals");
	}
}
