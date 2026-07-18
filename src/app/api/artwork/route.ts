import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const queryString = searchParams.toString();
		const path = queryString ? `/artwork?${queryString}` : "/artwork";

		const res = await axiosServer.get(path);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "GET /api/artwork");
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const res = await axiosServer.post("/artwork", body);
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "POST /api/artwork");
	}
}
