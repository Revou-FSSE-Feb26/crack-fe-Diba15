import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/apiError";
import { axiosServer } from "@/lib/axiosServer";

export async function GET() {
	try {
		const res = await axiosServer.get("/artworks/tags");
		return NextResponse.json(res.data);
	} catch (error) {
		return handleApiError(error, "GET /api/artwork/tags");
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const res = await axiosServer.post("/artworks/tags", body);
		return NextResponse.json(res.data, { status: 201 });
	} catch (error) {
		return handleApiError(error, "POST /api/artwork/tags");
	}
}
